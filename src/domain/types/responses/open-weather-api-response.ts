export type OpenWeatherApiResponse = {
   cod: string;
   message: number;
   cnt: number;
   list: Array<{
      dt: number;
      main: {
         temp: number;
         feels_like: number;
         temp_min: number;
         temp_max: number;
         pressure: number;
         sea_level: number;
         grnd_level: number;
         humidity: number;
         temp_kf: number;
      };
      weather: Array<{
         id: number;
         main: string;
         description: string;
         icon: string;
      }>;
   }>;
   city: {
      id: number;
      name: string;
      coord: {
         lat: number;
         lon: number;
      };
      country: string;
      population: number;
      timezone: number;
      sunrise: number;
      sunset: number;
   };
};
