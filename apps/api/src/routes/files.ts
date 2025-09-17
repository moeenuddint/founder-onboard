import { FastifyInstance } from "fastify";
import { pipeline } from "stream/promises";
import { createWriteStream } from "fs";
import { join } from "path";

export default async function filesRoutes(fastify: FastifyInstance) {
  // POST /api/files
  fastify.post("/files", async (request, reply) => {
    debugger
    const userId = "user1"; // Mock
    const company = await fastify.prisma.company.findUnique({
      where: { userId },
    });
    if (!company) {
      // Create user and company if they don't exist
      await fastify.prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: { id: userId, email: "user@example.com" },
      });

      const newCompany = await fastify.prisma.company.create({
        data: {
          userId,
          name: "Default Company",
          sector: "Technology",
          targetRaise: 1000000,
          revenue: 500000,
        },
      });

      // Use the new company
      const data = await request.file();
      if (!data) return reply.code(400).send({ error: "No file uploaded" });

      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (!allowedTypes.includes(data.mimetype))
        return reply.code(400).send({ error: "Invalid file type" });

      const fileName = `${Date.now()}-${data.filename}`;
      const filePath = join(process.cwd(), "uploads", fileName);

      // Ensure uploads dir exists
      const fs = require("fs");
      if (!fs.existsSync(join(process.cwd(), "uploads"))) {
        fs.mkdirSync(join(process.cwd(), "uploads"));
      }

      await pipeline(data.file, createWriteStream(filePath));

      const document = await fastify.prisma.document.create({
        data: {
          companyId: newCompany.id,
          name: data.filename,
          mimeType: data.mimetype,
          size: data.file.readableLength || 0,
          path: filePath,
        },
      });

      // Notification
      await fastify.prisma.notification.create({
        data: {
          userId,
          type: "file_uploaded",
          message: `File ${data.filename} uploaded successfully.`,
        },
      });

      reply.send(document);
    } else {
      const data = await request.file();
      if (!data) return reply.code(400).send({ error: "No file uploaded" });

      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (!allowedTypes.includes(data.mimetype))
        return reply.code(400).send({ error: "Invalid file type" });

      const fileName = `${Date.now()}-${data.filename}`;
      const filePath = join(process.cwd(), "uploads", fileName);

      // Ensure uploads dir exists
      const fs = require("fs");
      if (!fs.existsSync(join(process.cwd(), "uploads"))) {
        fs.mkdirSync(join(process.cwd(), "uploads"));
      }

      await pipeline(data.file, createWriteStream(filePath));

      const document = await fastify.prisma.document.create({
        data: {
          companyId: company.id,
          name: data.filename,
          mimeType: data.mimetype,
          size: data.file.readableLength || 0,
          path: filePath,
        },
      });

      // Notification
      await fastify.prisma.notification.create({
        data: {
          userId,
          type: "file_uploaded",
          message: `File ${data.filename} uploaded successfully.`,
        },
      });

      reply.send(document);
    }
  });

  // GET /api/files
  fastify.get("/files", async (request, reply) => {
    const userId = "user1"; // Mock
    const company = await fastify.prisma.company.findUnique({
      where: { userId },
    });

    let documents: any[] = [];
    if (company) {
      documents = await fastify.prisma.document.findMany({
        where: { companyId: company.id },
        orderBy: { createdAt: "desc" },
      });
    }

    // Return mock documents if none exist
    if (documents.length === 0) {
      documents = [
        {
          id: "mock-doc-1",
          companyId: "mock-company-1",
          name: "pitch_deck.pdf",
          mimeType: "application/pdf",
          size: 2457600, // 2.4MB
          path: "/mock/path/pitch_deck.pdf",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        },
        {
          id: "mock-doc-2",
          companyId: "mock-company-1",
          name: "financials.xlsx",
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          size: 512000, // 512KB
          path: "/mock/path/financials.xlsx",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
        {
          id: "mock-doc-3",
          companyId: "mock-company-1",
          name: "business_plan.pdf",
          mimeType: "application/pdf",
          size: 1843200, // 1.8MB
          path: "/mock/path/business_plan.pdf",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        },
      ];
    }

    reply.send(documents);
  });
}
