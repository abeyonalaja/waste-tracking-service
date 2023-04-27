import { DaprServer, HttpMethod, LogLevel } from '@dapr/dapr';
import Boom from '@hapi/boom';
import * as api from '@wts/api/annex-vii';
import { LoggerService } from '@wts/util/dapr-winston-logging';
import { fromBoom } from '@wts/util/invocation';
import * as winston from 'winston';
import { DraftController } from './controller';
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

await server.invoker.listen(api.getDraftById.name, async ({ body }) => {
  if (body === undefined) {
    return fromBoom(Boom.badRequest());
  }

  const request = JSON.parse(body) as api.GetDraftByIdRequest;
  return await draftController.getDraftById(request);
});

await server.invoker.listen(api.getDrafts.name, async ({ body }) => {
  if (body === undefined) {
    return fromBoom(Boom.badRequest());
  }

  const request = JSON.parse(body) as api.GetDraftsRequest;
  return await draftController.getDrafts(request);
});

await server.invoker.listen(
  api.createDraft.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest());
    }

    const request = JSON.parse(body) as api.CreateDraftRequest;
    return await draftController.createDraft(request);
  },
  { method: HttpMethod.POST }
);

await server.start();
