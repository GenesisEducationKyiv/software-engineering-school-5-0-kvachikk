import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { BadRequestError } from '../src/constants/errors/bad-request.error';
import { ConflictError } from '../src/constants/errors/conflict.error';
import { NotFoundError } from '../src/constants/errors/not-found.error';
import { subscriptionResponseMessages as subMsgs } from '../src/constants/message/subscription-responses';
import { AllExceptionsFilter } from '../src/filters/all-exceptions.filter';
import { DatabaseLoader } from '../src/loaders/database.loader';
import { EmailerService } from '../src/services/emailer.service';
import { SubscriptionService } from '../src/services/subscription/subscription.service';
import { WeatherService } from '../src/services/weather.service';

const getCurrentWeatherMock = jest.fn().mockResolvedValue({
   temperature: 12,
   humidity: 67,
   description: 'Clear sky',
});

const getWeatherForecastMock = jest.fn().mockResolvedValue([
   {
      temperature: 12,
      humidity: 67,
      description: 'Clear sky',
   },
]);

const weatherServiceMock = {
   getCurrentWeather: getCurrentWeatherMock,
   getWeatherForecast: getWeatherForecastMock,
} as unknown as WeatherService;

const subscribeMock = jest.fn().mockResolvedValue({});
const confirmSubscriptionMock = jest.fn().mockResolvedValue({});
const unsubscribeMock = jest.fn().mockResolvedValue({});
const getActiveSubscriptionsMock = jest.fn().mockResolvedValue([]);

const subscriptionServiceMock = {
   subscribe: subscribeMock,
   confirmSubscription: confirmSubscriptionMock,
   unsubscribe: unsubscribeMock,
   getActiveSubscriptions: getActiveSubscriptionsMock,
} as unknown as SubscriptionService;

const sendTemplateLetterMock = jest.fn();
const sendSimpleLetterMock = jest.fn();

const emailServiceMock = {
   sendTemplateLetter: sendTemplateLetterMock,
   sendSimpleLetter: sendSimpleLetterMock,
} as unknown as EmailerService;

const makeValidSubscriptionPayload = () => ({
   email: `test-${Date.now()}@example.com`,
   city: 'Kyiv',
   frequency: 'hourly',
});

describe('Weather-Forecast API (integration)', () => {
   let app: INestApplication;
   const getServer = () => app.getHttpServer() as import('http').Server;

   beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [AppModule],
      })
         .overrideProvider(WeatherService)
         .useValue(weatherServiceMock)
         .overrideProvider(SubscriptionService)
         .useValue(subscriptionServiceMock)
         .overrideProvider(DatabaseLoader)
         .useValue({ onModuleInit: jest.fn() })
         .overrideProvider(EmailerService)
         .useValue(emailServiceMock)
         .compile();

      app = moduleFixture.createNestApplication();
      app.useGlobalFilters(new AllExceptionsFilter());
      await app.init();
   });

   afterAll(async () => {
      if (app) await app.close();
   });

   //  Weather
   describe('GET /weather/current', () => {
      it('returns 200 & weather data for a valid city', async () => {
         const city = 'Kyiv';
         const res = await request(getServer()).get('/weather/current').query({ city }).expect(200);

         expect(getCurrentWeatherMock).toHaveBeenCalledWith(city);
         expect(res.body).toEqual(
            expect.objectContaining({
               temperature: expect.any(Number),
               humidity: expect.any(Number),
               description: expect.any(String),
            }),
         );
      });

      it('returns 400 when city parameter is missing', async () => {
         const res = await request(getServer()).get('/weather/current').expect(400);

         expect(res.body).toMatchObject({
            message: 'Validation failed',
         });
         expect(Array.isArray((res.body as { errors: unknown }).errors)).toBe(true);
      });

      it('returns 400 when city name is too short', async () => {
         const res = await request(getServer()).get('/weather/current').query({ city: 'A' }).expect(400);
         expect(res.body).toMatchObject({
            errors: expect.arrayContaining([
               expect.objectContaining({
                  field: 'city',
                  message: expect.stringContaining('at least 2 characters'),
               }),
            ]),
         });
      });

      it('returns 404 when city is not found', async () => {
         getCurrentWeatherMock.mockImplementationOnce(() => {
            throw new NotFoundError('City not found');
         });

         await request(getServer()).get('/weather/current').query({ city: 'Kmish' }).expect(404);
      });

      it('returns 400 when weather service reports bad request', async () => {
         getCurrentWeatherMock.mockImplementationOnce(() => {
            throw new BadRequestError('Invalid city');
         });

         await request(getServer()).get('/weather/current').query({ city: '??' }).expect(400);
      });
   });

   // ---------------------------------------------------------- Subscriptions
   describe('POST /subscribe', () => {
      it('creates a subscription with valid data', async () => {
         const payload = makeValidSubscriptionPayload();

         const res = await request(getServer()).post('/subscribe').send(payload).expect(201);

         expect(subscribeMock).toHaveBeenCalledWith(payload.email, payload.city, payload.frequency);
         expect(res.body).toEqual({ message: subMsgs.SUBSCRIBE_SUCCESS });
      });

      it('returns 400 when email is missing', async () => {
         const { city, frequency } = makeValidSubscriptionPayload();
         const res = await request(getServer()).post('/subscribe').send({ city, frequency }).expect(400);
         expect(res.body).toMatchObject({
            errors: expect.arrayContaining([expect.objectContaining({ field: 'email' })]),
         });
      });

      it('returns 400 when city is missing', async () => {
         const { email, frequency } = makeValidSubscriptionPayload();
         const res = await request(getServer()).post('/subscribe').send({ email, frequency }).expect(400);
         expect(res.body).toMatchObject({
            errors: expect.arrayContaining([expect.objectContaining({ field: 'city' })]),
         });
      });

      it('returns 400 when frequency is missing', async () => {
         const { email, city } = makeValidSubscriptionPayload();
         const res = await request(getServer()).post('/subscribe').send({ email, city }).expect(400);
         expect(res.body).toMatchObject({
            errors: expect.arrayContaining([expect.objectContaining({ field: 'frequency' })]),
         });
      });

      it('rejects duplicate emails with 409 status', async () => {
         subscribeMock.mockImplementationOnce(() => {
            throw new ConflictError(subMsgs.SUBSCRIPTION_ALREADY_EXISTS);
         });

         const payload = makeValidSubscriptionPayload();
         const res = await request(getServer()).post('/subscribe').send(payload).expect(409);

         expect(res.body).toEqual({
            message: subMsgs.SUBSCRIPTION_ALREADY_EXISTS,
         });
      });

      it('returns 400 when email format is invalid', async () => {
         const payload = { ...makeValidSubscriptionPayload(), email: 'invalid-email' };
         const res = await request(getServer()).post('/subscribe').send(payload).expect(400);

         expect(res.body).toMatchObject({
            errors: expect.arrayContaining([expect.objectContaining({ field: 'email' })]),
         });
      });

      it('returns 400 when city name is too short', async () => {
         const payload = { ...makeValidSubscriptionPayload(), city: 'A' };
         const res = await request(getServer()).post('/subscribe').send(payload).expect(400);

         expect(res.body).toMatchObject({
            errors: expect.arrayContaining([expect.objectContaining({ field: 'city' })]),
         });
      });
   });

   // ------------------------------------------------------ Confirmation flow
   describe('GET /confirm', () => {
      it('confirms a subscription with a valid token', async () => {
         const token = 'valid-token';

         const res = await request(getServer()).get(`/confirm`).query({ token }).expect(200);

         expect(confirmSubscriptionMock).toHaveBeenCalledWith(token);
         expect(res.body).toEqual({ message: subMsgs.CONFIRM_SUCCESS });
      });

      it('returns 404 when token not found', async () => {
         confirmSubscriptionMock.mockImplementationOnce(() => {
            throw new NotFoundError('Token not found');
         });

         await request(getServer()).get('/confirm').query({ token: 'unknown-token' }).expect(404);
      });
   });

   describe('GET /unsubscribe', () => {
      it('unsubscribes successfully with a valid token', async () => {
         const token = 'valid-token';
         const res = await request(getServer()).get(`/unsubscribe`).query({ token }).expect(200);

         expect(unsubscribeMock).toHaveBeenCalledWith(token);
         expect(res.body).toEqual({ message: subMsgs.UNSUBSCRIBE_SUCCESS });
      });

      it('returns 404 when token not found', async () => {
         unsubscribeMock.mockImplementationOnce(() => {
            throw new NotFoundError('Token not found');
         });

         await request(getServer()).get('/unsubscribe').query({ token: 'unknown-token' }).expect(404);
      });
   });
});
