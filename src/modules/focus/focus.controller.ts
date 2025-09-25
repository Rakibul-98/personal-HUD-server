import { Request, Response } from "express";
import * as focusService from "./focus.service";

export const getFocus = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const focus = await focusService.getUserFocus(userId);
    res.json(focus);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const addFocusKeyword = async (req: Request, res: Response) => {
  try {
    const { userId, keyword } = req.body;
    if (!keyword)
      return res.status(400).json({ message: "Keyword is required" });

    const focus = await focusService.addKeyword(userId, keyword);
    res.json(focus);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFocusKeyword = async (req: Request, res: Response) => {
  try {
    const { userId, keyword } = req.body;
    if (!keyword)
      return res.status(400).json({ message: "Keyword is required" });

    const focus = await focusService.removeKeyword(userId, keyword);
    res.json(focus);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
