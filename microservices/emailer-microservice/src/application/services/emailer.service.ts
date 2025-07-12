import { Inject, Injectable } from '@nestjs/common';
import { Resend } from 'resend';

import { ApplicationConfig } from '../../domain/types/configurations/application-config';
import { MailConfig } from '../../domain/types/configurations/mail-config';
import { Subscription } from '../../domain/types/subscription';
import { TemplateLetterParams } from '../../domain/types/template-letter-params';
import { AppLogger } from '../../shared/logger/logger.service';
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
      private readonly logger: AppLogger,
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
      this.logger.info(`Preparing email: ${subject} to ${to}`);
      const html = this.templateService.compile(templatePath, templateVars);
      const senderEmail = this.mailConfig.senderEmail;

      const letter = { from: senderEmail, to, subject, html, text };
      if (this.emailValidation.isValidLetter(letter)) {
         this.logger.debug('Sending email', 'EmailerService', letter);
         await this.resend.emails.send({
            from: senderEmail,
            to,
            subject,
            html,
         });
         this.logger.info(`Email sent: ${subject} to ${to}`);
      } else {
         this.logger.warn(`Invalid email data: ${JSON.stringify(letter)}`);
      }
   }

   public async sendForecastEmail(subscription: Subscription): Promise<void> {
      this.logger.info(`Sending forecast email to ${subscription.email}`);
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

   public async sendWelcomeEmail(email: string, city: string, token: string): Promise<void> {
      await this.sendTemplateLetter({
         to: email,
         subject: 'Welcome to Weather Subscription',
         templatePath: 'welcome.html',
         templateVars: {
            city,
            confirmUrl: `${this.applicationConfig.baseUrl}/confirm?token=${token}`,
         },
      });
   }

   public async sendConfirmEmail(email: string, city: string): Promise<void> {
      await this.sendTemplateLetter({
         to: email,
         subject: 'Subscription confirmed',
         templatePath: 'confirm.html',
         templateVars: {
            city,
         },
      });
   }

   public async sendUnsubscribeEmail(email: string, city: string): Promise<void> {
      await this.sendTemplateLetter({
         to: email,
         subject: 'You have been unsubscribed',
         templatePath: 'unsubscribe.html',
         templateVars: {
            city,
         },
      });
   }
}
