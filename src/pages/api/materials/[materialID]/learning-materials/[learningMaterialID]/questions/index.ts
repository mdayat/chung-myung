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
import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import busboy from "busboy";
import type { NextApiRequest, NextApiResponse } from "next";
import { Blob } from "node:buffer";
import { z as zod } from "zod";

interface Question {
  id: string;
  content: string;
  explanation: string;
  taxonomyBloom: string;
  multipleChoice: { id: string; content: string; isCorrectAnswer: boolean }[];
}

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
    const materialID = (req.query.materialID ?? "") as string;
    const learningMaterialID = (req.query.learningMaterialID ?? "") as string;

    const uuidSchema = zod.object({
      materialID: zod.string().uuid(),
      learningMaterialID: zod.string().uuid(),
    });

    // Check if "materialID" and "learningMaterialID" is not a uuid
    const result = uuidSchema.safeParse({ materialID, learningMaterialID });
    if (result.success === false) {
      console.error(
        new Error("Invalid Material ID or Learning Material ID: ", {
          cause: result.error,
        }),
      );

      resolve(
        res.status(400).json({
          status: "failed",
          message: "Invalid Material ID or Learning Material ID",
        }),
      );
      return;
    }

    if (req.method === "GET") {
      try {
        const { data } = await supabase
          .from("material_question")
          .select(
            "question(*, multiple_choice!multiple_choice_question_id_fkey(id, content, is_correct_answer))",
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
              multipleChoice: data![i].question!.multiple_choice.map(
                ({ id, content, is_correct_answer }) => ({
                  id,
                  content,
                  isCorrectAnswer: is_correct_answer,
                }),
              ),
            };
          }
        }

        resolve(res.status(200).json({ status: "success", data: questions }));
      } catch (error) {
        console.error(
          "Error when get all question based on a learning material ID: ",
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
        taxonomyBloom: zod.string(),
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

      // Create a new record in a database and upload its images if it's needed
      bb.on("close", async () => {
        try {
          // Check if the current request has images to be uploaded or not
          if (taggedBlobs.length !== 0) {
            // Upload images to storage and return its path
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

            // Get image public URL along with its tag
            const uploadedImages = uploadImageResults.map(({ data, error }) => {
              if (error !== null) {
                throw error;
              }

              return {
                tag: data.path,
                URL: supabase.storage.from("soal").getPublicUrl(data.path).data
                  .publicUrl,
              };
            });

            // Replace image tag in delta ops with image url
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
          const questionID = await createQuestion(
            nonFileValue.taxonomyBloom,
            JSON.stringify(
              nonFileValue.editors.find((editor) => editor.type === "question")!
                .deltaOperations,
            ),
            JSON.stringify(
              nonFileValue.editors.find(
                (editor) => editor.type === "explanation",
              )!.deltaOperations,
            ),
          );

          // Insert new records for "learning_material_question" and "multiple_choice" table
          await Promise.all([
            supabase
              .from("material_question")
              .insert({
                material_id: materialID,
                learning_material_id: learningMaterialID,
                question_id: questionID,
              })
              .throwOnError(),
            supabase
              .from("multiple_choice")
              .insert(
                nonFileValue.editors
                  .find((editor) => editor.type === "multipleChoice")!
                  .taggedDeltas.map(({ tag, deltaOperations }) => {
                    let isCorrectAnswer = false;
                    if (tag === nonFileValue.correctAnswerTag) {
                      isCorrectAnswer = true;
                    }

                    return {
                      question_id: questionID,
                      content: JSON.stringify(deltaOperations),
                      is_correct_answer: isCorrectAnswer,
                    };
                  }),
              )
              .throwOnError(),
          ]);

          resolve(res.status(201).json({ status: "success", data: null }));
        } catch (error) {
          console.error(
            "Error when create question or upload question images: ",
            error,
          );

          resolve(
            res.status(500).json({ status: "failed", message: "Server Error" }),
          );
        }
      });

      bb.on("error", (error) => {
        console.error(
          new Error("Something is wrong wth Busboy: ", { cause: error }),
        );

        resolve(
          res.status(400).json({
            status: "failed",
            message: "Malformed Request",
          }),
        );
      });

      req.pipe(bb);
    } else {
      resolve(handleInvalidMethod(res, ["GET", "POST"]));
    }
  });
}

async function createQuestion(
  taxonomyBloom: string,
  contentDeltaOps: string,
  explanationDeltaOps: string,
) {
  try {
    const { data } = await supabase
      .from("question")
      .insert({
        content: contentDeltaOps,
        explanation: explanationDeltaOps,
        taxonomy_bloom: taxonomyBloom,
      })
      .select("id")
      .single()
      .throwOnError();
    return data!.id;
  } catch (error) {
    throw new Error("Error when creating a question: ", { cause: error });
  }
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
