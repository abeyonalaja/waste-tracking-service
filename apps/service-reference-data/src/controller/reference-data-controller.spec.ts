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
      const valueWithHazardous = [
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
          code: '020202*',
          value: {
            description: {
              en: 'Hazardous English Description',
              cy: 'Hazardous Welsh Description',
            },
          },
        },
      ];

      const valueWithoutHazardous = [
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

      mockRepository.getList.mockResolvedValueOnce(valueWithHazardous);

      let response = await subject.getEWCCodes({ includeHazardous: true });

      expect(response.success).toBe(true);
      if (!response.success) {
        throw new Error('Expected success to be true');
      }

      expect(response.value.length).toEqual(2);

      expect(response.value[0].code).toEqual('010101');
      expect(response.value[1].code).toEqual('020202*');

      mockRepository.getList.mockResolvedValueOnce(valueWithoutHazardous);

      response = await subject.getEWCCodes({ includeHazardous: false });

      expect(response.success).toBe(true);
      if (!response.success) {
        throw new Error('Expected success to be true');
      }

      expect(response.value.length).toEqual(1);

      expect(response.value[0].code).toEqual('010101');
    });

    it('listCountries', async () => {
      const valueWithUK = [
        {
          name: 'Afghanistan [AF]',
        },
        {
          name: 'United Kingdom (England) [GB-ENG]',
        },
      ];

      const valueWithoutUK = [
        {
          name: 'Afghanistan [AF]',
        },
      ];

      mockRepository.getList.mockResolvedValueOnce(valueWithUK);

      let response = await subject.getCountries({ includeUk: true });

      expect(response.success).toBe(true);
      if (!response.success) {
        throw new Error('Expected success to be true');
      }

      expect(response.value.length).toEqual(2);

      expect(response.value[0].name).toEqual('Afghanistan [AF]');
      expect(response.value[1].name).toEqual(
        'United Kingdom (England) [GB-ENG]'
      );

      mockRepository.getList.mockResolvedValueOnce(valueWithoutUK);

      response = await subject.getCountries({ includeUk: false });

      expect(response.success).toBe(true);
      if (!response.success) {
        throw new Error('Expected success to be true');
      }

      expect(response.value.length).toEqual(1);

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

    it('listHazardousCodes', async () => {
      const value = [
        {
          code: 'HP1',
          value: {
            description: {
              en: 'English Description',
              cy: 'Welsh Description',
            },
          },
        },
      ];

      mockRepository.getList.mockResolvedValueOnce(value);

      const response = await subject.getHazardousCodes(null);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(response.value[0].code).toEqual('HP1');
    });

    it('listPops', async () => {
      const value = [
        {
          name: {
            en: 'Endosulfan',
            cy: 'Endosulfan',
          },
        },
      ];

      mockRepository.getList.mockResolvedValueOnce(value);

      const response = await subject.getPops(null);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(response.value[0].name.en).toEqual('Endosulfan');
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

    it('createHazardousCodes', async () => {
      const value = [
        {
          code: 'HP1',
          value: {
            description: {
              en: 'English Description',
              cy: 'Welsh Description',
            },
          },
        },
      ];

      const response = await subject.createHazardousCodes(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.saveList).toBeCalledWith('hazardous-codes', value);
    });

    it('createPops', async () => {
      const value = [
        {
          name: {
            en: 'Endosulfan',
            cy: 'Endosulfan',
          },
        },
      ];

      const response = await subject.createPops(value);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.saveList).toBeCalledWith('pops', value);
    });
  });
});
