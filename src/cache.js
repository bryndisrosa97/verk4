import redis from 'redis';
import util from 'util';
import dotenv from 'dotenv';

dotenv.config();

const {
  REDIS_URL: redisurl,
} = process.env;

let client;
let asyncGet;
let asyncSet;

if (redisurl) {
  client = redis.createClient({ url: redisurl });
  asyncGet = util.promisify(client.get).bind(client);
  asyncSet = util.promisify(client.set).bind(client);
}

export async function getter(cacheKey) {
  if (!client || !asyncGet) return null;

  const earthquakes = await asyncGet(cacheKey);
  return earthquakes;
}

export async function setter(cacheKey, earthquakes) {
  if (!client || !asyncSet) return null;
  await asyncSet(cacheKey, earthquakes);
  return true;
}
