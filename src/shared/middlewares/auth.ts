import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const authenticate: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Support both Authorization header and cookie
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, env.jwtSecret) as {
      id: string;
      email: string;
      role: string;
    };

    req.user = {
      _id: decoded.id,
      email: decoded.email,
      username: decoded.email,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};

// Optional auth — attaches user if token is present, but doesn't block
export const optionalAuthenticate: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      const decoded = jwt.verify(token, env.jwtSecret) as {
        id: string;
        email: string;
        role: string;
      };
      req.user = { _id: decoded.id, email: decoded.email, username: decoded.email };
    }
  } catch (_) {
    // silent — optional auth never blocks
  }
  next();
};
