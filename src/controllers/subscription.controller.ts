import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UsePipes } from '@nestjs/common';

import { subscriptionResponseMessages as messages } from '../constants/message/subscription-responses';
import { SubscribeDto } from '../dtos/subscribe.dto';
import { SubscriptionService } from '../services/subscription/subscription.service';
import { JoiValidationPipe } from '../validation';
import { subscriptionSchema } from '../validation/subscription.validation';
import { verifyEmailSchema } from '../validation/verification.validation';

@Controller()
export class SubscriptionController {
   constructor(private readonly subscriptionService: SubscriptionService) {}

   @Post('subscribe')
   @UsePipes(new JoiValidationPipe(subscriptionSchema))
   async subscribe(@Body() body: SubscribeDto): Promise<{ message: string }> {
      const { email, city, frequency } = body;
      await this.subscriptionService.subscribe(email, city, frequency);
      return { message: messages.SUBSCRIBE_SUCCESS };
   }

   @Get('confirm/:token')
   @HttpCode(HttpStatus.OK)
   @UsePipes(new JoiValidationPipe(verifyEmailSchema))
   async confirm(@Param() params: { token: string }): Promise<{ message: string }> {
      const { token } = params;
      await this.subscriptionService.confirmSubscription(token);
      return { message: messages.CONFIRM_SUCCESS };
   }

   @Get('unsubscribe/:token')
   @HttpCode(HttpStatus.OK)
   @UsePipes(new JoiValidationPipe(verifyEmailSchema))
   async unsubscribe(@Param() params: { token: string }): Promise<{ message: string }> {
      const { token } = params;
      await this.subscriptionService.unsubscribe(token);
      return { message: messages.UNSUBSCRIBE_SUCCESS };
   }
}
