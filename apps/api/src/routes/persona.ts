import { FastifyInstance } from "fastify";

export default async function personaRoutes(fastify: FastifyInstance) {
  // POST /api/persona/verify - Mock Persona KYC verification
  fastify.post("/persona/verify", async (request, reply) => {
    const { inquiryId } = request.body as any;

    // Mock verification process
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate processing time

    // Mock successful verification
    const verificationResult = {
      status: "completed",
      outcome: "approved",
      inquiryId: inquiryId || "inq_mock_123",
      verifiedAt: new Date().toISOString(),
      documents: [
        {
          type: "drivers_license",
          status: "verified",
          country: "US",
        },
      ],
    };

    reply.send(verificationResult);
  });

  // GET /api/persona/status - Check verification status
  fastify.get("/persona/status/:inquiryId", async (request, reply) => {
    const { inquiryId } = request.params as any;

    // Mock status response
    const status = {
      inquiryId,
      status: "completed",
      outcome: "approved",
      createdAt: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      completedAt: new Date().toISOString(),
    };

    reply.send(status);
  });
}
