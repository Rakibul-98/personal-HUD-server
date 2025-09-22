import { Router } from "express";
import * as bookmarkController from "./bookmark.controller";

const router = Router();

router.post("/", bookmarkController.addBookmark);
router.get("/:userId", bookmarkController.getBookmarks);
router.delete("/:id", bookmarkController.removeBookmark);

export default router;
