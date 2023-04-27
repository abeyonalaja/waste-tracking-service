import { findAddressByPostcode } from './modules/addressLookup';
import Boom from '@hapi/boom';
import winston from 'winston';
import { DaprServer, HttpMethod } from '@dapr/dapr';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: { appId: process.env['APP_ID'] },
  transports: [new winston.transports.Console()],
});

const daprOptions = {
  daprHost: '0.0.0.0',
  serverHost: '0.0.0.0',
  serverPort: process.env['APP_PORT'] || '5000',
};

async function start() {
  const server = new DaprServer(daprOptions);

  await server.invoker.listen(
    'addresses',
    async ({ query }) => {
      //Check query parameter
      if (query === undefined || !query.includes('postcode=')) {
        return Boom.badRequest('Postcode is a required field').output.payload;
      }
      //Extract postcode from query parameter
      const querystring = query.split('?', -1).pop();
      const postcode = Object.fromEntries(
        new URLSearchParams(querystring).entries()
      ).postcode;
      //Process the lookup request
      const result = await findAddressByPostcode(
        postcode as string,
        server.client,
        logger
      );
      if (result === undefined) {
        return Boom.badRequest('Invalid Postcode').output.payload;
      }
      return result;
    },
    {
      method: HttpMethod.GET,
    }
  );

  await server.start();
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
