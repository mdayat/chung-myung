import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import { z as zod } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | FailedResponse>,
) {
  res.setHeader("Content-Type", "application/json");
  const userID = (req.query.learningJourneyID ?? "") as string;
  const learningJourneyID = (req.query.learningJourneyID ?? "") as string;
  const assessmentResultID = (req.query.assessmentResultID ?? "") as string;

  const uuidSchema = zod.object({
    userID: zod.string().uuid(),
    learningJourneyID: zod.string().uuid(),
    assessmentResultID: zod.string().uuid(),
  });

  const result = uuidSchema.safeParse({
    userID,
    learningJourneyID,
    assessmentResultID,
  });
  if (result.success === false) {
    res.status(400).json({
      message: "Invalid User ID and Learning Journey ID",
      status: "failed",
    });
    console.error("Invalid User ID and Learning Journey ID: ", result.error);
    return;
  }

  if (req.method === "DELETE") {
    try {
      await supabase
        .from("assessment_result")
        .delete()
        .eq("id", assessmentResultID)
        .throwOnError();

      res.status(200).json({ status: "success", data: null });
    } catch (err) {
      res.status(500).json({ status: "failed", message: "error" });
    }
  } else {
    handleInvalidMethod(res, ["DELETE"]);
  }
}
