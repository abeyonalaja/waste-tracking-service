import { server } from '@hapi/hapi';
import * as winston from 'winston';
import {
  InMemorySubmissionBackend,
  submissionPlugin,
} from './modules/submission';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: { appId: process.env['APP_ID'] },
  transports: [new winston.transports.Console()],
});

const app = server({
  port: process.env['PORT'] || 3000,
  host: '0.0.0.0',
  routes: {
    cors: true,
  },
});

await app.register({
  plugin: submissionPlugin,
  options: {
    backend: new InMemorySubmissionBackend(),
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
