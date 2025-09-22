import { IFeedItem } from "./feed.interface";
import FeedItemModel, { IFeedItemDocument } from "./feed.model";

export const createFeedItem = async (
  data: IFeedItem
): Promise<IFeedItemDocument> => {
  const feedItem = new FeedItemModel(data);
  return feedItem.save();
};

export const getFeeds = async (): Promise<IFeedItemDocument[]> => {
  return FeedItemModel.find().sort({ popularityScore: -1, createdAt: -1 });
};

export const getFeedById = async (
  id: string
): Promise<IFeedItemDocument | null> => {
  return FeedItemModel.findById(id);
};
