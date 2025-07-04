import { CreateSubscriptionPayload } from '../../domain/types/payloads/create-subscription.payload';
import { SubscriptionModel } from '../../infrastructure/database/models/subscription.model';

export abstract class SubscriptionRepositoryPort {
   abstract create(_payload: Partial<CreateSubscriptionPayload>): Promise<SubscriptionModel>;
   abstract save(_instance: SubscriptionModel): Promise<SubscriptionModel>;
   abstract delete(_instance: SubscriptionModel): Promise<void>;

   abstract findByToken(_verificationToken: string): Promise<SubscriptionModel | null>;
   abstract findByEmail(_email: string): Promise<SubscriptionModel | null>;
   abstract getActiveSubscriptionsByFrequency(_frequencyTitle: string): Promise<SubscriptionModel[]>;
}
