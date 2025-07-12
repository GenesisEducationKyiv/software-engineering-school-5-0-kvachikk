import { Weather } from '../../domain/types/weather';
import { WeatherDataProvider } from '../ports/weather-data-provider.port';

import { WeatherService } from './weather.service';

describe('WeatherService', () => {
   let service: WeatherService;
   let provider: jest.Mocked<WeatherDataProvider>;

   beforeEach(() => {
      provider = {
         handle: jest.fn(),
      };
      service = new WeatherService(provider);
   });

   it('should return mapped forecast', async () => {
      const data: Weather[] = [
         { temperature: 10, humidity: 60, description: 'clear' },
         { temperature: 12, humidity: 65, description: 'cloudy' },
      ];
      provider.handle.mockResolvedValueOnce(data);
      const result = await service.getWeatherForecast('Kyiv');
      expect(result).toEqual([
         { temperature: 10, humidity: 60, description: 'clear' },
         { temperature: 12, humidity: 65, description: 'cloudy' },
      ]);
      expect(provider.handle).toHaveBeenCalledWith({ city: 'Kyiv', date: expect.any(Date) });
   });

   it('should return first forecast as current weather', async () => {
      const data: Weather[] = [
         { temperature: 15, humidity: 70, description: 'rain' },
         { temperature: 16, humidity: 72, description: 'cloudy' },
      ];
      provider.handle.mockResolvedValueOnce(data);
      const result = await service.getCurrentWeather('Lviv');
      expect(result).toEqual({ temperature: 15, humidity: 70, description: 'rain' });
   });

   it('should throw if provider throws', async () => {
      provider.handle.mockRejectedValueOnce(new Error('fail'));
      await expect(service.getWeatherForecast('Kyiv')).rejects.toThrow('fail');
   });

   it('should map Weather to WeatherResponseDto', () => {
      // @ts-expect-error test private
      const dto = service.mapToDto({ temperature: 1, humidity: 2, description: 'x' });
      expect(dto).toEqual({ temperature: 1, humidity: 2, description: 'x' });
   });
});
