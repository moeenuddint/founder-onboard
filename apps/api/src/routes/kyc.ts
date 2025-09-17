import { FastifyInstance } from "fastify";

export default async function kycRoutes(fastify: FastifyInstance) {
  // POST /api/kyc/verify
  fastify.post(
    "/kyc/verify",
    {
      schema: {
        body: { type: "object", nullable: true },
      },
    },
    async (request, reply) => {
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

      // Mock verification
      await fastify.prisma.company.update({
        where: { userId },
        data: { kycVerified: true },
      });

      // Notification
      await fastify.prisma.notification.create({
        data: {
          userId,
          type: "kyc_verified",
          message: "KYC verification completed successfully.",
        },
      });

      reply.send({ verified: true });
    }
  );
}
