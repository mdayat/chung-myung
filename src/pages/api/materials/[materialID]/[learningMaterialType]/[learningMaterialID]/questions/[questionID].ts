import type { NextApiRequest, NextApiResponse } from "next";

import { handleInvalidMethod } from "@utils/middlewares";
import type { FailedResponse, SuccessResponse } from "@customTypes/api";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<unknown> | FailedResponse>
) {
  if (req.method === "GET") {
    const questionID = req.query.questionID;
    res
      .status(200)
      .json({ status: "success", data: "the data of " + questionID });
  } else if (req.method === "PUT" || req.method === "PATCH") {
    const questionID = req.query.questionID;
    res.status(200).json({
      status: "success",
      data: "the updated data of " + questionID,
    });
  } else if (req.method === "DELETE") {
    const questionID = req.query.questionID;
    res.status(200).json({
      status: "success",
      data: "the deleted data of " + questionID,
    });
  } else {
    handleInvalidMethod(res, ["GET", "PUT", "PATCH", "DELETE"]);
  }
}
