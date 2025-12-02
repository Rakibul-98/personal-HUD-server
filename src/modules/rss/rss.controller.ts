import { Request, Response } from "express";
import RssSource, { IRssSource } from "../../models/RssSource";
import { AuthenticatedRequest } from "../../shared/types";

export const addSource = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { name, url } = req.body;
    const userId = authReq.user?._id;

    const newSource: IRssSource = new RssSource({
      userId,
      name,
      url,
    });

    const source = await newSource.save();
    res.status(201).json(source);
  } catch (error) {
    res.status(500).json({ message: "Error adding RSS source", error });
  }
};

export const getSources = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?._id;
    const sources = await RssSource.find({ userId }).sort({ createdAt: -1 });
    res.json(sources);
  } catch (error) {
    res.status(500).json({ message: "Error fetching RSS sources", error });
  }
};

export const updateSource = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { name, url, isActive } = req.body;
    const source = await RssSource.findOneAndUpdate(
      { _id: req.params.id, userId: authReq.user?._id },
      { name, url, isActive },
      { new: true }
    );

    if (!source) {
      return res.status(404).json({ message: "Source not found" });
    }

    res.json(source);
  } catch (error) {
    res.status(500).json({ message: "Error updating RSS source", error });
  }
};

export const deleteSource = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const source = await RssSource.findOneAndDelete({
      _id: req.params.id,
      userId: authReq.user?._id,
    });

    if (!source) {
      return res.status(404).json({ message: "Source not found" });
    }

    res.json({ message: "Source deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting RSS source", error });
  }
};
