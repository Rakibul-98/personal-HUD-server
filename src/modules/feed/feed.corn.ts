import { Request, Response } from "express";
import { fetchFeedsForAllUsers } from "./fetchers/feedScheduler";

export const refreshFeeds = async (req: Request, res: Response) => {
  try {
    ("Cron job triggered: refreshing feeds...");
    await fetchFeedsForAllUsers();
    res.json({ success: true, message: "Feeds refreshed" });
  } catch (error) {
    console.error("Feed refresh error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to refresh feeds" });
  }
};
