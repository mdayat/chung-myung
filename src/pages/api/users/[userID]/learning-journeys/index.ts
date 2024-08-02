import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import {
  type LearningJourney,
  learningJourneySchema,
} from "@customTypes/learningJourney";
import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import { z as zod } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    SuccessResponse<LearningJourney[] | null> | FailedResponse
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

      res.status(200).json({ status: "success", data });
    } catch (error) {
      console.error(
        new Error(`Error when get learning journeys based on "userID": `, {
          cause: error,
        }),
      );

      res.status(500).json({ status: "failed", message: "Server Error" });
    }
  } else if (req.method === "POST") {
    const parseResult = learningJourneySchema
      .pick({
        userID: true,
        materialID: true,
      })
      .safeParse(req.body);

    // Check if "userID" and "materialID" are valid UUIDs
    if (parseResult.success === false) {
      console.error(
        new Error(`"userID" or "materialID" are not valid UUIDs: `, {
          cause: parseResult.error,
        }),
      );

      res
        .status(404)
        .json({ status: "failed", message: "User or Material Not Found" });
      return;
    }

    // Check if "userID" and "materialID" exist
    let results = [false, false];
    try {
      results = await Promise.all([
        isUserExist(parseResult.data.userID),
        isMaterialExist(parseResult.data.materialID),
      ]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: "Server Error" });
      return;
    }

    if (results[0] === false) {
      console.error(new Error(`User with "userID" is not found`));
      res.status(404).json({ status: "failed", message: "User Not Found" });
      return;
    }

    if (results[1] === false) {
      console.error(new Error(`Material with "materialID" is not found`));
      res.status(404).json({ status: "failed", message: "Material Not Found" });
      return;
    }

    try {
      await supabase
        .from("learning_journey")
        .insert({
          user_id: parseResult.data.userID,
          material_id: parseResult.data.materialID,
        })
        .throwOnError();

      res.status(201).json({ status: "success", data: null });
    } catch (error) {
      console.error(
        new Error(
          `Error when create a learning journey based on "userID" and "materialID": `,
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
