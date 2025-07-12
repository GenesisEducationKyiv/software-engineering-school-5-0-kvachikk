import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'node:path';

import { EmailSenderPort } from '../../application/ports/email-sender.port';

interface EmailerGrpcService {
   SendWelcomeEmail(data: { email: string; city: string; token: string }): Promise<{ success: boolean }>;
   SendConfirmEmail(data: { email: string; city: string; token: string }): Promise<{ success: boolean }>;
   SendUnsubscribeEmail(data: { email: string; city: string; token: string }): Promise<{ success: boolean }>;
}

@Injectable()
export class GrpcEmailerSender implements EmailSenderPort, OnModuleInit {
   @Client({
      transport: Transport.GRPC,
      options: {
         url: process.env.EMAILER_GRPC_URL ?? 'localhost:50052',
         package: 'emailer',
         protoPath: join(__dirname, '../../../../../../proto/emailer.proto'),
      },
   })
   private readonly client!: ClientGrpc;

   private emailerService!: EmailerGrpcService;

   onModuleInit() {
      this.emailerService = this.client.getService<EmailerGrpcService>('EmailerService');
   }

   async sendWelcomeEmail(email: string, city: string, token: string): Promise<void> {
      await this.emailerService.SendWelcomeEmail({ email, city, token });
   }

   async sendConfirmEmail(email: string, city: string): Promise<void> {
      await this.emailerService.SendConfirmEmail({ email, city, token: '' });
   }

   async sendUnsubscribeEmail(email: string, city: string): Promise<void> {
      await this.emailerService.SendUnsubscribeEmail({ email, city, token: '' });
   }
} 