import type { NextApiRequest, NextApiResponse } from "next";
import type { FailedResponse, SuccessResponse } from "@customTypes/api";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<unknown> | FailedResponse>
) {
  if (req.method === "GET") {
    res.status(200).json({ status: "success", data: "prerequisites" });
  } else if (req.method === "POST") {
    res.status(201).json({ status: "success", data: "prerequisite" });
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
