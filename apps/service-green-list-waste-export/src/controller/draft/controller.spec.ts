import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { expect, jest } from '@jest/globals';
import { add } from 'date-fns';
import winston from 'winston';
import {
  DraftSubmission,
  DbContainerNameKey,
  DraftImporterDetail,
  DraftCarriers,
  DraftCollectionDetail,
  DraftExporterDetail,
  DraftRecoveryFacilityDetails,
} from '../../model';
import DraftController from './controller';
import { CosmosRepository } from '../../data';
import { glwe, common } from '@wts/util/shared-validation';

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

const locale = 'en';
const context = 'api';

const wasteCodes = [
  {
    type: 'BaselAnnexIX',
    values: [
      {
        code: 'B1010',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      },
    ],
  },
  {
    type: 'OECD',
    values: [
      {
        code: 'GB040',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      },
    ],
  },
  {
    type: 'AnnexIIIA',
    values: [
      {
        code: 'B1010 and B1050',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      },
      {
        code: 'B1010 and B1070',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      },
    ],
  },
  {
    type: 'AnnexIIIB',
    values: [
      {
        code: 'BEU04',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      },
    ],
  },
];

const ewcCodes = [
  {
    code: '010101',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
  {
    code: '010102',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
];

const countries = [
  {
    name: 'Afghanistan [AF]',
  },
  {
    name: 'France [FR]',
  },
  {
    name: 'Belgium [BE]',
  },
  {
    name: 'Burkina Faso [BF]',
  },
  {
    name: 'Åland Islands [AX]',
  },
];

const countriesIncludingUk = [
  {
    name: 'Afghanistan [AF]',
  },
  {
    name: 'France [FR]',
  },
  {
    name: 'Belgium [BE]',
  },
  {
    name: 'Burkina Faso [BF]',
  },
  {
    name: 'Åland Islands [AX]',
  },
  {
    name: 'United Kingdom (England) [GB-ENG]',
  },
];

const recoveryCodes = [
  {
    code: 'R1',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
      interim: false,
    },
  },
  {
    code: 'R13',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
      interim: true,
    },
  },
];

const disposalCodes = [
  {
    code: 'D1',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
];

describe(DraftController, () => {
  const subject = new DraftController(
    mockRepository as unknown as CosmosRepository,
    wasteCodes,
    ewcCodes,
    countries,
    countriesIncludingUk,
    recoveryCodes,
    disposalCodes,
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
      const accountId = faker.string.uuid();
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
      const accountId = faker.string.uuid();
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
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
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
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
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
        accountId: faker.string.uuid(),
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
        accountId: faker.string.uuid(),
        reference: 'abc',
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(response.value.recoveryFacilityDetail.status).toBe('CannotStart');
    });
  });

  describe('deleteDraft', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.deleteDraft({ id, accountId });

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

    it('successfully marks record as deleted', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const draft = {
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
      } as DraftSubmission;

      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.deleteDraft({ id, accountId });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        draftContainerName,
        id,
        accountId,
      );

      expect(mockRepository.saveRecord).toBeCalledTimes(1);

      expect(draft.submissionState.status).toBe('Deleted');
    });
  });

  describe('getDraftCustomerReference', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const draft: DraftSubmission = {
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
    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getDraftCustomerReference({
        id,
        accountId,
      });

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

    it('successfully returns customer reference', async () => {
      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.getDraftCustomerReference({
        id,
        accountId,
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        draftContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual(draft.reference);
    });
  });

  describe('setDraftCustomerReference', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const draft = {
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
    } as DraftSubmission;

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.setDraftCustomerReference({
        id,
        accountId,
        reference: 'abc',
      });

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

    it('successfully sets customer reference', async () => {
      mockRepository.getRecord.mockResolvedValue(draft);

      const customerReference = 'def';
      const response = await subject.setDraftCustomerReference({
        id,
        accountId,
        reference: customerReference,
      });

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.success).toBe(true);
      expect(draft.reference).toEqual(customerReference);
    });

    it('returns an error if the reference length is exceeded', async () => {
      mockRepository.getRecord.mockResolvedValue(draft);

      const customerReference = faker.string.sample(
        common.commonConstraints.ReferenceChar.max + 1,
      );
      const response = await subject.setDraftCustomerReference({
        id,
        accountId,
        reference: customerReference,
      });

      expect(response.success).toBe(false);
    });
  });

  describe('getDraftWasteDescription', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const draft = {
      id,
      reference: 'abc',
      wasteDescription: {
        status: 'Complete',
        wasteCode: {
          type: 'NotApplicable',
        },
        ewcCodes: [],
        nationalCode: {
          provided: 'No',
        },
        description: 'test',
      },
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
    } as DraftSubmission;
    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getDraftWasteDescription({
        id,
        accountId,
      });

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

    it('successfully returns waste description', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();

      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.getDraftWasteDescription({
        id,
        accountId,
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        draftContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual(draft.wasteDescription);
    });
  });

  describe('setDraftWasteDescription', () => {
    it('enables waste quantity on completion of waste description', async () => {
      const id = faker.string.uuid();
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

      const accountId = faker.string.uuid();
      await subject.setDraftWasteDescription({
        id,
        accountId,
        value: {
          status: 'Complete',
          wasteCode: { type: 'NotApplicable' },
          ewcCodes: [
            {
              code: '010101',
            },
          ],
          nationalCode: { provided: 'No' },
          description: 'test',
        },
      });

      expect(mockRepository.saveRecord).toBeCalledTimes(1);
    });

    it('enables recovery facility where some waste code is provided', async () => {
      const id = faker.string.uuid();
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

      const accountId = faker.string.uuid();
      await subject.setDraftWasteDescription({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: { type: 'AnnexIIIA', code: 'B1010 and B1050' },
        },
      });

      expect(mockRepository.saveRecord).toBeCalledTimes(1);
    });

    it('resets waste-quantity section if input switches to small-waste', async () => {
      const id = faker.string.uuid();
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

      const accountId = faker.string.uuid();
      await subject.setDraftWasteDescription({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: { type: 'NotApplicable' },
        },
      });

      expect(mockRepository.saveRecord).toBeCalledTimes(1);
    });

    it('Resets quantity, carriers and recovery facility details if input switches to small-waste', async () => {
      const id = faker.string.uuid();
      const carrierId = faker.string.uuid();
      const rfdId = faker.string.uuid();
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

      const accountId = faker.string.uuid();
      await subject.setDraftWasteDescription({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: { type: 'NotApplicable' },
        },
      });

      expect(mockRepository.saveRecord).toBeCalledTimes(1);
    });

    it('Resets quantity, carriers and recovery facility details if input switches to bulk-waste', async () => {
      const id = faker.string.uuid();
      const carrierId = faker.string.uuid();
      const rfdId = faker.string.uuid();
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

      const accountId = faker.string.uuid();
      await subject.setDraftWasteDescription({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: {
            type: 'AnnexIIIA',
            code: 'B1010 and B1050',
          },
        },
      });

      expect(mockRepository.saveRecord).toBeCalledTimes(1);
    });

    it('Resets quantity, carriers and recovery facility details if input switches type of bulk-waste', async () => {
      const id = faker.string.uuid();
      const carrierId = faker.string.uuid();
      const rfdId = faker.string.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
        wasteDescription: {
          status: 'Complete',
          wasteCode: {
            type: 'AnnexIIIA',
            code: 'B1010 and B1050',
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

      const accountId = faker.string.uuid();
      await subject.setDraftWasteDescription({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: {
            type: 'AnnexIIIB',
            code: 'BEU04',
          },
        },
      });

      expect(mockRepository.saveRecord).toBeCalledTimes(1);
    });

    it('Resets status of quantity, carriers and recovery facility if input switches bulk-waste code with the same bulk-waste type', async () => {
      const id = faker.string.uuid();
      const carrierId1 = faker.string.uuid();
      const carrierId2 = faker.string.uuid();
      const carrierId3 = faker.string.uuid();
      const rfdId = faker.string.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
        wasteDescription: {
          status: 'Complete',
          wasteCode: {
            type: 'AnnexIIIA',
            code: 'B1010 and B1050',
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

      const accountId = faker.string.uuid();
      await subject.setDraftWasteDescription({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: {
            type: 'AnnexIIIA',
            code: 'B1010 and B1070',
          },
        },
      });

      expect(mockRepository.saveRecord).toBeCalledTimes(1);
    });
  });

  describe('setDraftWasteQuantity', () => {
    it('persists both actual and estimate waste quantity data', async () => {
      const id = faker.string.uuid();
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

      const accountId = faker.string.uuid();
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

      expect(mockRepository.saveRecord).toBeCalled();
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

      expect(mockRepository.saveRecord).toBeCalled();
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

      expect(mockRepository.saveRecord).toBeCalled();
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

      expect(mockRepository.saveRecord).toBeCalled();
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

      expect(mockRepository.saveRecord).toBeCalled();
      expect(mockRepository.saveRecord).toBeCalledTimes(5);
      expect(response.success).toBe(true);
    });
  });

  describe('getDraftWasteQuantity', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const draft = {
      id,
      reference: 'abc',
      wasteDescription: { status: 'NotStarted' },
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
        timestamp: new Date(),
      },
    } as DraftSubmission;
    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getDraftWasteQuantity({ id, accountId });

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

    it('successfully returns waste quantity', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();

      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.getDraftWasteQuantity({ id, accountId });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        draftContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual(draft.wasteQuantity);
    });
  });

  describe('setDraftCollectionDate', () => {
    it('accepts a valid collection date', async () => {
      const id = faker.string.uuid();
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

      const accountId = faker.string.uuid();
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

      expect(mockRepository.saveRecord).toBeCalledTimes(1);

      expect(response.success).toBe(true);
    });

    it('persists both actual and estimate collection date data', async () => {
      const id = faker.string.uuid();
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

      const accountId = faker.string.uuid();
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

      expect(mockRepository.saveRecord).toBeCalled();
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

      expect(mockRepository.saveRecord).toBeCalled();
      expect(mockRepository.saveRecord).toBeCalledTimes(2);
      expect(response.success).toBe(true);
    });
  });

  describe('getDraftCollectionDate', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const draft = {
      id,
      reference: 'abc',
      wasteDescription: { status: 'NotStarted' },
      wasteQuantity: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      collectionDate: {
        status: 'Complete',
        value: {
          type: 'ActualDate',
          actualDate: {
            year: '2021',
            month: '01',
            day: '01',
          },
          estimateDate: {},
        },
      },
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
    } as DraftSubmission;
    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getDraftCollectionDate({ id, accountId });

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

    it('successfully returns the collection date', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();

      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.getDraftCollectionDate({ id, accountId });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        draftContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual(draft.collectionDate);
    });
  });

  describe('getDraftExporterDetail', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const draft = {
      id,
      reference: 'abc',
      wasteDescription: { status: 'NotStarted' },
      wasteQuantity: { status: 'NotStarted' },
      exporterDetail: {
        status: 'Started',
        value: {
          name: 'Exporter Name',
          address: 'Exporter Address',
          contact: 'Exporter Contact',
        },
      },
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
    } as DraftSubmission;
    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getDraftExporterDetail({ id, accountId });

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

    it('successfully returns waste quantity', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();

      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.getDraftExporterDetail({ id, accountId });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        draftContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual(draft.exporterDetail);
    });
  });

  describe('setDraftExporterDetail', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const timestamp = new Date();
    const draft = {
      id,
      reference: 'abc',
      wasteDescription: { status: 'NotStarted' },
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
    } as DraftSubmission;

    const exporterDetails = {
      status: 'Complete',
      exporterAddress: {
        addressLine1: 'Exporter Address',
        addressLine2: 'Exporter Address',
        townCity: 'Town',
        country: 'England',
        postcode: 'AB1 2CD',
      },
      exporterContactDetails: {
        organisationName: 'Exporter Name',
        fullName: 'Exporter Name',
        emailAddress: 'test@test.com',
        phoneNumber: '01234567890',
        faxNumber: '01234567890',
      },
    } as DraftExporterDetail;

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.setDraftExporterDetail({
        id,
        accountId,
        value: exporterDetails,
      });

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

    it('accepts valid exporter details', async () => {
      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.setDraftExporterDetail({
        id,
        accountId,
        value: exporterDetails,
      });

      expect(mockRepository.saveRecord).toBeCalledTimes(1);

      expect(response.success).toBe(true);
      expect(draft.exporterDetail).toEqual(exporterDetails);
    });

    it('forwards validation errors', async () => {
      const invalidExporterDetail: DraftExporterDetail = {
        status: 'Complete',
        exporterAddress: {
          addressLine1: '',
          addressLine2: '',
          townCity: '',
          postcode: '',
          country: '',
        },
        exporterContactDetails: {
          organisationName: '',
          fullName: '',
          emailAddress: '',
          phoneNumber: '',
          faxNumber: '',
        },
      };
      const response = await subject.setDraftExporterDetail({
        id,
        accountId,
        value: invalidExporterDetail,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);

      expect(response.error.data).toEqual([
        {
          field: 'ExporterDetail',
          message:
            glwe.errorMessages.emptyAddressLine1('ExporterDetail')[locale][
              context
            ],
        },
        {
          field: 'ExporterDetail',
          message:
            glwe.errorMessages.emptyTownOrCity('ExporterDetail')[locale][
              context
            ],
        },
        {
          field: 'ExporterDetail',
          message:
            glwe.errorMessages.emptyCountry('ExporterDetail')[locale][context],
        },
        {
          field: 'ExporterDetail',
          message:
            glwe.errorMessages.emptyOrganisationName('ExporterDetail')[locale][
              context
            ],
        },
        {
          field: 'ExporterDetail',
          message:
            glwe.errorMessages.emptyContactFullName('ExporterDetail')[locale][
              context
            ],
        },
        {
          field: 'ExporterDetail',
          message:
            glwe.errorMessages.emptyEmail('ExporterDetail')[locale][context],
        },
        {
          field: 'ExporterDetail',
          message:
            glwe.errorMessages.emptyPhone('ExporterDetail')[locale][context],
        },
      ]);
    });
  });

  describe('getDraftImporterDetail', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const draft = {
      id,
      reference: 'abc',
      wasteDescription: { status: 'NotStarted' },
      wasteQuantity: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: {
        status: 'Started',
        value: {
          name: 'Importer Name',
          address: 'Importer Address',
          contact: 'Importer Contact',
        },
      },
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
    } as DraftSubmission;
    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getDraftImporterDetail({ id, accountId });

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

    it('successfully returns waste quantity', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();

      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.getDraftImporterDetail({ id, accountId });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        draftContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual(draft.importerDetail);
    });
  });

  describe('setDraftImporterDetail', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const timestamp = new Date();
    const draft = {
      id,
      reference: 'abc',
      wasteDescription: { status: 'NotStarted' },
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
    } as DraftSubmission;

    const importerDetails = {
      status: 'Complete',
      importerAddressDetails: {
        organisationName: 'Importer Name',
        address: 'Importer Address',
        country: 'Albania [AB]',
      },
      importerContactDetails: {
        fullName: 'Importer Name',
        emailAddress: 'test@test.com',
        phoneNumber: '01234567890',
        faxNumber: '01234567890',
      },
    } as DraftImporterDetail;

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.setDraftImporterDetail({
        id,
        accountId,
        value: importerDetails,
      });

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

    it('accepts valid importer details', async () => {
      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.setDraftImporterDetail({
        id,
        accountId,
        value: importerDetails,
      });

      expect(mockRepository.saveRecord).toBeCalledTimes(1);

      expect(response.success).toBe(true);
      expect(draft.importerDetail).toEqual(importerDetails);
    });
  });

  describe('createDraftCarriers', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const draft = {
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
    } as DraftSubmission;

    it('successfully creates up to 5 carrier references with unique IDs', async () => {
      for (let i = 0; i < 5; i++) {
        mockRepository.getRecord.mockResolvedValue(draft);
        const response = await subject.createDraftCarriers({
          id,
          accountId,
          value: { status: 'Started' },
        });

        expect(mockRepository.saveRecord).toBeCalled();
        expect(response.success).toBe(true);
      }
      if (draft.carriers.status != 'NotStarted') {
        expect(new Set(draft.carriers.values.map((v) => v.id)).size).toBe(5);
      }

      const response = await subject.createDraftCarriers({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(response.success).toBe(false);
    });

    it('rejects a draft carrier without a status of started', async () => {
      const response = await subject.createDraftCarriers({
        id,
        accountId,
        value: { status: 'NotStarted' },
      });

      expect(response.success).toBe(false);
    });
  });

  describe('setDraftCarriers', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const carrierId = faker.string.uuid();
    const timestamp = new Date();
    const draft: DraftSubmission = {
      id,
      reference: 'abc',
      wasteDescription: {
        status: 'Started',
        wasteCode: {
          type: 'BaselAnnexIX',
          code: 'B1010',
        },
      },
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
    };

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

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
                address: 'test address',
                country: 'France [FR]',
                organisationName: 'test org',
              },
              contactDetails: {
                emailAddress: 'test@test.com',
                fullName: 'Full Name',
                phoneNumber: '003478888888888',
              },
              id: carrierId,
            },
          ],
        },
      });

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

    it('accepts valid carrier details', async () => {
      const carriers = {
        status: 'Complete',
        transport: true,
        values: [
          {
            transportDetails: {
              type: 'Rail',
            },
            addressDetails: {
              address: 'test address',
              country: 'France [FR]',
              organisationName: 'test org',
            },
            contactDetails: {
              emailAddress: 'test@test.com',
              faxNumber: '003478888888877',
              fullName: 'test test',
              phoneNumber: '003478888888888',
            },
            id: carrierId,
          },
        ],
      } as DraftCarriers;

      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.setDraftCarriers({
        id,
        accountId,
        carrierId,
        value: carriers,
      });

      expect(response.success).toBe(true);
      expect(draft.carriers).toStrictEqual(carriers);
    });

    it('forwards validation errors', async () => {
      const carriers = {
        status: 'Complete',
        transport: false,
        values: [
          {
            addressDetails: {
              address: faker.string.sample(251),
              country: 'test',
              organisationName: faker.string.sample(251),
            },
            contactDetails: {
              emailAddress: faker.string.sample(251),
              faxNumber: 'test',
              fullName: '',
              phoneNumber: 'test',
            },
            id: carrierId,
          },
        ],
      } as DraftCarriers;

      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.setDraftCarriers({
        id,
        accountId,
        carrierId,
        value: carriers,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);
      expect(response.error.data).toEqual({
        fieldFormatErrors: [
          {
            field: 'Carriers',
            message: glwe.errorMessages.CarrierValidationErrorMessages(
              locale,
              context,
              1,
            ).charTooManyOrganisationName,
          },
          {
            field: 'Carriers',
            message: glwe.errorMessages.CarrierValidationErrorMessages(
              locale,
              context,
              1,
            ).charTooManyAddress,
          },
          {
            field: 'Carriers',
            message: glwe.errorMessages.CarrierValidationErrorMessages(
              locale,
              context,
              1,
            ).invalidCountry,
          },
          {
            field: 'Carriers',
            message: glwe.errorMessages.CarrierValidationErrorMessages(
              locale,
              context,
              1,
            ).emptyContactFullName,
          },
          {
            field: 'Carriers',
            message: glwe.errorMessages.CarrierValidationErrorMessages(
              locale,
              context,
              1,
            ).invalidPhone,
          },
          {
            field: 'Carriers',
            message: glwe.errorMessages.CarrierValidationErrorMessages(
              locale,
              context,
              1,
            ).invalidFax,
          },
          {
            field: 'Carriers',
            message: glwe.errorMessages.CarrierValidationErrorMessages(
              locale,
              context,
              1,
            ).charTooManyEmail,
          },
        ],
      });
    });

    it('returns an error when the carrier status is "NotStarted"', async () => {
      draft.carriers.status = 'NotStarted';

      const carriers = {
        status: 'Complete',
        transport: true,
        values: [
          {
            transportDetails: {
              type: 'Rail',
            },
            addressDetails: {
              address: 'test address',
              country: 'France [FR]',
              organisationName: 'test org',
            },
            contactDetails: {
              emailAddress: 'test@test.com',
              faxNumber: '003478888888877',
              fullName: 'test test',
              phoneNumber: '003478888888888',
            },
            id: carrierId,
          },
        ],
      } as DraftCarriers;

      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.setDraftCarriers({
        id,
        accountId,
        carrierId,
        value: carriers,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }
      expect(response.error.statusCode).toBe(404);
    });

    it('returns an error if the carrier id does not exist', async () => {
      const response = await subject.setDraftCarriers({
        id,
        accountId,
        carrierId: faker.string.uuid(),
        value: {
          status: 'Started',
          transport: true,
          values: [
            {
              transportDetails: {
                type: 'Road',
              },
              addressDetails: {
                address: 'test address',
                country: 'France [FR]',
                organisationName: 'test org',
              },
              contactDetails: {
                emailAddress: 'test@test.com',
                fullName: 'Full Name',
                phoneNumber: '003478888888888',
              },
              id: faker.string.uuid(),
            },
          ],
        },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(404);
    });

    it('forwards cross-sectional validation errors', async () => {
      const draft: DraftSubmission = {
        id,
        reference: 'abc',
        wasteDescription: {
          status: 'Started',
          wasteCode: {
            type: 'NotApplicable',
          },
        },
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
      };
      const carriers = {
        status: 'Complete',
        transport: false,
        values: [
          {
            transportDetails: {
              type: 'Rail',
              description: 'desc',
            },
            addressDetails: {
              address: 'test address',
              country: 'France [FR]',
              organisationName: 'test org',
            },
            contactDetails: {
              emailAddress: 'test@test.com',
              faxNumber: '003478888888877',
              fullName: 'test test',
              phoneNumber: '003478888888888',
            },
            id: carrierId,
          },
        ],
      } as DraftCarriers;

      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.setDraftCarriers({
        id,
        accountId,
        carrierId,
        value: carriers,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);
      expect(response.error.data).toEqual({
        fieldFormatErrors: [],
        invalidStructureErrors: [
          {
            fields: ['WasteDescription', 'Carriers'],
            message:
              glwe.errorMessages.invalidTransportCarriersCrossSection[locale][
                context
              ],
          },
          {
            fields: ['WasteDescription', 'Carriers'],
            message:
              glwe.errorMessages
                .invalidTransportDescriptionCarriersCrossSection[locale][
                context
              ],
          },
        ],
      });
    });
  });

  describe('deleteDraftCarriers', () => {
    it('accepts a valid carrier reference', async () => {
      const id = faker.string.uuid();
      const carrierId = faker.string.uuid();
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

      const accountId = faker.string.uuid();
      const response = await subject.deleteDraftCarriers({
        id,
        accountId,
        carrierId: carrierId,
      });

      expect(mockRepository.saveRecord).toBeCalled();

      expect(response.success).toBe(true);
    });
  });

  describe('listDraftCarriers', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const carrierId = faker.string.uuid();
    const draft = {
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
    } as DraftSubmission;

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.listDraftCarriers({ id, accountId });

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

    it('accepts a valid carrier reference', async () => {
      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.listDraftCarriers({ id, accountId });

      expect(mockRepository.getRecord).toBeCalled();
      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.value).toEqual(draft.carriers);
      }
    });
  });

  describe('getDraftCarriers', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const carrierId = faker.string.uuid();
    const draft = {
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
    } as DraftSubmission;

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getDraftCarriers({
        id,
        accountId,
        carrierId,
      });

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

    it('accepts a valid carrier reference for started and completed carrier records', async () => {
      mockRepository.getRecord.mockResolvedValue(draft);

      let response = await subject.getDraftCarriers({
        id,
        accountId,
        carrierId,
      });

      expect(mockRepository.getRecord).toBeCalled();
      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.value).toEqual(draft.carriers);
      }

      draft.carriers = {
        status: 'Started',
        transport: true,
        values: [
          {
            transportDetails: {
              type: 'Rail',
              description: 'choo choo...',
            },
            addressDetails: {
              address: 'test',
              country: 'Albania [AB]',
              organisationName: 'test org name',
            },
            id: carrierId,
          },
        ],
      };

      mockRepository.getRecord.mockResolvedValue(draft);

      response = await subject.getDraftCarriers({ id, accountId, carrierId });

      expect(mockRepository.getRecord).toBeCalled();
      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.value).toEqual(draft.carriers);
      }
    });

    it('rejects an invalid carrier reference', async () => {
      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.getDraftCarriers({
        id,
        accountId,
        carrierId: faker.string.uuid(),
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalled();
      expect(response.error.statusCode).toBe(404);
    });

    it('returns an error where the carrier data does not exist', async () => {
      draft.carriers = { status: 'NotStarted', transport: false };

      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.getDraftCarriers({
        id,
        accountId,
        carrierId: faker.string.uuid(),
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalled();
      expect(response.error.statusCode).toBe(404);
    });
  });

  describe('getDraftCollectionDetail', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const draft = {
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
      collectionDetail: {
        status: 'Started',
        value: {
          preConsented: 'Yes',
          exemption: 'T11',
          siteName: 'test site',
          permitNumber: 'test permit',
          address: 'test address',
          contact: 'test contact',
        },
      },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: { status: 'NotStarted' },
      submissionConfirmation: { status: 'CannotStart' },
      submissionDeclaration: { status: 'CannotStart' },
      submissionState: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    } as DraftSubmission;

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getDraftCollectionDetail({
        id,
        accountId,
      });

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

    it('accepts a valid collection detail', async () => {
      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.getDraftCollectionDetail({
        id,
        accountId,
      });

      expect(mockRepository.getRecord).toBeCalled();
      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.value).toEqual(draft.collectionDetail);
      }
    });
  });

  describe('setDraftCollectionDetail', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const timestamp = new Date();
    const draft = {
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
      recoveryFacilityDetail: { status: 'NotStarted' },
      submissionConfirmation: { status: 'CannotStart' },
      submissionDeclaration: { status: 'CannotStart' },
      submissionState: {
        status: 'InProgress',
        timestamp: timestamp,
      },
    } as DraftSubmission;

    const collectionDetail: DraftCollectionDetail = {
      status: 'Complete',
      address: {
        addressLine1: 'test address',
        addressLine2: 'test address 2',
        townCity: 'City',
        postcode: 'SW1A 2AA',
        country: 'England',
      },
      contactDetails: {
        organisationName: 'test org',
        fullName: 'test name',
        emailAddress: 'test@test.com',
        phoneNumber: '01234567890',
        faxNumber: '01234567890',
      },
    };

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.setDraftCollectionDetail({
        id,
        accountId,
        value: collectionDetail,
      });

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

    it('forwards validation errors', async () => {
      const invalidCollectionDetail: DraftCollectionDetail = {
        status: 'Complete',
        address: {
          addressLine1: '',
          addressLine2: '',
          townCity: '',
          postcode: '',
          country: '',
        },
        contactDetails: {
          organisationName: '',
          fullName: '',
          emailAddress: '',
          phoneNumber: '',
          faxNumber: '',
        },
      };
      const response = await subject.setDraftCollectionDetail({
        id,
        accountId,
        value: invalidCollectionDetail,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);

      expect(response.error.data).toEqual([
        {
          field: 'CollectionDetail',
          message:
            glwe.errorMessages.emptyAddressLine1('CollectionDetail')[locale][
              context
            ],
        },
        {
          field: 'CollectionDetail',
          message:
            glwe.errorMessages.emptyTownOrCity('CollectionDetail')[locale][
              context
            ],
        },
        {
          field: 'CollectionDetail',
          message:
            glwe.errorMessages.emptyCountry('CollectionDetail')[locale][
              context
            ],
        },
        {
          field: 'CollectionDetail',
          message:
            glwe.errorMessages.emptyOrganisationName('CollectionDetail')[
              locale
            ][context],
        },
        {
          field: 'CollectionDetail',
          message:
            glwe.errorMessages.emptyContactFullName('CollectionDetail')[locale][
              context
            ],
        },
        {
          field: 'CollectionDetail',
          message:
            glwe.errorMessages.emptyEmail('CollectionDetail')[locale][context],
        },
        {
          field: 'CollectionDetail',
          message:
            glwe.errorMessages.emptyPhone('CollectionDetail')[locale][context],
        },
      ]);
    });

    it('updates a records collection details', async () => {
      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.setDraftCollectionDetail({
        id,
        accountId,
        value: collectionDetail,
      });

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.success).toBe(true);
      expect(draft.collectionDetail).toBe(collectionDetail);
    });
  });

  describe('setDraftExitLocation', () => {
    it('accepts a request if provided is Yes and value given', async () => {
      const id = faker.string.uuid();
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
        exitLocation: { provided: 'Yes', value: 'London' },
      } as DraftSubmission['ukExitLocation'];
      const accountId = faker.string.uuid();
      const response = await subject.setDraftUkExitLocation({
        id,
        accountId,
        value: setExitLocationRequest,
      });

      expect(mockRepository.saveRecord).toBeCalledTimes(1);

      expect(response.success).toBe(true);
    });

    it('accepts request if provided is No and no value is given', async () => {
      const id = faker.string.uuid();
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

      const accountId = faker.string.uuid();
      const response = await subject.setDraftUkExitLocation({
        id,
        accountId,
        value: setExitLocationRequest,
      });

      expect(mockRepository.saveRecord).toBeCalledTimes(1);

      expect(response.success).toBe(true);
    });

    it('rejects a request if provided is Yes and the given value is invalid', async () => {
      const id = faker.string.uuid();
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
        exitLocation: { provided: 'Yes', value: 'London12@.,/@#4>2s' },
      } as DraftSubmission['ukExitLocation'];

      const accountId = faker.string.uuid();
      const response = await subject.setDraftUkExitLocation({
        id,
        accountId,
        value: setExitLocationRequest,
      });

      expect(mockRepository.saveRecord).toBeCalledTimes(0);
      expect(response.success).toBe(false);
    });
  });

  describe('getDraftExitLocation', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getDraftUkExitLocation({ id, accountId });

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
    it('gets a valid exit location', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const timestamp = new Date();
      const draft = {
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
        ukExitLocation: {
          status: 'Complete',
          exitLocation: { provided: 'Yes', value: faker.string.sample() },
        },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'NotStarted' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: timestamp,
        },
      } as DraftSubmission;

      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.getDraftUkExitLocation({ id, accountId });

      expect(mockRepository.getRecord).toBeCalledWith(
        draftContainerName,
        id,
        accountId,
      );
      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.value).toEqual(draft.ukExitLocation);
      }
    });
  });

  describe('setDraftTransitCountries', () => {
    it('accepts valid Transit Countries data', async () => {
      const id = faker.string.uuid();
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

      const accountId = faker.string.uuid();
      const response = await subject.setDraftTransitCountries({
        id,
        accountId,
        value: {
          status: 'Complete',
          values: ['France [FR]', 'Belgium [BE]'],
        },
      });

      expect(mockRepository.saveRecord).toBeCalledTimes(1);

      expect(response.success).toBe(true);
    });

    it('rejets invalid Transit Countries data', async () => {
      const id = faker.string.uuid();
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

      const accountId = faker.string.uuid();
      const response = await subject.setDraftTransitCountries({
        id,
        accountId,
        value: {
          status: 'Complete',
          values: [
            'United Kingdom (Northern London) [GB-NIR]',
            'United Kingdom (Wales) [GB-WLS]',
          ],
        },
      });

      expect(mockRepository.saveRecord).toBeCalledTimes(0);

      expect(response.success).toBe(false);
    });
  });

  describe('getDraftTransitCountries', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getDraftTransitCountries({
        id,
        accountId,
      });

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

    it('gets valid transit countries', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const timestamp = new Date();
      const draft = {
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
      } as DraftSubmission;

      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.getDraftTransitCountries({
        id,
        accountId,
      });

      expect(mockRepository.getRecord).toBeCalledWith(
        draftContainerName,
        id,
        accountId,
      );
      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.value).toEqual(draft.transitCountries);
      }
    });
  });

  describe('createDraftRecoveryFacilityDetails', () => {
    let id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const draft = {
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
    } as DraftSubmission;

    it('successfully creates up to 6 recovery facilities with unique UUIDs', async () => {
      mockRepository.getRecord.mockResolvedValue(draft);

      const uniqueUUIDCheck: string[] = [];
      for (let x = 0; x <= 5; x++) {
        id = faker.string.uuid();
        const response = await subject.createDraftRecoveryFacilityDetails({
          id,
          accountId,
          value: { status: 'Started' },
        });

        expect(draft.recoveryFacilityDetail.status).toBe('Started');
        if (draft.recoveryFacilityDetail.status === 'Started') {
          uniqueUUIDCheck.push(draft.recoveryFacilityDetail.values[x].id);
        }

        expect(mockRepository.saveRecord).toBeCalled();
        expect(response.success).toBe(true);
      }

      expect(new Set(uniqueUUIDCheck).size === uniqueUUIDCheck.length).toBe(
        true,
      );

      id = faker.string.uuid();
      const response = await subject.createDraftRecoveryFacilityDetails({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(response.success).toBe(false);
    });

    it('fails when an incorrect value status is provided', async () => {
      let response = await subject.createDraftRecoveryFacilityDetails({
        id,
        accountId,
        value: { status: 'CannotStart' },
      });

      expect(response.success).toBe(false);

      response = await subject.createDraftRecoveryFacilityDetails({
        id,
        accountId,
        value: { status: 'Complete' },
      });

      expect(response.success).toBe(false);

      response = await subject.createDraftRecoveryFacilityDetails({
        id,
        accountId,
        value: { status: 'NotStarted' },
      });

      expect(response.success).toBe(false);
    });
  });

  describe('getDraftRecoveryFacilityDetails', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const rfdId = faker.string.uuid();
    const timestamp = new Date();
    const draft = {
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
    } as DraftSubmission;

    it('successfully retrieves recovery facility details', async () => {
      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.getDraftRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
      });
      expect(response.success).toBe(true);

      if (response.success === true) {
        expect(response.value.status).toBe('Started');
        if (response.value.status === 'Started') {
          expect(response.value.values[0].id).toBe(rfdId);
        }
      }
    });

    it('returns an error when an incorrect rfdid is provided', async () => {
      mockRepository.getRecord.mockResolvedValue(draft);

      const incorrectUUID = faker.string.uuid();
      const response = await subject.getDraftRecoveryFacilityDetails({
        id,
        accountId,
        rfdId: incorrectUUID,
      });
      expect(response.success).toBe(false);
    });

    it('returns an error when the recovery facility details have not been started', async () => {
      draft.recoveryFacilityDetail = {
        status: 'NotStarted',
      };

      mockRepository.getRecord.mockResolvedValue(draft);

      let response = await subject.getDraftRecoveryFacilityDetails({
        id,
        accountId,
        rfdId: rfdId,
      });

      expect(response.success).toBe(false);

      draft.recoveryFacilityDetail = {
        status: 'CannotStart',
      };

      response = await subject.getDraftRecoveryFacilityDetails({
        id,
        accountId,
        rfdId: rfdId,
      });

      expect(response.success).toBe(false);
    });
  });

  describe('setDraftRecoveryFacilityDetails', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const rfdId = faker.string.uuid();
    const timestamp = new Date();
    const draft = {
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
    } as DraftSubmission;

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.setDraftRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
        value: {
          status: 'Complete',
          values: [
            {
              recoveryFacilityType: {
                type: 'Laboratory',
                disposalCode: 'D1',
              },
              addressDetails: {
                address: 'test address',
                country: 'France [FR]',
                name: 'test org',
              },
              contactDetails: {
                emailAddress: 'test@test.com',
                fullName: 'Full Name',
                phoneNumber: '003478888888888',
              },
              id: rfdId,
            },
          ],
        },
      });

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

    it('accepts a valid recovery facility detail', async () => {
      mockRepository.getRecord.mockResolvedValue(draft);

      const accountId = faker.string.uuid();
      const response = await subject.setDraftRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
        value: {
          status: 'Complete',
          values: [
            {
              addressDetails: {
                address: 'test address',
                country: 'France [FR]',
                name: 'test org',
              },
              contactDetails: {
                emailAddress: 'test@test.com',
                fullName: 'Full Name',
                phoneNumber: '003478888888888',
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

      expect(mockRepository.saveRecord).toBeCalledTimes(1);

      expect(response.success).toBe(true);
    });

    it('forwards validation errors', async () => {
      const rfType = 'Laboratory';
      const recoveryFacilities = {
        status: 'Complete',
        values: [
          {
            recoveryFacilityType: {
              type: rfType,
              disposalCode: 'test',
            },
            addressDetails: {
              address: faker.string.sample(251),
              country: 'test',
              name: faker.string.sample(251),
            },
            contactDetails: {
              emailAddress: faker.string.sample(251),
              faxNumber: 'test',
              fullName: '',
              phoneNumber: 'test',
            },
            id: rfdId,
          },
        ],
      } as DraftRecoveryFacilityDetails;

      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.setDraftRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
        value: recoveryFacilities,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);
      expect(response.error.data).toEqual({
        fieldFormatErrors: [
          {
            field: 'RecoveryFacilityDetail',
            message:
              glwe.errorMessages.RecoveryFacilityDetailValidationErrorMessages(
                locale,
                context,
                rfType,
                1,
              ).charTooManyOrganisationName,
          },
          {
            field: 'RecoveryFacilityDetail',
            message:
              glwe.errorMessages.RecoveryFacilityDetailValidationErrorMessages(
                locale,
                context,
                rfType,
                1,
              ).charTooManyAddress,
          },
          {
            field: 'RecoveryFacilityDetail',
            message:
              glwe.errorMessages.RecoveryFacilityDetailValidationErrorMessages(
                locale,
                context,
                rfType,
                1,
              ).invalidCountry,
          },
          {
            field: 'RecoveryFacilityDetail',
            message:
              glwe.errorMessages.RecoveryFacilityDetailValidationErrorMessages(
                locale,
                context,
                rfType,
                1,
              ).emptyContactFullName,
          },
          {
            field: 'RecoveryFacilityDetail',
            message:
              glwe.errorMessages.RecoveryFacilityDetailValidationErrorMessages(
                locale,
                context,
                rfType,
                1,
              ).invalidPhone,
          },
          {
            field: 'RecoveryFacilityDetail',
            message:
              glwe.errorMessages.RecoveryFacilityDetailValidationErrorMessages(
                locale,
                context,
                rfType,
                1,
              ).invalidFax,
          },
          {
            field: 'RecoveryFacilityDetail',
            message:
              glwe.errorMessages.RecoveryFacilityDetailValidationErrorMessages(
                locale,
                context,
                rfType,
                1,
              ).charTooManyEmail,
          },
          {
            field: 'RecoveryFacilityDetail',
            message:
              glwe.errorMessages.RecoveryFacilityDetailValidationErrorMessages(
                locale,
                context,
                rfType,
                1,
              ).invalidCode,
          },
        ],
      });
    });

    it('returns an error when the recovery facility, status is "NotStarted"', async () => {
      draft.recoveryFacilityDetail.status = 'NotStarted';

      const recoveryFacilities = {
        status: 'Complete',
        values: [
          {
            recoveryFacilityType: {
              type: 'Laboratory',
              disposalCode: 'D1',
            },
            addressDetails: {
              address: 'test address',
              country: 'France [FR]',
              name: 'test org',
            },
            contactDetails: {
              emailAddress: 'test@test.com',
              faxNumber: '003478888888877',
              fullName: 'test test',
              phoneNumber: '003478888888888',
            },
            id: rfdId,
          },
        ],
      } as DraftRecoveryFacilityDetails;

      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.setDraftRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
        value: recoveryFacilities,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }
      expect(response.error.statusCode).toBe(404);
    });

    it('returns an error if the recovery facility id does not exist', async () => {
      const response = await subject.setDraftRecoveryFacilityDetails({
        id,
        accountId,
        rfdId: faker.string.uuid(),
        value: {
          status: 'Started',
          values: [
            {
              recoveryFacilityType: {
                type: 'Laboratory',
                disposalCode: 'D1',
              },
              addressDetails: {
                address: 'test address',
                country: 'France [FR]',
                name: 'test org',
              },
              contactDetails: {
                emailAddress: 'test@test.com',
                fullName: 'Full Name',
                phoneNumber: '003478888888888',
              },
              id: faker.string.uuid(),
            },
          ],
        },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(404);
    });

    it('forwards cross-sectional validation errors', async () => {
      const draft: DraftSubmission = {
        id,
        reference: 'abc',
        wasteDescription: {
          status: 'Started',
          wasteCode: {
            type: 'BaselAnnexIX',
          },
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
      };
      const recoveryFacilities = {
        status: 'Complete',
        values: [
          {
            recoveryFacilityType: {
              type: 'Laboratory',
              disposalCode: 'D1',
            },
            addressDetails: {
              address: 'test address',
              country: 'France [FR]',
              name: 'test org',
            },
            contactDetails: {
              emailAddress: 'test@test.com',
              faxNumber: '003478888888877',
              fullName: 'test test',
              phoneNumber: '003478888888888',
            },
            id: rfdId,
          },
        ],
      } as DraftRecoveryFacilityDetails;

      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.setDraftRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
        value: recoveryFacilities,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);
      expect(response.error.data).toEqual({
        fieldFormatErrors: [],
        invalidStructureErrors: [
          {
            fields: ['WasteDescription', 'RecoveryFacilityDetail'],
            message:
              glwe.errorMessages
                .invalidLaboratoryRecoveryFacilityDetailCrossSection[locale][
                context
              ],
          },
        ],
      });
    });
  });

  describe('listDraftRecoveryFacilityDetails', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const rfdId = faker.string.uuid();
    const draft = {
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
    } as DraftSubmission;

    it('accepts a valid recovery facility reference', async () => {
      mockRepository.getRecord.mockResolvedValue(draft);

      const response = await subject.listDraftRecoveryFacilityDetails({
        id,
        accountId,
      });

      expect(mockRepository.getRecord).toBeCalled();
      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.value).toEqual(draft.recoveryFacilityDetail);
      }
    });

    it('returns an error when the draft does not exist', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.badRequest);
      const invalidId = faker.string.uuid();

      const response = await subject.listDraftRecoveryFacilityDetails({
        id: invalidId,
        accountId,
      });

      expect(response.success).toBe(false);
    });

    it('returns an error when recovery facilities do not exist in the draft', async () => {
      draft.recoveryFacilityDetail.status = 'NotStarted';

      const response = await subject.listDraftRecoveryFacilityDetails({
        id,
        accountId,
      });

      expect(response.success).toBe(false);
    });
  });

  describe('deleteDraftRecoveryFacilityDetails', () => {
    const id = faker.string.uuid();
    const rfdId = faker.string.uuid();
    const accountId = faker.string.uuid();
    const draft = {
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
    } as DraftSubmission;

    it('accepts a valid recovery facility reference', async () => {
      mockRepository.getRecord.mockResolvedValue(draft);

      const accountId = faker.string.uuid();
      const response = await subject.deleteDraftRecoveryFacilityDetails({
        id,
        accountId,
        rfdId: rfdId,
      });

      expect(mockRepository.saveRecord).toBeCalled();

      expect(response.success).toBe(true);
    });

    it('returns an error when the draft does not exist', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.badRequest);
      const invalidId = faker.string.uuid();

      const response = await subject.deleteDraftRecoveryFacilityDetails({
        id: invalidId,
        accountId,
        rfdId: rfdId,
      });

      expect(response.success).toBe(false);
    });

    it('returns an error when recovery facilities do not exist in the draft', async () => {
      draft.recoveryFacilityDetail.status = 'NotStarted';

      const response = await subject.deleteDraftRecoveryFacilityDetails({
        id,
        accountId,
        rfdId: rfdId,
      });

      expect(response.success).toBe(false);
    });

    it('returns an error when a recovery facility does not exist for the provided uuid', async () => {
      draft.recoveryFacilityDetail = {
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
            id: faker.string.uuid(),
          },
        ],
      };

      const response = await subject.deleteDraftRecoveryFacilityDetails({
        id,
        accountId,
        rfdId: rfdId,
      });

      expect(response.success).toBe(false);
    });
  });

  describe('setDraftSubmissionConfirmation', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const date = add(new Date(), { weeks: 2 });

    const mockValidSubmission = {
      id: id,
      reference: 'abc',
      wasteDescription: {
        wasteCode: {
          type: faker.string.sample(),
          code: faker.string.sample(),
        },
        ewcCodes: [
          {
            code: faker.string.sample(),
          },
        ],
        nationalCode: {
          provided: 'Yes',
          value: faker.string.sample(),
        },
        status: 'Complete',
        description: faker.string.sample(),
      },
      wasteQuantity: {
        status: 'Complete',
        value: {
          type: 'ActualData',
          actualData: {
            quantityType: 'Weight',
            unit: 'Kilogram',
            value: faker.number.int(),
          },
          estimateData: {},
        },
      },
      exporterDetail: {
        exporterAddress: {
          country: faker.string.sample(),
          postcode: faker.string.sample(),
          townCity: faker.string.sample(),
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
        },
        status: 'Complete',
        exporterContactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      importerDetail: {
        importerAddressDetails: {
          address: faker.string.sample(),
          country: faker.string.sample(),
          organisationName: faker.string.sample(),
        },
        status: 'Complete',
        importerContactDetails: {
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
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
              address: faker.string.sample(),
              country: faker.string.sample(),
              organisationName: faker.string.sample(),
            },
            contactDetails: {
              emailAddress: faker.string.sample(),
              faxNumber: faker.string.sample(),
              fullName: faker.string.sample(),
              phoneNumber: faker.string.sample(),
            },
            id: faker.string.uuid(),
          },
        ],
      },
      collectionDetail: {
        status: 'Complete',
        address: {
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
          townCity: faker.string.sample(),
          postcode: faker.string.sample(),
          country: faker.string.sample(),
        },
        contactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      ukExitLocation: {
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: faker.string.sample(),
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
              address: faker.string.sample(),
              country: faker.string.sample(),
              name: faker.string.sample(),
            },
            contactDetails: {
              emailAddress: faker.string.sample(),
              faxNumber: faker.string.sample(),
              fullName: faker.string.sample(),
              phoneNumber: faker.string.sample(),
            },
            recoveryFacilityType: {
              type: 'Laboratory',
              disposalCode: 'D1',
            },
            id: faker.string.uuid(),
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
            country: 'England',
            postcode: 'SW1A1AA',
            townCity: faker.string.sample(),
            addressLine1: faker.string.sample(),
            addressLine2: faker.string.sample(),
          },
          status: 'Started',
          exporterContactDetails: {
            organisationName: faker.string.sample(),
            fullName: faker.string.sample(),
            emailAddress: faker.internet.email(),
            phoneNumber: '+447123456789',
          },
        } as DraftExporterDetail,
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
            country: 'England',
            postcode: 'SW1A1AA',
            townCity: faker.string.sample(),
            addressLine1: faker.string.sample(),
            addressLine2: faker.string.sample(),
          },
          status: 'Started',
          exporterContactDetails: {
            organisationName: faker.string.sample(),
            fullName: faker.string.sample(),
            emailAddress: faker.internet.email(),
            phoneNumber: '+447123456789',
          },
        } as DraftExporterDetail,
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

    it('If an invalid collection date is provided, the collection date will be set to "NotStarted" and submission confirmation reset to "CannotStart"', async () => {
      mockValidSubmission.submissionConfirmation = {
        status: 'Complete',
        confirmation: true,
      };

      mockValidSubmission.collectionDate = {
        status: 'Complete',
        value: {
          estimateDate: {
            day: 'test',
            month: '10',
            year: '2020',
          },
          actualDate: {
            day: 'test',
            month: '10',
            year: '2020',
          },
          type: 'ActualDate',
        },
      };

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

      expect(
        subject.getDraftCollectionDate({ id, accountId }),
      ).resolves.toEqual({ success: true, value: { status: 'NotStarted' } });

      expect(
        subject.getDraftSubmissionConfirmation({ id, accountId }),
      ).resolves.toEqual({ success: true, value: { status: 'CannotStart' } });

      expect(response.success).toBe(false);
    });
  });

  describe('setDraftSubmissionDeclaration', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const date = add(new Date(), { weeks: 2 });
    const mockSubmission = {
      id: id,
      reference: 'abc',
      wasteDescription: {
        wasteCode: {
          type: faker.string.sample(),
          code: faker.string.sample(),
        },
        ewcCodes: [
          {
            code: faker.string.sample(),
          },
        ],
        nationalCode: {
          provided: 'Yes',
          value: faker.string.sample(),
        },
        status: 'Complete',
        description: faker.string.sample(),
      },
      wasteQuantity: {
        status: 'Complete',
        value: {
          type: 'ActualData',
          actualData: {
            quantityType: 'Weight',
            unit: 'Kilogram',
            value: faker.number.float(),
          },
          estimateData: {},
        },
      },
      exporterDetail: {
        exporterAddress: {
          country: faker.string.sample(),
          postcode: faker.string.sample(),
          townCity: faker.string.sample(),
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
        },
        status: 'Complete',
        exporterContactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      importerDetail: {
        importerAddressDetails: {
          address: faker.string.sample(),
          country: faker.string.sample(),
          organisationName: faker.string.sample(),
        },
        status: 'Complete',
        importerContactDetails: {
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
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
              address: faker.string.sample(),
              country: faker.string.sample(),
              organisationName: faker.string.sample(),
            },
            contactDetails: {
              emailAddress: faker.string.sample(),
              faxNumber: faker.string.sample(),
              fullName: faker.string.sample(),
              phoneNumber: faker.string.sample(),
            },
            id: faker.string.uuid(),
          },
        ],
      },
      collectionDetail: {
        status: 'Complete',
        address: {
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
          townCity: faker.string.sample(),
          postcode: faker.string.sample(),
          country: faker.string.sample(),
        },
        contactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      ukExitLocation: {
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: faker.string.sample(),
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
              address: faker.string.sample(),
              country: faker.string.sample(),
              name: faker.string.sample(),
            },
            contactDetails: {
              emailAddress: faker.string.sample(),
              faxNumber: faker.string.sample(),
              fullName: faker.string.sample(),
              phoneNumber: faker.string.sample(),
            },
            recoveryFacilityType: {
              type: 'Laboratory',
              disposalCode: 'D1',
            },
            id: faker.string.uuid(),
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

    it('If the status of any of the submission entries is not "Complete", the submission declaration will be reset to "CannotStart"', async () => {
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
            country: 'England',
            postcode: 'SW1A1AA',
            townCity: faker.string.sample(),
            addressLine1: faker.string.sample(),
            addressLine2: faker.string.sample(),
          },
          status: 'Started',
          exporterContactDetails: {
            organisationName: faker.string.sample(),
            fullName: faker.string.sample(),
            emailAddress: faker.internet.email(),
            phoneNumber: '+447123456789',
          },
        } as DraftExporterDetail,
      });

      expect(
        subject.getDraftSubmissionConfirmation({ id, accountId }),
      ).resolves.toEqual({ success: true, value: { status: 'CannotStart' } });
      expect(
        subject.getDraftSubmissionDeclaration({ id, accountId }),
      ).resolves.toEqual({ success: true, value: { status: 'CannotStart' } });
    });

    it('If an invalid collection date is provided, the submission declaration will be reset to "CannotStart" and collectionDate reset to "NotStarted"', async () => {
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

      mockSubmission.collectionDate = {
        status: 'Complete',
        value: {
          estimateDate: {
            day: 'test',
            month: '10',
            year: '2020',
          },
          actualDate: {
            day: 'test',
            month: '10',
            year: '2020',
          },
          type: 'ActualDate',
        },
      };

      mockRepository.getRecord.mockResolvedValue(mockSubmission);

      const response = await subject.setDraftSubmissionDeclaration({
        id,
        accountId,
        value: {
          status: 'Complete',
        },
      });

      expect(mockRepository.saveRecord).toBeCalled();

      expect(
        subject.getDraftCollectionDate({ id, accountId }),
      ).resolves.toEqual({ success: true, value: { status: 'NotStarted' } });

      expect(
        subject.getDraftSubmissionDeclaration({ id, accountId }),
      ).resolves.toEqual({ success: true, value: { status: 'CannotStart' } });

      expect(response.success).toBe(false);
    });

    it('throws an error if the submission declaration is "CannotStart" ', async () => {
      mockSubmission.submissionDeclaration = {
        status: 'CannotStart',
      };

      mockRepository.getRecord.mockResolvedValue(mockSubmission);

      const response = await subject.setDraftSubmissionDeclaration({
        id,
        accountId,
        value: {
          status: 'NotStarted',
        },
      });

      expect(response.success).toBe(false);
    });
  });
});
