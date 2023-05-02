import { server } from '@hapi/hapi';
import * as winston from 'winston';
import {
  InMemorySubmissionBackend,
  AnnexViiServiceBackend,
  submissionPlugin,
} from './modules/submission';
import { DaprAnnexViiClient } from '@wts/client/annex-vii';
import { DaprClient } from '@dapr/dapr';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: { appId: process.env['APP_ID'] || 'waste-tracking-gateway' },
  transports: [new winston.transports.Console()],
});

const app = server({
  port: process.env['PORT'] || 3000,
  host: '0.0.0.0',
  routes: {
    cors: true,
  },
});

const backend =
  process.env['NODE_ENV'] === 'development'
    ? new InMemorySubmissionBackend()
    : new AnnexViiServiceBackend(
        new DaprAnnexViiClient(new DaprClient()),
        logger
      );

await app.register({
  plugin: submissionPlugin,
  options: {
    backend,
    logger,
  },
  routes: {
    prefix: '/api/submissions',
  },
});

process.on('unhandledRejection', (err) => {
  logger.error(err);
  process.exit(1);
});

await app.start();
logger.info('server running', { uri: app.info.uri });
