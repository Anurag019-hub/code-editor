import dotenv from 'dotenv';
dotenv.config();

import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});

redisClient.on('connect', () => {
  console.log('Redis TCP connection established');
});

export default redisClient;
