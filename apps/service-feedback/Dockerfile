FROM node:18-alpine

ENV NODE_ENV=production \
    APP_PORT=7000 \
    NODE_TLS_REJECT_UNAUTHORIZED=0

WORKDIR /app
COPY --chown=node:node dist/apps/service-feedback/main.js ./main.js
COPY --chown=node:node dist/apps/service-feedback/tracing.js ./tracing.js
COPY --chown=node:node dist/apps/service-feedback/package*.json ./

RUN npm ci

USER node
EXPOSE ${APP_PORT}

CMD [ "--require", "./tracing.js", "main.js" ]