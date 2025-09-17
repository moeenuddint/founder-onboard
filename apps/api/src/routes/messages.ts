import { FastifyInstance } from "fastify";

export default async function messagesRoutes(fastify: FastifyInstance) {
  // POST /api/messages
  fastify.post("/messages", async (request, reply) => {
    const { content, sender } = request.body as any;
    const userId = "user1"; // Mock

    // Ensure user and company exist
    await fastify.prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, email: "user@example.com" },
    });

    let company = await fastify.prisma.company.findUnique({
      where: { userId },
    });
    if (!company) {
      company = await fastify.prisma.company.create({
        data: {
          userId,
          name: "Default Company",
          sector: "Technology",
          targetRaise: 1000000,
          revenue: 500000,
        },
      });
    }

    const message = await fastify.prisma.message.create({
      data: {
        companyId: company.id,
        sender,
        text: content,
      },
    });

    reply.send(message);
  });

  // GET /api/messages
  fastify.get("/messages", async (request, reply) => {
    const userId = "user1"; // Mock

    const company = await fastify.prisma.company.findUnique({
      where: { userId },
    });

    let messages: any[] = [];
    if (company) {
      messages = await fastify.prisma.message.findMany({
        where: { companyId: company.id },
        orderBy: { createdAt: "asc" },
      });
    }

    // Return mock messages if none exist
    if (messages.length === 0) {
      messages = [
        {
          id: "mock-msg-1",
          companyId: "mock-company-1",
          sender: "support",
          content:
            "Welcome to our investor platform! How can we help you today?",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
        {
          id: "mock-msg-2",
          companyId: "mock-company-1",
          sender: "user",
          content: "Hi! I have some questions about the onboarding process.",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 300000), // 2 days ago + 5 min
        },
        {
          id: "mock-msg-3",
          companyId: "mock-company-1",
          sender: "support",
          content:
            "Of course! The onboarding process typically takes 2-3 weeks. We'll guide you through each step.",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 600000), // 2 days ago + 10 min
        },
        {
          id: "mock-msg-4",
          companyId: "mock-company-1",
          sender: "support",
          content:
            "Your documents look great! We'll schedule a call with potential investors soon.",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        },
      ];
    }

    reply.send(messages);
  });
}
