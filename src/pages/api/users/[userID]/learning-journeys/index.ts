import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import { type LearningJourney } from "@customTypes/learningJourney";
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
    // Check if "materialID" is a valid UUID
    parseResult = zod.string().uuid().safeParse(req.body.materialID);
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

    try {
      await supabase
        .from("learning_journey")
        .insert({ user_id: userID, material_id: req.body.materialID })
        .throwOnError();

      res.status(201).json({ status: "success", data: null });
    } catch (error) {
      console.error(
        new Error(`Error when create a learning journey: `, { cause: error }),
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
