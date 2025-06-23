import { ConflictError } from '../../constants/errors/conflict.error';
import { NotFoundError } from '../../constants/errors/not-found.error';
import { FrequencyModel } from '../../database/models/frequency.model';
import { SubscriptionRepository } from '../../repositories/subscription-repository';
import { EmailerService } from '../emailer.service';
import { WeatherService } from '../weather.service';

import { SubscriptionService } from './subscription.service';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-member-access */

// ----------------------------------------------------------------------------
// Test helpers
// ----------------------------------------------------------------------------

const createRepositoryMock = (): jest.Mocked<SubscriptionRepository> =>
   ({
      findFrequencyByTitle: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      findByToken: jest.fn(),
      save: jest.fn(),
      // Not used in the tests below but required by the type
      getActiveSubscriptionsByFrequency: jest.fn(),
   }) as unknown as jest.Mocked<SubscriptionRepository>;

const createNotifierMock = (): jest.Mocked<EmailerService> =>
   ({
      sendWelcomeEmail: jest.fn(),
      sendConfirmationEmail: jest.fn(),
      sendUnsubscribeEmail: jest.fn(),
   }) as unknown as jest.Mocked<EmailerService>;

const createWeatherServiceMock = (): jest.Mocked<WeatherService> =>
   ({
      getWeatherForecast: jest.fn(),
   }) as unknown as jest.Mocked<WeatherService>;

const makeService = (
   repository = createRepositoryMock(),
   notifier = createNotifierMock(),
   weather = createWeatherServiceMock(),
) => new SubscriptionService(repository, notifier, weather);

describe('SubscriptionService', () => {
   const email = 'test@example.com';
   const city = 'Kyiv';
   const frequency = 'hourly';
   const frequencyEntity = { id: 1, title: frequency } as unknown as FrequencyModel;

   // ---------------------------------------------------------------- subscribe()
   describe('subscribe()', () => {
      it('creates new subscription and sends welcome email', async () => {
         const repositoryMock = createRepositoryMock();
         repositoryMock.findFrequencyByTitle.mockResolvedValue(frequencyEntity);
         repositoryMock.findByEmail.mockResolvedValue(null as unknown as any);
         const created = { id: 1, email, city } as unknown as any; // shape only matters for equality
         repositoryMock.create.mockResolvedValue(created);

         const weatherMock = createWeatherServiceMock();

         const notifierMock = createNotifierMock();

         const service = makeService(repositoryMock, notifierMock, weatherMock);

         const result = await service.subscribe(email, city, frequency);

         expect(repositoryMock.findFrequencyByTitle).toHaveBeenCalledWith(frequency);
         expect(weatherMock.getWeatherForecast).toHaveBeenCalledWith(city);
         expect(repositoryMock.findByEmail).toHaveBeenCalledWith(email);
         expect(repositoryMock.create).toHaveBeenCalledWith(
            expect.objectContaining({ email, city, frequencyId: frequencyEntity.id }),
         );
         expect(notifierMock.sendWelcomeEmail).toHaveBeenCalledWith(email, city, expect.any(String));
         expect(result).toEqual(created);
      });

      it('throws ConflictError when email already exists', async () => {
         const repositoryMock = createRepositoryMock();
         repositoryMock.findFrequencyByTitle.mockResolvedValue(frequencyEntity);
         repositoryMock.findByEmail.mockResolvedValue({ id: 42 } as unknown as any);

         const service = makeService(repositoryMock);

         await expect(service.subscribe(email, city, frequency)).rejects.toBeInstanceOf(ConflictError);
      });
   });

   // ---------------------------------------------------------- confirmSubscription()
   describe('confirmSubscription()', () => {
      const token = 'token-123';

      it('activates subscription and sends confirmation email', async () => {
         const subscription = {
            id: 1,
            email,
            city,
            isActive: false,
            isVerified: false,
         } as unknown as any;

         const repositoryMock = createRepositoryMock();
         repositoryMock.findByToken.mockResolvedValue(subscription as unknown as any);

         const notifierMock = createNotifierMock();

         const service = makeService(repositoryMock, notifierMock);

         await service.confirmSubscription(token);

         expect(subscription.isActive).toBe(true);
         expect(subscription.isVerified).toBe(true);
         expect(repositoryMock.save).toHaveBeenCalledWith(subscription);
         expect(notifierMock.sendConfirmationEmail).toHaveBeenCalledWith(email, city, token);
      });

      it('throws NotFoundError when token not found', async () => {
         const repositoryMock = createRepositoryMock();
         repositoryMock.findByToken.mockResolvedValue(undefined as unknown as any);

         const service = makeService(repositoryMock);

         await expect(service.confirmSubscription(token)).rejects.toBeInstanceOf(NotFoundError);
      });
   });

   // ----------------------------------------------------------------- unsubscribe()
   describe('unsubscribe()', () => {
      const token = 'token-456';

      it('deactivates subscription and sends email', async () => {
         const subscription = {
            id: 1,
            email,
            city,
            isActive: true,
            isVerified: true,
         } as unknown as any;

         const repositoryMock = createRepositoryMock();
         repositoryMock.findByToken.mockResolvedValue(subscription as unknown as any);

         const notifierMock = createNotifierMock();

         const service = makeService(repositoryMock, notifierMock);

         await service.unsubscribe(token);

         expect(subscription.isActive).toBe(false);
         expect(repositoryMock.save).toHaveBeenCalledWith(subscription);
         expect(notifierMock.sendUnsubscribeEmail).toHaveBeenCalledWith(email, city, token);
      });

      it('throws NotFoundError when token not found', async () => {
         const repositoryMock = createRepositoryMock();
         repositoryMock.findByToken.mockResolvedValue(null as unknown as any);

         const service = makeService(repositoryMock);

         await expect(service.unsubscribe(token)).rejects.toBeInstanceOf(NotFoundError);
      });
   });
});
