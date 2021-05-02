import * as Joi from 'joi';

export const createInviteSchema = Joi.object({
  resourceId: Joi.number(),
  wonderId: Joi.number(),
});
