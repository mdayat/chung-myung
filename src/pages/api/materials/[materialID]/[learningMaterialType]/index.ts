import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import type { Enums as DBEnums } from "@customTypes/database";
import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import { z as zod } from "zod";

interface LearningMaterial {
  id: string;
  name: string;
  description: string;
  learningModuleURL: string;
  type: DBEnums<"learning_material_type">;
  sequenceNumber: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<LearningMaterial[]> | FailedResponse>,
) {
  res.setHeader("Content-Type", "application/json");
  const materialID = (req.query.materialID ?? "") as string;
  const learningMaterialType = (req.query.learningMaterialType ?? "") as string;

  if (req.method === "GET") {
    const uuidSchema = zod.string().uuid();
    const result = uuidSchema.safeParse(materialID);

    if (result.success === false) {
      res.status(200).json({ status: "success", data: [] });
    } else {
      try {
        const learningMaterials = await getLearningMaterials(
          materialID,
          learningMaterialType,
        );
        res.status(200).json({ status: "success", data: learningMaterials });
      } catch (error) {
        // Log the error properly
        console.error(error);

        res.status(500).json({
          status: "failed",
          message: "Server Error",
        });
      }
    }
  } else {
    handleInvalidMethod(res, ["GET"]);
  }
}

async function getLearningMaterials(
  materialID: string,
  learningMaterialType: string,
): Promise<LearningMaterial[]> {
  try {
    const { data } = await supabase
      .from("material_learning_material")
      .select("type, sequence_number, learning_material(*)")
      .eq("material_id", materialID)
      .eq(
        "type",
        learningMaterialType
          .substring(0, learningMaterialType.length - 1)
          .split("-")
          .join("_"),
      )
      .throwOnError();

    const learningMaterials: LearningMaterial[] = new Array(data!.length);
    if (data!.length === 0) {
      return learningMaterials;
    }

    for (let i = 0; i < data!.length; i++) {
      learningMaterials[i] = {
        id: data![i].learning_material!.id,
        name: data![i].learning_material!.name,
        description: data![i].learning_material!.description,
        learningModuleURL: data![i].learning_material!.learning_module_url,
        type: data![i].type,
        sequenceNumber: data![i].sequence_number,
      };
    }
    return learningMaterials;
  } catch (error) {
    throw new Error(
      "Error when get all learning material based on its type and material id: ",
      { cause: error },
    );
  }
}
