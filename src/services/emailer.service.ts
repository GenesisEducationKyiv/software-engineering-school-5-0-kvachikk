import fs from 'node:fs';
import path from 'node:path';

import { Injectable } from '@nestjs/common';
import handlebars from 'handlebars';
import { Resend } from 'resend';

import { applicationConfig, mailConfig } from '../config';
import { Subscription } from '../types/subscription';
import { TemplateLetterParams } from '../types/template-letter-params';

import { EmailValidationService } from './validator.service';
import { WeatherService } from './weather.service';

@Injectable()
export class EmailerService {
   private readonly resend: Resend;

   constructor(
      private readonly emailValidation: EmailValidationService,
      private readonly weatherService: WeatherService,
   ) {
      this.resend = new Resend(mailConfig.apiKey);
   }

   public async sendTemplateLetter({
      to,
      subject,
      templatePath,
      templateVars = {},
      text = '',
   }: TemplateLetterParams): Promise<void> {
      let fullPath = path.join(__dirname, '../../constants/templates', templatePath);

      if (!fs.existsSync(fullPath)) {
         fullPath = path.join(process.cwd(), 'src/constants/templates', templatePath);
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

   public async sendWelcomeEmail(to: string, city: string, token: string): Promise<void> {
      await this.sendTemplateLetter({
         to,
         subject: `Confirm your subscription to ${city}`,
         templatePath: 'welcome.html',
         templateVars: {
            city,
            confirmUrl: `${applicationConfig.baseUrl}/confirm?token=${token}`,
            unsubscribeUrl: `${applicationConfig.baseUrl}/unsubscribe?token=${token}`,
         },
      });
   }

   public async sendConfirmationEmail(to: string, city: string, token: string): Promise<void> {
      await this.sendTemplateLetter({
         to,
         subject: `Subscription confirmed for ${city}`,
         templatePath: 'confirmed.html',
         templateVars: {
            city,
            unsubscribeUrl: `${applicationConfig.baseUrl}/unsubscribe?token=${token}`,
         },
      });
   }

   public async sendUnsubscribeEmail(to: string, city: string, token: string): Promise<void> {
      await this.sendTemplateLetter({
         to,
         subject: `You have unsubscribed from weather updates for ${city}`,
         templatePath: 'unsubscribed.html',
         templateVars: {
            city,
            subscribe: `${applicationConfig.baseUrl}/confirm?token=${token}`,
         },
      });
   }

   public async sendForecastEmail(subscription: Subscription): Promise<void> {
      await this.sendTemplateLetter({
         to: subscription.email,
         subject: `Weather forecast for ${subscription.city}`,
         templatePath: 'weather-forecast.html',
         templateVars: {
            city: subscription.city,
            forecast: await this.weatherService.getWeatherForecast(subscription.city),
            unsubscribeUrl: `${applicationConfig.baseUrl}/unsubscribe?token=${subscription.verificationToken}`,
         },
      });
   }
}
