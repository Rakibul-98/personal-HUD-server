import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "./user.service";
import { loginSchema, registerSchema } from "./user.validation";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const existingUser = await findUserByEmail(req.body.email);
    if (existingUser)
      return res.status(400).json({ error: "Email already in use" });

    const user = await createUser(req.body);
    res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await findUserByEmail(req.body.email);
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
