import { Types, Document } from "mongoose";

export interface IUserFocus extends Document {
  userId: Types.ObjectId;
  topics: string[];
}
