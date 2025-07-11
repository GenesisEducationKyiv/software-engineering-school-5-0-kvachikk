import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { WeatherService } from '../../application/services/weather.service';
import { WeatherPresentationModule } from '../modules/weather-presentation.module';
import { JoiValidationPipe } from '../validation';
import { weatherParamsSchema } from '../validation/weather.validation';

const getCurrentWeatherMock = jest.fn().mockResolvedValue({
   temperature: 10,
   humidity: 60,
   description: 'clear',
});

const getWeatherForecastMock = jest.fn().mockResolvedValue([
   {
      temperature: 10,
      humidity: 60,
      description: 'clear',
   },
]);

const weatherServiceMock = {
   getCurrentWeather: getCurrentWeatherMock,
   getWeatherForecast: getWeatherForecastMock,
} as unknown as WeatherService;

describe('WeatherController (e2e-lite)', () => {
   let app: INestApplication;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   let http: any;

   beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [WeatherPresentationModule],
      })
         .overrideProvider(WeatherService)
         .useValue(weatherServiceMock)
         .compile();

      app = moduleFixture.createNestApplication();
      app.useGlobalPipes(new JoiValidationPipe(weatherParamsSchema));
      await app.init();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      http = request(app.getHttpServer());
   });

   afterAll(async () => {
      await app.close();
   });

   it('/weather/current (GET) returns 200 and weather', async () => {
      const res = await http.get('/weather/current').query({ city: 'Kyiv' }).expect(200);
      expect(res.body).toEqual(
         expect.objectContaining({
            temperature: expect.any(Number),
            humidity: expect.any(Number),
            description: expect.any(String),
         }),
      );
      expect(getCurrentWeatherMock).toHaveBeenCalledWith('Kyiv');
   });

   it('/weather/current without city returns 400', async () => {
      await http.get('/weather/current').expect(400);
   });
});
