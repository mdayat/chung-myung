import { Blob } from "node:buffer";
import busboy from "busboy";
import { z as zod } from "zod";
import type { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@lib/supabase";
import { handleInvalidMethod } from "@utils/middlewares";
import {
  editorSchema,
  type Editor,
  type MultipleChoiceEditor,
  type ExplanationEditor,
  type QuestionEditor,
  type TaggedDelta,
  type TaggedBlob,
  type DeltaOps,
} from "@customTypes/question";
import type { FailedResponse, SuccessResponse } from "@customTypes/api";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface GETData {}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<GETData | null> | FailedResponse>
) {
  const promise = new Promise(() => {
    if (req.method === "GET") {
      res.status(200).json({ status: "success", data: "questions" });
    } else if (req.method === "POST") {
      const bb = busboy({ headers: req.headers });
      const taggedBlobs: TaggedBlob[] = [];

      let nonFileValue: {
        questionID: string;
        correctAnswerTag: string;
        editors: Editor[];
      };

      // Parse buffer streams and create a blob from it and throw an error if it fails
      bb.on("file", (name, file) => {
        busboyErrorHandler(res, () => {
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
              throw new BusboyError("File parsing failed", {
                statusCode: 400,
                cause: error,
              });
            });
        });
      });

      // Parse and verify the incoming JSON data and throw an error if it fails
      bb.on("field", (_, value) => {
        busboyErrorHandler(res, () => {
          const nonFileValueSchema = zod.object({
            questionID: zod.string(),
            correctAnswerTag: zod.string(),
            editors: zod.array(editorSchema),
          });

          const result = nonFileValueSchema.safeParse(JSON.parse(value));
          if (result.success) {
            nonFileValue = result.data;
          } else {
            req.unpipe(bb);
            throw new BusboyError("Invalid JSON schema", {
              statusCode: 400,
              cause: result.error,
            });
          }
        });
      });

      // Create a new record in a database and upload its files if it's needed
      bb.on("close", () => {
        if (taggedBlobs.length === 0) {
          // Insert to database
        } else {
          const uploadFilePromises: Array<() => Promise<UploadedFile>> =
            new Array(taggedBlobs.length);

          // Create a list of function that return a promise
          // This promise is a promise to upload a file
          for (let i = 0; i < taggedBlobs.length; i++) {
            const taggedBlob = taggedBlobs[i];
            const fileName = `${nonFileValue.questionID}-${taggedBlob.imageTag}.png`;
            uploadFilePromises[i] = uploadFile(fileName, taggedBlob.blob);
          }

          Promise.all(
            uploadFilePromises.map((uploadFilePromise) => uploadFilePromise())
          )
            .then((uploadedFiles) => {
              // Replace an image tag in a delta with its corresponding file url based on its tag
              for (let i = 0; i < uploadedFiles.length; i++) {
                const uploadedFile = uploadedFiles[i];
                const imageTag = getImageTagFromFilePath(uploadedFile.path);

                if (imageTag.includes("question")) {
                  const { deltaOps } = nonFileValue.editors.find(
                    (editor) => editor.type === "question"
                  ) as QuestionEditor;

                  replaceImageTagWithFileURL(
                    imageTag,
                    uploadedFile.url,
                    deltaOps
                  );
                  continue;
                }

                if (imageTag.includes("explanation")) {
                  const { deltaOps } = nonFileValue.editors.find(
                    (editor) => editor.type === "explanation"
                  ) as ExplanationEditor;

                  replaceImageTagWithFileURL(
                    imageTag,
                    uploadedFile.url,
                    deltaOps
                  );
                  continue;
                }

                if (imageTag.includes("multipleChoice")) {
                  const { taggedDeltaOps } = nonFileValue.editors.find(
                    (editor) => editor.type === "multipleChoice"
                  ) as MultipleChoiceEditor;

                  const { deltaOps } = taggedDeltaOps.find((taggedOps) =>
                    taggedOps.tag.includes(imageTag.split("-")[0])
                  ) as TaggedDelta;

                  replaceImageTagWithFileURL(
                    imageTag,
                    uploadedFile.url,
                    deltaOps
                  );
                  continue;
                }
              }

              // Insert to database
              res.status(201).json({ status: "success", data: null });
            })
            .catch((error) => {
              busboyErrorHandler(res, () => {
                req.unpipe(bb);
                throw new BusboyError("Upload files failed", {
                  statusCode: 500,
                  cause: error,
                });
              });
            });
        }
      });

      bb.on("error", (error) => {
        busboyErrorHandler(res, () => {
          req.unpipe(bb);
          throw new BusboyError("Malformed multipart/form-data request", {
            statusCode: 400,
            cause: error,
          });
        });
      });

      req.pipe(bb);
    } else {
      handleInvalidMethod(res, ["GET", "POST"]);
    }
  });

  return promise;
}

interface BusboyErrorOptions extends ErrorOptions {
  statusCode: number;
}

class BusboyError extends Error {
  readonly statusCode: number;

  constructor(message: string, options: BusboyErrorOptions) {
    super(message, { cause: options.cause });
    this.statusCode = options.statusCode;
    this.name = "BusboyError";
  }
}

function busboyErrorHandler(res: NextApiResponse, fn: () => void): void {
  try {
    fn();
  } catch (error) {
    if (error instanceof BusboyError) {
      const bodyPayload: FailedResponse = {
        status: "failed",
        message: error.message,
      };

      res.setHeader("Content-Type", "application/json");
      res.status(error.statusCode).json(bodyPayload);
    } else {
      // Log the error
      console.error(error);
    }
  }
}

interface UploadedFile {
  path: string;
  url: string;
}

function uploadFile(name: string, blob: Blob): () => Promise<UploadedFile> {
  return () =>
    new Promise((resolve, reject) => {
      const storageBucket = "soal";
      supabase.storage
        .from(storageBucket)
        .upload(name, blob as any, { upsert: true })
        .then(({ data, error }) => {
          if (error !== null) {
            reject(error);
          } else {
            const { publicUrl } = supabase.storage
              .from("soal")
              .getPublicUrl(data.path).data;

            resolve({ path: name, url: publicUrl });
          }
        });
    });
}

function replaceImageTagWithFileURL(
  imageTag: string,
  fileURL: string,
  deltaOps: DeltaOps
): void {
  for (let i = 0; i < deltaOps.length; i++) {
    const insert = deltaOps[i].insert;
    const hasImageKey = typeof insert === "object" && "image" in insert;

    if (hasImageKey && imageTag === insert.image) {
      insert.image = fileURL;
    }
  }
}

function getImageTagFromFilePath(path: string): string {
  const withoutSlash = path.split("/");
  const withoutFileExt = withoutSlash[withoutSlash.length - 1].split(".")[0];
  return withoutFileExt.split("-").slice(1).join("-");
}
