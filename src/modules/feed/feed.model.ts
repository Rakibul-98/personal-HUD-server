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
  rankScore: { type: Number; default: 0 };
  createdAt?: Date;
}

const feedItemSchema = new Schema<IFeedItemDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    source: { type: String },
    summary: { type: String, default: "" },
    tags: { type: [String], default: [] },
    category: { type: String },
    popularityScore: { type: Number, default: 0 },
    externalId: { type: String, required: true, index: true },
    rankScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const FeedItemModel = model<IFeedItemDocument>("FeedItem", feedItemSchema);

export default FeedItemModel;
