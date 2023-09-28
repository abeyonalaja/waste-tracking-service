import { faker } from '@faker-js/faker';
import { server } from '@hapi/hapi';
import { jest } from '@jest/globals';
import winston from 'winston';
import Boom from '@hapi/boom';
import templatePlugin from './template.plugin';
import {
  TemplateDetails,
  Template,
  TemplateSummary,
} from '@wts/api/waste-tracking-gateway';
import { TemplateRef, TemplateBackend } from './template.backend';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockBackend = {
  createTemplate:
    jest.fn<
      (accountId: string, templateDetails: TemplateDetails) => Promise<Template>
    >(),
  createTemplateFromSubmission:
    jest.fn<
      (
        id: string,
        accountId: string,
        templateDetails: TemplateDetails
      ) => Promise<Template>
    >(),
  createTemplateFromTemplate:
    jest.fn<
      (
        id: string,
        accountId: string,
        templateDetails: TemplateDetails
      ) => Promise<Template>
    >(),
  getTemplate: jest.fn<(ref: TemplateRef) => Promise<Template>>(),
  deleteTemplate: jest.fn<(ref: TemplateRef) => Promise<void>>(),
  getTemplates:
    jest.fn<(accountId: string) => Promise<ReadonlyArray<TemplateSummary>>>(),
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
      };

      const response = await app.inject(options);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /templates/{id}', () => {
    it('Responds 200 when creating template using submission id', async () => {
      const options = {
        method: 'POST',
        url: `/templates/copy-submission/${faker.datatype.uuid()}`,
        payload: JSON.stringify({
          templateDetails: {
            name: 'Template Name',
            description: 'Template description',
          },
        }),
      };

      mockBackend.createTemplateFromSubmission.mockResolvedValue;
      const response = await app.inject(options);
      expect(response.statusCode).toBe(201);
    });
  });

  describe('POST /templates/{id}/duplicate', () => {
    it('Responds 200 when duplicating a template using template id', async () => {
      const options = {
        method: 'POST',
        url: `/templates/copy-template/${faker.datatype.uuid()}`,
        payload: JSON.stringify({
          templateDetails: {
            name: 'Template Name',
            description: 'Template description',
          },
        }),
      };

      mockBackend.createTemplateFromTemplate.mockResolvedValue;
      const response = await app.inject(options);
      expect(response.statusCode).toBe(201);
    });
  });

  describe('GET /templates', () => {
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
