import { ConflictError } from '../../../domain/errors/conflict.error';
import { NotFoundError } from '../../../domain/errors/not-found.error';
import { Subscription } from '../../../domain/types/subscription';
import { SubscriptionRepository } from '../../../infrastructure/repositories/subscription.repository';
import { EmailerService } from '../emailer.service';
import { WeatherService } from '../weather.service';

import { SubscriptionService } from './subscription.service';

interface RepositoryMocks {
   repo: SubscriptionRepository;
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
         findByEmail: findByEmail as SubscriptionRepository['findByEmail'],
         create: create as SubscriptionRepository['create'],
         findByToken: findByToken as SubscriptionRepository['findByToken'],
         save: save as SubscriptionRepository['save'],
         getActiveSubscriptionsByFrequency:
            getActiveSubscriptionsByFrequency as SubscriptionRepository['getActiveSubscriptionsByFrequency'],
      } as SubscriptionRepository,
      findByEmail,
      create,
      findByToken,
      save,
      getActiveSubscriptionsByFrequency,
   };
};

interface NotifierMocks {
   service: EmailerService;
   sendWelcomeEmail: jest.Mock;
   sendConfirmationEmail: jest.Mock;
   sendUnsubscribeEmail: jest.Mock;
}

const buildNotifierMock = (): NotifierMocks => {
   const sendWelcomeEmail = jest.fn();
   const sendConfirmationEmail = jest.fn();
   const sendUnsubscribeEmail = jest.fn();
   return {
      service: {
         sendWelcomeEmail: sendWelcomeEmail as EmailerService['sendWelcomeEmail'],
         sendConfirmationEmail: sendConfirmationEmail as EmailerService['sendConfirmationEmail'],
         sendUnsubscribeEmail: sendUnsubscribeEmail as EmailerService['sendUnsubscribeEmail'],
      } as EmailerService,
      sendWelcomeEmail,
      sendConfirmationEmail,
      sendUnsubscribeEmail,
   };
};

interface WeatherMocks {
   service: WeatherService;
   getWeatherForecast: jest.Mock;
}

const buildWeatherServiceMock = (): WeatherMocks => {
   const getWeatherForecast = jest.fn();
   return {
      service: { getWeatherForecast } as unknown as WeatherService,
      getWeatherForecast,
   };
};

const makeService = (
   repositoryMocks: RepositoryMocks = buildRepositoryMock(),
   notifierMocks: NotifierMocks = buildNotifierMock(),
   weatherMocks: WeatherMocks = buildWeatherServiceMock(),
) => ({
   service: new SubscriptionService(repositoryMocks.repo, notifierMocks.service, weatherMocks.service),
   repositoryMocks,
   notifierMocks,
   weatherMocks,
});

describe('SubscriptionService', () => {
   const email = 'test@example.com';
   const city = 'Kyiv';
   const frequency = 'hourly';

   describe('subscribe()', () => {
      it('creates new subscription and sends welcome email', async () => {
         const { repositoryMocks, notifierMocks, weatherMocks, service } = makeService();

         repositoryMocks.findByEmail.mockResolvedValue(null);

         const created = {
            id: 1,
            email,
            city,
            verificationToken: 'token',
            isActive: false,
            isVerified: false,
         };
         repositoryMocks.create.mockResolvedValue(created);

         const result = await service.subscribe(email, city, frequency);

         expect(repositoryMocks.findByEmail).toHaveBeenCalledWith(email);
         expect(weatherMocks.getWeatherForecast).toHaveBeenCalledWith(city);
         expect(repositoryMocks.create).toHaveBeenCalledWith(
            expect.objectContaining({ frequency: frequency.toUpperCase() }),
         );
         expect(notifierMocks.sendWelcomeEmail).toHaveBeenCalledWith(email, city, expect.any(String));
         expect(result).toEqual(created);
      });

      it('throws ConflictError when email already exists', async () => {
         const { repositoryMocks, service } = makeService();
         repositoryMocks.findByEmail.mockResolvedValue({
            email,
            city,
            verificationToken: 'token',
            isVerified: true,
            isActive: true,
         });

         await expect(service.subscribe(email, city, frequency)).rejects.toBeInstanceOf(ConflictError);
      });
   });

   // ---------------------------------------------------------- confirmSubscription()
   describe('confirmSubscription()', () => {
      const token = 'token-123';

      it('activates subscription and sends confirmation email', async () => {
         const { repositoryMocks, notifierMocks, service } = makeService();

         const subscription = {
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
         expect(notifierMocks.sendConfirmationEmail).toHaveBeenCalledWith(email, city, token);
      });

      it('throws NotFoundError when token not found', async () => {
         const { repositoryMocks, service } = makeService();
         repositoryMocks.findByToken.mockResolvedValue(null);

         await expect(service.confirmSubscription(token)).rejects.toBeInstanceOf(NotFoundError);
      });
   });

   describe('unsubscribe()', () => {
      const token = 'token-456';
      it('deactivates subscription and sends email', async () => {
         const { repositoryMocks, notifierMocks, service } = makeService();

         const subscription: Subscription = {
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
         expect(notifierMocks.sendUnsubscribeEmail).toHaveBeenCalledWith(email, city, token);
      });

      it('throws NotFoundError when token not found', async () => {
         const { repositoryMocks, service } = makeService();
         repositoryMocks.findByToken.mockResolvedValue(null);

         await expect(service.unsubscribe(token)).rejects.toBeInstanceOf(NotFoundError);
      });
   });
});
