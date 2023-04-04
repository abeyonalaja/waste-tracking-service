import { faker } from '@faker-js/faker';
import { server } from '@hapi/hapi';
import { jest } from '@jest/globals';
import { Submission, WasteDescription } from './submission.backend';
import submissionPlugin from './submission.plugin';

const mockBackend = {
  listSubmissions: jest.fn<() => Promise<Submission[]>>(),
  createSubmission: jest.fn<(reference?: string) => Promise<Submission>>(),
  getSubmissionById: jest.fn<(id: string) => Promise<Submission | undefined>>(),
  getWasteDescriptionById:
    jest.fn<(submissionId: string) => Promise<WasteDescription | undefined>>(),
  setWasteDescriptionById:
    jest.fn<
      (
        submissionId: string,
        wasteDescription: WasteDescription
      ) => Promise<WasteDescription | undefined>
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      backend: mockBackend,
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
    mockBackend.getSubmissionById.mockClear();
    mockBackend.getWasteDescriptionById.mockClear();
    mockBackend.setWasteDescriptionById.mockClear();
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

      mockBackend.getSubmissionById.mockResolvedValue(undefined);
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });
});
