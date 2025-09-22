import { Router } from "express";
import * as feedController from "./feed.controller";

const router = Router();

router.post("/", feedController.createFeed);
router.post("/list", feedController.getFeeds);
router.get("/:id", feedController.getFeedById);

export default router;
