import { ConflictError } from '../../domain/errors/conflict.error';
import { NotFoundError } from '../../domain/errors/not-found.error';
import { Subscription } from '../../domain/types/subscription';
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

const buildCityValidatorMock = () => {
   const validate = jest.fn().mockResolvedValue(undefined);
   return { validator: { validate } as unknown as CityValidatorService, validate };
};

describe('SubscriptionService', () => {
   const email = 'test@example.com';
   const city = 'Kyiv';
   const frequency = 'hourly';

   const createService = () => {
      const repositoryMocks = buildRepositoryMock();
      const cityMocks = buildCityValidatorMock();
      const service = new SubscriptionService(repositoryMocks.repo, cityMocks.validator);

      return { service, repositoryMocks, cityMocks };
   };

   describe('subscribe()', () => {
      it('creates new subscription and validates city', async () => {
         const { service, repositoryMocks, cityMocks } = createService();

         repositoryMocks.findByEmail.mockResolvedValue(null);
         const created: Subscription = {
            id: 1,
            email,
            city,
            verificationToken: 'token',
            isActive: false,
            isVerified: false,
         };
         repositoryMocks.create.mockResolvedValue(created);
         process.env.WEATHER_SERVICE_URL = 'http://weather-service:3001';

         const result = await service.subscribe(email, city, frequency);

         expect(cityMocks.validate).toHaveBeenCalledWith(city);
         expect(repositoryMocks.create).toHaveBeenCalled();
         expect(result).toEqual(created);
      });

      it('throws ConflictError when email already exists', async () => {
         const { service, repositoryMocks } = createService();
         repositoryMocks.findByEmail.mockResolvedValue({ email } as Subscription);
         process.env.WEATHER_SERVICE_URL = 'http://weather-service:3001';

         await expect(service.subscribe(email, city, frequency)).rejects.toBeInstanceOf(ConflictError);
      });
   });

   describe('confirmSubscription()', () => {
      const token = 'token-123';
      it('activates subscription', async () => {
         const { service, repositoryMocks } = createService();
         const subscription: Subscription = {
            id: 1,
            email,
            city,
            verificationToken: token,
            isActive: false,
            isVerified: false,
         };
         repositoryMocks.findByToken.mockResolvedValue(subscription);

         await service.confirmSubscription(token);

         expect(subscription.isActive).toBe(true);
         expect(subscription.isVerified).toBe(true);
         expect(repositoryMocks.save).toHaveBeenCalledWith(subscription);
      });

      it('throws NotFoundError when token not found', async () => {
         const { service, repositoryMocks } = createService();
         repositoryMocks.findByToken.mockResolvedValue(null);
         await expect(service.confirmSubscription(token)).rejects.toBeInstanceOf(NotFoundError);
      });
   });

   describe('unsubscribe()', () => {
      const token = 'token-456';
      it('deactivates subscription', async () => {
         const { service, repositoryMocks } = createService();
         const subscription: Subscription = {
            id: 1,
            email,
            city,
            verificationToken: token,
            isActive: true,
            isVerified: true,
         };
         repositoryMocks.findByToken.mockResolvedValue(subscription);

         await service.unsubscribe(token);

         expect(subscription.isActive).toBe(false);
         expect(repositoryMocks.save).toHaveBeenCalledWith(subscription);
      });

      it('throws NotFoundError when token not found', async () => {
         const { service, repositoryMocks } = createService();
         repositoryMocks.findByToken.mockResolvedValue(null);

         await expect(service.unsubscribe(token)).rejects.toBeInstanceOf(NotFoundError);
      });
   });
});
