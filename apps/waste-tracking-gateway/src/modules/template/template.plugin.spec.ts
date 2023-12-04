import { faker } from '@faker-js/faker';
import { server } from '@hapi/hapi';
import { jest } from '@jest/globals';
import winston from 'winston';
import Boom from '@hapi/boom';
import templatePlugin from './template.plugin';
import { Template, TemplateSummaryPage } from '@wts/api/waste-tracking-gateway';
import { TemplateRef, TemplateBackend } from './template.backend';
import { OrderRef } from '../submission';
import AuthBearer from 'hapi-auth-bearer-token';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const accountId = '964cc80b-da90-4675-ac05-d4d1d79ac888';
const token = 'my-token';

const mockBackend = {
  createTemplate: jest.fn<
    (
      accountId: string,
      templateDetails: {
        name: string;
        description: string;
      }
    ) => Promise<Template>
  >(),
  createTemplateFromSubmission: jest.fn<
    (
      id: string,
      accountId: string,
      templateDetails: {
        name: string;
        description: string;
      }
    ) => Promise<Template>
  >(),
  createTemplateFromTemplate: jest.fn<
    (
      id: string,
      accountId: string,
      templateDetails: {
        name: string;
        description: string;
      }
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
        token?: string
      ) => Promise<TemplateSummaryPage>
    >(),
};

const app = server({
  host: 'localhost',
  port: 3000,
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

  await app.register(Object.create(AuthBearer));

  app.auth.strategy('dcid-auth', 'bearer-access-token', {
    allowQueryToken: true,
    validate: async (request: any, token: string, h: any) => {
      try {
        const isValid = true;
        const credentials = {
          accountId: accountId,
        };
        const artifacts = {
          contactId: accountId,
          organisationId: '',
          accountIdReference: accountId,
        };

        return { isValid, credentials, artifacts };
      } catch (err) {
        return Boom.unauthorized();
      }
    },
  });

  app.auth.default('dcid-auth');

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
  });

  describe('POST /templates', () => {
    it('Responds 400 with no request payload', async () => {
      const options = {
        method: 'POST',
        url: '/templates',
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      mockBackend.getTemplate.mockRejectedValue(Boom.notFound());
      const response = await app.inject(options);
      expect(response.statusCode).toBe(404);
    });
  });
});
