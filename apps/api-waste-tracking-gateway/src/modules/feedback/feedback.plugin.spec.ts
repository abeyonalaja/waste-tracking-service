import { server } from '@hapi/hapi';
import { jest } from '@jest/globals';
import winston from 'winston';
import { FeedbackBackend } from './feedback.backend';
import feedbackPlugin from './feedback.plugin';
import * as api from '@wts/api/waste-tracking-gateway';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockBackend = {
  sendFeedback:
    jest.fn<
      (
        serviceName: string,
        feedback: string,
        rating: number
      ) => Promise<api.SendFeedbackResponse>
    >(),
};

const app = server({
  host: 'localhost',
  port: 3003,
});

beforeAll(async () => {
  await app.register({
    plugin: feedbackPlugin,
    options: {
      backend: mockBackend as FeedbackBackend,
      logger: new winston.Logger(),
    },
    routes: {
      prefix: '/feedback',
    },
  });

  await app.start();
});

afterAll(async () => {
  await app.stop();
});

describe('FeedbackPlugin', () => {
  beforeEach(() => {
    mockBackend.sendFeedback.mockClear();
  });

  describe('POST /feedback 400 no payload', () => {
    it('responds with 400 when no payload present', async () => {
      const options = {
        method: `POST`,
        url: `/feedback`,
      };
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /feedback 400 bad payload', () => {
    it('responds with 400 when payload is incorrectly formatted', async () => {
      const options = {
        method: `POST`,
        url: `/feedback`,
        payload: {
          serviceName: 'glw',
          surveyData: {
            rating: '-1',
            feedback: 'test',
          },
        },
      };
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });

    it('responds with 400 when serviceName is incorrect', async () => {
      const options = {
        method: `POST`,
        url: `/feedback`,
        payload: {
          serviceName: 'fakeservicename',
          surveyData: {
            rating: '-1',
            feedback: 'test',
          },
        },
      };
      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });
});
