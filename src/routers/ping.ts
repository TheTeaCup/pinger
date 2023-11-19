import {FastifyInstance} from "fastify";

async function pingRouter(fastify: FastifyInstance) {
    fastify.get("/", async (request, reply) => {
        reply.send({
        error: false,
        message: "pong",
        });
    });
}

export default pingRouter;