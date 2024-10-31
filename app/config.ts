// host
export const NEXT_PUBLIC_HOST = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';

// redis
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';