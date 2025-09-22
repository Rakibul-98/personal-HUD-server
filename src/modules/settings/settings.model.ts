import { Schema, model } from "mongoose";
import { IUserSettings } from "./settings.interface";

const settingsSchema = new Schema<IUserSettings>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    feedSources: {
      reddit: { type: Boolean, default: true },
      hackerNews: { type: Boolean, default: true },
      devTo: { type: Boolean, default: true },
    },
    sortingPreference: {
      type: String,
      enum: ["latest", "rank", "popularity"],
      default: "rank",
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    scrollSpeed: { type: Number, min: 1, max: 5, default: 3 },
  },
  { timestamps: true }
);

const SettingsModel = model<IUserSettings>("Settings", settingsSchema);
export default SettingsModel;
