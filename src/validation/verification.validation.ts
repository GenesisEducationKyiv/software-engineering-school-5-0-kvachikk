import Joi from 'joi';

import { validationMessages } from '../constants/message/validation';

export const verifyEmailSchema = Joi.object({
   token: Joi.string().required().messages({
      'any.required': validationMessages.TOKEN_REQUIRED,
      'string.empty': validationMessages.TOKEN_REQUIRED,
   }),
});
