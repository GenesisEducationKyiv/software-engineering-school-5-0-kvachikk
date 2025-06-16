import 'dotenv/config';
import { MailConfig } from './types';

export const mailConfig: MailConfig = {
   apiKey: process.env.MAIL_PROVIDER_API_KEY || '',
   senderEmail: process.env.MAIL_PROVIDER_SENDER_EMAIL || '',
};
