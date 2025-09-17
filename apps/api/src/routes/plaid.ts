import { FastifyInstance } from "fastify";

export default async function plaidRoutes(fastify: FastifyInstance) {
  // POST /api/plaid/link/token/create - Create link token for Plaid Link
  fastify.post("/plaid/link/token/create", async (request, reply) => {
    // Mock Plaid link token creation
    const linkToken = {
      link_token: "link-mock-" + Date.now(),
      expiration: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      request_id: "req_mock_" + Date.now(),
    };

    reply.send(linkToken);
  });

  // POST /api/plaid/item/public_token/exchange - Exchange public token for access token
  fastify.post("/plaid/item/public_token/exchange", async (request, reply) => {
    const { public_token } = request.body as any;

    // Mock token exchange
    const exchangeResult = {
      access_token: "access-mock-" + Date.now(),
      item_id: "item-mock-" + Date.now(),
      request_id: "req_exchange_" + Date.now(),
    };

    reply.send(exchangeResult);
  });

  // POST /api/plaid/accounts/balance/get - Get account balances
  fastify.post("/plaid/accounts/balance/get", async (request, reply) => {
    // Mock account balances
    const balances = {
      accounts: [
        {
          account_id: "acc_checking_001",
          balances: {
            available: 2500.5,
            current: 2500.5,
            iso_currency_code: "USD",
          },
          name: "Checking Account",
          type: "depository",
          subtype: "checking",
        },
        {
          account_id: "acc_savings_001",
          balances: {
            available: 15000.75,
            current: 15000.75,
            iso_currency_code: "USD",
          },
          name: "High Yield Savings",
          type: "depository",
          subtype: "savings",
        },
      ],
      item: {
        item_id: "item_mock_123",
        institution_id: "ins_1",
        webhook: null,
      },
      request_id: "req_balances_" + Date.now(),
    };

    reply.send(balances);
  });

  // POST /api/plaid/transactions/get - Get transactions
  fastify.post("/plaid/transactions/get", async (request, reply) => {
    // Mock transactions
    const transactions = {
      accounts: [
        {
          account_id: "acc_checking_001",
          balances: {
            available: 2500.5,
            current: 2500.5,
          },
        },
      ],
      transactions: [
        {
          transaction_id: "txn_001",
          account_id: "acc_checking_001",
          amount: -25.0,
          date: new Date().toISOString().split("T")[0],
          name: "Coffee Shop",
          merchant_name: "Starbucks",
          category: ["Food and Drink", "Coffee Shop"],
          pending: false,
        },
        {
          transaction_id: "txn_002",
          account_id: "acc_checking_001",
          amount: 1500.0,
          date: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
          name: "Salary Deposit",
          category: ["Transfer", "Deposit"],
          pending: false,
        },
      ],
      item: {
        item_id: "item_mock_123",
      },
      total_transactions: 2,
      request_id: "req_transactions_" + Date.now(),
    };

    reply.send(transactions);
  });
}
