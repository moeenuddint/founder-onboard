# Founder Onboard

A full-stack application for founders to onboard their companies, upload documents, get investability scores, and schedule calls with investors.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Fastify + TypeScript
- **Database**: Prisma + SQLite
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repo
2. Install dependencies for both frontend and backend:
   ```bash
   cd apps/front && npm install
   cd ../api && npm install
   ```

### Environment Setup

1. Copy environment files:
   ```bash
   cp apps/front/.env.example apps/front/.env.local
   ```

2. Update the API URL in `apps/front/.env.local` if needed

### Database Setup

```bash
cd apps/api
npm run db:migrate
npm run db:generate
```

### Running the Application

1. Start the backend (from project root):
   ```bash
   cd apps/api && npm run dev
   ```
   Backend will run on http://localhost:8000

2. Start the frontend (from project root):
   ```bash
   cd apps/front && npm run dev
   ```
   Frontend will run on http://localhost:3000

## Features

- Company onboarding wizard (3 steps)
- KYC verification (mock)
- Bank account linking (mock)
- Document upload (PDF, PPTX, XLSX)
- Investability score calculation
- Cal.com scheduling integration
- In-app notifications
- Basic authentication
- Responsive design

## API Endpoints

- `POST /api/company` - Create/update company
- `POST /api/kyc/verify` - KYC verification
- `POST /api/financials/link` - Link financials
- `POST /api/files` - Upload files
- `GET /api/files` - List files
- `GET /api/score` - Get investability score
- `GET /api/notifications` - Get notifications

## Project Structure

```
apps/
├── api/          # Backend (Fastify)
│   ├── src/
│   ├── prisma/
│   └── package.json
└── front/        # Frontend (Next.js)
    ├── src/
    │   ├── app/
    │   └── components/
    └── package.json
```

## Development

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Database: SQLite (dev.db)

## Deployment

The application is ready for deployment:

- Frontend: Deploy to Vercel
- Backend: Deploy to Railway/Fly.io
- Database: SQLite for demo, PostgreSQL for production

## Environment Variables

Create `.env` files in `apps/api` and `apps/front` if needed.

## API Endpoints

- `POST /api/company` - Create/update company
- `POST /api/kyc/verify` - Mock KYC verification
- `POST /api/financials/link` - Mock financials link
- `POST /api/files` - Upload file
- `GET /api/files` - List files
- `GET /api/score` - Get investability score
- `GET /api/notifications` - List notifications

## Testing

```bash
npm run test
```

## Deployment

- Backend: Deploy to Render/Fly
- Frontend: Deploy to Vercel

## Decisions & Tradeoffs

- Used SQLite for simplicity in testing; in production, use PostgreSQL.
- Mocked KYC and financials linking as per requirements.
- Basic auth simulation with hardcoded user ID.
- File uploads stored locally; in production, use cloud storage.
- No real-time chat implemented due to time constraints.

## Loom Demo

[Link to Loom video]

## Time Spent

~5 hours total