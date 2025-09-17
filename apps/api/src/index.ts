import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import multipart from "@fastify/multipart";
import { PrismaClient } from "@prisma/client";
import companyRoutes from "./routes/company";
import kycRoutes from "./routes/kyc";
import financialsRoutes from "./routes/financials";
import filesRoutes from "./routes/files";
import scoreRoutes from "./routes/score";
import notificationsRoutes from "./routes/notifications";
import messagesRoutes from "./routes/messages";
import personaRoutes from "./routes/persona";
import plaidRoutes from "./routes/plaid";
import cartaRoutes from "./routes/carta";

const prisma = new PrismaClient();

const fastify = Fastify({ logger: true });

// Register plugins
fastify.register(cors, { origin: true });
fastify.register(helmet);
fastify.register(rateLimit, { max: 100, timeWindow: "1 minute" });
fastify.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// Decorate with prisma
fastify.decorate("prisma", prisma);

// Register routes
fastify.register(companyRoutes, { prefix: "/api" });
fastify.register(kycRoutes, { prefix: "/api" });
fastify.register(financialsRoutes, { prefix: "/api" });
fastify.register(filesRoutes, { prefix: "/api" });
fastify.register(scoreRoutes, { prefix: "/api" });
fastify.register(notificationsRoutes, { prefix: "/api" });
fastify.register(messagesRoutes, { prefix: "/api" });
fastify.register(personaRoutes, { prefix: "/api" });
fastify.register(plaidRoutes, { prefix: "/api" });
fastify.register(cartaRoutes, { prefix: "/api" });

// Basic route
fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 8000, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
