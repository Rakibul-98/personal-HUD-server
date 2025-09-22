import { Schema, model } from "mongoose";
import { IUserFocus } from "./focus.interface";

const focusSchema = new Schema<IUserFocus>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    topics: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default model<IUserFocus>("Focus", focusSchema);
