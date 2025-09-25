import { HydratedDocument, Types } from "mongoose";

export interface IUserFocus {
  userId: Types.ObjectId;
  topics: string[];
}

export type IUserFocusDoc = HydratedDocument<IUserFocus>;
