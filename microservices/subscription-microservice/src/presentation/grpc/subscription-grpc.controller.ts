import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { SubscriptionService } from '../../application/services/subscription.service';

interface SubscribeRequest {
   email: string;
   city: string;
   frequency: string;
}
interface TokenRequest {
   token: string;
}

@Controller()
export class SubscriptionGrpcController {
   constructor(private readonly subscriptionService: SubscriptionService) {}

   @GrpcMethod('SubscriptionService', 'Subscribe')
   async subscribe(data: SubscribeRequest) {
      const sub = await this.subscriptionService.subscribe(data.email, data.city, data.frequency);
      return { success: true, token: sub.verificationToken };
   }

   @GrpcMethod('SubscriptionService', 'Confirm')
   async confirm(data: TokenRequest) {
      await this.subscriptionService.confirmSubscription(data.token);
      return { success: true };
   }

   @GrpcMethod('SubscriptionService', 'Unsubscribe')
   async unsubscribe(data: TokenRequest) {
      await this.subscriptionService.unsubscribe(data.token);
      return { success: true };
   }
}
