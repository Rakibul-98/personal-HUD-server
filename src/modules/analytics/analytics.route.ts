import { Router } from "express";
import {
  logEvent,
  getMostSavedTopics,
  getKeywordTrends,
  getUserActivity,
} from "./analytics.controller";
import { authenticate } from "../../shared/middlewares/auth";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

const router = Router();
router.use(authenticate);

router.post("/log", asyncHandler(logEvent));
router.get("/most-saved-topics", asyncHandler(getMostSavedTopics));
router.get("/keyword-trends", asyncHandler(getKeywordTrends));
router.get("/activity", asyncHandler(getUserActivity));

export default router;
