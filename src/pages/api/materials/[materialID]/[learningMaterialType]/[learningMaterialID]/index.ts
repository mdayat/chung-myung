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
    const learningMaterialID = req.query.learningMaterialID;
    res
      .status(200)
      .json({ status: "success", data: "the data of " + learningMaterialID });
  } else if (req.method === "PUT" || req.method === "PATCH") {
    const learningMaterialID = req.query.learningMaterialID;
    res.status(200).json({
      status: "success",
      data: "the updated data of " + learningMaterialID,
    });
  } else if (req.method === "DELETE") {
    const learningMaterialID = req.query.learningMaterialID;
    res.status(200).json({
      status: "success",
      data: "the deleted data of " + learningMaterialID,
    });
  } else {
    const resBody: FailedResponse = {
      status: "failed",
      error: { statusCode: 405, message: "Invalid HTTP method" },
    };

    res.setHeader("Allow", "GET, PUT, PATCH, DELETE");
    res.setHeader("Content-Type", "application/json");
    res.status(resBody.error.statusCode).json(resBody);
  }
}
