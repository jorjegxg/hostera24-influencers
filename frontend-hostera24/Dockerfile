# syntax=docker/dockerfile:1
# Build: docker compose build web
# NEXT_PUBLIC_* trebuie la build (nu doar la runtime) — compose trimite args din .env

FROM node:20-alpine AS deps

WORKDIR /app/frontend-hostera24

COPY frontend-hostera24/package.json frontend-hostera24/package-lock.json ./
RUN npm ci

FROM node:20-alpine AS build

WORKDIR /app

# Build args din docker-compose (${NEXT_PUBLIC_API_URL} din .env la rădăcină)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG WEB_BASE_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV WEB_BASE_URL=$WEB_BASE_URL

COPY .env ./
COPY frontend-hostera24 ./frontend-hostera24
COPY --from=deps /app/frontend-hostera24/node_modules ./frontend-hostera24/node_modules

WORKDIR /app/frontend-hostera24

RUN test -n "$NEXT_PUBLIC_API_URL" || ( \
  echo "ERROR: NEXT_PUBLIC_API_URL lipsește la build. Setează în .env și rulează: docker compose build web" >&2; \
  exit 1 \
)

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
