export type Subscription = {
   id?: number;
   email: string;
   city: string;
   verificationToken: string;
   isVerified: boolean;
   isActive: boolean;
};
