import { Router } from "express";
import {
  logEvent,
  getMostSavedTopics,
  getKeywordTrends,
} from "./analytics.controller";
import { authenticate } from "../../shared/middlewares/auth";

const router = Router();

router.use(authenticate);

router.post("/log", logEvent);
router.get("/most-saved-topics", getMostSavedTopics);
router.get("/keyword-trends", getKeywordTrends);

export default router;
