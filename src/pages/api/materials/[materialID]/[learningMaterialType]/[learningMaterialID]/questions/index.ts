import type { NextApiRequest, NextApiResponse } from "next";
import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import type { LearningMaterialType } from "@customTypes/soal";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<unknown> | FailedResponse>
) {
  const learningMaterialType = req.query
    .learningMaterialType as LearningMaterialType;

  if (
    learningMaterialType !== "prerequisites" &&
    learningMaterialType !== "sub-materials"
  ) {
    const resBody: FailedResponse = {
      status: "failed",
      error: { statusCode: 404, message: "Invalid resource URL" },
    };

    res.setHeader("Content-Type", "application/json");
    res.status(resBody.error.statusCode).json(resBody);
    return;
  }

  if (req.method === "GET") {
    res.status(200).json({ status: "success", data: "questions" });
  } else if (req.method === "POST") {
    res.status(201).json({ status: "success", data: "question" });
  } else {
    const resBody: FailedResponse = {
      status: "failed",
      error: { statusCode: 405, message: "Invalid HTTP method" },
    };

    res.setHeader("Allow", "GET, POST");
    res.setHeader("Content-Type", "application/json");
    res.status(resBody.error.statusCode).json(resBody);
  }
}
