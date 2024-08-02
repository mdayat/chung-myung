import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import { z as zod } from "zod";

const assessmentResponseSchema = zod.object({
  assessedLearningMaterialID: zod.string().uuid(),
  questionID: zod.string().uuid(),
  isCorrect: zod.boolean(),
});
export type AssessmentResponse = zod.infer<typeof assessmentResponseSchema>;

const assessedLearningMaterialSchema = zod.object({
  id: zod.string().uuid(),
  learningMaterialID: zod.string().uuid(),
  assessmentResponses: zod.array(assessmentResponseSchema),
});
export type AssessedLearningMaterial = zod.infer<
  typeof assessedLearningMaterialSchema
>;

const assessmentResultSchema = zod.object({
  id: zod.string().uuid(),
  learningJourneyID: zod.string().uuid(),
  type: zod.union([
    zod.literal("asesmen_kesiapan_belajar"),
    zod.literal("asesmen_akhir"),
  ]),
  attempt: zod.number(),
  createdAt: zod.string().datetime(),
  assessedLearningMaterials: zod.array(assessedLearningMaterialSchema),
});
export type AssessmentResult = zod.infer<typeof assessmentResultSchema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | SuccessResponse<
        Omit<AssessmentResult, "assessedLearningMaterials">[] | null
      >
    | FailedResponse
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
    res.status(400).json({
      status: "failed",
      message: "Invalid User ID and Learning Journey ID",
    });
    return;
  }

  if (req.method === "GET") {
    try {
      const { data } = await supabase
        .from("assessment_result")
        .select(
          "id, learningJourneyID:learning_journey_id, type, attempt, createdAt:created_at",
        )
        .eq("learning_journey_id", learningJourneyID)
        .throwOnError();

      res.status(200).json({ status: "success", data: data! });
    } catch (err) {
      res.status(500).json({ status: "failed", message: "error" });
    }
  } else if (req.method === "POST") {
    const result = assessmentResultSchema
      .omit({ id: true, createdAt: true })
      .safeParse(req.body);
    if (result.success === false) {
      res
        .status(400)
        .json({ status: "failed", message: "Invalid JSON Schema" });
      return;
    }

    const { data } = await supabase
      .from("assessment_result")
      .insert({
        learning_journey_id: result.data.learningJourneyID,
        type: result.data.type,
        attempt: result.data.attempt,
      })
      .select("id")
      .maybeSingle()
      .throwOnError();

    const assessedLearningMaterialPromises = new Array(
      result.data.assessedLearningMaterials.length,
    );
    const assessmentResponsePromises = [];

    for (let i = 0; i < result.data.assessedLearningMaterials.length; i++) {
      const assessedLearningMaterial = result.data.assessedLearningMaterials[i];
      assessedLearningMaterialPromises[i] = supabase
        .from("assessed_learning_material")
        .insert({
          id: assessedLearningMaterial.id,
          assessment_result_id: data!.id,
          learning_material_id: assessedLearningMaterial.learningMaterialID,
        })
        .throwOnError();

      for (
        let j = 0;
        j < assessedLearningMaterial.assessmentResponses.length;
        j++
      ) {
        const assessmentResponse =
          assessedLearningMaterial.assessmentResponses[j];

        assessmentResponsePromises.push(
          supabase
            .from("assessment_response")
            .insert({
              assessed_learning_material_id: assessedLearningMaterial.id,
              question_id: assessmentResponse.questionID,
              is_correct: assessmentResponse.isCorrect,
            })
            .throwOnError(),
        );
      }
    }

    await Promise.all(assessedLearningMaterialPromises);
    await Promise.all(assessmentResponsePromises);

    res.status(201).json({ status: "success", data: null });
  } else {
    handleInvalidMethod(res, ["GET", "POST"]);
  }
}
