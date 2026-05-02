import { Router } from "express";
import * as focusController from "./focus.controller";
import { authenticate } from "../../shared/middlewares/auth";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

const router = Router();
router.use(authenticate); // All focus routes require auth

router.get("/", asyncHandler(focusController.getFocus));          // GET /api/focus
router.post("/add", asyncHandler(focusController.addFocusKeyword));
router.post("/remove", asyncHandler(focusController.removeFocusKeyword));

export default router;
