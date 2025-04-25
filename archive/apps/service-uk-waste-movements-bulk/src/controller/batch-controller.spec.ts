import { expect, jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import winston from 'winston';
import Boom from '@hapi/boom';
import { BatchController } from './batch-controller';
import {
  BulkSubmission,
  ErrorColumn,
  PagedSubmissionData,
  Row,
  SubmissionFlattenedDownload,
} from '../model';
import { Field, validation } from '@wts/api/uk-waste-movements';

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
  downloadProducerCsv:
    jest.fn<
      (id: string, accountId: string) => Promise<SubmissionFlattenedDownload[]>
    >(),
  getBatchRows:
    jest.fn<(batchId: string, accountId: string) => Promise<Row[]>>(),
  saveRows:
    jest.fn<
      (rows: Row[], accountId: string, batchId: string) => Promise<void>
    >(),
  saveColumns:
    jest.fn<
      (
        columns: ErrorColumn[],
        accountId: string,
        batchId: string,
      ) => Promise<void>
    >(),
  getRow:
    jest.fn<
      (accountId: string, batchId: string, rowId: string) => Promise<Row>
    >(),
  getColumn:
    jest.fn<
      (
        accountId: string,
        batchId: string,
        columnRef: string,
      ) => Promise<ErrorColumn>
    >(),
  getBulkSubmissions:
    jest.fn<
      (
        batchId: string,
        accountId: string,
        page: number,
        pageSize: number,
        collectionDate?: Date,
        ewcCode?: string,
        producerName?: string,
        wasteMovementId?: string,
      ) => Promise<PagedSubmissionData>
    >(),
};

describe(BatchController, () => {
  const subject = new BatchController(mockRepository, new winston.Logger());

  beforeEach(() => {
    mockRepository.saveBatch.mockClear();
    mockRepository.getBatch.mockClear();
  });

  describe('getBatch', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
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
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
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

  describe('downloadProducerCsv', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.downloadProducerCsv.mockRejectedValue(Boom.teapot());

      const response = await subject.downloadProducerCsv({ id, accountId });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.downloadProducerCsv).toBeCalledWith(id, accountId);
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns base64 formatted csv data of the record', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const value: SubmissionFlattenedDownload[] = [
        {
          producerAddressLine1: '110 Bishopsgate',
          producerAddressLine2: 'Mulberry street',
          producerContactEmail: 'guy@test.com',
          producerContactName: 'Pro Name',
          producerContactPhone: '00447811111213',
          producerCountry: 'Wales',
          producerOrganisationName: 'Producer org name',
          producerPostcode: 'CV12RD',
          producerSicCode: '208016',
          producerTownCity: 'London',
          wasteCollectionAddressLine1: '110 Bishopsgate',
          wasteCollectionAddressLine2: 'Mulberry street',
          wasteCollectionTownCity: 'London',
          wasteCollectionCountry: 'Scotland',
          wasteCollectionPostcode: '',
          wasteCollectionLocalAuthority: 'Hartlepool',
          wasteCollectionWasteSource: 'Household',
          wasteCollectionBrokerRegistrationNumber: 'CBDL5221',
          wasteCollectionCarrierRegistrationNumber: 'CBDL5221',
          wasteCollectionExpectedWasteCollectionDate: '18/02/2066',
          carrierOrganisationName: 'Producer org name',
          carrierAddressLine1: '110 Bishopsgate',
          carrierAddressLine2: 'Mulberry street',
          carrierTownCity: 'London',
          carrierCountry: 'Wales',
          carrierPostcode: 'CV12RD',
          carrierContactName: 'Pro Name',
          carrierContactEmail: 'guy@test.com',
          carrierContactPhone: "'00447811111213''",
          receiverAuthorizationType: 'Permit DEFRA',
          receiverEnvironmentalPermitNumber: 'DEFRA 1235',
          receiverOrganisationName: "Mac Donald 's",
          receiverAddressLine1: '12 Mulberry Street',
          receiverAddressLine2: 'West coast, Northwest',
          receiverTownCity: 'West coast',
          receiverCountry: 'Wales',
          receiverPostcode: 'DA112AB',
          receiverContactName: 'Mr. Smith Jones',
          receiverContactEmail: 'smithjones@hotmail.com',
          receiverContactPhone: "'07811111111'",
          wasteTransportationNumberAndTypeOfContainers: '123456',
          wasteTransportationSpecialHandlingRequirements: '',
          firstWasteTypeEwcCode: "'010101'",
          firstWasteTypeWasteDescription:
            'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
          firstWasteTypePhysicalForm: 'Gas',
          firstWasteTypeWasteQuantity: '1.1',
          firstWasteTypeWasteQuantityUnit: 'Tonne',
          firstWasteTypeWasteQuantityType: 'ActualData',
          firstWasteTypeChemicalAndBiologicalComponentsString:
            'Chlorinated solvents',
          firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            '20.35',
          firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            'mg/kg',
          firstWasteTypeHasHazardousProperties: 'true',
          firstWasteTypeHazardousWasteCodesString: 'HP1',
          firstWasteTypeContainsPops: 'true',
          firstWasteTypePopsString: 'Endosulfan',
          firstWasteTypePopsConcentrationsString: '9823.75',
          firstWasteTypePopsConcentrationUnitsString: 'mg/k',
          secondWasteTypeEwcCode: '',
          secondWasteTypeWasteDescription: '',
          secondWasteTypePhysicalForm: '',
          secondWasteTypeWasteQuantity: '',
          secondWasteTypeWasteQuantityUnit: '',
          secondWasteTypeWasteQuantityType: '',
          secondWasteTypeChemicalAndBiologicalComponentsString: '',
          secondWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            '',
          secondWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            '',
          secondWasteTypeHasHazardousProperties: '',
          secondWasteTypeHazardousWasteCodesString: '',
          secondWasteTypeContainsPops: '',
          secondWasteTypePopsString: '',
          secondWasteTypePopsConcentrationsString: '',
          secondWasteTypePopsConcentrationUnitsString: '',
          thirdWasteTypeEwcCode: '',
          thirdWasteTypeWasteDescription: '',
          thirdWasteTypePhysicalForm: '',
          thirdWasteTypeWasteQuantity: '',
          thirdWasteTypeWasteQuantityUnit: '',
          thirdWasteTypeWasteQuantityType: '',
          thirdWasteTypeChemicalAndBiologicalComponentsString: '',
          thirdWasteTypeChemicalAndBiologicalComponentsConcentrationsString: '',
          thirdWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            '',
          thirdWasteTypeHasHazardousProperties: '',
          thirdWasteTypeHazardousWasteCodesString: '',
          thirdWasteTypeContainsPops: '',
          thirdWasteTypePopsString: '',
          thirdWasteTypePopsConcentrationsString: '',
          thirdWasteTypePopsConcentrationUnitsString: '',
          fourthWasteTypeEwcCode: '',
          fourthWasteTypeWasteDescription: '',
          fourthWasteTypePhysicalForm: '',
          fourthWasteTypeWasteQuantity: '',
          fourthWasteTypeWasteQuantityUnit: '',
          fourthWasteTypeWasteQuantityType: '',
          fourthWasteTypeChemicalAndBiologicalComponentsString: '',
          fourthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            '',
          fourthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            '',
          fourthWasteTypeHasHazardousProperties: '',
          fourthWasteTypeHazardousWasteCodesString: '',
          fourthWasteTypeContainsPops: '',
          fourthWasteTypePopsString: '',
          fourthWasteTypePopsConcentrationsString: '',
          fourthWasteTypePopsConcentrationUnitsString: '',
          fifthWasteTypeEwcCode: '',
          fifthWasteTypeWasteDescription: '',
          fifthWasteTypePhysicalForm: '',
          fifthWasteTypeWasteQuantity: '',
          fifthWasteTypeWasteQuantityUnit: '',
          fifthWasteTypeWasteQuantityType: '',
          fifthWasteTypeChemicalAndBiologicalComponentsString: '',
          fifthWasteTypeChemicalAndBiologicalComponentsConcentrationsString: '',
          fifthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            '',
          fifthWasteTypeHasHazardousProperties: '',
          fifthWasteTypeHazardousWasteCodesString: '',
          fifthWasteTypeContainsPops: '',
          fifthWasteTypePopsString: '',
          fifthWasteTypePopsConcentrationsString: '',
          fifthWasteTypePopsConcentrationUnitsString: '',
          sixthWasteTypeEwcCode: '',
          sixthWasteTypeWasteDescription: '',
          sixthWasteTypePhysicalForm: '',
          sixthWasteTypeWasteQuantity: '',
          sixthWasteTypeWasteQuantityUnit: '',
          sixthWasteTypeWasteQuantityType: '',
          sixthWasteTypeChemicalAndBiologicalComponentsString: '',
          sixthWasteTypeChemicalAndBiologicalComponentsConcentrationsString: '',
          sixthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            '',
          sixthWasteTypeHasHazardousProperties: '',
          sixthWasteTypeHazardousWasteCodesString: '',
          sixthWasteTypeContainsPops: '',
          sixthWasteTypePopsString: '',
          sixthWasteTypePopsConcentrationsString: '',
          sixthWasteTypePopsConcentrationUnitsString: '',
          seventhWasteTypeEwcCode: '',
          seventhWasteTypeWasteDescription: '',
          seventhWasteTypePhysicalForm: '',
          seventhWasteTypeWasteQuantity: '',
          seventhWasteTypeWasteQuantityUnit: '',
          seventhWasteTypeWasteQuantityType: '',
          seventhWasteTypeChemicalAndBiologicalComponentsString: '',
          seventhWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            '',
          seventhWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            '',
          seventhWasteTypeHasHazardousProperties: '',
          seventhWasteTypeHazardousWasteCodesString: '',
          seventhWasteTypeContainsPops: '',
          seventhWasteTypePopsString: '',
          seventhWasteTypePopsConcentrationsString: '',
          seventhWasteTypePopsConcentrationUnitsString: '',
          eighthWasteTypeEwcCode: '',
          eighthWasteTypeWasteDescription: '',
          eighthWasteTypePhysicalForm: '',
          eighthWasteTypeWasteQuantity: '',
          eighthWasteTypeWasteQuantityUnit: '',
          eighthWasteTypeWasteQuantityType: '',
          eighthWasteTypeChemicalAndBiologicalComponentsString: '',
          eighthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            '',
          eighthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            '',
          eighthWasteTypeHasHazardousProperties: '',
          eighthWasteTypeHazardousWasteCodesString: '',
          eighthWasteTypeContainsPops: '',
          eighthWasteTypePopsString: '',
          eighthWasteTypePopsConcentrationsString: '',
          eighthWasteTypePopsConcentrationUnitsString: '',
          ninthWasteTypeEwcCode: '',
          ninthWasteTypeWasteDescription: '',
          ninthWasteTypePhysicalForm: '',
          ninthWasteTypeWasteQuantity: '',
          ninthWasteTypeWasteQuantityUnit: '',
          ninthWasteTypeWasteQuantityType: '',
          ninthWasteTypeChemicalAndBiologicalComponentsString: '',
          ninthWasteTypeChemicalAndBiologicalComponentsConcentrationsString: '',
          ninthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            '',
          ninthWasteTypeHasHazardousProperties: '',
          ninthWasteTypeHazardousWasteCodesString: '',
          ninthWasteTypeContainsPops: '',
          ninthWasteTypePopsString: '',
          ninthWasteTypePopsConcentrationsString: '',
          ninthWasteTypePopsConcentrationUnitsString: '',
          tenthWasteTypeEwcCode: '',
          tenthWasteTypeWasteDescription: '',
          tenthWasteTypePhysicalForm: '',
          tenthWasteTypeWasteQuantity: '',
          tenthWasteTypeWasteQuantityUnit: '',
          tenthWasteTypeWasteQuantityType: '',
          tenthWasteTypeChemicalAndBiologicalComponentsString: '',
          tenthWasteTypeChemicalAndBiologicalComponentsConcentrationsString: '',
          tenthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            '',
          tenthWasteTypeHasHazardousProperties: '',
          tenthWasteTypeHazardousWasteCodesString: '',
          tenthWasteTypeContainsPops: '',
          tenthWasteTypePopsString: '',
          tenthWasteTypePopsConcentrationsString: '',
          tenthWasteTypePopsConcentrationUnitsString: '',
          transactionId: 'WM2405_A5B9D42E',
          carrierConfirmationUniqueReference: '',
          carrierConfirmationCorrectDetails: '',
          carrierConfirmationBrokerRegistrationNumber: '',
          carrierConfirmationRegistrationNumber: '',
          carrierConfirmationOrganisationName: '',
          carrierConfirmationAddressLine1: '',
          carrierConfirmationAddressLine2: '',
          carrierConfirmationTownCity: '',
          carrierConfirmationCountry: '',
          carrierConfirmationPostcode: '',
          carrierConfirmationContactName: '',
          carrierConfirmationContactEmail: '',
          carrierConfirmationContactPhone: '',
          carrierModeOfTransport: '',
          carrierVehicleRegistrationNumber: '',
          carrierDateWasteCollected: '',
          carrierTimeWasteCollected: '',
        },
      ];

      mockRepository.downloadProducerCsv.mockResolvedValue(value);

      const response = await subject.downloadProducerCsv({ id, accountId });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.downloadProducerCsv).toHaveBeenCalledWith(
        id,
        accountId,
      );
      expect(response.value.data).toBeTruthy();
    });
  });

  describe('finalizeBatch', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();

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
          errorSummary: {
            columnBased: [],
            rowBased: [],
          },
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
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();

      const value: BulkSubmission = {
        id,
        state: {
          status: 'PassedValidation',
          timestamp: new Date(),
          hasEstimates: true,
          rowsCount: 1,
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
        accountId: faker.string.uuid(),
        content: {
          type: 'text/csv',
          compression: 'Snappy',
          value: faker.string.sample(),
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

  describe('getRow', () => {
    it('forwards thrown Boom errors', async () => {
      mockRepository.getRow.mockRejectedValue(Boom.teapot());

      const request = {
        accountId: faker.string.uuid(),
        batchId: faker.string.uuid(),
        rowId: faker.string.uuid(),
      };

      const response = await subject.getRow(request);

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRow).toBeCalledWith(
        request.accountId,
        request.batchId,
        request.rowId,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns value from the repository', async () => {
      const accountId = faker.string.uuid();
      const batchId = faker.string.uuid();
      const rowId = faker.string.uuid();
      const code = validation.errorCodes.carrierCharTooManyAddressLine1;

      mockRepository.getRow.mockResolvedValue({
        accountId,
        batchId,
        id: rowId,
        data: {
          valid: false,
          rowNumber: 1,
          codes: [code],
        },
      });

      const response = await subject.getRow({
        accountId,
        batchId,
        rowId,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      const message =
        validation.UkwmErrorData[code].type === 'message'
          ? validation.UkwmErrorData[code].message
          : '';

      expect(message).toBeTruthy();

      expect(mockRepository.getRow).toBeCalledWith(accountId, batchId, rowId);
      expect(response.value).toEqual({
        accountId,
        batchId,
        id: rowId,
        messages: [message],
      });
    });
  });

  describe('getColumn', () => {
    it('forwards thrown Boom errors', async () => {
      mockRepository.getColumn.mockRejectedValue(Boom.teapot());

      const request = {
        accountId: faker.string.uuid(),
        batchId: faker.string.uuid(),
        columnRef: faker.string.sample(),
      };

      const response = await subject.getColumn(request);

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getColumn).toBeCalledWith(
        request.accountId,
        request.batchId,
        request.columnRef,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns value from the repository', async () => {
      const accountId = faker.string.uuid();
      const batchId = faker.string.uuid();
      const columnRef = faker.string.sample();
      const code = validation.errorCodes.carrierCharTooManyAddressLine1;

      mockRepository.getColumn.mockResolvedValue({
        accountId,
        batchId,
        id: columnRef as Field,
        errors: [
          {
            codes: [code],
            rowNumber: 1,
          },
        ],
      });

      const response = await subject.getColumn({
        accountId,
        batchId,
        columnRef,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      const message =
        validation.UkwmErrorData[code].type === 'message'
          ? validation.UkwmErrorData[code].message
          : '';

      expect(message).toBeTruthy();

      expect(mockRepository.getColumn).toBeCalledWith(
        accountId,
        batchId,
        columnRef,
      );
      expect(response.value).toEqual({
        accountId,
        batchId,
        columnRef,
        errors: [
          {
            messages: [message],
            rowNumber: 1,
          },
        ],
      });
    });
  });

  describe('getBulkSubmissions', () => {
    it('forwards thrown Boom errors', async () => {
      mockRepository.getBulkSubmissions.mockRejectedValue(Boom.teapot());

      const request = {
        accountId: faker.string.uuid(),
        batchId: faker.string.uuid(),
        page: faker.number.int({ min: 1 }),
        pageSize: faker.number.int({ min: 1 }),
        ewcCode: faker.string.sample(),
        producerName: faker.string.sample(),
        wasteMovementId: 'WM2406_C7049A7F',
        collectionDate: new Date(),
      };

      const response = await subject.getBulkSubmissions(request);

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getBulkSubmissions).toBeCalledWith(
        request.batchId,
        request.accountId,
        request.page,
        request.pageSize,
        request.collectionDate,
        request.ewcCode,
        request.producerName,
        request.wasteMovementId,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns value from the repository', async () => {
      const request = {
        accountId: faker.string.uuid(),
        batchId: faker.string.uuid(),
        page: faker.number.int({ min: 1 }),
        pageSize: faker.number.int({ min: 1 }),
        ewcCode: faker.string.sample(),
        producerName: faker.string.sample(),
        wasteMovementId: 'WM2406_C7049A7F',
        collectionDate: new Date(),
      };

      const result: PagedSubmissionData = {
        page: request.page,
        totalPages: 1,
        totalRecords: 1,
        values: [
          {
            id: faker.string.uuid(),
            wasteMovementId: 'WM2406_C7049A7F',
            ewcCode: faker.string.sample(),
            producerName: faker.company.name(),
            collectionDate: {
              day: faker.date.soon().getDay().toString(),
              month: faker.date.soon().getMonth().toString(),
              year: faker.date.soon().getFullYear().toString(),
            },
          },
        ],
      };

      mockRepository.getBulkSubmissions.mockResolvedValue(result);

      const response = await subject.getBulkSubmissions(request);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getBulkSubmissions).toBeCalledWith(
        request.batchId,
        request.accountId,
        request.page,
        request.pageSize,
        request.collectionDate,
        request.ewcCode,
        request.producerName,
        request.wasteMovementId,
      );

      expect(response.value).toEqual(result);
    });
  });
});
