import { DaprServer, HttpMethod, LogLevel } from '@dapr/dapr';
import Boom from '@hapi/boom';
import * as api from '@wts/api/payment';
import { LoggerService } from '@wts/util/dapr-winston-logging';
import { fromBoom } from '@wts/util/invocation';
import winston from 'winston';
import { PaymentController, parse, validate } from './controller';
import GovUkPayServiceChargeClient from './clients/service-charge-client';
import { CosmosClient } from '@azure/cosmos';
import {
  AzureCliCredential,
  ChainedTokenCredential,
  WorkloadIdentityCredential,
} from '@azure/identity';
import CosmosServiceChargeRepository from './data/cosmos-repository';

if (!process.env['GOVUK_PAY_API_URL']) {
  throw new Error('Missing GOVUK_PAY_API_URL configuration.');
}

if (!process.env['GOVUK_PAY_API_KEY']) {
  throw new Error('Missing GOVUK_PAY_API_KEY configuration.');
}

if (!process.env['COSMOS_DB_ACCOUNT_URI']) {
  throw new Error('Missing COSMOS_DB_ACCOUNT_URI configuration.');
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: { appId: process.env['APP_ID'] || 'service-payment' },
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

const repository = new CosmosServiceChargeRepository(
  new CosmosClient({
    endpoint: process.env['COSMOS_DB_ACCOUNT_URI'],
    aadCredentials: new ChainedTokenCredential(
      new AzureCliCredential(),
      new WorkloadIdentityCredential(),
    ),
  }).database(process.env['COSMOS_DATABASE_NAME'] || 'payment'),
  new Map<api.DbContainerNameKey, string>([
    ['drafts', process.env['COSMOS_DRAFTS_CONTAINER_NAME'] || 'drafts'],
    [
      'service-charges',
      process.env['COSMOS_SERVICE_CHARGE_CONTAINER_NAME'] || 'service-charges',
    ],
  ]),
  logger,
);

const paymentController = new PaymentController(
  new GovUkPayServiceChargeClient(logger),
  repository,
  logger,
);

async function init() {
  await server.invoker.listen(
    api.createPayment.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(body) as api.CreatePaymentRequest;
      if (!validate.createPaymentRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await paymentController.createPayment(request);
    },
    {
      method: HttpMethod.POST,
    },
  );

  await server.invoker.listen(
    api.setPayment.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = parse.setPaymentRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await paymentController.setPayment(request);
    },
    {
      method: HttpMethod.POST,
    },
  );

  await server.invoker.listen(
    api.getPayment.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = parse.getPaymentRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await paymentController.getPayment(request);
    },
    {
      method: HttpMethod.POST,
    },
  );

  await server.invoker.listen(
    api.cancelPayment.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = parse.cancelPaymentRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await paymentController.cancelPayment(request);
    },
    {
      method: HttpMethod.POST,
    },
  );

  await server.start();
}

init();
