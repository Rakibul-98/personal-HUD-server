import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { ApiResponse } from "../utils/ApiResponse";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message);

  return res.status(500).json(ApiResponse.error("Internal Server Error"));
};
