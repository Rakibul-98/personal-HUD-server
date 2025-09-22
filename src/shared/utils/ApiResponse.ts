export class ApiResponse<T> {
  public success: boolean;
  public message: string;
  public data?: T;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T, message = "Success") {
    return new ApiResponse<T>(true, message, data);
  }

  static error(message = "Error") {
    return new ApiResponse<null>(false, message, null);
  }
}
