import { Request, Response } from "express";
import * as focusService from "./focus.service";
import { AuthenticatedRequest } from "../../shared/types";
import { AppError } from "../../shared/middlewares/errorHandler";

export const getFocus = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.user!._id.toString();

  const focus = await focusService.getUserFocus(userId);
  res.json({ success: true, data: focus });
};

export const addFocusKeyword = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.user!._id.toString();
  const { keyword } = req.body;

  if (!keyword || typeof keyword !== "string" || keyword.trim().length === 0) {
    throw new AppError(400, "A non-empty keyword is required");
  }

  const trimmed = keyword.trim().toLowerCase();
  if (trimmed.length > 50) {
    throw new AppError(400, "Keyword must be 50 characters or fewer");
  }

  const focus = await focusService.addKeyword(userId, trimmed);
  res.json({ success: true, data: focus });
};

export const removeFocusKeyword = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.user!._id.toString();
  const { keyword } = req.body;

  if (!keyword) throw new AppError(400, "Keyword is required");

  const focus = await focusService.removeKeyword(userId, keyword.trim().toLowerCase());
  res.json({ success: true, data: focus });
};
