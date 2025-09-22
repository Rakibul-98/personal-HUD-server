import { Router } from "express";
import * as focusController from "./focus.controller";

const router = Router();

router.get("/:userId", focusController.getFocus);
router.post("/add", focusController.addFocusKeyword);
router.post("/remove", focusController.removeFocusKeyword);

export default router;
