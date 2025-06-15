import {
   Body,
   Controller,
   Get,
   HttpCode,
   HttpStatus,
   Param,
   Post,
} from '@nestjs/common';

import { SubscriptionService } from '../services/subscription/subscription.service';
import { subscriptionResponseMessages as messages } from '../constants/message/subscription-responses';

class SubscribeDto {
   email: string;
   city: string;
   frequency: string;
}

@Controller()
export class SubscriptionController {
   constructor(private readonly subscriptionService: SubscriptionService) {}

   @Post('subscribe')
   async subscribe(@Body() body: SubscribeDto): Promise<{ message: string }> {
      const { email, city, frequency } = body;
      await this.subscriptionService.subscribe(email, city, frequency);
      return { message: messages.SUBSCRIBE_SUCCESS };
   }

   @Get('confirm/:token')
   @HttpCode(HttpStatus.OK)
   async confirm(@Param('token') token: string): Promise<{ message: string }> {
      await this.subscriptionService.confirmSubscription(token);
      return { message: messages.CONFIRM_SUCCESS };
   }

   @Get('unsubscribe/:token')
   @HttpCode(HttpStatus.OK)
   async unsubscribe(
      @Param('token') token: string,
   ): Promise<{ message: string }> {
      await this.subscriptionService.unsubscribe(token);
      return { message: messages.UNSUBSCRIBE_SUCCESS };
   }
}
