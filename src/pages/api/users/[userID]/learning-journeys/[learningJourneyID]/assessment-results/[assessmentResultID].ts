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

  // Check if "userID" and "learningJourneyID" exist
  try {
    const results = await Promise.all([
      supabase.from("user").select("id").eq("id", userID).maybeSingle(),
      supabase
        .from("learning_journey")
        .select("id")
        .eq("id", learningJourneyID)
        .maybeSingle(),
    ]);

    if (results[0].error !== null) {
      throw new Error(`Error when get a user based on "userID": `, {
        cause: results[0].error,
      });
    }

    if (results[1].error !== null) {
      throw new Error(
        `Error when get a learning journey based on "learningJourneyID": `,
        { cause: results[1].error },
      );
    }

    if (results[0].data === null) {
      console.error(new Error(`User with "userID" is not found`));
      res.status(404).json({ status: "failed", message: "User Not Found" });
      return;
    }

    if (results[1].data === null) {
      console.error(
        new Error(`Learning Journey with "learningJourneyID" is not found`),
      );

      res
        .status(404)
        .json({ status: "failed", message: "Learning Journey Not Found" });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
    return;
  }

  if (req.method === "DELETE") {
    // Check if "assessmentResultID" is a valid UUID
    const assessmentResultID = (req.query.assessmentResultID ?? "") as string;
    parseResult = zod.string().uuid().safeParse(assessmentResultID);
    if (parseResult.success === false) {
      console.error(
        new Error(`"assessmentResultID" is not a valid UUID: `, {
          cause: parseResult.error,
        }),
      );

      res
        .status(404)
        .json({ status: "failed", message: "Assessment Result Not Found" });
      return;
    }

    try {
      const { data } = await supabase
        .from("assessment_result")
        .delete()
        .eq("id", assessmentResultID)
        .select("id")
        .maybeSingle()
        .throwOnError();

      if (data === null) {
        console.error(
          new Error(`Assessment Result with "assessmentResultID" is not found`),
        );

        res
          .status(404)
          .json({ status: "failed", message: "Assessment Result Not Found" });
        return;
      }

      res.status(200).json({ status: "success", data: null });
    } catch (error) {
      console.error(
        new Error(
          `Error when delete an assessment result based on "assessmentResultID"`,
          { cause: error },
        ),
      );

      res.status(500).json({ status: "failed", message: "Server Error" });
    }
  } else {
    handleInvalidMethod(res, ["DELETE"]);
  }
}
