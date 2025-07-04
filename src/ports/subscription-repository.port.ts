import { SubscriptionModel } from '../database/models/subscription.model';
import { CreateSubscriptionPayload } from '../types/payloads/create-subscription.payload';

export abstract class SubscriptionRepositoryPort {
   abstract create(payload: Partial<CreateSubscriptionPayload>): Promise<SubscriptionModel>;
   abstract save(instance: SubscriptionModel): Promise<SubscriptionModel>;
   abstract delete(instance: SubscriptionModel): Promise<void>;

   abstract findByToken(verificationToken: string): Promise<SubscriptionModel | null>;
   abstract findByEmail(email: string): Promise<SubscriptionModel | null>;
   abstract getActiveSubscriptionsByFrequency(frequencyTitle: string): Promise<SubscriptionModel[]>;
}
