import { Request, Response } from "express";
import * as feedService from "./feed.service";
import { createFeedSchema } from "./feed.validation";
import { IUserFocus } from "../focus/focus.interface";

export const createFeed = async (req: Request, res: Response) => {
  try {
    const { error } = createFeedSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const feed = await feedService.createFeedItem(req.body);
    res.status(201).json(feed);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getFeeds = async (req: Request, res: Response) => {
  try {
    const userFocus: IUserFocus | null = req.body.userFocus || null;
    const userId: string | undefined = req.body.userId;

    const feeds = await feedService.getFeeds(userFocus, userId);
    res.json(feeds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getFeedById = async (req: Request, res: Response) => {
  try {
    const feed = await feedService.getFeedById(req.params.id);
    if (!feed) return res.status(404).json({ error: "Feed item not found" });
    res.json(feed);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
