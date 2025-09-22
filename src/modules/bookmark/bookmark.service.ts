import Bookmark from "./bookmark.model";
import { IBookmark } from "./bookmark.interface";

export const createBookmark = async (data: IBookmark) => {
  const bookmark = new Bookmark(data);
  return await bookmark.save();
};

export const getUserBookmarks = async (userId: string) => {
  return await Bookmark.find({ user: userId })
    .populate("feedItem")
    .sort({ createdAt: -1 });
};

export const deleteBookmark = async (bookmarkId: string) => {
  return await Bookmark.findByIdAndDelete(bookmarkId);
};
