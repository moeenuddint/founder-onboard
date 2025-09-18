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
- npm install

### Installation

1. Clone the repo
2. Install dependencies for both frontend and backend: npm i
   ```bash
   npm run dev for concurrently both backend and frontend
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
npx prisma migrate dev
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


## Development

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Database: SQLite (dev.db)

## Deployment

- Database: SQLite for demo

## Environment Variables

Create `.env.local` file in `apps/front`.

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
## Loom Demo
Video 1
[\[Link to Loom video\]](https://www.loom.com/share/61e05b2384c44f3f88a71f30d722f29b?sid=5aad7d58-2ff3-4ea8-a357-541e962384f3)
Video 2
https://www.loom.com/share/0cd832ec5b744d768e7fb4b94c3d780f

## Time Spent

~5 hours total