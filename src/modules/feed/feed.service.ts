import { IUserFocus } from "../focus/focus.interface";
import { IFeedItem, IRankedFeedItem } from "./feed.interface";
import FeedItemModel, { IFeedItemDocument } from "./feed.model";
import { calculateRank } from "./feed.ranker";

export const createFeedItem = async (
  data: IFeedItem
): Promise<IFeedItemDocument> => {
  const feedItem = new FeedItemModel(data);
  return feedItem.save();
};

export const getFeeds = async (
  userFocus: IUserFocus | null = null
): Promise<IRankedFeedItem[]> => {
  let query = {};

  if (userFocus && userFocus.topics.length > 0) {
    const regexFilters = userFocus.topics.map((keyword) => ({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
      ],
    }));

    query = { $or: regexFilters };
  }

  const feeds: any[] = await FeedItemModel.find(query).lean().limit(200);

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
