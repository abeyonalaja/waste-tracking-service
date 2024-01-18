import { DaprClient } from '@dapr/dapr';
import { server } from '@hapi/hapi';
import { Template } from '@wts/api/annex-vii';
import { DaprAddressClient } from '@wts/client/address';
import { DaprAnnexViiClient } from '@wts/client/annex-vii';
import { DaprAnnexViiBulkClient } from '@wts/client/annex-vii-bulk';
import jwt from 'hapi-auth-jwt2';
import jwksRsa from 'jwks-rsa';
import { getWellKnownParams, userFilter, validateToken } from './lib/auth';
import * as winston from 'winston';
import {
  AddressBackend,
  AddressServiceBackend,
  AddressStub,
  addressPlugin,
} from './modules/address';
import {
  AnnexViiBulkServiceBackend,
  BulkSubmissionBackend,
  BulkSubmissionStub,
  bulkSubmissionPlugin,
} from './modules/bulk-submission';
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
import {
  ReferenceDataBackend,
  ReferenceDataServiceBackend,
  ReferenceDataStub,
  referenceDataPlugin,
} from './modules/reference-data';
import { DaprReferenceDataClient } from '@wts/client/reference-data';

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
  referenceData: ReferenceDataBackend;
  bulkSubmission: BulkSubmissionBackend;
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
  const referenceDataBackend = new ReferenceDataStub();
  const bulkSubmissionBackend = new BulkSubmissionStub();
  backend = {
    address: new AddressStub(),
    submission: submissionBackend,
    template: templateBackend,
    referenceData: referenceDataBackend,
    bulkSubmission: bulkSubmissionBackend,
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
  const referenceDataBackend = new ReferenceDataServiceBackend(
    new DaprReferenceDataClient(
      client,
      process.env['REFERENCE_DATA_APP_ID'] || 'reference-data'
    ),
    logger
  );
  const bulkSubmissionBackend = new AnnexViiBulkServiceBackend(
    new DaprAnnexViiBulkClient(
      client,
      process.env['ANNEX_VII_BULK_APP_ID'] || 'annex-vii-bulk'
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
    referenceData: referenceDataBackend,
    bulkSubmission: bulkSubmissionBackend,
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
  plugin: referenceDataPlugin,
  options: {
    backend: backend.referenceData,
    logger,
  },
  routes: {
    prefix: '/api/reference-data',
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

await app.register({
  plugin: bulkSubmissionPlugin,
  options: {
    backend: backend.bulkSubmission,
    logger,
  },
  routes: {
    prefix: '/api/batches',
  },
});

process.on('unhandledRejection', (err) => {
  logger.error(err);
  process.exit(1);
});

await app.start();
logger.info('server running', { uri: app.info.uri });
