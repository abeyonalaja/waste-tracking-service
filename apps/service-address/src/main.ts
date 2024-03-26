import { DaprServer, HttpMethod, LogLevel } from '@dapr/dapr';
import fs from 'fs';
import Boom from '@hapi/boom';
import * as api from '@wts/api/address';
import { LoggerService } from '@wts/util/dapr-winston-logging';
import { fromBoom } from '@wts/util/invocation';
import winston from 'winston';
import { AddressController, parse } from './controller';
import BoomiAddressClient from './clients/address-client';

if (!process.env['ADDRESS_LOOKUP_URL']) {
  throw new Error('Missing ADDRESS_LOOKUP_URL configuration.');
}

if (!process.env['CERT_FOLDER']) {
  throw new Error('Missing CERT_FOLDER configuration.');
}

if (!process.env['CERT_NAME']) {
  throw new Error('Missing CERT_NAME configuration.');
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: { appId: process.env['APP_ID'] || 'service-address' },
  transports: [new winston.transports.Console()],
});

const server = new DaprServer({
  serverHost: '127.0.0.1',
  serverPort: process.env['APP_PORT'] || '5000',
  clientOptions: {
    daprHost: '127.0.0.1',
  },
  logger: {
    level: LogLevel.Info,
    service: new LoggerService(logger),
  },
});

const addressClient = new BoomiAddressClient(
  logger,
  process.env['ADDRESS_LOOKUP_URL'],
  fs.readFileSync(
    `${process.env['CERT_FOLDER']}${process.env['CERT_NAME']}.crt`
  ),
  fs.readFileSync(
    `${process.env['CERT_FOLDER']}${process.env['CERT_NAME']}.key`
  )
);

const addressController = new AddressController(addressClient, logger);

await server.invoker.listen(
  api.getAddressByPostcode.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getAddressByPostcodeRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await addressController.getAddressByPostcode(request);
  },
  {
    method: HttpMethod.POST,
  }
);

await server.start();
