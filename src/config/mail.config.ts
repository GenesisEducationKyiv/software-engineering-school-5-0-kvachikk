import 'dotenv/config';
import { MailConfig } from '../types/configurations/mail-config';

export const mailConfig: MailConfig = {
   apiKey: process.env.MAIL_PROVIDER_API_KEY || '',
   senderEmail: process.env.MAIL_PROVIDER_SENDER_EMAIL || '',
};
