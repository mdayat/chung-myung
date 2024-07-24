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
    res.status(404).json({
      status: "failed",
      message: "Question Not Found",
    });
    return;
  }

  if (req.method === "GET") {
    try {
      const { data } = await supabase
        .from("question")
        .select(
          "*, multiple_choice!multiple_choice_question_id_fkey(id, content, is_correct_answer)",
        )
        .eq("id", questionID)
        .maybeSingle()
        .throwOnError();

      let question: Question | null = null;
      if (data !== null) {
        question = {
          id: data.id,
          content: data.content,
          explanation: data.explanation,
          taxonomyBloom: data.taxonomy_bloom,
          multipleChoice: data.multiple_choice.map(
            ({ id, content, is_correct_answer }) => ({
              id,
              content,
              isCorrectAnswer: is_correct_answer,
            }),
          ),
        };
      }

      res.status(200).json({ status: "success", data: question });
    } catch (error) {
      res.status(500).json({ status: "failed", message: "Server Error" });
      console.log("Error when get a question: ", error);
    }
  } else {
    handleInvalidMethod(res, ["GET"]);
  }
}
