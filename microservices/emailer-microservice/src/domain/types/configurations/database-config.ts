export interface DatabaseConfig {
   url: string;
   dialect: 'postgres' | 'sqlite';
   logging: boolean;
   pool?: {
      max: number;
      min: number;
      acquire: number;
      idle: number;
   };
   storage?: string;
   dialectOptions?: {
      ssl: {
         require: boolean;
         rejectUnauthorized: boolean;
      };
   };
}
