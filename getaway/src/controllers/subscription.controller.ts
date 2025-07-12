import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { SubscriptionClient } from '../clients/subscription.client';

@Controller()
export class SubscriptionGatewayController {
  constructor(private readonly subClient: SubscriptionClient) {}

  @Post('subscribe')
  async subscribe(
    @Body() body: { email: string; city: string; frequency: string },
  ) {
    return this.subClient.subscribe(body.email, body.city, body.frequency);
  }

  @Get('confirm')
  async confirm(@Query('token') token: string) {
    return this.subClient.confirm(token);
  }

  @Get('unsubscribe')
  async unsubscribe(@Query('token') token: string) {
    return this.subClient.unsubscribe(token);
  }
}
