FROM node:20.11.1-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY src/prisma ./src/prisma/

RUN npm ci

COPY ./src ./src

RUN npx prisma generate \
  && npm run build

RUN npm prune --omit=dev \
  && npm cache clean --force

RUN rm -rf /app/node_modules/@prisma/engines/ 
RUN rm -rf /app/node_modules/@prisma/engines-version
RUN rm -rf /app/node_modules/prisma

FROM node:20.11.1-alpine AS prod
WORKDIR /app

RUN addgroup -g 1001 -S production
RUN adduser -S backend -u 1001

COPY package*.json ./
COPY tsconfig.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/prisma ./dist/prisma
COPY --from=builder /app/dist ./dist

COPY --chown=backend:production docker-entrypoint.sh ./

USER backend
EXPOSE ${PORT}
EXPOSE ${DB_PORT}

CMD ["node", "dist/main.js"]