import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import { z as zod } from "zod";

interface Question {
  id: string;
  content: string;
  explanation: string;
  taxonomyBloom: string;
  multipleChoice: { id: string; content: string; isCorrectAnswer: boolean }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<Question | null> | FailedResponse>,
) {
  res.setHeader("Content-Type", "application/json");
  const questionID = (req.query.questionID ?? "") as string;

  const uuidSchema = zod.string().uuid();
  const result = uuidSchema.safeParse(questionID);
  if (result.success === false) {
    console.error(new Error("Invalid Question ID: ", { cause: result.error }));

    res.status(400).json({
      status: "failed",
      message: "Invalid Question ID",
    });
    return;
  }

  if (req.method === "GET") {
    try {
      const { data } = await supabase
        .from("question")
        .select(
          "id, content, explanation, taxonomyBloom:taxonomy_bloom, multipleChoice:multiple_choice(id, content, isCorrectAnswer:is_correct_answer)",
        )
        .eq("id", questionID)
        .maybeSingle()
        .throwOnError();

      if (data === null) {
        res
          .status(404)
          .json({ status: "failed", message: "Question Not Found" });
        return;
      }

      res.status(200).json({ status: "success", data });
    } catch (error) {
      console.error(
        new Error("Error when get a question based on its ID: ", {
          cause: error,
        }),
      );

      res.status(500).json({ status: "failed", message: "Server Error" });
    }
  } else {
    handleInvalidMethod(res, ["GET"]);
  }
}
