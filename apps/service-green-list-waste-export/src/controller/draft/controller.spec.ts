import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { expect, jest } from '@jest/globals';
import { add } from 'date-fns';
import winston from 'winston';
import { DraftSubmission, DbContainerNameKey } from '../../model';
import DraftController from './controller';
import { CosmosRepository } from '../../data';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const draftContainerName: DbContainerNameKey = 'drafts';

const mockRepository = {
  getRecords: jest.fn<CosmosRepository['getRecords']>(),
  getRecord: jest.fn<CosmosRepository['getRecord']>(),
  saveRecord: jest.fn<CosmosRepository['saveRecord']>(),
  createBulkRecords: jest.fn<CosmosRepository['createBulkRecords']>(),
  deleteRecord: jest.fn<CosmosRepository['deleteRecord']>(),
  getTotalNumber: jest.fn<CosmosRepository['getTotalNumber']>(),
};

describe(DraftController, () => {
  const subject = new DraftController(
    mockRepository as unknown as CosmosRepository,
    new winston.Logger(),
  );

  beforeEach(() => {
    mockRepository.getRecords.mockClear();
    mockRepository.getRecord.mockClear();
    mockRepository.saveRecord.mockClear();
    mockRepository.createBulkRecords.mockClear();
    mockRepository.deleteRecord.mockClear();
    mockRepository.getTotalNumber.mockClear();
  });

  describe('getDrafts', () => {
    it('forwards thrown Boom errors', async () => {
      const accountId = faker.datatype.uuid();
      const order = 'ASC';
      mockRepository.getRecords.mockRejectedValue(Boom.teapot());

      const response = await subject.getDrafts({
        accountId,
        order,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecords).toBeCalledWith(
        draftContainerName,
        accountId,
        order,
        undefined,
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

      const response = await subject.getDrafts({
        accountId,
        order,
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecords).toHaveBeenCalledWith(
        draftContainerName,
        accountId,
        order,
        undefined,
        undefined,
        undefined,
      );
      expect(response.value).toEqual({
        totalRecords: 0,
        totalPages: 0,
        currentPage: 0,
        pages: [],
        values: [],
      });
    });
  });

  describe('getDraft', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getDraft({ id, accountId });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        draftContainerName,
        id,
        accountId,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns value from the repository', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      const value: DraftSubmission = {
        id,
        reference: 'abc',
        wasteDescription: { status: 'NotStarted' },
        wasteQuantity: { status: 'CannotStart' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
      };

      mockRepository.getRecord.mockResolvedValue(value);

      const response = await subject.getDraft({ id, accountId });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        draftContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual(value);
    });
  });

  describe('createDraft', () => {
    it('forwards thrown Boom errors', async () => {
      mockRepository.saveRecord.mockRejectedValue(Boom.teapot());
      const response = await subject.createDraft({
        accountId: faker.datatype.uuid(),
        reference: 'abc',
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.error.statusCode).toBe(418);
    });

    it('cannot initially start recovery facility section', async () => {
      mockRepository.saveRecord.mockResolvedValue();
      const response = await subject.createDraft({
        accountId: faker.datatype.uuid(),
        reference: 'abc',
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(response.value.recoveryFacilityDetail.status).toBe('CannotStart');
    });
  });

  describe('setDraftWasteDescription', () => {
    it('enables waste quantity on completion of waste description', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
        wasteDescription: { status: 'NotStarted' },
        wasteQuantity: { status: 'CannotStart' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: timestamp,
        },
      });

      const accountId = faker.datatype.uuid();
      await subject.setDraftWasteDescription({
        id,
        accountId,
        value: {
          status: 'Complete',
          wasteCode: { type: 'NotApplicable' },
          ewcCodes: [],
          nationalCode: { provided: 'No' },
          description: '',
        },
      });

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: {
            status: 'Complete',
            wasteCode: { type: 'NotApplicable' },
            ewcCodes: [],
            nationalCode: { provided: 'No' },
            description: '',
          },
          wasteQuantity: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: {
            status: 'NotStarted',
            transport: false,
          },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'NotStarted' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );
    });

    it('enables recovery facility where some waste code is provided', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
        wasteDescription: { status: 'NotStarted' },
        wasteQuantity: { status: 'CannotStart' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: timestamp,
        },
      });

      const accountId = faker.datatype.uuid();
      await subject.setDraftWasteDescription({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: { type: 'AnnexIIIA', code: 'X' },
        },
      });

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: {
            status: 'Started',
            wasteCode: { type: 'AnnexIIIA', code: 'X' },
          },
          wasteQuantity: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: {
            status: 'NotStarted',
            transport: true,
          },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'NotStarted' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );
    });

    it('resets waste-quantity section if input switches to small-waste', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
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
        wasteQuantity: {
          status: 'Complete',
          value: {
            type: 'ActualData',
            actualData: {
              quantityType: 'Volume',
              value: 12.0,
            },
            estimateData: {},
          },
        },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: timestamp,
        },
      });

      const accountId = faker.datatype.uuid();
      await subject.setDraftWasteDescription({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: { type: 'NotApplicable' },
        },
      });

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: {
            status: 'Started',
            wasteCode: { type: 'NotApplicable' },
          },
          wasteQuantity: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: {
            status: 'NotStarted',
            transport: false,
          },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'NotStarted' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );
    });

    it('Resets quantity, carriers and recovery facility details if input switches to small-waste', async () => {
      const id = faker.datatype.uuid();
      const carrierId = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
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
        wasteQuantity: {
          status: 'Complete',
          value: {
            type: 'ActualData',
            actualData: {
              quantityType: 'Volume',
              value: 12.0,
            },
            estimateData: {},
          },
        },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'Complete',
          transport: true,
          values: [
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
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: timestamp,
        },
      });

      const accountId = faker.datatype.uuid();
      await subject.setDraftWasteDescription({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: { type: 'NotApplicable' },
        },
      });

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: {
            status: 'Started',
            wasteCode: { type: 'NotApplicable' },
          },
          wasteQuantity: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: {
            status: 'NotStarted',
            transport: false,
          },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'NotStarted' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );
    });

    it('Resets quantity, carriers and recovery facility details if input switches to bulk-waste', async () => {
      const id = faker.datatype.uuid();
      const carrierId = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
        wasteDescription: {
          status: 'Complete',
          wasteCode: { type: 'NotApplicable' },
          ewcCodes: [],
          nationalCode: { provided: 'No' },
          description: '',
        },
        wasteQuantity: {
          status: 'Complete',
          value: {
            type: 'ActualData',
            actualData: {
              quantityType: 'Volume',
              value: 12.0,
            },
            estimateData: {},
          },
        },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
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
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: timestamp,
        },
      });

      const accountId = faker.datatype.uuid();
      await subject.setDraftWasteDescription({
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

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: {
            status: 'Started',
            wasteCode: {
              type: 'AnnexIIIA',
              code: 'A',
            },
          },
          wasteQuantity: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: {
            status: 'NotStarted',
            transport: true,
          },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'NotStarted' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );
    });

    it('Resets quantity, carriers and recovery facility details if input switches type of bulk-waste', async () => {
      const id = faker.datatype.uuid();
      const carrierId = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
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
        wasteQuantity: {
          status: 'Complete',
          value: {
            type: 'ActualData',
            actualData: {
              quantityType: 'Volume',
              value: 12.0,
            },
            estimateData: {},
          },
        },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
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
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: timestamp,
        },
      });

      const accountId = faker.datatype.uuid();
      await subject.setDraftWasteDescription({
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

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: {
            status: 'Started',
            wasteCode: {
              type: 'AnnexIIIB',
              code: 'A',
            },
          },
          wasteQuantity: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: {
            status: 'NotStarted',
            transport: true,
          },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'NotStarted' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );
    });

    it('Resets status of quantity, carriers and recovery facility if input switches bulk-waste code with the same bulk-waste type', async () => {
      const id = faker.datatype.uuid();
      const carrierId1 = faker.datatype.uuid();
      const carrierId2 = faker.datatype.uuid();
      const carrierId3 = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
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
        wasteQuantity: {
          status: 'Complete',
          value: {
            type: 'ActualData',
            actualData: {
              quantityType: 'Volume',
              value: 12.0,
            },
            estimateData: {},
          },
        },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'Complete',
          transport: true,
          values: [
            {
              transportDetails: {
                type: 'Air',
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
                type: 'Sea',
                description: 'Somewhere beyond the sea...',
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
                type: 'Sea',
                description: 'Somewhere beyond the sea...',
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
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: timestamp,
        },
      });

      const accountId = faker.datatype.uuid();
      await subject.setDraftWasteDescription({
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

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: {
            status: 'Started',
            wasteCode: {
              type: 'AnnexIIIA',
              code: 'Z',
            },
          },
          wasteQuantity: {
            status: 'Started',
            value: {
              type: 'ActualData',
              actualData: {
                quantityType: 'Volume',
                value: 12.0,
              },
              estimateData: {},
            },
          },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: {
            status: 'Started',
            transport: true,
            values: [
              {
                transportDetails: {
                  type: 'Air',
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
                  type: 'Sea',
                  description: 'Somewhere beyond the sea...',
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
                  type: 'Sea',
                  description: 'Somewhere beyond the sea...',
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
            status: 'Started',
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
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );
    });
  });

  describe('setDraftWasteQuantity', () => {
    it('persists both actual and estimate waste quantity data', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
        wasteDescription: {
          status: 'Complete',
          wasteCode: { type: 'NotApplicable' },
          ewcCodes: [],
          nationalCode: { provided: 'No' },
          description: '',
        },
        wasteQuantity: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: false,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'NotStarted' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: timestamp,
        },
      });

      const accountId = faker.datatype.uuid();
      let response = await subject.setDraftWasteQuantity({
        id,
        accountId,
        value: {
          status: 'Complete',
          value: {
            type: 'ActualData',
            actualData: {
              quantityType: 'Weight',
              value: 5,
            },
            estimateData: {},
          },
        },
      });

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: {
            status: 'Complete',
            wasteCode: { type: 'NotApplicable' },
            ewcCodes: [],
            nationalCode: { provided: 'No' },
            description: '',
          },
          wasteQuantity: {
            status: 'Complete',
            value: {
              type: 'ActualData',
              actualData: {
                quantityType: 'Weight',
                unit: 'Kilogram',
                value: 5,
              },
              estimateData: {},
            },
          },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: {
            status: 'NotStarted',
            transport: false,
          },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'NotStarted' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );
      expect(response.success).toBe(true);

      response = await subject.setDraftWasteQuantity({
        id,
        accountId,
        value: {
          status: 'Complete',
          value: {
            type: 'EstimateData',
            actualData: {},
            estimateData: {
              quantityType: 'Weight',
              value: 5,
            },
          },
        },
      });

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: {
            status: 'Complete',
            wasteCode: { type: 'NotApplicable' },
            ewcCodes: [],
            nationalCode: { provided: 'No' },
            description: '',
          },
          wasteQuantity: {
            status: 'Complete',
            value: {
              type: 'EstimateData',
              actualData: {
                quantityType: 'Weight',
                unit: 'Kilogram',
                value: 5,
              },
              estimateData: {
                quantityType: 'Weight',
                unit: 'Kilogram',
                value: 5,
              },
            },
          },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: {
            status: 'NotStarted',
            transport: false,
          },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'NotStarted' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );
      expect(response.success).toBe(true);

      response = await subject.setDraftWasteQuantity({
        id,
        accountId,
        value: {
          status: 'Started',
          value: {
            type: 'ActualData',
          },
        },
      });

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: {
            status: 'Complete',
            wasteCode: { type: 'NotApplicable' },
            ewcCodes: [],
            nationalCode: { provided: 'No' },
            description: '',
          },
          wasteQuantity: {
            status: 'Started',
            value: {
              type: 'ActualData',
              actualData: {},
              estimateData: {
                quantityType: 'Weight',
                unit: 'Kilogram',
                value: 5,
              },
            },
          },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: {
            status: 'NotStarted',
            transport: false,
          },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'NotStarted' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );
      expect(response.success).toBe(true);

      response = await subject.setDraftWasteQuantity({
        id,
        accountId,
        value: {
          status: 'Started',
          value: {
            type: 'ActualData',
            actualData: {
              quantityType: 'Weight',
              value: 5,
            },
          },
        },
      });

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: {
            status: 'Complete',
            wasteCode: { type: 'NotApplicable' },
            ewcCodes: [],
            nationalCode: { provided: 'No' },
            description: '',
          },
          wasteQuantity: {
            status: 'Started',
            value: {
              type: 'ActualData',
              actualData: {
                quantityType: 'Weight',
                unit: 'Kilogram',
                value: 5,
              },
              estimateData: {
                quantityType: 'Weight',
                unit: 'Kilogram',
                value: 5,
              },
            },
          },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: {
            status: 'NotStarted',
            transport: false,
          },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'NotStarted' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );
      expect(response.success).toBe(true);

      response = await subject.setDraftWasteQuantity({
        id,
        accountId,
        value: {
          status: 'Complete',
          value: {
            type: 'EstimateData',
            actualData: {},
            estimateData: {
              quantityType: 'Volume',
              value: 5,
            },
          },
        },
      });

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: {
            status: 'Complete',
            wasteCode: { type: 'NotApplicable' },
            ewcCodes: [],
            nationalCode: { provided: 'No' },
            description: '',
          },
          wasteQuantity: {
            status: 'Complete',
            value: {
              type: 'EstimateData',
              actualData: {
                quantityType: 'Weight',
                unit: 'Kilogram',
                value: 5,
              },
              estimateData: {
                quantityType: 'Volume',
                unit: 'Litre',
                value: 5,
              },
            },
          },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: {
            status: 'NotStarted',
            transport: false,
          },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'NotStarted' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );
      expect(response.success).toBe(true);
    });
  });

  describe('setDraftCollectionDate', () => {
    it('accepts a valid collection date', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
        wasteDescription: {
          status: 'Complete',
          wasteCode: { type: 'NotApplicable' },
          ewcCodes: [],
          nationalCode: { provided: 'No' },
          description: '',
        },
        wasteQuantity: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: false,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'NotStarted' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: timestamp,
        },
      });

      const accountId = faker.datatype.uuid();
      const date = add(new Date(), { weeks: 2 });
      const response = await subject.setDraftCollectionDate({
        id,
        accountId,
        value: {
          status: 'Complete',
          value: {
            type: 'ActualDate',
            actualDate: {
              year: date.getFullYear().toString(),
              month: (date.getMonth() + 1).toString().padStart(2, '0'),
              day: date.getDate().toString().padStart(2, '0'),
            },
            estimateDate: {},
          },
        },
      });

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: {
            status: 'Complete',
            wasteCode: { type: 'NotApplicable' },
            ewcCodes: [],
            nationalCode: { provided: 'No' },
            description: '',
          },
          wasteQuantity: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: {
            status: 'Complete',
            value: {
              type: 'ActualDate',
              actualDate: {
                year: date.getFullYear().toString(),
                month: (date.getMonth() + 1).toString().padStart(2, '0'),
                day: date.getDate().toString().padStart(2, '0'),
              },
              estimateDate: {},
            },
          },
          carriers: {
            status: 'NotStarted',
            transport: false,
          },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'NotStarted' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );

      expect(response.success).toBe(true);
    });

    it('persists both actual and estimate collection date data', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
        wasteDescription: {
          status: 'Complete',
          wasteCode: { type: 'NotApplicable' },
          ewcCodes: [],
          nationalCode: { provided: 'No' },
          description: '',
        },
        wasteQuantity: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: false,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'NotStarted' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: timestamp,
        },
      });

      const accountId = faker.datatype.uuid();
      const date = add(new Date(), { weeks: 2 });
      let response = await subject.setDraftCollectionDate({
        id,
        accountId,
        value: {
          status: 'Complete',
          value: {
            type: 'ActualDate',
            actualDate: {
              year: date.getFullYear().toString(),
              month: (date.getMonth() + 1).toString().padStart(2, '0'),
              day: date.getDate().toString().padStart(2, '0'),
            },
            estimateDate: {},
          },
        },
      });

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: {
            status: 'Complete',
            wasteCode: { type: 'NotApplicable' },
            ewcCodes: [],
            nationalCode: { provided: 'No' },
            description: '',
          },
          wasteQuantity: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: {
            status: 'Complete',
            value: {
              type: 'ActualDate',
              actualDate: {
                year: date.getFullYear().toString(),
                month: (date.getMonth() + 1).toString().padStart(2, '0'),
                day: date.getDate().toString().padStart(2, '0'),
              },
              estimateDate: {},
            },
          },
          carriers: {
            status: 'NotStarted',
            transport: false,
          },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'NotStarted' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );
      expect(response.success).toBe(true);

      response = await subject.setDraftCollectionDate({
        id,
        accountId,
        value: {
          status: 'Complete',
          value: {
            type: 'EstimateDate',
            actualDate: {},
            estimateDate: {
              year: date.getFullYear().toString(),
              month: (date.getMonth() + 1).toString().padStart(2, '0'),
              day: date.getDate().toString().padStart(2, '0'),
            },
          },
        },
      });

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: {
            status: 'Complete',
            wasteCode: { type: 'NotApplicable' },
            ewcCodes: [],
            nationalCode: { provided: 'No' },
            description: '',
          },
          wasteQuantity: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: {
            status: 'Complete',
            value: {
              type: 'EstimateDate',
              actualDate: {
                year: date.getFullYear().toString(),
                month: (date.getMonth() + 1).toString().padStart(2, '0'),
                day: date.getDate().toString().padStart(2, '0'),
              },
              estimateDate: {
                year: date.getFullYear().toString(),
                month: (date.getMonth() + 1).toString().padStart(2, '0'),
                day: date.getDate().toString().padStart(2, '0'),
              },
            },
          },
          carriers: {
            status: 'NotStarted',
            transport: false,
          },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'NotStarted' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );
      expect(response.success).toBe(true);
    });
  });

  describe('createDraftCarriers', () => {
    it('successfully creates up to 5 carrier references', async () => {
      const id = faker.datatype.uuid();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
        wasteDescription: { status: 'NotStarted' },
        wasteQuantity: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'NotStarted' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
      });

      const accountId = faker.datatype.uuid();
      let response = await subject.createDraftCarriers({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.success).toBe(true);

      response = await subject.createDraftCarriers({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.success).toBe(true);

      response = await subject.createDraftCarriers({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.success).toBe(true);

      response = await subject.createDraftCarriers({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.success).toBe(true);

      response = await subject.createDraftCarriers({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.success).toBe(true);

      response = await subject.createDraftCarriers({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(response.success).toBe(false);
    });
  });

  describe('setDraftCarriers', () => {
    it('accepts a valid carrier detail', async () => {
      const id = faker.datatype.uuid();
      const carrierId = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
        wasteDescription: { status: 'NotStarted' },
        wasteQuantity: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'Started',
          transport: true,
          values: [
            {
              id: carrierId,
            },
          ],
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'NotStarted' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: timestamp,
        },
      });

      const accountId = faker.datatype.uuid();
      const response = await subject.setDraftCarriers({
        id,
        accountId,
        carrierId,
        value: {
          status: 'Complete',
          transport: true,
          values: [
            {
              transportDetails: {
                type: 'Rail',
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
      });

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: { status: 'NotStarted' },
          wasteQuantity: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: {
            status: 'Complete',
            transport: true,
            values: [
              {
                transportDetails: {
                  type: 'Rail',
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
          recoveryFacilityDetail: { status: 'NotStarted' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );

      expect(response.success).toBe(true);
    });
  });

  describe('deleteDraftCarriers', () => {
    it('accepts a valid carrier reference', async () => {
      const id = faker.datatype.uuid();
      const carrierId = faker.datatype.uuid();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
        wasteDescription: { status: 'NotStarted' },
        wasteQuantity: { status: 'CannotStart' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'Complete',
          transport: true,
          values: [
            {
              transportDetails: {
                type: 'Rail',
                description: 'choo choo...',
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
        recoveryFacilityDetail: { status: 'NotStarted' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
      });

      const accountId = faker.datatype.uuid();
      const response = await subject.deleteDraftCarriers({
        id,
        accountId,
        carrierId: carrierId,
      });

      expect(mockRepository.saveRecord).toBeCalled();

      expect(response.success).toBe(true);
    });
  });

  describe('setDraftExitLocation', () => {
    it('accepts a request if provided is Yes and value given', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
        wasteDescription: { status: 'NotStarted' },
        wasteQuantity: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'NotStarted' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: timestamp,
        },
      });

      const setExitLocationRequest = {
        status: 'Complete',
        exitLocation: { provided: 'Yes', value: faker.datatype.string() },
      } as DraftSubmission['ukExitLocation'];
      const accountId = faker.datatype.uuid();
      const response = await subject.setDraftUkExitLocation({
        id,
        accountId,
        value: setExitLocationRequest,
      });

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: { status: 'NotStarted' },
          wasteQuantity: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: {
            status: 'NotStarted',
            transport: true,
          },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: setExitLocationRequest,
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'NotStarted' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );

      expect(response.success).toBe(true);
    });

    it('accepts request if provided is No and no value is given', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
        wasteDescription: { status: 'NotStarted' },
        wasteQuantity: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'NotStarted' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: timestamp,
        },
      });

      const setExitLocationRequest = {
        status: 'Complete',
        exitLocation: { provided: 'No' },
      } as DraftSubmission['ukExitLocation'];

      const accountId = faker.datatype.uuid();
      const response = await subject.setDraftUkExitLocation({
        id,
        accountId,
        value: setExitLocationRequest,
      });

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: { status: 'NotStarted' },
          wasteQuantity: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: {
            status: 'NotStarted',
            transport: true,
          },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: setExitLocationRequest,
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'NotStarted' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );

      expect(response.success).toBe(true);
    });
  });

  describe('setDraftTransitCountries', () => {
    it('accepts valid Transit Countries data', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
        wasteDescription: { status: 'NotStarted' },
        wasteQuantity: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'NotStarted' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: timestamp,
        },
      });

      const accountId = faker.datatype.uuid();
      const response = await subject.setDraftTransitCountries({
        id,
        accountId,
        value: {
          status: 'Complete',
          values: ['N.Ireland', 'Wales'],
        },
      });

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: { status: 'NotStarted' },
          wasteQuantity: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: {
            status: 'NotStarted',
            transport: true,
          },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: {
            status: 'Complete',
            values: ['N.Ireland', 'Wales'],
          },
          recoveryFacilityDetail: { status: 'NotStarted' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );

      expect(response.success).toBe(true);
    });
  });

  describe('createDraftRecoveryFacilities', () => {
    it('successfully creates up to 6 recovery facilities', async () => {
      const id = faker.datatype.uuid();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
        wasteDescription: { status: 'NotStarted' },
        wasteQuantity: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'NotStarted' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
      });

      const accountId = faker.datatype.uuid();
      let response = await subject.createDraftRecoveryFacilityDetails({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.success).toBe(true);

      response = await subject.createDraftRecoveryFacilityDetails({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.success).toBe(true);

      response = await subject.createDraftRecoveryFacilityDetails({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.success).toBe(true);

      response = await subject.createDraftRecoveryFacilityDetails({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.success).toBe(true);

      response = await subject.createDraftRecoveryFacilityDetails({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.success).toBe(true);

      response = await subject.createDraftRecoveryFacilityDetails({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.success).toBe(true);

      response = await subject.createDraftRecoveryFacilityDetails({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(response.success).toBe(false);
    });
  });

  describe('setDraftRecoveryFacilities', () => {
    it('accepts a valid recovery facility detail', async () => {
      const id = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
        wasteDescription: { status: 'NotStarted' },
        wasteQuantity: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: {
          status: 'Started',
          values: [
            {
              id: rfdId,
            },
          ],
        },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: timestamp,
        },
      });

      const accountId = faker.datatype.uuid();
      const response = await subject.setDraftRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
        value: {
          status: 'Complete',
          values: [
            {
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
              recoveryFacilityType: {
                type: 'Laboratory',
                disposalCode: 'D1',
              },
              id: rfdId,
            },
          ],
        },
      });

      expect(mockRepository.saveRecord).toBeCalledWith(
        draftContainerName,
        {
          id,
          reference: 'abc',
          wasteDescription: { status: 'NotStarted' },
          wasteQuantity: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: {
            status: 'NotStarted',
            transport: true,
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
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
        },
        accountId,
      );

      expect(response.success).toBe(true);
    });
  });

  describe('deleteDraftRecoveryFacilities', () => {
    it('accepts a valid recovery facility reference', async () => {
      const id = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
        wasteDescription: { status: 'NotStarted' },
        wasteQuantity: { status: 'CannotStart' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
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
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
      });

      const accountId = faker.datatype.uuid();
      const response = await subject.deleteDraftRecoveryFacilityDetails({
        id,
        accountId,
        rfdId: rfdId,
      });

      expect(mockRepository.saveRecord).toBeCalled();

      expect(response.success).toBe(true);
    });
  });

  describe('setDraftSubmissionConfirmation', () => {
    const id = faker.datatype.uuid();
    const accountId = faker.datatype.uuid();
    const date = add(new Date(), { weeks: 2 });

    const mockValidSubmission = {
      id: id,
      reference: 'abc',
      wasteDescription: {
        wasteCode: {
          type: faker.datatype.string(),
          code: faker.datatype.string(),
        },
        ewcCodes: [
          {
            code: faker.datatype.string(),
          },
        ],
        nationalCode: {
          provided: 'Yes',
          value: faker.datatype.string(),
        },
        status: 'Complete',
        description: faker.datatype.string(),
      },
      wasteQuantity: {
        status: 'Complete',
        value: {
          type: 'ActualData',
          actualData: {
            quantityType: 'Weight',
            unit: 'Kilogram',
            value: faker.datatype.number(),
          },
          estimateData: {},
        },
      },
      exporterDetail: {
        exporterAddress: {
          country: faker.datatype.string(),
          postcode: faker.datatype.string(),
          townCity: faker.datatype.string(),
          addressLine1: faker.datatype.string(),
          addressLine2: faker.datatype.string(),
        },
        status: 'Complete',
        exporterContactDetails: {
          organisationName: faker.datatype.string(),
          fullName: faker.datatype.string(),
          emailAddress: faker.datatype.string(),
          phoneNumber: faker.datatype.string(),
        },
      },
      importerDetail: {
        importerAddressDetails: {
          address: faker.datatype.string(),
          country: faker.datatype.string(),
          organisationName: faker.datatype.string(),
        },
        status: 'Complete',
        importerContactDetails: {
          fullName: faker.datatype.string(),
          emailAddress: faker.datatype.string(),
          phoneNumber: faker.datatype.string(),
        },
      },
      collectionDate: {
        status: 'Complete',
        value: {
          type: 'ActualDate',
          actualDate: {
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            day: date.getDate().toString().padStart(2, '0'),
          },
          estimateDate: {},
        },
      },
      carriers: {
        status: 'Complete',
        transport: true,
        values: [
          {
            transportDetails: {
              type: 'Sea',
              description: 'Somewhere beyond the sea...',
            },
            addressDetails: {
              address: faker.datatype.string(),
              country: faker.datatype.string(),
              organisationName: faker.datatype.string(),
            },
            contactDetails: {
              emailAddress: faker.datatype.string(),
              faxNumber: faker.datatype.string(),
              fullName: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
            },
            id: faker.datatype.uuid(),
          },
        ],
      },
      collectionDetail: {
        status: 'Complete',
        address: {
          addressLine1: faker.datatype.string(),
          addressLine2: faker.datatype.string(),
          townCity: faker.datatype.string(),
          postcode: faker.datatype.string(),
          country: faker.datatype.string(),
        },
        contactDetails: {
          organisationName: faker.datatype.string(),
          fullName: faker.datatype.string(),
          emailAddress: faker.datatype.string(),
          phoneNumber: faker.datatype.string(),
        },
      },
      ukExitLocation: {
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: faker.datatype.string(),
        },
      },
      transitCountries: {
        status: 'Complete',
        values: ['Albania (AL)'],
      },
      recoveryFacilityDetail: {
        status: 'Complete',
        values: [
          {
            addressDetails: {
              address: faker.datatype.string(),
              country: faker.datatype.string(),
              name: faker.datatype.string(),
            },
            contactDetails: {
              emailAddress: faker.datatype.string(),
              faxNumber: faker.datatype.string(),
              fullName: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
            },
            recoveryFacilityType: {
              type: 'Laboratory',
              disposalCode: 'D1',
            },
            id: faker.datatype.uuid(),
          },
        ],
      },
      submissionConfirmation: {
        status: 'NotStarted',
      },
      submissionDeclaration: { status: 'CannotStart' },
      submissionState: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    } as DraftSubmission;

    it('accepts a valid set submission confirmation request', async () => {
      mockRepository.getRecord.mockResolvedValue(mockValidSubmission);

      const response = await subject.setDraftSubmissionConfirmation({
        id,
        accountId,
        value: {
          status: 'Complete',
          confirmation: true,
        },
      });

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.success).toBe(true);
    });

    it('rejects an invalid set submission confirmation request', async () => {
      mockRepository.getRecord.mockResolvedValue(mockValidSubmission);

      subject.setDraftExporterDetail({
        id,
        accountId,
        value: {
          exporterAddress: {
            country: faker.datatype.string(),
            postcode: faker.datatype.string(),
            townCity: faker.datatype.string(),
            addressLine1: faker.datatype.string(),
            addressLine2: faker.datatype.string(),
          },
          status: 'Started',
          exporterContactDetails: {
            organisationName: faker.datatype.string(),
            fullName: faker.datatype.string(),
            emailAddress: faker.datatype.string(),
            phoneNumber: faker.datatype.string(),
          },
        },
      });

      const response = await subject.setDraftSubmissionConfirmation({
        id,
        accountId,
        value: {
          status: 'Complete',
          confirmation: true,
        },
      });

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.success).toBe(false);
    });

    it('rejects an invalid set submission confirmation request', async () => {
      mockRepository.getRecord.mockResolvedValue(mockValidSubmission);

      const response = await subject.setDraftSubmissionConfirmation({
        id,
        accountId,
        value: {
          status: 'CannotStart',
        },
      });

      expect(response.success).toBe(false);
    });

    it('If the status of any of the submission entries is not "Complete," the submission confirmation will be reset to "CannotStart"', async () => {
      mockRepository.getRecord.mockResolvedValue(mockValidSubmission);

      subject.setDraftExporterDetail({
        id,
        accountId,
        value: {
          exporterAddress: {
            country: faker.datatype.string(),
            postcode: faker.datatype.string(),
            townCity: faker.datatype.string(),
            addressLine1: faker.datatype.string(),
            addressLine2: faker.datatype.string(),
          },
          status: 'Started',
          exporterContactDetails: {
            organisationName: faker.datatype.string(),
            fullName: faker.datatype.string(),
            emailAddress: faker.datatype.string(),
            phoneNumber: faker.datatype.string(),
          },
        },
      });

      const response = await subject.getDraftSubmissionConfirmation({
        id,
        accountId,
      });

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response).toEqual({
        success: true,
        value: {
          status: 'CannotStart',
        },
      });
    });
  });

  describe('setDraftSubmissionDeclaration', () => {
    const id = faker.datatype.uuid();
    const accountId = faker.datatype.uuid();
    const date = add(new Date(), { weeks: 2 });

    const mockSubmission = {
      id: id,
      reference: 'abc',
      wasteDescription: {
        wasteCode: {
          type: faker.datatype.string(),
          code: faker.datatype.string(),
        },
        ewcCodes: [
          {
            code: faker.datatype.string(),
          },
        ],
        nationalCode: {
          provided: 'Yes',
          value: faker.datatype.string(),
        },
        status: 'Complete',
        description: faker.datatype.string(),
      },
      wasteQuantity: {
        status: 'Complete',
        value: {
          type: 'ActualData',
          actualData: {
            quantityType: 'Weight',
            unit: 'Kilogram',
            value: faker.datatype.number(),
          },
          estimateData: {},
        },
      },
      exporterDetail: {
        exporterAddress: {
          country: faker.datatype.string(),
          postcode: faker.datatype.string(),
          townCity: faker.datatype.string(),
          addressLine1: faker.datatype.string(),
          addressLine2: faker.datatype.string(),
        },
        status: 'Complete',
        exporterContactDetails: {
          organisationName: faker.datatype.string(),
          fullName: faker.datatype.string(),
          emailAddress: faker.datatype.string(),
          phoneNumber: faker.datatype.string(),
        },
      },
      importerDetail: {
        importerAddressDetails: {
          address: faker.datatype.string(),
          country: faker.datatype.string(),
          organisationName: faker.datatype.string(),
        },
        status: 'Complete',
        importerContactDetails: {
          fullName: faker.datatype.string(),
          emailAddress: faker.datatype.string(),
          phoneNumber: faker.datatype.string(),
        },
      },
      collectionDate: {
        status: 'Complete',
        value: {
          type: 'ActualDate',
          actualDate: {
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            day: date.getDate().toString().padStart(2, '0'),
          },
          estimateDate: {},
        },
      },
      carriers: {
        status: 'Complete',
        transport: true,
        values: [
          {
            transportDetails: {
              type: 'Sea',
              description: 'Somewhere beyond the sea...',
            },
            addressDetails: {
              address: faker.datatype.string(),
              country: faker.datatype.string(),
              organisationName: faker.datatype.string(),
            },
            contactDetails: {
              emailAddress: faker.datatype.string(),
              faxNumber: faker.datatype.string(),
              fullName: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
            },
            id: faker.datatype.uuid(),
          },
        ],
      },
      collectionDetail: {
        status: 'Complete',
        address: {
          addressLine1: faker.datatype.string(),
          addressLine2: faker.datatype.string(),
          townCity: faker.datatype.string(),
          postcode: faker.datatype.string(),
          country: faker.datatype.string(),
        },
        contactDetails: {
          organisationName: faker.datatype.string(),
          fullName: faker.datatype.string(),
          emailAddress: faker.datatype.string(),
          phoneNumber: faker.datatype.string(),
        },
      },
      ukExitLocation: {
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: faker.datatype.string(),
        },
      },
      transitCountries: {
        status: 'Complete',
        values: ['Albania (AL)'],
      },
      recoveryFacilityDetail: {
        status: 'Complete',
        values: [
          {
            addressDetails: {
              address: faker.datatype.string(),
              country: faker.datatype.string(),
              name: faker.datatype.string(),
            },
            contactDetails: {
              emailAddress: faker.datatype.string(),
              faxNumber: faker.datatype.string(),
              fullName: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
            },
            recoveryFacilityType: {
              type: 'Laboratory',
              disposalCode: 'D1',
            },
            id: faker.datatype.uuid(),
          },
        ],
      },
      submissionConfirmation: {
        status: 'NotStarted',
      },
      submissionDeclaration: { status: 'CannotStart' },
      submissionState: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    } as DraftSubmission;

    it('accepts a valid set submission declaration request', async () => {
      mockSubmission.submissionConfirmation = {
        status: 'Complete',
        confirmation: true,
      };
      mockSubmission.submissionDeclaration = { status: 'NotStarted' };
      mockRepository.getRecord.mockResolvedValue(mockSubmission);

      const response = await subject.setDraftSubmissionDeclaration({
        id,
        accountId,
        value: {
          status: 'Complete',
        },
      });
      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.success).toBe(true);
    });

    it('rejects an invalid set submission declaration request', async () => {
      mockSubmission.submissionConfirmation = { status: 'CannotStart' };
      mockSubmission.submissionDeclaration = { status: 'CannotStart' };
      mockRepository.getRecord.mockResolvedValue(mockSubmission);

      expect(
        subject.getDraftSubmissionConfirmation({ id, accountId }),
      ).resolves.toEqual({ success: true, value: { status: 'CannotStart' } });
      expect(
        subject.getDraftSubmissionDeclaration({ id, accountId }),
      ).resolves.toEqual({ success: true, value: { status: 'CannotStart' } });

      const response = await subject.setDraftSubmissionDeclaration({
        id,
        accountId,
        value: {
          status: 'Complete',
        },
      });

      expect(response.success).toBe(false);
    });

    it('rejects an invalid set submission declaration request', async () => {
      mockRepository.getRecord.mockResolvedValue(mockSubmission);

      const response = await subject.setDraftSubmissionConfirmation({
        id,
        accountId,
        value: {
          status: 'CannotStart',
        },
      });

      expect(response.success).toBe(false);
    });

    it('If the status of any of the submission entries is not "Complete," the submission declaration will be reset to "CannotStart"', async () => {
      mockSubmission.submissionConfirmation = {
        status: 'Complete',
        confirmation: true,
      };
      mockSubmission.submissionDeclaration = {
        status: 'Complete',
        values: {
          declarationTimestamp: new Date(),
          transactionId: '2307_1234ABCD',
        },
      };
      mockRepository.getRecord.mockResolvedValue(mockSubmission);

      subject.setDraftExporterDetail({
        id,
        accountId,
        value: {
          exporterAddress: {
            country: faker.datatype.string(),
            postcode: faker.datatype.string(),
            townCity: faker.datatype.string(),
            addressLine1: faker.datatype.string(),
            addressLine2: faker.datatype.string(),
          },
          status: 'Started',
          exporterContactDetails: {
            organisationName: faker.datatype.string(),
            fullName: faker.datatype.string(),
            emailAddress: faker.datatype.string(),
            phoneNumber: faker.datatype.string(),
          },
        },
      });

      expect(
        subject.getDraftSubmissionConfirmation({ id, accountId }),
      ).resolves.toEqual({ success: true, value: { status: 'CannotStart' } });
      expect(
        subject.getDraftSubmissionConfirmation({ id, accountId }),
      ).resolves.toEqual({ success: true, value: { status: 'CannotStart' } });
    });
  });
});
