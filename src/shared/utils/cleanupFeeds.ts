import FeedItemModel from "../../modules/feed/feed.model";

export const cleanupOldFeeds = async () => {
  try {
    const daysToKeep = 1;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await FeedItemModel.deleteMany({
      createdAt: { $lt: cutoffDate },
      isBookmarked: { $ne: true },
    });

    console.log(`Cleanup complete — removed ${result.deletedCount} old feeds.`);
  } catch (err) {
    console.error("Failed to clean up old feeds:", err);
  }
};
