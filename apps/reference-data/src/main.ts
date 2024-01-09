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
import { ReferenceDataController } from './controller';
import CosmosReferenceDataRepository from './data/cosmos-reference-data';
import { CosmosReferenceDataClient } from './clients';
import { CosmosClient } from '@azure/cosmos';

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
    new CosmosReferenceDataClient(
      new CosmosClient({
        endpoint: process.env['COSMOS_DB_ACCOUNT_URI'],
        aadCredentials,
      }),
      process.env['COSMOS_DATABASE_NAME'] || 'waste-information'
    ),
    process.env['COSMOS_CONTAINER_NAME'] || 'reference-data',
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
  api.updateWasteCodes.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.UpdateWasteCodesRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.updateWasteCodes(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.deleteWasteCodes.name,
  async () => {
    return await referenceDataController.deleteWasteCodes(null);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createWasteCode.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.CreateWasteCodeRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.createWasteCode(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.updateWasteCode.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.UpdateWasteCodeRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.updateWasteCode(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.deleteWasteCode.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.DeleteWasteCodeRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.deleteWasteCode(request);
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
  api.updateEWCCodes.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.UpdateEWCCodesRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.updateEWCCodes(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.deleteEWCCodes.name,
  async () => {
    return await referenceDataController.deleteEWCCodes(null);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createEWCCode.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.CreateEWCCodeRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.createEWCCode(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.updateEWCCode.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.UpdateEWCCodeRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.updateEWCCode(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.deleteEWCCode.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.DeleteEWCCodeRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.deleteEWCCode(request);
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
  api.updateCountries.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.UpdateCountriesRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.updateCountries(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.deleteCountries.name,
  async () => {
    return await referenceDataController.deleteCountries(null);
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
  api.updateRecoveryCodes.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.UpdateRecoveryCodesRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.updateRecoveryCodes(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.deleteRecoveryCodes.name,
  async () => {
    return await referenceDataController.deleteRecoveryCodes(null);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createRecoveryCode.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.CreateRecoveryCodeRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.createRecoveryCode(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.updateRecoveryCode.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.UpdateRecoveryCodeRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.updateRecoveryCode(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.deleteRecoveryCode.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.DeleteRecoveryCodeRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.deleteRecoveryCode(request);
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

await server.invoker.listen(
  api.updateDisposalCodes.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.UpdateDisposalCodesRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.updateDisposalCodes(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.deleteDisposalCodes.name,
  async () => {
    return await referenceDataController.deleteDisposalCodes(null);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createDisposalCode.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.CreateDisposalCodeRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.createDisposalCode(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.updateDisposalCode.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.UpdateDisposalCodeRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.updateDisposalCode(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.deleteDisposalCode.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.DeleteDisposalCodeRequest;
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await referenceDataController.deleteDisposalCode(request);
  },
  { method: HttpMethod.POST }
);

await server.start();
