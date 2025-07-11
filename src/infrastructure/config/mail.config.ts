import 'dotenv/config';
import { Provider } from '@nestjs/common';

import { MailConfig } from '../../domain/types/configurations/mail-config';
import { MAIL_CONFIG } from '../../shared/tokens/config-tokens';

export const mailConfig: MailConfig = {
   apiKey: process.env.MAIL_PROVIDER_API_KEY || '',
   senderEmail: process.env.MAIL_PROVIDER_SENDER_EMAIL || '',
};

export const MailConfigProvider: Provider = {
   provide: MAIL_CONFIG,
   useValue: mailConfig,
};
