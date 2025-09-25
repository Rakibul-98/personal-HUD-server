export class ApiResponse {
  constructor(
    public statusCode: number,
    public data: any = null,
    public message: string = "Success",
    public success: boolean = statusCode < 400
  ) {}

  static success(data: any = null, message: string = "Success") {
    return new ApiResponse(200, data, message, true);
  }

  static error(message: string, statusCode: number = 500) {
    return new ApiResponse(statusCode, null, message, false);
  }
}
