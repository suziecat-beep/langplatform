FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile
COPY . .
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
