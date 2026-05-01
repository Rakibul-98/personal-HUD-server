import { Router } from "express";
import * as feedController from "./feed.controller";
import { refreshFeeds } from "./feed.corn";
import { authenticate, optionalAuthenticate } from "../../shared/middlewares/auth";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

const router = Router();

router.get("/", optionalAuthenticate, asyncHandler(feedController.getFeeds));   // GET with query params
router.post("/list", optionalAuthenticate, asyncHandler(feedController.getFeeds)); // legacy POST support
router.get("/:id", asyncHandler(feedController.getFeedById));
router.post("/refresh", authenticate, asyncHandler(refreshFeeds));              // auth required
// Remove unauthenticated createFeed — feed items are only created by fetchers
// router.post("/", feedController.createFeed);

export default router;
