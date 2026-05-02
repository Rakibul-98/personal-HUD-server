import Bookmark from "./bookmark.model";
import { IBookmark } from "./bookmark.interface";
import { logger } from "../../shared/utils/logger";

export const createBookmark = async (data: IBookmark) => {
  // Prevent duplicate bookmarks
  const existing = await Bookmark.findOne({
    user: data.user,
    feedItem: data.feedItem,
  });
  if (existing) return existing.populate("feedItem");

  const bookmark = new Bookmark(data);
  await bookmark.save();
  return bookmark.populate("feedItem");
};

export const getUserBookmarks = async (userId: string) => {
  return Bookmark.find({ user: userId })
    .populate("feedItem")
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Deletes a bookmark only if it belongs to the requesting user.
 * Returns null if not found or not owned — caller handles the 404.
 */
export const deleteBookmark = async (
  bookmarkId: string,
  userId: string
): Promise<boolean> => {
  const result = await Bookmark.findOneAndDelete({
    _id: bookmarkId,
    user: userId,
  });
  return result !== null;
};
