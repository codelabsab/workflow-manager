FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN yarn install --frozen-lockfile

FROM base AS dev

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
