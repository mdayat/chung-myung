import { Prisma } from "@prisma/client";
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
  res: NextApiResponse<SuccessResponse<Material> | FailedResponse>
) {
  const promise = new Promise(() => {
    const materialID = (req.query.materialID ?? "") as string;
    res.setHeader("Content-Type", "application/json");

    if (req.method === "GET") {
      selectMaterial(materialID)
        .then((material) => {
          if (material === null) {
            generateMaterialNotFoundRes(res);
            return;
          }

          res.status(200).json({ status: "success", data: material });
        })
        .catch((error) => {
          // This error indicating that the materialID is invalid UUID
          // In other words, there's no material with the such ID
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2023"
          ) {
            generateMaterialNotFoundRes(res);
            return;
          }

          // Log the error properly
          console.error(error);
          generateServerErrorRes(res);
        });
    } else if (req.method === "PUT" || req.method === "PATCH") {
      const materialSchema = zod
        .object({
          name: zod.string(),
          description: zod.string(),
        })
        .partial()
        .refine((material) => {
          return (
            material.name !== undefined || material.description !== undefined
          );
        });

      const result = materialSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({
          status: "failed",
          error: { statusCode: 400, message: "Invalid JSON schema" },
        });
        return;
      }

      updateMaterial(materialID, result.data)
        .then((material) => {
          res.status(200).json({ status: "success", data: material });
        })
        .catch((error) => {
          // This error indicating that the materialID is invalid UUID or not found
          // In other words, there's no material with the such ID
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            (error.code === "P2023" || error.code === "P2025")
          ) {
            generateMaterialNotFoundRes(res);
            return;
          }

          // Log the error properly
          console.error(error);
          generateServerErrorRes(res);
        });
    } else if (req.method === "DELETE") {
      deleteMaterial(materialID)
        .then(() => {
          res.status(200).json({ status: "success", data: null });
        })
        .catch((error) => {
          // This error indicating that the materialID is invalid UUID or not found
          // In other words, there's no material with the such ID
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            (error.code === "P2023" || error.code === "P2025")
          ) {
            generateMaterialNotFoundRes(res);
            return;
          }

          // Log the error properly
          console.error(error);
          generateServerErrorRes(res);
        });
    } else {
      handleInvalidMethod(res, ["GET", "PUT", "PATCH", "DELETE"]);
    }
  });
  return promise;
}

function selectMaterial(materialID: string): Promise<Material | null> {
  const promise = new Promise<Material | null>((resolve, reject) => {
    prisma.material
      .findUnique({ where: { id: materialID } })
      .then((material) => {
        resolve(material);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
}

function updateMaterial(
  materialID: string,
  data: Partial<Omit<Material, "id">>
): Promise<Material> {
  const promise = new Promise<Material>((resolve, reject) => {
    prisma.material
      .update({ where: { id: materialID }, data })
      .then((updatedMaterial) => {
        resolve(updatedMaterial);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
}

function deleteMaterial(materialID: string): Promise<null> {
  const promise = new Promise<null>((resolve, reject) => {
    prisma.material
      .delete({ where: { id: materialID } })
      .then(() => {
        resolve(null);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
}

function generateServerErrorRes(
  res: NextApiResponse,
  message: Partial<string> = "Server error"
) {
  res.status(500).json({
    status: "failed",
    error: { statusCode: 500, message },
  });
}

function generateMaterialNotFoundRes(res: NextApiResponse) {
  res.status(404).json({
    status: "failed",
    error: { statusCode: 404, message: "Material not found" },
  });
}
