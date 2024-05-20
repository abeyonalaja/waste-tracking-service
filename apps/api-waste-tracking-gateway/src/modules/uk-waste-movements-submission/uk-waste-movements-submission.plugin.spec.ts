import { jest } from '@jest/globals';
import {
  SubmissionRef,
  UkWasteMovementsSubmissionBackend,
} from './uk-waste-movements-submission.backend';
import { server } from '@hapi/hapi';
import winston from 'winston';
import ukWasteMovementsBulkSubmissionPlugin from './uk-waste-movements-submission.plugin';
import {
  UkwmGetDraftsRequest,
  UkwmGetDraftsResult,
  UkwmSubmission,
} from '@wts/api/waste-tracking-gateway';
import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const accountId = '964cc80b-da90-4675-ac05-d4d1d79ac888';

const mockBackend = {
  getUkwmSubmission: jest.fn<(ref: SubmissionRef) => Promise<UkwmSubmission>>(),
  getDrafts:
    jest.fn<(request: UkwmGetDraftsRequest) => Promise<UkwmGetDraftsResult>>(),
};

const app = server({
  host: 'localhost',
  port: 3005,
});

beforeAll(async () => {
  await app.register({
    plugin: ukWasteMovementsBulkSubmissionPlugin,
    options: {
      backend: mockBackend as unknown as UkWasteMovementsSubmissionBackend,
      logger: new winston.Logger(),
    },
    routes: {
      prefix: '/ukwm',
    },
  });

  app.auth.scheme('mock', function () {
    return {
      authenticate: async function (_, h) {
        return h.authenticated({ credentials: { accountId } });
      },
    };
  });
  app.auth.strategy('mock', 'mock');
  app.auth.default('mock');

  await app.start();
});

afterAll(async () => {
  await app.stop();
});

describe('UkWasteMovementsSubmissionPlugin', () => {
  beforeEach(() => {
    mockBackend.getUkwmSubmission.mockClear();
  });

  describe('GET /drafts/{id}', () => {
    it("Responds 404 if Ukwmsubmission doesn't exist", async () => {
      const options = {
        method: 'GET',
        url: `/ukwm/${faker.datatype.uuid()}`,
      };

      mockBackend.getUkwmSubmission.mockRejectedValue(Boom.notFound());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('GET /drafts', () => {
    it('Responds with 400 if invalid request is received in the payload', async () => {
      const options = {
        method: 'GET',
        url: `/ukwm/drafts`,
      };

      mockBackend.getDrafts.mockRejectedValue(Boom.badRequest());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });
});
