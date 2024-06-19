import type { NextApiRequest, NextApiResponse } from "next";
import type { FailedResponse, SuccessResponse } from "@customTypes/api";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<unknown> | FailedResponse>
) {
  if (req.method === "GET") {
    const prerequisiteID = req.query.prerequisiteID;
    res
      .status(200)
      .json({ status: "success", data: "the data of " + prerequisiteID });
  } else if (req.method === "PUT" || req.method === "PATCH") {
    const prerequisiteID = req.query.prerequisiteID;
    res.status(200).json({
      status: "success",
      data: "the updated data of " + prerequisiteID,
    });
  } else if (req.method === "DELETE") {
    const prerequisiteID = req.query.prerequisiteID;
    res.status(200).json({
      status: "success",
      data: "the deleted data of " + prerequisiteID,
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
