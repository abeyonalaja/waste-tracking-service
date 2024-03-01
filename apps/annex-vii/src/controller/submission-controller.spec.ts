import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { expect, jest } from '@jest/globals';
import winston from 'winston';
import SubmissionController from './submission-controller';
import { DaprReferenceDataClient } from '@wts/client/reference-data';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockClient = {
  getWasteCodes: jest.fn<DaprReferenceDataClient['getWasteCodes']>(),
  getEWCCodes: jest.fn<DaprReferenceDataClient['getEWCCodes']>(),
  getCountries: jest.fn<DaprReferenceDataClient['getCountries']>(),
  getRecoveryCodes: jest.fn<DaprReferenceDataClient['getRecoveryCodes']>(),
  getDisposalCodes: jest.fn<DaprReferenceDataClient['getDisposalCodes']>(),
};

describe(SubmissionController, () => {
  const subject = new SubmissionController(
    mockClient as unknown as DaprReferenceDataClient,
    new winston.Logger()
  );

  beforeEach(() => {
    mockClient.getWasteCodes.mockClear();
    mockClient.getEWCCodes.mockClear();
    mockClient.getCountries.mockClear();
    mockClient.getRecoveryCodes.mockClear();
    mockClient.getDisposalCodes.mockClear();
  });

  describe('validateSubmissions', () => {
    it('forwards thrown Boom errors', async () => {
      mockClient.getWasteCodes.mockRejectedValue(Boom.teapot());
      const response = await subject.validateSubmissions({
        accountId: faker.datatype.uuid(),
        values: [
          {
            reference: 'testRef',
            baselAnnexIXCode: '',
            oecdCode: '',
            annexIIIACode: 'B1010;B1050',
            annexIIIBCode: '',
            laboratory: '',
            ewcCodes: '010101;010102',
            nationalCode: '',
            wasteDescription: 'test',
            wasteQuantityTonnes: '2',
            wasteQuantityCubicMetres: '',
            wasteQuantityKilograms: '',
            estimatedOrActualWasteQuantity: 'Actual',
          },
        ],
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockClient.getWasteCodes).toBeCalled();
      expect(response.error.statusCode).toBe(500);
    });

    it('passes submission validation', async () => {
      const accountId = faker.datatype.uuid();

      mockClient.getWasteCodes.mockResolvedValueOnce({
        success: true,
        value: [
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
            ],
          },
        ],
      });
      mockClient.getEWCCodes.mockResolvedValueOnce({
        success: true,
        value: [
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
        ],
      });
      mockClient.getCountries.mockResolvedValueOnce({
        success: true,
        value: [
          {
            name: 'Afghanistan [AF]',
          },
        ],
      });
      mockClient.getRecoveryCodes.mockResolvedValueOnce({
        success: true,
        value: [
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
        ],
      });
      mockClient.getDisposalCodes.mockResolvedValueOnce({
        success: true,
        value: [
          {
            code: 'D1',
            value: {
              description: {
                en: 'English Description',
                cy: 'Welsh Description',
              },
            },
          },
        ],
      });

      const response = await subject.validateSubmissions({
        accountId: accountId,
        values: [
          {
            reference: 'testRef',
            baselAnnexIXCode: '',
            oecdCode: '',
            annexIIIACode: 'B1010;B1050',
            annexIIIBCode: '',
            laboratory: '',
            ewcCodes: '010101;010102',
            nationalCode: '',
            wasteDescription: 'test',
            wasteQuantityTonnes: '2',
            wasteQuantityCubicMetres: '',
            wasteQuantityKilograms: '',
            estimatedOrActualWasteQuantity: 'Actual',
          },
        ],
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockClient.getWasteCodes).toBeCalled();
      expect(mockClient.getEWCCodes).toBeCalled();
      expect(mockClient.getCountries).toBeCalled();
      expect(mockClient.getRecoveryCodes).toBeCalled();
      expect(mockClient.getDisposalCodes).toBeCalled();

      expect(response.value).toEqual({
        valid: true,
        accountId: accountId,
        values: [
          {
            reference: 'testRef',
            wasteDescription: {
              wasteCode: {
                type: 'AnnexIIIA',
                code: 'B1010 and B1050',
              },
              ewcCodes: [
                {
                  code: '010101',
                },
                {
                  code: '010102',
                },
              ],
              nationalCode: {
                provided: 'No',
              },
              description: 'test',
            },
            wasteQuantity: {
              type: 'ActualData',
              estimateData: {},
              actualData: {
                quantityType: 'Weight',
                unit: 'Tonne',
                value: 2,
              },
            },
          },
        ],
      });
    });

    it('fails submission validation on all sections', async () => {
      const accountId = faker.datatype.uuid();

      mockClient.getWasteCodes.mockResolvedValueOnce({
        success: true,
        value: [
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
            ],
          },
        ],
      });
      mockClient.getEWCCodes.mockResolvedValueOnce({
        success: true,
        value: [
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
        ],
      });
      mockClient.getCountries.mockResolvedValueOnce({
        success: true,
        value: [
          {
            name: 'Afghanistan [AF]',
          },
        ],
      });
      mockClient.getRecoveryCodes.mockResolvedValueOnce({
        success: true,
        value: [
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
        ],
      });
      mockClient.getDisposalCodes.mockResolvedValueOnce({
        success: true,
        value: [
          {
            code: 'D1',
            value: {
              description: {
                en: 'English Description',
                cy: 'Welsh Description',
              },
            },
          },
        ],
      });

      const response = await subject.validateSubmissions({
        accountId: accountId,
        values: [
          {
            reference: 'test-Ref',
            baselAnnexIXCode: '',
            oecdCode: '',
            annexIIIACode: 'B1010;B1050;B9999',
            annexIIIBCode: '',
            laboratory: '',
            ewcCodes: '010101;010102;999999',
            nationalCode: '',
            wasteDescription: '*test*',
            wasteQuantityTonnes: '',
            wasteQuantityCubicMetres: '',
            wasteQuantityKilograms: '2',
            estimatedOrActualWasteQuantity: 'Actuals',
          },
        ],
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockClient.getWasteCodes).toBeCalled();
      expect(mockClient.getEWCCodes).toBeCalled();
      expect(mockClient.getCountries).toBeCalled();
      expect(mockClient.getRecoveryCodes).toBeCalled();
      expect(mockClient.getDisposalCodes).toBeCalled();

      expect(response.value).toEqual({
        valid: false,
        accountId: accountId,
        values: [
          {
            index: 1,
            fieldFormatErrors: [
              {
                field: 'CustomerReference',
                message:
                  'The reference must only include letters a to z, and numbers',
              },
              {
                field: 'WasteDescription',
                message: 'Enter Annex IIIA code in correct format',
              },
              {
                field: 'WasteQuantity',
                message: "Enter either 'estimate' or 'actual'",
              },
            ],
            invalidStructureErrors: [],
          },
        ],
      });
    });

    it('fails submission validation on cross sections', async () => {
      const accountId = faker.datatype.uuid();

      mockClient.getWasteCodes.mockResolvedValueOnce({
        success: true,
        value: [
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
            ],
          },
        ],
      });
      mockClient.getEWCCodes.mockResolvedValueOnce({
        success: true,
        value: [
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
        ],
      });
      mockClient.getCountries.mockResolvedValueOnce({
        success: true,
        value: [
          {
            name: 'Afghanistan [AF]',
          },
        ],
      });
      mockClient.getRecoveryCodes.mockResolvedValueOnce({
        success: true,
        value: [
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
        ],
      });
      mockClient.getDisposalCodes.mockResolvedValueOnce({
        success: true,
        value: [
          {
            code: 'D1',
            value: {
              description: {
                en: 'English Description',
                cy: 'Welsh Description',
              },
            },
          },
        ],
      });

      const response = await subject.validateSubmissions({
        accountId: accountId,
        values: [
          {
            reference: 'test-Ref',
            baselAnnexIXCode: '',
            oecdCode: '',
            annexIIIACode: 'B1010;B1050',
            annexIIIBCode: '',
            laboratory: '',
            ewcCodes: '010101;010102',
            nationalCode: '',
            wasteDescription: 'test',
            wasteQuantityTonnes: '',
            wasteQuantityCubicMetres: '',
            wasteQuantityKilograms: '2',
            estimatedOrActualWasteQuantity: 'Actual',
          },
        ],
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockClient.getWasteCodes).toBeCalled();
      expect(mockClient.getEWCCodes).toBeCalled();
      expect(mockClient.getCountries).toBeCalled();
      expect(mockClient.getRecoveryCodes).toBeCalled();
      expect(mockClient.getDisposalCodes).toBeCalled();

      expect(response.value).toEqual({
        valid: false,
        accountId: accountId,
        values: [
          {
            index: 1,
            fieldFormatErrors: [
              {
                field: 'CustomerReference',
                message:
                  'The reference must only include letters a to z, and numbers',
              },
            ],
            invalidStructureErrors: [
              {
                fields: ['WasteDescription', 'WasteQuantity'],
                message:
                  "Only enter an amount in this cell if you have entered 'Y' in column G for sending waste to a laboratory",
              },
            ],
          },
        ],
      });
    });
  });
});
