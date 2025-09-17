import { FastifyInstance } from "fastify";
import { createCompanySchema } from "../schemas";

export default async function companyRoutes(fastify: FastifyInstance) {
  // POST /api/company
  fastify.post("/company", async (request, reply) => {
    const { name, sector, targetRaise, revenue } = request.body as any;
    const userId = "user1"; // Mock auth, assume user1

    // Ensure user exists
    await fastify.prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, email: "user@example.com" },
    });

    const company = await fastify.prisma.company.upsert({
      where: { userId },
      update: { name, sector, targetRaise, revenue },
      create: { userId, name, sector, targetRaise, revenue },
    });

    // Create notification
    await fastify.prisma.notification.create({
      data: {
        userId,
        type: "company_updated",
        message: "Company information updated successfully.",
      },
    });

    reply.send(company);
  });

  // GET /api/company
  fastify.get("/company", async (request, reply) => {
    const userId = "user1"; // Mock

    let company = await fastify.prisma.company.findUnique({
      where: { userId },
    });

    // Return mock data if no company exists
    if (!company) {
      company = {
        id: "mock-company-1",
        userId,
        name: "TechStart Inc.",
        sector: "SaaS",
        targetRaise: 2500000,
        revenue: 500000,
        kycVerified: true,
        financialsLinked: true,
        createdAt: new Date(),
      };
    }

    reply.send(company);
  });
}
