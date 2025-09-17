import { FastifyInstance } from "fastify";

export default async function scoreRoutes(fastify: FastifyInstance) {
  // GET /api/score
  fastify.get("/score", async (request, reply) => {
    const userId = "user1"; // Mock
    const company = await fastify.prisma.company.findUnique({
      where: { userId },
      include: { documents: true },
    });

    // Use mock company data if none exists
    const mockCompany = {
      kycVerified: true,
      financialsLinked: true,
      documents: [
        { id: "1", name: "pitch_deck.pdf" },
        { id: "2", name: "financials.xlsx" },
        { id: "3", name: "business_plan.pdf" },
      ],
      revenue: 500000,
    };

    const data = company || mockCompany;

    let score = 0;
    const reasons: string[] = [];

    if (data.kycVerified) {
      score += 30;
      reasons.push("KYC verified - Strong foundation for investor trust");
    } else {
      reasons.push("Complete KYC verification to build investor confidence");
    }

    if (data.financialsLinked) {
      score += 20;
      reasons.push("Financials linked - Transparency is key for investors");
    } else {
      reasons.push("Link financials to demonstrate fiscal responsibility");
    }

    const docCount = data.documents.length;
    if (docCount >= 3) {
      score += 25;
      reasons.push(
        `${docCount} documents uploaded - Comprehensive due diligence package`
      );
    } else {
      reasons.push(
        `Upload ${3 - docCount} more documents for complete investor package`
      );
    }

    const revenueScore = Math.min((data.revenue / 1000000) * 25, 25);
    score += revenueScore;
    reasons.push(
      `Revenue performance: $${data.revenue.toLocaleString()} (Score: ${revenueScore.toFixed(
        0
      )}/25)`
    );

    reply.send({ score: Math.round(score), reasons });
  });
}
