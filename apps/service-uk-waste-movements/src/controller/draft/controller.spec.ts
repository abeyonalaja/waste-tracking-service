import { faker } from '@faker-js/faker';
import { expect, jest } from '@jest/globals';
import winston from 'winston';
import SubmissionController from './controller';
import { Draft, GetDraftsResult, validation } from '../../model';
import { CosmosRepository } from '../../data';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateDraftSicCodeRequest,
  DeleteDraftSicCodeRequest,
  SetDraftProducerAddressDetailsRequest,
  SetDraftProducerContactDetailRequest,
  SetDraftWasteCollectionAddressDetailsRequest,
  SetDraftWasteSourceRequest,
  SetDraftCarrierAddressDetailsRequest,
  SetDraftReceiverAddressDetailsRequest,
  SetDraftProducerConfirmationRequest,
} from '@wts/api/uk-waste-movements';
jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockUuid = jest.fn<typeof uuidv4>();

jest.mock('uuid', () => ({
  v4: () => mockUuid(),
}));

jest
  .useFakeTimers({
    advanceTimers: false,
  })
  .setSystemTime(new Date(2022, 2, 1));

const mockRepository = {
  createBulkRecords: jest.fn<CosmosRepository['createBulkRecords']>(),
  getDraft: jest.fn<CosmosRepository['getDraft']>(),
  getDrafts: jest.fn<CosmosRepository['getDrafts']>(),
  saveRecord: jest.fn<CosmosRepository['saveRecord']>(),
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

const sicCodes = [
  {
    code: '01110',
    description: {
      en: 'Growing of cereals (except rice), leguminous crops and oil seeds',
      cy: 'Tyfu grawn (heblaw rîs), cnydau llygadlys a hadau olew',
    },
  },
  {
    code: '01120',
    description: {
      en: 'Growing of rice',
      cy: 'Tyfu rîs',
    },
  },
  {
    code: '01130',
    description: {
      en: 'Growing of vegetables and melons, roots and tubers',
      cy: 'Tyfu llysiau a melynnau, gwreiddiau a thwberau',
    },
  },
  {
    code: '01140',
    description: {
      en: 'Growing of sugar cane',
      cy: 'Tyfu siwgr',
    },
  },
  {
    code: '01150',
    description: {
      en: 'Growing of tobacco',
      cy: 'Tyfu tybaco',
    },
  },
  {
    code: '01160',
    description: {
      en: 'Growing of fibre crops',
      cy: 'Tyfu cnydau ffibr',
    },
  },
  {
    code: '01190',
    description: {
      en: 'Growing of other non-perennial crops',
      cy: 'Tyfu cnydau anhynodol eraill',
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
      sicCodes,
    },
  );

  beforeEach(() => {
    mockRepository.createBulkRecords.mockClear();
    mockRepository.getDraft.mockClear();
    mockRepository.getDrafts.mockClear();
    mockRepository.saveRecord.mockClear();
    mockUuid.mockClear();
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
              permitDetails: {
                authorizationType: 'permit',
                environmentalPermitNumber: '123456',
              },
              contact: {
                organisationName: 'Test organization',
                name: 'John Smith',
                email: 'john.smith@testorganisation.com',
                phone: '0044140000000',
              },
              address: {
                addressLine1: '123 Real Street',
                addressLine2: '',
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
              permitDetails: {
                authorizationType: 'permit',
                environmentalPermitNumber: '123456',
              },
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
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            address: {
              status: 'NotStarted',
            },
            contact: {
              status: 'NotStarted',
            },
            sicCodes: {
              status: 'NotStarted',
              values: [],
            },
            reference: '123456',
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'NotStarted',
            },
            brokerRegistrationNumber: '',
            carrierRegistrationNumber: '',
            expectedWasteCollectionDate: {
              day: '',
              month: '',
              year: '',
            },
            localAuthority: '',
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
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
      const response = await subject.getDraft({
        id,
        accountId: faker.string.uuid(),
      });
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

  describe('createDraft', () => {
    it('successfully creates a draft using the repository', async () => {
      const accountId = faker.string.uuid();
      const id = faker.string.uuid();
      const ref = 'testRef';

      mockRepository.saveRecord.mockResolvedValue();
      mockUuid.mockReturnValue(id);

      const response = await subject.createDraft({ accountId, reference: ref });

      const expectedDraft: Draft = {
        carrier: {
          address: { status: 'NotStarted' },
          contact: { status: 'NotStarted' },
          modeOfTransport: { status: 'NotStarted' },
        },
        declaration: { status: 'CannotStart' },
        id: id,
        producerAndCollection: {
          producer: {
            address: { status: 'NotStarted' },
            contact: { status: 'NotStarted' },
            reference: 'testRef',
            sicCodes: {
              status: 'NotStarted',
              values: [],
            },
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'NotStarted',
            },
          },
          confimation: {
            status: 'NotStarted',
          },
        },

        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        state: { status: 'InProgress', timestamp: new Date() },
        wasteInformation: { status: 'NotStarted' },
      };

      expect(response.success).toBe(true);
      expect(mockRepository.saveRecord).toHaveBeenCalledWith(
        'drafts',
        expectedDraft,
        accountId,
      );
      expect(response.success).toBe(true);
      if (response.success) {
        expect(response.value.producerAndCollection.producer.reference).toBe(
          ref,
        );
      }
    });
  });

  describe('getDraftProducerAddressDetails', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const draft: Draft = {
      id: id,
      wasteInformation: {
        status: 'NotStarted',
      },
      receiver: {
        address: {
          status: 'NotStarted',
        },
        contact: {
          status: 'NotStarted',
        },
        permitDetails: {
          status: 'NotStarted',
        },
      },
      producerAndCollection: {
        producer: {
          reference: 'testRef',
          sicCodes: {
            status: 'Complete',
            values: ['01110'],
          },
          contact: {
            status: 'Complete',
            organisationName: 'Test Organisation',
            name: 'Test Name',
            email: 'test@example.com',
            phone: '0123456789',
          },
          address: {
            status: 'Complete',
            buildingNameOrNumber: '123',
            addressLine1: '123 Main St',
            addressLine2: 'Building 1',
            townCity: 'London',
            postcode: 'SW1A 1AA',
            country: 'England [EN]',
          },
        },
        wasteCollection: {
          wasteSource: {
            status: 'Complete',
            value: 'Industrial',
          },
          brokerRegistrationNumber: 'BRN123456',
          carrierRegistrationNumber: 'CRN123456',
          localAuthority: 'Local Authority 1',
          expectedWasteCollectionDate: {
            day: '01',
            month: '01',
            year: '2025',
          },
          address: {
            status: 'Complete',
            addressLine1: '123 Main St',
            addressLine2: 'Building 2',
            townCity: 'London',
            postcode: 'SW1A 1AA',
            country: 'England [EN]',
          },
        },
        confimation: {
          status: 'Complete',
        },
      },
      carrier: {
        address: {
          status: 'NotStarted',
        },
        contact: {
          status: 'NotStarted',
        },
        modeOfTransport: {
          status: 'NotStarted',
        },
      },
      declaration: {
        status: 'NotStarted',
      },
      state: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    };

    it('successfully returns the producer address details', async () => {
      mockRepository.getDraft.mockResolvedValue(draft);

      const response = await subject.getDraftProducerAddressDetails({
        id,
        accountId,
      });

      if (response) {
        expect(response.success).toBe(true);
        if (response.success) {
          expect(response.value).toEqual({
            status: 'Complete',
            buildingNameOrNumber: '123',
            addressLine1: '123 Main St',
            addressLine2: 'Building 1',
            townCity: 'London',
            postcode: 'SW1A 1AA',
            country: 'England [EN]',
          });
        }
      }
    });
  });

  describe('setDraftProducerAddressDetails', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const draft: Draft = {
      id: id,
      wasteInformation: {
        status: 'NotStarted',
      },
      receiver: {
        address: {
          status: 'NotStarted',
        },
        contact: {
          status: 'NotStarted',
        },
        permitDetails: {
          status: 'NotStarted',
        },
      },
      producerAndCollection: {
        producer: {
          reference: 'testRef',
          sicCodes: {
            status: 'Complete',
            values: ['01110'],
          },
          contact: {
            status: 'Complete',
            organisationName: 'Test Organisation',
            name: 'Test Name',
            email: 'test@example.com',
            phone: '0123456789',
          },
          address: {
            status: 'Started',
            buildingNameOrNumber: '123123',
            addressLine1: '123123 Main St',
            addressLine2: 'Building 123',
            townCity: 'Manchester',
            postcode: 'SW1A 1AB',
            country: 'Albania [AB]',
          },
        },
        wasteCollection: {
          wasteSource: {
            status: 'Complete',
            value: 'Industrial',
          },
          brokerRegistrationNumber: 'BRN123456',
          carrierRegistrationNumber: 'CRN123456',
          localAuthority: 'Local Authority 1',
          expectedWasteCollectionDate: {
            day: '01',
            month: '01',
            year: '2025',
          },
          address: {
            status: 'Complete',
            addressLine1: '123 Main St',
            addressLine2: 'Building 2',
            townCity: 'London',
            postcode: 'SW1A 1AA',
            country: 'England [EN]',
          },
        },
        confimation: {
          status: 'Complete',
        },
      },
      carrier: {
        address: {
          status: 'NotStarted',
        },
        contact: {
          status: 'NotStarted',
        },
        modeOfTransport: {
          status: 'NotStarted',
        },
      },
      declaration: {
        status: 'NotStarted',
      },
      state: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    };

    it('successfully sets the producer address details', async () => {
      const updatedDraft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'testRef',
            sicCodes: {
              status: 'Complete',
              values: ['01110'],
            },
            contact: {
              status: 'Complete',
              organisationName: 'Test Organisation',
              name: 'Test Name',
              email: 'test@example.com',
              phone: '0123456789',
            },
            address: {
              status: 'Complete',
              buildingNameOrNumber: '123',
              addressLine1: '123 Real Street',
              addressLine2: 'Real Avenue',
              townCity: 'London',
              postcode: 'SW1A 1AA',
              country: 'England',
            },
          },
          wasteCollection: {
            wasteSource: {
              status: 'Complete',
              value: 'Industrial',
            },
            brokerRegistrationNumber: 'BRN123456',
            carrierRegistrationNumber: 'CRN123456',
            localAuthority: 'Local Authority 1',
            expectedWasteCollectionDate: {
              day: '01',
              month: '01',
              year: '2025',
            },
            address: {
              status: 'Complete',
              addressLine1: '123 Main St',
              addressLine2: 'Building 2',
              townCity: 'London',
              postcode: 'SW1A 1AA',
              country: 'England [EN]',
            },
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'InProgress',
          timestamp: new Date(),
        },
      };

      const request: SetDraftProducerAddressDetailsRequest = {
        id: id,
        accountId: accountId,
        value: {
          buildingNameOrNumber: '123',
          addressLine1: '123 Real Street',
          addressLine2: 'Real Avenue',
          townCity: 'London',
          postcode: 'SW1A 1AA',
          country: 'England',
        },
        saveAsDraft: false,
      };

      mockRepository.getDraft.mockResolvedValue(draft);

      const response = await subject.setDraftProducerAddressDetails(request);

      expect(mockRepository.getDraft).toHaveBeenCalledWith(
        'drafts',
        id,
        accountId,
      );
      expect(mockRepository.saveRecord).toHaveBeenCalledWith(
        'drafts',
        updatedDraft,
        accountId,
      );

      if (response.success) {
        expect(response.value).toBeUndefined();
      }
    });
  });

  describe('getDraftProducerContactDetail', () => {
    it('successfully gets producer contact detail from a draft', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const draft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'producerRef123',
            sicCodes: {
              status: 'Complete',
              values: ['12345'],
            },
            contact: {
              status: 'Started',
              organisationName: 'Producer Org',
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
              phone: '987-654-3210',
              fax: '123-456-7890',
            },
            address: {
              status: 'Complete',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
          },
          wasteCollection: {
            wasteSource: {
              status: 'Complete',
              value: 'Commercial',
            },
            brokerRegistrationNumber: 'BRN123456',
            carrierRegistrationNumber: 'CRN654321',
            localAuthority: 'Local Authority Name',
            expectedWasteCollectionDate: {
              day: '01',
              month: '01',
              year: '2025',
            },
            address: {
              status: 'Complete',
              addressLine1: '456 Secondary St',
              addressLine2: 'Building 2',
              townCity: 'Othertown',
              postcode: '67890',
              country: 'CountryName',
            },
          },
          confimation: {
            status: 'Complete',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };
      mockRepository.getDraft.mockResolvedValue(draft);
      const response = await subject.getDraftProducerContactDetail({
        id,
        accountId,
      });
      expect(response).toEqual({
        success: true,
        value: {
          status: 'Started',
          organisationName: 'Producer Org',
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          phone: '987-654-3210',
          fax: '123-456-7890',
        },
      });
    });

    it('returns status not started if producer and collection status is neither complete or started', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const draft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            address: {
              status: 'NotStarted',
            },
            contact: {
              status: 'NotStarted',
            },
            sicCodes: {
              status: 'NotStarted',
              values: [],
            },
            reference: '123456',
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'NotStarted',
            },
            brokerRegistrationNumber: '',
            carrierRegistrationNumber: '',
            expectedWasteCollectionDate: {
              day: '',
              month: '',
              year: '',
            },
            localAuthority: '',
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };
      mockRepository.getDraft.mockResolvedValue(draft);
      const response = await subject.getDraftProducerContactDetail({
        id,
        accountId,
      });
      expect(response).toEqual({
        success: true,
        value: {
          status: 'NotStarted',
        },
      });
    });
  });

  describe('setDraftProducerContactDetail', () => {
    it('successfully sets producer contact detail on a draft', async () => {
      const accountId = faker.string.uuid();
      const id = faker.string.uuid();
      const initialDraft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'producerRef123',
            sicCodes: {
              status: 'Complete',
              values: ['12345'],
            },
            contact: {
              status: 'Started',
              organisationName: 'Producer Org',
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
            },
            address: {
              status: 'Complete',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'NotStarted',
            },
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };
      mockRepository.getDraft.mockResolvedValue(initialDraft);
      const request: SetDraftProducerContactDetailRequest = {
        id: id,
        accountId: accountId,
        value: {
          organisationName: 'Producer Org',
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
        },
        saveAsDraft: true,
      };
      const response = await subject.setDraftProducerContactDetail(request);
      const expectedDraft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'producerRef123',
            sicCodes: {
              status: 'Complete',
              values: ['12345'],
            },
            contact: {
              status: 'Started',
              organisationName: 'Producer Org',
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
            },
            address: {
              status: 'Complete',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'NotStarted',
            },
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };

      expect(response.success).toBe(true);
      expect(mockRepository.getDraft).toHaveBeenCalledWith(
        'drafts',
        id,
        accountId,
      );
      expect(mockRepository.saveRecord).toHaveBeenCalledWith(
        'drafts',
        expectedDraft,
        accountId,
      );
      if (response.success) {
        expect(response.value).toBeUndefined();
      }
    });
  });

  describe('getDraftWasteSource', () => {
    it('successfully gets waste source from a draft', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const draft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'producerRef123',
            sicCodes: {
              status: 'Complete',
              values: ['12345'],
            },
            contact: {
              status: 'Started',
              organisationName: 'Producer Org',
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
              phone: '987-654-3210',
              fax: '123-456-7890',
            },
            address: {
              status: 'Complete',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
          },
          wasteCollection: {
            wasteSource: {
              status: 'Complete',
              value: 'Commercial',
            },
            brokerRegistrationNumber: 'BRN123456',
            carrierRegistrationNumber: 'CRN654321',
            localAuthority: 'Local Authority Name',
            expectedWasteCollectionDate: {
              day: '01',
              month: '01',
              year: '2025',
            },
            address: {
              status: 'Complete',
              addressLine1: '456 Secondary St',
              addressLine2: 'Building 2',
              townCity: 'Othertown',
              postcode: '67890',
              country: 'CountryName',
            },
          },
          confimation: {
            status: 'Complete',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };
      mockRepository.getDraft.mockResolvedValue(draft);
      const response = await subject.getDraftWasteSource({
        id,
        accountId,
      });
      expect(response).toEqual({
        success: true,
        value: {
          status: 'Complete',
          value: 'Commercial',
        },
      });
    });

    it('returns status not started if producer and collection status is neither complete or started', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const draft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            address: {
              status: 'NotStarted',
            },
            contact: {
              status: 'NotStarted',
            },
            sicCodes: {
              status: 'NotStarted',
              values: [],
            },
            reference: '123456',
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'NotStarted',
            },
            brokerRegistrationNumber: '',
            carrierRegistrationNumber: '',
            expectedWasteCollectionDate: {
              day: '',
              month: '',
              year: '',
            },
            localAuthority: '',
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };
      mockRepository.getDraft.mockResolvedValue(draft);
      const response = await subject.getDraftWasteSource({
        id,
        accountId,
      });
      expect(response).toEqual({
        success: true,
        value: {
          status: 'NotStarted',
        },
      });
    });
  });

  describe('setWasteSource', () => {
    it('successfully sets waste source', async () => {
      const accountId = faker.string.uuid();
      const id = faker.string.uuid();
      const initialDraft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'producerRef123',
            sicCodes: {
              status: 'Complete',
              values: ['12345'],
            },
            contact: {
              status: 'Started',
              organisationName: 'Producer Org',
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
            },
            address: {
              status: 'Complete',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'NotStarted',
            },
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };
      mockRepository.getDraft.mockResolvedValue(initialDraft);
      const request: SetDraftWasteSourceRequest = {
        id: id,
        accountId: accountId,
        wasteSource: 'Industrial',
      };
      const response = await subject.setDraftWasteSource(request);
      const expectedDraft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'producerRef123',
            sicCodes: {
              status: 'Complete',
              values: ['12345'],
            },
            contact: {
              status: 'Started',
              organisationName: 'Producer Org',
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
            },
            address: {
              status: 'Complete',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'Complete',
              value: 'Industrial',
            },
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };

      expect(response.success).toBe(true);
      expect(mockRepository.getDraft).toHaveBeenCalledWith(
        'drafts',
        id,
        accountId,
      );
      expect(mockRepository.saveRecord).toHaveBeenCalledWith(
        'drafts',
        expectedDraft,
        accountId,
      );
      if (response.success) {
        expect(response.value).toBeUndefined();
      }
    });
  });

  describe('getDraftWasteSource', () => {
    it('successfully gets waste source from a draft', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const draft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'producerRef123',
            sicCodes: {
              status: 'Complete',
              values: ['12345'],
            },
            contact: {
              status: 'Started',
              organisationName: 'Producer Org',
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
              phone: '987-654-3210',
              fax: '123-456-7890',
            },
            address: {
              status: 'Complete',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
          },
          wasteCollection: {
            wasteSource: {
              status: 'Complete',
              value: 'Commercial',
            },
            brokerRegistrationNumber: 'BRN123456',
            carrierRegistrationNumber: 'CRN654321',
            localAuthority: 'Local Authority Name',
            expectedWasteCollectionDate: {
              day: '01',
              month: '01',
              year: '2025',
            },
            address: {
              status: 'Complete',
              addressLine1: '456 Secondary St',
              addressLine2: 'Building 2',
              townCity: 'Othertown',
              postcode: '67890',
              country: 'CountryName',
            },
          },
          confimation: {
            status: 'Complete',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };
      mockRepository.getDraft.mockResolvedValue(draft);
      const response = await subject.getDraftWasteSource({
        id,
        accountId,
      });
      expect(response).toEqual({
        success: true,
        value: {
          status: 'Complete',
          value: 'Commercial',
        },
      });
    });

    it('returns status not started if producer and collection status is neither complete or started', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const draft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            address: {
              status: 'NotStarted',
            },
            contact: {
              status: 'NotStarted',
            },
            sicCodes: {
              status: 'NotStarted',
              values: [],
            },
            reference: '123456',
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'NotStarted',
            },
            brokerRegistrationNumber: '',
            carrierRegistrationNumber: '',
            expectedWasteCollectionDate: {
              day: '',
              month: '',
              year: '',
            },
            localAuthority: '',
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };
      mockRepository.getDraft.mockResolvedValue(draft);
      const response = await subject.getDraftWasteSource({
        id,
        accountId,
      });
      expect(response).toEqual({
        success: true,
        value: {
          status: 'NotStarted',
        },
      });
    });
  });

  describe('setWasteSource', () => {
    it('successfully sets waste source', async () => {
      const accountId = faker.string.uuid();
      const id = faker.string.uuid();
      const initialDraft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'producerRef123',
            sicCodes: {
              status: 'Complete',
              values: ['12345'],
            },
            contact: {
              status: 'Started',
              organisationName: 'Producer Org',
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
            },
            address: {
              status: 'Complete',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'NotStarted',
            },
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };
      mockRepository.getDraft.mockResolvedValue(initialDraft);
      const request: SetDraftWasteSourceRequest = {
        id: id,
        accountId: accountId,
        wasteSource: 'Industrial',
      };
      const response = await subject.setDraftWasteSource(request);
      const expectedDraft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'producerRef123',
            sicCodes: {
              status: 'Complete',
              values: ['12345'],
            },
            contact: {
              status: 'Started',
              organisationName: 'Producer Org',
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
            },
            address: {
              status: 'Complete',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'Complete',
              value: 'Industrial',
            },
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };

      expect(response.success).toBe(true);
      expect(mockRepository.getDraft).toHaveBeenCalledWith(
        'drafts',
        id,
        accountId,
      );
      expect(mockRepository.saveRecord).toHaveBeenCalledWith(
        'drafts',
        expectedDraft,
        accountId,
      );
      if (response.success) {
        expect(response.value).toBeUndefined();
      }
    });
  });

  describe('getDraftWasteCollectionAddressDetails', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const draft: Draft = {
      id: id,
      wasteInformation: {
        status: 'NotStarted',
      },
      receiver: {
        address: {
          status: 'NotStarted',
        },
        contact: {
          status: 'NotStarted',
        },
        permitDetails: {
          status: 'NotStarted',
        },
      },
      producerAndCollection: {
        producer: {
          reference: 'testRef',
          sicCodes: {
            status: 'Complete',
            values: ['01110'],
          },
          contact: {
            status: 'Complete',
            organisationName: 'Test Organisation',
            name: 'Test Name',
            email: 'test@example.com',
            phone: '0123456789',
          },
          address: {
            status: 'Complete',
            buildingNameOrNumber: '123',
            addressLine1: '123 Main St',
            addressLine2: 'Building 1',
            townCity: 'London',
            postcode: 'SW1A 1AA',
            country: 'England [EN]',
          },
        },
        wasteCollection: {
          wasteSource: {
            status: 'Complete',
            value: 'Industrial',
          },
          brokerRegistrationNumber: 'BRN123456',
          carrierRegistrationNumber: 'CRN123456',
          localAuthority: 'Local Authority 1',
          expectedWasteCollectionDate: {
            day: '01',
            month: '01',
            year: '2025',
          },
          address: {
            status: 'Complete',
            addressLine1: '123 Main St',
            addressLine2: 'Building 2',
            townCity: 'London',
            postcode: 'SW1A 1AA',
            country: 'England [EN]',
          },
        },
        confimation: {
          status: 'Complete',
        },
      },
      carrier: {
        address: {
          status: 'NotStarted',
        },
        contact: {
          status: 'NotStarted',
        },
        modeOfTransport: {
          status: 'NotStarted',
        },
      },
      declaration: {
        status: 'NotStarted',
      },
      state: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    };

    it('successfully returns the waste collection address details', async () => {
      mockRepository.getDraft.mockResolvedValue(draft);

      const response = await subject.getDraftWasteCollectionAddressDetails({
        id,
        accountId,
      });

      if (response) {
        expect(response.success).toBe(true);
        if (response.success) {
          expect(response.value).toEqual({
            status: 'Complete',
            addressLine1: '123 Main St',
            addressLine2: 'Building 2',
            townCity: 'London',
            postcode: 'SW1A 1AA',
            country: 'England [EN]',
          });
        }
      }
    });
  });

  describe('setDraftWasteCollectionAddressDetails', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const draft: Draft = {
      id: id,
      wasteInformation: {
        status: 'NotStarted',
      },
      receiver: {
        address: {
          status: 'NotStarted',
        },
        contact: {
          status: 'NotStarted',
        },
        permitDetails: {
          status: 'NotStarted',
        },
      },
      producerAndCollection: {
        producer: {
          reference: 'testRef',
          sicCodes: {
            status: 'Complete',
            values: ['01110'],
          },
          contact: {
            status: 'Complete',
            organisationName: 'Test Organisation',
            name: 'Test Name',
            email: 'test@example.com',
            phone: '0123456789',
          },
          address: {
            status: 'Started',
            buildingNameOrNumber: '123123',
            addressLine1: '123123 Main St',
            addressLine2: 'Building 123',
            townCity: 'Manchester',
            postcode: 'SW1A 1AB',
            country: 'Albania [AB]',
          },
        },
        wasteCollection: {
          wasteSource: {
            status: 'Complete',
            value: 'Industrial',
          },
          brokerRegistrationNumber: 'BRN123456',
          carrierRegistrationNumber: 'CRN123456',
          localAuthority: 'Local Authority 1',
          expectedWasteCollectionDate: {
            day: '01',
            month: '01',
            year: '2025',
          },
          address: {
            status: 'Started',
            addressLine1: '123 Main St',
            townCity: 'London',
          },
        },
        confimation: {
          status: 'Complete',
        },
      },
      carrier: {
        address: {
          status: 'NotStarted',
        },
        contact: {
          status: 'NotStarted',
        },
        modeOfTransport: {
          status: 'NotStarted',
        },
      },
      declaration: {
        status: 'NotStarted',
      },
      state: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    };

    it('successfully sets the waste collection address details', async () => {
      const updatedDraft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'testRef',
            sicCodes: {
              status: 'Complete',
              values: ['01110'],
            },
            contact: {
              status: 'Complete',
              organisationName: 'Test Organisation',
              name: 'Test Name',
              email: 'test@example.com',
              phone: '0123456789',
            },
            address: {
              status: 'Started',
              buildingNameOrNumber: '123123',
              addressLine1: '123123 Main St',
              addressLine2: 'Building 123',
              townCity: 'Manchester',
              postcode: 'SW1A 1AB',
              country: 'Albania [AB]',
            },
          },
          wasteCollection: {
            wasteSource: {
              status: 'Complete',
              value: 'Industrial',
            },
            brokerRegistrationNumber: 'BRN123456',
            carrierRegistrationNumber: 'CRN123456',
            localAuthority: 'Local Authority 1',
            expectedWasteCollectionDate: {
              day: '01',
              month: '01',
              year: '2025',
            },
            address: {
              status: 'Complete',
              buildingNameOrNumber: '123',
              addressLine1: '123 Real Street',
              addressLine2: 'Real Avenue',
              townCity: 'London',
              postcode: 'SW1A 1AA',
              country: 'England',
            },
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'InProgress',
          timestamp: new Date(),
        },
      };

      const request: SetDraftWasteCollectionAddressDetailsRequest = {
        id: id,
        accountId: accountId,
        value: {
          buildingNameOrNumber: '123',
          addressLine1: '123 Real Street',
          addressLine2: 'Real Avenue',
          townCity: 'London',
          postcode: 'SW1A 1AA',
          country: 'England',
        },
        saveAsDraft: false,
      };

      mockRepository.getDraft.mockResolvedValue(draft);

      const response =
        await subject.setDraftWasteCollectionAddressDetails(request);

      expect(mockRepository.getDraft).toHaveBeenCalledWith(
        'drafts',
        id,
        accountId,
      );
      expect(mockRepository.saveRecord).toHaveBeenCalledWith(
        'drafts',
        updatedDraft,
        accountId,
      );

      if (response.success) {
        expect(response.value).toBeUndefined();
      }
    });
  });

  describe('createSicCode', () => {
    it('successfully creates sic code', async () => {
      const accountId = faker.string.uuid();
      const id = faker.string.uuid();
      const initialDraft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'producerRef123',
            sicCodes: {
              status: 'Complete',
              values: ['12345'],
            },
            contact: {
              status: 'Started',
              organisationName: 'Producer Org',
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
            },
            address: {
              status: 'Complete',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'NotStarted',
            },
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };
      mockRepository.getDraft.mockResolvedValue(initialDraft);
      const request: CreateDraftSicCodeRequest = {
        id: id,
        accountId: accountId,
        sicCode: '01110',
      };
      const response = await subject.createDraftSicCode(request);
      const expectedDraft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'producerRef123',
            sicCodes: {
              status: 'Complete',
              values: ['12345', '01110'],
            },
            contact: {
              status: 'Started',
              organisationName: 'Producer Org',
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
            },
            address: {
              status: 'Complete',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'NotStarted',
            },
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };

      expect(response.success).toBe(true);
      expect(mockRepository.getDraft).toHaveBeenCalledWith(
        'drafts',
        id,
        accountId,
      );
      expect(mockRepository.saveRecord).toHaveBeenCalledWith(
        'drafts',
        expectedDraft,
        accountId,
      );
      if (response.success) {
        expect(response.value).toEqual('01110');
      }
    });
  });

  describe('getDraftSicCodes', () => {
    it('successfully gets sic codes from a draft', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const draft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'producerRef123',
            sicCodes: {
              status: 'Complete',
              values: ['12345', '01110', '01120'],
            },
            contact: {
              status: 'Started',
              organisationName: 'Producer Org',
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
              phone: '987-654-3210',
              fax: '123-456-7890',
            },
            address: {
              status: 'Complete',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
          },
          wasteCollection: {
            wasteSource: {
              status: 'Complete',
              value: 'Commercial',
            },
            brokerRegistrationNumber: 'BRN123456',
            carrierRegistrationNumber: 'CRN654321',
            localAuthority: 'Local Authority Name',
            expectedWasteCollectionDate: {
              day: '01',
              month: '01',
              year: '2025',
            },
            address: {
              status: 'Complete',
              addressLine1: '456 Secondary St',
              addressLine2: 'Building 2',
              townCity: 'Othertown',
              postcode: '67890',
              country: 'CountryName',
            },
          },
          confimation: {
            status: 'Complete',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };
      mockRepository.getDraft.mockResolvedValue(draft);
      const response = await subject.getDraftSicCodes({
        id,
        accountId,
      });
      expect(response).toEqual({
        success: true,
        value: {
          status: 'Complete',
          values: ['12345', '01110', '01120'],
        },
      });
    });

    it('returns status not started with an empty values if producer and collection status is neither complete or started', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const draft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            address: {
              status: 'NotStarted',
            },
            contact: {
              status: 'NotStarted',
            },
            sicCodes: {
              status: 'NotStarted',
              values: [],
            },
            reference: '123456',
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'NotStarted',
            },
            brokerRegistrationNumber: '',
            carrierRegistrationNumber: '',
            expectedWasteCollectionDate: {
              day: '',
              month: '',
              year: '',
            },
            localAuthority: '',
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };
      mockRepository.getDraft.mockResolvedValue(draft);
      const response = await subject.getDraftSicCodes({
        id,
        accountId,
      });
      expect(response).toEqual({
        success: true,
        value: {
          status: 'NotStarted',
          values: [],
        },
      });
    });
  });

  describe('getDraftCarrierAddressDetails', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const draft: Draft = {
      id: id,
      wasteInformation: {
        status: 'NotStarted',
      },
      receiver: {
        address: {
          status: 'NotStarted',
        },
        contact: {
          status: 'NotStarted',
        },
        permitDetails: {
          status: 'NotStarted',
        },
      },
      producerAndCollection: {
        producer: {
          reference: 'testRef',
          sicCodes: {
            status: 'Complete',
            values: ['01110'],
          },
          contact: {
            status: 'Complete',
            organisationName: 'Test Organisation',
            name: 'Test Name',
            email: 'test@example.com',
            phone: '0123456789',
          },
          address: {
            status: 'Complete',
            buildingNameOrNumber: '123',
            addressLine1: '123 Main St',
            addressLine2: 'Building 1',
            townCity: 'London',
            postcode: 'SW1A 1AA',
            country: 'England [EN]',
          },
        },
        wasteCollection: {
          wasteSource: {
            status: 'Complete',
            value: 'Industrial',
          },
          brokerRegistrationNumber: 'BRN123456',
          carrierRegistrationNumber: 'CRN123456',
          localAuthority: 'Local Authority 1',
          expectedWasteCollectionDate: {
            day: '01',
            month: '01',
            year: '2025',
          },
          address: {
            status: 'NotStarted',
          },
        },
        confimation: {
          status: 'Complete',
        },
      },
      carrier: {
        address: {
          status: 'Complete',
          buildingNameOrNumber: '123',
          addressLine1: '123 Main St',
          addressLine2: 'Building 2',
          townCity: 'London',
          postcode: 'SW1A 1AA',
          country: 'England',
        },
        contact: {
          status: 'NotStarted',
        },
        modeOfTransport: {
          status: 'NotStarted',
        },
      },
      declaration: {
        status: 'NotStarted',
      },
      state: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    };

    it('successfully returns the carrier address details', async () => {
      mockRepository.getDraft.mockResolvedValue(draft);

      const response = await subject.getDraftCarrierAddressDetails({
        id,
        accountId,
      });

      if (response) {
        expect(response.success).toBe(true);
        if (response.success) {
          expect(response.value).toEqual({
            status: 'Complete',
            buildingNameOrNumber: '123',
            addressLine1: '123 Main St',
            addressLine2: 'Building 2',
            townCity: 'London',
            postcode: 'SW1A 1AA',
            country: 'England',
          });
        }
      }
    });
  });

  describe('setDraftCarrierAddressDetails', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const draft: Draft = {
      id: id,
      wasteInformation: {
        status: 'NotStarted',
      },
      receiver: {
        address: {
          status: 'NotStarted',
        },
        contact: {
          status: 'NotStarted',
        },
        permitDetails: {
          status: 'NotStarted',
        },
      },
      producerAndCollection: {
        producer: {
          reference: 'testRef',
          sicCodes: {
            status: 'Complete',
            values: ['01110'],
          },
          contact: {
            status: 'Complete',
            organisationName: 'Test Organisation',
            name: 'Test Name',
            email: 'test@example.com',
            phone: '0123456789',
          },
          address: {
            status: 'Started',
            buildingNameOrNumber: '123123',
            addressLine1: '123123 Main St',
            addressLine2: 'Building 123',
            townCity: 'Manchester',
            postcode: 'SW1A 1AB',
            country: 'Albania',
          },
        },
        wasteCollection: {
          wasteSource: {
            status: 'Complete',
            value: 'Industrial',
          },
          brokerRegistrationNumber: 'BRN123456',
          carrierRegistrationNumber: 'CRN123456',
          localAuthority: 'Local Authority 1',
          expectedWasteCollectionDate: {
            day: '01',
            month: '01',
            year: '2025',
          },
          address: {
            status: 'Started',
            addressLine1: '123 Main St',
            townCity: 'London',
          },
        },
        confimation: {
          status: 'NotStarted',
        },
      },
      carrier: {
        address: {
          status: 'NotStarted',
        },
        contact: {
          status: 'NotStarted',
        },
        modeOfTransport: {
          status: 'NotStarted',
        },
      },
      declaration: {
        status: 'NotStarted',
      },
      state: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    };

    it('successfully sets the carrier address details', async () => {
      const updatedDraft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'testRef',
            sicCodes: {
              status: 'Complete',
              values: ['01110'],
            },
            contact: {
              status: 'Complete',
              organisationName: 'Test Organisation',
              name: 'Test Name',
              email: 'test@example.com',
              phone: '0123456789',
            },
            address: {
              status: 'Started',
              buildingNameOrNumber: '123123',
              addressLine1: '123123 Main St',
              addressLine2: 'Building 123',
              townCity: 'Manchester',
              postcode: 'SW1A 1AB',
              country: 'Albania',
            },
          },
          wasteCollection: {
            wasteSource: {
              status: 'Complete',
              value: 'Industrial',
            },
            brokerRegistrationNumber: 'BRN123456',
            carrierRegistrationNumber: 'CRN123456',
            localAuthority: 'Local Authority 1',
            expectedWasteCollectionDate: {
              day: '01',
              month: '01',
              year: '2025',
            },
            address: {
              status: 'Started',
              addressLine1: '123 Main St',
              townCity: 'London',
            },
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'Complete',
            buildingNameOrNumber: '123',
            addressLine1: '123 Real Street',
            addressLine2: 'Real Avenue',
            townCity: 'London',
            postcode: 'SW1A 1AA',
            country: 'England',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'InProgress',
          timestamp: new Date(),
        },
      };

      const request: SetDraftCarrierAddressDetailsRequest = {
        id: id,
        accountId: accountId,
        value: {
          buildingNameOrNumber: '123',
          addressLine1: '123 Real Street',
          addressLine2: 'Real Avenue',
          townCity: 'London',
          postcode: 'SW1A 1AA',
          country: 'England',
        },
        saveAsDraft: false,
      };

      mockRepository.getDraft.mockResolvedValue(draft);

      const response = await subject.setDraftCarrierAddressDetails(request);

      expect(mockRepository.getDraft).toHaveBeenCalledWith(
        'drafts',
        id,
        accountId,
      );
      expect(mockRepository.saveRecord).toHaveBeenCalledWith(
        'drafts',
        updatedDraft,
        accountId,
      );

      if (response.success) {
        expect(response.value).toBeUndefined();
      }
    });
  });

  describe('deleteDraftSicCode', () => {
    it('successfully deletes sic code', async () => {
      const accountId = faker.string.uuid();
      const id = faker.string.uuid();
      const initialDraft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'producerRef123',
            sicCodes: {
              status: 'Complete',
              values: ['12345', '01110', '01120'],
            },
            contact: {
              status: 'Started',
              organisationName: 'Producer Org',
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
            },
            address: {
              status: 'Complete',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'NotStarted',
            },
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };
      mockRepository.getDraft.mockResolvedValue(initialDraft);
      const request: DeleteDraftSicCodeRequest = {
        id: id,
        accountId: accountId,
        code: '01110',
      };
      const response = await subject.deleteDraftSicCode(request);
      const expectedDraft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'producerRef123',
            sicCodes: {
              status: 'Complete',
              values: ['12345', '01120'],
            },
            contact: {
              status: 'Started',
              organisationName: 'Producer Org',
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
            },
            address: {
              status: 'Complete',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'NotStarted',
            },
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };

      expect(response.success).toBe(true);
      expect(mockRepository.getDraft).toHaveBeenCalledWith(
        'drafts',
        id,
        accountId,
      );
      expect(mockRepository.saveRecord).toHaveBeenCalledWith(
        'drafts',
        expectedDraft,
        accountId,
      );
      if (response.success) {
        expect(response.value).toEqual(['12345', '01120']);
      }
    });

    it('it returns an empty array if  producer and collection status is neither complete or started', async () => {
      const accountId = faker.string.uuid();
      const id = faker.string.uuid();
      const initialDraft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            address: {
              status: 'NotStarted',
            },
            contact: {
              status: 'NotStarted',
            },
            sicCodes: {
              status: 'NotStarted',
              values: [],
            },
            reference: '123456',
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'NotStarted',
            },
            expectedWasteCollectionDate: {
              day: '01',
              month: '01',
              year: '2022',
            },
            localAuthority: '',
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };
      mockRepository.getDraft.mockResolvedValue(initialDraft);
      const request: DeleteDraftSicCodeRequest = {
        id: id,
        accountId: accountId,
        code: '01110',
      };
      const response = await subject.deleteDraftSicCode(request);
      expect(response.success).toBe(false);
      expect(mockRepository.getDraft).toHaveBeenCalledWith(
        'drafts',
        id,
        accountId,
      );
      if (response.success) {
        expect(response.value).toEqual([]);
      }
    });
  });

  describe('getDraftReceiverAddressDetails', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const draft: Draft = {
      id: id,
      wasteInformation: {
        status: 'NotStarted',
      },
      receiver: {
        address: {
          status: 'Complete',
          buildingNameOrNumber: '123',
          addressLine1: '123 Main St',
          addressLine2: 'Building 1',
          townCity: 'London',
          postcode: 'SW1A 1AA',
          country: 'England',
        },
        contact: {
          status: 'NotStarted',
        },
        permitDetails: {
          status: 'NotStarted',
        },
      },
      producerAndCollection: {
        producer: {
          reference: 'testRef',
          sicCodes: {
            status: 'Complete',
            values: ['01110'],
          },
          contact: {
            status: 'Complete',
            organisationName: 'Test Organisation',
            name: 'Test Name',
            email: 'test@example.com',
            phone: '0123456789',
          },
          address: {
            status: 'Complete',
            buildingNameOrNumber: '123',
            addressLine1: '123 Main St',
            addressLine2: 'Building 2',
            townCity: 'London',
            postcode: 'SW1A 1AA',
            country: 'England',
          },
        },
        wasteCollection: {
          wasteSource: {
            status: 'Complete',
            value: 'Industrial',
          },
          brokerRegistrationNumber: 'BRN123456',
          carrierRegistrationNumber: 'CRN123456',
          localAuthority: 'Local Authority 1',
          expectedWasteCollectionDate: {
            day: '01',
            month: '01',
            year: '2025',
          },
          address: {
            status: 'NotStarted',
          },
        },
        confimation: {
          status: 'NotStarted',
        },
      },
      carrier: {
        address: {
          status: 'Complete',
          buildingNameOrNumber: '123',
          addressLine1: '123 Main St',
          addressLine2: 'Building 3',
          townCity: 'London',
          postcode: 'SW1A 1AA',
          country: 'England',
        },
        contact: {
          status: 'NotStarted',
        },
        modeOfTransport: {
          status: 'NotStarted',
        },
      },
      declaration: {
        status: 'NotStarted',
      },
      state: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    };

    it('successfully returns the receiver address details', async () => {
      mockRepository.getDraft.mockResolvedValue(draft);

      const response = await subject.getDraftReceiverAddressDetails({
        id,
        accountId,
      });

      if (response) {
        expect(response.success).toBe(true);
        if (response.success) {
          expect(response.value).toEqual({
            status: 'Complete',
            buildingNameOrNumber: '123',
            addressLine1: '123 Main St',
            addressLine2: 'Building 1',
            townCity: 'London',
            postcode: 'SW1A 1AA',
            country: 'England',
          });
        }
      }
    });
  });

  describe('setDraftReceiverAddressDetails', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const draft: Draft = {
      id: id,
      wasteInformation: {
        status: 'NotStarted',
      },
      receiver: {
        address: {
          status: 'NotStarted',
        },
        contact: {
          status: 'NotStarted',
        },
        permitDetails: {
          status: 'NotStarted',
        },
      },
      producerAndCollection: {
        producer: {
          reference: 'testRef',
          sicCodes: {
            status: 'Complete',
            values: ['01110'],
          },
          contact: {
            status: 'Complete',
            organisationName: 'Test Organisation',
            name: 'Test Name',
            email: 'test@example.com',
            phone: '0123456789',
          },
          address: {
            status: 'Started',
            buildingNameOrNumber: '123123',
            addressLine1: '123123 Main St',
            addressLine2: 'Building 123',
            townCity: 'Manchester',
            postcode: 'SW1A 1AB',
            country: 'Albania',
          },
        },
        wasteCollection: {
          wasteSource: {
            status: 'Complete',
            value: 'Industrial',
          },
          brokerRegistrationNumber: 'BRN123456',
          carrierRegistrationNumber: 'CRN123456',
          localAuthority: 'Local Authority 1',
          expectedWasteCollectionDate: {
            day: '01',
            month: '01',
            year: '2025',
          },
          address: {
            status: 'Started',
            addressLine1: '123 Main St',
            townCity: 'London',
          },
        },
        confimation: {
          status: 'NotStarted',
        },
      },
      carrier: {
        address: {
          status: 'NotStarted',
        },
        contact: {
          status: 'NotStarted',
        },
        modeOfTransport: {
          status: 'NotStarted',
        },
      },
      declaration: {
        status: 'NotStarted',
      },
      state: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    };

    it('successfully sets the receiver address details', async () => {
      const updatedDraft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'Complete',
            buildingNameOrNumber: '123',
            addressLine1: '123 Real Street',
            addressLine2: 'Real Avenue',
            townCity: 'London',
            postcode: 'SW1A 1AA',
            country: 'England',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'testRef',
            sicCodes: {
              status: 'Complete',
              values: ['01110'],
            },
            contact: {
              status: 'Complete',
              organisationName: 'Test Organisation',
              name: 'Test Name',
              email: 'test@example.com',
              phone: '0123456789',
            },
            address: {
              status: 'Started',
              buildingNameOrNumber: '123123',
              addressLine1: '123123 Main St',
              addressLine2: 'Building 123',
              townCity: 'Manchester',
              postcode: 'SW1A 1AB',
              country: 'Albania',
            },
          },
          wasteCollection: {
            wasteSource: {
              status: 'Complete',
              value: 'Industrial',
            },
            brokerRegistrationNumber: 'BRN123456',
            carrierRegistrationNumber: 'CRN123456',
            localAuthority: 'Local Authority 1',
            expectedWasteCollectionDate: {
              day: '01',
              month: '01',
              year: '2025',
            },
            address: {
              status: 'Started',
              addressLine1: '123 Main St',
              townCity: 'London',
            },
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'InProgress',
          timestamp: new Date(),
        },
      };

      const request: SetDraftReceiverAddressDetailsRequest = {
        id: id,
        accountId: accountId,
        value: {
          buildingNameOrNumber: '123',
          addressLine1: '123 Real Street',
          addressLine2: 'Real Avenue',
          townCity: 'London',
          postcode: 'SW1A 1AA',
          country: 'England',
        },
        saveAsDraft: false,
      };

      mockRepository.getDraft.mockResolvedValue(draft);

      const response = await subject.setDraftReceiverAddressDetails(request);

      expect(mockRepository.getDraft).toHaveBeenCalledWith(
        'drafts',
        id,
        accountId,
      );
      expect(mockRepository.saveRecord).toHaveBeenCalledWith(
        'drafts',
        updatedDraft,
        accountId,
      );

      if (response.success) {
        expect(response.value).toBeUndefined();
      }
    });
  });

  describe('setDraftProducerConfirmation', () => {
    it('successfully sets confirmation status', async () => {
      const accountId = faker.string.uuid();
      const id = faker.string.uuid();
      const initialDraft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'producerRef123',
            sicCodes: {
              status: 'Complete',
              values: ['12345'],
            },
            contact: {
              status: 'Complete',
              organisationName: 'Producer Org',
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
              phone: '+44 1234 567890',
            },
            address: {
              status: 'Complete',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
          },
          wasteCollection: {
            address: {
              status: 'Complete',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
            wasteSource: {
              status: 'Complete',
              value: 'Industrial',
            },
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };
      mockRepository.getDraft.mockResolvedValue(initialDraft);
      const request: SetDraftProducerConfirmationRequest = {
        id: id,
        accountId: accountId,
        isConfirmed: true,
      };
      const response = await subject.setDraftProducerConfirmation(request);
      const expectedDraft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'producerRef123',
            sicCodes: {
              status: 'Complete',
              values: ['12345'],
            },
            contact: {
              status: 'Complete',
              organisationName: 'Producer Org',
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
              phone: '+44 1234 567890',
            },
            address: {
              status: 'Complete',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
          },
          wasteCollection: {
            address: {
              status: 'Complete',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
            wasteSource: {
              status: 'Complete',
              value: 'Industrial',
            },
          },
          confimation: {
            status: 'Complete',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };

      expect(response.success).toBe(true);
      expect(mockRepository.getDraft).toHaveBeenCalledWith(
        'drafts',
        id,
        accountId,
      );
      expect(mockRepository.saveRecord).toHaveBeenCalledWith(
        'drafts',
        expectedDraft,
        accountId,
      );
      if (response.success) {
        expect(response.value).toBeUndefined();
      }
    });

    it('returns error if section is not complete', async () => {
      const accountId = faker.string.uuid();
      const id = faker.string.uuid();
      const initialDraft: Draft = {
        id: id,
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          permitDetails: {
            status: 'NotStarted',
          },
        },
        producerAndCollection: {
          producer: {
            reference: 'producerRef123',
            sicCodes: {
              status: 'Complete',
              values: ['12345'],
            },
            contact: {
              status: 'Started',
              organisationName: 'Producer Org',
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
              phone: '+44 1234 567890',
            },
            address: {
              status: 'Started',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
          },
          wasteCollection: {
            address: {
              status: 'Started',
              addressLine1: '123 Main St',
              addressLine2: 'Suite 100',
              townCity: 'Anytown',
              postcode: '12345',
              country: 'CountryName',
            },
            wasteSource: {
              status: 'Complete',
              value: 'Industrial',
            },
          },
          confimation: {
            status: 'NotStarted',
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      };
      mockRepository.getDraft.mockResolvedValue(initialDraft);
      const request: SetDraftProducerConfirmationRequest = {
        id: id,
        accountId: accountId,
        isConfirmed: true,
      };
      const response = await subject.setDraftProducerConfirmation(request);

      expect(response.success).toBe(false);
      expect(mockRepository.getDraft).toHaveBeenCalledWith(
        'drafts',
        id,
        accountId,
      );
      expect(mockRepository.saveRecord).toBeCalledTimes(0);
      if (!response.success) {
        expect(response.error.statusCode).toBe(400);
        expect(response.error.message).toBe(
          'Producer and waste collection section is not complete',
        );
      }
    });
  });
});
