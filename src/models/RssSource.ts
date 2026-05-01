import mongoose, { Document, Schema } from "mongoose";

export interface IRssSource extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  url: string;
  isActive: boolean;
  lastFetched: Date;
}

const RssSourceSchema = new Schema<IRssSource>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    url: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v: string) => /^https?:\/\/.+/.test(v),
        message: "URL must start with http:// or https://",
      },
    },
    isActive: { type: Boolean, default: true },
    lastFetched: { type: Date, default: null },
  },
  { timestamps: true }
);

// Uniqueness per user — different users can follow the same RSS feed
RssSourceSchema.index({ userId: 1, url: 1 }, { unique: true });

export default mongoose.model<IRssSource>("RssSource", RssSourceSchema);
