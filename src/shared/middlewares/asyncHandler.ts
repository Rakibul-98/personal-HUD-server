import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an async route handler so any thrown error is forwarded to
 * Express's error handler instead of causing an unhandled rejection.
 *
 * Usage:
 *   router.get("/", asyncHandler(myController));
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
