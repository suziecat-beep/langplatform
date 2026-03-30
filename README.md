# LangPlatform — Language Learning Resource Platform

A web-based platform where language learners discover, share, and organize learning resources across any target language. Resources are tagged by language, proficiency level (A1–C2), and skill focus, with community ratings and collections.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL 16 + Prisma ORM
- **Auth:** NextAuth.js (Google OAuth + Credentials)
- **State:** React Query + Zustand
- **File Upload:** AWS S3 (presigned URLs)

## Prerequisites

- Node.js 20 LTS
- pnpm (`npm install -g pnpm`)
- PostgreSQL 16 (or Docker)

## Getting Started

1. **Clone and install:**
   ```bash
   git clone <repo-url>
   cd langplatform
   pnpm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and secrets
   ```

3. **Set up database:**
   ```bash
   # Using Docker:
   docker compose up db -d

   # Push schema:
   npx prisma db push

   # Seed with sample data:
   pnpm db:seed
   ```

4. **Run development server:**
   ```bash
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

### Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@langplatform.com | password123 |
| Contributor | contributor@langplatform.com | password123 |
| Learner | learner@langplatform.com | password123 |

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm db:seed` | Seed database with sample data |
| `pnpm test` | Run tests |
| `pnpm lint` | Lint code |

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login & register pages
│   ├── (main)/          # Main app pages
│   │   ├── resources/   # Browse, detail, upload
│   │   ├── collections/ # Collection listing & detail
│   │   ├── media/       # Media hub
│   │   ├── dashboard/   # User dashboard
│   │   └── admin/       # Admin panel
│   └── api/             # API routes
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── resources/       # Resource-specific components
│   ├── collections/     # Collection components
│   └── layout/          # Navbar, footer, mobile nav
├── hooks/               # React Query hooks
├── lib/                 # Utilities, auth, DB, validations
└── types/               # TypeScript type definitions
```

## Architecture

- **API Routes** handle all data operations with Zod validation and role-based auth
- **React Query hooks** manage client-side data fetching with cache invalidation
- **Prisma** provides type-safe database access with PostgreSQL
- **NextAuth** handles authentication with JWT sessions
- **S3 presigned URLs** enable direct-to-storage file uploads

## Deployment

### Docker

```bash
docker compose up --build
```

### Vercel

```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy
vercel
```

Set environment variables in the Vercel dashboard.
