import { Subscription } from '../../domain/types/subscription';

export abstract class SubscriptionRepositoryPort {
   abstract getActiveSubscriptionsByFrequency(frequencyTitle: string): Promise<Subscription[]>;
}
