export interface DatabaseConfig {
   url: string;
   dialect: 'postgres';
   logging: boolean;
   pool: {
      max: number;
      min: number;
      acquire: number;
      idle: number;
   };
   dialectOptions: {
      ssl: {
         require: boolean;
         rejectUnauthorized: boolean;
      };
   };
}

export interface DataProviderConfig {
   apiUrl: string;
   apiKey: string;
}

export interface MailConfig {
   apiKey: string;
   senderEmail: string;
}

export interface ApplicationConfig {
   port: number;
   baseUrl: string;
   environment: string;
}
