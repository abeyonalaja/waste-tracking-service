import { DaprServer, HttpMethod, LogLevel } from '@dapr/dapr';
import { LoggerService } from '@wts/util/dapr-winston-logging';
import Boom from '@hapi/boom';
import { fromBoom } from '@wts/util/invocation';
import * as winston from 'winston';
import * as api from '@wts/api/reference-data';
import {
  AzureCliCredential,
  ChainedTokenCredential,
  WorkloadIdentityCredential,
} from '@azure/identity';
import { CosmosClient } from '@azure/cosmos';
import { ReferenceDataController } from './controller';
import CosmosReferenceDataRepository from './data/cosmos-reference-data';
import { LRUCache } from 'lru-cache';

if (!process.env['COSMOS_DB_ACCOUNT_URI']) {
  throw new Error('Missing COSMOS_DB_ACCOUNT_URI configuration');
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: { appId: process.env['APP_ID'] },
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

const aadCredentials = new ChainedTokenCredential(
  new AzureCliCredential(),
  new WorkloadIdentityCredential()
);

const referenceDataController = new ReferenceDataController(
  new CosmosReferenceDataRepository(
    new CosmosClient({
      endpoint: process.env['COSMOS_DB_ACCOUNT_URI'],
      aadCredentials,
    }),
    process.env['COSMOS_DATABASE_NAME'] || 'waste-information',
    process.env['COSMOS_CONTAINER_NAME'] || 'reference-data',
    new LRUCache({ ttl: 1000 * 60 * 60, max: 5 }),
    logger
  ),
  logger
);

await server.invoker.listen(
  api.getWasteCodes.name,
  async () => {
    return await referenceDataController.getWasteCodes(null);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getEWCCodes.name,
  async () => {
    return await referenceDataController.getEWCCodes(null);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getCountries.name,
  async () => {
    return await referenceDataController.getCountries(null);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getRecoveryCodes.name,
  async () => {
    return await referenceDataController.getRecoveryCodes(null);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDisposalCodes.name,
  async () => {
    return await referenceDataController.getDisposalCodes(null);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createWasteCodes.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.CreateWasteCodesRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.createWasteCodes(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createEWCCodes.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.CreateEWCCodesRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.createEWCCodes(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createCountries.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.CreateCountriesRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.createCountries(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createRecoveryCodes.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.CreateRecoveryCodesRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.createRecoveryCodes(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createDisposalCodes.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.CreateDisposalCodesRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.createDisposalCodes(request);
  },
  { method: HttpMethod.POST }
);

await server.start();
