import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { expect, jest } from '@jest/globals';
import winston from 'winston';
import { DraftSubmission, Template, TemplateSummaryPage } from '../model';
import TemplateController from './template-controller';
import { DaprClient } from '@dapr/dapr';
import { DraftCarriers, DraftRecoveryFacilityDetail } from '@wts/api/annex-vii';

const mockGetBulk = jest.fn<typeof DaprClient.prototype.state.getBulk>();
const mockSave = jest.fn<typeof DaprClient.prototype.state.save>();
const mockQuery = jest.fn<typeof DaprClient.prototype.state.query>();

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

jest.mock('@dapr/dapr', () => ({
  DaprClient: jest.fn().mockImplementation(() => ({
    state: {
      getBulk: mockGetBulk,
      save: mockSave,
      query: mockQuery,
    },
  })),
}));

beforeEach(() => {
  mockGetBulk.mockClear();
  mockSave.mockClear();
  mockQuery.mockClear();
});

const mockRepository = {
  getTemplates:
    jest.fn<
      (
        accountId: string,
        order: 'ASC' | 'DESC',
        pageLimit?: number,
        token?: string
      ) => Promise<TemplateSummaryPage>
    >(),
  getTemplate: jest.fn<(id: string, accountId: string) => Promise<Template>>(),
  deleteTemplate: jest.fn<(id: string) => Promise<void>>(),
  createTemplateFromDraft:
    jest.fn<
      (
        id: string,
        accountId: string,
        templateName: string,
        templateDescription?: string
      ) => Promise<Template>
    >(),
  createDraftFromTemplate:
    jest.fn<
      (
        id: string,
        accountId: string,
        reference: string
      ) => Promise<DraftSubmission>
    >(),
  saveTemplate:
    jest.fn<(template: Template, accountId: string) => Promise<void>>(),
  copyCarriersNoTransport:
    jest.fn<
      (sourceCarriers: DraftCarriers, isSmallWaste: boolean) => DraftCarriers
    >(),
  copyRecoveryFacilities:
    jest.fn<
      (
        sourceFacilities: DraftRecoveryFacilityDetail
      ) => DraftRecoveryFacilityDetail
    >(),
};

describe(TemplateController, () => {
  const subject = new TemplateController(mockRepository, new winston.Logger());
  const timestamp = new Date();

  beforeEach(() => {
    mockRepository.getTemplates.mockClear();
    mockRepository.getTemplate.mockClear();
    mockRepository.saveTemplate.mockClear();
    mockRepository.deleteTemplate.mockClear();
  });

  describe('createTemplateFromTemplate', () => {
    it('successfully copies template', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      const value: Template = {
        id,
        templateDetails: {
          name: 'My Template name',
          description: 'My Template description',
          created: timestamp,
          lastModified: timestamp,
        },
        wasteDescription: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
      };

      mockRepository.getTemplate.mockResolvedValue(value);

      const response = await subject.createTemplateFromTemplate({
        id,
        accountId,
        templateDetails: { name: 'Copied Template', description: 'new desc' },
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getTemplate).toHaveBeenCalledWith(id, accountId);
      expect(response.value.templateDetails.name).toEqual('Copied Template');
    });
  });

  describe('getTemplates', () => {
    it('forwards thrown Boom errors', async () => {
      const accountId = faker.datatype.uuid();
      const order = 'ASC';
      mockRepository.getTemplates.mockRejectedValue(Boom.teapot());

      const response = await subject.getTemplates({
        accountId,
        order,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getTemplates).toBeCalledWith(
        accountId,
        order,
        undefined,
        undefined
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns values from repository', async () => {
      const accountId = faker.datatype.uuid();
      const order = 'ASC';
      mockRepository.getTemplates.mockResolvedValue({
        totalTemplates: 0,
        totalPages: 0,
        currentPage: 0,
        pages: [],
        values: [],
      });

      const response = await subject.getTemplates({
        accountId,
        order,
        pageLimit: 1,
        token: '',
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getTemplates).toHaveBeenCalledWith(
        accountId,
        order,
        1,
        ''
      );
      expect(response.value).toEqual({
        currentPage: 0,
        pages: [],
        totalPages: 0,
        totalTemplates: 0,
        values: [],
      });
    });
  });

  describe('createTemplate', () => {
    it('forwards thrown Boom errors', async () => {
      mockRepository.saveTemplate.mockRejectedValue(Boom.teapot());
      const response = await subject.createTemplate({
        accountId: faker.datatype.uuid(),
        templateDetails: { name: 'a', description: '' },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.saveTemplate).toBeCalled();
      expect(response.error.statusCode).toBe(418);
    });
  });

  describe('getTemplateById', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      mockRepository.getTemplate.mockRejectedValue(Boom.teapot());

      const response = await subject.getTemplateById({ id, accountId });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getTemplate).toBeCalledWith(id, accountId);
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns value from the repository', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      const value: Template = {
        id,
        templateDetails: {
          name: 'My Template name',
          description: 'My Template description',
          created: timestamp,
          lastModified: timestamp,
        },
        wasteDescription: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
      };

      mockRepository.getTemplate.mockResolvedValue(value);

      const response = await subject.getTemplateById({ id, accountId });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getTemplate).toHaveBeenCalledWith(id, accountId);
      expect(response.value).toEqual(value);
    });

    it('successfully deletes template from the repository', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();

      const value: Template = {
        id,
        templateDetails: {
          name: 'My Template name',
          description: 'My Template description',
          created: timestamp,
          lastModified: timestamp,
        },
        wasteDescription: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
      };

      mockRepository.getTemplate.mockResolvedValue(value);

      const response = await subject.getTemplateById({ id, accountId });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getTemplate).toHaveBeenCalledWith(id, accountId);
      expect(response.value).toEqual(value);

      const deleteResponse = await subject.deleteTemplate({
        id: response.value.id,
        accountId,
      });
      expect(deleteResponse.success).toBe(true);
      if (!deleteResponse.success) {
        return;
      }
    });
  });

  describe('setTemplateWasteDescriptionById', () => {
    it('enables recovery facility where some waste code is provided', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getTemplate.mockResolvedValue({
        id,
        templateDetails: {
          name: 'My Template name',
          description: 'My Template description',
          created: timestamp,
          lastModified: timestamp,
        },
        wasteDescription: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
      });

      const accountId = faker.datatype.uuid();
      await subject.setTemplateWasteDescriptionById({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: { type: 'AnnexIIIA', code: 'X' },
        },
      });

      expect(
        (await mockRepository.getTemplate(id, accountId)).wasteDescription
          .status
      ).toBe('Started');
    });

    it('Resets carriers and recovery facility details if input switches to small-waste', async () => {
      const id = faker.datatype.uuid();
      const carrierId = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getTemplate.mockResolvedValue({
        id,
        templateDetails: {
          name: 'My Template name',
          description: 'My Template description',
          created: timestamp,
          lastModified: timestamp,
        },
        wasteDescription: {
          status: 'Complete',
          wasteCode: {
            type: 'AnnexIIIA',
            code: 'A',
          },
          ewcCodes: [],
          nationalCode: { provided: 'No' },
          description: '',
        },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'Complete',
          transport: true,
          values: [
            {
              transportDetails: {
                type: 'Road',
              },
              addressDetails: {
                address: '',
                country: '',
                organisationName: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: carrierId,
            },
          ],
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: {
          status: 'Complete',
          values: [
            {
              recoveryFacilityType: {
                type: 'RecoveryFacility',
                recoveryCode: 'R1',
              },
              addressDetails: {
                address: '',
                country: '',
                name: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: rfdId,
            },
          ],
        },
      });

      const accountId = faker.datatype.uuid();
      await subject.setTemplateWasteDescriptionById({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: { type: 'NotApplicable' },
        },
      });

      expect(
        (await mockRepository.getTemplate(id, accountId)).wasteDescription
          .status
      ).toBe('Started');
      expect(
        (await mockRepository.getTemplate(id, accountId)).carriers.status
      ).toBe('NotStarted');
      expect(
        (await mockRepository.getTemplate(id, accountId)).recoveryFacilityDetail
          .status
      ).toBe('NotStarted');
    });

    it('Resets carriers and recovery facility details if input switches to bulk-waste', async () => {
      const id = faker.datatype.uuid();
      const carrierId = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getTemplate.mockResolvedValue({
        id,
        templateDetails: {
          name: 'My Template name',
          description: 'My Template description',
          created: timestamp,
          lastModified: timestamp,
        },
        wasteDescription: {
          status: 'Complete',
          wasteCode: { type: 'NotApplicable' },
          ewcCodes: [],
          nationalCode: { provided: 'No' },
          description: '',
        },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'Complete',
          transport: true,
          values: [
            {
              transportDetails: {
                type: 'Road',
                description: 'hitch-hiking',
              },
              addressDetails: {
                address: '',
                country: '',
                organisationName: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: carrierId,
            },
          ],
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: {
          status: 'Complete',
          values: [
            {
              recoveryFacilityType: {
                type: 'Laboratory',
                disposalCode: 'D1',
              },
              addressDetails: {
                address: '',
                country: '',
                name: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: rfdId,
            },
          ],
        },
      });

      const accountId = faker.datatype.uuid();
      await subject.setTemplateWasteDescriptionById({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: {
            type: 'AnnexIIIA',
            code: 'A',
          },
        },
      });

      expect(
        (await mockRepository.getTemplate(id, accountId)).wasteDescription
          .status
      ).toBe('Started');
      expect(
        (await mockRepository.getTemplate(id, accountId)).carriers.status
      ).toBe('NotStarted');
      expect(
        (await mockRepository.getTemplate(id, accountId)).recoveryFacilityDetail
          .status
      ).toBe('NotStarted');
    });

    it('Resets carriers and recovery facility details if input switches type of bulk-waste', async () => {
      const id = faker.datatype.uuid();
      const carrierId = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getTemplate.mockResolvedValue({
        id,
        templateDetails: {
          name: 'My Template name',
          description: 'My Template description',
          created: timestamp,
          lastModified: timestamp,
        },
        wasteDescription: {
          status: 'Complete',
          wasteCode: {
            type: 'AnnexIIIA',
            code: 'A',
          },
          ewcCodes: [],
          nationalCode: { provided: 'No' },
          description: '',
        },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'Complete',
          transport: true,
          values: [
            {
              transportDetails: {
                type: 'Air',
                description: 'flying',
              },
              addressDetails: {
                address: '',
                country: '',
                organisationName: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: carrierId,
            },
          ],
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: {
          status: 'Complete',
          values: [
            {
              recoveryFacilityType: {
                type: 'RecoveryFacility',
                recoveryCode: 'R1',
              },
              addressDetails: {
                address: '',
                country: '',
                name: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: rfdId,
            },
          ],
        },
      });

      const accountId = faker.datatype.uuid();
      await subject.setTemplateWasteDescriptionById({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: {
            type: 'AnnexIIIB',
            code: 'A',
          },
        },
      });

      expect(
        (await mockRepository.getTemplate(id, accountId)).wasteDescription
          .status
      ).toBe('Started');
      expect(
        (await mockRepository.getTemplate(id, accountId)).carriers.status
      ).toBe('NotStarted');
      expect(
        (await mockRepository.getTemplate(id, accountId)).recoveryFacilityDetail
          .status
      ).toBe('NotStarted');
    });

    it('Resets status of carriers and recovery facility if input switches bulk-waste code with the same bulk-waste type', async () => {
      const id = faker.datatype.uuid();
      const carrierId1 = faker.datatype.uuid();
      const carrierId2 = faker.datatype.uuid();
      const carrierId3 = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getTemplate.mockResolvedValue({
        id,
        templateDetails: {
          name: 'My Template name',
          description: 'My Template description',
          created: timestamp,
          lastModified: timestamp,
        },
        wasteDescription: {
          status: 'Complete',
          wasteCode: {
            type: 'AnnexIIIA',
            code: 'A',
          },
          ewcCodes: [],
          nationalCode: { provided: 'No' },
          description: '',
        },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'Complete',
          transport: true,
          values: [
            {
              transportDetails: {
                type: 'Sea',
                description: 'swimming',
              },
              addressDetails: {
                address: '',
                country: '',
                organisationName: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: carrierId1,
            },
            {
              transportDetails: {
                type: 'Road',
                description: 'On the one road...',
              },
              addressDetails: {
                address: '',
                country: '',
                organisationName: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: carrierId2,
            },
            {
              transportDetails: {
                type: 'Road',
                description: 'On the one road...',
              },
              addressDetails: {
                address: '',
                country: '',
                organisationName: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: carrierId3,
            },
          ],
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: {
          status: 'Complete',
          values: [
            {
              recoveryFacilityType: {
                type: 'RecoveryFacility',
                recoveryCode: 'R1',
              },
              addressDetails: {
                address: '',
                country: '',
                name: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: rfdId,
            },
          ],
        },
      });

      const accountId = faker.datatype.uuid();
      await subject.setTemplateWasteDescriptionById({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: {
            type: 'AnnexIIIA',
            code: 'Z',
          },
        },
      });

      expect(
        (await mockRepository.getTemplate(id, accountId)).wasteDescription
          .status
      ).toBe('Started');
      expect(
        (await mockRepository.getTemplate(id, accountId)).carriers.status
      ).toBe('Started');
      expect(
        (await mockRepository.getTemplate(id, accountId)).recoveryFacilityDetail
          .status
      ).toBe('Started');
    });
  });
});
