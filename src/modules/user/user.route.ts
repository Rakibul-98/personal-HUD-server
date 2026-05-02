import { Router } from "express";
import {
  getUserByEmailController,
  loginUser,
  registerUser,
  logoutUser,
} from "./user.controller";
import { authenticate } from "../../shared/middlewares/auth";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

const router = Router();

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.post("/logout", authenticate, asyncHandler(logoutUser));
// Lock down user lookup — require auth so anyone can't enumerate emails
router.get("/by-email/:email", authenticate, asyncHandler(getUserByEmailController));

export default router;
