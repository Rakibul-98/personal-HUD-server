/**
 * Standardised API response envelope used across the app.
 *
 * Shape: { success: boolean, message: string, data?: any }
 *
 * All controllers should return this shape for consistency.
 * The errorHandler also returns { success: false, message } on errors.
 */
export class ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    if (data !== undefined) this.data = data;
  }

  static ok<T>(data: T, message = "Success"): ApiResponse<T> {
    return new ApiResponse(true, message, data);
  }

  static created<T>(data: T, message = "Created successfully"): ApiResponse<T> {
    return new ApiResponse(true, message, data);
  }

  static fail(message: string): ApiResponse<null> {
    return new ApiResponse(false, message);
  }
}
