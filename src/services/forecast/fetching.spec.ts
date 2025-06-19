import { ForecastFetchingService } from './fetching';
import { weatherConfig } from '../../config';

// ---------------------------------------------------------------------------
// Setup global fetch mock
// ---------------------------------------------------------------------------
const fetchMock = jest.fn();
global.fetch = fetchMock;

// Sample data ---------------------------------------------------------------
const city = 'Kyiv';
const coordsResponse = [{ lat: 50.45, lon: 30.523 }];
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const forecastList = [
   { dt: 1, main: { temp: 20 }, weather: [{ description: 'clear' }] },
   { dt: 2, main: { temp: 21 }, weather: [{ description: 'cloudy' }] },
] as any;
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const forecastResponse = { list: forecastList };

// Helper to reset mocks -----------------------------------------------------
const resetFetch = () => {
   fetchMock.mockReset();
};

describe('ForecastFetchingService', () => {
   const service = new ForecastFetchingService();

   beforeAll(() => {
      // Provide dummy config to avoid undefined concatenations
      weatherConfig.coordinatesUrl = 'https://geo.test/?q=';
      weatherConfig.baseUrl = 'https://weather.test';
      weatherConfig.apiKey = 'KEY';
   });

   beforeEach(resetFetch);

   it('fetches coordinates and then forecast, returning the list', async () => {
      // First call -> coordinates
      fetchMock
         .mockResolvedValueOnce({ ok: true, json: () => coordsResponse })
         // Second call -> forecast
         .mockResolvedValueOnce({ ok: true, json: () => forecastResponse });

      const result = await service.fetchRawForecast(city);

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(result).toEqual(forecastList);

      // Verify URLs correctness
      const coordsUrl = `${weatherConfig.coordinatesUrl}${encodeURIComponent(city)}&limit=1&appid=${weatherConfig.apiKey}`;
      const forecastUrl = `${weatherConfig.baseUrl}/forecast?lat=${coordsResponse[0].lat}&lon=${coordsResponse[0].lon}&cnt=40&appid=${weatherConfig.apiKey}&units=metric`;

      expect(fetchMock).toHaveBeenNthCalledWith(1, coordsUrl);
      expect(fetchMock).toHaveBeenNthCalledWith(2, forecastUrl);
   });

   it('returns null when forecast list is empty', async () => {
      fetchMock
         .mockResolvedValueOnce({ ok: true, json: () => coordsResponse })
         .mockResolvedValueOnce({ ok: true, json: () => ({ list: [] }) });

      const result = await service.fetchRawForecast(city);
      expect(result).toBeNull();
   });

   it('throws error when coordinates API returns no data', async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: () => [] });
      await expect(service.fetchRawForecast(city)).rejects.toThrow('No coordinates');
   });

   it('throws error when fetch response is not ok', async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, statusText: 'Bad' });
      await expect(service.fetchRawForecast(city)).rejects.toThrow('Failed to fetch');
   });
});
