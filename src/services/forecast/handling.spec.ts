import { ForecastHandlingService } from './handling';

const service = new ForecastHandlingService();

describe('ForecastHandlingService', () => {
   describe('getWeatherCardClass (indirect via mapForecastToTemplate)', () => {
      it('returns mapped class for known day icon', () => {
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
         const result = (service as any).getWeatherCardClass('01d');
         expect(result).toBe('weather-card--clear-day');
      });

      it('returns default class for unknown icon', () => {
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
         const result = (service as any).getWeatherCardClass('99x');
         expect(result).toBe('weather-card--default');
      });
   });

   describe('groupForecastByDate', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const raw = [
         { dt_txt: '2025-06-16 09:00:00' },
         { dt_txt: '2025-06-16 12:00:00' },
         { dt_txt: '2025-06-17 03:00:00' },
      ] as any;

      it('groups items under correct keys', () => {
         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         const grouped = service.groupForecastByDate(raw);
         expect(Object.keys(grouped)).toEqual(['2025-06-16', '2025-06-17']);
         expect(grouped['2025-06-16'].length).toBe(2);
         expect(grouped['2025-06-17'].length).toBe(1);
      });
   });

   describe('mapForecastToTemplate', () => {
      const noonTimestamp = Math.floor(new Date('2025-06-16T12:00:00Z').getTime() / 1000);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const grouped = {
         '2025-06-16': [
            {
               dt: noonTimestamp,
               dt_txt: '2025-06-16 12:00:00',
               main: { temp: 25.4 },
               weather: [{ description: 'sunny', icon: '01d' }],
            },
         ],
      } as any;

      it('maps grouped forecasts into template items', () => {
         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         const result = service.mapForecastToTemplate(grouped);
         expect(result).toHaveLength(1);
         expect(result[0]).toEqual(
            expect.objectContaining({
               temp: { day: 25 }, // rounded
               cardClass: 'weather-card--clear-day',
            }),
         );
      });

      it('handles missing noon data and weather list', () => {
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
         const grouped2 = {
            '2025-06-17': [
               {
                  dt: noonTimestamp,
                  dt_txt: '2025-06-17 03:00:00',
                  main: { temp: 10 },
                  weather: [],
               },
            ],
         } as any;

         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         const result = service.mapForecastToTemplate(grouped2);
         expect(result[0].weather[0].description).toBe('No data');
      });
   });
});
