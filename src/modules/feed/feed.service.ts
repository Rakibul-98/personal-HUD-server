import { IUserFocus } from "../focus/focus.interface";
import { IUserSettings } from "../settings/settings.interface";
import SettingsModel from "../settings/settings.model";
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
  userFocus: IUserFocus | null = null,
  userId?: string,
  feedSources?: {
    reddit?: boolean;
    hackerNews?: boolean;
    devTo?: boolean;
  } | null,
  overrideSortingPreference?: IUserSettings["sortingPreference"]
): Promise<IRankedFeedItem[]> => {
  let query: any = {};
  let sortingPreference: IUserSettings["sortingPreference"] = "rank";

  if (overrideSortingPreference) {
    sortingPreference = overrideSortingPreference;
  } else if (userId) {
    const settings = await SettingsModel.findOne({ userId });
    if (settings) sortingPreference = settings.sortingPreference;
  }

  if (userFocus?.topics?.length) {
    const regexFilters = userFocus.topics.map((keyword) => ({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
      ],
    }));
    query = { $or: regexFilters };
  }

  if (feedSources) {
    const selectedSources = Object.keys(feedSources).filter(
      (k) => (feedSources as any)[k]
    );
    if (selectedSources.length > 0) {
      if (Object.keys(query).length > 0) {
        query = {
          $and: [{ $or: query.$or }, { source: { $in: selectedSources } }],
        };
      } else {
        query.source = { $in: selectedSources };
      }
    }
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

  let sorted: IRankedFeedItem[] = [];
  switch (sortingPreference) {
    case "latest":
      sorted = ranked.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
      );
      break;
    case "popularity":
      sorted = ranked.sort(
        (a, b) => (b.popularityScore || 0) - (a.popularityScore || 0)
      );
      break;
    case "rank":
    default:
      sorted = ranked.sort((a, b) => b.rankScore - a.rankScore);
      break;
  }

  return sorted.slice(0, 50);
};

export const getFeedById = async (
  id: string
): Promise<IFeedItemDocument | null> => {
  return FeedItemModel.findById(id);
};
