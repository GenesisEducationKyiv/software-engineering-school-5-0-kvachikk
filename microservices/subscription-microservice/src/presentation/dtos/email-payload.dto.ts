export interface WelcomeEmailPayload {
   email: string;
   city: string;
   token: string;
}

export interface ConfirmEmailPayload {
   email: string;
   city: string;
}

export interface UnsubscribeEmailPayload {
   email: string;
   city: string;
}
