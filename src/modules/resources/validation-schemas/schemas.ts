import * as Joi from 'joi';

export const createResourceSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().max(5000),
  url: Joi.string().max(255),
  resourceTypeId: Joi.number().required(),
  visibilityTypeId: Joi.number().required(),
  image: Joi.any(),
  urlImage: Joi.string().max(255),
  audioClip: Joi.any(),
  keywords: Joi.array().items(Joi.string()),
  wonderId: Joi.number(),
  isSpecial: Joi.boolean(),
});

export const updateResourceSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().max(5000),
  url: Joi.string().max(255),
  resourceTypeId: Joi.number().required(),
  visibilityTypeId: Joi.number().required(),
  image: Joi.any(),
  urlImage: Joi.string().max(255),
  audioClip: Joi.any(),
  keywords: Joi.array().items(Joi.string()),
  imageLink: Joi.string().optional().allow(''),
  audioClipLink: Joi.string().optional().allow(''),
  wonderId: Joi.number(),
  isSpecial: Joi.boolean(),
});
