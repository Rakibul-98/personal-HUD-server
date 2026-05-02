import { Request, Response } from "express";
import RssSource from "../../models/RssSource";
import { AuthenticatedRequest } from "../../shared/types";
import { AppError } from "../../shared/middlewares/errorHandler";

const getUserId = (req: Request) => (req as AuthenticatedRequest).user!._id.toString();

export const addSource = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { name, url } = req.body;

  if (!name?.trim()) throw new AppError(400, "Source name is required");
  if (!url?.trim()) throw new AppError(400, "Source URL is required");
  if (!/^https?:\/\/.+/.test(url)) throw new AppError(400, "URL must start with http:// or https://");

  const source = await RssSource.create({ userId, name: name.trim(), url: url.trim() });
  res.status(201).json({ success: true, data: source });
};

export const getSources = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const sources = await RssSource.find({ userId }).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: sources });
};

export const updateSource = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { name, url, isActive } = req.body;

  const updates: Record<string, any> = {};
  if (name !== undefined) updates.name = name.trim();
  if (url !== undefined) {
    if (!/^https?:\/\/.+/.test(url)) throw new AppError(400, "Invalid URL");
    updates.url = url.trim();
  }
  if (isActive !== undefined) updates.isActive = Boolean(isActive);

  const source = await RssSource.findOneAndUpdate(
    { _id: req.params.id, userId },
    updates,
    { new: true, runValidators: true }
  );

  if (!source) throw new AppError(404, "RSS source not found or not owned by you");
  res.json({ success: true, data: source });
};

export const deleteSource = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const source = await RssSource.findOneAndDelete({ _id: req.params.id, userId });
  if (!source) throw new AppError(404, "RSS source not found or not owned by you");
  res.json({ success: true, message: "Source deleted" });
};
