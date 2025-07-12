import * as Joi from 'joi';

import { validationMessages } from '../../shared/constants/validation.messages';

export const weatherParamsSchema = Joi.object({
   city: Joi.string().min(2).required().trim().messages({
      'string.min': validationMessages.CITY_TOO_SHORT,
      'any.required': validationMessages.CITY_REQUIRED,
      'string.empty': validationMessages.CITY_REQUIRED,
   }),
});
