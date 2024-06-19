import type { NextApiRequest, NextApiResponse } from "next";
import type { FailedResponse, SuccessResponse } from "@customTypes/api";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<unknown> | FailedResponse>
) {
  if (req.method === "GET") {
    const subMaterialID = req.query.subMaterialID;
    res
      .status(200)
      .json({ status: "success", data: "the data of " + subMaterialID });
  } else if (req.method === "PUT" || req.method === "PATCH") {
    const subMaterialID = req.query.subMaterialID;
    res.status(200).json({
      status: "success",
      data: "the updated data of " + subMaterialID,
    });
  } else if (req.method === "DELETE") {
    const subMaterialID = req.query.subMaterialID;
    res.status(200).json({
      status: "success",
      data: "the deleted data of " + subMaterialID,
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
