export const validationMessages = {
   CITY_REQUIRED: 'City is required',
   CITY_TOO_SHORT: 'City name must be at least 2 characters long',
   EMAIL_INVALID: 'Please provide a valid email address',
   EMAIL_REQUIRED: 'Email is required',

   FREQUENCY_REQUIRED: 'Frequency is required',
   FREQUENCY_INVALID: 'Frequency must be a string',

   TOKEN_REQUIRED: 'Token is required',
   TOKEN_INVALID: 'Token must be a string',
} as const;
