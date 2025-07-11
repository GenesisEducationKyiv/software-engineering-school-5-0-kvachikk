/* eslint-disable import/order */
import { AppLogger } from '../../shared/logger/logger.service';
import { LoggingWeatherDecorator } from './logging-weather.decorator';
import { ChainableWeatherProvider } from './chainable-weather-provider';
import { GetWeatherOptions } from '../../domain/types/weather.options';
import { Weather } from '../../domain/types/weather';

const sampleWeather: Weather[] = [{ temperature: 20, humidity: 50, description: 'sunny' }];

class DummyProvider extends ChainableWeatherProvider {
   getWeather = jest.fn<Promise<Weather[]>, [GetWeatherOptions]>().mockResolvedValue(sampleWeather);
}

describe('LoggingWeatherDecorator', () => {
   let provider: DummyProvider;
   let logger: jest.Mocked<AppLogger>;
   let decorator: LoggingWeatherDecorator;

   beforeEach(() => {
      provider = new DummyProvider();
      logger = {
         response: jest.fn(),
         error: jest.fn(),
         info: jest.fn(),
         warn: jest.fn(),
         debug: jest.fn(),
      } as unknown as jest.Mocked<AppLogger>;

      decorator = new LoggingWeatherDecorator(provider, logger, 'OpenWeather');
   });

   it('logs response after successful fetch', async () => {
      await decorator.getWeather({ city: 'Kyiv', date: new Date() });
      expect(logger.response).toHaveBeenCalled();
   });

   it('logs error on failure', async () => {
      jest.spyOn(provider, 'handle').mockRejectedValue(new Error('fail'));
      await expect(decorator.getWeather({ city: 'Kyiv', date: new Date() })).rejects.toThrow('fail');
      expect(logger.error).toHaveBeenCalled();
   });
});
