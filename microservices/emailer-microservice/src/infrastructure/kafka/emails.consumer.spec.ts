import { Test, TestingModule } from '@nestjs/testing';
import { EachMessagePayload, KafkaMessage } from 'kafkajs';

import { EmailerService } from '../../application/services/emailer.service';

import { ConsumerService } from './consumer';
import { EmailsConsumer } from './email-consumer.service';

const mockEmailerService = {
   sendWelcomeEmail: jest.fn(),
   sendConfirmEmail: jest.fn(),
   sendUnsubscribeEmail: jest.fn(),
};

const mockConsumerService = {
   consume: jest.fn(),
};

describe('EmailsConsumer', () => {
   let consumer: EmailsConsumer;
   let eachMessageCallback: (payload: EachMessagePayload) => Promise<void>;

   beforeEach(async () => {
      jest.clearAllMocks();
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            EmailsConsumer,
            { provide: EmailerService, useValue: mockEmailerService },
            { provide: ConsumerService, useValue: mockConsumerService },
         ],
      }).compile();

      consumer = module.get<EmailsConsumer>(EmailsConsumer);
      await consumer.onModuleInit();
      eachMessageCallback = mockConsumerService.consume.mock.calls[0][1].eachMessage;
   });

   it('should be defined', () => {
      expect(consumer).toBeDefined();
   });

   describe('when receiving an "emails-welcome" message', () => {
      it('should call emailer.sendWelcomeEmail with correct data', async () => {
         const welcomePayload = {
            email: 'test@example.com',
            city: 'Kyiv',
            token: 'some-secret-token',
         };
         const fullMessage: KafkaMessage = {
            key: null,
            value: Buffer.from(JSON.stringify(welcomePayload)),
            timestamp: String(Date.now()),
            size: 0,
            attributes: 0,
            offset: '0',
            headers: undefined,
         };
         const kafkaMessage: EachMessagePayload = {
            topic: 'emails-welcome',
            partition: 0,
            message: fullMessage,
            heartbeat: async () => {},
            pause: () => () => {},
         };

         await eachMessageCallback(kafkaMessage);

         expect(mockEmailerService.sendWelcomeEmail).toHaveBeenCalledWith(
            welcomePayload.email,
            welcomePayload.city,
            welcomePayload.token,
         );
      });
   });

   describe('when receiving an "emails-confirm" message', () => {
      it('should call emailer.sendConfirmEmail with correct data', async () => {
         const confirmPayload = { email: 'user@mail.com', city: 'Lviv' };
         const fullMessage: KafkaMessage = {
            key: null,
            value: Buffer.from(JSON.stringify(confirmPayload)),
            timestamp: String(Date.now()),
            size: 0,
            attributes: 0,
            offset: '1',
            headers: undefined,
         };
         const kafkaMessage: EachMessagePayload = {
            topic: 'emails-confirm',
            partition: 0,
            message: fullMessage,
            heartbeat: async () => {},
            pause: () => () => {},
         };

         await eachMessageCallback(kafkaMessage);

         expect(mockEmailerService.sendConfirmEmail).toHaveBeenCalledWith(confirmPayload.email, confirmPayload.city);
      });
   });

   it('should do nothing if message value is null', async () => {
      const fullMessageWithNull: KafkaMessage = {
         key: null,
         value: null,
         timestamp: String(Date.now()),
         size: 0,
         attributes: 0,
         offset: '2',
         headers: undefined,
      };
      const kafkaMessage: EachMessagePayload = {
         topic: 'emails-welcome',
         partition: 0,
         message: fullMessageWithNull,
         heartbeat: async () => {},
         pause: () => () => {},
      };

      await eachMessageCallback(kafkaMessage);

      expect(mockEmailerService.sendWelcomeEmail).not.toHaveBeenCalled();
      expect(mockEmailerService.sendConfirmEmail).not.toHaveBeenCalled();
      expect(mockEmailerService.sendUnsubscribeEmail).not.toHaveBeenCalled();
   });
});
