import { DaprClient } from '@dapr/dapr';
import { server } from '@hapi/hapi';
import { DaprAddressClient } from '@wts/client/address';
import { DaprAnnexViiClient } from '@wts/client/annex-vii';
import * as winston from 'winston';
import { addressPlugin } from './modules/address';
import {
  AddressBackend,
  AddressServiceBackend,
  AddressStub,
} from './modules/address/address.backend';
import {
  AnnexViiServiceBackend,
  InMemorySubmissionBackend,
  SubmissionBackend,
  submissionPlugin,
} from './modules/submission';

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

let backend: { submission: SubmissionBackend; address: AddressBackend };
if (process.env['NODE_ENV'] === 'development') {
  logger.warn('service is using mock-backends; not for production use');
  backend = {
    address: new AddressStub(),
    submission: new InMemorySubmissionBackend(),
  };
} else {
  const client = new DaprClient();
  backend = {
    address: new AddressServiceBackend(
      new DaprAddressClient(client, process.env['ADDRESS_APP_ID'] || 'address'),
      logger
    ),
    submission: new AnnexViiServiceBackend(
      new DaprAnnexViiClient(
        client,
        process.env['ANNEX_VII_APP_ID'] || 'annex-vii'
      ),
      logger
    ),
  };
}

await app.register({
  plugin: submissionPlugin,
  options: {
    backend: backend.submission,
    logger,
  },
  routes: {
    prefix: '/api/submissions',
  },
});

await app.register({
  plugin: addressPlugin,
  options: {
    backend: backend.address,
    logger,
  },
  routes: {
    prefix: '/api/addresses',
  },
});

process.on('unhandledRejection', (err) => {
  logger.error(err);
  process.exit(1);
});

await app.start();
logger.info('server running', { uri: app.info.uri });
