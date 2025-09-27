import { Request, Response } from "express";
import { fetchFeedsForAllUsers } from "./fetchers/feedScheduler";
import { cleanupOldFeeds } from "../../shared/utils/cleanupFeeds";

export const refreshFeeds = async (req: Request, res: Response) => {
  try {
    const { userFocus, userId, feedSources } = req.body;

    console.log("Manual refresh triggered:", { userId, feedSources });

    await fetchFeedsForAllUsers(userId, feedSources);
    await cleanupOldFeeds();
    res.json({ success: true, message: "Feeds refreshed" });
  } catch (error) {
    console.error("Feed refresh error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to refresh feeds" });
  }
};
