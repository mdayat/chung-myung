import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import { type LearningJourney } from "@customTypes/learningJourney";
import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import { z as zod } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | SuccessResponse<LearningJourney[] | { learningJourneyID: string }>
    | FailedResponse
  >,
) {
  res.setHeader("Content-Type", "application/json");

  // Check if "userID" is a valid UUID
  const userID = (req.query.userID ?? "") as string;
  const parseResult = zod.string().uuid().safeParse(userID);
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
    try {
      const { data } = await supabase
        .from("learning_journey")
        .select(
          "id, userID:user_id, materialID:material_id, studiedLearningMaterials:studied_learning_material(learningMaterialID:learning_material_id, isStudied:is_studied)",
        )
        .eq("user_id", userID)
        .throwOnError();

      res.status(200).json({ status: "success", data: data! });
    } catch (error) {
      console.error(
        new Error(`Error when get learning journeys based on "userID": `, {
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
          .insert({ user_id: userID, material_id: req.body.materialID })
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
