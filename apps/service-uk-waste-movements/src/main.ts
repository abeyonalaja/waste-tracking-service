import { DaprServer, HttpMethod, LogLevel } from '@dapr/dapr';
import Boom from '@hapi/boom';
import * as api from '@wts/api/uk-waste-movements';
import { LoggerService } from '@wts/util/dapr-winston-logging';
import { fromBoom } from '@wts/util/invocation';
import * as winston from 'winston';
import { PingController, parse } from './controller';

if (!process.env['COSMOS_DB_ACCOUNT_URI']) {
  throw new Error('Missing COSMOS_DB_ACCOUNT_URI configuration.');
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: { appId: process.env['APP_ID'] || 'service-uk-waste-movements' },
  transports: [new winston.transports.Console()],
});

const server = new DaprServer({
  serverHost: '127.0.0.1',
  clientOptions: {
    daprHost: '127.0.0.1',
  },
  logger: {
    level: LogLevel.Info,
    service: new LoggerService(logger),
  },
});

const pingController = new PingController(logger);

await server.invoker.listen(
  api.ping.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.pingRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await pingController.ping(request);
  },
  { method: HttpMethod.POST }
);

await server.start();
