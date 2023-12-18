FROM node:18-alpine

ENV NODE_ENV=production \
    PORT=3000 \
    NODE_TLS_REJECT_UNAUTHORIZED=0

WORKDIR /app
COPY --chown=node:node dist/apps/waste-tracking-gateway/main.js ./main.js
COPY --chown=node:node dist/apps/waste-tracking-gateway/tracing.js ./tracing.js
COPY --chown=node:node dist/apps/waste-tracking-gateway/package*.json ./

RUN npm ci

USER node
EXPOSE ${PORT}

CMD [ "--require", "./tracing.js", "main.js" ]
