import { CosmosClient } from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';
import { DaprServer, HttpMethod, LogLevel } from '@dapr/dapr';
import Boom from '@hapi/boom';
import * as api from '@wts/api/limited-audience';
import { LoggerService } from '@wts/util/dapr-winston-logging';
import { fromBoom } from '@wts/util/invocation';
import * as winston from 'winston';
import AssignmentController from './controller';
import { CosmosAssignmentRepository } from './data';
import * as parse from './deserialization';
import { JwtTokenValidator } from './tokens';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: { appId: process.env['APP_ID'] || 'service-limited-audience' },
  transports: [new winston.transports.Console()],
});

const cosmosDbAccountUri = process.env['COSMOS_DB_ACCOUNT_URI'];
if (cosmosDbAccountUri === undefined) {
  throw new Error('COSMOS_DB_ACCOUNT_URI not set');
}

const invitationTokenPublicKey = process.env['INVITATION_TOKEN_PUBLIC_KEY'];
if (invitationTokenPublicKey === undefined) {
  throw new Error('INVITATION_TOKEN_PUBLIC_KEY not set');
}

const cosmosClient = new CosmosClient({
  endpoint: cosmosDbAccountUri,
  aadCredentials: new DefaultAzureCredential(),
});

const controller = new AssignmentController(
  new CosmosAssignmentRepository(
    cosmosClient
      .database(process.env['COSMOS_DATABASE_NAME'] || 'limited-audience')
      .container(
        process.env['COSMOS_ASSIGNMENTS_CONTAINER_NAME'] || 'assignments',
      ),
    logger,
  ),
  new JwtTokenValidator(invitationTokenPublicKey),
  logger,
);

const server = new DaprServer({
  serverHost: '127.0.0.1',
  logger: {
    level: LogLevel.Info,
    service: new LoggerService(logger),
  },
});

await server.invoker.listen(
  api.checkParticipation.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.checkParticipationRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await controller.checkParticipation(request);
  },
  { method: HttpMethod.POST },
);

await server.invoker.listen(
  api.redeemInvitation.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.redeemInvitationRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await controller.redeemInvitation(request);
  },
  { method: HttpMethod.POST },
);

await server.invoker.listen(
  api.addParticipant.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.addParticipantRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await controller.addParticipant(request);
  },
  { method: HttpMethod.POST },
);

await server.start();
