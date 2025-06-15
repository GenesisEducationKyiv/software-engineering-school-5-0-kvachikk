export interface ICoordinates {
   lat: number;
   lon: number;
}

export interface IGeocodeResponseItem {
   name: string;
   lat: number;
   lon: number;
   country: string;
   state?: string;
}

export interface IWeather {
   id: number;
   main: string;
   description: string;
   icon: string;
}

export interface IMainData {
   temp: number;
   feels_like: number;
   temp_min: number;
   temp_max: number;
   pressure: number;
   humidity: number;
   sea_level: number;
   grnd_level: number;
}

export interface IWind {
   speed: number;
   deg: number;
   gust?: number;
}

export interface IClouds {
   all: number;
}

export interface IForecastItem {
   dt: number;
   main: IMainData;
   weather: IWeather[];
   clouds: IClouds;
   wind: IWind;
   visibility: number;
   pop: number;
   sys: {
      pod: string;
   };
   dt_txt: string;
}

export interface ICity {
   id: number;
   name: string;
   coord: ICoordinates;
   country: string;
   population: number;
   timezone: number;
   sunrise: number;
   sunset: number;
}

export interface IForecastResponse {
   cod: string;
   message: number;
   cnt: number;
   list: IForecastItem[];
   city: ICity;
}

export interface IRawForecastItem {
   dt_txt: string;
   dt: number;
   main: {
      temp: number;
   };
   weather: Array<{
      description: string;
      icon: string;
   }>;
}

export interface IGroupedForecasts {
   [date: string]: IRawForecastItem[];
}

export interface ITemplateWeatherItem {
   temp: {
      day: number | string;
   };
   weather: Array<{
      description: string;
      icon: string;
   }>;
   dt: string;
   cardClass: string;
}
