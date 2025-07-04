import Joi from 'joi';

import { validationMessages } from '../../shared/constants/message/validation';

export const weatherParamsSchema = Joi.object({
   city: Joi.string().min(2).required().trim().messages({
      'string.min': validationMessages.WEATHER_CITY_TOO_SHORT,
      'any.required': validationMessages.WEATHER_CITY_REQUIRED,
      'string.empty': validationMessages.WEATHER_CITY_REQUIRED,
   }),
});
