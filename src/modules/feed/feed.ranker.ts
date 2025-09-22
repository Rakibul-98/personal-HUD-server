import { IUserFocus } from "../focus/focus.interface";
import { IFeedItem } from "./feed.interface";

export const calculateRank = (
  feed: IFeedItem,
  userFocus: IUserFocus | null
): number => {
  let score = 0;

  score += feed.popularityScore ?? 0;

  if (feed.createdAt) {
    const hoursOld =
      (Date.now() - new Date(feed.createdAt).getTime()) / (1000 * 60 * 60);
    score += Math.max(0, 50 - hoursOld);
  }

  if (userFocus?.topics?.length) {
    const match = userFocus.topics.some((topic) =>
      feed.title.toLowerCase().includes(topic.toLowerCase())
    );
    if (match) score += 20;
  }

  return score;
};
