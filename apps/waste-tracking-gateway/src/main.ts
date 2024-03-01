import { DaprClient } from '@dapr/dapr';
import { server } from '@hapi/hapi';
import { Template } from '@wts/api/annex-vii';
import { DaprAddressClient } from '@wts/client/address';
import { DaprAnnexViiClient } from '@wts/client/annex-vii';
import { DaprAnnexViiBulkClient } from '@wts/client/annex-vii-bulk';
import { DaprFeedbackClient } from '@wts/client/feedback';
import { DaprLimitedAudienceClient } from '@wts/client/limited-audience';
import { DaprReferenceDataClient } from '@wts/client/reference-data';
import jwt from 'hapi-auth-jwt2';
import jwksRsa from 'jwks-rsa';
import { LRUCache } from 'lru-cache';
import * as winston from 'winston';
import { getWellKnownParams, userFilter, validateToken } from './lib/auth';
import {
  AddressBackend,
  AddressServiceBackend,
  AddressStub,
  addressPlugin,
} from './modules/address';
import {
  AnnexViiBulkServiceBackend,
  BulkSubmissionBackend,
  InMemoryBulkSubmissionBackend,
  bulkSubmissionPlugin,
} from './modules/bulk-submission';
import { feedbackPlugin } from './modules/feedback';
import {
  FeedbackBackend,
  FeedbackServiceBackend,
  FeedbackStub,
} from './modules/feedback/feedback.backend';
import {
  PrivateAudienceServiceBackend,
  Backend as PrivateBetaBackend,
  PrivateBetaStub,
  privateBetaPlugin,
} from './modules/private-beta';
import { LimitedAudienceUserFilter } from './modules/private-beta/user-filter';
import {
  ReferenceDataBackend,
  ReferenceDataServiceBackend,
  ReferenceDataStub,
  referenceDataPlugin,
} from './modules/reference-data';
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
  feedback: FeedbackBackend;
  template: TemplateBackend;
  referenceData: ReferenceDataBackend;
  bulkSubmission: BulkSubmissionBackend;
  privateBeta: PrivateBetaBackend;
};

if (process.env['NODE_ENV'] === 'development') {
  logger.warn('service is using mock-backends; NOT for production use');
  const submissions = new Map<string, Submission>();
  const templates = new Map<string, Template>();
  backend = {
    address: new AddressStub(),
    feedback: new FeedbackStub(),
    submission: new InMemorySubmissionBackend(submissions, templates),
    template: new InMemoryTemplateBackend(submissions, templates),
    referenceData: new ReferenceDataStub(),
    bulkSubmission: new InMemoryBulkSubmissionBackend(),
    privateBeta: new PrivateBetaStub(),
  };
} else {
  const client = new DaprClient();
  backend = {
    address: new AddressServiceBackend(
      new DaprAddressClient(client, process.env['ADDRESS_APP_ID'] || 'address'),
      logger
    ),
    feedback: new FeedbackServiceBackend(
      new DaprFeedbackClient(
        client,
        process.env['FEEDBACK_APP_ID'] || 'feedback'
      ),
      logger
    ),
    submission: new AnnexViiServiceSubmissionBackend(
      new DaprAnnexViiClient(
        client,
        process.env['ANNEX_VII_APP_ID'] || 'annex-vii'
      ),
      logger
    ),
    template: new AnnexViiServiceTemplateBackend(
      new DaprAnnexViiClient(
        client,
        process.env['ANNEX_VII_APP_ID'] || 'annex-vii'
      ),
      logger
    ),
    referenceData: new ReferenceDataServiceBackend(
      new DaprReferenceDataClient(
        client,
        process.env['REFERENCE_DATA_APP_ID'] || 'reference-data'
      ),
      logger
    ),
    bulkSubmission: new AnnexViiBulkServiceBackend(
      new DaprAnnexViiBulkClient(
        client,
        process.env['ANNEX_VII_BULK_APP_ID'] || 'annex-vii-bulk'
      ),
      logger
    ),
    privateBeta: new PrivateAudienceServiceBackend(
      new DaprLimitedAudienceClient(
        client,
        process.env['LIMITED_AUDIENCE_APP_ID'] || 'limited-audience'
      ),
      logger
    ),
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
let filter =
  users === undefined || users === '*'
    ? userFilter.any
    : userFilter.uniqueReferenceString(users);

if (
  process.env['FEATURE_PRIVATE_AUDIENCE_CHECKS'] &&
  process.env['FEATURE_PRIVATE_AUDIENCE_CHECKS'] === 'true'
) {
  filter = userFilter.or(
    filter,
    new LimitedAudienceUserFilter(
      new DaprLimitedAudienceClient(
        new DaprClient(),
        process.env['LIMITED_AUDIENCE_APP_ID'] || 'limited-audience'
      ),
      new LRUCache({ ttl: 60 * 1000, ttlAutopurge: false, maxSize: 1000 })
    ).filter
  );
}

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

  validate: validateToken(filter),

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
  plugin: feedbackPlugin,
  options: {
    backend: backend.feedback,
    logger,
  },
  routes: {
    prefix: '/api/feedback',
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

await app.register({
  plugin: privateBetaPlugin,
  options: {
    backend: backend.privateBeta,
    logger,
  },
  routes: {
    prefix: '/api/privatebeta',
  },
});

process.on('unhandledRejection', (err) => {
  logger.error(err);
  process.exit(1);
});

await app.start();
logger.info('server running', { uri: app.info.uri });
