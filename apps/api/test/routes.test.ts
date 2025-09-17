import { describe, it, expect } from "vitest";
import Fastify from "fastify";
import companyRoutes from "../src/routes/company";

describe("Company Routes", () => {
  it("should create company", async () => {
    const fastify = Fastify();
    fastify.register(companyRoutes, { prefix: "/api" });

    const response = await fastify.inject({
      method: "POST",
      url: "/api/company",
      payload: {
        name: "Test Co",
        sector: "Tech",
        targetRaise: 1000000,
        revenue: 500000,
      },
    });

    expect(response.statusCode).toBe(200);
    // Add more assertions
  });
});
