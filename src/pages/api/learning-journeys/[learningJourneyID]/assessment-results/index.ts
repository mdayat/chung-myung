import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import {
  type AssessmentResult,
  assessmentResultSchema,
} from "@customTypes/assessmentResult";
import { learningMaterialSchema } from "@customTypes/learningMaterial";
import { questionSchema } from "@customTypes/question";
import { supabase } from "@lib/supabase";
import type { PostgrestMaybeSingleResponse } from "@supabase/supabase-js";
import { handleInvalidMethod } from "@utils/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import { z as zod } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    SuccessResponse<AssessmentResult[] | null> | FailedResponse
  >,
) {
  res.setHeader("Content-Type", "application/json");

  // Check if "learningJourneyID" is a valid UUID
  const learningJourneyID = (req.query.learningJourneyID ?? "") as string;
  const parseResult = zod.string().uuid().safeParse(learningJourneyID);
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

  // Check if "learningJourneyID" exists
  try {
    if ((await isLearningJourneyExist(learningJourneyID)) === false) {
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

  if (req.method === "GET") {
    try {
      const { data } = await supabase
        .from("assessment_result")
        .select(
          "id, learningJourneyID:learning_journey_id, type, attempt, score, createdAt:created_at",
        )
        .eq("learning_journey_id", learningJourneyID)
        .throwOnError();

      res.status(200).json({ status: "success", data: data! });
    } catch (error) {
      console.error(
        new Error(
          `Error when get assessment results based on "learningJourneyID": `,
          { cause: error },
        ),
      );

      res.status(500).json({ status: "failed", message: "Server Error" });
    }
  } else if (req.method === "POST") {
    const assessmentResponsesSchema = zod.array(
      zod.object({
        assessedLearningMaterialID: zod.string().uuid(),
        questionID: questionSchema.shape.id,
        isCorrect: zod.boolean(),
      }),
    );

    const parseResult = zod
      .object({
        score: assessmentResultSchema.shape.score,
        type: assessmentResultSchema.shape.type,
        attempt: assessmentResultSchema.shape.attempt,
        assessedLearningMaterials: zod.array(
          zod.object({
            id: zod.string().uuid(),
            learningMaterialID: learningMaterialSchema.shape.id,
            assessmentResponses: assessmentResponsesSchema,
          }),
        ),
      })
      .safeParse(req.body);

    if (parseResult.success === false) {
      console.error(
        new Error("Body payload doesn't match with the schema: ", {
          cause: parseResult.error,
        }),
      );

      res
        .status(400)
        .json({ status: "failed", message: "Invalid JSON Schema" });
      return;
    }

    const learningMaterialPromises = new Array(
      parseResult.data.assessedLearningMaterials.length,
    );
    const questionIDPromises = [];
    const assessmentResponses: zod.infer<typeof assessmentResponsesSchema> = [];

    for (
      let i = 0;
      i < parseResult.data.assessedLearningMaterials.length;
      i++
    ) {
      const assessedLearningMaterial =
        parseResult.data.assessedLearningMaterials[i];

      learningMaterialPromises[i] = supabase
        .from("learning_material")
        .select("id")
        .eq("id", assessedLearningMaterial.learningMaterialID)
        .maybeSingle();

      for (const assessmentResponse of assessedLearningMaterial.assessmentResponses) {
        assessmentResponses.push({ ...assessmentResponse });
        questionIDPromises.push(
          supabase
            .from("question")
            .select("id")
            .eq("id", assessmentResponse.questionID)
            .maybeSingle(),
        );
      }
    }

    // Check if "learningMaterialID" of "assessedLearningMaterial" is exist
    // Check if "questionID" of "assessmentResponse" is exist
    try {
      const results: PostgrestMaybeSingleResponse<{
        id: string;
      } | null>[] = await Promise.all(
        learningMaterialPromises.concat(questionIDPromises),
      );

      for (let i = 0; i < results.length; i++) {
        const { data, error } = results[i];
        if (i < parseResult.data.assessedLearningMaterials.length) {
          if (error !== null) {
            throw new Error(
              `Error when get a learning material based on "learningMaterialID" of "assessedLearningMaterial": `,
              { cause: error },
            );
          }

          if (data === null) {
            console.error(
              new Error(
                `Learning Material with "learningMaterialID" of "assessedLearningMaterial" is not found`,
              ),
            );

            res
              .status(400)
              .json({ status: "failed", message: "Invalid JSON Schema" });
            return;
          }
        } else {
          if (error !== null) {
            throw new Error(
              `Error when get a question based on "questionID" of "assessmentResponse": `,
              { cause: error },
            );
          }

          if (data === null) {
            console.error(
              new Error(
                `Question with "questionID" of "assessmentResponse" is not found`,
              ),
            );

            res
              .status(400)
              .json({ status: "failed", message: "Invalid JSON Schema" });
            return;
          }
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: "Server Error" });
      return;
    }

    let assessmentResultID = "";
    try {
      const { data } = await supabase
        .from("assessment_result")
        .insert({
          learning_journey_id: learningJourneyID,
          type: parseResult.data.type,
          attempt: parseResult.data.attempt,
          score: parseResult.data.score,
        })
        .select("id")
        .single()
        .throwOnError();

      assessmentResultID = data!.id;
    } catch (error) {
      console.error(
        new Error("Error when create an assessment result: ", { cause: error }),
      );

      res.status(500).json({ status: "failed", message: "Server Error" });
      return;
    }

    // Bulk insert for "assessed_learning_material" table
    try {
      await supabase
        .from("assessed_learning_material")
        .insert(
          parseResult.data.assessedLearningMaterials.map(
            (assessedLearningMaterial) => {
              return {
                id: assessedLearningMaterial.id,
                assessment_result_id: assessmentResultID,
                learning_material_id:
                  assessedLearningMaterial.learningMaterialID,
              };
            },
          ),
        )
        .throwOnError();
    } catch (error) {
      console.error(
        new Error(
          `Error when establish relationship between "assessment_result" and "learning_material" table: `,
          { cause: error },
        ),
      );

      res.status(500).json({ status: "failed", message: "Server Error" });
      return;
    }

    // Bulk insert for "assessment_response" table
    try {
      await supabase
        .from("assessment_response")
        .insert(
          assessmentResponses.map((assessmentResponse) => {
            return {
              assessed_learning_material_id:
                assessmentResponse.assessedLearningMaterialID,
              question_id: assessmentResponse.questionID,
              is_correct: assessmentResponse.isCorrect,
            };
          }),
        )
        .throwOnError();
      res.status(201).json({ status: "success", data: null });
    } catch (error) {
      console.error(
        new Error(
          `Error when establish relationship between "assessed_learning_material" and "question" table: `,
          { cause: error },
        ),
      );

      res.status(500).json({ status: "failed", message: "Server Error" });
    }
  } else {
    handleInvalidMethod(res, ["GET", "POST"]);
  }
}

async function isLearningJourneyExist(
  learningJourneyID: string,
): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("learning_journey")
      .select("id")
      .eq("id", learningJourneyID)
      .maybeSingle()
      .throwOnError();

    return data !== null;
  } catch (error) {
    throw new Error(
      `Error when get a learning journey based on "learningJourneyID": `,
      { cause: error },
    );
  }
}
