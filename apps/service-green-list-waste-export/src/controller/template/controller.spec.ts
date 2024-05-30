import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { expect, jest } from '@jest/globals';
import winston from 'winston';
import {
  DbContainerNameKey,
  DraftCarriers,
  DraftRecoveryFacilityDetails,
  DraftWasteDescription,
  Template,
} from '../../model';
import TemplateController from './controller';
import { CosmosRepository } from '../../data';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const templateContainerName: DbContainerNameKey = 'templates';

const mockRepository = {
  getRecords: jest.fn<CosmosRepository['getRecords']>(),
  getRecord: jest.fn<CosmosRepository['getRecord']>(),
  saveRecord: jest.fn<CosmosRepository['saveRecord']>(),
  createBulkRecords: jest.fn<CosmosRepository['createBulkRecords']>(),
  deleteRecord: jest.fn<CosmosRepository['deleteRecord']>(),
  getTotalNumber: jest.fn<CosmosRepository['getTotalNumber']>(),
};

describe(TemplateController, () => {
  const subject = new TemplateController(
    mockRepository as unknown as CosmosRepository,
    new winston.Logger(),
  );
  const timestamp = new Date();

  beforeEach(() => {
    mockRepository.getRecords.mockClear();
    mockRepository.getRecord.mockClear();
    mockRepository.saveRecord.mockClear();
    mockRepository.createBulkRecords.mockClear();
    mockRepository.deleteRecord.mockClear();
    mockRepository.getTotalNumber.mockClear();
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

      mockRepository.getRecord.mockResolvedValue(value);

      const response = await subject.createTemplateFromTemplate({
        id,
        accountId,
        templateDetails: { name: 'Copied Template', description: 'new desc' },
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.value.templateDetails.name).toEqual('Copied Template');
    });
  });

  describe('getRecords', () => {
    it('forwards thrown Boom errors', async () => {
      const accountId = faker.datatype.uuid();
      const order = 'ASC';
      mockRepository.getRecords.mockRejectedValue(Boom.teapot());

      const response = await subject.getTemplates({
        accountId,
        order,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecords).toBeCalledWith(
        templateContainerName,
        accountId,
        order,
        undefined,
        undefined,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns values from repository', async () => {
      const accountId = faker.datatype.uuid();
      const order = 'ASC';
      mockRepository.getRecords.mockResolvedValue({
        totalRecords: 0,
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

      expect(mockRepository.getRecords).toHaveBeenCalledWith(
        templateContainerName,
        accountId,
        order,
        1,
        '',
      );
      expect(response.value).toEqual({
        currentPage: 0,
        pages: [],
        totalPages: 0,
        totalRecords: 0,
        values: [],
      });
    });

    it('successfully returns number of templates from repository', async () => {
      const accountId = faker.datatype.uuid();
      mockRepository.getTotalNumber.mockResolvedValue(2);

      const response = await subject.getNumberOfTemplates({ accountId });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getTotalNumber).toHaveBeenCalledWith(
        templateContainerName,
        accountId,
      );
      expect(response.value).toEqual(2);
    });
  });

  describe('createTemplate', () => {
    it('forwards thrown Boom errors', async () => {
      mockRepository.saveRecord.mockRejectedValue(Boom.teapot());
      const response = await subject.createTemplate({
        accountId: faker.datatype.uuid(),
        templateDetails: { name: 'a', description: '' },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.error.statusCode).toBe(418);
    });
  });

  describe('getRecord', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getTemplate({ id, accountId });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        templateContainerName,
        id,
        accountId,
      );
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

      mockRepository.getRecord.mockResolvedValue(value);

      const response = await subject.getTemplate({ id, accountId });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
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

      mockRepository.getRecord.mockResolvedValue(value);

      const response = await subject.getTemplate({ id, accountId });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
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

  describe('setTemplateWasteDescription', () => {
    it('enables recovery facility where some waste code is provided', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
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
      await subject.setTemplateWasteDescription({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: { type: 'AnnexIIIA', code: 'X' },
        },
      });

      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .wasteDescription as DraftWasteDescription
        ).status,
      ).toBe('Started');
    });

    it('Resets carriers and recovery facility details if input switches to small-waste', async () => {
      const id = faker.datatype.uuid();
      const carrierId = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
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
      await subject.setTemplateWasteDescription({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: { type: 'NotApplicable' },
        },
      });

      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .wasteDescription as DraftWasteDescription
        ).status,
      ).toBe('Started');
      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .carriers as DraftCarriers
        ).status,
      ).toBe('NotStarted');
      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .recoveryFacilityDetail as DraftRecoveryFacilityDetails
        ).status,
      ).toBe('NotStarted');
    });

    it('Resets carriers and recovery facility details if input switches to bulk-waste', async () => {
      const id = faker.datatype.uuid();
      const carrierId = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
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
      await subject.setTemplateWasteDescription({
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
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .wasteDescription as DraftWasteDescription
        ).status,
      ).toBe('Started');
      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .carriers as DraftCarriers
        ).status,
      ).toBe('NotStarted');
      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .recoveryFacilityDetail as DraftRecoveryFacilityDetails
        ).status,
      ).toBe('NotStarted');
    });

    it('Resets carriers and recovery facility details if input switches type of bulk-waste', async () => {
      const id = faker.datatype.uuid();
      const carrierId = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
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
      await subject.setTemplateWasteDescription({
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
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .wasteDescription as DraftWasteDescription
        ).status,
      ).toBe('Started');
      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .carriers as DraftCarriers
        ).status,
      ).toBe('NotStarted');
      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .recoveryFacilityDetail as DraftRecoveryFacilityDetails
        ).status,
      ).toBe('NotStarted');
    });

    it('Resets status of carriers and recovery facility if input switches bulk-waste code with the same bulk-waste type', async () => {
      const id = faker.datatype.uuid();
      const carrierId1 = faker.datatype.uuid();
      const carrierId2 = faker.datatype.uuid();
      const carrierId3 = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
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
      await subject.setTemplateWasteDescription({
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
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .wasteDescription as DraftWasteDescription as DraftWasteDescription
        ).status,
      ).toBe('Started');
      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .carriers as DraftCarriers
        ).status,
      ).toBe('Started');
      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .recoveryFacilityDetail as DraftRecoveryFacilityDetails
        ).status,
      ).toBe('Started');
    });
  });
});
