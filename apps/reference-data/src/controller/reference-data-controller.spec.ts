import { expect, jest } from '@jest/globals';
import winston from 'winston';
import ReferenceDataController from './reference-data-controller';
import { ReferenceDataRepository } from '../data/repository';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockRepository = {
  getList: jest.fn<ReferenceDataRepository['getList']>(),
  saveList: jest.fn<ReferenceDataRepository['saveList']>(),
};

describe(ReferenceDataController, () => {
  const subject = new ReferenceDataController(
    mockRepository as unknown as ReferenceDataRepository,
    new winston.Logger()
  );

  beforeEach(() => {
    mockRepository.getList.mockClear();
    mockRepository.saveList.mockClear();
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

      mockRepository.getList.mockResolvedValueOnce(value);

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

      mockRepository.getList.mockResolvedValueOnce(value);

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

      mockRepository.getList.mockResolvedValueOnce(value);

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

      mockRepository.getList.mockResolvedValueOnce(value);

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

      mockRepository.getList.mockResolvedValueOnce(value);

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

      expect(mockRepository.saveList).toBeCalledWith('waste-codes', value);
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

      expect(mockRepository.saveList).toBeCalledWith('ewc-codes', value);
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

      expect(mockRepository.saveList).toBeCalledWith('countries', value);
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

      expect(mockRepository.saveList).toBeCalledWith('recovery-codes', value);
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

      expect(mockRepository.saveList).toBeCalledWith('disposal-codes', value);
    });
  });
});
