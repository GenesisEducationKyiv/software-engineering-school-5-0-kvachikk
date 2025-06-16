import { ISubscription } from '../../interfaces/Subscription';
import { ForecastService } from './forecast.service';
import { EmailService } from '../emails/sender';

/**
 * Iterates over user subscriptions, fetches formatted forecast for each city
 * and dispatches e-mail via EmailService. Skips subscriptions if forecast is
 * unavailable (e.g. API returned no data).
 */
export async function sendForecasts(
   subscriptions: ISubscription[],
   forecastService: ForecastService,
   emailService: EmailService,
): Promise<void> {
   for (const subscription of subscriptions) {
      const forecast = await forecastService.getFormattedForecast(
         subscription.city,
      );
      if (!forecast) continue;
      await emailService.sendForecastEmail(subscription, forecast);
   }
}
