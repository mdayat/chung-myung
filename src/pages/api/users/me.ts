import type { FailedResponse, SuccessResponse } from "@customTypes/api";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | FailedResponse>,
) {
  try {
    console.log(req);
    res.status(200).json({ status: "success", data: null });
  } catch (err) {
    res.status(500).json({ status: "failed", message: "error" });
  }
}
