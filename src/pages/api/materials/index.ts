import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";

interface Material {
  id: string;
  name: string;
  description: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<Material[]> | FailedResponse>,
) {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "GET") {
    try {
      const materials = await getMaterials();
      res.status(200).json({
        status: "success",
        data: materials,
      });
    } catch (error) {
      // Log the error properly
      console.error(error);

      res.status(500).json({
        status: "failed",
        message: "Server Error",
      });
    }
  } else {
    handleInvalidMethod(res, ["GET"]);
  }
}

async function getMaterials(): Promise<Material[]> {
  try {
    const { data } = await supabase.from("material").select("*").throwOnError();
    return data!;
  } catch (error) {
    throw new Error("Error when get all materials: ", { cause: error });
  }
}
