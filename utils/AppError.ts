export class ApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 0) {
    super(message)
    this.name = "ApiError"
    this.statusCode = statusCode
  }
}