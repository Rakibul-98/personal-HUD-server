import Joi from "joi";

export const createBookmarkSchema = Joi.object({
  user: Joi.string().required(),
  feedItem: Joi.string().required(),
});

export const updateBookmarkSchema = Joi.object({
  note: Joi.string().optional().allow(""),
});
