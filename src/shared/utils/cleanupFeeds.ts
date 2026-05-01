import FeedItemModel from "../../modules/feed/feed.model";
import { logger } from "./logger";

/**
 * Removes old feed items that:
 *  - are older than RETENTION_DAYS
 *  - are NOT bookmarked by any user
 *
 * RSS-sourced items with a summary (LLM-enriched) get a longer retention
 * since they have more value and cost tokens to generate.
 */
export const cleanupOldFeeds = async (): Promise<void> => {
  try {
    const now = new Date();

    // Standard items: keep for 2 days
    const standardCutoff = new Date(now);
    standardCutoff.setDate(now.getDate() - 2);

    // LLM-enriched items (have a summary): keep for 7 days
    const enrichedCutoff = new Date(now);
    enrichedCutoff.setDate(now.getDate() - 7);

    const result = await FeedItemModel.deleteMany({
      $and: [
        // Not bookmarked
        { isBookmarked: { $ne: true } },
        {
          $or: [
            // Standard items older than 2 days
            {
              summary: { $in: [null, ""] },
              createdAt: { $lt: standardCutoff },
            },
            // Enriched items older than 7 days
            {
              summary: { $exists: true, $ne: "" },
              createdAt: { $lt: enrichedCutoff },
            },
          ],
        },
      ],
    });

    console.log(`Feed cleanup: removed ${result.deletedCount} old items`);
  } catch (err: any) {
    console.log(`Feed cleanup failed: ${err.message}`);
  }
};
