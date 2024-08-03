import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import {
  type DeltaOperation,
  editorSchema,
  type ExplanationEditor,
  type MultipleChoiceEditor,
  type QuestionEditor,
  type TaggedBlob,
  type TaggedDelta,
} from "@customTypes/editor";
import { type Question, questionSchema } from "@customTypes/question";
import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import busboy from "busboy";
import type { NextApiRequest, NextApiResponse } from "next";
import { Blob } from "node:buffer";
import { z as zod } from "zod";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<Question[] | null> | FailedResponse>,
) {
  return new Promise(async (resolve) => {
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
    let results = [false, false];
    try {
      results = await Promise.all([
        isMaterialExist(materialID),
        isLearningMaterialExist(learningMaterialID),
      ]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: "Server Error" });
      return;
    }

    if (results[0] === false) {
      console.error(new Error(`Material with "materialID" is not found`));
      res.status(404).json({ status: "failed", message: "Material Not Found" });
      return;
    }

    if (results[1] === false) {
      console.error(
        new Error(`Learning Material with "learningMaterialID" is not found`),
      );

      res
        .status(404)
        .json({ status: "failed", message: "Learning Material Not Found" });
      return;
    }

    if (req.method === "GET") {
      try {
        const { data } = await supabase
          .from("material_question")
          .select(
            "question(*, multiple_choice!multiple_choice_question_id_fkey(id, content, isCorrect:is_correct))",
          )
          .eq("material_id", materialID)
          .eq("learning_material_id", learningMaterialID)
          .throwOnError();

        const questions: Question[] = new Array(data!.length);
        if (questions.length !== 0) {
          for (let i = 0; i < questions.length; i++) {
            questions[i] = {
              id: data![i].question!.id,
              content: data![i].question!.content,
              explanation: data![i].question!.explanation,
              taxonomyBloom: data![i].question!.taxonomy_bloom,
              multipleChoice: data![i].question!.multiple_choice,
            };
          }
        }

        resolve(res.status(200).json({ status: "success", data: questions }));
      } catch (error) {
        console.error(
          `Error when get questions based on "materialID" and "learningMaterialID": `,
          error,
        );

        resolve(
          res.status(500).json({ status: "failed", message: "Server Error" }),
        );
      }
    } else if (req.method === "POST") {
      const bb = busboy({ headers: req.headers });
      const taggedBlobs: TaggedBlob[] = [];

      const nonFileValueSchema = zod.object({
        taxonomyBloom: questionSchema.shape.taxonomyBloom,
        correctAnswerTag: zod.string(),
        editors: zod.array(editorSchema),
      });
      let nonFileValue: zod.infer<typeof nonFileValueSchema>;

      // Parse buffer streams and create a blob from it
      bb.on("file", (name, file) => {
        const buffers: Buffer[] = [];
        file
          .on("data", (data: Buffer) => {
            buffers.push(data);
          })
          .on("close", () => {
            const combinedBuffer = Buffer.concat(buffers);
            const blob = new Blob([combinedBuffer], { type: "image/png" });
            taggedBlobs.push({ imageTag: name, blob });
          })
          .on("error", (error) => {
            console.error(
              new Error("Failed when parse images: ", { cause: error }),
            );

            req.unpipe(bb);
            resolve(
              res
                .status(500)
                .json({ status: "failed", message: "Server Error" }),
            );
          });
      });

      // Parse and verify the incoming JSON data
      bb.on("field", (_, value) => {
        const result = nonFileValueSchema.safeParse(JSON.parse(value));
        if (result.success) {
          nonFileValue = result.data;
        } else {
          console.error(
            new Error("Invalid non file value schema: ", {
              cause: result.error,
            }),
          );

          req.unpipe(bb);
          resolve(
            res
              .status(400)
              .json({ status: "failed", message: "Invalid JSON Schema" }),
          );
        }
      });

      bb.on("close", async () => {
        if (taggedBlobs.length !== 0) {
          const uploadedImagesPath: string[] = new Array(taggedBlobs.length);
          try {
            // Upload images to supabase storage
            const uploadImageResults = await Promise.all(
              taggedBlobs.map(async (taggedBlob) => {
                const storageBucket = "soal";
                return supabase.storage
                  .from(storageBucket)
                  .upload(taggedBlob.imageTag, taggedBlob.blob as never, {
                    upsert: true,
                  });
              }),
            );

            // Check if there is an error and assign an uploaded image path to "uploadedImagesPath"
            for (let i = 0; i < uploadImageResults.length; i++) {
              const error = uploadImageResults[i].error;
              if (error !== null) {
                throw new Error(
                  "Error when upload an image to supabase sorage: ",
                  { cause: error },
                );
              }

              const imagePath = uploadImageResults[i].data!.path;
              uploadedImagesPath[i] = imagePath;
            }
          } catch (error) {
            console.error(error);

            resolve(
              res
                .status(500)
                .json({ status: "failed", message: "Server Error" }),
            );
            return;
          }

          // Get image public URL along with its tag based on "uploadedImagesPath"
          const uploadedImages = uploadedImagesPath.map((path) => {
            return {
              tag: path,
              URL: supabase.storage.from("soal").getPublicUrl(path).data
                .publicUrl,
            };
          });

          // Replace image tag in delta with image url
          for (let i = 0; i < uploadedImages.length; i++) {
            const uploadedImage = uploadedImages[i];
            if (uploadedImage.tag.includes("question")) {
              const { deltaOperations } = nonFileValue.editors.find(
                (editor) => editor.type === "question",
              ) as QuestionEditor;

              replaceImageTagWithURL(
                uploadedImage.tag,
                uploadedImage.URL,
                deltaOperations,
              );
              continue;
            }

            if (uploadedImage.tag.includes("explanation")) {
              const { deltaOperations } = nonFileValue.editors.find(
                (editor) => editor.type === "explanation",
              ) as ExplanationEditor;

              replaceImageTagWithURL(
                uploadedImage.tag,
                uploadedImage.URL,
                deltaOperations,
              );
              continue;
            }

            if (uploadedImage.tag.includes("answer-choice")) {
              const { taggedDeltas } = nonFileValue.editors.find(
                (editor) => editor.type === "multipleChoice",
              ) as MultipleChoiceEditor;

              const { deltaOperations } = taggedDeltas.find(
                (delta) => delta.tag === uploadedImage.tag.split("_")[1],
              ) as TaggedDelta;

              replaceImageTagWithURL(
                uploadedImage.tag,
                uploadedImage.URL,
                deltaOperations,
              );
              continue;
            }
          }
        }

        // Insert new record for "question" table
        let questionID = "";
        try {
          const { data } = await supabase
            .from("question")
            .insert({
              content: JSON.stringify(
                nonFileValue.editors.find(
                  (editor) => editor.type === "question",
                )!.deltaOperations,
              ),
              explanation: JSON.stringify(
                nonFileValue.editors.find(
                  (editor) => editor.type === "explanation",
                )!.deltaOperations,
              ),
              taxonomy_bloom: nonFileValue.taxonomyBloom,
            })
            .select("id")
            .single()
            .throwOnError();

          questionID = data!.id;
        } catch (error) {
          console.error(`Error when create a question: `, error);

          resolve(
            res.status(500).json({ status: "failed", message: "Server Error" }),
          );
          return;
        }

        // Establish relationship between "material", "learning_material", and "question" table
        // Bulk insert to "multiple_choice" table
        try {
          const results = await Promise.all([
            supabase.from("material_question").insert({
              material_id: materialID,
              learning_material_id: learningMaterialID,
              question_id: questionID,
            }),
            supabase.from("multiple_choice").insert(
              nonFileValue.editors
                .find((editor) => editor.type === "multipleChoice")!
                .taggedDeltas.map(({ tag, deltaOperations }) => {
                  let isCorrect = false;
                  if (tag === nonFileValue.correctAnswerTag) {
                    isCorrect = true;
                  }

                  return {
                    question_id: questionID,
                    content: JSON.stringify(deltaOperations),
                    is_correct: isCorrect,
                  };
                }),
            ),
          ]);

          if (results[0].error !== null) {
            throw new Error(
              `Error when establish relationship between "material", "learning_material", and "question" table: `,
              { cause: results[0].error },
            );
          }

          if (results[1].error !== null) {
            throw new Error(
              `Error when bulk insert to "multiple_choice" table: `,
              { cause: results[1].error },
            );
          }

          resolve(res.status(201).json({ status: "success", data: null }));
        } catch (error) {
          console.error(error);

          resolve(
            res.status(500).json({ status: "failed", message: "Server Error" }),
          );
        }
      });

      bb.on("error", (error) => {
        console.error(
          new Error("Something is wrong with Busboy: ", { cause: error }),
        );

        resolve(
          res
            .status(500)
            .json({ status: "failed", message: "Malformed Request" }),
        );
      });

      req.pipe(bb);
    } else {
      resolve(handleInvalidMethod(res, ["GET", "POST"]));
    }
  });
}

function replaceImageTagWithURL(
  imageTag: string,
  imageURL: string,
  deltaOperations: DeltaOperation[],
): void {
  for (let i = 0; i < deltaOperations.length; i++) {
    const insert = deltaOperations[i].insert;
    const hasImageKey = typeof insert === "object" && "image" in insert;

    if (hasImageKey && imageTag === insert.image) {
      insert.image = imageURL;
    }
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

async function isLearningMaterialExist(
  learningMaterialID: string,
): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("learning_material")
      .select("id")
      .eq("id", learningMaterialID)
      .maybeSingle()
      .throwOnError();

    return data !== null;
  } catch (error) {
    throw new Error(
      `Error when get a learning material based on "learningMaterialID": `,
      { cause: error },
    );
  }
}
