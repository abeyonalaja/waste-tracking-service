import { faker } from '@faker-js/faker';
import { server } from '@hapi/hapi';
import { jest } from '@jest/globals';
import SubmissionController from './submission.controller';
import submissionPlugin from './submission.plugin';

const mockGetSubmission =
  jest.fn<typeof SubmissionController.prototype.getSubmission>();
const mockListSubmissions =
  jest.fn<typeof SubmissionController.prototype.listSubmissions>();
const mockCreateSubmission =
  jest.fn<typeof SubmissionController.prototype.createSubmission>();

jest.mock('./submission.controller', () =>
  jest.fn().mockImplementation(() => ({
    getSubmission: mockGetSubmission,
    listSubmissions: mockListSubmissions,
    createSubmission: mockCreateSubmission,
  }))
);

const app = server({
  host: 'localhost',
  port: 3000,
});

beforeAll(async () => {
  await app.register({
    plugin: submissionPlugin,
    options: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      controller: new SubmissionController({} as any),
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
    mockGetSubmission.mockClear();
    mockListSubmissions.mockClear();
    mockCreateSubmission.mockClear();
  });

  describe('GET /submissions', () => {
    const options = {
      method: 'GET',
      url: '/submissions',
    };

    it('Handles empty collection', async () => {
      mockListSubmissions.mockResolvedValue([]);
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

      mockGetSubmission.mockResolvedValue(undefined);
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });
});
