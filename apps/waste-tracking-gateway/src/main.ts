import { DaprClient } from '@dapr/dapr';
import { server } from '@hapi/hapi';
import AuthBearer from 'hapi-auth-bearer-token';
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
  AnnexViiServiceSubmissionBackend,
  InMemorySubmissionBackend,
  Submission,
  SubmissionBackend,
  submissionPlugin,
} from './modules/submission';
import { validateToken } from './lib/auth';
import {
  AnnexViiServiceTemplateBackend,
  InMemoryTemplateBackend,
  TemplateBackend,
  templatePlugin,
} from './modules/template';
import { Template } from '@wts/api/annex-vii';
import Boom from '@hapi/boom';
import {
  WTSInfoBackend,
  WTSInfoServiceBackend,
  WTSInfoStub,
} from './modules/wts-info/wts-info.backend';
import { wtsInfoPlugin } from './modules/wts-info';

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

let backend: {
  submission: SubmissionBackend;
  address: AddressBackend;
  template: TemplateBackend;
  wtsInfo: WTSInfoBackend;
};
if (process.env['NODE_ENV'] === 'development') {
  logger.warn('service is using mock-backends; NOT for production use');
  const submissions = new Map<string, Submission>();
  const templates = new Map<string, Template>();
  const submissionBackend = new InMemorySubmissionBackend(
    submissions,
    templates
  );
  const templateBackend = new InMemoryTemplateBackend(submissions, templates);
  const wtsInfoBackend = new WTSInfoStub();
  backend = {
    address: new AddressStub(),
    submission: submissionBackend,
    template: templateBackend,
    wtsInfo: wtsInfoBackend,
  };
} else {
  const client = new DaprClient();
  const submissionBackend = new AnnexViiServiceSubmissionBackend(
    new DaprAnnexViiClient(
      client,
      process.env['ANNEX_VII_APP_ID'] || 'annex-vii'
    ),
    logger
  );
  const templateBackend = new AnnexViiServiceTemplateBackend(
    new DaprAnnexViiClient(
      client,
      process.env['ANNEX_VII_APP_ID'] || 'annex-vii'
    ),
    logger
  );
  const wtsInfoBackend = new WTSInfoServiceBackend(
    new DaprAnnexViiClient(
      client,
      process.env['ANNEX_VII_APP_ID'] || 'annex-vii'
    ),
    logger
  );
  backend = {
    address: new AddressServiceBackend(
      new DaprAddressClient(client, process.env['ADDRESS_APP_ID'] || 'address'),
      logger
    ),
    submission: submissionBackend,
    template: templateBackend,
    wtsInfo: wtsInfoBackend,
  };
}

await app.register(Object.create(AuthBearer));

app.auth.strategy('dcid-auth', 'bearer-access-token', {
  allowQueryToken: true,
  validate: async (request: any, token: string, h: any) => {
    try {
      return validateToken(token);
    } catch (err) {
      return Boom.unauthorized();
    }
  },
});

app.auth.default('dcid-auth');

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

await app.register({
  plugin: wtsInfoPlugin,
  options: {
    backend: backend.wtsInfo,
    logger,
  },
  routes: {
    prefix: '/api/wts-info',
  },
});

await app.register({
  plugin: templatePlugin,
  options: {
    backend: backend.template,
    logger,
  },
  routes: {
    prefix: '/api/templates',
  },
});

process.on('unhandledRejection', (err) => {
  logger.error(err);
  process.exit(1);
});

await app.start();
logger.info('server running', { uri: app.info.uri });
