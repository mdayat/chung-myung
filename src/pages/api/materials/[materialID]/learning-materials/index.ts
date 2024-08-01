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

  const uuidSchema = zod.string().uuid();
  const result = uuidSchema.safeParse(materialID);
  if (result.success === false) {
    console.error(new Error("Invalid Material ID: ", { cause: result.error }));
    res.status(400).json({ status: "failed", message: "Invalid Material ID" });
    return;
  }

  if (req.method === "GET") {
    try {
      const { data } = await supabase
        .from("material_learning_material")
        .select(
          "type:learning_material_type, sequenceNumber:learning_material_number, learning_material(id, name, description, learningModuleURL:learning_module_url)",
        )
        .eq("material_id", materialID)
        .throwOnError();

      res.status(200).json({
        status: "success",
        data: data!.map((learningMaterial) => ({
          ...learningMaterial.learning_material!,
          type: learningMaterial.type,
          sequenceNumber: learningMaterial.sequenceNumber,
        })),
      });
    } catch (error) {
      console.error(
        new Error(
          "Invalid when get all learning material based on material ID: ",
          { cause: error },
        ),
      );

      res.status(500).json({
        status: "failed",
        message: "Server Error",
      });
    }
  } else {
    handleInvalidMethod(res, ["GET"]);
  }
}
