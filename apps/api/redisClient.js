import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const client = createClient({ url: REDIS_URL });

client.on("error", (err) => console.error("Redis Client Error", err));

let connected = false;
export const connectRedis = async () => {
  if (connected) return client;
  await client.connect();
  connected = true;
  return client;
};

export default client;
