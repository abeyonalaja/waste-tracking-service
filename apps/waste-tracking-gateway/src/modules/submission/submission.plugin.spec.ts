import { faker } from '@faker-js/faker';
import { server } from '@hapi/hapi';
import { jest } from '@jest/globals';
import {
  CustomerReference,
  Submission,
  SubmissionBackend,
  WasteDescription,
  WasteQuantity,
  ExporterDetail,
} from './submission.backend';
import submissionPlugin from './submission.plugin';

const mockBackend = {
  listSubmissions: jest.fn<() => Promise<Submission[]>>(),
  createSubmission: jest.fn<(reference?: string) => Promise<Submission>>(),
  getSubmission: jest.fn<(id: string) => Promise<Submission | undefined>>(),
  getWasteDescription:
    jest.fn<(submissionId: string) => Promise<WasteDescription | undefined>>(),
  setWasteDescription:
    jest.fn<
      (
        submissionId: string,
        wasteDescription: WasteDescription
      ) => Promise<WasteDescription | undefined>
    >(),
  getWasteQuantity:
    jest.fn<(submissionId: string) => Promise<WasteQuantity | undefined>>(),
  setWasteQuantity:
    jest.fn<
      (
        submissionId: string,
        wasteDescription: WasteQuantity
      ) => Promise<WasteQuantity | undefined>
    >(),
  getExporterDetail:
    jest.fn<(submissionId: string) => Promise<ExporterDetail | undefined>>(),
  setExporterDetail:
    jest.fn<
      (
        submissionId: string,
        exporterDetail: ExporterDetail
      ) => Promise<ExporterDetail | undefined>
    >(),
  getCustomerReference:
    jest.fn<(submissionId: string) => Promise<CustomerReference | undefined>>(),
  setCustomerReference:
    jest.fn<
      (
        submissionId: string,
        reference: CustomerReference
      ) => Promise<CustomerReference | undefined>
    >(),
};

const app = server({
  host: 'localhost',
  port: 3000,
});

beforeAll(async () => {
  await app.register({
    plugin: submissionPlugin,
    options: {
      backend: mockBackend as SubmissionBackend,
    },
    routes: {
      prefix: '/submissions',
    },
  });

  await app.start();
});

afterAll(async () => {
  await app.stop();
});

describe('SubmissionPlugin', () => {
  beforeEach(() => {
    mockBackend.listSubmissions.mockClear();
    mockBackend.createSubmission.mockClear();
    mockBackend.getSubmission.mockClear();
    mockBackend.getWasteDescription.mockClear();
    mockBackend.setWasteDescription.mockClear();
    mockBackend.getWasteQuantity.mockClear();
    mockBackend.setWasteQuantity.mockClear();
    mockBackend.getCustomerReference.mockClear();
    mockBackend.setCustomerReference.mockClear();
    mockBackend.getExporterDetail.mockClear();
    mockBackend.setExporterDetail.mockClear();
  });

  describe('GET /submissions', () => {
    const options = {
      method: 'GET',
      url: '/submissions',
    };

    it('Handles empty collection', async () => {
      mockBackend.listSubmissions.mockResolvedValue([]);
      const response = await app.inject(options);
      expect(response.statusCode).toBe(200);
      expect(response.result).toEqual([]);
    });
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

  describe('GET /submissions/{id}', () => {
    it("Responds 404 if submission doesn't exist", async () => {
      const options = {
        method: 'GET',
        url: `/submissions/${faker.datatype.uuid()}`,
      };

      mockBackend.getSubmission.mockResolvedValue(undefined);
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('GET /submissions/{id}/reference', () => {
    it("Responds 404 if submission doesn't exist", async () => {
      const options = {
        method: 'GET',
        url: `/submissions/${faker.datatype.uuid()}/reference`,
      };

      mockBackend.getCustomerReference.mockResolvedValue(undefined);
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /submissions/{id}/reference', () => {
    it('Supports null values', async () => {
      const id = faker.datatype.uuid();
      mockBackend.setCustomerReference.mockResolvedValue(null);
      const response = await app.inject({
        method: 'PUT',
        url: `/submissions/${id}/reference`,
        payload: JSON.stringify(null),
      });

      expect(response.result).toBeNull();
      expect(response.statusCode).toBe(204);
      expect(mockBackend.setCustomerReference).toBeCalledTimes(1);
      expect(mockBackend.setCustomerReference).toBeCalledWith(id, null);
    });

    it('Supports string values', async () => {
      const id = faker.datatype.uuid();
      const reference = faker.datatype.string(10);
      mockBackend.setCustomerReference.mockResolvedValue(reference);
      const response = await app.inject({
        method: 'PUT',
        url: `/submissions/${id}/reference`,
        payload: JSON.stringify(reference),
      });

      expect(response.result).toEqual(reference);
      expect(response.statusCode).toBe(200);
      expect(mockBackend.setCustomerReference).toBeCalledTimes(1);
      expect(mockBackend.setCustomerReference).toBeCalledWith(id, reference);
    });
  });
});
