import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import type { LearningMaterial } from "@customTypes/learningMaterial";
import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import { z as zod } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<LearningMaterial[]> | FailedResponse>,
) {
  res.setHeader("Content-Type", "application/json");

  // Check if "materialID" is a valid UUID
  const materialID = (req.query.materialID ?? "") as string;
  const parseResult = zod.string().uuid().safeParse(materialID);
  if (parseResult.success === false) {
    console.error(
      new Error(`"materialID" is not a valid UUID: `, {
        cause: parseResult.error,
      }),
    );

    res.status(404).json({ status: "failed", message: "Material Not Found" });
    return;
  }

  // Check if "materialID" exists
  try {
    if ((await isMaterialExist(materialID)) === false) {
      console.error(new Error(`Material with "materialID" is not found`));
      res.status(404).json({ status: "failed", message: "Material Not Found" });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
    return;
  }

  if (req.method === "GET") {
    try {
      const { data } = await supabase
        .from("material_learning_material")
        .select(
          "type:learning_material_type, number:learning_material_number, learning_material(id, name, description, learningModuleURL:learning_module_url)",
        )
        .eq("material_id", materialID)
        .throwOnError();

      res.status(200).json({
        status: "success",
        data: data!.map((learningMaterial) => ({
          ...learningMaterial.learning_material!,
          type: learningMaterial.type,
          number: learningMaterial.number,
        })),
      });
    } catch (error) {
      console.error(
        new Error(`Error when get learning materials based on "materialID": `, {
          cause: error,
        }),
      );

      res.status(500).json({ status: "failed", message: "Server Error" });
    }
  } else {
    handleInvalidMethod(res, ["GET"]);
  }
}

async function isMaterialExist(materialID: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("material")
      .select("id")
      .eq("id", materialID)
      .maybeSingle()
      .throwOnError();

    return data !== null;
  } catch (error) {
    throw new Error(`Error when get a material based on "materialID": `, {
      cause: error,
    });
  }
}
