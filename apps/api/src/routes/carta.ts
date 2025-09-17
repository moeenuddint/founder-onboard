import { FastifyInstance } from "fastify";

export default async function cartaRoutes(fastify: FastifyInstance) {
  // GET /api/carta/cap-table - Get cap table data
  fastify.get("/carta/cap-table", async (request, reply) => {
    // Mock cap table data
    const capTable = {
      company: {
        name: "TechStart Inc.",
        totalShares: 10000000,
        outstandingShares: 7500000,
        fullyDilutedShares: 8500000,
      },
      shareholders: [
        {
          id: "holder_001",
          name: "Founder A",
          type: "founder",
          shares: 3000000,
          percentage: 35.29,
          shareClass: "Common",
          vestingSchedule: "4-year cliff, monthly vesting",
        },
        {
          id: "holder_002",
          name: "Founder B",
          type: "founder",
          shares: 2500000,
          percentage: 29.41,
          shareClass: "Common",
          vestingSchedule: "4-year cliff, monthly vesting",
        },
        {
          id: "holder_003",
          name: "Seed Investors",
          type: "investor",
          shares: 1500000,
          percentage: 17.65,
          shareClass: "Preferred A",
          investment: 500000,
          valuation: 3000000,
        },
        {
          id: "holder_004",
          name: "Employee Option Pool",
          type: "pool",
          shares: 1000000,
          percentage: 11.76,
          shareClass: "Common",
          allocated: 250000,
          available: 750000,
        },
        {
          id: "holder_005",
          name: "Advisor",
          type: "advisor",
          shares: 150000,
          percentage: 1.76,
          shareClass: "Common",
          vestingSchedule: "2-year cliff, monthly vesting",
        },
        {
          id: "holder_006",
          name: "Early Employee",
          type: "employee",
          shares: 350000,
          percentage: 4.12,
          shareClass: "Common",
          vestingSchedule: "4-year cliff, monthly vesting",
        },
      ],
      summary: {
        totalInvestors: 1,
        totalRaised: 500000,
        currentValuation: 3000000,
        lastRound: {
          type: "Seed",
          amount: 500000,
          valuation: 3000000,
          date: "2024-01-15",
        },
      },
      generatedAt: new Date().toISOString(),
    };

    reply.send(capTable);
  });

  // GET /api/carta/409a - Get 409A valuation
  fastify.get("/carta/409a", async (request, reply) => {
    // Mock 409A valuation data
    const valuation409a = {
      current: {
        value: 3000000,
        date: "2024-06-01",
        method: "OPM (Option Pricing Method)",
        assumptions: {
          riskFreeRate: 0.0425,
          volatility: 0.65,
          timeToExit: 7.0,
          discountRate: 0.15,
        },
      },
      history: [
        {
          value: 2500000,
          date: "2024-01-15",
          method: "OPM",
          round: "Seed",
        },
        {
          value: 2000000,
          date: "2023-08-01",
          method: "Backsolve",
          round: "Pre-seed",
        },
      ],
      nextReview: "2024-12-01",
      status: "current",
    };

    reply.send(valuation409a);
  });

  // GET /api/carta/share-classes - Get share class information
  fastify.get("/carta/share-classes", async (request, reply) => {
    const shareClasses = [
      {
        name: "Common",
        totalShares: 6000000,
        outstanding: 5750000,
        rights: {
          voting: "1 vote per share",
          dividends: "Non-cumulative",
          liquidation: "Pro-rata after preferred",
        },
      },
      {
        name: "Preferred A",
        totalShares: 2000000,
        outstanding: 1500000,
        rights: {
          voting: "1 vote per share",
          dividends: "8% annual, cumulative",
          liquidation: "1x preference + participation",
          conversion: "1:1 to Common",
        },
        preferences: {
          dividend: 0.08,
          liquidation: 1.0,
        },
      },
    ];

    reply.send(shareClasses);
  });
}
