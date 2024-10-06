# Based on https://authjs.dev/getting-started/deployment#docker

FROM node:20-alpine AS base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml* /app/
# Disable telemetry.
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies only when needed
FROM base AS dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY prisma/schema.prisma /app/prisma/schema.prisma
RUN pnpm prisma generate

FROM dependencies AS development
ENV NODE_ENV=development
COPY . /app
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV AUTH_TRUST_HOST=true
CMD ["pnpm", "dev"]

# Rebuild the source code only when needed
FROM dependencies AS builder
COPY . /app
RUN pnpm build && pnpm prune --prod

# Production image, copy all the files and run next
FROM base AS production
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public /app/public
# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/prisma/migrations /app/prisma/migrations
COPY --from=builder /app/prisma/schema.prisma /app/prisma/
# Automatically leverage output traces to reduce image size (https://nextjs.org/docs/advanced-features/output-file-tracing)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone /app
COPY --from=builder --chown=nextjs:nodejs /app/.next/static /app/.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV AUTH_TRUST_HOST=true
# server.js is created by next build from the standalone output (https://nextjs.org/docs/pages/api-reference/next-config-js/output)
CMD ["node", "server.js"]
