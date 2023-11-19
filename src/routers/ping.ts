import { FastifyInstance } from "fastify";
import redis from "../utils/redis";

async function pingRouter(fastify: FastifyInstance) {
  // get info
  fastify.get("/", async (request, reply) => {
    try {
      if (request.headers.authorization) {
        await redis.get(
          "password-" + request.headers.authorization,
          (err, result) => {
            if (err) {
              fastify.log.error(err);
              return reply.send({
                error: true,
                message: "error getting value from Redis",
              });
            }

            if (result) {
              return reply.send({
                error: false,
                message: "OK",
              });
            } else {
              return reply.send({
                error: true,
                message: "not found",
              });
            }
          }
        );
      } else {
        return reply.send({
          error: true,
          message: "not authorized",
        });
      }
    } catch (err) {
      fastify.log.error(err);
      return reply.send({
        error: true,
        message: "unknown error",
      });
    }
  });

  // update server
  fastify.post("/update", async (request, reply) => {
    try {
      if (request.headers.authorization) {
      } else {
        return reply.send({
          error: true,
          message: "not authorized",
        });
      }
    } catch (err) {
      fastify.log.error(err);
      return reply.send({
        error: true,
        message: "unknown error",
      });
    }
  });

  // register new server
  fastify.post("/register", async (request, reply) => {
    try {
      if (request.headers.authorization) {
      } else {
        return reply.send({
          error: true,
          message: "not authorized",
        });
      }
    } catch (err) {
      fastify.log.error(err);
      return reply.send({
        error: true,
        message: "unknown error",
      });
    }
  });
}

export default pingRouter;
