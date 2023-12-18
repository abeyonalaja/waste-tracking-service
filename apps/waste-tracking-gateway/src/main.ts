import { DaprClient } from '@dapr/dapr';
import { server } from '@hapi/hapi';
import { Template } from '@wts/api/annex-vii';
import { DaprAddressClient } from '@wts/client/address';
import { DaprAnnexViiClient } from '@wts/client/annex-vii';
import jwt from 'hapi-auth-jwt2';
import jwksRsa from 'jwks-rsa';
import * as winston from 'winston';
import { getWellKnownParams, userFilter, validateToken } from './lib/auth';
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
import {
  AnnexViiServiceTemplateBackend,
  InMemoryTemplateBackend,
  TemplateBackend,
  templatePlugin,
} from './modules/template';
import { wtsInfoPlugin } from './modules/wts-info';
import {
  WTSInfoBackend,
  WTSInfoServiceBackend,
  WTSInfoStub,
} from './modules/wts-info/wts-info.backend';

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

await app.register(jwt);

const wellKnownUri = process.env['DCID_WELLKNOWN'];
if (wellKnownUri === undefined) {
  logger.error('DCID_WELLKNOWN variable unset');
  process.exit(1);
}

const audience = process.env['DCID_CLIENT_ID'];
if (audience === undefined) {
  logger.error('DCID_CLIENT_ID variable unset');
  process.exit(1);
}

const users = process.env['ALLOWED_USERS'];

const { issuer, jwksUri } = await getWellKnownParams(wellKnownUri);

app.auth.strategy('jwt', 'jwt', {
  complete: true,
  headerKey: 'authorization',
  tokenType: 'Bearer',

  key: jwksRsa.hapiJwt2KeyAsync({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 2,
    jwksUri,
  }),

  validate: validateToken(
    users === undefined || users === '*'
      ? userFilter.any
      : userFilter.uniqueReferenceString(users)
  ),

  verifyOptions: {
    audience,
    issuer,
    algorithms: ['RS256'],
  },
});

app.auth.default('jwt');

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
