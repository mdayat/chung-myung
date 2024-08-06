import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import type { LearningJourney } from "@customTypes/learningJourney";
import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import { z as zod } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    SuccessResponse<LearningJourney | null> | FailedResponse
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

  if (req.method === "GET") {
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

    try {
      const { data } = await supabase
        .from("learning_journey")
        .select(
          "id, userID:user_id, materialID:material_id, studiedLearningMaterials:studied_learning_material(learningMaterialID:learning_material_id, isStudied:is_studied)",
        )
        .eq("id", learningJourneyID)
        .maybeSingle()
        .throwOnError();

      if (data === null) {
        console.error(
          new Error(`Learning Journey with "learningJourneyID" is not found`),
        );

        res
          .status(404)
          .json({ status: "failed", message: "Learning Journey Not Found" });
        return;
      }

      res.status(200).json({ status: "success", data });
    } catch (error) {
      console.error(
        new Error(
          `Error when get a learning journey based on "learningJourneyID": `,
          { cause: error },
        ),
      );

      res.status(500).json({ status: "failed", message: "Server Error" });
    }
  } else if (req.method === "POST") {
    const parseResult = zod
      .object({
        prerequisiteIDs: zod.array(zod.string().uuid()),
      })
      .safeParse(req.body);

    if (parseResult.success === false) {
      console.error(
        new Error(`"prerequisiteIDs" are invalid UUIDs: `, {
          cause: parseResult.error,
        }),
      );

      res
        .status(400)
        .json({ status: "failed", message: "Invalid JSON Schema" });
      return;
    }

    // Check if "userID", "learningJourneyID", and "prerequisiteIDs" exist
    try {
      const results = await Promise.all([
        supabase.from("user").select("id").eq("id", userID).maybeSingle(),
        supabase
          .from("learning_journey")
          .select("id")
          .eq("id", learningJourneyID)
          .maybeSingle(),
        supabase
          .from("learning_material")
          .select("id")
          .in("id", parseResult.data.prerequisiteIDs),
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

      if (results[2].error !== null) {
        throw new Error(
          `Error when get learning materials based on "prerequisiteIDs": `,
          { cause: results[2].error },
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

      if (
        results[2].data === null ||
        results[2].data.length < parseResult.data.prerequisiteIDs.length
      ) {
        console.error(
          new Error(`Learning Materials with "prerequisiteIDs" are not found`),
        );

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
      await supabase.from("studied_learning_material").insert(
        parseResult.data.prerequisiteIDs.map((prerequisiteID) => {
          return {
            learning_journey_id: learningJourneyID,
            learning_material_id: prerequisiteID,
            is_studied: false,
          };
        }),
      );

      res.status(201).json({ status: "success", data: null });
    } catch (error) {
      console.error(
        new Error(
          `Error when establish relationship between "learning_journey" and "learning_material" table: `,
          { cause: error },
        ),
      );

      res.status(500).json({ status: "failed", message: "Server Error" });
    }
  } else if (req.method === "PUT") {
    const studiedLearningMaterialSchema = zod.object({
      learningMaterialID: zod.string().uuid(),
      isStudied: zod.boolean(),
    });

    const parseResult = studiedLearningMaterialSchema.safeParse(req.body);
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

    // Check if "userID", "learningJourneyID", and "learningMaterialID" exist
    try {
      const results = await Promise.all([
        supabase.from("user").select("id").eq("id", userID).maybeSingle(),
        supabase
          .from("learning_journey")
          .select("id")
          .eq("id", learningJourneyID)
          .maybeSingle(),
        supabase
          .from("learning_material")
          .select("id")
          .eq("id", parseResult.data.learningMaterialID),
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

      if (results[2].error !== null) {
        throw new Error(
          `Error when get a learning material based on "learningMaterialID": `,
          { cause: results[2].error },
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

      if (results[2].data === null) {
        console.error(
          new Error(`Learning Material with "learningMaterialID" is not found`),
        );

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
      const { data } = await supabase
        .from("studied_learning_material")
        .update({ is_studied: parseResult.data.isStudied })
        .eq("learning_journey_id", learningJourneyID)
        .eq("learning_material_id", parseResult.data.learningMaterialID)
        .select("learning_material_id")
        .maybeSingle()
        .throwOnError();

      if (data === null) {
        console.error(
          new Error(
            `Studied Learning Material with "learningMaterialID" is not found`,
          ),
        );

        res
          .status(400)
          .json({ status: "failed", message: "Invalid JSON Schema" });
        return;
      }

      res.status(200).json({ status: "success", data: null });
    } catch (error) {
      console.error(
        new Error(
          `Error when update "studied_learning_material" based on "learningJourneyID" and "learningMaterialID": `,
          { cause: error },
        ),
      );

      res.status(500).json({ status: "failed", message: "Server Error" });
    }
  } else {
    handleInvalidMethod(res, ["GET", "POST", "PUT"]);
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
