import { Weather } from '../../domain/types/weather';

export interface WeatherDataProvider {
   handle(params: { city: string; date: Date }): Promise<Weather[]>;
}
