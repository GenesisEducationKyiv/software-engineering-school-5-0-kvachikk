export type DatabaseConfig = {
   url: string;
   dialect: 'postgres' | 'sqlite';
   logging: boolean;
   pool: {
      max: number;
      min: number;
      acquire: number;
      idle: number;
   };
   dialectOptions?: Record<string, unknown>;
};
