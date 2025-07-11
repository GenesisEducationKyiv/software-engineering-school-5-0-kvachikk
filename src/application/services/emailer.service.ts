import { Injectable, Inject } from '@nestjs/common';
import { Resend } from 'resend';

import { ApplicationConfig } from '../../domain/types/configurations/application-config';
import { MailConfig } from '../../domain/types/configurations/mail-config';
import { Subscription } from '../../domain/types/subscription';
import { TemplateLetterParams } from '../../domain/types/template-letter-params';
import { APPLICATION_CONFIG, MAIL_CONFIG } from '../../shared/tokens/config-tokens';

import { EmailTemplateService } from './email-template.service';
import { EmailValidationService } from './validator.service';
import { WeatherService } from './weather.service';

@Injectable()
export class EmailerService {
   private readonly resend: Resend;

   constructor(
      private readonly emailValidation: EmailValidationService,
      private readonly weatherService: WeatherService,
      private readonly templateService: EmailTemplateService,
      @Inject(MAIL_CONFIG) private readonly mailConfig: MailConfig,
      @Inject(APPLICATION_CONFIG) private readonly applicationConfig: ApplicationConfig,
   ) {
      this.resend = new Resend(this.mailConfig.apiKey);
   }

   public async sendTemplateLetter({
      to,
      subject,
      templatePath,
      templateVars = {},
      text = '',
   }: TemplateLetterParams): Promise<void> {
      const html = this.templateService.compile(templatePath, templateVars);
      const senderEmail = this.mailConfig.senderEmail;
      const letter = { from: senderEmail, to, subject, html, text };

      if (this.emailValidation.isValidLetter(letter)) {
         await this.resend.emails.send({
            from: senderEmail,
            to,
            subject,
            html,
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
            confirmUrl: `${this.applicationConfig.baseUrl}/confirm?token=${token}`,
            unsubscribeUrl: `${this.applicationConfig.baseUrl}/unsubscribe?token=${token}`,
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
            unsubscribeUrl: `${this.applicationConfig.baseUrl}/unsubscribe?token=${token}`,
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
            subscribe: `${this.applicationConfig.baseUrl}/confirm?token=${token}`,
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
            unsubscribeUrl: `${this.applicationConfig.baseUrl}/unsubscribe?token=${subscription.verificationToken}`,
         },
      });
   }
}
