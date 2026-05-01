import { Request, Response } from "express";
import AnalyticsEvent from "../../models/AnalyticsEvent";
import FeedItemModel from "../feed/feed.model";
import { AuthenticatedRequest } from "../../shared/types";
import mongoose from "mongoose";
import { AppError } from "../../shared/middlewares/errorHandler";

const VALID_EVENT_TYPES = [
  "BOOKMARK_SAVE",
  "BOOKMARK_REMOVE",
  "FEED_CLICK",
  "KEYWORD_FOCUS",
  "KEYWORD_REMOVE",
  "FEED_REFRESH",
] as const;

type EventType = (typeof VALID_EVENT_TYPES)[number];

const getUserId = (req: Request): mongoose.Types.ObjectId => {
  const authReq = req as AuthenticatedRequest;
  const id = authReq.user?._id;
  if (!id) throw new AppError(401, "Authentication required");
  try {
    return new mongoose.Types.ObjectId(id);
  } catch {
    throw new AppError(401, "Invalid user session");
  }
};

export const logEvent = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { eventType, targetId, data } = req.body;

  if (!VALID_EVENT_TYPES.includes(eventType as EventType)) {
    throw new AppError(
      400,
      `Invalid eventType. Must be one of: ${VALID_EVENT_TYPES.join(", ")}`
    );
  }

  await AnalyticsEvent.create({ userId, eventType, targetId, data });
  res.status(201).json({ success: true, message: "Event logged" });
};

export const getMostSavedTopics = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const bookmarkEvents = await AnalyticsEvent.find({
    userId,
    eventType: "BOOKMARK_SAVE",
  })
    .select("targetId")
    .lean();

  if (bookmarkEvents.length === 0) {
    return res.json({ success: true, data: [] });
  }

  const articleIds = [
    ...new Set(bookmarkEvents.map((e) => e.targetId?.toString()).filter(Boolean)),
  ].map((id) => new mongoose.Types.ObjectId(id as string));

  const articles = await FeedItemModel.find({ _id: { $in: articleIds } })
    .select("tags")
    .lean();

  const tagCounts: Record<string, number> = {};
  articles.forEach((article) => {
    article.tags?.forEach((tag) => {
      if (tag) tagCounts[tag.toLowerCase()] = (tagCounts[tag.toLowerCase()] || 0) + 1;
    });
  });

  const sortedTopics = Object.entries(tagCounts)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  res.json({ success: true, data: sortedTopics });
};

export const getKeywordTrends = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const trends = await AnalyticsEvent.aggregate([
    {
      $match: {
        userId,
        eventType: "KEYWORD_FOCUS",
        "data.keyword": { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: {
          keyword: "$data.keyword",
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.keyword",
        data: { $push: { date: "$_id.date", count: "$count" } },
      },
    },
    {
      $project: { _id: 0, keyword: "$_id", data: 1 },
    },
    { $sort: { keyword: 1 } },
    { $limit: 50 },
  ]);

  res.json({ success: true, data: trends });
};

export const getUserActivity = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const activityCounts = await AnalyticsEvent.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: "$eventType",
        count: { $sum: 1 },
        lastActivity: { $max: "$createdAt" },
      },
    },
    {
      $project: { eventType: "$_id", count: 1, lastActivity: 1, _id: 0 },
    },
    { $sort: { count: -1 } },
  ]);

  res.json({
    success: true,
    data: {
      activityCounts,
      totalEvents: activityCounts.reduce((sum, i) => sum + i.count, 0),
    },
  });
};
