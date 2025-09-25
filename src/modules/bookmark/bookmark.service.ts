import Bookmark from "./bookmark.model";
import { IBookmark } from "./bookmark.interface";

export const createBookmark = async (data: IBookmark) => {
  const bookmark = new Bookmark(data);
  await bookmark.save();
  return await bookmark.populate("feedItem");
};

export const getUserBookmarks = async (userId: string) => {
  return await Bookmark.find({ user: userId })
    .populate("feedItem")
    .sort({ createdAt: -1 });
};

export const deleteBookmark = async (bookmarkId: string) => {
  return await Bookmark.findByIdAndDelete(bookmarkId);
};
