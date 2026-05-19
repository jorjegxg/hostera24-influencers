# syntax=docker/dockerfile:1
# Build: docker compose build web  (citește .env din rădăcina monorepo)

FROM node:20-alpine AS deps

WORKDIR /app/frontend-hostera24

COPY frontend-hostera24/package.json frontend-hostera24/package-lock.json ./
RUN npm ci

FROM node:20-alpine AS build

WORKDIR /app

COPY .env ./
COPY frontend-hostera24 ./frontend-hostera24
COPY --from=deps /app/frontend-hostera24/node_modules ./frontend-hostera24/node_modules

WORKDIR /app/frontend-hostera24

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app/frontend-hostera24

ENV NODE_ENV=production

RUN addgroup -S hostera && adduser -S hostera -G hostera

COPY frontend-hostera24/package.json frontend-hostera24/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/frontend-hostera24/.next ./.next
COPY --from=build /app/frontend-hostera24/public ./public

USER hostera

CMD ["npm", "run", "start"]
