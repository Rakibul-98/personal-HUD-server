import { Request, Response } from "express";
import { fetchFeedsForAllUsers } from "./fetchers/feedScheduler";
import { cleanupOldFeeds } from "../../shared/utils/cleanupFeeds";
import { AuthenticatedRequest } from "../../shared/types";
import { logger } from "../../shared/utils/logger";
import { AppError } from "../../shared/middlewares/errorHandler";

export const refreshFeeds = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  // Use authenticated user ID — don't trust client-supplied userId
  const userId = authReq.user?._id?.toString();
  if (!userId) throw new AppError(401, "Authentication required");

  const { feedSources } = req.body;

  console.log(`Manual feed refresh triggered by user: ${userId}`);

  await fetchFeedsForAllUsers(userId, feedSources);
  await cleanupOldFeeds();

  res.json({ success: true, message: "Feeds refreshed successfully" });
};
