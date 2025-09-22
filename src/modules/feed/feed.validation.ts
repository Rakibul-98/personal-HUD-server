import Joi from "joi";

export const createFeedSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  source: Joi.string().optional(),
  category: Joi.string().optional(),
});
