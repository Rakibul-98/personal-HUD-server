import { Request, Response } from "express";
import * as feedService from "./feed.service";
import { createFeedSchema } from "./feed.validation";
import { IUserFocus } from "../focus/focus.interface";
import { AuthenticatedRequest } from "../../shared/types";
import { AppError } from "../../shared/middlewares/errorHandler";

export const createFeed = async (req: Request, res: Response) => {
  const { error } = createFeedSchema.validate(req.body);
  if (error) throw new AppError(400, error.details[0].message);

  const feed = await feedService.createFeedItem(req.body);
  res.status(201).json({ success: true, data: feed });
};

export const getFeeds = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  // Support both GET query params (preferred) and POST body (legacy)
  const body = req.method === "POST" ? req.body : req.query;

  const userFocus: IUserFocus | null = body.userFocus
    ? typeof body.userFocus === "string"
      ? JSON.parse(body.userFocus)
      : body.userFocus
    : null;

  const userId: string | undefined =
    authReq.user?._id?.toString() || body.userId;

  const feedSources = body.feedSources
    ? typeof body.feedSources === "string"
      ? JSON.parse(body.feedSources)
      : body.feedSources
    : null;

  const page = Number(body.page) || 1;
  const limit = Number(body.limit) || 20;
  const sortingPreference = body.sortingPreference;

  const result = await feedService.getFeeds({
    userFocus,
    userId,
    feedSources,
    overrideSortingPreference: sortingPreference,
    page,
    limit,
  } as any);

  res.json({ success: true, ...result });
};

export const getFeedById = async (req: Request, res: Response) => {
  const feed = await feedService.getFeedById(req.params.id);
  if (!feed) throw new AppError(404, "Feed item not found");
  res.json({ success: true, data: feed });
};
