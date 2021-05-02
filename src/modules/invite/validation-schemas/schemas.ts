import * as Joi from 'joi';

export const createInviteSchema = Joi.object({
  inviteeId: Joi.number().required(),
  resourceId: Joi.number(),
  wonderId: Joi.number(),
});
