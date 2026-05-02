import { IUserFocus } from "../focus/focus.interface";
import { IUserSettings } from "../settings/settings.interface";
import SettingsModel from "../settings/settings.model";
import { IFeedItem, IRankedFeedItem } from "./feed.interface";
import FeedItemModel, { IFeedItemDocument } from "./feed.model";
import { calculateRank } from "./feed.ranker";

export const createFeedItem = async (
  data: IFeedItem,
): Promise<IFeedItemDocument> => {
  const feedItem = new FeedItemModel(data);
  return feedItem.save();
};

export interface GetFeedsOptions {
  userFocus?: IUserFocus | null;
  userId?: string;
  feedSources?: {
    reddit?: boolean;
    hackerNews?: boolean;
    devTo?: boolean;
  } | null;
  overrideSortingPreference?: IUserSettings["sortingPreference"];
  page?: number;
  limit?: number;
}

export const getFeeds = async ({
  userFocus = null,
  userId,
  feedSources,
  overrideSortingPreference,
  page = 1,
  limit = 20,
}: GetFeedsOptions): Promise<{
  items: IRankedFeedItem[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  let query: any = {};
  let sortingPreference: IUserSettings["sortingPreference"] = "rank";

  if (overrideSortingPreference) {
    sortingPreference = overrideSortingPreference;
  } else if (userId) {
    const settings = await SettingsModel.findOne({ userId }).lean();
    if (settings) sortingPreference = settings.sortingPreference;
  }

  // Topic filter — use $text index if available, fallback to $regex
  if (userFocus?.topics?.length) {
    const regexFilters = userFocus.topics.map((keyword) => ({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { tags: { $in: [new RegExp(keyword, "i")] } },
      ],
    }));
    query.$or = regexFilters.flatMap((f) => f.$or);
  }

  // Source filter
  if (feedSources && typeof feedSources === "object") {
    const selectedSources = Object.entries(feedSources)
      .filter(([, enabled]) => enabled)
      .map(([key]) => {
        if (key === "hackerNews") return "HackerNews";
        if (key === "devTo") return "Dev.to";
        return key.charAt(0).toUpperCase() + key.slice(1);
      });

    if (selectedSources.length > 0) {
      query.source = { $in: selectedSources };
    } else {
      // All sources disabled — return empty
      return { items: [], total: 0, page: 1, totalPages: 0 };
    }
  }

  const safeLimit = Math.min(Math.max(1, limit), 100);
  const safeSkip = (Math.max(1, page) - 1) * safeLimit;

  const [feeds, total] = await Promise.all([
    FeedItemModel.find(query).lean().limit(500), // Fetch enough to rank before slicing
    FeedItemModel.countDocuments(query),
  ]);

  const ranked: IRankedFeedItem[] = feeds.map((f) => ({
    _id: f._id.toString(),
    title: f.title,
    content: f.content,
    source: f.source,
    category: f.category,
    summary: (f as any).summary,
    tags: (f as any).tags,
    popularityScore: f.popularityScore,
    externalId: f.externalId,
    createdAt: f.createdAt,
    rankScore: calculateRank(f as unknown as IFeedItem, userFocus),
  }));

  let sorted: IRankedFeedItem[];
  switch (sortingPreference) {
    case "latest":
      sorted = ranked.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime(),
      );
      break;
    case "popularity":
      sorted = ranked.sort(
        (a, b) => (b.popularityScore || 0) - (a.popularityScore || 0),
      );
      break;
    case "rank":
    default:
      sorted = ranked.sort((a, b) => b.rankScore - a.rankScore);
      break;
  }

  const paginated = sorted.slice(safeSkip, safeSkip + safeLimit);

  return {
    items: paginated,
    total,
    page,
    totalPages: Math.ceil(total / safeLimit),
  };
};

export const getFeedById = async (
  id: string,
): Promise<IFeedItemDocument | null> => {
  return FeedItemModel.findById(id);
};
