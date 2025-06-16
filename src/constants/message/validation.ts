export const validationMessages = {
   EMAIL_INVALID: 'Please provide a valid email address',
   EMAIL_REQUIRED: 'Email is required',

   CITY_REQUIRED: 'City is required',
   CITY_TOO_SHORT: 'City name must be at least 2 characters long',

   FREQUENCY_REQUIRED: 'FrequencyModel is required',
   FREQUENCY_INVALID: 'FrequencyModel must be a string',

   TOKEN_REQUIRED: 'Token is required',
   TOKEN_INVALID: 'Token must be a string',

   WEATHER_CITY_REQUIRED: 'City parameter is required',
   WEATHER_CITY_TOO_SHORT: 'City name must be at least 2 characters long',

   LETTER_SENDER_INVALID: 'Invalid sender email address: ',
   LETTER_RECIPIENT_INVALID: 'Invalid recipient email address: ',
   LETTER_SUBJECT_REQUIRED: 'Subject is required and must be a string',
   LETTER_HTML_REQUIRED: 'HTML content is required and must be a string',
   LETTER_TEXT_INVALID: 'Text content is optional, but if provided, it must be a string',
} as const;
