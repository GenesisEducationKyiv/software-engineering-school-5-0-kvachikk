import { Injectable, OnModuleInit } from '@nestjs/common';

import { EmailerService } from '../../application/services/emailer.service';
import {
   WelcomeEmailPayload,
   UnsubscribeEmailPayload,
   ConfirmEmailPayload,
} from '../../presentation/dtos/email-payload.dto';

import { ConsumerService } from './consumer';

@Injectable()
export class EmailsConsumer implements OnModuleInit {
   constructor(
      private readonly consumerService: ConsumerService,
      private readonly emailer: EmailerService,
   ) {}

   async onModuleInit() {
      await this.consumerService.consume(
         { topics: [/^emails-/] },
         {
            eachMessage: async ({ topic, message }) => {
               if (!message.value) return;

               const rawData = JSON.parse(message.value.toString());

               switch (topic) {
                  case 'emails-welcome': {
                     const welcomeData = rawData as WelcomeEmailPayload;
                     await this.emailer.sendWelcomeEmail(welcomeData.email, welcomeData.city, welcomeData.token);
                     break;
                  }
                  case 'emails-confirm': {
                     const confirmData = rawData as ConfirmEmailPayload;
                     await this.emailer.sendConfirmEmail(confirmData.email, confirmData.city);
                     break;
                  }

                  case 'emails-unsubscribe': {
                     const unsubscribeData = rawData as UnsubscribeEmailPayload;
                     await this.emailer.sendUnsubscribeEmail(unsubscribeData.email, unsubscribeData.city);
                     break;
                  }
               }
            },
         },
      );
   }
}
