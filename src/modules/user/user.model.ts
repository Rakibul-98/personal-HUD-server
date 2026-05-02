import { Schema, model } from "mongoose";
import { IUserDocument } from "./user.interface";

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: { type: String, required: false, select: false }, // Never include in queries by default
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatar: { type: String }, // Used by Google OAuth
  },
  { timestamps: true }
);

// Prevent password hash from ever leaking into JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const UserModel = model<IUserDocument>("User", userSchema);
export default UserModel;
