FROM node:18-alpine

ENV NODE_ENV=production \
    APP_PORT=5000

WORKDIR /app
COPY --chown=node:node dist/apps/service-reference-data/main.js ./main.js
COPY --chown=node:node dist/apps/service-reference-data/tracing.js ./tracing.js
COPY --chown=node:node dist/apps/service-reference-data/package*.json ./

RUN npm ci

USER node
EXPOSE ${APP_PORT}

CMD [ "--require", "./tracing.js", "main.js" ]
