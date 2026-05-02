import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, getUserByEmail } from "./user.service";
import { loginSchema, registerSchema } from "./user.validation";
import { env } from "../../shared/config/env";
import { AppError } from "../../shared/middlewares/errorHandler";

const SALT_ROUNDS = 12;

// Strip sensitive fields before sending user data to client
const sanitizeUser = (user: any) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

export const registerUser = async (req: Request, res: Response) => {
  const { error } = registerSchema.validate(req.body);
  if (error) throw new AppError(400, error.details[0].message);

  const existing = await findUserByEmail(req.body.email);
  if (existing) throw new AppError(409, "An account with this email already exists");

  // Hash with proper cost factor (12 instead of default 10)
  const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
  const user = await createUser({ ...req.body, password: hashedPassword });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: { userId: user._id },
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { error } = loginSchema.validate(req.body);
  if (error) throw new AppError(400, error.details[0].message);

  const user = await findUserByEmail(req.body.email);
  // Use same error message for both "not found" and "wrong password"
  // to prevent user enumeration attacks
  if (!user || !user.password) {
    throw new AppError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) throw new AppError(401, "Invalid email or password");

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: "7d" }
  );

  // Set token as httpOnly cookie (more secure than localStorage)
  res.cookie("token", token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    success: true,
    message: "Login successful",
    data: { token, user: sanitizeUser(user) },
  });
};

export const getUserByEmailController = async (req: Request, res: Response) => {
  const { email } = req.params;

  if (!email?.includes("@")) {
    throw new AppError(400, "A valid email address is required");
  }

  const user = await getUserByEmail(email);
  if (!user) throw new AppError(404, "User not found");

  res.json({ success: true, data: sanitizeUser(user) });
};

export const logoutUser = async (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};
