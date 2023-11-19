import "dotenv/config";

interface RedisConfig {
  port: number;
  host: string;
  password: string;
  db: number;
}

export const redisConfig: RedisConfig = {
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  host: process.env.REDIS_HOST || "",
  password: process.env.REDIS_PASSWORD || "",
  db: parseInt(process.env.REDIS_DB || "0", 10),
};
