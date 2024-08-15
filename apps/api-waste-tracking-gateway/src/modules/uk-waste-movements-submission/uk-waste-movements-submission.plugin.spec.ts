import { jest } from '@jest/globals';
import {
  CreateDraftRef,
  CreateSicCodeRef,
  SetWasteSourceRef,
  SubmissionRef,
  UkWasteMovementsSubmissionBackend,
  UkwmDraftRef,
} from './uk-waste-movements-submission.backend';
import { server } from '@hapi/hapi';
import winston from 'winston';
import ukWasteMovementsBulkSubmissionPlugin from './uk-waste-movements-submission.plugin';
import {
  UkwmCreateDraftResponse,
  UkwmDraftContact,
  UkwmGetDraftsRequest,
  UkwmGetDraftsResult,
  UkwmSubmission,
  UkwmDraftAddress,
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
  createDraft:
    jest.fn<(request: CreateDraftRef) => Promise<UkwmCreateDraftResponse>>(),
  setDraftProducerAddressDetails:
    jest.fn<
      (
        ref: SubmissionRef,
        value: UkwmDraftAddress,
        saveAsDraft?: boolean,
      ) => Promise<void>
    >(),
  getDraftProducerAddressDetails:
    jest.fn<({ id }: SubmissionRef) => Promise<void>>(),
  setDraftProducerContactDetail:
    jest.fn<
      (
        ref: UkwmDraftRef,
        value: UkwmDraftContact,
        saveAsDraft?: boolean,
      ) => Promise<void>
    >(),
  getDraftProducerContactDetail:
    jest.fn<({ id }: SubmissionRef) => Promise<void>>(),
  setDraftWasteSource:
    jest.fn<
      ({ id, accountId, wasteSource }: SetWasteSourceRef) => Promise<void>
    >(),
  getDraftWasteSource:
    jest.fn<({ id, accountId }: SubmissionRef) => Promise<void>>(),
  setDraftWasteCollectionAddressDetails:
    jest.fn<
      (
        ref: SubmissionRef,
        value: UkwmDraftAddress,
        saveAsDraft?: boolean,
      ) => Promise<void>
    >(),
  getDraftWasteCollectionAddressDetails:
    jest.fn<({ id }: SubmissionRef) => Promise<void>>(),
  createDraftSicCode:
    jest.fn<
      ({ id, accountId, sicCode }: CreateSicCodeRef) => Promise<string>
    >(),
  setDraftCarrierAddressDetails:
    jest.fn<
      (
        ref: SubmissionRef,
        value: UkwmDraftAddress,
        saveAsDraft?: boolean,
      ) => Promise<void>
    >(),
  getDraftCarrierAddressDetails:
    jest.fn<({ id }: SubmissionRef) => Promise<void>>(),
};

const app = server({
  host: 'localhost',
  port: 3008,
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
        url: `/ukwm/${faker.string.uuid()}`,
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

  describe('POST /drafts', () => {
    it('Responds with 400 if invalid request is received in the payload', async () => {
      const options = {
        method: 'POST',
        url: `/ukwm/drafts`,
      };

      mockBackend.createDraft.mockRejectedValue(Boom.badRequest());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /drafts/{id}/producer-address', () => {
    it('Responds with 400 if invalid request is received in the payload', async () => {
      const options = {
        method: 'GET',
        url: `/ukwm/drafts/{id}/producer-address`,
      };

      mockBackend.getDraftProducerAddressDetails.mockRejectedValue(
        Boom.badRequest(),
      );
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('PUT /drafts/{id}/producer-address', () => {
    it('Responds with 400 if invalid request is received in the payload', async () => {
      const options = {
        method: 'PUT',
        url: `/ukwm/drafts/{id}/producer-address`,
      };

      mockBackend.setDraftProducerAddressDetails.mockRejectedValue(
        Boom.badRequest(),
      );
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /drafts/{id}/producer-contact', () => {
    it('Responds with 400 if invalid request is received in the payload', async () => {
      const options = {
        method: 'GET',
        url: `/ukwm/drafts/{id}/producer-contact`,
      };

      mockBackend.getDraftProducerContactDetail.mockRejectedValue(
        Boom.badRequest(),
      );
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('PUT /drafts/{id}/producer-contact', () => {
    it('Responds with 400 if invalid request is received in the payload', async () => {
      const options = {
        method: 'PUT',
        url: `/ukwm/drafts/{id}/producer-contact`,
      };

      mockBackend.setDraftProducerContactDetail.mockRejectedValue(
        Boom.badRequest(),
      );
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /drafts/{id}/waste-source', () => {
    it('Responds with 400 if invalid request is received in the payload', async () => {
      const options = {
        method: 'GET',
        url: `/ukwm/drafts/{id}/waste-source`,
      };

      mockBackend.getDraftWasteSource.mockRejectedValue(Boom.badRequest());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('PUT /drafts/{id}/waste-source', () => {
    it('Responds with 400 if invalid request is received in the payload', async () => {
      const options = {
        method: 'PUT',
        url: `/ukwm/drafts/{id}/waste-source`,
      };

      mockBackend.setDraftWasteSource.mockRejectedValue(Boom.badRequest());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /drafts/{id}/waste-collection-address', () => {
    it('Responds with 400 if invalid request is received in the payload', async () => {
      const options = {
        method: 'GET',
        url: `/ukwm/drafts/{id}/waste-collection-address`,
      };

      mockBackend.getDraftWasteCollectionAddressDetails.mockRejectedValue(
        Boom.badRequest(),
      );
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('PUT /drafts/{id}/waste-collection-address', () => {
    it('Responds with 400 if invalid request is received in the payload', async () => {
      const options = {
        method: 'PUT',
        url: `/ukwm/drafts/{id}/waste-collection-address`,
      };

      mockBackend.setDraftWasteCollectionAddressDetails.mockRejectedValue(
        Boom.badRequest(),
      );
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /drafts/{id}/sic-code', () => {
    it('Responds with 400 if invalid request is received in the payload', async () => {
      const options = {
        method: 'POST',
        url: `/ukwm/drafts/{id}/sic-code`,
      };

      mockBackend.createDraftSicCode.mockRejectedValue(Boom.badRequest());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /drafts/{id}/carrier-address', () => {
    it('Responds with 400 if invalid request is received in the payload', async () => {
      const options = {
        method: 'GET',
        url: `/ukwm/drafts/{id}/carrier-address`,
      };

      mockBackend.getDraftCarrierAddressDetails.mockRejectedValue(
        Boom.badRequest(),
      );
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('PUT /drafts/{id}/carrier-address', () => {
    it('Responds with 400 if invalid request is received in the payload', async () => {
      const options = {
        method: 'PUT',
        url: `/ukwm/drafts/{id}/carrier-address`,
      };

      mockBackend.setDraftCarrierAddressDetails.mockRejectedValue(
        Boom.badRequest(),
      );
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });
});
