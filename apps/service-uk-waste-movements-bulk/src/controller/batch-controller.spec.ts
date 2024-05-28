import { expect, jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import winston from 'winston';
import Boom from '@hapi/boom';
import { BatchController } from './batch-controller';
import { BulkSubmission, SubmissionFlattenedDownload } from '../model';

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
    jest.fn<(id: string) => Promise<SubmissionFlattenedDownload[]>>(),
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

  describe('downloadProducerCsv', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.datatype.uuid();
      mockRepository.downloadProducerCsv.mockRejectedValue(Boom.teapot());

      const response = await subject.downloadProducerCsv({ id });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.downloadProducerCsv).toBeCalledWith(id);
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns base64 formatted csv data of the record', async () => {
      const id = faker.datatype.uuid();
      const value: SubmissionFlattenedDownload[] = [
        {
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
          carrierConfirmationbrokerRegistrationNumber: '',
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

      const response = await subject.downloadProducerCsv({ id });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.downloadProducerCsv).toHaveBeenCalledWith(id);
      expect(response.value.data).toBeTruthy();
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
              errorCodes: [1001, 1002],
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
                localAuthority: 'Local Authority',
                wasteSource: 'LocalAuthority',
              },
              carrier: {
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
              wasteTransportation: {
                numberAndTypeOfContainers: '10x20ft',
                specialHandlingRequirements: 'Special handling requirements',
              },
              wasteTypes: [
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
