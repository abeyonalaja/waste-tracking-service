import { expect, jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import winston from 'winston';
import Boom from '@hapi/boom';
import { BatchController } from './batch-controller';
import { BulkSubmission } from '../model';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockRepository = {
  saveBatch:
    jest.fn<(value: BulkSubmission, accountId: string) => Promise<void>>(),
  getBatch:
    jest.fn<(id: string, accountId: string) => Promise<BulkSubmission>>(),
};

describe(BatchController, () => {
  const subject = new BatchController(mockRepository, new winston.Logger());

  beforeEach(() => {
    mockRepository.saveBatch.mockClear();
    mockRepository.getBatch.mockClear();
  });

  describe('getBatch', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      mockRepository.getBatch.mockRejectedValue(Boom.teapot());

      const response = await subject.getBatch({ id, accountId });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getBatch).toBeCalledWith(id, accountId);
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns value from the repository', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      const value: BulkSubmission = {
        id,
        state: {
          status: 'Processing',
          timestamp: new Date(),
        },
      };

      mockRepository.getBatch.mockResolvedValue(value);

      const response = await subject.getBatch({ id, accountId });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getBatch).toHaveBeenCalledWith(id, accountId);
      expect(response.value).toEqual(value);
    });
  });

  describe('finalizeBatch', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();

      mockRepository.getBatch.mockRejectedValue(Boom.teapot());

      let response = await subject.finalizeBatch({ id, accountId });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getBatch).toBeCalled();
      expect(mockRepository.saveBatch).toBeCalledTimes(0);
      expect(response.error.statusCode).toBe(418);

      const value: BulkSubmission = {
        id,
        state: {
          status: 'FailedValidation',
          timestamp: new Date(),
          rowErrors: [
            {
              errorAmount: 3,
              rowNumber: 1,
              errorDetails: ['error1', 'error2'],
            },
          ],
          columnErrors: [
            {
              columnName: 'column1',
              errorAmount: 3,
              errorDetails: [
                {
                  errorReason: 'error1',
                  rowNumber: 1,
                },
              ],
            },
          ],
        },
      };
      mockRepository.getBatch.mockResolvedValue(value);

      response = await subject.finalizeBatch({ id, accountId });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getBatch).toBeCalled();
      expect(mockRepository.saveBatch).toBeCalledTimes(0);
      expect(response.error.statusCode).toBe(400);
    });

    it('Successfully updates value in the repository', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();

      const value: BulkSubmission = {
        id,
        state: {
          status: 'PassedValidation',
          timestamp: new Date(),
          hasEstimates: true,
          submissions: [
            {
              producer: {
                reference: 'ref1',
                sicCode: '1010101',
                contact: {
                  email: 'example@email.com',
                  name: 'John Doe',
                  organisationName: 'Example Ltd',
                  phone: '0044140000000',
                },
                address: {
                  addressLine1: '123 Fake Street',
                  addressLine2: 'Apt 10',
                  country: 'England',
                  townCity: 'London',
                  postcode: 'FA1 2KE',
                },
              },
              receiver: {
                authorizationType: 'permit',
                environmentalPermitNumber: '1010101',
                contact: {
                  email: 'example@email.com',
                  name: 'John Doe',
                  organisationName: 'Example Ltd',
                  phone: '0044140000000',
                },
                address: {
                  addressLine1: '123 Fake Street',
                  addressLine2: 'Apt 10',
                  country: 'England',
                  townCity: 'London',
                  postcode: 'FA1 2KE',
                },
              },
              wasteCollection: {
                address: {
                  addressLine1: '123 Real Street',
                  addressLine2: 'Real Avenue',
                  country: 'England',
                  postcode: 'SW1A 1AA',
                  townCity: 'London',
                },
                brokerRegistrationNumber: 'CBDL349812',
                carrierRegistrationNumber: 'CBDL349812',
                expectedWasteCollectionDate: {
                  day: '01',
                  month: '01',
                  year: '2028',
                },
                modeOfWasteTransport: 'Rail',
                wasteSource: 'LocalAuthority',
              },
              wasteTransportation: {
                numberAndTypeOfContainers: '10x20ft',
                specialHandlingRequirements: 'Special handling requirements',
              },
              wasteType: [
                {
                  containsPops: false,
                  ewcCode: '01 03 04',
                  hasHazardousProperties: false,
                  physicalForm: 'Solid',
                  quantityUnit: 'Tonne',
                  wasteDescription: 'Waste description',
                  wasteQuantity: 100,
                  wasteQuantityType: 'ActualData',
                  chemicalAndBiologicalComponents: [
                    {
                      concentration: 10,
                      name: 'Component name',
                      concentrationUnit: 'Percentage',
                    },
                  ],
                },
              ],
            },
          ],
        },
      };
      mockRepository.getBatch.mockResolvedValue(value);

      const response = await subject.finalizeBatch({
        id,
        accountId,
      });

      expect(response.success).toBe(true);
      expect(mockRepository.getBatch).toBeCalled();
      expect(mockRepository.saveBatch).toBeCalled();

      if (!response.success) {
        return;
      }

      expect(response.value).toBe(undefined);
    });
  });

  describe('addContentToBatch', () => {
    it('forwards thrown Boom errors', async () => {
      mockRepository.saveBatch.mockRejectedValue(Boom.teapot());
      const response = await subject.addContentToBatch({
        accountId: faker.datatype.uuid(),
        content: {
          type: 'text/csv',
          compression: 'Snappy',
          value: faker.datatype.string(),
        },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.saveBatch).toBeCalled();
      expect(response.error.statusCode).toBe(418);
    });
  });
});
