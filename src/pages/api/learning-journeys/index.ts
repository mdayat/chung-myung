import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import { type LearningJourney } from "@customTypes/learningJourney";
import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import { z as zod } from "zod";

const USER_ID = "89168051-cd0d-4acf-8ce9-0fca8e3756d2";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | SuccessResponse<LearningJourney[] | { learningJourneyID: string }>
    | FailedResponse
  >,
) {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "GET") {
    try {
      const { data } = await supabase
        .from("learning_journey")
        .select(
          "id, userID:user_id, materialID:material_id, studiedLearningMaterials:studied_learning_material(learningMaterialID:learning_material_id, isStudied:is_studied)",
        )
        .eq("user_id", USER_ID)
        .throwOnError();

      res.status(200).json({ status: "success", data: data! });
    } catch (error) {
      console.error(
        new Error(`Error when get learning journeys based on user id: `, {
          cause: error,
        }),
      );

      res.status(500).json({ status: "failed", message: "Server Error" });
    }
  } else if (req.method === "POST") {
    // Check if "materialID" is a valid UUID
    const parseResult = zod
      .object({
        materialID: zod.string().uuid(),
      })
      .safeParse(req.body);

    if (parseResult.success === false) {
      console.error(
        new Error(`"materialID" is not a valid UUID: `, {
          cause: parseResult.error,
        }),
      );

      res
        .status(400)
        .json({ status: "failed", message: "Invalid JSON Schema" });
      return;
    }

    // Check if "materialID" exists
    try {
      if ((await isMaterialExist(req.body.materialID)) === false) {
        console.error(new Error(`Material with "materialID" is not found`));

        res
          .status(400)
          .json({ status: "failed", message: "Invalid JSON Schema" });
        return;
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: "Server Error" });
      return;
    }

    // Insert new row for "learning_journey" table
    // Get learning materials based on "materialID"
    const subMaterialIDs: string[] = [];
    let learningJourneyID = "";
    try {
      const results = await Promise.all([
        supabase
          .from("learning_journey")
          .insert({ user_id: USER_ID, material_id: req.body.materialID })
          .select("id")
          .single(),
        supabase
          .from("material_learning_material")
          .select("type:learning_material_type, learning_material(id)")
          .eq("material_id", req.body.materialID),
      ]);

      if (results[0].error !== null) {
        throw new Error(`Error when create a learning journey: `, {
          cause: results[0].error,
        });
      }

      if (results[1].error !== null) {
        throw new Error(
          `Error when get learning materials based on "materialID": `,
          { cause: results[1].error },
        );
      }

      learningJourneyID = results[0].data.id;
      for (const learningMaterial of results[1].data) {
        if (learningMaterial.type !== "sub_material") continue;
        subMaterialIDs.push(learningMaterial.learning_material!.id);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: "Server Error" });
      return;
    }

    // Bulk insert for "studied_learning_material" table
    try {
      await supabase
        .from("studied_learning_material")
        .insert(
          subMaterialIDs.map((subMaterialID) => {
            return {
              learning_journey_id: learningJourneyID,
              learning_material_id: subMaterialID,
              is_studied: false,
            };
          }),
        )
        .throwOnError();
      res.status(201).json({ status: "success", data: { learningJourneyID } });
    } catch (error) {
      console.error(
        new Error(
          `Error when establish relationship between "learning_journey" and "learning_material" table: `,
          { cause: error },
        ),
      );
      res.status(500).json({ status: "failed", message: "Server Error" });
    }
  } else {
    handleInvalidMethod(res, ["GET", "POST"]);
  }
}

async function isMaterialExist(materialID: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("material")
      .select("id")
      .eq("id", materialID)
      .maybeSingle()
      .throwOnError();

    return data !== null;
  } catch (error) {
    throw new Error(`Error when get a material based on "materialID": `, {
      cause: error,
    });
  }
}
