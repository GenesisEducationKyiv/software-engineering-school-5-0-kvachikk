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
