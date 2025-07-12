export abstract class WeatherDataProviderPort {
   abstract validateCity(city: string): Promise<void>;
}
