interface SuccessResponse<T> {
  status: "success";
  data: T | null;
}

interface FailedResponse {
  status: "failed";
  error: {
    statusCode: number;
    message: string;
  };
}

export type { SuccessResponse, FailedResponse };
