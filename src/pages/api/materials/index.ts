import type { NextApiRequest, NextApiResponse } from "next";

import { handleInvalidMethod } from "@utils/server/middlewares";
import type { FailedResponse, SuccessResponse } from "@customTypes/api";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<unknown> | FailedResponse>
) {
  if (req.method === "GET") {
    res.status(200).json({ status: "success", data: "materials" });
  } else if (req.method === "POST") {
    res.status(201).json({ status: "success", data: "material" });
  } else {
    handleInvalidMethod(res, ["GET", "POST"]);
  }
}
