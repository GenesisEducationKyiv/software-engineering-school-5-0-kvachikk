export type CreateSubscriptionPayload = {
   email: string;
   city: string;
   frequency: string;
   verificationToken: string;
   isVerified: boolean;
   isActive: boolean;
};
