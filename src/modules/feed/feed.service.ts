import { IFeedItem, IRankedFeedItem } from "./feed.interface";
import FeedItemModel, { IFeedItemDocument } from "./feed.model";
import { calculateRank } from "./feed.ranker";
import { IUserFocus } from "../focus/focus.model";

export const createFeedItem = async (
  data: IFeedItem
): Promise<IFeedItemDocument> => {
  const feedItem = new FeedItemModel(data);
  return feedItem.save();
};

export const getFeeds = async (
  userFocus: IUserFocus | null = null
): Promise<IRankedFeedItem[]> => {
  const feeds: any[] = await FeedItemModel.find().lean().limit(200);

  const ranked: IRankedFeedItem[] = feeds.map((f) => {
    return {
      _id: f._id.toString(),
      title: f.title,
      content: f.content,
      source: f.source,
      category: f.category,
      popularityScore: f.popularityScore,
      externalId: f.externalId,
      createdAt: f.createdAt,
      rankScore: calculateRank(f, userFocus),
    };
  });

  ranked.sort((a, b) => b.rankScore - a.rankScore);

  return ranked.slice(0, 50);
};

export const getFeedById = async (
  id: string
): Promise<IFeedItemDocument | null> => {
  return FeedItemModel.findById(id);
};
