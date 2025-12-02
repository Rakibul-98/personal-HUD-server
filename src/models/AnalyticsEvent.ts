import mongoose, { Document, Schema } from "mongoose";

export interface IAnalyticsEvent extends Document {
  userId: mongoose.Types.ObjectId;
  eventType: "BOOKMARK_SAVE" | "ARTICLE_VIEW" | "KEYWORD_FOCUS";
  targetId?: mongoose.Types.ObjectId; // Reference to Article or other entity
  data: Record<string, any>; // Flexible field for additional data (e.g., the focused keyword)
  timestamp: Date;
}

const AnalyticsEventSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventType: {
      type: String,
      required: true,
      enum: ["BOOKMARK_SAVE", "ARTICLE_VIEW", "KEYWORD_FOCUS"],
    },
    targetId: { type: Schema.Types.ObjectId },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Indexing for faster lookups
AnalyticsEventSchema.index({ userId: 1, eventType: 1, timestamp: -1 });

export default mongoose.model<IAnalyticsEvent>(
  "AnalyticsEvent",
  AnalyticsEventSchema
);
