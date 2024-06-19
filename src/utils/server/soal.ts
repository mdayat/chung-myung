import type { NextApiResponse } from "next";
import type { Blob } from "node:buffer";
import type Delta from "quill-delta";

import { supabase } from "@libs/supabase";
import type { FailedResponse } from "@customTypes/api";

interface TaggedBlob {
  imageTag: string;
  blob: Blob;
}

interface BusboyErrorOptions extends ErrorOptions {
  statusCode: number;
}

class BusboyError extends Error {
  readonly statusCode: number;

  constructor(message: string, options: BusboyErrorOptions) {
    super(message, { cause: options.cause });
    this.name = "BusboyError";
    this.statusCode = options.statusCode;
  }
}

function busboyErrorHandler(res: NextApiResponse, fn: () => void) {
  try {
    fn();
  } catch (error) {
    if (error instanceof BusboyError) {
      const resBody: FailedResponse = {
        status: "failed",
        error: { statusCode: error.statusCode, message: error.message },
      };

      res.setHeader("Content-Type", "application/json");
      res.status(error.statusCode).json(resBody);
    } else {
      // Log the error
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
      const storageBucket = "soalll";
      supabase.storage
        .from(storageBucket)
        .upload(name, blob as any, { upsert: true })
        .then(({ data, error }) => {
          if (error !== null) {
            // Handle and log the error
            console.error("Error when uploading a new file: \n", error);
            reject(error);
            return;
          }

          const { publicUrl } = supabase.storage
            .from("soal")
            .getPublicUrl(data.path).data;

          resolve({ path: name, url: publicUrl });
        });
    });
}

function replaceImageTagWithFileURL(
  imageTag: string,
  fileURL: string,
  delta: Delta
): void {
  for (let i = 0; i < delta.ops.length; i++) {
    const insert = delta.ops[i].insert;
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

export {
  BusboyError,
  busboyErrorHandler,
  uploadFile,
  replaceImageTagWithFileURL,
  getImageTagFromFilePath,
};
export type { TaggedBlob, UploadedFile };
