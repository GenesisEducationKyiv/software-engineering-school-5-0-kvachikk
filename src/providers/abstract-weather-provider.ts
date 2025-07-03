import { Weather } from '../types/weather';
import { GetWeatherOptions } from '../types/weather.options';

export abstract class WeatherProvider {
   abstract getWeather(options: GetWeatherOptions): Promise<Weather[]>;
}
