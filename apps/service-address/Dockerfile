FROM node:18-alpine

ENV NODE_ENV=production \
    APP_PORT=5000

WORKDIR /app
COPY --chown=node:node dist/apps/service-address/main.js ./main.js
COPY --chown=node:node dist/apps/service-address/tracing.js ./tracing.js
COPY --chown=node:node dist/apps/service-address/package*.json ./

RUN npm ci

USER node
EXPOSE ${APP_PORT}

CMD [ "--require", "./tracing.js", "main.js" ]