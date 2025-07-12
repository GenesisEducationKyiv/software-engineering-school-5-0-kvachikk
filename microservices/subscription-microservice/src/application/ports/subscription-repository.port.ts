import { CreateSubscriptionPayload } from '../../domain/types/payloads/create-subscription.payload';
import { Subscription } from '../../domain/types/subscription';

export abstract class SubscriptionRepositoryPort {
   abstract create(_payload: Partial<CreateSubscriptionPayload>): Promise<Subscription>;

   abstract save(_instance: Subscription): Promise<Subscription>;

   abstract delete(_instance: Subscription): Promise<void>;

   abstract findByToken(_verificationToken: string): Promise<Subscription | null>;

   abstract findByEmail(_email: string): Promise<Subscription | null>;

   abstract getActiveSubscriptionsByFrequency(_frequencyTitle: string): Promise<Subscription[]>;
}
