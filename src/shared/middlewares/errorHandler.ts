import { Request, Response, NextFunction } from "express";
import { ApiError } from "@/shared/utils/ApiError";
import { ApiResponse } from "@/shared/utils/ApiResponse";
import { logger } from "../utils/logger";

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
