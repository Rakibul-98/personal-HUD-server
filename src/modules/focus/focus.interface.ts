import { Types } from "mongoose";

export interface IUserFocus {
  userId: Types.ObjectId;
  topics: string[];
}
