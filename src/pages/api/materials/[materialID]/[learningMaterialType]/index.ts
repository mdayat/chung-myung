import type { NextApiRequest, NextApiResponse } from "next";

import { handleInvalidMethod } from "@utils/server/middlewares";
import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import type { LearningMaterialType } from "@customTypes/soal";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<unknown> | FailedResponse>
) {
  const learningMaterialType = req.query
    .learningMaterialType as LearningMaterialType;

  if (req.method === "GET") {
    res.status(200).json({ status: "success", data: learningMaterialType });
  } else if (req.method === "POST") {
    res.status(201).json({ status: "success", data: learningMaterialType });
  } else {
    handleInvalidMethod(res, ["GET", "POST"]);
  }
}
