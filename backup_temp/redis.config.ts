import { RedisModuleOptions } from '@nestjs/redis';

export const redisConfig: RedisModuleOptions = {
  config: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB) || 0,
    
    // Configurações de retry
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    
    // Configurações de timeout
    connectTimeout: 10000,
    commandTimeout: 5000,
    
    // Configurações de pool
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    
    // Configurações de cluster (se aplicável)
    enableReadyCheck: true,
    maxLoadingTimeout: 10000,
  },
};
