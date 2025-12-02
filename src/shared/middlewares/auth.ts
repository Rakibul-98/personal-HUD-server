import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthenticatedRequest } from "../types";

// For testing/demo - use mock user
export const authenticate: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mockUserId = req.headers["x-user-id"] || "65a1b2c3d4e5f67890123456";

    req.user = {
      _id: mockUserId as string,
      email: "user@example.com",
      username: "Test User",
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Authentication failed" });
    return;
  }
};
