import Fastify from "fastify";
import pino from "pino";
import redis from "./utils/redis";
import pingRouter from "./routers/ping";

const server = Fastify({
  logger: pino({ level: "info" }),
});

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    server.setErrorHandler((error, request, reply) => {
      server.log.error(error);
    });

    server.setNotFoundHandler((request, reply) => {
      reply.send({
        error: true,
        message: "Route not found",
      });
    });

    server.register(pingRouter, { prefix: "/ping" });

    server.get("/", (request, reply) => {
      try {
        redis.get("hello", (err, result) => {
          if (err) {
            server.log.error(err);
            reply.send({
              error: true,
              message: "Error getting value from Redis",
            });
          }

          if (result) {
            reply.send({
              error: false,
              hello: result,
            });
          } else {
            reply.send({
              error: true,
              message: "No value for hello in Redis",
            });
          }
        });
      } catch (err) {
        server.log.error(err);
        reply.send({
          error: true,
          message: "Unknown error",
        });
      }
    });

    await server.listen({ port: Number(port) });
  } catch (err) {
    server.log.error(err);
  }
};

process.on("unhandledRejection", (e) => {
  console.error(e);
  process.exit(1);
});

start();
