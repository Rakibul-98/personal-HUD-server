import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(ApiResponse.error(err.message));
  }

  return res.status(500).json(ApiResponse.error("Internal Server Error"));
};
