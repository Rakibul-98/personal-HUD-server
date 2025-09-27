import { Schema, model } from "mongoose";
import { IUserDocument } from "./user.interface";

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const UserModel = model<IUserDocument>("User", userSchema);

export default UserModel;
