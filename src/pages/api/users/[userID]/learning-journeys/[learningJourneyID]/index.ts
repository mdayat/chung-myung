import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import type { LearningJourney } from "@customTypes/learningJourney";
import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import { z as zod } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    SuccessResponse<LearningJourney | null> | FailedResponse
  >,
) {
  res.setHeader("Content-Type", "application/json");

  // Check if "userID" is a valid UUID
  const userID = (req.query.userID ?? "") as string;
  let parseResult = zod.string().uuid().safeParse(userID);
  if (parseResult.success === false) {
    console.error(
      new Error(`"userID" is not a valid UUID: `, { cause: parseResult.error }),
    );

    res.status(404).json({ status: "failed", message: "User Not Found" });
    return;
  }

  // Check if "userID" exists
  try {
    if ((await isUserExist(userID)) === false) {
      console.error(new Error(`User with "userID" is not found`));
      res.status(404).json({ status: "failed", message: "User Not Found" });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
    return;
  }

  if (req.method === "GET") {
    // Check if "learningJourneyID" is a valid UUID
    const learningJourneyID = (req.query.learningJourneyID ?? "") as string;
    parseResult = zod.string().uuid().safeParse(learningJourneyID);
    if (parseResult.success === false) {
      console.error(
        new Error(`"learningJourneyID" is not a valid UUID: `, {
          cause: parseResult.error,
        }),
      );

      res
        .status(404)
        .json({ status: "failed", message: "Learning Journey Not Found" });
      return;
    }

    try {
      const { data } = await supabase
        .from("learning_journey")
        .select(
          "id, userID:user_id, materialID:material_id, studiedLearningMaterials:studied_learning_material(learningMaterialID:learning_material_id, isStudied:is_studied)",
        )
        .eq("id", learningJourneyID)
        .maybeSingle()
        .throwOnError();

      if (data === null) {
        console.error(
          new Error(`Learning Journey with "learningJourneyID" is not found`),
        );

        res
          .status(404)
          .json({ status: "failed", message: "Learning Journey Not Found" });
        return;
      }

      res.status(200).json({ status: "success", data });
    } catch (error) {
      console.error(
        new Error(
          `Error when get a learning journey based on "learningJourneyID": `,
          { cause: error },
        ),
      );

      res.status(500).json({ status: "failed", message: "Server Error" });
    }
  } else {
    handleInvalidMethod(res, ["GET"]);
  }
}

async function isUserExist(userID: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("user")
      .select("id")
      .eq("id", userID)
      .maybeSingle()
      .throwOnError();

    return data !== null;
  } catch (error) {
    throw new Error(`Error when get a user based on "userID": `, {
      cause: error,
    });
  }
}
