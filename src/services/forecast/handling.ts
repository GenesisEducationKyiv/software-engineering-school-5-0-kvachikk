import { Injectable } from '@nestjs/common';
import { weatherCardMap } from '../../constants/weather-card-map';
import { IRawForecastItem, IGroupedForecasts, ITemplateWeatherItem } from '../../interfaces/Forecast';

@Injectable()
export class ForecastHandlingService {
   private getWeatherCardClass(iconCode: string): string {
      if (iconCode.length < 3) {
         return 'weather-card--default';
      }

      const code = iconCode.substring(0, 2);
      const dayOrNight = iconCode.substring(2);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const baseClass = weatherCardMap[code];

      if (baseClass) {
         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
         if (typeof baseClass === 'object' && baseClass[dayOrNight]) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
            return baseClass[dayOrNight];
         }
         if (typeof baseClass === 'string') {
            return baseClass;
         }
      }

      return 'weather-card--default';
   }

   groupForecastByDate(rawList: IRawForecastItem[]): IGroupedForecasts {
      const groupedByDate: IGroupedForecasts = {};
      rawList.forEach((item) => {
         const date = item.dt_txt.split(' ')[0];
         if (!groupedByDate[date]) {
            groupedByDate[date] = [];
         }
         groupedByDate[date].push(item);
      });
      return groupedByDate;
   }

   mapForecastToTemplate(groupedForecasts: IGroupedForecasts): ITemplateWeatherItem[] {
      return Object.keys(groupedForecasts)
         .slice(0, 5)
         .map((date) => {
            const dayData = groupedForecasts[date];
            const noonData = dayData.find((item) => item.dt_txt.includes('12:00:00')) || dayData[0];

            if (!noonData || !noonData.weather || noonData.weather.length === 0) {
               return {
                  temp: { day: 'N/A' },
                  weather: [{ description: 'No data', icon: '01d' }],
                  dt: new Date(date).toLocaleDateString('en-GB', {
                     weekday: 'short',
                     day: '2-digit',
                     month: 'short',
                  }),
                  cardClass: this.getWeatherCardClass('01d'),
               };
            }

            const weatherIcon = noonData.weather[0].icon;
            const cardClass = this.getWeatherCardClass(weatherIcon);

            return {
               temp: {
                  day: Math.round(noonData.main.temp),
               },
               weather: [
                  {
                     description: noonData.weather[0].description,
                     icon: weatherIcon,
                  },
               ],
               dt: new Date(noonData.dt * 1000).toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
               }),
               cardClass: cardClass,
            };
         });
   }
}
