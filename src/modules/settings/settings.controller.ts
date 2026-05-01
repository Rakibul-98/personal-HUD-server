import { Request, Response } from "express";
import * as settingsService from "./settings.service";
import { AuthenticatedRequest } from "../../shared/types";

export const getSettings = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!._id.toString();
  const settings = await settingsService.getOrCreateUserSettings(userId);
  res.json({ success: true, data: settings });
};

export const updateSettings = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!._id.toString();
  // Strip userId from body — never allow client to change which user's settings
  const { userId: _ignored, ...updates } = req.body;
  const updated = await settingsService.updateUserSettings(userId, updates);
  res.json({ success: true, data: updated });
};

export const fetchNow = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user!._id.toString();
  const fetchedSources = await settingsService.manualFetch(userId);
  res.json({ success: true, message: "Fetch completed", data: { sources: fetchedSources } });
};
