import mongoose, { Document, Schema } from "mongoose";

export interface IAnalyticsEvent extends Document {
  userId: mongoose.Types.ObjectId;
  eventType:
    | "BOOKMARK_SAVE"
    | "BOOKMARK_REMOVE"
    | "FEED_CLICK"
    | "KEYWORD_FOCUS"
    | "KEYWORD_REMOVE"
    | "FEED_REFRESH";
  targetId?: mongoose.Types.ObjectId;
  data: Record<string, any>;
  createdAt: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    eventType: {
      type: String,
      required: true,
      enum: [
        "BOOKMARK_SAVE",
        "BOOKMARK_REMOVE",
        "FEED_CLICK",
        "KEYWORD_FOCUS",
        "KEYWORD_REMOVE",
        "FEED_REFRESH",
      ],
    },
    targetId: { type: Schema.Types.ObjectId },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Compound index covering the most common query: all events for a user, by type, newest first
AnalyticsEventSchema.index({ userId: 1, eventType: 1, createdAt: -1 });

export default mongoose.model<IAnalyticsEvent>("AnalyticsEvent", AnalyticsEventSchema);
