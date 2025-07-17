import { ConflictError } from '../../domain/errors/conflict.error';
import { NotFoundError } from '../../domain/errors/not-found.error';
import { Subscription } from '../../domain/types/subscription';
import { ProducerService } from '../../infrastructure/kafka/producer.service';
import { SUBSCRIPTION_FREQUENCIES } from '../../shared/constants/subscription-frequency';
import { SubscriptionRepositoryPort } from '../ports/subscription-repository.port';

import { CityValidatorService } from './city-validator.service';
import { SubscriptionService } from './subscription.service';

interface RepositoryMocks {
   repo: SubscriptionRepositoryPort;
   findByEmail: jest.Mock;
   create: jest.Mock;
   findByToken: jest.Mock;
   save: jest.Mock;
   getActiveSubscriptionsByFrequency: jest.Mock;
}

const buildRepositoryMock = (): RepositoryMocks => {
   const findByEmail = jest.fn();
   const create = jest.fn();
   const findByToken = jest.fn();
   const save = jest.fn();
   const getActiveSubscriptionsByFrequency = jest.fn();

   return {
      repo: {
         findByEmail,
         create,
         findByToken,
         save,
         getActiveSubscriptionsByFrequency,
      } as unknown as SubscriptionRepositoryPort,
      findByEmail,
      create,
      findByToken,
      save,
      getActiveSubscriptionsByFrequency,
   };
};

const buildProducerServiceMock = () => {
   const produce = jest.fn().mockResolvedValue(undefined);
   return {
      producer: { produce } as unknown as ProducerService,
      produce,
   };
};

const buildCityValidatorMock = () => {
   const validate = jest.fn().mockResolvedValue(undefined);
   return { validator: { validate } as unknown as CityValidatorService, validate };
};

describe('SubscriptionService', () => {
   const email = 'TEST@EXAMPLE.COM';
   const city = 'KYIV';
   const frequency = SUBSCRIPTION_FREQUENCIES.HOURLY;

   const createService = () => {
      const repositoryMocks = buildRepositoryMock();
      const cityMocks = buildCityValidatorMock();
      const producerMocks = buildProducerServiceMock();
      const service = new SubscriptionService(repositoryMocks.repo, cityMocks.validator, producerMocks.producer);
      return { service, repositoryMocks, cityMocks, producerMocks };
   };

   describe('subscribe()', () => {
      it('creates new subscription, validates city, and sends a welcome message to Kafka', async () => {
         const { service, repositoryMocks, cityMocks, producerMocks } = createService();
         const inputEmail = 'test@example.com';
         const inputCity = 'Kyiv';

         repositoryMocks.findByEmail.mockResolvedValue(null);

         const createdSubscription: Subscription = {
            id: 1,
            email: email,
            city: city,
            frequency: frequency,
            verificationToken: 'some-token',
            isActive: false,
            isVerified: false,
         };
         repositoryMocks.create.mockResolvedValue(createdSubscription);

         const result = await service.subscribe(inputEmail, inputCity, frequency);

         expect(cityMocks.validate).toHaveBeenCalledWith(inputCity);

         expect(repositoryMocks.create).toHaveBeenCalledWith(
            expect.objectContaining({
               email: email,
               city: city,
               frequency: frequency,
               isVerified: false,
               isActive: false,
            }),
         );

         expect(producerMocks.produce).toHaveBeenCalledTimes(1);
         expect(producerMocks.produce).toHaveBeenCalledWith({
            topic: 'emails-welcome',
            messages: [
               {
                  value: expect.any(String),
               },
            ],
         });

         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         const messageValue = JSON.parse(producerMocks.produce.mock.calls[0][0].messages[0].value);
         expect(messageValue.email).toBe(inputEmail);
         expect(messageValue.city).toBe(inputCity);
         expect(messageValue.token).toEqual(expect.any(String));
         expect(result).toEqual(createdSubscription);
      });

      it('throws ConflictError when email already exists', async () => {
         const { service, repositoryMocks, producerMocks } = createService();
         repositoryMocks.findByEmail.mockResolvedValue({ email } as Subscription);

         await expect(service.subscribe(email, city, frequency)).rejects.toBeInstanceOf(ConflictError);
         expect(producerMocks.produce).not.toHaveBeenCalled();
      });

      it('throws NotFoundError for an unsupported frequency', async () => {
         const { service, producerMocks } = createService();
         const unsupportedFrequency = 'YEARLY';

         await expect(service.subscribe(email, city, unsupportedFrequency)).rejects.toBeInstanceOf(NotFoundError);
         expect(producerMocks.produce).not.toHaveBeenCalled();
      });
   });

   describe('confirmSubscription()', () => {
      const token = 'token-123';

      it('activates subscription and sends a confirmation message to Kafka', async () => {
         const { service, repositoryMocks, producerMocks } = createService();
         const subscription: Subscription = {
            id: 1,
            email,
            city,
            frequency,
            verificationToken: token,
            isActive: false,
            isVerified: false,
         };
         repositoryMocks.findByToken.mockResolvedValue(subscription);

         await service.confirmSubscription(token);

         expect(subscription.isActive).toBe(true);
         expect(subscription.isVerified).toBe(true);
         expect(repositoryMocks.save).toHaveBeenCalledWith(subscription);
         expect(producerMocks.produce).toHaveBeenCalledTimes(1);
         expect(producerMocks.produce).toHaveBeenCalledWith({
            topic: 'emails-confirm',
            messages: [{ value: JSON.stringify({ email: subscription.email, city: subscription.city }) }],
         });
      });

      it('throws NotFoundError when token not found', async () => {
         const { service, repositoryMocks, producerMocks } = createService();
         repositoryMocks.findByToken.mockResolvedValue(null);

         await expect(service.confirmSubscription(token)).rejects.toBeInstanceOf(NotFoundError);
         expect(producerMocks.produce).not.toHaveBeenCalled();
      });
   });

   describe('unsubscribe()', () => {
      const token = 'token-456';

      it('deactivates subscription and sends an unsubscribe message to Kafka', async () => {
         const { service, repositoryMocks, producerMocks } = createService();
         const subscription: Subscription = {
            id: 1,
            email,
            city,
            frequency,
            verificationToken: token,
            isActive: true,
            isVerified: true,
         };
         repositoryMocks.findByToken.mockResolvedValue(subscription);

         await service.unsubscribe(token);

         expect(subscription.isActive).toBe(false);
         expect(repositoryMocks.save).toHaveBeenCalledWith(subscription);
         expect(producerMocks.produce).toHaveBeenCalledTimes(1);
         expect(producerMocks.produce).toHaveBeenCalledWith({
            topic: 'emails-unsubscribe',
            messages: [{ value: JSON.stringify({ email: subscription.email, city: subscription.city }) }],
         });
      });

      it('throws NotFoundError when token not found', async () => {
         const { service, repositoryMocks, producerMocks } = createService();
         repositoryMocks.findByToken.mockResolvedValue(null);

         await expect(service.unsubscribe(token)).rejects.toBeInstanceOf(NotFoundError);
         expect(producerMocks.produce).not.toHaveBeenCalled();
      });
   });
});
