import { Request, Response } from "express";
import * as bookmarkService from "./bookmark.service";
import { createBookmarkSchema } from "./bookmark.validation";

export const addBookmark = async (req: Request, res: Response) => {
  try {
    const { error } = createBookmarkSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const bookmark = await bookmarkService.createBookmark(req.body);
    res.status(201).json(bookmark);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookmarks = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const bookmarks = await bookmarkService.getUserBookmarks(userId);
    res.json(bookmarks);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const removeBookmark = async (req: Request, res: Response) => {
  try {
    const bookmarkId = req.params.id;
    await bookmarkService.deleteBookmark(bookmarkId);
    res.json({ message: "Bookmark deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
