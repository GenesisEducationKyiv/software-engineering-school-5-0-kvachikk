import { ConflictError } from '../../constants/errors/conflict.error';
import { NotFoundError } from '../../constants/errors/not-found.error';
import { SubscriptionService } from './subscription.service';

// ----------------------------------------------------------------------------
// Mocks
// ----------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const repositoryMock = {
   findFrequencyByTitle: jest.fn(),
   findByEmail: jest.fn(),
   create: jest.fn(),
   findByToken: jest.fn(),
   save: jest.fn(),
} as any;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const notifierMock = {
   sendWelcomeEmail: jest.fn(),
   sendConfirmationEmail: jest.fn(),
   sendUnsubscribeEmail: jest.fn(),
} as any;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const weatherServiceMock = {
   fetchRawForecast: jest.fn(),
} as any;

const makeService = () =>
   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
   new SubscriptionService(repositoryMock, notifierMock, weatherServiceMock);

const resetMocks = () => jest.clearAllMocks();

describe('SubscriptionService', () => {
   const email = 'test@example.com';
   const city = 'Kyiv';
   const frequency = 'hourly';
   const frequencyEntity = { id: 1, title: frequency };

   beforeEach(() => {
      resetMocks();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      repositoryMock.findFrequencyByTitle.mockResolvedValue(frequencyEntity);
   });

   // ---------------------------------------------------------------- subscribe()
   describe('subscribe()', () => {
      it('creates new subscription and sends welcome email', async () => {
         // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
         repositoryMock.findByEmail.mockResolvedValue(null);
         const created = { id: 1, email, city };
         // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
         repositoryMock.create.mockResolvedValue(created);

         const service = makeService();
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
         const result = await service.subscribe(email, city, frequency);

         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         expect(repositoryMock.findFrequencyByTitle).toHaveBeenCalledWith(frequency);
         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         expect(weatherServiceMock.fetchRawForecast).toHaveBeenCalledWith(city);
         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         expect(repositoryMock.findByEmail).toHaveBeenCalledWith(email);
         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         expect(repositoryMock.create).toHaveBeenCalledWith(
            expect.objectContaining({ email, city, frequencyId: frequencyEntity.id }),
         );
         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         expect(notifierMock.sendWelcomeEmail).toHaveBeenCalledWith(email, city, expect.any(String));
         expect(result).toEqual(created);
      });

      it('throws ConflictError when email already exists', async () => {
         // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
         repositoryMock.findByEmail.mockResolvedValue({ id: 42 });
         const service = makeService();
         await expect(service.subscribe(email, city, frequency)).rejects.toBeInstanceOf(ConflictError);
      });
   });

   // ---------------------------------------------------------- confirmSubscription()
   describe('confirmSubscription()', () => {
      const token = 'token-123';

      it('activates subscription and sends confirmation email', async () => {
         const subscription = { id: 1, email, city, isActive: false, isVerified: false };
         // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
         repositoryMock.findByToken.mockResolvedValue(subscription);

         const service = makeService();
         await service.confirmSubscription(token);

         expect(subscription.isActive).toBe(true);
         expect(subscription.isVerified).toBe(true);
         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         expect(repositoryMock.save).toHaveBeenCalledWith(subscription);
         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         expect(notifierMock.sendConfirmationEmail).toHaveBeenCalledWith(email, city, token);
      });

      it('throws NotFoundError when token not found', async () => {
         // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
         repositoryMock.findByToken.mockResolvedValue(undefined);
         const service = makeService();
         await expect(service.confirmSubscription(token)).rejects.toBeInstanceOf(NotFoundError);
      });
   });

   // ----------------------------------------------------------------- unsubscribe()
   describe('unsubscribe()', () => {
      const token = 'token-456';

      it('deactivates subscription and sends email', async () => {
         const subscription = { id: 1, email, city, isActive: true, isVerified: true };
         // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
         repositoryMock.findByToken.mockResolvedValue(subscription);

         const service = makeService();
         await service.unsubscribe(token);

         expect(subscription.isActive).toBe(false);
         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         expect(repositoryMock.save).toHaveBeenCalledWith(subscription);
         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         expect(notifierMock.sendUnsubscribeEmail).toHaveBeenCalledWith(email, city, token);
      });

      it('throws NotFoundError when token not found', async () => {
         // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
         repositoryMock.findByToken.mockResolvedValue(null);
         const service = makeService();
         await expect(service.unsubscribe(token)).rejects.toBeInstanceOf(NotFoundError);
      });
   });
});
