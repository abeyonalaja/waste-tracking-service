import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { server } from '@hapi/hapi';
import { jest } from '@jest/globals';
import winston from 'winston';
import submissionPlugin from './submission.plugin';
import {
  OrderRef,
  SubmissionBackend,
  SubmissionRef,
} from './submission.backend';
import {
  CancellationType,
  Carriers,
  CollectionDate,
  CollectionDetail,
  CustomerReference,
  ExitLocation,
  ExporterDetail,
  ImporterDetail,
  NumberOfSubmissions,
  RecoveryFacilityDetail,
  Submission,
  SubmissionConfirmation,
  SubmissionDeclaration,
  SubmissionSummaryPage,
  TransitCountries,
  WasteDescription,
  WasteQuantity,
} from '@wts/api/waste-tracking-gateway';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const accountId = '964cc80b-da90-4675-ac05-d4d1d79ac888';

const mockBackend = {
  createSubmission:
    jest.fn<
      (accountId: string, reference: CustomerReference) => Promise<Submission>
    >(),
  getSubmission: jest.fn<(ref: SubmissionRef) => Promise<Submission>>(),
  deleteSubmission: jest.fn<(ref: SubmissionRef) => Promise<void>>(),
  cancelSubmission:
    jest.fn<
      (ref: SubmissionRef, cancellationType: CancellationType) => Promise<void>
    >(),
  getSubmissions:
    jest.fn<
      (
        accountId: string,
        order: OrderRef,
        pageNumber: number,
        pageLimit?: number,
        state?: Submission['submissionState']['status'][],
        token?: string
      ) => Promise<SubmissionSummaryPage>
    >(),
  getCustomerReference:
    jest.fn<(ref: SubmissionRef) => Promise<CustomerReference>>(),
  setCustomerReference:
    jest.fn<
      (ref: SubmissionRef, reference: CustomerReference) => Promise<void>
    >(),
  getWasteDescription:
    jest.fn<(ref: SubmissionRef) => Promise<WasteDescription>>(),
  setWasteDescription:
    jest.fn<
      (ref: SubmissionRef, wasteDescription: WasteDescription) => Promise<void>
    >(),
  getWasteQuantity: jest.fn<(ref: SubmissionRef) => Promise<WasteQuantity>>(),
  setWasteQuantity:
    jest.fn<
      (ref: SubmissionRef, wasteDescription: WasteQuantity) => Promise<void>
    >(),
  getExporterDetail: jest.fn<(ref: SubmissionRef) => Promise<ExporterDetail>>(),
  setExporterDetail:
    jest.fn<(ref: SubmissionRef, value: ExporterDetail) => Promise<void>>(),
  getImporterDetail: jest.fn<(ref: SubmissionRef) => Promise<ImporterDetail>>(),
  setImporterDetail:
    jest.fn<(ref: SubmissionRef, value: ImporterDetail) => Promise<void>>(),
  getCollectionDate: jest.fn<(ref: SubmissionRef) => Promise<CollectionDate>>(),
  setCollectionDate:
    jest.fn<(ref: SubmissionRef, value: CollectionDate) => Promise<void>>(),
  listCarriers: jest.fn<(ref: SubmissionRef) => Promise<Carriers>>(),
  createCarriers:
    jest.fn<
      (ref: SubmissionRef, value: Omit<Carriers, 'values'>) => Promise<Carriers>
    >(),
  getCarriers:
    jest.fn<(ref: SubmissionRef, carrierId: string) => Promise<Carriers>>(),
  setCarriers:
    jest.fn<
      (ref: SubmissionRef, carrerId: string, value: Carriers) => Promise<void>
    >(),
  deleteCarriers:
    jest.fn<(ref: SubmissionRef, carrierId: string) => Promise<void>>(),
  getCollectionDetail:
    jest.fn<(ref: SubmissionRef) => Promise<CollectionDetail>>(),
  setCollectionDetail:
    jest.fn<(ref: SubmissionRef, value: CollectionDetail) => Promise<void>>(),
  getExitLocation: jest.fn<(ref: SubmissionRef) => Promise<ExitLocation>>(),
  setExitLocation:
    jest.fn<(ref: SubmissionRef, value: ExitLocation) => Promise<void>>(),
  getTransitCountries:
    jest.fn<(ref: SubmissionRef) => Promise<TransitCountries>>(),
  setTransitCountries:
    jest.fn<(ref: SubmissionRef, value: TransitCountries) => Promise<void>>(),
  listRecoveryFacilityDetail:
    jest.fn<(ref: SubmissionRef) => Promise<RecoveryFacilityDetail>>(),
  createRecoveryFacilityDetail:
    jest.fn<
      (
        ref: SubmissionRef,
        value: Omit<RecoveryFacilityDetail, 'values'>
      ) => Promise<RecoveryFacilityDetail>
    >(),
  getRecoveryFacilityDetail:
    jest.fn<
      (ref: SubmissionRef, rfdId: string) => Promise<RecoveryFacilityDetail>
    >(),
  setRecoveryFacilityDetail:
    jest.fn<
      (
        ref: SubmissionRef,
        rfdId: string,
        value: RecoveryFacilityDetail
      ) => Promise<void>
    >(),
  deleteRecoveryFacilityDetail:
    jest.fn<(ref: SubmissionRef, rfdId: string) => Promise<void>>(),
  getSubmissionConfirmation:
    jest.fn<(ref: SubmissionRef) => Promise<SubmissionConfirmation>>(),
  setSubmissionConfirmation:
    jest.fn<
      (ref: SubmissionRef, value: SubmissionConfirmation) => Promise<void>
    >(),
  getSubmissionDeclaration:
    jest.fn<(ref: SubmissionRef) => Promise<SubmissionDeclaration>>(),
  setSubmissionDeclaration:
    jest.fn<
      (ref: SubmissionRef, value: SubmissionDeclaration) => Promise<void>
    >(),
  getNumberOfSubmissions:
    jest.fn<(accountId: string) => Promise<NumberOfSubmissions>>(),
};

const app = server({
  host: 'localhost',
  port: 3000,
});

beforeAll(async () => {
  await app.register({
    plugin: submissionPlugin,
    options: {
      backend: mockBackend as unknown as SubmissionBackend,
      logger: new winston.Logger(),
    },
    routes: {
      prefix: '/submissions',
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

describe('SubmissionPlugin', () => {
  beforeEach(() => {
    mockBackend.createSubmission.mockClear();
    mockBackend.getSubmission.mockClear();
    mockBackend.deleteSubmission.mockClear();
    mockBackend.cancelSubmission.mockClear();
    mockBackend.getSubmissions.mockClear();
    mockBackend.getWasteDescription.mockClear();
    mockBackend.setWasteDescription.mockClear();
    mockBackend.getWasteQuantity.mockClear();
    mockBackend.setWasteQuantity.mockClear();
    mockBackend.getCustomerReference.mockClear();
    mockBackend.setCustomerReference.mockClear();
    mockBackend.getExporterDetail.mockClear();
    mockBackend.setExporterDetail.mockClear();
    mockBackend.getImporterDetail.mockClear();
    mockBackend.setImporterDetail.mockClear();
    mockBackend.getCollectionDate.mockClear();
    mockBackend.setCollectionDate.mockClear();
    mockBackend.listCarriers.mockClear();
    mockBackend.createCarriers.mockClear();
    mockBackend.getCarriers.mockClear();
    mockBackend.setCarriers.mockClear();
    mockBackend.deleteCarriers.mockClear();
    mockBackend.getCollectionDetail.mockClear();
    mockBackend.setCollectionDetail.mockClear();
    mockBackend.listRecoveryFacilityDetail.mockClear();
    mockBackend.createRecoveryFacilityDetail.mockClear();
    mockBackend.getRecoveryFacilityDetail.mockClear();
    mockBackend.setRecoveryFacilityDetail.mockClear();
    mockBackend.deleteRecoveryFacilityDetail.mockClear();
    mockBackend.getNumberOfSubmissions.mockClear();
  });

  describe('POST /submissions', () => {
    it('Responds 400 with no request payload', async () => {
      const options = {
        method: 'POST',
        url: '/submissions',
      };

      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /submissions', () => {
    it('Responds 401 if no auth is provided', async () => {
      const options = {
        method: 'GET',
        url: '/submissions',
      };

      mockBackend.getSubmissions.mockRejectedValue(Boom.unauthorized());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(401);
    });

    it('Responds 404 if no submissions exist', async () => {
      const options = {
        method: 'GET',
        url: '/submissions',
      };

      mockBackend.getSubmissions.mockRejectedValue(Boom.notFound());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('GET /submissions/{id}', () => {
    it("Responds 404 if submission doesn't exist", async () => {
      const options = {
        method: 'GET',
        url: `/submissions/${faker.datatype.uuid()}`,
      };

      mockBackend.getSubmission.mockRejectedValue(Boom.notFound());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('Cancel /submissions/{id}/cancel', () => {
    it('Responds 400 if action is not supported', async () => {
      const options = {
        method: 'PUT',
        url: `/submissions/${faker.datatype.uuid()}/cancel`,
      };

      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /submissions/{id}/reference', () => {
    it("Responds 404 if submission doesn't exist", async () => {
      const options = {
        method: 'GET',
        url: `/submissions/${faker.datatype.uuid()}/reference`,
      };

      mockBackend.getCustomerReference.mockRejectedValue(Boom.notFound());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /submissions/{id}/reference', () => {
    it('Does NOT support null values', async () => {
      const id = faker.datatype.uuid();
      mockBackend.setCustomerReference.mockResolvedValue();
      const response = await app.inject({
        method: 'PUT',
        url: `/submissions/${id}/reference`,
        payload: JSON.stringify(null),
      });

      expect(response.statusCode).toBe(400);
    });

    it('Supports string values', async () => {
      const id = faker.datatype.uuid();
      const reference = faker.datatype.string(10);
      mockBackend.setCustomerReference.mockResolvedValue();
      const response = await app.inject({
        method: 'PUT',
        url: `/submissions/${id}/reference`,
        payload: JSON.stringify(reference),
      });

      expect(response.result).toEqual(reference);
      expect(response.statusCode).toBe(200);
      expect(mockBackend.setCustomerReference).toBeCalledTimes(1);
      expect(mockBackend.setCustomerReference).toBeCalledWith(
        { id, accountId },
        reference
      );
    });
  });

  describe('GET /submissions/{id}/carriers/{carrierId}', () => {
    it("Responds 404 if carrier doesn't exist", async () => {
      const options = {
        method: 'GET',
        url: `/submissions/${faker.datatype.uuid()}/carriers/${faker.datatype.uuid()}`,
      };

      mockBackend.getCarriers.mockRejectedValue(Boom.notFound());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /submissions/{id}/carriers/{carrierId}', () => {
    it("Responds 400 if carrier id doesn't match with id from payload", async () => {
      const id = faker.datatype.uuid();
      const carrierId = faker.datatype.uuid();
      mockBackend.setCarriers.mockResolvedValue();
      const options = {
        method: 'PUT',
        url: `/submissions/${id}/carriers/${carrierId}`,
        payload: JSON.stringify({
          status: 'Started',
          values: [
            {
              id: faker.datatype.uuid(),
            },
          ],
        }),
      };

      mockBackend.getCarriers.mockRejectedValue(Boom.badRequest());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /submissions/{id}/recovery-facility/{rfdId}', () => {
    it("Responds 404 if recovery facility doesn't exist", async () => {
      const options = {
        method: 'GET',
        url: `/submissions/${faker.datatype.uuid()}/recovery-facility/${faker.datatype.uuid()}`,
      };

      mockBackend.getRecoveryFacilityDetail.mockRejectedValue(Boom.notFound());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /submissions/{id}/recovery-facility/{rfdId}', () => {
    it("Responds 400 if recovery facility id doesn't match with id from payload", async () => {
      const id = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      mockBackend.setRecoveryFacilityDetail.mockResolvedValue();
      const options = {
        method: 'PUT',
        url: `/submissions/${id}/recovery-facility/${rfdId}`,
        payload: JSON.stringify({
          status: 'Started',
          values: [
            {
              id: faker.datatype.uuid(),
            },
          ],
        }),
      };

      mockBackend.getRecoveryFacilityDetail.mockRejectedValue(
        Boom.badRequest()
      );
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('PUT /submissions/{id}/submission-confirmation', () => {
    it('Responds 400 if invalid request is received from payload', async () => {
      const id = faker.datatype.uuid();
      mockBackend.setSubmissionConfirmation.mockResolvedValue();
      const options = {
        method: 'PUT',
        url: `/submissions/${id}/submission-confirmation`,
        payload: JSON.stringify({
          status: 'NotStarted',
          confirmation: true,
        }),
      };

      mockBackend.getSubmissionConfirmation.mockRejectedValue(
        Boom.badRequest()
      );
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('PUT /submissions/{id}/submission-declaration', () => {
    it('Responds 400 if invalid request is received from payload', async () => {
      const id = faker.datatype.uuid();
      mockBackend.setSubmissionDeclaration.mockResolvedValue();
      const options = {
        method: 'PUT',
        url: `/submissions/${id}/submission-declaration`,
        payload: JSON.stringify({
          status: 'NotStarted',
          declaration: true,
        }),
      };

      mockBackend.getSubmissionDeclaration.mockRejectedValue(Boom.badRequest());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /submissions/numberOfSubmissions', () => {
    it('Responds 400 if invalid request is received from payload', async () => {
      mockBackend.getNumberOfSubmissions.mockResolvedValue({
        completedWithActuals: 0,
        incomplete: 1,
        completedWithEstimates: 2,
      });

      const options = {
        method: 'GET',
        url: `/submissions/numberOfSubmissions`,
      };

      mockBackend.getNumberOfSubmissions.mockRejectedValue(Boom.badRequest());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });
});
