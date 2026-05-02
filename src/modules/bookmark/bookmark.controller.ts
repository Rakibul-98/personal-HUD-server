import { Request, Response } from "express";
import * as bookmarkService from "./bookmark.service";
import { createBookmarkSchema } from "./bookmark.validation";
import { AuthenticatedRequest } from "../../shared/types";
import { AppError } from "../../shared/middlewares/errorHandler";

export const addBookmark = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!._id.toString();
  const { error } = createBookmarkSchema.validate(req.body);
  if (error) throw new AppError(400, error.details[0].message);

  // Inject authenticated userId — ignore any userId in body
  const bookmark = await bookmarkService.createBookmark({
    user: userId as any,
    feedItem: req.body.feedItem,
  });
  res.status(201).json({ success: true, data: bookmark });
};

export const getBookmarks = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!._id.toString();
  const bookmarks = await bookmarkService.getUserBookmarks(userId);
  res.json({ success: true, data: bookmarks });
};

export const removeBookmark = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!._id.toString();
  const bookmarkId = req.params.id;

  const deleted = await bookmarkService.deleteBookmark(bookmarkId, userId);
  if (!deleted)
    throw new AppError(404, "Bookmark not found or not owned by you");

  res.json({ success: true, message: "Bookmark removed" });
};
