export interface CachePort {
   getData<T>(key: string): Promise<T | undefined>;
   setData(key: string, value: unknown, ttl?: number): Promise<void>;
   delData?(key: string): Promise<void>;
}
