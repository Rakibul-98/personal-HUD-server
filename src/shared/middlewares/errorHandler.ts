import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = (err as AppError).statusCode || 500;
  const isOperational = (err as AppError).isOperational ?? false;

  console.log(`[${req.method}] ${req.path} — ${err.message}`, {
    statusCode,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  if (isOperational) {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unexpected errors — hide details in production
  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
};
