import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { subscriptionResponseMessages as messages } from '../constants/message/subscription-responses';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';
import { SubscriptionService } from '../services/subscription/subscription.service';
import { JoiValidationPipe } from '../validation';
import { subscriptionSchema } from '../validation/subscription.validation';
import { verifyTokenSchema } from '../validation/verification.validation';

const tokenQueryDecorator = ApiQuery({
   name: 'token',
   type: String,
   description: 'Token provided in email',
});

@ApiTags('Subscription')
@Controller()
export class SubscriptionController {
   constructor(private readonly subscriptionService: SubscriptionService) {}

   @Post('subscribe')
   @ApiOperation({ summary: 'Subscribe for weather notifications' })
   @ApiResponse({ status: 201, description: 'Subscription created successfully.' })
   @UsePipes(new JoiValidationPipe(subscriptionSchema))
   async subscribe(@Body() { email, city, frequency }: CreateSubscriptionDto): Promise<{ message: string }> {
      await this.subscriptionService.subscribe(email, city, frequency);
      return { message: messages.SUBSCRIBE_SUCCESS };
   }

   @Get('confirm')
   @tokenQueryDecorator
   @ApiOperation({ summary: 'Confirm email subscription' })
   @ApiResponse({ status: 200, description: 'Subscription confirmed.' })
   @UsePipes(new JoiValidationPipe(verifyTokenSchema))
   async confirm(@Query() query: { token: string }): Promise<{ message: string }> {
      await this.subscriptionService.confirmSubscription(query.token);
      return { message: messages.CONFIRM_SUCCESS };
   }

   @Get('unsubscribe')
   @tokenQueryDecorator
   @ApiOperation({ summary: 'Unsubscribe from notifications' })
   @ApiResponse({ status: 200, description: 'Unsubscribed successfully.' })
   @UsePipes(new JoiValidationPipe(verifyTokenSchema))
   async unsubscribe(@Query() query: { token: string }): Promise<{ message: string }> {
      await this.subscriptionService.unsubscribe(query.token);
      return { message: messages.UNSUBSCRIBE_SUCCESS };
   }
}
