import { Weather } from '../../domain/types/weather';
import { GetWeatherOptions } from '../../domain/types/weather.options';

export abstract class WeatherProvider {
   abstract getWeather(options: GetWeatherOptions): Promise<Weather[]>;
}
