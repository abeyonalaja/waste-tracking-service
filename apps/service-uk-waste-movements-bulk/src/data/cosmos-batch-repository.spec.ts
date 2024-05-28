import {
  CosmosClient,
  FeedResponse,
  Item,
  ItemResponse,
  Items,
  QueryIterator,
} from '@azure/cosmos';
import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { expect, jest } from '@jest/globals';
import { Logger } from 'winston';
import { CosmosBatchRepository } from './cosmos-batch-repository';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockRead = jest.fn<typeof Item.prototype.read>();
const mockPatch = jest.fn<typeof Item.prototype.patch>();
const mockCreate = jest.fn<typeof Items.prototype.create>();
const mockFetchNext = jest.fn<typeof QueryIterator.prototype.fetchNext>();
const mockFetchAll = jest.fn<typeof QueryIterator.prototype.fetchAll>();

jest.mock('@azure/cosmos', () => ({
  CosmosClient: jest.fn().mockImplementation(() => ({
    database: jest.fn(() => ({
      container: jest.fn(() => ({
        item: jest.fn(() => ({
          read: mockRead,
          patch: mockPatch,
        })),
        items: {
          create: mockCreate,
          query: jest.fn(() => ({
            fetchNext: mockFetchNext,
            fetchAll: mockFetchAll,
          })),
        },
      })),
    })),
  })),
}));

describe(CosmosBatchRepository, () => {
  beforeEach(() => {
    mockRead.mockClear();
    mockPatch.mockClear();
    mockCreate.mockClear();
    mockFetchNext.mockClear();
    mockFetchAll.mockClear();
  });

  const mockCosmosEndpoint = faker.datatype.string();
  const mockCosmosKey = faker.datatype.string();
  const mockCosmosDbName = faker.datatype.string();
  const mockCosmosContainerName = faker.datatype.string();
  const logger = new Logger();

  const subject = new CosmosBatchRepository(
    new CosmosClient({
      endpoint: mockCosmosEndpoint,
      key: mockCosmosKey,
    }),
    mockCosmosDbName,
    mockCosmosContainerName,
    logger
  );

  describe('getBatch', () => {
    it('retrieves a value with the associated id', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      const timestamp = new Date();
      const mockResponse = {
        id,
        value: {
          id,
          accountId,
          state: {
            status: 'Processing',
            timestamp: timestamp,
          },
        },
        partitionKey: accountId,
        _rid: faker.datatype.string(),
        _self: faker.datatype.string(),
        _etag: faker.datatype.string(),
        _attachments: faker.datatype.string(),
        _ts: faker.datatype.bigInt(),
      };
      mockRead.mockResolvedValueOnce({
        resource: mockResponse,
      } as unknown as ItemResponse<object>);

      const result = await subject.getBatch(id, accountId);
      expect(result).toEqual({
        id,
        state: {
          status: 'Processing',
          timestamp: timestamp,
        },
      });
      expect(mockRead).toBeCalledTimes(1);
    });

    it("throws Not Found exception if key doesn't exist", async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      mockRead.mockResolvedValueOnce({
        resource: undefined,
      } as unknown as ItemResponse<object>);

      expect(subject.getBatch(id, accountId)).rejects.toThrow(Boom.notFound());
      expect(mockRead).toBeCalledTimes(1);
    });
  });

  describe('downloadBatch', () => {
    it('retrieves a value with flattened properties', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      const mockResponse = [
        {
          id: id,
          value: {
            id,
            accountId,
            state: {
              status: 'Submitted',
              timestamp: '2024-05-27T11:58:10.672Z',
              hasEstimates: false,
              transactionId: '2405_0A9E118F',
              submissions: [
                {
                  id: 'a5b9d42e-6333-4a43-9cba-0224db6bd492',
                  transactionId: 'WM2405_A5B9D42E',
                  producerAndCollection: {
                    status: 'Complete',
                    producer: {
                      reference: '100ANSHFFBF',
                      sicCode: '208016',
                      address: {
                        addressLine1: '110 Bishopsgate',
                        addressLine2: 'Mulberry street',
                        country: 'Wales',
                        postcode: 'CV12RD',
                        townCity: 'London',
                      },
                      contact: {
                        email: 'guy@test.com',
                        name: 'Pro Name',
                        organisationName: 'Producer org name',
                        phone: '00447811111213',
                      },
                    },
                    wasteCollection: {
                      wasteSource: 'Household',
                      carrierRegistrationNumber: 'CBDL5221',
                      expectedWasteCollectionDate: {
                        day: '18',
                        month: '02',
                        year: '2066',
                      },
                      localAuthority: 'Hartlepool',
                      address: {
                        addressLine1: '110 Bishopsgate',
                        addressLine2: 'Mulberry street',
                        townCity: 'London',
                        postcode: '',
                        country: 'Scotland',
                      },
                    },
                  },
                  wasteInformation: {
                    status: 'Complete',
                    wasteTypes: [
                      {
                        ewcCode: '010101',
                        containsPops: true,
                        hasHazardousProperties: true,
                        physicalForm: 'Gas',
                        quantityUnit: 'Tonne',
                        wasteDescription:
                          'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
                        wasteQuantity: 1.1,
                        wasteQuantityType: 'ActualData',
                        chemicalAndBiologicalComponents: [
                          {
                            name: 'Chlorinated solvents',
                            concentration: 20.35,
                            concentrationUnit: 'mg/kg',
                          },
                        ],
                        hazardousWasteCodes: [
                          {
                            code: 'HP1',
                            name: 'Explosive',
                          },
                        ],
                        pops: [
                          {
                            name: 'Endosulfan',
                            concentration: 9823.75,
                            concentrationUnit: 'mg/k',
                          },
                        ],
                      },
                    ],
                    wasteTransportation: {
                      numberAndTypeOfContainers: '123456',
                      specialHandlingRequirements: '',
                    },
                  },
                  receiver: {
                    status: 'Complete',
                    value: {
                      authorizationType: 'Permit DEFRA',
                      environmentalPermitNumber: 'DEFRA 1235',
                      address: {
                        addressLine1: '12 Mulberry Street',
                        addressLine2: 'West coast, Northwest',
                        country: 'Wales',
                        postcode: 'DA112AB',
                        townCity: 'West coast',
                      },
                      contact: {
                        email: 'smithjones@hotmail.com',
                        name: 'Mr. Smith Jones',
                        organisationName: "Mac Donald 's",
                        phone: '07811111111',
                      },
                    },
                  },
                  carrier: {
                    status: 'Complete',
                    value: {
                      address: {
                        addressLine1: '110 Bishopsgate',
                        addressLine2: 'Mulberry street',
                        townCity: 'London',
                        country: 'Wales',
                        postcode: 'CV12RD',
                      },
                      contact: {
                        email: 'guy@test.com',
                        name: 'Pro Name',
                        phone: `00447811111213'`,
                        organisationName: 'Producer org name',
                      },
                    },
                  },
                  submissionState: {
                    status: 'SubmittedWithActuals',
                    timestamp: '2024-05-27T11:58:09.389Z',
                  },
                  submissionDeclaration: {
                    status: 'Complete',
                    values: {
                      declarationTimestamp: '2024-05-27T11:58:09.389Z',
                      transactionId: 'WM2405_A5B9D42E',
                    },
                  },
                  hasEstimates: false,
                },
              ],
            },
          },
          partitionKey: accountId,
          _rid: faker.datatype.string(),
          _self: faker.datatype.string(),
          _etag: faker.datatype.string(),
          _attachments: faker.datatype.string(),
          _ts: faker.datatype.bigInt(),
        },
      ];
      mockFetchAll.mockResolvedValueOnce({
        resources: mockResponse,
        hasMoreResults: false,
        continuation: () => null,
        continuationToken: null,
        queryMetrics: {},
        requestCharge: 0,
        activityId: '',
        headers: {},
        statusCode: 200,
      } as unknown as FeedResponse<object>);

      const result = await subject.downloadProducerCsv(id);
      expect(result).toEqual([
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
      ]);
      expect(mockFetchAll).toBeCalledTimes(1);
    });

    it("throws Not Found exception if key doesn't exist", async () => {
      const id = faker.datatype.uuid();
      mockFetchAll.mockResolvedValueOnce({
        resources: [],
        hasMoreResults: false,
        continuation: () => null,
        continuationToken: null,
        queryMetrics: {},
        requestCharge: 0,
        activityId: '',
        headers: {},
        statusCode: 200,
      } as unknown as FeedResponse<object>);

      expect(subject.downloadProducerCsv(id)).rejects.toThrow(Boom.notFound());
      expect(mockFetchAll).toBeCalledTimes(1);
    });
  });
});
