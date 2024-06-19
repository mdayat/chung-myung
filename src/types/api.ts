interface SuccessResponse<T> {
  status: "success";
  data: T;
}

interface FailedResponse {
  status: "failed";
  error: {
    statusCode: number;
    message: string;
  };
}

export type { SuccessResponse, FailedResponse };
