import { DaprServer, HttpMethod, LogLevel } from '@dapr/dapr';
import Boom from '@hapi/boom';
import { fromBoom } from '@wts/util/invocation';
import * as api from '@wts/api/feedback';
import { LoggerService } from '@wts/util/dapr-winston-logging';
import winston from 'winston';
import { FeedbackController, parse } from './controller';
import FeedbackClient from './clients/feedback-client';
import { ServiceName } from '@wts/api/feedback';

const surveyIDMap = new Map<ServiceName, string>();

if (!process.env['CLIENT_ID']) {
  throw new Error('Missing CLIENT_ID from environment configuration.');
}

if (!process.env['CLIENT_SECRET']) {
  throw new Error('Missing CLIENT_SECRET from environment configuration.');
}

if (!process.env['GLW_SURVEY_ID']) {
  throw new Error('Missing GLW_SURVEY_ID from environment configuration.');
}
surveyIDMap.set('glw', process.env['GLW_SURVEY_ID']);

if (!process.env['UKWM_SURVEY_ID']) {
  throw new Error('Missing UKWM_SURVEY_ID from environment configuration.');
}
surveyIDMap.set('ukwm', process.env['UKWM_SURVEY_ID']);

if (!process.env['SURVEY_API_ENDPOINT']) {
  throw new Error(
    'Missing SURVEY_API_ENDPOINT from environment configuration.',
  );
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: { appId: process.env['APP_ID'] || 'service-feedback' },
  transports: [new winston.transports.Console()],
});

const server = new DaprServer({
  serverHost: '127.0.0.1',
  serverPort: process.env['APP_PORT'] || '7000',
  clientOptions: {
    daprHost: '127.0.0.1',
  },
  logger: {
    level: LogLevel.Info,
    service: new LoggerService(logger),
  },
});

const feedbackClient = new FeedbackClient(
  logger,
  process.env['CLIENT_ID'],
  process.env['CLIENT_SECRET'],
  surveyIDMap,
  process.env['SURVEY_API_ENDPOINT'],
);

const feedbackController = new FeedbackController(feedbackClient, logger);

await server.invoker.listen(
  api.sendFeedback.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }
    const request = parse.sendFeedbackRequest(body);

    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }
    return await feedbackController.sendFeedback(request);
  },
  {
    method: HttpMethod.POST,
  },
);

await server.start();
