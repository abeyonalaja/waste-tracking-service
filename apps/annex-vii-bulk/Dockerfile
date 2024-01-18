FROM node:18-alpine

ENV NODE_ENV=production \
    APP_PORT=3000

WORKDIR /app
COPY --chown=node:node dist/apps/annex-vii-bulk/main.js ./main.js
COPY --chown=node:node dist/apps/annex-vii-bulk/tracing.js ./tracing.js
COPY --chown=node:node dist/apps/annex-vii-bulk/package*.json ./

RUN npm ci

USER node
EXPOSE ${APP_PORT}

CMD [ "--require", "./tracing.js", "main.js" ]
