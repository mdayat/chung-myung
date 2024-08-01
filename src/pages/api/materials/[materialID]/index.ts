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
        .from("material")
        .select("*")
        .eq("id", materialID)
        .maybeSingle()
        .throwOnError();

      if (data === null) {
        res
          .status(404)
          .json({ status: "failed", message: "Material Not Found" });
        return;
      }

      res.status(200).json({ status: "success", data });
    } catch (error) {
      console.error(
        new Error("Error when get a material based on its ID: ", {
          cause: error,
        }),
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
