interface SuccessResponse<T = null> {
  status: "success";
  data: T;
}

interface FailedResponse {
  status: "failed";
  message: string;
}

export type { FailedResponse, SuccessResponse };
