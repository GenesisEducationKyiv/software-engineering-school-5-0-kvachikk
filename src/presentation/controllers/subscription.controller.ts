import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SubscriptionService } from '../../application/services/subscription/subscription.service';
import { subscriptionResponseMessages as messages } from '../../shared/constants/message/subscription-responses';
import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';
import { TokenQueryDto } from '../dtos/token-query.dto';
import { JoiValidationPipe } from '../validation';
import { subscriptionSchema } from '../validation/subscription.validation';
import { verifyTokenSchema } from '../validation/verification.validation';

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
   @ApiOperation({ summary: 'Confirm email subscription' })
   @ApiResponse({ status: 200, description: 'Subscription confirmed.' })
   @UsePipes(new JoiValidationPipe(verifyTokenSchema))
   async confirm(@Query() query: TokenQueryDto): Promise<{ message: string }> {
      await this.subscriptionService.confirmSubscription(query.token);
      return { message: messages.CONFIRM_SUCCESS };
   }

   @Get('unsubscribe')
   @ApiOperation({ summary: 'Unsubscribe from notifications' })
   @ApiResponse({ status: 200, description: 'Unsubscribed successfully.' })
   @UsePipes(new JoiValidationPipe(verifyTokenSchema))
   async unsubscribe(@Query() query: TokenQueryDto): Promise<{ message: string }> {
      await this.subscriptionService.unsubscribe(query.token);
      return { message: messages.UNSUBSCRIBE_SUCCESS };
   }
}
