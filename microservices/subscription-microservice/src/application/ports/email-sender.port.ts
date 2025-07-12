export abstract class EmailSenderPort {
   abstract sendWelcomeEmail(email: string, city: string, token: string): Promise<void>;
   abstract sendConfirmEmail(email: string, city: string): Promise<void>;
   abstract sendUnsubscribeEmail(email: string, city: string): Promise<void>;
}
