import type { NextApiRequest, NextApiResponse } from "next";

import { handleInvalidMethod } from "@utils/server/middlewares";
import type { FailedResponse, SuccessResponse } from "@customTypes/api";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<unknown> | FailedResponse>
) {
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
    handleInvalidMethod(res, ["GET", "PUT", "PATCH", "DELETE"]);
  }
}
