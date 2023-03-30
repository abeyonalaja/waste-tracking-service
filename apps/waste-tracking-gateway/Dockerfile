FROM node:18-alpine

ENV NODE_ENV production
ENV PORT 3000

WORKDIR /app
COPY --chown=node:node dist/apps/waste-tracking-gateway/main.js ./main.js
COPY --chown=node:node dist/apps/waste-tracking-gateway/package*.json ./

RUN npm ci

USER node
EXPOSE 3000

CMD [ "main.js" ]
