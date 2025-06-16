import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { CurrentWeatherService } from '../src/services/weather/current';
import { SubscriptionService } from '../src/services/subscription/subscription.service';
import { weatherResponseMessages as weatherMsgs } from '../src/constants/message/weather-responses';
import { subscriptionResponseMessages as subMsgs } from '../src/constants/message/subscription-responses';
import { ConflictError } from '../src/constants/errors/conflict.error';
import { EmailSchedulerLoader } from '../src/loaders/email-scheduler.loader';
import { AllExceptionsFilter } from '../src/filters/all-exceptions.filter';
import { NotFoundError } from '../src/constants/errors/not-found.error';
import { BadRequestError } from '../src/constants/errors/bad-request.error';
import { DatabaseLoader } from '../src/loaders/database.loader';

// Mock
const weatherServiceMock: Partial<Record<keyof CurrentWeatherService, any>> = {
   getWeatherByCity: jest.fn().mockResolvedValue({
      temperature: 12,
      humidity: 67,
      description: 'Clear sky',
   }),
};

const subscriptionServiceMock: Partial<Record<keyof SubscriptionService, any>> = {
   subscribe: jest.fn().mockResolvedValue({}),
   confirmSubscription: jest.fn().mockResolvedValue({}),
   unsubscribe: jest.fn().mockResolvedValue({}),
   getActiveSubscriptions: jest.fn().mockResolvedValue([]),
};

// Helper
const makeValidSubscriptionPayload = () => ({
   email: `test-${Date.now()}@example.com`,
   city: 'Kyiv',
   frequency: 'hourly',
});

// Tests
describe('Weather-Forecast API (integration)', () => {
   let app: INestApplication;

   beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [AppModule],
      })
         .overrideProvider(CurrentWeatherService)
         .useValue(weatherServiceMock)
         .overrideProvider(SubscriptionService)
         .useValue(subscriptionServiceMock)
         .overrideProvider(EmailSchedulerLoader)
         .useValue({ onModuleInit: jest.fn() })
         .overrideProvider(DatabaseLoader)
         .useValue({ onModuleInit: jest.fn() })
         .compile();

      app = moduleFixture.createNestApplication();
      app.setGlobalPrefix('api');
      app.useGlobalFilters(new AllExceptionsFilter());
      await app.init();
   });

   afterAll(async () => {
      await app.close();
   });

   //  Weather
   describe('GET /api/weather', () => {
      it('returns 200 & weather data for a valid city', async () => {
         const city = 'Kyiv';

         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         const res = await request(app.getHttpServer()).get('/api/weather').query({ city }).expect(200);

         expect(weatherServiceMock.getWeatherByCity).toHaveBeenCalledWith(city);
         expect(res.body).toEqual({
            message: weatherMsgs.WEATHER_DATA_FETCHED,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            data: expect.objectContaining({
               // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
               temperature: expect.any(Number),
               // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
               humidity: expect.any(Number),
               // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
               description: expect.any(String),
            }),
         });
      });

      it('returns 400 when city parameter is missing', async () => {
         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         const res = await request(app.getHttpServer()).get('/api/weather').expect(400);

         expect(res.body).toMatchObject({
            message: 'Validation failed',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            errors: expect.arrayContaining([expect.objectContaining({ field: 'city' })]),
         });
      });

      it('returns 400 when city name is too short', async () => {
         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         const res = await request(app.getHttpServer()).get('/api/weather').query({ city: 'A' }).expect(400);

         // Should contain validation error mentioning "City name must be at least 2 characters long"
         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         expect(res.body.errors).toEqual(
            expect.arrayContaining([
               expect.objectContaining({
                  field: 'city',
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  message: expect.stringContaining('at least 2 characters'),
               }),
            ]),
         );
      });

      it('returns 404 when city is not found', async () => {
         (weatherServiceMock.getWeatherByCity as jest.Mock).mockImplementationOnce(() => {
            throw new NotFoundError('City not found');
         });

         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         await request(app.getHttpServer()).get('/api/weather').query({ city: 'Kmish' }).expect(404);
      });

      it('returns 400 when weather service reports bad request', async () => {
         (weatherServiceMock.getWeatherByCity as jest.Mock).mockImplementationOnce(() => {
            throw new BadRequestError('Invalid city');
         });

         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         await request(app.getHttpServer()).get('/api/weather').query({ city: '??' }).expect(400);
      });
   });

   // ---------------------------------------------------------- Subscriptions
   describe('POST /api/subscribe', () => {
      it('creates a subscription with valid data', async () => {
         const payload = makeValidSubscriptionPayload();

         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         const res = await request(app.getHttpServer()).post('/api/subscribe').send(payload).expect(201);

         expect(subscriptionServiceMock.subscribe).toHaveBeenCalledWith(payload.email, payload.city, payload.frequency);
         expect(res.body).toEqual({ message: subMsgs.SUBSCRIBE_SUCCESS });
      });

      it('returns 400 when email is missing', async () => {
         const { city, frequency } = makeValidSubscriptionPayload();
         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         const res = await request(app.getHttpServer()).post('/api/subscribe').send({ city, frequency }).expect(400);

         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         expect(res.body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'email' })]));
      });

      it('returns 400 when city is missing', async () => {
         const { email, frequency } = makeValidSubscriptionPayload();
         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         const res = await request(app.getHttpServer()).post('/api/subscribe').send({ email, frequency }).expect(400);

         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         expect(res.body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'city' })]));
      });

      it('returns 400 when frequency is missing', async () => {
         const { email, city } = makeValidSubscriptionPayload();
         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         const res = await request(app.getHttpServer()).post('/api/subscribe').send({ email, city }).expect(400);

         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         expect(res.body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'frequency' })]));
      });

      it('rejects duplicate emails with 409 status', async () => {
         // Next call to subscribe should throw a ConflictError
         (subscriptionServiceMock.subscribe as jest.Mock).mockImplementationOnce(() => {
            throw new ConflictError(subMsgs.SUBSCRIPTION_ALREADY_EXISTS);
         });

         const payload = makeValidSubscriptionPayload();

         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         const res = await request(app.getHttpServer()).post('/api/subscribe').send(payload).expect(409);

         expect(res.body).toEqual({
            message: subMsgs.SUBSCRIPTION_ALREADY_EXISTS,
         });
      });

      it('returns 400 when email format is invalid', async () => {
         const payload = { ...makeValidSubscriptionPayload(), email: 'invalid-email' };

         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         const res = await request(app.getHttpServer()).post('/api/subscribe').send(payload).expect(400);

         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         expect(res.body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'email' })]));
      });

      it('returns 400 when city name is too short', async () => {
         const payload = { ...makeValidSubscriptionPayload(), city: 'A' };

         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         const res = await request(app.getHttpServer()).post('/api/subscribe').send(payload).expect(400);

         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         expect(res.body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'city' })]));
      });
   });

   // ------------------------------------------------------ Confirmation flow
   describe('GET /api/confirm/:token', () => {
      it('confirms a subscription with a valid token', async () => {
         const token = 'valid-token';

         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         const res = await request(app.getHttpServer()).get(`/api/confirm/${token}`).expect(200);

         expect(subscriptionServiceMock.confirmSubscription).toHaveBeenCalledWith(token);
         expect(res.body).toEqual({ message: subMsgs.CONFIRM_SUCCESS });
      });

      it('returns 404 when token not found', async () => {
         (subscriptionServiceMock.confirmSubscription as jest.Mock).mockImplementationOnce(() => {
            throw new NotFoundError('Token not found');
         });

         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         await request(app.getHttpServer()).get('/api/confirm/unknown-token').expect(404);
      });
   });

   describe('GET /api/unsubscribe/:token', () => {
      it('unsubscribes successfully with a valid token', async () => {
         const token = 'valid-token';

         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         const res = await request(app.getHttpServer()).get(`/api/unsubscribe/${token}`).expect(200);

         expect(subscriptionServiceMock.unsubscribe).toHaveBeenCalledWith(token);
         expect(res.body).toEqual({ message: subMsgs.UNSUBSCRIBE_SUCCESS });
      });

      it('returns 404 when token not found', async () => {
         (subscriptionServiceMock.unsubscribe as jest.Mock).mockImplementationOnce(() => {
            throw new NotFoundError('Token not found');
         });

         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         await request(app.getHttpServer()).get('/api/unsubscribe/unknown-token').expect(404);
      });
   });
});
