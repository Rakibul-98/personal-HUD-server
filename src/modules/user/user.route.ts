import { Router } from "express";
import {
  getUserByEmailController,
  loginUser,
  registerUser,
} from "./user.controller";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:email", getUserByEmailController);

export default router;
