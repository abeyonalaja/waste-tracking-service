FROM node:18-alpine

ENV NODE_ENV=production \
    APP_PORT=3000 \
    NODE_TLS_REJECT_UNAUTHORIZED=0

WORKDIR /app
COPY --chown=node:node dist/apps/service-payment/main.js ./main.js
COPY --chown=node:node dist/apps/service-payment/tracing.js ./tracing.js
COPY --chown=node:node dist/apps/service-payment/package*.json ./

RUN npm ci

USER node
EXPOSE ${APP_PORT}

CMD [ "--require", "./tracing.js", "main.js" ]