FROM node:18-alpine

RUN apk add --no-cache dumb-init
ENV NODE_ENV production
ENV PORT 3000

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

WORKDIR /app
COPY --chown=node:node dist/apps/app-waste-tracking-service/.next ./.next
COPY --chown=node:node dist/apps/app-waste-tracking-service/.nx-helpers ./.nx-helpers
COPY --chown=node:node dist/apps/app-waste-tracking-service/next.config.js ./
COPY --chown=node:node dist/apps/app-waste-tracking-service/public ./public
COPY --chown=node:node dist/apps/app-waste-tracking-service/package*.json ./

RUN npm ci

USER node
EXPOSE 3000

CMD ["dumb-init", "node_modules/.bin/next", "start"]
