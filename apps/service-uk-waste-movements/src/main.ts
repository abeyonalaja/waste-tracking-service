import { DaprServer, HttpMethod, LogLevel } from '@dapr/dapr';
import Boom from '@hapi/boom';
import * as api from '@wts/api/uk-waste-movements';
import { LoggerService } from '@wts/util/dapr-winston-logging';
import { fromBoom } from '@wts/util/invocation';
import * as winston from 'winston';
import { SubmissionController, validateSubmission } from './controller';
import { DaprReferenceDataClient } from '@wts/client/reference-data';

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

const submissionController = new SubmissionController(
  new DaprReferenceDataClient(
    server.client,
    process.env['REFERENCE_DATA_APP_ID'] || 'service-reference-data'
  ),
  logger
);

await server.invoker.listen(
  api.validateSubmissions.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.ValidateSubmissionsRequest;
    if (!validateSubmission.validateSubmissionsRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await submissionController.validateSubmissions(request);
  },
  { method: HttpMethod.POST }
);

await server.start();
