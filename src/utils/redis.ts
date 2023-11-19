import Redis from "ioredis";
import { redisConfig } from "./config";

const redis = new Redis({
  port: redisConfig.port,
  host: redisConfig.host,
  password: redisConfig.password,
  db: redisConfig.db,
});

/**
 * get server
 * redis.get("server-PASSWORD")
 * */

/**
 * set server
 * redis.set("server-PASSWORD", JSON.stringify({
 *     id: "", // name
 *     ip: "", // ip
 *     lastUpdate: "", // last update
 * }))
 * */

export default redis;
