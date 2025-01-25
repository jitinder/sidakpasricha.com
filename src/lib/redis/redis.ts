import { createClient } from 'redis';

const client = createClient({
    url: process.env.REDIS_REDIS_URL,
});

client.on('error', err => console.log('Redis Client Error', err));

const redis = await client.connect();
export default redis;