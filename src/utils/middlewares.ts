import type { NextApiResponse } from "next";
import type { FailedResponse } from "@customTypes/api";

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function handleInvalidMethod(
  res: NextApiResponse,
  allowedMethods: HTTPMethod[]
): void {
  const payload: FailedResponse = {
    status: "failed",
    message: "Invalid HTTP Method",
  };

  res.setHeader("Allow", allowedMethods.join(", "));
  res.status(405).json(payload);
}

export { handleInvalidMethod };
