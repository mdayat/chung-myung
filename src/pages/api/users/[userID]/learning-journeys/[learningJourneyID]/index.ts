import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import { z as zod } from "zod";

interface LearningJourney {
  id: string;
  userID: string;
  materialID: string;
  studiedLearningMaterials: {
    learningJourneyID: string;
    learningMaterialID: string;
    isStudied: boolean;
  }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    SuccessResponse<LearningJourney | null> | FailedResponse
  >,
) {
  res.setHeader("Content-Type", "application/json");
  const userID = (req.query.learningJourneyID ?? "") as string;
  const learningJourneyID = (req.query.learningJourneyID ?? "") as string;

  const uuidSchema = zod.object({
    userID: zod.string().uuid(),
    learningJourneyID: zod.string().uuid(),
  });
  const result = uuidSchema.safeParse({ userID, learningJourneyID });
  if (result.success === false) {
    console.error(
      new Error("Invalid User ID and Learning Journey ID: ", {
        cause: result.error,
      }),
    );

    res.status(400).json({
      status: "failed",
      message: "Invalid User ID and Learning Journey ID",
    });
    return;
  }

  if (req.method === "GET") {
    try {
      const { data } = await supabase
        .from("learning_journey")
        .select(
          "id, userID:user_id, materialID:material_id, studiedLearningMaterials:studied_learning_material(learningJourneyID:learning_journey_id, learningMaterialID:learning_material_id, isStudied:is_studied)",
        )
        .eq("id", learningJourneyID)
        .maybeSingle()
        .throwOnError();

      if (data === null) {
        res.status(200).json({ status: "success", data: null });
        return;
      }

      res.status(200).json({ status: "success", data });
    } catch (error) {
      console.error(
        new Error("Error when get a learning journey based on its ID: ", {
          cause: error,
        }),
      );

      res.status(500).json({ status: "failed", message: "Server Error" });
    }
  } else {
    handleInvalidMethod(res, ["GET"]);
  }
}
