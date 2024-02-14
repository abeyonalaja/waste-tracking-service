FROM node:18-alpine

RUN apk add --no-cache dumb-init
ENV NODE_ENV production
ENV PORT 3000

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

WORKDIR /app
COPY --chown=node:node dist/apps/uk-waste-movements/.next ./.next
COPY --chown=node:node dist/apps/uk-waste-movements/public ./public
COPY --chown=node:node dist/apps/uk-waste-movements/package*.json ./

RUN npm ci

USER node
EXPOSE 3000

CMD ["dumb-init", "node_modules/.bin/next", "start"]
