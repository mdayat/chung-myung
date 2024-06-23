import { z as zod } from "zod";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@lib/prismaClient";
import { handleInvalidMethod } from "@utils/middlewares";
import type { FailedResponse, SuccessResponse } from "@customTypes/api";

interface Material {
  id: string;
  name: string;
  description: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<Material[] | null> | FailedResponse>
) {
  const promise = new Promise(() => {
    if (req.method === "GET") {
      selectMaterials()
        .then((materials) => {
          res.status(200).json({
            status: "success",
            data: materials,
          });
        })
        .catch((error) => {
          // Log the error properly
          console.error(error);

          res.setHeader("Content-Type", "application/json");
          res.status(500).json({
            status: "failed",
            error: { statusCode: 500, message: "Server error" },
          });
        });
    } else if (req.method === "POST") {
      const materialSchema = zod.object({
        name: zod.string(),
        description: zod.string(),
      });

      const result = materialSchema.safeParse(req.body);
      if (result.success) {
        insertMaterial(result.data)
          .then(() => {
            res.status(201).json({ status: "success", data: null });
          })
          .catch((error) => {
            // Log the error properly
            console.error(error);

            res.setHeader("Content-Type", "application/json");
            res.status(500).json({
              status: "failed",
              error: { statusCode: 500, message: "Server error" },
            });
          });
      } else {
        res.setHeader("Content-Type", "application/json");
        res.status(400).json({
          status: "failed",
          error: { statusCode: 400, message: "Invalid JSON schema" },
        });
      }
    } else {
      handleInvalidMethod(res, ["GET", "POST"]);
    }
  });

  return promise;
}

function selectMaterials(): Promise<Material[]> {
  const promise = new Promise<Material[]>((resolve, reject) => {
    prisma.material
      .findMany()
      .then((materials) => {
        resolve(materials);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
}

function insertMaterial(material: Omit<Material, "id">): Promise<null> {
  const promise = new Promise<null>((resolve, reject) => {
    prisma.material
      .create({ data: material })
      .then(() => {
        resolve(null);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
}
