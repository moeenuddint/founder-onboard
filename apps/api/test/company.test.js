"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/api/src/routes/company.test.ts
const vitest_1 = require("vitest");
const fastify_1 = __importDefault(require("fastify"));
const company_1 = __importDefault(require("../src/routes/company"));
function getMockPrisma() {
    return {
        user: {
            upsert: vitest_1.vi.fn().mockResolvedValue({ id: "user1", email: "user@example.com" }),
        },
        company: {
            upsert: vitest_1.vi.fn().mockResolvedValue({
                userId: "user1",
                name: "Test Co",
                sector: "Tech",
                targetRaise: 1000000,
                revenue: 500000,
            }),
            findUnique: vitest_1.vi.fn().mockResolvedValue({
                userId: "user1",
                name: "Test Co",
                sector: "Tech",
                targetRaise: 1000000,
                revenue: 500000,
            }),
        },
        notification: {
            create: vitest_1.vi.fn().mockResolvedValue({}),
        },
    };
}
(0, vitest_1.describe)("Company Routes", () => {
    let fastify;
    (0, vitest_1.beforeEach)(async () => {
        fastify = (0, fastify_1.default)();
        fastify.prisma = getMockPrisma();
        await fastify.register(company_1.default);
        await fastify.ready();
    });
    (0, vitest_1.afterEach)(async () => {
        await fastify.close();
    });
    (0, vitest_1.it)("should create company", async () => {
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
        (0, vitest_1.expect)(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        (0, vitest_1.expect)(body.name).toBe("Test Co");
        (0, vitest_1.expect)(body.sector).toBe("Tech");
        (0, vitest_1.expect)(body.targetRaise).toBe(1000000);
        (0, vitest_1.expect)(body.revenue).toBe(500000);
    });
    (0, vitest_1.it)("should get company", async () => {
        const response = await fastify.inject({
            method: "GET",
            url: "/company",
        });
        (0, vitest_1.expect)(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        (0, vitest_1.expect)(body.name).toBe("Test Co");
        (0, vitest_1.expect)(body.sector).toBe("Tech");
        (0, vitest_1.expect)(body.targetRaise).toBe(1000000);
        (0, vitest_1.expect)(body.revenue).toBe(500000);
    });
});
