import { FastifyInstance } from "fastify";
import { linkFinancialsSchema } from "../schemas";

export default async function financialsRoutes(fastify: FastifyInstance) {
  // POST /api/financials/link
  fastify.post("/financials/link", async (request, reply) => {
    const { token } = request.body as any;
    const userId = "user1"; // Mock

    // Ensure user and company exist
    await fastify.prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, email: "user@example.com" },
    });

    // Create company if it doesn't exist
    await fastify.prisma.company.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        name: "Default Company",
        sector: "Technology",
        targetRaise: 1000000,
        revenue: 500000,
      },
    });

    // Mock link
    await fastify.prisma.company.update({
      where: { userId },
      data: { financialsLinked: true },
    });

    // Notification
    await fastify.prisma.notification.create({
      data: {
        userId,
        type: "financials_linked",
        message: "Financials linked successfully.",
      },
    });

    reply.send({ linked: true });
  });
}
