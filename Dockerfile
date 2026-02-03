# Multi-stage build for Next.js application
FROM node:20-slim AS base

# Install dependencies only when needed
FROM base AS deps
RUN apt-get update && apt-get install -y openssl ca-certificates python3 make g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
RUN apt-get update && apt-get install -y openssl ca-certificates python3 make g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json* ./
# Install all dependencies
RUN npm install --legacy-peer-deps
COPY . .

# Declare build arguments for NEXT_PUBLIC_ variables
ARG NEXT_PUBLIC_NEWRELIC_TENANT_BKUS
ARG NEXT_PUBLIC_NEWRELIC_ACCOUNT_ID_BKUS
ARG NEXT_PUBLIC_NEWRELIC_API_KEY_BKUS
ARG NEXT_PUBLIC_NEWRELIC_TENANT_PLKUS
ARG NEXT_PUBLIC_NEWRELIC_ACCOUNT_ID_PLKUS
ARG NEXT_PUBLIC_NEWRELIC_API_KEY_PLKUS

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DOCKER_BUILD=true
ENV NEXT_PUBLIC_NEWRELIC_TENANT_BKUS=$NEXT_PUBLIC_NEWRELIC_TENANT_BKUS
ENV NEXT_PUBLIC_NEWRELIC_ACCOUNT_ID_BKUS=$NEXT_PUBLIC_NEWRELIC_ACCOUNT_ID_BKUS
ENV NEXT_PUBLIC_NEWRELIC_API_KEY_BKUS=$NEXT_PUBLIC_NEWRELIC_API_KEY_BKUS
ENV NEXT_PUBLIC_NEWRELIC_TENANT_PLKUS=$NEXT_PUBLIC_NEWRELIC_TENANT_PLKUS
ENV NEXT_PUBLIC_NEWRELIC_ACCOUNT_ID_PLKUS=$NEXT_PUBLIC_NEWRELIC_ACCOUNT_ID_PLKUS
ENV NEXT_PUBLIC_NEWRELIC_API_KEY_PLKUS=$NEXT_PUBLIC_NEWRELIC_API_KEY_PLKUS

# Debug: Print the values to verify they're set
RUN echo "Building with BKUS Account ID: $NEXT_PUBLIC_NEWRELIC_ACCOUNT_ID_BKUS"
RUN echo "Building with PLKUS Account ID: $NEXT_PUBLIC_NEWRELIC_ACCOUNT_ID_PLKUS"

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
