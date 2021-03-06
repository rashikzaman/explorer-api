import * as Joi from 'joi';

export const createWonderSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().max(5000),
  coverPhoto: Joi.any(),
});

export const updateWonderSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().max(5000),
  coverPhoto: Joi.any(),
  visibilityTypeId: Joi.number(),
});
