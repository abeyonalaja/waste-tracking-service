import { expect, jest } from '@jest/globals';
import winston from 'winston';
import { WasteCodeType, WasteCode, Country, RecoveryCode } from '../model';
import ReferenceDataController from './reference-data-controller';
import { DaprClient } from '@dapr/dapr';
import {
  CreateWasteCodesRequest,
  CreateWasteCodesResponse,
  UpdateWasteCodesRequest,
  UpdateWasteCodesResponse,
  CreateWasteCodeRequest,
  CreateWasteCodeResponse,
  UpdateWasteCodeRequest,
  UpdateWasteCodeResponse,
  DeleteWasteCodeRequest,
  DeleteWasteCodeResponse,
  CreateEWCCodesRequest,
  CreateEWCCodesResponse,
  UpdateEWCCodesRequest,
  UpdateEWCCodesResponse,
  CreateEWCCodeRequest,
  CreateEWCCodeResponse,
  UpdateEWCCodeRequest,
  UpdateEWCCodeResponse,
  DeleteEWCCodeRequest,
  DeleteEWCCodeResponse,
  CreateCountriesRequest,
  CreateCountriesResponse,
  updateCountries,
  UpdateCountriesRequest,
  UpdateCountriesResponse,
  deleteCountries,
  createRecoveryCodes,
  CreateRecoveryCodesRequest,
  CreateRecoveryCodesResponse,
  updateRecoveryCodes,
  UpdateRecoveryCodesRequest,
  UpdateRecoveryCodesResponse,
  deleteRecoveryCodes,
  createRecoveryCode,
  CreateRecoveryCodeRequest,
  CreateRecoveryCodeResponse,
  updateRecoveryCode,
  UpdateRecoveryCodeRequest,
  UpdateRecoveryCodeResponse,
  deleteRecoveryCode,
  DeleteRecoveryCodeRequest,
  DeleteRecoveryCodeResponse,
  createDisposalCodes,
  CreateDisposalCodesRequest,
  CreateDisposalCodesResponse,
  updateDisposalCodes,
  UpdateDisposalCodesRequest,
  UpdateDisposalCodesResponse,
  deleteDisposalCodes,
  createDisposalCode,
  CreateDisposalCodeRequest,
  CreateDisposalCodeResponse,
  updateDisposalCode,
  UpdateDisposalCodeRequest,
  UpdateDisposalCodeResponse,
  deleteDisposalCode,
  DeleteDisposalCodeRequest,
  DeleteDisposalCodeResponse,
} from '@wts/api/reference-data';

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
  listWasteCodes: jest.fn<() => Promise<WasteCodeType[]>>(),
  listEWCCodes: jest.fn<() => Promise<WasteCode[]>>(),
  listCountries: jest.fn<() => Promise<Country[]>>(),
  listRecoveryCodes: jest.fn<() => Promise<RecoveryCode[]>>(),
  listDisposalCodes: jest.fn<() => Promise<WasteCode[]>>(),
  createWasteCodes:
    jest.fn<
      (
        createWasteCodesRequest: CreateWasteCodesRequest
      ) => Promise<CreateWasteCodesResponse>
    >(),
  updateWasteCodes:
    jest.fn<
      (
        updateWasteCodesRequest: UpdateWasteCodesRequest
      ) => Promise<UpdateWasteCodesResponse>
    >(),
  deleteWasteCodes: jest.fn<() => Promise<void>>(),
  createWasteCode:
    jest.fn<
      (
        createWasteCodeRequest: CreateWasteCodeRequest
      ) => Promise<CreateWasteCodeResponse>
    >(),
  updateWasteCode:
    jest.fn<
      (
        updateWasteCodeRequest: UpdateWasteCodeRequest
      ) => Promise<UpdateWasteCodeResponse>
    >(),
  deleteWasteCode:
    jest.fn<
      (
        deleteWasteCodeRequest: DeleteWasteCodeRequest
      ) => Promise<DeleteWasteCodeResponse>
    >(),
  createEWCCodes:
    jest.fn<
      (
        createEWCCodesRequest: CreateEWCCodesRequest
      ) => Promise<CreateEWCCodesResponse>
    >(),
  updateEWCCodes:
    jest.fn<
      (
        updateEWCCodesRequest: UpdateEWCCodesRequest
      ) => Promise<UpdateEWCCodesResponse>
    >(),
  deleteEWCCodes: jest.fn<() => Promise<void>>(),
  createEWCCode:
    jest.fn<
      (
        createEWCCodeRequest: CreateEWCCodeRequest
      ) => Promise<CreateEWCCodeResponse>
    >(),
  updateEWCCode:
    jest.fn<
      (
        updateEWCCodeRequest: UpdateEWCCodeRequest
      ) => Promise<UpdateEWCCodeResponse>
    >(),
  deleteEWCCode:
    jest.fn<
      (
        deleteEWCCodeRequest: DeleteEWCCodeRequest
      ) => Promise<DeleteEWCCodeResponse>
    >(),
  createCountries:
    jest.fn<
      (
        createCountriesRequest: CreateCountriesRequest
      ) => Promise<CreateCountriesResponse>
    >(),
  updateCountries:
    jest.fn<
      (
        updateCountriesRequest: UpdateCountriesRequest
      ) => Promise<UpdateCountriesResponse>
    >(),
  deleteCountries: jest.fn<() => Promise<void>>(),
  createRecoveryCodes:
    jest.fn<
      (
        createRecoveryCodesRequest: CreateRecoveryCodesRequest
      ) => Promise<CreateRecoveryCodesResponse>
    >(),
  updateRecoveryCodes:
    jest.fn<
      (
        updateRecoveryCodesRequest: UpdateRecoveryCodesRequest
      ) => Promise<UpdateRecoveryCodesResponse>
    >(),
  deleteRecoveryCodes: jest.fn<() => Promise<void>>(),
  createRecoveryCode:
    jest.fn<
      (
        createRecoveryCodeRequest: CreateRecoveryCodeRequest
      ) => Promise<CreateRecoveryCodeResponse>
    >(),
  updateRecoveryCode:
    jest.fn<
      (
        updateRecoveryCodeRequest: UpdateRecoveryCodeRequest
      ) => Promise<UpdateRecoveryCodeResponse>
    >(),
  deleteRecoveryCode:
    jest.fn<
      (
        deleteRecoveryCodeRequest: DeleteRecoveryCodeRequest
      ) => Promise<DeleteRecoveryCodeResponse>
    >(),
  createDisposalCodes:
    jest.fn<
      (
        createDisposalCodesRequest: CreateDisposalCodesRequest
      ) => Promise<CreateDisposalCodesResponse>
    >(),
  updateDisposalCodes:
    jest.fn<
      (
        updateDisposalCodesRequest: UpdateDisposalCodesRequest
      ) => Promise<UpdateDisposalCodesResponse>
    >(),
  deleteDisposalCodes: jest.fn<() => Promise<void>>(),
  createDisposalCode:
    jest.fn<
      (
        createDisposalCodeRequest: CreateDisposalCodeRequest
      ) => Promise<CreateDisposalCodeResponse>
    >(),
  updateDisposalCode:
    jest.fn<
      (
        updateDisposalCodeRequest: UpdateDisposalCodeRequest
      ) => Promise<UpdateDisposalCodeResponse>
    >(),
  deleteDisposalCode:
    jest.fn<
      (
        deleteDisposalCodeRequest: DeleteDisposalCodeRequest
      ) => Promise<DeleteDisposalCodeResponse>
    >(),
};

describe(ReferenceDataController, () => {
  const subject = new ReferenceDataController(
    mockRepository,
    new winston.Logger()
  );

  beforeEach(() => {
    mockRepository.listWasteCodes.mockClear();
    mockRepository.listEWCCodes.mockClear();
    mockRepository.listCountries.mockClear();
    mockRepository.listRecoveryCodes.mockClear();
    mockRepository.listDisposalCodes.mockClear();
  });

  describe('List Codes', () => {
    it('listWasteCodes', async () => {
      const value = [
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
      ];

      mockRepository.listWasteCodes.mockResolvedValue(value);

      const response = await subject.getWasteCodes(null);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(response.value[0].type).toEqual('BaselAnnexIX');
    });

    it('listEWCCodes', async () => {
      const value = [
        {
          code: '010101',
          value: {
            description: {
              en: 'English Description',
              cy: 'Welsh Description',
            },
          },
        },
      ];

      mockRepository.listEWCCodes.mockResolvedValue(value);

      const response = await subject.getEWCCodes(null);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(response.value[0].code).toEqual('010101');
    });

    it('listCountries', async () => {
      const value = [
        {
          name: 'Afghanistan [AF]',
        },
      ];

      mockRepository.listCountries.mockResolvedValue(value);

      const response = await subject.getCountries(null);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(response.value[0].name).toEqual('Afghanistan [AF]');
    });

    it('listRecoveryCodes', async () => {
      const value = [
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
      ];

      mockRepository.listRecoveryCodes.mockResolvedValue(value);

      const response = await subject.getRecoveryCodes(null);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(response.value[0].code).toEqual('R1');
      expect(response.value[0].value.interim).toEqual(false);
    });

    it('listDisposalCodes', async () => {
      const value = [
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

      mockRepository.listDisposalCodes.mockResolvedValue(value);

      const response = await subject.getDisposalCodes(null);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(response.value[0].code).toEqual('D1');
    });
  });

  describe('Create Codes', () => {
    it('createWasteCodes', async () => {
      const value = [
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
      ];

      const response = await subject.createWasteCodes(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.createWasteCodes).toBeCalledWith(value);
    });

    it('createEWCCodes', async () => {
      const value = [
        {
          code: '010101',
          value: {
            description: {
              en: 'English Description',
              cy: 'Welsh Description',
            },
          },
        },
      ];

      const response = await subject.createEWCCodes(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.createEWCCodes).toBeCalledWith(value);
    });

    it('createCountries', async () => {
      const value = [
        {
          name: 'Afghanistan [AF]',
        },
      ];

      const response = await subject.createCountries(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.createCountries).toBeCalledWith(value);
    });

    it('createRecoveryCodes', async () => {
      const value = [
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
      ];

      const response = await subject.createRecoveryCodes(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.createRecoveryCodes).toBeCalledWith(value);
    });

    it('createDisposalCodes', async () => {
      const value = [
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

      const response = await subject.createDisposalCodes(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.createDisposalCodes).toBeCalledWith(value);
    });
  });

  describe('Update Codes', () => {
    it('updateWasteCodes', async () => {
      const value = [
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
      ];

      const response = await subject.updateWasteCodes(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.updateWasteCodes).toBeCalledWith(value);
    });

    it('updateEWCCodes', async () => {
      const value = [
        {
          code: '010101',
          value: {
            description: {
              en: 'English Description',
              cy: 'Welsh Description',
            },
          },
        },
      ];

      const response = await subject.updateEWCCodes(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.updateEWCCodes).toBeCalledWith(value);
    });

    it('updateCountries', async () => {
      const value = [
        {
          name: 'Afghanistan [AF]',
        },
      ];

      const response = await subject.updateCountries(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.updateCountries).toBeCalledWith(value);
    });

    it('updateRecoveryCodes', async () => {
      const value = [
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
      ];

      const response = await subject.updateRecoveryCodes(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.updateRecoveryCodes).toBeCalledWith(value);
    });

    it('updateDisposalCodes', async () => {
      const value = [
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

      const response = await subject.updateDisposalCodes(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.updateDisposalCodes).toBeCalledWith(value);
    });
  });

  describe('Delete Codes', () => {
    it('deleteWasteCodes', async () => {
      const response = await subject.deleteWasteCodes(null);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.deleteWasteCodes).toBeCalledWith();
    });

    it('deleteEWCCodes', async () => {
      const response = await subject.deleteEWCCodes(null);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.deleteEWCCodes).toBeCalledWith();
    });

    it('deleteCountries', async () => {
      const response = await subject.deleteCountries(null);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.deleteCountries).toBeCalledWith();
    });

    it('deleteRecoveryCodes', async () => {
      const response = await subject.deleteRecoveryCodes(null);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.deleteRecoveryCodes).toBeCalledWith();
    });

    it('deleteDisposalCodes', async () => {
      const response = await subject.deleteDisposalCodes(null);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.deleteDisposalCodes).toBeCalledWith();
    });
  });

  describe('Create Individual Codes', () => {
    it('createWasteCode', async () => {
      const value = {
        type: 'BaselAnnexIX',
        code: 'B1010',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      };

      const response = await subject.createWasteCode(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.createWasteCode).toBeCalledWith(value);
    });

    it('createEWCCode', async () => {
      const value = {
        code: '010101',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      };

      const response = await subject.createEWCCode(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.createEWCCode).toBeCalledWith(value);
    });

    it('createRecoveryCode', async () => {
      const value = {
        code: 'R1',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
          interim: false,
        },
      };

      const response = await subject.createRecoveryCode(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.createRecoveryCode).toBeCalledWith(value);
    });

    it('createDisposalCode', async () => {
      const value = {
        code: 'D1',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      };

      const response = await subject.createDisposalCode(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.createDisposalCode).toBeCalledWith(value);
    });
  });

  describe('Update Individual Codes', () => {
    it('updateWasteCode', async () => {
      const value = {
        type: 'BaselAnnexIX',
        code: 'B1010',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      };

      const response = await subject.updateWasteCode(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.updateWasteCode).toBeCalledWith(value);
    });

    it('updateEWCCode', async () => {
      const value = {
        code: '010101',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      };

      const response = await subject.updateEWCCode(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.updateEWCCode).toBeCalledWith(value);
    });

    it('updateRecoveryCode', async () => {
      const value = {
        code: 'R1',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
          interim: false,
        },
      };

      const response = await subject.updateRecoveryCode(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.updateRecoveryCode).toBeCalledWith(value);
    });

    it('updateDisposalCode', async () => {
      const value = {
        code: 'D1',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      };

      const response = await subject.updateDisposalCode(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.updateDisposalCode).toBeCalledWith(value);
    });
  });

  describe('Delete Individual Codes', () => {
    it('deleteWasteCode', async () => {
      const value = {
        type: 'BaselAnnexIX',
        code: 'B1010',
      };

      const response = await subject.deleteDisposalCode(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.deleteDisposalCode).toBeCalledWith(value);
    });

    it('deleteEWCCode', async () => {
      const value = { code: '010101' };

      const response = await subject.deleteEWCCode(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.deleteEWCCode).toBeCalledWith(value);
    });

    it('deleteRecoveryCode', async () => {
      const value = { code: 'R1' };

      const response = await subject.deleteRecoveryCode(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.deleteRecoveryCode).toBeCalledWith(value);
    });

    it('deleteDisposalCode', async () => {
      const value = { code: 'D1' };

      const response = await subject.deleteDisposalCode(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.deleteDisposalCode).toBeCalledWith(value);
    });
  });
});
