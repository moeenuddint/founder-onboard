// apps/api/src/routes/company.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import Fastify from "fastify";
import companyRoutes from "../src/routes/company";

function getMockPrisma() {
  return {
    user: {
      upsert: vi.fn().mockResolvedValue({ id: "user1", email: "user@example.com" }),
    },
    company: {
      upsert: vi.fn().mockResolvedValue({
        userId: "user1",
        name: "Test Co",
        sector: "Tech",
        targetRaise: 1000000,
        revenue: 500000,
      }),
      findUnique: vi.fn().mockResolvedValue({
        userId: "user1",
        name: "Test Co",
        sector: "Tech",
        targetRaise: 1000000,
        revenue: 500000,
      }),
    },
    notification: {
      create: vi.fn().mockResolvedValue({}),
    },
  };
}

describe("Company Routes", () => {
  let fastify: any;

  beforeEach(async () => {
    fastify = Fastify();
    fastify.prisma = getMockPrisma();
    await fastify.register(companyRoutes);
    await fastify.ready();
  });

  afterEach(async () => {
    await fastify.close();
  });

  it("should create company", async () => {
    const response = await fastify.inject({
      method: "POST",
      url: "/company",
      payload: {
        name: "Test Co",
        sector: "Tech",
        targetRaise: 1000000,
        revenue: 500000,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.name).toBe("Test Co");
    expect(body.sector).toBe("Tech");
    expect(body.targetRaise).toBe(1000000);
    expect(body.revenue).toBe(500000);
  });

  it("should get company", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/company",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.name).toBe("Test Co");
    expect(body.sector).toBe("Tech");
    expect(body.targetRaise).toBe(1000000);
    expect(body.revenue).toBe(500000);
  });
});