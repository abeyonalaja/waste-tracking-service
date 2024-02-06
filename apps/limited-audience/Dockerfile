FROM node:18-alpine

ENV NODE_ENV=production \
    APP_PORT=3000

WORKDIR /app
COPY --chown=node:node dist/apps/limited-audience/main.js ./main.js
COPY --chown=node:node dist/apps/limited-audience/tracing.js ./tracing.js
COPY --chown=node:node dist/apps/limited-audience/package*.json ./

RUN npm ci

USER node
EXPOSE ${APP_PORT}

CMD [ "--require", "./tracing.js", "main.js" ]
