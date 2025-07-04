import Joi from 'joi';

import { validationMessages } from '../../domain/constants/message/validation';

export const verifyTokenSchema = Joi.object({
   token: Joi.string().required().messages({
      'any.required': validationMessages.TOKEN_REQUIRED,
      'string.empty': validationMessages.TOKEN_REQUIRED,
   }),
});
