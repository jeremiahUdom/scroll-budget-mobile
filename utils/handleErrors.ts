import { ApiError } from "./AppError"
import { ApiErrorResponse } from "@/types/ApiErrorResponse"

const handleError = (error: any) => {
  const data = error?.response?.data as ApiErrorResponse | undefined

  const message = data?.message || "Something went wrong"
  const status = data?.statusCode || error?.response?.status || 0

  throw new ApiError(message, status)
}

export default handleError