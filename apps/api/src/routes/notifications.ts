import { FastifyInstance } from "fastify";

export default async function notificationsRoutes(fastify: FastifyInstance) {
  // GET /api/notifications
  fastify.get("/notifications", async (request, reply) => {
    const userId = "user1"; // Mock

    let notifications = await fastify.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Return mock notifications if none exist
    if (notifications.length === 0) {
      notifications = [
        {
          id: "mock-notif-1",
          userId,
          type: "document",
          message:
            "Welcome to your investor dashboard! Start by uploading your documents.",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          readAt: null,
        },
        {
          id: "mock-notif-2",
          userId,
          type: "score",
          message:
            "Your investability score has been calculated. Check your dashboard for details.",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          readAt: null,
        },
        {
          id: "mock-notif-3",
          userId,
          type: "meeting",
          message:
            "Investor meeting scheduled for next week. Prepare your pitch deck.",
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          readAt: null,
        },
      ];
    }

    reply.send(notifications);
  });
}
