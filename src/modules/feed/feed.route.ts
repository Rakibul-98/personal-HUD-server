import { Router } from "express";
import * as feedController from "./feed.controller";
import { refreshFeeds } from "./feed.corn";

const router = Router();

router.post("/", feedController.createFeed);
router.post("/list", feedController.getFeeds);
router.get("/:id", feedController.getFeedById);
router.post("/refresh", refreshFeeds);

export default router;
