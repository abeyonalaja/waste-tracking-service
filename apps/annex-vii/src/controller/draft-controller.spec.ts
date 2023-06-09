import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { expect, jest } from '@jest/globals';
import { add } from 'date-fns';
import winston from 'winston';
import { DraftSubmission, DraftSubmissionSummary } from '../model';
import DraftController from './draft-controller';
import { ExitLocation } from '@wts/api/waste-tracking-gateway';

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

  describe('setWasteDescriptionById', () => {
    it('enables waste quantity on completion of waste description', async () => {
      const id = faker.datatype.uuid();
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
        },
        accountId
      );
    });

    it('enables recovery facility where some waste code is provided', async () => {
      const id = faker.datatype.uuid();
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
        },
        accountId
      );
    });

    it('resets waste-quantity section if input switches to small-waste', async () => {
      const id = faker.datatype.uuid();
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
            quantityType: 'Volume',
            value: 12.0,
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
        },
        accountId
      );
    });

    it('resets waste-quantity section if input switches to bulk-waste', async () => {
      const id = faker.datatype.uuid();
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
            type: 'NotApplicable',
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
        recoveryFacilityDetail: { status: 'CannotStart' },
      });

      const accountId = faker.datatype.uuid();
      await subject.setDraftWasteDescriptionById({
        id,
        accountId,
        value: {
          status: 'Complete',
          wasteCode: {
            type: 'AnnexIIIA',
            value: 'A',
          },
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
            wasteCode: {
              type: 'AnnexIIIA',
              value: 'A',
            },
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
            transport: true,
          },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'NotStarted' },
        },
        accountId
      );
    });

    it('resets all carriers transport details section if input switches to small-waste', async () => {
      const id = faker.datatype.uuid();
      const carrierId1 = faker.datatype.uuid();
      const carrierId2 = faker.datatype.uuid();
      const carrierId3 = faker.datatype.uuid();
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
        recoveryFacilityDetail: { status: 'CannotStart' },
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
            status: 'Started',
            transport: false,
            values: [
              {
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
          recoveryFacilityDetail: { status: 'NotStarted' },
        },
        accountId
      );
    });
  });

  describe('setDraftCollectionDateById', () => {
    it('accepts a valid collection date', async () => {
      const id = faker.datatype.uuid();
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
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            day: date.getDate().toString().padStart(2, '0'),
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
              year: date.getFullYear().toString(),
              month: (date.getMonth() + 1).toString().padStart(2, '0'),
              day: date.getDate().toString().padStart(2, '0'),
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
        },
        accountId
      );

      expect(response.success).toBe(true);
    });

    it('rejects dates less than three business dates in the future', async () => {
      const date = add(new Date(), { days: 1 });
      const response = await subject.setDraftCollectionDateById({
        id: faker.datatype.uuid(),
        accountId: faker.datatype.uuid(),
        value: {
          status: 'Complete',
          value: {
            type: 'ActualDate',
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            day: date.getDate().toString().padStart(2, '0'),
          },
        },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.saveDraft).not.toBeCalled();
      expect(response.error.statusCode).toBe(400);
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
      });

      const setExitLocationRequest = {
        status: 'Complete',
        exitLocation: { provided: 'Yes', value: faker.datatype.string() },
      } as ExitLocation;
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
        },
        accountId
      );

      expect(response.success).toBe(true);
    });

    it('accepts request if provided is No and no value is given', async () => {
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
      });

      const setExitLocationRequest = {
        status: 'Complete',
        exitLocation: { provided: 'No' },
      } as ExitLocation;

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
        },
        accountId
      );

      expect(response.success).toBe(true);
    });
  });

  describe('setDraftTransitCountries', () => {
    it('accepts valid Transit Countries data', async () => {
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
});
