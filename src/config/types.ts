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

export interface WeatherConfig {
   baseUrl: string;
   coordinatesUrl: string;
   apiKey: string;
}

export interface MailConfig {
   apiKey: string;
   senderEmail: string;
}

export interface AppConfig {
   port: number;
   baseUrl: string;
   environment: string;
}
