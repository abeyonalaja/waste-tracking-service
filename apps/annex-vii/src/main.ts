import { DaprServer, HttpMethod, LogLevel } from '@dapr/dapr';
import Boom from '@hapi/boom';
import * as api from '@wts/api/annex-vii';
import { LoggerService } from '@wts/util/dapr-winston-logging';
import { fromBoom } from '@wts/util/invocation';
import * as winston from 'winston';
import { DraftController, parse, validate } from './controller';
import { DaprDraftRepository } from './data';

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

const draftController = new DraftController(
  new DaprDraftRepository(
    server.client,
    logger,
    process.env['DAPR_DRAFT_STATE_STORE'] || 'drafts.state.annex-vii'
  ),
  logger
);

await server.invoker.listen(
  api.getDraftById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getDraftByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDrafts.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getDraftsRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDrafts(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createDraft.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.createDraftRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.createDraft(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftCustomerReferenceById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getDraftCustomerReferenceByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftCustomerReferenceById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftCustomerReferenceById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(
      body
    ) as api.SetDraftCustomerReferenceByIdRequest;
    if (!validate.setDraftCustomerReferenceByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftCustomerReferenceById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftWasteDescriptionById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getDraftWasteDescriptionByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftWasteDescriptionById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftWasteDescriptionById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftWasteDescriptionByIdRequest;
    if (!validate.setDraftWasteDescriptionByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftWasteDescriptionById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftWasteQuantityById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getDraftWasteQuantityByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftWasteQuantityById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftWasteQuantityById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftWasteQuantityByIdRequest;
    if (!validate.setDraftWasteQuantityByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftWasteQuantityById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftExporterDetailById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getDraftExporterDetailByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftExporterDetailById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftExporterDetailById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftExporterDetailByIdRequest;
    if (!validate.setDraftExporterDetailByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftExporterDetailById(request);
  },
  { method: HttpMethod.POST }
);

await server.start();
