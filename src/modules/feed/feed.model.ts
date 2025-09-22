import { Schema, model, Document } from "mongoose";

export interface IFeedItemDocument extends Document {
  title: string;
  content: string;
  source?: string;
  category?: string;
  popularityScore?: number;
  externalId: string;
  createdAt?: Date;
}

const feedItemSchema = new Schema<IFeedItemDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    source: { type: String },
    category: { type: String },
    popularityScore: { type: Number, default: 0 },
    externalId: { type: String, required: true, index: true }, // 👈 crucial
  },
  { timestamps: true }
);

const FeedItemModel = model<IFeedItemDocument>("FeedItem", feedItemSchema);

export default FeedItemModel;
