import { Router } from "express";
import * as settingsController from "./settings.controller";

const router = Router();

router.post("/get", settingsController.getSettings);

router.post("/update", settingsController.updateSettings);

router.post("/fetch-now", settingsController.fetchNow);

export default router;
