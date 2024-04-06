### Stage 1 - Buid artifact
FROM node:20-alpine AS builder

WORKDIR /home/node

COPY --chown=node:node . .
RUN npm ci
RUN npm run shipment:build

### Stage 2 - Optimize artifact size
FROM node:20-alpine as prod

ENV NODE_ENV production

COPY --chown=node:node --from=builder /home/node/dist ./dist
COPY --chown=node:node --from=builder /home/node/node_modules node_modules

CMD ["node", "dist/apps/shipment-service/main"]