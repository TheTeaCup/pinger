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
 * redis.get("password-server")
 * */

/**
 * set server
 * redis.set("password-server", JSON.stringify({
 *     id: "", // name
 *     ip: "", // ip
 *     lastUpdate: "", // last update
 * }))
 * */

export default redis;
