import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import type { Material } from "@customTypes/material";
import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import { z as zod } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    SuccessResponse<Omit<Material, "number"> | null> | FailedResponse
  >,
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

  if (req.method === "GET") {
    try {
      const { data } = await supabase
        .from("material")
        .select("*")
        .eq("id", materialID)
        .maybeSingle()
        .throwOnError();

      if (data === null) {
        console.error(new Error(`Material with "materialID" is not found`));

        res
          .status(404)
          .json({ status: "failed", message: "Material Not Found" });
        return;
      }

      res.status(200).json({ status: "success", data });
    } catch (error) {
      console.error(
        new Error(`Error when get a material based on "materialID": `, {
          cause: error,
        }),
      );

      res.status(500).json({ status: "failed", message: "Server Error" });
    }
  } else {
    handleInvalidMethod(res, ["GET"]);
  }
}
