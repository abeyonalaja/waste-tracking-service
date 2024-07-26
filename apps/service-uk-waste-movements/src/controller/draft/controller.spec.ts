import { faker } from '@faker-js/faker';
import { expect, jest } from '@jest/globals';
import winston from 'winston';
import SubmissionController from './controller';
import { Draft, GetDraftsResult, validation } from '../../model';
import { CosmosRepository } from '../../data';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockRepository = {
  createBulkRecords: jest.fn<CosmosRepository['createBulkRecords']>(),
  getDraft: jest.fn<CosmosRepository['getDraft']>(),
  getDrafts: jest.fn<CosmosRepository['getDrafts']>(),
};

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

const hazardousCodes = [
  {
    code: 'H1',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
  {
    code: 'H2',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
  {
    code: 'H3',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
];

const pops = [
  {
    name: {
      en: 'POP1',
      cy: 'POP1',
    },
  },
  {
    name: {
      en: 'POP2',
      cy: 'POP2',
    },
  },
  {
    name: {
      en: 'POP3',
      cy: 'POP3',
    },
  },
];

const localAuthorities = [
  {
    name: {
      en: 'Local Authority 1',
      cy: 'Local Authority 1',
    },
    country: {
      en: 'England',
      cy: 'England',
    },
  },
  {
    name: {
      en: 'Local Authority 2',
      cy: 'Local Authority 2',
    },
    country: {
      en: 'England',
      cy: 'England',
    },
  },
  {
    name: {
      en: 'Local Authority 3',
      cy: 'Local Authority 3',
    },
    country: {
      en: 'England',
      cy: 'England',
    },
  },
];

describe(SubmissionController, () => {
  const subject = new SubmissionController(
    mockRepository as unknown as CosmosRepository,
    new winston.Logger(),
    {
      ewcCodes,
      hazardousCodes,
      pops,
      localAuthorities,
    },
  );

  beforeEach(() => {
    mockRepository.createBulkRecords.mockClear();
    mockRepository.getDraft.mockClear();
    mockRepository.getDrafts.mockClear();
  });

  describe('validateSubmissions', () => {
    it('passes submission validation', async () => {
      const accountId = faker.string.uuid();
      const response = await subject.validateMultipleDrafts({
        accountId: accountId,
        padIndex: 2,
        values: [
          {
            customerReference: 'testRef',
            wasteCollectionAddressLine1: '123 Real Street',
            wasteCollectionAddressLine2: 'Real Avenue',
            wasteCollectionTownCity: 'London',
            wasteCollectionPostcode: 'SW1A 1AA',
            wasteCollectionCountry: 'England',
            wasteCollectionBrokerRegistrationNumber: 'CBDL349812',
            wasteCollectionCarrierRegistrationNumber: 'CBDL349812',
            wasteCollectionWasteSource: 'Commercial',
            wasteCollectionLocalAuthority: 'Local Authority 1',
            wasteCollectionExpectedWasteCollectionDate: '01/01/2028',
            carrierAddressLine1: '123 Real Street',
            carrierAddressLine2: '',
            carrierContactName: 'John Smith',
            carrierCountry: 'England',
            carrierContactEmail: 'john.smith@john.smith',
            carrierOrganisationName: 'Test organization',
            carrierContactPhone: '0044140000000',
            carrierPostcode: 'AB1 1AB',
            carrierTownCity: 'London',
            producerAddressLine1: '123 Real Street',
            producerAddressLine2: '',
            producerContactName: 'John Smith',
            producerCountry: 'England',
            producerContactEmail: 'john.smith@john.smith',
            producerOrganisationName: 'Test organization',
            producerContactPhone: '0044140000000',
            producerPostcode: 'AB1 1AB',
            producerSicCode: '123456',
            producerTownCity: 'London',
            receiverAuthorizationType: 'permit',
            receiverEnvironmentalPermitNumber: '123456',
            receiverOrganisationName: 'Test organization',
            receiverContactName: 'John Smith',
            receiverContactEmail: 'john.smith@testorganisation.com',
            receiverContactPhone: '0044140000000',
            receiverAddressLine1: '123 Real Street',
            receiverAddressLine2: '',
            receiverCountry: 'England',
            receiverPostcode: 'AB1 1AB',
            receiverTownCity: 'London',
            wasteTransportationNumberAndTypeOfContainers: 'test',
            wasteTransportationSpecialHandlingRequirements: 'test',
            firstWasteTypeEwcCode: '010101',
            firstWasteTypePhysicalForm: 'Solid',
            firstWasteTypeWasteDescription: 'Test waste',
            firstWasteTypeWasteQuantity: '100',
            firstWasteTypeWasteQuantityType: 'Estimate',
            firstWasteTypeWasteQuantityUnit: 'Kilogram',
            firstWasteTypeContainsPops: 'y',
            firstWasteTypeHasHazardousProperties: 'y',
            firstWasteTypeHazardousWasteCodesString: 'H1;H2;h3',
            firstWasteTypePopsString: 'POP1;POP2;POP3',
            firstWasteTypePopsConcentrationsString: '0.1;0.2;5',
            firstWasteTypePopsConcentrationUnitsString: 'g/kg;%;g/kg',
            firstWasteTypeChemicalAndBiologicalComponentsString:
              'test; test 2; test 3',
            firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
              '1;2;0.05',
            firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
              'kg;%;g/kg',
          },
        ],
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(response.value).toEqual({
        valid: true,
        accountId: accountId,
        values: [
          {
            producer: {
              reference: 'testRef',
              sicCode: '123456',
              address: {
                addressLine1: '123 Real Street',
                addressLine2: undefined,
                country: 'England',
                postcode: 'AB1 1AB',
                townCity: 'London',
              },
              contact: {
                email: 'john.smith@john.smith',
                name: 'John Smith',
                organisationName: 'Test organization',
                phone: '0044140000000',
              },
            },
            receiver: {
              authorizationType: 'permit',
              environmentalPermitNumber: '123456',
              contact: {
                organisationName: 'Test organization',
                name: 'John Smith',
                email: 'john.smith@testorganisation.com',
                phone: '0044140000000',
              },
              address: {
                addressLine1: '123 Real Street',
                addressLine2: undefined,
                country: 'England',
                postcode: 'AB1 1AB',
                townCity: 'London',
              },
            },
            wasteTypes: [
              {
                containsPops: true,
                ewcCode: '010101',
                hasHazardousProperties: true,
                hazardousWasteCodes: [
                  {
                    code: 'H1',
                    name: 'English Description',
                  },
                  {
                    code: 'H2',
                    name: 'English Description',
                  },
                  {
                    code: 'H3',
                    name: 'English Description',
                  },
                ],
                physicalForm: 'Solid',
                pops: [
                  {
                    concentration: 0.1,
                    concentrationUnit: 'g/kg',
                    name: 'POP1',
                  },
                  {
                    concentration: 0.2,
                    concentrationUnit: '%',
                    name: 'POP2',
                  },
                  {
                    concentration: 5,
                    concentrationUnit: 'g/kg',
                    name: 'POP3',
                  },
                ],
                chemicalAndBiologicalComponents: [
                  {
                    concentration: 1,
                    concentrationUnit: 'kg',
                    name: 'test',
                  },
                  {
                    concentration: 2,
                    concentrationUnit: '%',
                    name: 'test 2',
                  },
                  {
                    concentration: 0.05,
                    concentrationUnit: 'g/kg',
                    name: 'test 3',
                  },
                ],
                quantityUnit: 'Kilogram',
                wasteDescription: 'Test waste',
                wasteQuantity: 100,
                wasteQuantityType: 'EstimateData',
              },
            ],
            wasteTransportation: {
              numberAndTypeOfContainers: 'test',
              specialHandlingRequirements: 'test',
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
              localAuthority: 'Local Authority 1',
              wasteSource: 'Commercial',
            },
            carrier: {
              address: {
                addressLine1: '123 Real Street',
                addressLine2: '',
                country: 'England',
                postcode: 'AB1 1AB',
                townCity: 'London',
              },
              contact: {
                email: 'john.smith@john.smith',
                name: 'John Smith',
                organisationName: 'Test organization',
                phone: '0044140000000',
              },
            },
          },
        ],
      });
    });

    it('fails submission validation on all sections', async () => {
      const accountId = faker.string.uuid();

      const response = await subject.validateMultipleDrafts({
        accountId: accountId,
        padIndex: 2,
        values: [
          {
            customerReference: '@!"?',
            producerAddressLine1: '     ',
            producerContactName: '     ',
            producerCountry: '     ',
            producerContactEmail: 'not_an_email',
            producerOrganisationName: '     ',
            producerContactPhone: '+123567578',
            producerPostcode: '     ',
            producerSicCode: '     ',
            producerTownCity: '     ',
            wasteCollectionAddressLine1: '     ',
            wasteCollectionTownCity: '     ',
            wasteCollectionPostcode: 'AAAAAAAAAA',
            wasteCollectionCountry: '     ',
            wasteCollectionWasteSource: '     ',
            wasteCollectionLocalAuthority: '     ',
            carrierAddressLine1: '     ',
            carrierContactName: '     ',
            carrierCountry: '     ',
            carrierContactEmail: 'not_an_email',
            carrierOrganisationName: '     ',
            carrierContactPhone: '+123567578',
            carrierPostcode: 'AB1',
            carrierTownCity: '     ',
            wasteCollectionExpectedWasteCollectionDate: '31/31/2099',
            receiverAuthorizationType: '     ',
            receiverEnvironmentalPermitNumber: '     ',
            receiverOrganisationName: '     ',
            receiverContactName: '     ',
            receiverContactEmail: 'not_an_email',
            receiverContactPhone: '     ',
            receiverAddressLine1: '     ',
            receiverCountry: '     ',
            receiverPostcode: '     ',
            receiverTownCity: '     ',
            wasteTransportationNumberAndTypeOfContainers: '     ',
            wasteTransportationSpecialHandlingRequirements: '     ',
            firstWasteTypeEwcCode: '',
            firstWasteTypePhysicalForm: '',
            firstWasteTypeWasteDescription: '',
            firstWasteTypeWasteQuantity: '',
            firstWasteTypeWasteQuantityType: '',
            firstWasteTypeWasteQuantityUnit: '',
            firstWasteTypeContainsPops: '',
            firstWasteTypeHasHazardousProperties: '',
            firstWasteTypeHazardousWasteCodesString: '',
            firstWasteTypePopsString: '',
            firstWasteTypePopsConcentrationsString: '',
            firstWasteTypePopsConcentrationUnitsString: '',
            firstWasteTypeChemicalAndBiologicalComponentsString: '',
            firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
              '',
            firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
              '',
          },
        ],
      });

      const firstWasteTypeErrorCodes =
        validation.errorCodes.WasteTypeValidationErrorCode(1);

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(response.value).toEqual({
        valid: false,
        accountId: accountId,
        values: [
          {
            index: 3,
            fieldFormatErrors: [
              {
                field: 'Reference',
                code: validation.errorCodes.producerInvalidReference,
              },
              {
                field: 'Producer organisation name',
                code: validation.errorCodes.producerEmptyOrganisationName,
              },
              {
                field: 'Producer address line 1',
                code: validation.errorCodes.producerEmptyAddressLine1,
              },
              {
                field: 'Producer town or city',
                code: validation.errorCodes.producerEmptyTownOrCity,
              },
              {
                field: 'Producer country',
                code: validation.errorCodes.producerEmptyCountry,
              },
              {
                field: 'Producer contact name',
                code: validation.errorCodes.producerEmptyContactFullName,
              },
              {
                field: 'Producer contact phone number',
                code: validation.errorCodes.producerInvalidPhone,
              },
              {
                field: 'Producer contact email address',
                code: validation.errorCodes.producerInvalidEmail,
              },
              {
                field: 'Producer Standard Industrial Classification (SIC) code',
                code: validation.errorCodes.producerInvalidSicCode,
              },
              {
                field: 'Waste Collection Details Address Line 1',
                code: validation.errorCodes.wasteCollectionEmptyAddressLine1,
              },
              {
                field: 'Waste Collection Details Town or City',
                code: validation.errorCodes.wasteCollectionEmptyTownOrCity,
              },
              {
                field: 'Waste Collection Details Country',
                code: validation.errorCodes.wasteCollectionEmptyCountry,
              },
              {
                field: 'Waste Collection Details Postcode',
                code: validation.errorCodes.wasteCollectionInvalidPostcode,
              },
              {
                field: 'Waste Collection Details Waste Source',
                code: validation.errorCodes.wasteCollectionMissingWasteSource,
              },
              {
                field: 'Local authority',
                code: validation.errorCodes.wasteCollectionEmptyLocalAuthority,
              },
              {
                field:
                  'Waste Collection Details Expected Waste Collection Date',
                code: validation.errorCodes
                  .wasteCollectionInvalidFormatWasteCollectionDate,
              },
              {
                field: 'Carrier organisation name',
                code: validation.errorCodes.carrierEmptyOrganisationName,
              },
              {
                field: 'Carrier address line 1',
                code: validation.errorCodes.carrierEmptyAddressLine1,
              },
              {
                field: 'Carrier town or city',
                code: validation.errorCodes.carrierEmptyTownOrCity,
              },
              {
                field: 'Carrier country',
                code: validation.errorCodes.carrierEmptyCountry,
              },
              {
                field: 'Carrier postcode',
                code: validation.errorCodes.carrierInvalidPostcode,
              },
              {
                field: 'Carrier contact name',
                code: validation.errorCodes.carrierEmptyContactFullName,
              },
              {
                field: 'Carrier contact phone number',
                code: validation.errorCodes.carrierInvalidPhone,
              },
              {
                field: 'Carrier contact email address',
                code: validation.errorCodes.carrierInvalidEmail,
              },
              {
                field: 'Receiver authorization type',
                code: validation.errorCodes.receiverEmptyAuthorizationType,
              },
              {
                field: 'Receiver organisation name',
                code: validation.errorCodes.receiverEmptyOrganisationName,
              },
              {
                field: 'Receiver address line 1',
                code: validation.errorCodes.receiverEmptyAddressLine1,
              },
              {
                field: 'Receiver town or city',
                code: validation.errorCodes.receiverEmptyTownOrCity,
              },
              {
                field: 'Receiver country',
                code: validation.errorCodes.receiverEmptyCountry,
              },
              {
                field: 'Receiver contact name',
                code: validation.errorCodes.receiverEmptyContactFullName,
              },
              {
                field: 'Receiver contact phone number',
                code: validation.errorCodes.receiverInvalidPhone,
              },
              {
                field: 'Receiver contact email address',
                code: validation.errorCodes.receiverInvalidEmail,
              },
              {
                field: 'Number and type of transportation containers',
                code: validation.errorCodes
                  .wasteTransportationEmptyNameAndTypeOfContainers,
              },
              {
                field: 'EWC Code',
                code: firstWasteTypeErrorCodes.emptyEwcCode,
              },
              {
                field: 'Waste Description',
                code: firstWasteTypeErrorCodes.emptyWasteDescription,
              },
              {
                field: 'Physical Form',
                code: firstWasteTypeErrorCodes.emptyPhysicalForm,
              },
              {
                field: 'Waste Quantity',
                code: firstWasteTypeErrorCodes.emptyWasteQuantity,
              },
              {
                field: 'Waste Quantity Units',
                code: firstWasteTypeErrorCodes.emptyWasteQuantityUnit,
              },
              {
                field: 'Quantity of waste (actual or estimate)',
                code: firstWasteTypeErrorCodes.invalidWasteQuantityType,
              },
              {
                field: 'Chemical and biological components of the waste',
                code: firstWasteTypeErrorCodes.emptyChemicalAndBiologicalComponents,
              },
              {
                field: 'Chemical and biological concentration values',
                code: firstWasteTypeErrorCodes.emptyChemicalAndBiologicalConcentration,
              },
              {
                field: 'Chemical and biological concentration units of measure',
                code: firstWasteTypeErrorCodes.emptyChemicalAndBiologicalConcentrationUnit,
              },
              {
                field: 'Waste Has Hazardous Properties',
                code: firstWasteTypeErrorCodes.invalidHasHazardousProperties,
              },
              {
                field: 'Waste Contains POPs',
                code: firstWasteTypeErrorCodes.invalidContainsPops,
              },
            ],
            invalidStructureErrors: [],
          },
        ],
      });
    });
  });

  describe('createSubmissions', () => {
    it('creates submissions', async () => {
      const response = await subject.createMultipleDrafts({
        accountId: faker.string.uuid(),
        values: [
          {
            id: faker.string.uuid(),
            transactionId: 'WM2406_C7049A7F',
            wasteTransportation: {
              numberAndTypeOfContainers: 'test',
              specialHandlingRequirements: 'test',
            },
            wasteCollection: {
              address: {
                addressLine1: 'Waste Collection Address Line 1',
                addressLine2: 'Waste Collection Address Line 2',
                country: 'Waste Collection Country',
                postcode: 'Waste Collection Postcode',
                townCity: 'Waste Collection Town/City',
              },
              expectedWasteCollectionDate: {
                day: '01',
                month: '01',
                year: '2024',
              },
              wasteSource: 'Commercial',
              localAuthority: 'Local Authority 1',
              brokerRegistrationNumber:
                'Waste Collection Broker Registration Number',
              carrierRegistrationNumber:
                'Waste Collection Carrier Registration Number',
            },
            carrier: {
              address: {
                addressLine1: 'Carrier Address Line 1',
                addressLine2: 'Carrier Address Line 2',
                country: 'Carrier Country',
                postcode: 'Carrier Postcode',
                townCity: 'Carrier Town/City',
              },
              contact: {
                email: 'Carrier Email',
                name: 'Carrier Contact Name',
                organisationName: 'Carrier Organisation Name',
                phone: 'Carrier Phone',
              },
            },
            wasteTypes: [
              {
                ewcCode: '01 03 04',
                wasteDescription: 'waste description',
                physicalForm: 'Solid',
                wasteQuantity: 100,
                quantityUnit: 'Tonne',
                wasteQuantityType: 'ActualData',
                hasHazardousProperties: false,
                containsPops: false,
                chemicalAndBiologicalComponents: [
                  {
                    concentration: 1,
                    name: 'test',
                    concentrationUnit: 'Milligram',
                  },
                ],
                hazardousWasteCodes: [
                  {
                    code: 'HP1',
                    name: 'test',
                  },
                ],
                pops: [
                  {
                    concentration: 1,
                    name: 'test',
                    concentrationUnit: 'Milligram',
                  },
                ],
              },
            ],
            receiver: {
              address: {
                addressLine1: 'Receiver Address Line 1',
                addressLine2: 'Receiver Address Line 2',
                country: 'Receiver Country',
                postcode: 'Receiver Postcode',
                townCity: 'Receiver Town/City',
              },
              contact: {
                email: 'Receiver Email',
                name: 'Receiver Contact Name',
                organisationName: 'Receiver Organisation Name',
                phone: 'Receiver Phone',
              },
              authorizationType: 'permit',
              environmentalPermitNumber: '123456',
            },
            producer: {
              reference: 'ref',
              sicCode: '123456',
              address: {
                addressLine1: 'Producer Address Line 1',
                addressLine2: 'Producer Address Line 2',
                country: 'Producer Country',
                postcode: 'Producer Postcode',
                townCity: 'Producer Town/City',
              },
              contact: {
                email: 'Producer Email',
                name: 'Producer Contact Name',
                organisationName: 'Producer Organisation Name',
                phone: 'Producer Phone',
              },
            },
          },
        ],
      });
      expect(response.success).toBe(true);
      if (response.success) {
        expect(mockRepository.createBulkRecords).toBeCalled();
        return;
      }
    });
  });

  describe('getDraft', () => {
    it('successfully returns value from the repository', async () => {
      const id = faker.string.uuid();
      const value: Draft = {
        id: id,
        transactionId: '',
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          status: 'NotStarted',
        },
        producerAndCollection: {
          status: 'NotStarted',
        },
        carrier: {
          status: 'NotStarted',
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };
      mockRepository.getDraft.mockResolvedValue(value);
      const response = await subject.getDraft({ id });
      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.value.id).toEqual(id);
      }
    });
  });

  describe('getDrafts', () => {
    it('successfully returns data from the repository', async () => {
      const mockData: GetDraftsResult = {
        page: 1,
        totalPages: 1,
        totalRecords: 1,
        values: [
          {
            id: faker.string.uuid(),
            producerName: faker.company.name(),
            wasteMovementId: 'WM24_0019ACAD',
            ewcCode: '01 01 01',
            collectionDate: {
              day: '01',
              month: '01',
              year: '2024',
            },
          },
        ],
      };

      mockRepository.getDrafts.mockResolvedValue(mockData);

      const response = await subject.getDrafts({ page: 1, pageSize: 10 });

      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.value).toEqual(mockData);
        return;
      }
    });
  });
});
