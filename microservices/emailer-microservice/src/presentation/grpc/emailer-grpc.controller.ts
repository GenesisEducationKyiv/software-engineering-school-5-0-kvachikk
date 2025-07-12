import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { EmailerService } from '../../application/services/emailer.service';

interface SubscriptionEmail {
   email: string;
   city: string;
   token: string;
}

@Controller()
export class EmailerGrpcController {
   constructor(private readonly emailerService: EmailerService) {}

   @GrpcMethod('EmailerService', 'SendWelcomeEmail')
   async sendWelcomeEmail(data: SubscriptionEmail) {
      await this.emailerService.sendWelcomeEmail(data.email, data.city, data.token);
      return { success: true };
   }

   @GrpcMethod('EmailerService', 'SendConfirmEmail')
   async sendConfirmEmail(data: SubscriptionEmail) {
      await this.emailerService.sendConfirmEmail(data.email, data.city);
      return { success: true };
   }

   @GrpcMethod('EmailerService', 'SendUnsubscribeEmail')
   async sendUnsubscribeEmail(data: SubscriptionEmail) {
      await this.emailerService.sendUnsubscribeEmail(data.email, data.city);
      return { success: true };
   }
}
