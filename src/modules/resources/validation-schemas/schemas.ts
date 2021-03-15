import * as Joi from 'joi';

export const createResourceSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().max(1000),
  url: Joi.string().max(100),
  resourceTypeId: Joi.number().required(),
  visibilityTypeId: Joi.number().required(),
  image: Joi.any(),
  urlImage: Joi.string().max(200),
  audioClip: Joi.any(),
});

export const updateResourceSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().max(1000),
  url: Joi.string().max(100),
  resourceTypeId: Joi.number().required(),
  visibilityTypeId: Joi.number().required(),
  image: Joi.any(),
  urlImage: Joi.string().max(200),
  audioClip: Joi.any(),
});
