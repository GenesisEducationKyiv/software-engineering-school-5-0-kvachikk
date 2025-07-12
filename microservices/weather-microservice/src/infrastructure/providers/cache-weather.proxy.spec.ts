import { CachePort } from '../../application/ports/cache-service.port';
import { WeatherDataProvider } from '../../application/ports/weather-data-provider.port';
import { Weather } from '../../domain/types/weather';

import { CacheWeatherProxy } from './cache-weather.proxy';

const sampleWeather: Weather[] = [{ temperature: 20, humidity: 50, description: 'sunny' }];

describe('CacheWeatherProxy', () => {
   let cache: jest.Mocked<CachePort>;
   let provider: jest.Mocked<WeatherDataProvider>;
   let proxy: CacheWeatherProxy;

   beforeEach(() => {
      cache = {
         getData: jest.fn(),
         setData: jest.fn(),
      } as unknown as jest.Mocked<CachePort>;

      provider = {
         handle: jest.fn().mockResolvedValue(sampleWeather),
      } as unknown as jest.Mocked<WeatherDataProvider>;

      proxy = new CacheWeatherProxy(provider, cache);
   });

   it('returns cached data if present', async () => {
      cache.getData.mockResolvedValue(sampleWeather);
      const res = await proxy.handle({ city: 'Kyiv', date: new Date() });
      expect(res).toBe(sampleWeather);
      expect(provider.handle).not.toHaveBeenCalled();
   });

   it('fetches and caches when miss', async () => {
      cache.getData.mockResolvedValue(undefined);
      const res = await proxy.handle({ city: 'Kyiv', date: new Date() });
      expect(provider.handle).toHaveBeenCalled();
      expect(cache.setData).toHaveBeenCalled();
      expect(res).toBe(sampleWeather);
   });
});
