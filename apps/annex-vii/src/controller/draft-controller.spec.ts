import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { expect, jest } from '@jest/globals';
import { add } from 'date-fns';
import winston from 'winston';
import { DraftSubmission, DraftSubmissionSummary } from '../model';
import DraftController from './draft-controller';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockRepository = {
  getDrafts:
    jest.fn<(accountId: string) => Promise<DraftSubmissionSummary[]>>(),
  getDraft:
    jest.fn<(id: string, accountId: string) => Promise<DraftSubmission>>(),
  saveDraft:
    jest.fn<(value: DraftSubmission, accountId: string) => Promise<void>>(),
};

describe(DraftController, () => {
  const subject = new DraftController(mockRepository, new winston.Logger());

  beforeEach(() => {
    mockRepository.getDrafts.mockClear();
    mockRepository.getDraft.mockClear();
    mockRepository.saveDraft.mockClear();
  });

  describe('getDrafts', () => {
    it('forwards thrown Boom errors', async () => {
      const accountId = faker.datatype.uuid();
      mockRepository.getDrafts.mockRejectedValue(Boom.teapot());

      const response = await subject.getDrafts({ accountId });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getDrafts).toBeCalledWith(accountId);
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns values from repository', async () => {
      const accountId = faker.datatype.uuid();
      mockRepository.getDrafts.mockResolvedValue([]);

      const response = await subject.getDrafts({ accountId });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getDrafts).toHaveBeenCalledWith(accountId);
      expect(response.value).toEqual([]);
    });
  });

  describe('getDraftById', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      mockRepository.getDraft.mockRejectedValue(Boom.teapot());

      const response = await subject.getDraftById({ id, accountId });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getDraft).toBeCalledWith(id, accountId);
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns value from the repository', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      const value: DraftSubmission = {
        id,
        reference: null,
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

      mockRepository.getDraft.mockResolvedValue(value);

      const response = await subject.getDraftById({ id, accountId });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getDraft).toHaveBeenCalledWith(id, accountId);
      expect(response.value).toEqual(value);
    });
  });

  describe('createDraft', () => {
    it('forwards thrown Boom errors', async () => {
      mockRepository.saveDraft.mockRejectedValue(Boom.teapot());
      const response = await subject.createDraft({
        accountId: faker.datatype.uuid(),
        reference: null,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.saveDraft).toBeCalled();
      expect(response.error.statusCode).toBe(418);
    });

    it('cannot initially start recovery facility section', async () => {
      mockRepository.saveDraft.mockResolvedValue();
      const response = await subject.createDraft({
        accountId: faker.datatype.uuid(),
        reference: null,
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(response.value.recoveryFacilityDetail.status).toBe('CannotStart');
    });
  });

  describe('setDraftWasteDescriptionById', () => {
    it('enables waste quantity on completion of waste description', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
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
      await subject.setDraftWasteDescriptionById({
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

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
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
        accountId
      );
    });

    it('enables recovery facility where some waste code is provided', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
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
      await subject.setDraftWasteDescriptionById({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: { type: 'AnnexIIIA', value: 'X' },
        },
      });

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
          wasteDescription: {
            status: 'Started',
            wasteCode: { type: 'AnnexIIIA', value: 'X' },
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
        accountId
      );
    });

    it('resets waste-quantity section if input switches to small-waste', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
        wasteDescription: {
          status: 'Complete',
          wasteCode: {
            type: 'AnnexIIIA',
            value: 'A',
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
      await subject.setDraftWasteDescriptionById({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: { type: 'NotApplicable' },
        },
      });

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
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
        accountId
      );
    });

    it('Resets quantity, carriers and recovery facility details if input switches to small-waste', async () => {
      const id = faker.datatype.uuid();
      const carrierId = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
        wasteDescription: {
          status: 'Complete',
          wasteCode: {
            type: 'AnnexIIIA',
            value: 'A',
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
                shippingContainerNumber: '',
                vehicleRegistration: '',
                type: 'ShippingContainer',
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
      await subject.setDraftWasteDescriptionById({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: { type: 'NotApplicable' },
        },
      });

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
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
        accountId
      );
    });

    it('Resets quantity, carriers and recovery facility details if input switches to bulk-waste', async () => {
      const id = faker.datatype.uuid();
      const carrierId = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
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
                shippingContainerNumber: '',
                vehicleRegistration: '',
                type: 'ShippingContainer',
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
      await subject.setDraftWasteDescriptionById({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: {
            type: 'AnnexIIIA',
            value: 'A',
          },
        },
      });

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
          wasteDescription: {
            status: 'Started',
            wasteCode: {
              type: 'AnnexIIIA',
              value: 'A',
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
        accountId
      );
    });

    it('Resets quantity, carriers and recovery facility details if input switches type of bulk-waste', async () => {
      const id = faker.datatype.uuid();
      const carrierId = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
        wasteDescription: {
          status: 'Complete',
          wasteCode: {
            type: 'AnnexIIIA',
            value: 'A',
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
                shippingContainerNumber: '',
                vehicleRegistration: '',
                type: 'ShippingContainer',
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
      await subject.setDraftWasteDescriptionById({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: {
            type: 'AnnexIIIB',
            value: 'A',
          },
        },
      });

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
          wasteDescription: {
            status: 'Started',
            wasteCode: {
              type: 'AnnexIIIB',
              value: 'A',
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
        accountId
      );
    });

    it('Resets status of quantity, carriers and recovery facility if input switches bulk-waste code with the same bulk-waste type', async () => {
      const id = faker.datatype.uuid();
      const carrierId1 = faker.datatype.uuid();
      const carrierId2 = faker.datatype.uuid();
      const carrierId3 = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
        wasteDescription: {
          status: 'Complete',
          wasteCode: {
            type: 'AnnexIIIA',
            value: 'A',
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
                shippingContainerNumber: '',
                vehicleRegistration: '',
                type: 'ShippingContainer',
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
                vehicleRegistration: '',
                trailerNumber: '',
                type: 'Trailer',
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
                imo: '',
                type: 'BulkVessel',
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
      await subject.setDraftWasteDescriptionById({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: {
            type: 'AnnexIIIA',
            value: 'Z',
          },
        },
      });

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
          wasteDescription: {
            status: 'Started',
            wasteCode: {
              type: 'AnnexIIIA',
              value: 'Z',
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
                  shippingContainerNumber: '',
                  vehicleRegistration: '',
                  type: 'ShippingContainer',
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
                  vehicleRegistration: '',
                  trailerNumber: '',
                  type: 'Trailer',
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
                  imo: '',
                  type: 'BulkVessel',
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
        accountId
      );
    });
  });

  describe('setDraftWasteQuantityById', () => {
    it('persists both actual and estimate waste quantity data', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
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
      let response = await subject.setDraftWasteQuantityById({
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

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
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
        accountId
      );
      expect(response.success).toBe(true);

      response = await subject.setDraftWasteQuantityById({
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

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
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
                value: 5,
              },
              estimateData: {
                quantityType: 'Weight',
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
        accountId
      );
      expect(response.success).toBe(true);

      response = await subject.setDraftWasteQuantityById({
        id,
        accountId,
        value: {
          status: 'Started',
          value: {
            type: 'ActualData',
          },
        },
      });

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
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
        accountId
      );
      expect(response.success).toBe(true);

      response = await subject.setDraftWasteQuantityById({
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

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
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
                value: 5,
              },
              estimateData: {
                quantityType: 'Weight',
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
        accountId
      );
      expect(response.success).toBe(true);

      response = await subject.setDraftWasteQuantityById({
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

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
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
                value: 5,
              },
              estimateData: {
                quantityType: 'Volume',
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
        accountId
      );
      expect(response.success).toBe(true);
    });
  });

  describe('setDraftCollectionDateById', () => {
    it('accepts a valid collection date', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
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
      const response = await subject.setDraftCollectionDateById({
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

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
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
        accountId
      );

      expect(response.success).toBe(true);
    });

    it('persists both actual and estimate collection date data', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
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
      let response = await subject.setDraftCollectionDateById({
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

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
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
        accountId
      );
      expect(response.success).toBe(true);

      response = await subject.setDraftCollectionDateById({
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

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
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
        accountId
      );
      expect(response.success).toBe(true);
    });
  });

  describe('createDraftCarriers', () => {
    it('successfully creates up to 5 carrier references', async () => {
      const id = faker.datatype.uuid();
      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
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

      expect(mockRepository.saveDraft).toBeCalled();
      expect(response.success).toBe(true);

      response = await subject.createDraftCarriers({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(mockRepository.saveDraft).toBeCalled();
      expect(response.success).toBe(true);

      response = await subject.createDraftCarriers({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(mockRepository.saveDraft).toBeCalled();
      expect(response.success).toBe(true);

      response = await subject.createDraftCarriers({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(mockRepository.saveDraft).toBeCalled();
      expect(response.success).toBe(true);

      response = await subject.createDraftCarriers({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(mockRepository.saveDraft).toBeCalled();
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
      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
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
                imo: '',
                type: 'BulkVessel',
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

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
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
                  imo: '',
                  type: 'BulkVessel',
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
        accountId
      );

      expect(response.success).toBe(true);
    });
  });

  describe('deleteDraftCarriers', () => {
    it('accepts a valid carrier reference', async () => {
      const id = faker.datatype.uuid();
      const carrierId = faker.datatype.uuid();
      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
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
                shippingContainerNumber: '',
                type: 'ShippingContainer',
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

      expect(mockRepository.saveDraft).toBeCalled();

      expect(response.success).toBe(true);
    });
  });

  describe('setDraftExitLocationById', () => {
    it('accepts a request if provided is Yes and value given', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
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
      const response = await subject.setDraftExitLocationById({
        id,
        accountId,
        value: setExitLocationRequest,
      });

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
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
        accountId
      );

      expect(response.success).toBe(true);
    });

    it('accepts request if provided is No and no value is given', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
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
      const response = await subject.setDraftExitLocationById({
        id,
        accountId,
        value: setExitLocationRequest,
      });

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
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
        accountId
      );

      expect(response.success).toBe(true);
    });
  });

  describe('setDraftTransitCountries', () => {
    it('accepts valid Transit Countries data', async () => {
      const id = faker.datatype.uuid();
      const timestamp = new Date();
      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
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

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
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
        accountId
      );

      expect(response.success).toBe(true);
    });
  });

  describe('createDraftRecoveryFacilities', () => {
    it('successfully creates up to 3 recovery facilities', async () => {
      const id = faker.datatype.uuid();
      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
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

      expect(mockRepository.saveDraft).toBeCalled();
      expect(response.success).toBe(true);

      response = await subject.createDraftRecoveryFacilityDetails({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(mockRepository.saveDraft).toBeCalled();
      expect(response.success).toBe(true);

      response = await subject.createDraftRecoveryFacilityDetails({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(mockRepository.saveDraft).toBeCalled();
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
      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
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

      expect(mockRepository.saveDraft).toBeCalledWith(
        {
          id,
          reference: null,
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
        accountId
      );

      expect(response.success).toBe(true);
    });
  });

  describe('deleteDraftRecoveryFacilities', () => {
    it('accepts a valid recovery facility reference', async () => {
      const id = faker.datatype.uuid();
      const rfdId = faker.datatype.uuid();
      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
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

      expect(mockRepository.saveDraft).toBeCalled();

      expect(response.success).toBe(true);
    });
  });

  describe('setDraftSubmissionConfirmation', () => {
    const id = faker.datatype.uuid();
    const accountId = faker.datatype.uuid();
    let date = add(new Date(), { weeks: 2 });

    const mockValidSubmission = {
      id: id,
      reference: 'abc',
      wasteDescription: {
        wasteCode: {
          type: faker.datatype.string(),
          value: faker.datatype.string(),
        },
        ewcCodes: [faker.datatype.string()],
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
              imo: faker.datatype.string(),
              type: 'BulkVessel',
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

    const mockInvalidDateSubmission = { ...mockValidSubmission };
    date = add(new Date(), { days: 1 });

    mockInvalidDateSubmission.collectionDate = {
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
    };

    it('accepts a valid set submission confirmation request', async () => {
      mockRepository.getDraft.mockResolvedValue(mockValidSubmission);

      const response = await subject.setDraftSubmissionConfirmationById({
        id,
        accountId,
        value: {
          status: 'Complete',
          confirmation: true,
        },
      });

      expect(mockRepository.saveDraft).toBeCalled();
      expect(response.success).toBe(true);
    });

    it('rejects an invalid set submission confirmation request', async () => {
      mockRepository.getDraft.mockResolvedValue(mockValidSubmission);

      subject.setDraftExporterDetailById({
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

      const response = await subject.setDraftSubmissionConfirmationById({
        id,
        accountId,
        value: {
          status: 'Complete',
          confirmation: true,
        },
      });

      expect(mockRepository.saveDraft).toBeCalled();
      expect(response.success).toBe(false);
    });

    it('rejects an invalid set submission confirmation request', async () => {
      mockRepository.getDraft.mockResolvedValue(mockValidSubmission);

      const response = await subject.setDraftSubmissionConfirmationById({
        id,
        accountId,
        value: {
          status: 'CannotStart',
        },
      });

      expect(response.success).toBe(false);
    });

    it('If the status of any of the submission entries is not "Complete," the submission confirmation will be reset to "CannotStart"', async () => {
      mockRepository.getDraft.mockResolvedValue(mockValidSubmission);

      subject.setDraftExporterDetailById({
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

      const response = await subject.getDraftSubmissionConfirmationById({
        id,
        accountId,
      });

      expect(mockRepository.saveDraft).toBeCalled();
      expect(response).toEqual({
        success: true,
        value: {
          status: 'CannotStart',
        },
      });
    });

    it('Reset collection date to NotStarted if the collection date fails revalidation on the submission confirmation check', async () => {
      mockRepository.getDraft.mockResolvedValue(mockInvalidDateSubmission);
      const response = await subject.setDraftSubmissionConfirmationById({
        id,
        accountId,
        value: {
          status: 'Complete',
          confirmation: true,
        } as DraftSubmission['submissionConfirmation'],
      });

      expect(response.success).toBe(false);
      const { collectionDate } = await mockRepository.getDraft(id, accountId);

      expect(collectionDate).toEqual({
        status: 'NotStarted',
      });
    });
  });

  describe('setDraftSubmissionDeclaration', () => {
    const id = faker.datatype.uuid();
    const accountId = faker.datatype.uuid();
    let date = add(new Date(), { weeks: 2 });

    const mockSubmission = {
      id: id,
      reference: 'abc',
      wasteDescription: {
        wasteCode: {
          type: faker.datatype.string(),
          value: faker.datatype.string(),
        },
        ewcCodes: [faker.datatype.string()],
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
              imo: faker.datatype.string(),
              type: 'BulkVessel',
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

    const mockInvalidDateSubmission = { ...mockSubmission };
    date = add(new Date(), { days: 1 });

    mockInvalidDateSubmission.collectionDate = {
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
    };

    it('accepts a valid set submission declaration request', async () => {
      mockSubmission.submissionConfirmation = {
        status: 'Complete',
        confirmation: true,
      };
      mockSubmission.submissionDeclaration = { status: 'NotStarted' };
      mockRepository.getDraft.mockResolvedValue(mockSubmission);

      const response = await subject.setDraftSubmissionDeclarationById({
        id,
        accountId,
        value: {
          status: 'Complete',
        },
      });
      console.log(await subject.getDraftById({ id, accountId }));
      expect(mockRepository.saveDraft).toBeCalled();
      expect(response.success).toBe(true);
    });

    it('rejects an invalid set submission declaration request', async () => {
      mockSubmission.submissionConfirmation = { status: 'CannotStart' };
      mockSubmission.submissionDeclaration = { status: 'CannotStart' };
      mockRepository.getDraft.mockResolvedValue(mockSubmission);

      expect(
        subject.getDraftSubmissionConfirmationById({ id, accountId })
      ).resolves.toEqual({ success: true, value: { status: 'CannotStart' } });
      expect(
        subject.getDraftSubmissionDeclarationById({ id, accountId })
      ).resolves.toEqual({ success: true, value: { status: 'CannotStart' } });

      const response = await subject.setDraftSubmissionDeclarationById({
        id,
        accountId,
        value: {
          status: 'Complete',
        },
      });

      expect(response.success).toBe(false);
    });

    it('rejects an invalid set submission declaration request', async () => {
      mockRepository.getDraft.mockResolvedValue(mockSubmission);

      const response = await subject.setDraftSubmissionConfirmationById({
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
      mockRepository.getDraft.mockResolvedValue(mockSubmission);

      subject.setDraftExporterDetailById({
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
        subject.getDraftSubmissionConfirmationById({ id, accountId })
      ).resolves.toEqual({ success: true, value: { status: 'CannotStart' } });
      expect(
        subject.getDraftSubmissionConfirmationById({ id, accountId })
      ).resolves.toEqual({ success: true, value: { status: 'CannotStart' } });
    });
  });

  describe('cancelDraftSubmission', () => {
    it('successfully cancels a draft submission', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();

      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
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
      });

      expect(
        (await mockRepository.getDraft(id, accountId)).submissionState.status
      ).toBe('InProgress');

      subject.cancelDraft({
        id,
        accountId,
        cancellationType: { type: 'ChangeOfRecoveryFacilityOrLaboratory' },
      });

      expect(
        (await mockRepository.getDraft(id, accountId)).submissionState.status
      ).toBe('Cancelled');

      mockRepository.getDraft.mockResolvedValue({
        id,
        reference: null,
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
      });

      subject.cancelDraft({
        id,
        accountId,
        cancellationType: { type: 'Other', reason: 'Not sure !!!' },
      });

      expect(
        (await mockRepository.getDraft(id, accountId)).submissionState.status
      ).toBe('Cancelled');
    });
  });
});
