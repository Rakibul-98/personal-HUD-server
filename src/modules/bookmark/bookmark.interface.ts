import { Types } from "mongoose";

export interface IBookmark {
  user: Types.ObjectId;
  feedItem: Types.ObjectId;
  createdAt?: Date;
}
