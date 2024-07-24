import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import {
  type DeltaOps,
  editorSchema,
  type ExplanationEditor,
  type MultipleChoiceEditor,
  type QuestionEditor,
  type TaggedBlob,
  type TaggedDelta,
} from "@customTypes/question";
import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import busboy from "busboy";
import type { NextApiRequest, NextApiResponse } from "next";
import { Blob } from "node:buffer";
import { v4 as uuidv4 } from "uuid";
import { z as zod } from "zod";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | FailedResponse>,
) {
  res.setHeader("Content-Type", "application/json");
  const materialID = (req.query.materialID ?? "") as string;
  const learningMaterialID = (req.query.learningMaterialID ?? "") as string;

  if (req.method === "GET") {
    res.status(200).json({ status: "success", data: null });
  } else if (req.method === "POST") {
    const uuidSchema = zod.object({
      materialID: zod.string().uuid(),
      learningMaterialID: zod.string().uuid(),
    });

    // Check if "materialID" and "learningMaterialID" is not a uuid
    const result = uuidSchema.safeParse({ materialID, learningMaterialID });
    if (result.success === false) {
      res.status(404).json({
        status: "failed",
        message: "Material or Learning Material Not Found",
      });
      return;
    }

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
          req.unpipe(bb);
          res.status(500).json({ status: "failed", message: "Server Error" });
          console.log(
            new Error("Failed when parse images: ", { cause: error }),
          );
        });
    });

    // Parse and verify the incoming JSON data
    bb.on("field", (_, value) => {
      const result = nonFileValueSchema.safeParse(JSON.parse(value));
      if (result.success) {
        nonFileValue = result.data;
      } else {
        req.unpipe(bb);
        res
          .status(400)
          .json({ status: "failed", message: "Invalid JSON Schema" });
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
              const { deltaOps } = nonFileValue.editors.find(
                (editor) => editor.type === "question",
              ) as QuestionEditor;

              replaceImageTagWithURL(
                uploadedImage.tag,
                uploadedImage.URL,
                deltaOps,
              );
              continue;
            }

            if (uploadedImage.tag.includes("explanation")) {
              const { deltaOps } = nonFileValue.editors.find(
                (editor) => editor.type === "explanation",
              ) as ExplanationEditor;

              replaceImageTagWithURL(
                uploadedImage.tag,
                uploadedImage.URL,
                deltaOps,
              );
              continue;
            }

            if (uploadedImage.tag.includes("answer-choice")) {
              const { taggedDeltas } = nonFileValue.editors.find(
                (editor) => editor.type === "multipleChoice",
              ) as MultipleChoiceEditor;

              const { deltaOps } = taggedDeltas.find(
                (delta) => delta.tag === uploadedImage.tag.split("_")[1],
              ) as TaggedDelta;

              replaceImageTagWithURL(
                uploadedImage.tag,
                uploadedImage.URL,
                deltaOps,
              );
              continue;
            }
          }
        }

        // Insert question and its multiple choice to db
        const questionID = await createQuestion(
          nonFileValue.taxonomyBloom,
          JSON.stringify(
            nonFileValue.editors.find((editor) => editor.type === "question")!
              .deltaOps,
          ),
          JSON.stringify(
            nonFileValue.editors.find(
              (editor) => editor.type === "explanation",
            )!.deltaOps,
          ),
        );

        await Promise.all([
          supabase
            .from("learning_material_question")
            .insert({
              learning_material_id: learningMaterialID,
              question_id: questionID,
            })
            .throwOnError(),
          supabase
            .from("multiple_choice")
            .insert(
              nonFileValue.editors
                .find((editor) => editor.type === "multipleChoice")!
                .taggedDeltas.map(({ tag, deltaOps }) => {
                  let isCorrectAnswer = false;
                  if (tag === nonFileValue.correctAnswerTag) {
                    isCorrectAnswer = true;
                  }

                  return {
                    id: uuidv4(),
                    question_id: questionID,
                    content: JSON.stringify(deltaOps),
                    is_correct_answer: isCorrectAnswer,
                  };
                }),
            )
            .throwOnError(),
        ]);

        res.status(201).json({ status: "success", data: null });
      } catch (error) {
        res.status(500).json({ status: "failed", message: "Server Error" });
        console.log(error);
      }
    });

    bb.on("error", (error) => {
      res.status(400).json({
        status: "failed",
        message: "Malformed Request",
      });

      console.log(
        new Error("Malformed multipart/form-data request: ", { cause: error }),
      );
    });

    req.pipe(bb);
  } else {
    handleInvalidMethod(res, ["GET", "POST"]);
  }
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
        id: uuidv4(),
        content: contentDeltaOps,
        explanation: explanationDeltaOps,
        taxonomy_bloom: taxonomyBloom,
      })
      .select("id")
      .single()
      .throwOnError();
    return data!.id;
  } catch (error) {
    throw new Error("Error when creating a soal: ", { cause: error });
  }
}

function replaceImageTagWithURL(
  imageTag: string,
  imageURL: string,
  deltaOps: DeltaOps,
): void {
  for (let i = 0; i < deltaOps.length; i++) {
    const insert = deltaOps[i].insert;
    const hasImageKey = typeof insert === "object" && "image" in insert;

    if (hasImageKey && imageTag === insert.image) {
      insert.image = imageURL;
    }
  }
}
