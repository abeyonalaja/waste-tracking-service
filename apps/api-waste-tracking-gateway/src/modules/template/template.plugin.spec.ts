import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { server } from '@hapi/hapi';
import { jest } from '@jest/globals';
import { Template, TemplateSummaryPage } from '@wts/api/waste-tracking-gateway';
import winston from 'winston';
import { OrderRef } from '../submission';
import { TemplateBackend, TemplateRef } from './template.backend';
import templatePlugin from './template.plugin';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const accountId = '964cc80b-da90-4675-ac05-d4d1d79ac888';

const mockBackend = {
  createTemplate: jest.fn<
    (
      accountId: string,
      templateDetails: {
        name: string;
        description: string;
      },
    ) => Promise<Template>
  >(),
  createTemplateFromSubmission: jest.fn<
    (
      id: string,
      accountId: string,
      templateDetails: {
        name: string;
        description: string;
      },
    ) => Promise<Template>
  >(),
  createTemplateFromTemplate: jest.fn<
    (
      id: string,
      accountId: string,
      templateDetails: {
        name: string;
        description: string;
      },
    ) => Promise<Template>
  >(),
  getTemplate: jest.fn<(ref: TemplateRef) => Promise<Template>>(),
  deleteTemplate: jest.fn<(ref: TemplateRef) => Promise<void>>(),
  getTemplates:
    jest.fn<
      (
        accountId: string,
        order: OrderRef,
        pageLimit?: number,
        token?: string,
      ) => Promise<TemplateSummaryPage>
    >(),
  getNumberOfTemplates: jest.fn<(accountId: string) => Promise<number>>(),
};

const app = server({
  host: 'localhost',
  port: 3006,
});

beforeAll(async () => {
  await app.register({
    plugin: templatePlugin,
    options: {
      backend: mockBackend as unknown as TemplateBackend,
      logger: new winston.Logger(),
    },
    routes: {
      prefix: '/templates',
    },
  });

  app.auth.scheme('mock', function () {
    return {
      authenticate: async function (_, h): Promise<unknown> {
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

describe('TemplatePlugin', () => {
  beforeEach(() => {
    mockBackend.createTemplate.mockClear();
    mockBackend.createTemplateFromSubmission.mockClear();
    mockBackend.createTemplateFromTemplate.mockClear();
    mockBackend.getTemplate.mockClear();
    mockBackend.deleteTemplate.mockClear();
    mockBackend.getTemplates.mockClear();
    mockBackend.getNumberOfTemplates.mockClear();
  });

  describe('POST /templates', () => {
    it('Responds 400 with no request payload', async () => {
      const options = {
        method: 'POST',
        url: '/templates',
      };

      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /templates', () => {
    it('Responds 401 if no auth is provided', async () => {
      const options = {
        method: 'GET',
        url: '/templates',
      };

      mockBackend.getTemplates.mockRejectedValue(Boom.unauthorized());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(401);
    });

    it('Responds 404 if no templates exist', async () => {
      const options = {
        method: 'GET',
        url: '/templates',
      };

      mockBackend.getTemplates.mockRejectedValue(Boom.notFound());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('GET /templates/{id}', () => {
    it("Responds 404 if template doesn't exist", async () => {
      const options = {
        method: 'GET',
        url: `/templates/${faker.datatype.uuid()}`,
      };

      mockBackend.getTemplate.mockRejectedValue(Boom.notFound());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });
});
