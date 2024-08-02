import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import type { Material } from "@customTypes/material";
import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    SuccessResponse<Omit<Material, "number">[]> | FailedResponse
  >,
) {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "GET") {
    try {
      const { data } = await supabase
        .from("material")
        .select("*")
        .throwOnError();

      res.status(200).json({
        status: "success",
        data: data!,
      });
    } catch (error) {
      console.error(new Error("Error when get materials: ", { cause: error }));
      res.status(500).json({ status: "failed", message: "Server Error" });
    }
  } else {
    handleInvalidMethod(res, ["GET"]);
  }
}
