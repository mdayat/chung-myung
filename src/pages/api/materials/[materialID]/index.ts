import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import { z as zod } from "zod";

interface Material {
  id: string;
  name: string;
  description: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<Material | null> | FailedResponse>,
) {
  res.setHeader("Content-Type", "application/json");
  const materialID = (req.query.materialID ?? "") as string;

  if (req.method === "GET") {
    const uuidSchema = zod.string().uuid();
    const result = uuidSchema.safeParse(materialID);

    if (result.success === false) {
      res.status(404).json({ status: "failed", message: "Material Not Found" });
    } else {
      try {
        const material = await getMaterial(materialID);
        if (material === null) {
          res
            .status(404)
            .json({ status: "failed", message: "Material Not Found" });
        } else {
          res.status(200).json({ status: "success", data: material });
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

async function getMaterial(materialID: string): Promise<Material | null> {
  try {
    const { data } = await supabase
      .from("material")
      .select("*")
      .eq("id", materialID)
      .maybeSingle()
      .throwOnError();
    return data;
  } catch (error) {
    throw new Error("Error when get a material: ", { cause: error });
  }
}
