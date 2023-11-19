import Redis from "ioredis";
import { redisConfig } from "./config";

const redis = new Redis({
  port: redisConfig.port,
  host: redisConfig.host,
  password: redisConfig.password,
  db: redisConfig.db,
});

export default redis;
