import { DaprClient } from '@dapr/dapr';
import { server } from '@hapi/hapi';
import { DaprAddressClient } from '@wts/client/address';
import { DaprAnnexViiClient } from '@wts/client/green-list-waste-export';
import { DaprAnnexViiBulkClient } from '@wts/client/green-list-waste-export-bulk';
import { DaprFeedbackClient } from '@wts/client/feedback';
import { DaprLimitedAudienceClient } from '@wts/client/limited-audience';
import { DaprReferenceDataClient } from '@wts/client/reference-data';
import jwt from 'hapi-auth-jwt2';
import { LRUCache } from 'lru-cache';
import * as winston from 'winston';
import { configureStrategy, getWellKnownParams, userFilter } from './lib/auth';
import {
  AddressBackend,
  AddressServiceBackend,
  addressPlugin,
} from './modules/address';
import {
  AnnexViiBulkServiceBackend,
  BulkSubmissionBackend,
  bulkSubmissionPlugin,
} from './modules/bulk-submission';
import { feedbackPlugin } from './modules/feedback';
import {
  FeedbackBackend,
  FeedbackServiceBackend,
} from './modules/feedback/feedback.backend';
import {
  PrivateAudienceServiceBackend,
  Backend as PrivateBetaBackend,
  privateBetaPlugin,
} from './modules/private-beta';
import {
  ReferenceDataBackend,
  ReferenceDataServiceBackend,
  referenceDataPlugin,
} from './modules/reference-data';
import {
  AnnexViiServiceSubmissionBackend,
  SubmissionBackend,
  submissionPlugin,
} from './modules/submission';
import {
  AnnexViiServiceTemplateBackend,
  TemplateBackend,
  templatePlugin,
} from './modules/template';
import {
  ServiceUkWasteMovementsBulkSubmissionBackend,
  UkWasteMovementsBulkSubmissionBackend,
  ukWasteMovementsBulkSubmissionPlugin,
} from './modules/uk-waste-movements-bulk-submission';
import { DaprUkWasteMovementsBulkClient } from '@wts/client/uk-waste-movements-bulk';
import { DaprUkWasteMovementsClient } from '@wts/client/uk-waste-movements';
import {
  ServiceUkWasteMovementsSubmissionBackend,
  UkWasteMovementsSubmissionBackend,
  ukWasteMovementsSubmissionPlugin,
} from './modules/uk-waste-movements-submission';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: { appId: process.env['APP_ID'] || 'api-waste-tracking-gateway' },
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
  ukWasteMovementsBulkSubmission: UkWasteMovementsBulkSubmissionBackend;
  ukWasteMovements: UkWasteMovementsSubmissionBackend;
};

if (process.env['NODE_ENV'] === 'development') {
  throw new Error(
    'Use "nx serve api-mock-gateway" to start the development server instead'
  );
} else {
  const client = new DaprClient();
  backend = {
    address: new AddressServiceBackend(
      new DaprAddressClient(
        client,
        process.env['ADDRESS_APP_ID'] || 'service-address'
      ),
      logger
    ),
    feedback: new FeedbackServiceBackend(
      new DaprFeedbackClient(
        client,
        process.env['FEEDBACK_APP_ID'] || 'service-feedback'
      ),
      logger
    ),
    submission: new AnnexViiServiceSubmissionBackend(
      new DaprAnnexViiClient(
        client,
        process.env['GLW_EXPORT_APP_ID'] || 'service-green-list-waste-export'
      ),
      logger
    ),
    template: new AnnexViiServiceTemplateBackend(
      new DaprAnnexViiClient(
        client,
        process.env['GLW_EXPORT_APP_ID'] || 'service-green-list-waste-export'
      ),
      logger
    ),
    referenceData: new ReferenceDataServiceBackend(
      new DaprReferenceDataClient(
        client,
        process.env['REFERENCE_DATA_APP_ID'] || 'service-reference-data'
      ),
      logger
    ),
    bulkSubmission: new AnnexViiBulkServiceBackend(
      new DaprAnnexViiBulkClient(
        client,
        process.env['GLW_EXPORT_BULK_APP_ID'] ||
          'service-green-list-waste-export-bulk'
      ),
      logger
    ),
    privateBeta: new PrivateAudienceServiceBackend(
      new DaprLimitedAudienceClient(
        client,
        process.env['LIMITED_AUDIENCE_APP_ID'] || 'service-limited-audience'
      ),
      new LRUCache({
        ttl: 60 * 1000,
        ttlAutopurge: false,
        maxSize: 1000,
        sizeCalculation: (): number => 1,
      }),
      logger
    ),
    ukWasteMovementsBulkSubmission:
      new ServiceUkWasteMovementsBulkSubmissionBackend(
        new DaprUkWasteMovementsBulkClient(
          client,
          process.env['UKWM_BULK_APP_ID'] || 'service-uk-waste-movements-bulk'
        ),
        logger
      ),
    ukWasteMovements: new ServiceUkWasteMovementsSubmissionBackend(
      new DaprUkWasteMovementsClient(
        client,
        process.env['UKWM_APP_ID'] || 'service-uk-waste-movements'
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

const users = process.env['ALLOWED_USERS'] || '*';
let filter =
  users === '*'
    ? userFilter.any
    : users === 'none'
    ? userFilter.none
    : userFilter.uniqueReferenceString(users);

if (
  process.env['FEATURE_PRIVATE_AUDIENCE_CHECKS'] &&
  process.env['FEATURE_PRIVATE_AUDIENCE_CHECKS'] === 'true'
) {
  filter = userFilter.or(filter, backend.privateBeta.userFilter);
}

const { issuer, jwksUri } = await getWellKnownParams(wellKnownUri);

app.auth.strategy(
  'private-beta',
  'jwt',
  configureStrategy(filter, { audience, issuer, jwksUri })
);

app.auth.strategy(
  'authenticated',
  'jwt',
  configureStrategy(userFilter.any, { audience, issuer, jwksUri })
);

app.auth.default('private-beta');

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

if (process.env['IS_MULTIPLE_UPLOAD_ENABLED'] === 'true') {
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
}

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

if (process.env['IS_UKWM_BATCHES_ENABLED'] === 'true') {
  await app.register({
    plugin: ukWasteMovementsBulkSubmissionPlugin,
    options: {
      backend: backend.ukWasteMovementsBulkSubmission,
      logger,
    },
    routes: {
      prefix: '/api/ukwm-batches',
    },
  });

  await app.register({
    plugin: ukWasteMovementsSubmissionPlugin,
    options: {
      backend: backend.ukWasteMovements,
      logger,
    },
    routes: {
      prefix: '/api/ukwm',
    },
  });
}

process.on('unhandledRejection', (err) => {
  logger.error(err);
  process.exit(1);
});

await app.start();
logger.info('server running', { uri: app.info.uri });
