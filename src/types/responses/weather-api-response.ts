export type WeatherApiResponse = {
   location: {
      name: string;
      region: string;
      country: string;
      lat: number;
      lon: number;
      tz_id: string;
      localtime_epoch: number;
      localtime: string;
   };
   current: {
      temp_c: number;
      condition: {
         text: string;
      };
      humidity: number;
   };
   forecast: {
      forecastday: {
         date: string;
         date_epoch: number;
         day: {
            maxtemp_c: number;
            avghumidity: number;
            condition: {
               text: string;
            };
         };
      }[];
   };
};
