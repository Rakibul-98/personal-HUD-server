import { Schema, model, Document } from "mongoose";

export interface IFeedItemDocument extends Document {
  title: string;
  content: string;
  source?: string;
  summary?: string;
  tags?: string[];
  category?: string;
  popularityScore?: number;
  externalId: string;
  rankScore?: number;
  isBookmarked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const feedItemSchema = new Schema<IFeedItemDocument>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    source: { type: String, index: true },
    summary: { type: String, default: "" },
    tags: { type: [String], default: [] },
    category: { type: String },
    popularityScore: { type: Number, default: 0 },
    // externalId must be unique per source — prevent cross-source collisions
    externalId: { type: String, required: true },
    rankScore: { type: Number, default: 0 },
    isBookmarked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Compound unique index: same article can't appear twice from the same source
feedItemSchema.index({ source: 1, externalId: 1 }, { unique: true });

// Text index for full-text search (future feature)
feedItemSchema.index({ title: "text", summary: "text", tags: "text" });

// Performance index for the most common query pattern
feedItemSchema.index({ createdAt: -1, source: 1 });

const FeedItemModel = model<IFeedItemDocument>("FeedItem", feedItemSchema);

export default FeedItemModel;
