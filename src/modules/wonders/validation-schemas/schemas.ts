import * as Joi from 'joi';

export const createWonderSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().max(1000),
  visibilityId: Joi.number().required(),
  coverPhoto: Joi.any(),
});
