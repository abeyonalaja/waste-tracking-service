FROM node:18-alpine

RUN apk add --no-cache dumb-init
ENV NODE_ENV production
ENV PORT 3000

ENV CHROME_BIN="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium

WORKDIR /app
COPY --chown=node:node dist/apps/waste-tracking-service/.next ./.next
COPY --chown=node:node dist/apps/waste-tracking-service/public ./public
COPY --chown=node:node dist/apps/waste-tracking-service/package*.json ./

RUN npm ci

USER node
EXPOSE 3000

CMD ["dumb-init", "node_modules/.bin/next", "start"]
