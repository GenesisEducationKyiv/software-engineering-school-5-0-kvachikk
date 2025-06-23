import { Injectable } from '@nestjs/common';

import { appConfig } from '../../config';

import { EmailService } from './sender';

@Injectable()
export class NotificationService {
   constructor(private readonly emailService: EmailService) {}

   async sendWelcomeEmail(to: string, city: string, token: string): Promise<void> {
      await this.emailService.sendTemplateLetter({
         to,
         subject: `Confirm your subscription to ${city}`,
         templatePath: 'welcome.html',
         templateVars: {
            city,
            confirmUrl: `${appConfig.baseUrl}/api/confirm/${token}`,
            unsubscribeUrl: `${appConfig.baseUrl}/api/unsubscribe/${token}`,
         },
      });
   }

   async sendConfirmationEmail(to: string, city: string, token: string): Promise<void> {
      await this.emailService.sendTemplateLetter({
         to,
         subject: `Subscription confirmed for ${city}`,
         templatePath: 'confirmed.html',
         templateVars: {
            city,
            unsubscribeUrl: `${appConfig.baseUrl}/api/unsubscribe/${token}`,
         },
      });
   }

   async sendUnsubscribeEmail(to: string, city: string, token: string): Promise<void> {
      await this.emailService.sendTemplateLetter({
         to,
         subject: `You have unsubscribed from weather updates for ${city}`,
         templatePath: 'unsubscribed.html',
         templateVars: {
            city,
            subscribe: `${appConfig.baseUrl}/api/confirm/${token}`,
         },
      });
   }
}

export { NotificationService as EmailNotificationService };
