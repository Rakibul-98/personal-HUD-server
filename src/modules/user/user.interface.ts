import { Document, Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role?: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}
