import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import type { Question } from "@customTypes/question";
import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import { z as zod } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<Question> | FailedResponse>,
) {
  res.setHeader("Content-Type", "application/json");

  // Check if "materialID" is a valid UUID
  const materialID = (req.query.materialID ?? "") as string;
  let parseResult = zod.string().uuid().safeParse(materialID);
  if (parseResult.success === false) {
    console.error(
      new Error(`"materialID" is not a valid UUID: `, {
        cause: parseResult.error,
      }),
    );

    res.status(404).json({ status: "failed", message: "Material Not Found" });
    return;
  }

  // Check if "learningMaterialID" is a valid UUID
  const learningMaterialID = (req.query.learningMaterialID ?? "") as string;
  parseResult = zod.string().uuid().safeParse(learningMaterialID);
  if (parseResult.success === false) {
    console.error(
      new Error(`"learningMaterialID" is not a valid UUID: `, {
        cause: parseResult.error,
      }),
    );

    res
      .status(404)
      .json({ status: "failed", message: "Learning Material Not Found" });
    return;
  }

  // Check if "materialID" and "learningMaterialID" exist
  try {
    const results = await Promise.all([
      supabase.from("material").select("id").eq("id", materialID).maybeSingle(),
      supabase
        .from("learning_material")
        .select("id")
        .eq("id", learningMaterialID)
        .maybeSingle(),
    ]);

    if (results[0].error !== null) {
      throw new Error(`Error when get a material based on "materialID": `, {
        cause: results[0].error,
      });
    }

    if (results[1].error !== null) {
      throw new Error(
        `Error when get a learning material based on "learningMaterialID": `,
        { cause: results[1].error },
      );
    }

    if (results[0].data === null) {
      console.error(new Error(`Material with "materialID" is not found`));

      res.status(404).json({ status: "failed", message: "Material Not Found" });
      return;
    }

    if (results[1].data === null) {
      console.error(
        new Error(`Learning Material with "learningMaterialID" is not found`),
      );

      res
        .status(404)
        .json({ status: "failed", message: "Learning Material Not Found" });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server Error" });
    return;
  }

  if (req.method === "GET") {
    // Check if "questionID" is a valid UUID
    const questionID = (req.query.questionID ?? "") as string;
    parseResult = zod.string().uuid().safeParse(questionID);
    if (parseResult.success === false) {
      console.error(
        new Error(`"questionID" is not a valid UUID: `, {
          cause: parseResult.error,
        }),
      );

      res.status(404).json({ status: "failed", message: "Question Not Found" });
      return;
    }

    try {
      const { data } = await supabase
        .from("question")
        .select(
          "id, content, explanation, taxonomyBloom:taxonomy_bloom, multipleChoice:multiple_choice(id, content, isCorrect:is_correct)",
        )
        .eq("id", questionID)
        .maybeSingle()
        .throwOnError();

      if (data === null) {
        console.error(new Error(`Question with "questionID" is not found`));

        res
          .status(404)
          .json({ status: "failed", message: "Question Not Found" });
        return;
      }

      res.status(200).json({ status: "success", data });
    } catch (error) {
      console.error(
        new Error(`Error when get a question based on "questionID": `, {
          cause: error,
        }),
      );

      res.status(500).json({ status: "failed", message: "Server Error" });
    }
  } else {
    handleInvalidMethod(res, ["GET"]);
  }
}
