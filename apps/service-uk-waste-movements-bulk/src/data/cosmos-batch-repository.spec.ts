import {
  CosmosClient,
  FeedResponse,
  Item,
  ItemResponse,
  Items,
  QueryIterator,
  SqlQuerySpec,
} from '@azure/cosmos';
import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { expect, jest } from '@jest/globals';
import { Logger } from 'winston';
import { CosmosBatchRepository } from './cosmos-batch-repository';
import { when } from 'jest-when';

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockQuery = jest.fn((_query: SqlQuerySpec) => ({
  fetchNext: mockFetchNext,
  fetchAll: mockFetchAll,
}));

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
          query: mockQuery,
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
    mockQuery.mockReturnValue({
      fetchNext: mockFetchNext,
      fetchAll: mockFetchAll,
    });
  });

  const mockCosmosEndpoint = faker.string.sample();
  const mockCosmosKey = faker.string.sample();
  const mockCosmosDbName = faker.string.sample();
  const mockCosmosContainerMap = {
    batches: faker.string.alpha(),
    columns: faker.string.alpha(),
    rows: faker.string.alpha(),
  };
  const logger = new Logger();

  const subject = new CosmosBatchRepository(
    new CosmosClient({
      endpoint: mockCosmosEndpoint,
      key: mockCosmosKey,
    }),
    mockCosmosDbName,
    mockCosmosContainerMap,
    logger,
  );

  describe('getBatch', () => {
    it('retrieves a value with the associated id', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
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
        _rid: faker.string.sample(),
        _self: faker.string.sample(),
        _etag: faker.string.sample(),
        _attachments: faker.string.sample(),
        _ts: faker.number.bigInt(),
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
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRead.mockResolvedValueOnce({
        resource: undefined,
      } as unknown as ItemResponse<object>);

      expect(subject.getBatch(id, accountId)).rejects.toThrow(Boom.notFound());
      expect(mockRead).toBeCalledTimes(1);
    });
  });

  describe('downloadBatch', () => {
    it('retrieves a value with flattened properties', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const mockBatch = {
        id,
        value: {
          id,
          accountId,
          state: {
            status: 'Submitted',
            timestamp: '2024-05-27T11:58:10.672Z',
            hasEstimates: false,
            transactionId: '2405_0A9E118F',
            createdRowsCount: 1,
          },
        },
        partitionKey: accountId,
        _rid: faker.string.sample(),
        _self: faker.string.sample(),
        _etag: faker.string.sample(),
        _attachments: faker.string.sample(),
        _ts: faker.number.bigInt(),
      };
      mockRead.mockResolvedValueOnce({
        resource: mockBatch,
      } as unknown as ItemResponse<object>);

      const rowId = faker.string.uuid();
      const mockRows = [
        {
          id: rowId,
          value: {
            id: rowId,
            accountId,
            batchId: mockBatch.id,
            data: {
              submitted: true,
              valid: true,
              content: {
                id: 'c7049a7f-0eed-486e-b2c8-7e570df6086c',
                transactionId: 'WM2406_C7049A7F',
                producer: {
                  reference: 'UKMREF99',
                  sicCode: '208016',
                  address: {
                    addressLine1: '110 Bishopsgate',
                    addressLine2: 'Mulberry street',
                    country: 'Wales',
                    postcode: 'CV12RD',
                    townCity: 'London',
                  },
                  contact: {
                    emailAddress: 'guy@test.com',
                    fullName: 'Pro Name',
                    organisationName: 'Producer org name',
                    phoneNumber: '00447811111213',
                  },
                },
                receiver: {
                  permitDetails: {
                    authorizationType: 'Permit DEFRA',
                    environmentalPermitNumber: 'DEFRA 1235',
                  },
                  address: {
                    addressLine1: '12 Mulberry Street',
                    addressLine2: 'West coast, Northwest',
                    country: 'Wales',
                    postcode: 'DA112AB',
                    townCity: 'West coast',
                  },
                  contact: {
                    emailAddress: 'smithjones@hotmail.com',
                    fullName: 'Mr. Smith Jones',
                    organisationName: "Mac Donald 's",
                    phoneNumber: '07811111111',
                  },
                },
                wasteTypes: [
                  {
                    ewcCode: '170102',
                    containsPops: true,
                    hasHazardousProperties: true,
                    physicalForm: 'Gas',
                    quantityUnit: 'Tonne',
                    wasteDescription:
                      'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
                    wasteQuantity: 99.1,
                    wasteQuantityType: 'ActualData',
                    chemicalAndBiologicalComponents: [
                      {
                        name: 'Chlorinated solvents',
                        concentration: 118.35,
                        concentrationUnit: 'mg/kg',
                      },
                    ],
                    hazardousWasteCodes: [
                      {
                        code: 'HP12',
                        name: 'Release of an acute toxic gas',
                      },
                    ],
                    pops: [
                      {
                        name: 'Endosulfan',
                        concentration: 9921.75,
                        concentrationUnit: 'mg/k',
                      },
                    ],
                  },
                  {
                    ewcCode: '170102',
                    containsPops: true,
                    hasHazardousProperties: true,
                    physicalForm: 'Gas',
                    quantityUnit: 'Tonne',
                    wasteDescription:
                      'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
                    wasteQuantity: 99.1,
                    wasteQuantityType: 'ActualData',
                    chemicalAndBiologicalComponents: [
                      {
                        name: 'Chlorinated solvents',
                        concentration: 118.35,
                        concentrationUnit: 'mg/kg',
                      },
                    ],
                    hazardousWasteCodes: [
                      {
                        code: 'HP12',
                        name: 'Release of an acute toxic gas',
                      },
                    ],
                    pops: [
                      {
                        name: 'Endosulfan',
                        concentration: 9921.75,
                        concentrationUnit: 'mg/k',
                      },
                    ],
                  },
                  {
                    ewcCode: '170102',
                    containsPops: true,
                    hasHazardousProperties: true,
                    physicalForm: 'Gas',
                    quantityUnit: 'Tonne',
                    wasteDescription:
                      'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
                    wasteQuantity: 99.1,
                    wasteQuantityType: 'ActualData',
                    chemicalAndBiologicalComponents: [
                      {
                        name: 'Chlorinated solvents',
                        concentration: 118.35,
                        concentrationUnit: 'mg/kg',
                      },
                    ],
                    hazardousWasteCodes: [
                      {
                        code: 'HP12',
                        name: 'Release of an acute toxic gas',
                      },
                    ],
                    pops: [
                      {
                        name: 'Endosulfan',
                        concentration: 9921.75,
                        concentrationUnit: 'mg/k',
                      },
                    ],
                  },
                  {
                    ewcCode: '170102',
                    containsPops: true,
                    hasHazardousProperties: true,
                    physicalForm: 'Gas',
                    quantityUnit: 'Tonne',
                    wasteDescription:
                      'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
                    wasteQuantity: 99.1,
                    wasteQuantityType: 'ActualData',
                    chemicalAndBiologicalComponents: [
                      {
                        name: 'Chlorinated solvents',
                        concentration: 118.35,
                        concentrationUnit: 'mg/kg',
                      },
                    ],
                    hazardousWasteCodes: [
                      {
                        code: 'HP12',
                        name: 'Release of an acute toxic gas',
                      },
                    ],
                    pops: [
                      {
                        name: 'Endosulfan',
                        concentration: 9921.75,
                        concentrationUnit: 'mg/k',
                      },
                    ],
                  },
                  {
                    ewcCode: '170102',
                    containsPops: true,
                    hasHazardousProperties: true,
                    physicalForm: 'Gas',
                    quantityUnit: 'Tonne',
                    wasteDescription:
                      'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
                    wasteQuantity: 99.1,
                    wasteQuantityType: 'ActualData',
                    chemicalAndBiologicalComponents: [
                      {
                        name: 'Chlorinated solvents',
                        concentration: 118.35,
                        concentrationUnit: 'mg/kg',
                      },
                    ],
                    hazardousWasteCodes: [
                      {
                        code: 'HP12',
                        name: 'Release of an acute toxic gas',
                      },
                    ],
                    pops: [
                      {
                        name: 'Endosulfan',
                        concentration: 9921.75,
                        concentrationUnit: 'mg/k',
                      },
                    ],
                  },
                  {
                    ewcCode: '170102',
                    containsPops: true,
                    hasHazardousProperties: true,
                    physicalForm: 'Gas',
                    quantityUnit: 'Tonne',
                    wasteDescription:
                      'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
                    wasteQuantity: 99.1,
                    wasteQuantityType: 'ActualData',
                    chemicalAndBiologicalComponents: [
                      {
                        name: 'Chlorinated solvents',
                        concentration: 118.35,
                        concentrationUnit: 'mg/kg',
                      },
                    ],
                    hazardousWasteCodes: [
                      {
                        code: 'HP12',
                        name: 'Release of an acute toxic gas',
                      },
                    ],
                    pops: [
                      {
                        name: 'Endosulfan',
                        concentration: 9921.75,
                        concentrationUnit: 'mg/k',
                      },
                    ],
                  },
                  {
                    ewcCode: '170102',
                    containsPops: true,
                    hasHazardousProperties: true,
                    physicalForm: 'Gas',
                    quantityUnit: 'Tonne',
                    wasteDescription:
                      'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
                    wasteQuantity: 99.1,
                    wasteQuantityType: 'ActualData',
                    chemicalAndBiologicalComponents: [
                      {
                        name: 'Chlorinated solvents',
                        concentration: 118.35,
                        concentrationUnit: 'mg/kg',
                      },
                    ],
                    hazardousWasteCodes: [
                      {
                        code: 'HP12',
                        name: 'Release of an acute toxic gas',
                      },
                    ],
                    pops: [
                      {
                        name: 'Endosulfan',
                        concentration: 9921.75,
                        concentrationUnit: 'mg/k',
                      },
                    ],
                  },
                  {
                    ewcCode: '170102',
                    containsPops: true,
                    hasHazardousProperties: true,
                    physicalForm: 'Gas',
                    quantityUnit: 'Tonne',
                    wasteDescription:
                      'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
                    wasteQuantity: 99.1,
                    wasteQuantityType: 'ActualData',
                    chemicalAndBiologicalComponents: [
                      {
                        name: 'Chlorinated solvents',
                        concentration: 118.35,
                        concentrationUnit: 'mg/kg',
                      },
                    ],
                    hazardousWasteCodes: [
                      {
                        code: 'HP12',
                        name: 'Release of an acute toxic gas',
                      },
                    ],
                    pops: [
                      {
                        name: 'Endosulfan',
                        concentration: 9921.75,
                        concentrationUnit: 'mg/k',
                      },
                    ],
                  },
                  {
                    ewcCode: '170102',
                    containsPops: true,
                    hasHazardousProperties: true,
                    physicalForm: 'Gas',
                    quantityUnit: 'Tonne',
                    wasteDescription:
                      'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
                    wasteQuantity: 99.1,
                    wasteQuantityType: 'EstimateData',
                    chemicalAndBiologicalComponents: [
                      {
                        name: 'Chlorinated solvents',
                        concentration: 118.35,
                        concentrationUnit: 'mg/kg',
                      },
                    ],
                    hazardousWasteCodes: [
                      {
                        code: 'HP12',
                        name: 'Release of an acute toxic gas',
                      },
                    ],
                    pops: [
                      {
                        name: 'Endosulfan',
                        concentration: 9921.75,
                        concentrationUnit: 'mg/k',
                      },
                    ],
                  },
                  {
                    ewcCode: '170102',
                    containsPops: true,
                    hasHazardousProperties: true,
                    physicalForm: 'Gas',
                    quantityUnit: 'Tonne',
                    wasteDescription:
                      'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
                    wasteQuantity: 99.1,
                    wasteQuantityType: 'ActualData',
                    chemicalAndBiologicalComponents: [
                      {
                        name: 'Chlorinated solvents',
                        concentration: 118.35,
                        concentrationUnit: 'mg/kg',
                      },
                    ],
                    hazardousWasteCodes: [
                      {
                        code: 'HP12',
                        name: 'Release of an acute toxic gas',
                      },
                    ],
                    pops: [
                      {
                        name: 'Endosulfan',
                        concentration: 9921.75,
                        concentrationUnit: 'mg/k',
                      },
                    ],
                  },
                ],
                wasteCollection: {
                  wasteSource: 'Household',
                  carrierRegistrationNumber: 'CBDL5221',
                  brokerRegistrationNumber: 'NSZ6112',
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
                wasteTransportation: {
                  numberAndTypeOfContainers: '123456',
                  specialHandlingRequirements: '',
                },
                carrier: {
                  address: {
                    addressLine1: '110 Bishopsgate',
                    addressLine2: 'Mulberry street',
                    townCity: 'London',
                    country: 'Wales',
                    postcode: 'CV12RD',
                  },
                  contact: {
                    emailAddress: 'guy@test.com',
                    fullName: 'Pro Name',
                    phoneNumber: "00447811111213'",
                    organisationName: 'Producer org name',
                  },
                },
              },
            },
          },
          partitionKey: {
            accountId: accountId,
            batchId: mockBatch.id,
          },
          _rid: faker.string.sample(),
          _self: faker.string.sample(),
          _etag: faker.string.sample(),
          _attachments: faker.string.sample(),
          _ts: faker.number.bigInt(),
        },
      ];

      mockFetchAll.mockResolvedValueOnce({
        resources: mockRows,
        hasMoreResults: false,
        continuation: () => null,
        continuationToken: null,
        queryMetrics: {},
        requestCharge: 0,
        activityId: '',
        headers: {},
        statusCode: 200,
      } as unknown as FeedResponse<object>);

      const result = await subject.downloadProducerCsv(id, accountId);

      expect(result).toEqual([
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
          wasteCollectionBrokerRegistrationNumber: 'NSZ6112',
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
          firstWasteTypeEwcCode: "'170102'",
          firstWasteTypeWasteDescription:
            'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
          firstWasteTypePhysicalForm: 'Gas',
          firstWasteTypeWasteQuantity: '99.1',
          firstWasteTypeWasteQuantityUnit: 'tonnes',
          firstWasteTypeWasteQuantityType: 'Actual',
          firstWasteTypeChemicalAndBiologicalComponentsString:
            'Chlorinated solvents',
          firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            '118.35',
          firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            'mg/kg',
          firstWasteTypeHasHazardousProperties: 'Y',
          firstWasteTypeHazardousWasteCodesString: 'HP12',
          firstWasteTypeContainsPops: 'Y',
          firstWasteTypePopsString: 'Endosulfan',
          firstWasteTypePopsConcentrationsString: '9921.75',
          firstWasteTypePopsConcentrationUnitsString: 'mg/k',
          secondWasteTypeEwcCode: "'170102'",
          secondWasteTypeWasteDescription:
            'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
          secondWasteTypePhysicalForm: 'Gas',
          secondWasteTypeWasteQuantity: '99.1',
          secondWasteTypeWasteQuantityUnit: 'tonnes',
          secondWasteTypeWasteQuantityType: 'Actual',
          secondWasteTypeChemicalAndBiologicalComponentsString:
            'Chlorinated solvents',
          secondWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            '118.35',
          secondWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            'mg/kg',
          secondWasteTypeHasHazardousProperties: 'Y',
          secondWasteTypeHazardousWasteCodesString: 'HP12',
          secondWasteTypeContainsPops: 'Y',
          secondWasteTypePopsString: 'Endosulfan',
          secondWasteTypePopsConcentrationsString: '9921.75',
          secondWasteTypePopsConcentrationUnitsString: 'mg/k',
          thirdWasteTypeEwcCode: "'170102'",
          thirdWasteTypeWasteDescription:
            'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
          thirdWasteTypePhysicalForm: 'Gas',
          thirdWasteTypeWasteQuantity: '99.1',
          thirdWasteTypeWasteQuantityUnit: 'tonnes',
          thirdWasteTypeWasteQuantityType: 'Actual',
          thirdWasteTypeChemicalAndBiologicalComponentsString:
            'Chlorinated solvents',
          thirdWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            '118.35',
          thirdWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            'mg/kg',
          thirdWasteTypeHasHazardousProperties: 'Y',
          thirdWasteTypeHazardousWasteCodesString: 'HP12',
          thirdWasteTypeContainsPops: 'Y',
          thirdWasteTypePopsString: 'Endosulfan',
          thirdWasteTypePopsConcentrationsString: '9921.75',
          thirdWasteTypePopsConcentrationUnitsString: 'mg/k',
          fourthWasteTypeEwcCode: "'170102'",
          fourthWasteTypeWasteDescription:
            'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
          fourthWasteTypePhysicalForm: 'Gas',
          fourthWasteTypeWasteQuantity: '99.1',
          fourthWasteTypeWasteQuantityUnit: 'tonnes',
          fourthWasteTypeWasteQuantityType: 'Actual',
          fourthWasteTypeChemicalAndBiologicalComponentsString:
            'Chlorinated solvents',
          fourthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            '118.35',
          fourthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            'mg/kg',
          fourthWasteTypeHasHazardousProperties: 'Y',
          fourthWasteTypeHazardousWasteCodesString: 'HP12',
          fourthWasteTypeContainsPops: 'Y',
          fourthWasteTypePopsString: 'Endosulfan',
          fourthWasteTypePopsConcentrationsString: '9921.75',
          fourthWasteTypePopsConcentrationUnitsString: 'mg/k',
          fifthWasteTypeEwcCode: "'170102'",
          fifthWasteTypeWasteDescription:
            'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
          fifthWasteTypePhysicalForm: 'Gas',
          fifthWasteTypeWasteQuantity: '99.1',
          fifthWasteTypeWasteQuantityUnit: 'tonnes',
          fifthWasteTypeWasteQuantityType: 'Actual',
          fifthWasteTypeChemicalAndBiologicalComponentsString:
            'Chlorinated solvents',
          fifthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            '118.35',
          fifthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            'mg/kg',
          fifthWasteTypeHasHazardousProperties: 'Y',
          fifthWasteTypeHazardousWasteCodesString: 'HP12',
          fifthWasteTypeContainsPops: 'Y',
          fifthWasteTypePopsString: 'Endosulfan',
          fifthWasteTypePopsConcentrationsString: '9921.75',
          fifthWasteTypePopsConcentrationUnitsString: 'mg/k',
          sixthWasteTypeEwcCode: "'170102'",
          sixthWasteTypeWasteDescription:
            'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
          sixthWasteTypePhysicalForm: 'Gas',
          sixthWasteTypeWasteQuantity: '99.1',
          sixthWasteTypeWasteQuantityUnit: 'tonnes',
          sixthWasteTypeWasteQuantityType: 'Actual',
          sixthWasteTypeChemicalAndBiologicalComponentsString:
            'Chlorinated solvents',
          sixthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            '118.35',
          sixthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            'mg/kg',
          sixthWasteTypeHasHazardousProperties: 'Y',
          sixthWasteTypeHazardousWasteCodesString: 'HP12',
          sixthWasteTypeContainsPops: 'Y',
          sixthWasteTypePopsString: 'Endosulfan',
          sixthWasteTypePopsConcentrationsString: '9921.75',
          sixthWasteTypePopsConcentrationUnitsString: 'mg/k',
          seventhWasteTypeEwcCode: "'170102'",
          seventhWasteTypeWasteDescription:
            'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
          seventhWasteTypePhysicalForm: 'Gas',
          seventhWasteTypeWasteQuantity: '99.1',
          seventhWasteTypeWasteQuantityUnit: 'tonnes',
          seventhWasteTypeWasteQuantityType: 'Actual',
          seventhWasteTypeChemicalAndBiologicalComponentsString:
            'Chlorinated solvents',
          seventhWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            '118.35',
          seventhWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            'mg/kg',
          seventhWasteTypeHasHazardousProperties: 'Y',
          seventhWasteTypeHazardousWasteCodesString: 'HP12',
          seventhWasteTypeContainsPops: 'Y',
          seventhWasteTypePopsString: 'Endosulfan',
          seventhWasteTypePopsConcentrationsString: '9921.75',
          seventhWasteTypePopsConcentrationUnitsString: 'mg/k',
          eighthWasteTypeEwcCode: "'170102'",
          eighthWasteTypeWasteDescription:
            'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
          eighthWasteTypePhysicalForm: 'Gas',
          eighthWasteTypeWasteQuantity: '99.1',
          eighthWasteTypeWasteQuantityUnit: 'tonnes',
          eighthWasteTypeWasteQuantityType: 'Actual',
          eighthWasteTypeChemicalAndBiologicalComponentsString:
            'Chlorinated solvents',
          eighthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            '118.35',
          eighthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            'mg/kg',
          eighthWasteTypeHasHazardousProperties: 'Y',
          eighthWasteTypeHazardousWasteCodesString: 'HP12',
          eighthWasteTypeContainsPops: 'Y',
          eighthWasteTypePopsString: 'Endosulfan',
          eighthWasteTypePopsConcentrationsString: '9921.75',
          eighthWasteTypePopsConcentrationUnitsString: 'mg/k',
          ninthWasteTypeEwcCode: "'170102'",
          ninthWasteTypeWasteDescription:
            'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
          ninthWasteTypePhysicalForm: 'Gas',
          ninthWasteTypeWasteQuantity: '99.1',
          ninthWasteTypeWasteQuantityUnit: 'tonnes',
          ninthWasteTypeWasteQuantityType: 'Estimate',
          ninthWasteTypeChemicalAndBiologicalComponentsString:
            'Chlorinated solvents',
          ninthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            '118.35',
          ninthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            'mg/kg',
          ninthWasteTypeHasHazardousProperties: 'Y',
          ninthWasteTypeHazardousWasteCodesString: 'HP12',
          ninthWasteTypeContainsPops: 'Y',
          ninthWasteTypePopsString: 'Endosulfan',
          ninthWasteTypePopsConcentrationsString: '9921.75',
          ninthWasteTypePopsConcentrationUnitsString: 'mg/k',
          tenthWasteTypeEwcCode: "'170102'",
          tenthWasteTypeWasteDescription:
            'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings',
          tenthWasteTypePhysicalForm: 'Gas',
          tenthWasteTypeWasteQuantity: '99.1',
          tenthWasteTypeWasteQuantityUnit: 'tonnes',
          tenthWasteTypeWasteQuantityType: 'Actual',
          tenthWasteTypeChemicalAndBiologicalComponentsString:
            'Chlorinated solvents',
          tenthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            '118.35',
          tenthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            'mg/kg',
          tenthWasteTypeHasHazardousProperties: 'Y',
          tenthWasteTypeHazardousWasteCodesString: 'HP12',
          tenthWasteTypeContainsPops: 'Y',
          tenthWasteTypePopsString: 'Endosulfan',
          tenthWasteTypePopsConcentrationsString: '9921.75',
          tenthWasteTypePopsConcentrationUnitsString: 'mg/k',
          transactionId: 'WM2406_C7049A7F',
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
      ]);
      expect(mockFetchAll).toBeCalledTimes(1);
    });

    it("throws Not Found exception batch or rows don't exist", async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();

      mockRead.mockResolvedValueOnce({
        resource: undefined,
      } as unknown as ItemResponse<object>);

      expect(subject.downloadProducerCsv(id, accountId)).rejects.toThrow(
        Boom.notFound(),
      );
      expect(mockRead).toBeCalledTimes(1);

      mockRead.mockResolvedValueOnce({
        resource: {
          value: { id, data: {} },
        },
      } as unknown as ItemResponse<object>);

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

      expect(subject.downloadProducerCsv(id, accountId)).rejects.toThrow(
        Boom.notFound(),
      );
      expect(mockRead).toBeCalledTimes(2);
    });
  });

  describe('getRow', () => {
    it('retrieves a value with the associated id', async () => {
      const accountId = faker.string.uuid();
      const batchId = faker.string.uuid();
      const rowId = faker.string.uuid();
      const mockResponse = {
        id: rowId,
        value: {
          id: rowId,
          batchId,
          accountId,
          data: {
            valid: false,
            codes: [1, 2, 3],
          },
        },
        partitionKey: {
          accountId,
          batchId,
        },
        _rid: faker.string.sample(),
        _self: faker.string.sample(),
        _etag: faker.string.sample(),
        _attachments: faker.string.sample(),
        _ts: faker.number.bigInt(),
      };
      mockRead.mockResolvedValueOnce({
        resource: mockResponse,
      } as unknown as ItemResponse<object>);

      const result = await subject.getRow(accountId, batchId, rowId);
      expect(result).toEqual({
        id: rowId,
        batchId,
        accountId,
        data: {
          valid: false,
          codes: [1, 2, 3],
        },
      });
      expect(mockRead).toBeCalledTimes(1);
    });

    it("throws Not Found exception if key doesn't exist", async () => {
      const accountId = faker.string.uuid();
      const batchId = faker.string.uuid();
      const rowId = faker.string.uuid();
      mockRead.mockResolvedValueOnce({
        resource: undefined,
      } as unknown as ItemResponse<object>);

      expect(subject.getRow(accountId, batchId, rowId)).rejects.toThrow(
        Boom.notFound(),
      );
      expect(mockRead).toBeCalledTimes(1);
    });
  });

  describe('getColumn', () => {
    it('retrieves a value with the associated id', async () => {
      const accountId = faker.string.uuid();
      const batchId = faker.string.uuid();
      const columnRef = faker.string.sample();
      const mockResponse = {
        id: columnRef,
        value: {
          columnRef,
          batchId,
          accountId,
          errors: [
            {
              codes: [1, 2, 3],
              rowNumber: 1,
            },
          ],
        },
        partitionKey: {
          accountId,
          batchId,
        },
        _rid: faker.string.sample(),
        _self: faker.string.sample(),
        _etag: faker.string.sample(),
        _attachments: faker.string.sample(),
        _ts: faker.number.bigInt(),
      };
      mockRead.mockResolvedValueOnce({
        resource: mockResponse,
      } as unknown as ItemResponse<object>);

      const result = await subject.getColumn(accountId, batchId, columnRef);
      expect(result).toEqual({
        columnRef,
        batchId,
        accountId,
        errors: [
          {
            codes: [1, 2, 3],
            rowNumber: 1,
          },
        ],
      });
      expect(mockRead).toBeCalledTimes(1);
    });

    it("throws Not Found exception if key doesn't exist", async () => {
      const accountId = faker.string.uuid();
      const batchId = faker.string.uuid();
      const columnRef = faker.string.sample();
      mockRead.mockResolvedValueOnce({
        resource: undefined,
      } as unknown as ItemResponse<object>);

      expect(subject.getColumn(accountId, batchId, columnRef)).rejects.toThrow(
        Boom.notFound(),
      );
      expect(mockRead).toBeCalledTimes(1);
    });
  });

  describe('getBulkSubmissions', () => {
    it('retrieves a value with the associated id', async () => {
      const accountId = faker.string.uuid();
      const batchId = faker.string.uuid();
      const rowId = faker.string.uuid();
      const mockRows = [
        {
          id: rowId,
          wasteMovementId: 'WM2406_C7049A7F',
          ewcCode: faker.string.sample(),
          producerName: faker.company.name(),
          collectionDate: {
            day: faker.date.soon().getDay().toString(),
            month: faker.date.soon().getMonth().toString(),
            year: faker.date.soon().getFullYear().toString(),
          },
          _rid: faker.string.sample(),
          _self: faker.string.sample(),
          _etag: faker.string.sample(),
          _attachments: faker.string.sample(),
          _ts: faker.number.bigInt(),
        },
      ];

      const dataFetchAll = jest.fn<typeof QueryIterator.prototype.fetchAll>();

      dataFetchAll.mockResolvedValueOnce({
        resources: mockRows,
        hasMoreResults: false,
        continuation: () => null,
        continuationToken: null,
        queryMetrics: {},
        requestCharge: 0,
        activityId: '',
        headers: {},
        statusCode: 200,
      } as unknown as FeedResponse<object>);

      const countFetchAll = jest.fn<typeof QueryIterator.prototype.fetchAll>();

      countFetchAll.mockResolvedValueOnce({
        resources: [1],
        hasMoreResults: false,
        continuation: () => null,
        continuationToken: null,
        queryMetrics: {},
        requestCharge: 0,
        activityId: '',
        headers: {},
        statusCode: 200,
      } as unknown as FeedResponse<object>);

      const isCountQuery = when((arg: SqlQuerySpec) =>
        arg.query.includes('SELECT VALUE count(data)'),
      );
      const isDataQuery = when(
        (arg: SqlQuerySpec) => !arg.query.includes('SELECT VALUE count(data)'),
      );

      when(mockQuery).calledWith(isCountQuery).mockReturnValue({
        fetchNext: mockFetchNext,
        fetchAll: countFetchAll,
      });

      when(mockQuery).calledWith(isDataQuery).mockReturnValue({
        fetchNext: mockFetchNext,
        fetchAll: dataFetchAll,
      });

      const request = {
        accountId,
        batchId,
        page: 1,
        pageSize: 16,
        ewcCode: faker.string.sample(),
        producerName: faker.string.sample(),
        wasteMovementId: undefined,
        collectionDate: new Date(),
      };

      const result = await subject.getBulkSubmissions(
        batchId,
        accountId,
        request.page,
        request.pageSize,
        request.collectionDate,
        request.ewcCode,
        request.producerName,
        request.wasteMovementId,
      );
      expect(result).toEqual({
        page: request.page,
        totalPages: 1,
        totalRecords: 1,
        values: mockRows,
      });
      expect(dataFetchAll).toBeCalledTimes(1);
      expect(countFetchAll).toBeCalledTimes(1);
    });

    it('doent make unnecessary calls when provided a wasteMovementId', async () => {
      const accountId = faker.string.uuid();
      const batchId = faker.string.uuid();
      const rowId = faker.string.uuid();
      const mockRows = [
        {
          id: rowId,
          wasteMovementId: 'WM2406_C7049A7F',
          ewcCode: faker.string.sample(),
          producerName: faker.company.name(),
          collectionDate: {
            day: faker.date.soon().getDay().toString(),
            month: faker.date.soon().getMonth().toString(),
            year: faker.date.soon().getFullYear().toString(),
          },
          _rid: faker.string.sample(),
          _self: faker.string.sample(),
          _etag: faker.string.sample(),
          _attachments: faker.string.sample(),
          _ts: faker.number.bigInt(),
        },
      ];

      mockFetchAll.mockResolvedValueOnce({
        resources: mockRows,
        hasMoreResults: false,
        continuation: () => null,
        continuationToken: null,
        queryMetrics: {},
        requestCharge: 0,
        activityId: '',
        headers: {},
        statusCode: 200,
      } as unknown as FeedResponse<object>);

      const request = {
        accountId,
        batchId,
        page: 1,
        pageSize: 16,
        ewcCode: faker.string.sample(),
        producerName: faker.string.sample(),
        wasteMovementId: 'WM2406_C7049A7F',
        collectionDate: new Date(),
      };

      const result = await subject.getBulkSubmissions(
        batchId,
        accountId,
        request.page,
        request.pageSize,
        request.collectionDate,
        request.ewcCode,
        request.producerName,
        request.wasteMovementId,
      );
      expect(result).toEqual({
        page: request.page,
        totalPages: 1,
        totalRecords: 1,
        values: mockRows,
      });
      expect(mockFetchAll).toBeCalledTimes(1);
    });

    it("throws Not Found exception if key doesn't exist", async () => {
      const accountId = faker.string.uuid();
      const batchId = faker.string.uuid();
      const columnRef = faker.string.sample();
      mockRead.mockResolvedValueOnce({
        resource: undefined,
      } as unknown as ItemResponse<object>);

      expect(subject.getColumn(accountId, batchId, columnRef)).rejects.toThrow(
        Boom.notFound(),
      );
      expect(mockRead).toBeCalledTimes(1);
    });
  });
});
