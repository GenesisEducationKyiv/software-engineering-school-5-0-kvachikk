import { join } from 'node:path';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';

interface SubscriptionGrpc {
  Subscribe(data: {
    email: string;
    city: string;
    frequency: string;
  }): Promise<{ success: boolean; token: string }>;
  Confirm(data: { token: string }): Promise<{ success: boolean }>;
  Unsubscribe(data: { token: string }): Promise<{ success: boolean }>;
}

@Injectable()
export class SubscriptionClient implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: process.env.SUBSCRIPTION_GRPC_URL ?? 'subscription-service:50053',
      package: 'subscription',
      protoPath: join(__dirname, '../../../../proto/subscription.proto'),
    },
  })
  private readonly client!: ClientGrpc;

  private service!: SubscriptionGrpc;

  onModuleInit() {
    this.service = this.client.getService<SubscriptionGrpc>(
      'SubscriptionService',
    );
  }

  subscribe(email: string, city: string, frequency: string) {
    return this.service.Subscribe({ email, city, frequency });
  }

  confirm(token: string) {
    return this.service.Confirm({ token });
  }

  unsubscribe(token: string) {
    return this.service.Unsubscribe({ token });
  }
}
