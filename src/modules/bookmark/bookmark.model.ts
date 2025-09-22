import { Schema, model } from "mongoose";
import { IBookmark } from "./bookmark.interface";

const bookmarkSchema = new Schema<IBookmark>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    feedItem: { type: Schema.Types.ObjectId, ref: "FeedItem", required: true },
  },
  { timestamps: true }
);

export default model<IBookmark>("Bookmark", bookmarkSchema);
