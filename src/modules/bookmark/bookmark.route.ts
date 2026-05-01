import { Router } from "express";
import * as bookmarkController from "./bookmark.controller";
import { authenticate } from "../../shared/middlewares/auth";
import { asyncHandler } from "../../shared/middlewares/asyncHandler";

const router = Router();
router.use(authenticate);

router.post("/", asyncHandler(bookmarkController.addBookmark));
router.get("/", asyncHandler(bookmarkController.getBookmarks));  // GET /api/bookmarks (userId from token)
router.delete("/:id", asyncHandler(bookmarkController.removeBookmark));

export default router;
