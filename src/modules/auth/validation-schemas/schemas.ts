import * as Joi from 'joi';

export const registrationSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required()
    .error(new Error('Email is required')),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required(),
  firstName: Joi.string().max(20),
  lastName: Joi.string().max(20),
});

export const verificationSchema = Joi.object({
  email: Joi.string().required(),
  verificationCode: Joi.string().required(),
});
