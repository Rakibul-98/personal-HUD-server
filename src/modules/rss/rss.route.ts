import { Router } from "express";
import {
  addSource,
  getSources,
  updateSource,
  deleteSource,
} from "./rss.controller";
import { authenticate } from "../../shared/middlewares/auth";

const router = Router();

router.use(authenticate);

router.post("/", addSource);
router.get("/", getSources);
router.put("/:id", updateSource);
router.delete("/:id", deleteSource);

export default router;
