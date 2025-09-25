import { Schema, model, Document, Types } from "mongoose";

// user.interface.ts
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
  password: string;
  role?: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const UserModel = model<IUserDocument>("User", userSchema);
export default UserModel;
