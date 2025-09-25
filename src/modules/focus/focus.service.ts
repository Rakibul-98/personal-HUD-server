import { IUserFocus } from "./focus.interface";
import Focus from "./focus.model";

export const getUserFocus = async (userId: string): Promise<IUserFocus> => {
  let focus = await Focus.findOne({ userId });
  if (!focus) {
    focus = new Focus({ userId, topics: [] });
    await focus.save();
  }
  return focus;
};

export const addKeyword = async (userId: string, keyword: string) => {
  const focus = await getUserFocus(userId);
  if (!focus.topics.includes(keyword)) {
    focus.topics.push(keyword);
    await focus.save();
  }
  return focus;
};

export const removeKeyword = async (userId: string, keyword: string) => {
  const focus = await getUserFocus(userId);
  focus.topics = focus.topics.filter((k) => k !== keyword);
  await focus.save();
  return focus;
};
