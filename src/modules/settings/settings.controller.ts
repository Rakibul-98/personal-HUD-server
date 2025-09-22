import { Request, Response } from "express";
import * as settingsService from "./settings.service";

export const getSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const settings = await settingsService.getUserSettings(userId);
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const updated = await settingsService.updateUserSettings(userId, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update settings" });
  }
};

export const fetchNow = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const fetchedSources = await settingsService.manualFetch(userId);
    res.json({ message: "Fetch completed", sources: fetchedSources });
  } catch (err) {
    res.status(500).json({ error: "Manual fetch failed" });
  }
};
