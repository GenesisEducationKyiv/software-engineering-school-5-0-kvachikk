import * as fs from 'node:fs';
import * as path from 'node:path';
import * as handlebars from 'handlebars';
import { Resend } from 'resend';
import { Injectable } from '@nestjs/common';
import { EmailValidationService } from './validation';
import { TemplateLetterParams } from '../../interfaces/TemplateLetterParams';
import { ISubscription } from '../../interfaces/Subscription';
import { appConfig } from '../../config';
import { mailConfig } from '../../config';
import { ITemplateWeatherItem } from '../../interfaces/Forecast';

@Injectable()
export class EmailService {
   private readonly resend: Resend;

   constructor(private readonly emailValidation: EmailValidationService) {
      this.resend = new Resend(mailConfig.apiKey);
   }

   async sendTemplateLetter({
      to,
      subject,
      templatePath,
      templateVars = {},
      text = '',
   }: TemplateLetterParams): Promise<void> {
      let fullPath = path.join(
         __dirname,
         '../../constants/templates',
         templatePath,
      );

      if (!fs.existsSync(fullPath)) {
         // Fallback when running from compiled dist without copied assets
         fullPath = path.join(
            process.cwd(),
            'src/constants/templates',
            templatePath,
         );
      }

      const template = handlebars.compile(fs.readFileSync(fullPath, 'utf8'));
      const html = template(templateVars);

      const senderEmail = mailConfig.senderEmail;

      const letter = {
         from: senderEmail,
         to,
         subject,
         html,
         text,
      };

      if (this.emailValidation.isValidLetter(letter)) {
         await this.resend.emails.send({
            from: senderEmail,
            to: to,
            subject: subject,
            html: html,
         });
      }
   }

   async sendForecastEmail(
      subscription: ISubscription,
      forecast: ITemplateWeatherItem[] | string,
   ): Promise<void> {
      await this.sendTemplateLetter({
         to: subscription.email,
         subject: `Weather forecast for ${subscription.city}`,
         templatePath: 'weather-forecast.html',
         templateVars: {
            city: subscription.city,
            forecast,
            unsubscribeUrl: `${appConfig.baseUrl}/api/unsubscribe/${subscription.verificationToken}`,
         },
      });
   }
}
