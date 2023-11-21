import { FastifyInstance, FastifyRequest } from "fastify";
import redis from "../utils/redis";

interface RequestBody {
  id: string;
  ip: Number;
  lastUpdate: string;
}

async function pingRouter(fastify: FastifyInstance) {
  // get info
  fastify.get("/", async (request, reply) => {
    try {
      if (request.headers.authorization) {
        await redis.get(
          "server-" + request.headers.authorization,
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
                data: JSON.parse(result),
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
        await redis.get(
          "server-" + request.headers.authorization,
          (err, result) => {
            if (err) {
              fastify.log.error(err);
              return reply.send({
                error: true,
                message: "error getting value from Redis",
              });
            }

            if (result) {
              const parsedResult = JSON.parse(result);
              parsedResult.lastUpdate = new Date().toISOString();
              parsedResult.ip = request.ip;

              redis.set(
                "server-" + request.headers.authorization,
                JSON.stringify(parsedResult)
              );

              return reply.send({
                error: false,
                message: "OK",
                data: parsedResult,
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

  // register new server
  fastify.post(
    "/register",
    async (request: FastifyRequest<{ Body: RequestBody }>, reply) => {
      try {
        if (!request.headers.authorization) {
          return reply.send({
            error: true,
            message: "not authorized",
          });
        }

        const userResult = await redis.get(
          "user-" + request.headers.authorization
        );

        if (!userResult) {
          return reply.send({
            error: true,
            message: "user not found",
          });
        }

        if (!request.body?.id || !request.body?.ip) {
          return reply.send({
            error: true,
            message: "invalid request body",
          });
        }

        const serverResult = await redis.get("server-" + request.body.id);

        if (serverResult) {
          return reply.send({
            error: true,
            message: "already registered",
          });
        }

        const dataToStore: RequestBody = {
          id: request.body.id,
          ip: request.body.ip,
          lastUpdate: new Date().toISOString(),
        };

        await redis.set(
          "server-" + request.body.id,
          JSON.stringify(dataToStore)
        );

        return reply.send({
          error: false,
          message: "OK",
          data: dataToStore,
        });
      } catch (err) {
        fastify.log.error(err);
        return reply.send({
          error: true,
          message: "unknown error",
        });
      }
    }
  );
}

export default pingRouter;
