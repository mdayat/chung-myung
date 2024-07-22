import { z as zod } from "zod";
import type { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import type { Enums as DBEnums } from "@customTypes/database";

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
  res: NextApiResponse<
    SuccessResponse<LearningMaterial | null> | FailedResponse
  >
) {
  res.setHeader("Content-Type", "application/json");
  const materialID = (req.query.materialID ?? "") as string;
  const learningMaterialID = (req.query.learningMaterialID ?? "") as string;

  if (req.method === "GET") {
    const uuidSchema = zod.object({
      materialID: zod.string().uuid(),
      learningMaterialID: zod.string().uuid(),
    });
    const result = uuidSchema.safeParse({ materialID, learningMaterialID });

    if (result.success === false) {
      res
        .status(404)
        .json({ status: "failed", message: "Learning Material Not Found" });
    } else {
      try {
        const learningMaterial = await getLearningMaterial(
          materialID,
          learningMaterialID
        );

        if (learningMaterial === null) {
          res
            .status(404)
            .json({ status: "failed", message: "Learning Material Not Found" });
        } else {
          res.status(200).json({ status: "success", data: learningMaterial });
        }
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

async function getLearningMaterial(
  materialID: string,
  learningMaterialID: string
): Promise<LearningMaterial | null> {
  try {
    const { data } = await supabase
      .from("material_learning_material")
      .select("type, sequence_number, learning_material(*)")
      .eq("material_id", materialID)
      .eq("learning_material_id", learningMaterialID)
      .maybeSingle()
      .throwOnError();

    if (data === null) {
      return data;
    }

    const learningMaterial: LearningMaterial = {
      id: data.learning_material!.id,
      name: data.learning_material!.name,
      description: data.learning_material!.description,
      learningModuleURL: data.learning_material!.learning_module_url,
      type: data.type,
      sequenceNumber: data.sequence_number,
    };
    return learningMaterial;
  } catch (error) {
    throw new Error(
      "Error when get a learning material based on its id and material id: ",
      { cause: error }
    );
  }
}
