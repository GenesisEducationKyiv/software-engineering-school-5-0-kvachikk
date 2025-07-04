import Joi from 'joi';

import { validationMessages } from '../../domain/constants/message/validation';

export const subscriptionSchema = Joi.object({
   email: Joi.string().email().required().trim().messages({
      'string.email': validationMessages.EMAIL_INVALID,
      'any.required': validationMessages.EMAIL_REQUIRED,
      'string.empty': validationMessages.EMAIL_REQUIRED,
   }),

   city: Joi.string().min(2).required().trim().messages({
      'string.min': validationMessages.CITY_TOO_SHORT,
      'any.required': validationMessages.CITY_REQUIRED,
      'string.empty': validationMessages.CITY_REQUIRED,
   }),

   frequency: Joi.string().required().messages({
      'any.required': validationMessages.FREQUENCY_REQUIRED,
      'string.base': validationMessages.FREQUENCY_INVALID,
      'string.empty': validationMessages.FREQUENCY_REQUIRED,
   }),
});

export const updateSubscriptionSchema = Joi.object({
   email: Joi.string().email().trim().messages({
      'string.email': validationMessages.EMAIL_INVALID,
   }),

   city: Joi.string().min(2).trim().messages({
      'string.min': validationMessages.CITY_TOO_SHORT,
   }),

   frequency: Joi.string().messages({
      'string.base': validationMessages.FREQUENCY_INVALID,
   }),

   isActive: Joi.boolean(),
});
