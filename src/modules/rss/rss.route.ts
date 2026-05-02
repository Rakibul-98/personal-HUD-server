import { Router } from "express";
import { addSource, getSources, updateSource, deleteSource } from "./rss.controller";
import { authenticate } from "../../shared/middlewares/auth";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

const router = Router();
router.use(authenticate);

router.post("/", asyncHandler(addSource));
router.get("/", asyncHandler(getSources));
router.put("/:id", asyncHandler(updateSource));
router.delete("/:id", asyncHandler(deleteSource));

export default router;
