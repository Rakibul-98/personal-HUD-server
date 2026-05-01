import { IUserFocusDoc } from "./focus.interface";
import Focus from "./focus.model";
import { AppError } from "../../shared/middlewares/errorHandler";

const MAX_TOPICS = 20;

export const getUserFocus = async (userId: string): Promise<IUserFocusDoc> => {
  let focus = await Focus.findOne({ userId });
  if (!focus) {
    focus = await Focus.create({ userId, topics: [] });
  }
  return focus;
};

export const addKeyword = async (userId: string, keyword: string) => {
  const focus = await getUserFocus(userId);

  if (focus.topics.length >= MAX_TOPICS) {
    throw new AppError(400, `You can follow up to ${MAX_TOPICS} topics. Remove one to add a new one.`);
  }

  if (focus.topics.includes(keyword)) {
    return focus; // Idempotent — already exists, just return
  }

  focus.topics.push(keyword);
  await focus.save();
  return focus;
};

export const removeKeyword = async (userId: string, keyword: string) => {
  const focus = await getUserFocus(userId);
  const before = focus.topics.length;
  focus.topics = focus.topics.filter((k) => k !== keyword);

  if (focus.topics.length === before) {
    throw new AppError(404, `Topic "${keyword}" not found in your focus list`);
  }

  await focus.save();
  return focus;
};
