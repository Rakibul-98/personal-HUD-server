import { Router } from "express";
import * as settingsController from "./settings.controller";
import { authenticate } from "../../shared/middlewares/auth";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

const router = Router();
router.use(authenticate);

router.get("/", asyncHandler(settingsController.getSettings));           // GET instead of POST
router.put("/", asyncHandler(settingsController.updateSettings));        // PUT instead of POST
router.post("/fetch-now", asyncHandler(settingsController.fetchNow));

export default router;
