import { Request, Response } from "express";
import AnalyticsEvent from "../../models/AnalyticsEvent";
import FeedItemModel from "../feed/feed.model";
import { AuthenticatedRequest } from "../../shared/types";
import mongoose from "mongoose";

export const logEvent = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { eventType, targetId, data } = req.body;
    const userId = new mongoose.Types.ObjectId(authReq.user!._id);

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const newEvent = new AnalyticsEvent({
      userId,
      eventType,
      targetId,
      data,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event logged successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging event", error });
  }
};

export const getMostSavedTopics = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = new mongoose.Types.ObjectId(authReq.user!._id);

    // Get all bookmark events
    const bookmarkEvents = await AnalyticsEvent.find({
      userId,
      eventType: "BOOKMARK_SAVE",
    }).select("targetId");

    // Get unique article IDs
    const articleIds = [...new Set(bookmarkEvents.map((e) => e.targetId))].map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    if (articleIds.length === 0) return res.json([]);

    // Fetch articles with tags
    const articles = await FeedItemModel.find({
      _id: { $in: articleIds },
    }).select("tags");

    const tagCounts: Record<string, number> = {};

    articles.forEach((article) => {
      article.tags?.forEach((tag) => {
        if (tag) {
          const key = tag.toLowerCase();
          tagCounts[key] = (tagCounts[key] || 0) + 1;
        }
      });
    });

    const sortedTopics = Object.entries(tagCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10

    res.json(sortedTopics);
  } catch (err) {
    res.status(500).json({ message: "Error fetching most saved topics", err });
  }
};

export const getKeywordTrends = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = new mongoose.Types.ObjectId(authReq.user!._id);

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
          data: {
            $push: {
              date: "$_id.date",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          keyword: "$_id",
          data: 1,
        },
      },
    ]);

    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: "Error fetching keyword trends", error });
  }
};

export const getUserActivity = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = new mongoose.Types.ObjectId(authReq.user!._id);

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
        $project: {
          eventType: "$_id",
          count: 1,
          lastActivity: 1,
          _id: 0,
        },
      },
    ]);

    res.json({
      userId,
      activityCounts,
      totalEvents: activityCounts.reduce((sum, i) => sum + i.count, 0),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user activity", error });
  }
};
