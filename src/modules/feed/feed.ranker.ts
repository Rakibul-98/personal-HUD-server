import { IUserFocus } from "../focus/focus.interface";
import { IFeedItem } from "./feed.interface";

/**
 * Calculates a relevance + freshness rank score for a feed item.
 *
 * Score breakdown:
 *  - Popularity: raw score (normalised to avoid one viral post dominating)
 *  - Freshness: up to 50 points, decays linearly over 48h (was 50h)
 *  - Topic match: 20 pts per matched topic (not just first match)
 *  - Exact title match bonus: +10 extra per topic
 */
export const calculateRank = (
  feed: IFeedItem,
  userFocus: IUserFocus | null
): number => {
  let score = 0;

  // Normalise popularity so a 10k-upvote post doesn't bury everything else
  const popularity = feed.popularityScore ?? 0;
  score += Math.log10(popularity + 1) * 10;

  // Freshness decay over 48 hours
  if (feed.createdAt) {
    const hoursOld =
      (Date.now() - new Date(feed.createdAt).getTime()) / (1000 * 60 * 60);
    score += Math.max(0, 50 - hoursOld * (50 / 48));
  }

  // Topic relevance — check title AND tags (not just title)
  if (userFocus?.topics?.length) {
    const titleLower = feed.title.toLowerCase();
    const tagsLower = (feed as any).tags?.map((t: string) => t.toLowerCase()) ?? [];

    for (const topic of userFocus.topics) {
      const topicLower = topic.toLowerCase();

      const inTitle = titleLower.includes(topicLower);
      const inTags = tagsLower.some((tag: string) => tag.includes(topicLower));

      if (inTitle || inTags) {
        score += 20;
        if (inTitle) score += 10; // bonus for title match
      }
    }
  }

  return Math.round(score * 10) / 10;
};
