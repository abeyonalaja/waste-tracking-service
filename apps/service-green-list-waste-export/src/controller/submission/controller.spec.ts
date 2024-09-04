import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { expect, jest } from '@jest/globals';
import winston from 'winston';
import SubmissionController from './controller';
import {
  DbContainerNameKey,
  Submission,
  WasteQuantity,
  CollectionDate,
  validation,
} from '../../model';
import { CosmosRepository } from '../../data';

import { common as commonValidation } from '@wts/util/shared-validation';
import { glwe } from '@wts/util/shared-validation';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const draftContainerName: DbContainerNameKey = 'drafts';
const submissionContainerName: DbContainerNameKey = 'submissions';

const mockRepository = {
  getRecords: jest.fn<CosmosRepository['getRecords']>(),
  getRecord: jest.fn<CosmosRepository['getRecord']>(),
  saveRecord: jest.fn<CosmosRepository['saveRecord']>(),
  createBulkRecords: jest.fn<CosmosRepository['createBulkRecords']>(),
  deleteRecord: jest.fn<CosmosRepository['deleteRecord']>(),
  getTotalNumber: jest.fn<CosmosRepository['getTotalNumber']>(),
};

const wasteCodes = [
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
  {
    type: 'OECD',
    values: [
      {
        code: 'GB040',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      },
    ],
  },
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
  {
    type: 'AnnexIIIB',
    values: [
      {
        code: 'BEU04',
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

const countries = [
  {
    name: 'Afghanistan [AF]',
  },
  {
    name: 'France [FR]',
  },
  {
    name: 'Belgium [BE]',
  },
  {
    name: 'Burkina Faso [BF]',
  },
  {
    name: 'Åland Islands [AX]',
  },
];

const countriesIncludingUk = [
  {
    name: 'Afghanistan [AF]',
  },
  {
    name: 'France [FR]',
  },
  {
    name: 'Belgium [BE]',
  },
  {
    name: 'Burkina Faso [BF]',
  },
  {
    name: 'Åland Islands [AX]',
  },
  {
    name: 'United Kingdom (England) [GB-ENG]',
  },
];

const recoveryCodes = [
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
  {
    code: 'R13',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
      interim: true,
    },
  },
];

const disposalCodes = [
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

describe(SubmissionController, () => {
  const subject = new SubmissionController(
    mockRepository as unknown as CosmosRepository,
    wasteCodes,
    ewcCodes,
    countries,
    countriesIncludingUk,
    recoveryCodes,
    disposalCodes,
    new winston.Logger(),
  );

  beforeEach(() => {
    mockRepository.getRecords.mockClear();
    mockRepository.getRecord.mockClear();
    mockRepository.saveRecord.mockClear();
    mockRepository.createBulkRecords.mockClear();
    mockRepository.deleteRecord.mockClear();
    mockRepository.getTotalNumber.mockClear();
  });

  describe('getSubmission', () => {
    const accountId = faker.string.uuid();
    const id = faker.string.uuid();

    const submission = {
      id: id,
      reference: faker.string.sample(),
      wasteDescription: {
        wasteCode: {
          type: 'BaselAnnexIX',
          code: faker.string.sample(),
        },
        ewcCodes: [
          {
            code: faker.string.sample(),
          },
          {
            code: faker.string.sample(),
          },
        ],
        description: faker.string.sample(),
      },
      wasteQuantity: {
        type: 'ActualData',
        actualData: {
          quantityType: 'Weight',
          value: faker.number.float(),
          unit: 'Tonne',
        },
        estimateData: {
          quantityType: 'Weight',
          value: faker.number.float(),
          unit: 'Tonne',
        },
      },
      exporterDetail: {
        exporterAddress: {
          country: faker.string.sample(),
          postcode: faker.string.sample(),
          townCity: faker.string.sample(),
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
        },
        exporterContactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      importerDetail: {
        importerAddressDetails: {
          address: faker.string.sample(),
          country: faker.string.sample(),
          organisationName: faker.string.sample(),
        },
        importerContactDetails: {
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      collectionDate: {
        type: 'ActualDate',
        actualDate: {
          year: '01',
          month: '01',
          day: '2025',
        },
        estimateDate: {},
      },
      carriers: [
        {
          transportDetails: {
            type: 'Air',
            description: 'RyanAir',
          },
          addressDetails: {
            address: faker.string.sample(),
            country: faker.string.sample(),
            organisationName: faker.string.sample(),
          },
          contactDetails: {
            emailAddress: faker.string.sample(),
            faxNumber: faker.string.sample(),
            fullName: faker.string.sample(),
            phoneNumber: faker.string.sample(),
          },
        },
      ],
      collectionDetail: {
        address: {
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
          townCity: faker.string.sample(),
          postcode: faker.string.sample(),
          country: faker.string.sample(),
        },
        contactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      ukExitLocation: {
        provided: 'Yes',
        value: faker.string.sample(),
      },
      transitCountries: ['Albania (AL)'],
      recoveryFacilityDetail: [
        {
          addressDetails: {
            address: faker.string.sample(),
            country: faker.string.sample(),
            name: faker.string.sample(),
          },
          contactDetails: {
            emailAddress: faker.string.sample(),
            faxNumber: faker.string.sample(),
            fullName: faker.string.sample(),
            phoneNumber: faker.string.sample(),
          },
          recoveryFacilityType: {
            type: 'Laboratory',
            disposalCode: 'D1',
          },
        },
      ],
      submissionDeclaration: {
        declarationTimestamp: new Date(),
        transactionId: faker.string.sample(),
      },
      submissionState: {
        status: 'UpdatedWithActuals',
        timestamp: new Date(),
      },
    } as Submission;

    it('it returns a valid submission', async () => {
      mockRepository.getRecord.mockResolvedValue(submission);

      const response = await subject.getSubmission({ id, accountId });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }
      expect(response.value).toEqual(submission);
    });

    it('it rejects a cancelled submission', async () => {
      submission.submissionState = {
        status: 'Cancelled',
        timestamp: new Date(),
        cancellationType: {
          type: 'Other',
          reason: faker.string.sample(),
        },
      };

      mockRepository.getRecord.mockResolvedValue(submission);

      const response = await subject.getSubmission({ id, accountId });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }
      expect(response.error.statusCode).toBe(404);
    });
  });

  describe('getNumberOfSubmissions', () => {
    it('successfully returns number of submissions from repository', async () => {
      const accountId = faker.string.uuid();
      mockRepository.getTotalNumber.mockResolvedValue(3);
      mockRepository.getTotalNumber.mockResolvedValue(3);
      mockRepository.getTotalNumber.mockResolvedValue(3);

      const response = await subject.getNumberOfSubmissions({ accountId });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getTotalNumber).toHaveBeenCalledWith(
        submissionContainerName,
        accountId,
        false,
      );
      expect(mockRepository.getTotalNumber).toHaveBeenCalledWith(
        submissionContainerName,
        accountId,
        true,
      );
      expect(mockRepository.getTotalNumber).toHaveBeenCalledWith(
        draftContainerName,
        accountId,
      );
      expect(mockRepository.getTotalNumber).toHaveBeenCalledTimes(3);
      expect(response.value).toEqual({
        completedWithActuals: 3,
        completedWithEstimates: 3,
        incomplete: 3,
      });
    });
  });

  describe('cancelDraftSubmission', () => {
    it('successfully cancels a draft submission', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();

      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
        wasteDescription: { status: 'NotStarted' },
        wasteQuantity: { status: 'CannotStart' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
      });

      expect(
        (
          (await mockRepository.getRecord(
            submissionContainerName,
            id,
            accountId,
          )) as Submission
        ).submissionState.status,
      ).toBe('InProgress');

      subject.cancelSubmission({
        id,
        accountId,
        cancellationType: { type: 'ChangeOfRecoveryFacilityOrLaboratory' },
      });

      expect(
        (
          (await mockRepository.getRecord(
            submissionContainerName,
            id,
            accountId,
          )) as Submission
        ).submissionState.status,
      ).toBe('InProgress');

      mockRepository.getRecord.mockResolvedValue({
        id,
        reference: 'abc',
        wasteDescription: { status: 'NotStarted' },
        wasteQuantity: { status: 'CannotStart' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      });

      subject.cancelSubmission({
        id,
        accountId,
        cancellationType: { type: 'Other', reason: 'Not sure !!!' },
      });

      expect(
        (
          (await mockRepository.getRecord(
            submissionContainerName,
            id,
            accountId,
          )) as Submission
        ).submissionState.status,
      ).toBe('Cancelled');
    });
  });

  describe('validateSubmissions', () => {
    const locale = 'en';
    const context = 'csv';

    it('passes submission validation', async () => {
      const accountId = faker.string.uuid();
      const response = await subject.validateSubmissions({
        accountId: accountId,
        padIndex: 2,
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
            exporterOrganisationName: 'Test organisation 1',
            exporterAddressLine1: '1 Some Street',
            exporterAddressLine2: '',
            exporterTownOrCity: 'London',
            exporterCountry: 'England',
            exporterPostcode: 'EC2N4AY',
            exporterContactFullName: 'John Smith',
            exporterContactPhoneNumber: '07888888888',
            exporterFaxNumber: '',
            exporterEmailAddress: 'test1@test.com',
            importerOrganisationName: 'Test organisation 2',
            importerAddress: '2 Some Street, Kabul, 1001',
            importerCountry: 'Afghanistan',
            importerContactFullName: 'Jane Smith',
            importerContactPhoneNumber: '0033140000000',
            importerFaxNumber: '0033140000000',
            importerEmailAddress: 'test2@test.com',
            wasteCollectionDate: '01/01/2050',
            estimatedOrActualCollectionDate: 'actual',
            firstCarrierOrganisationName: 'Test organisation 3',
            firstCarrierAddress: 'Some address, London, EC2N4AY',
            firstCarrierCountry: 'England',
            firstCarrierContactFullName: 'John Doe',
            firstCarrierContactPhoneNumber: '07888888844',
            firstCarrierFaxNumber: '07888888844',
            firstCarrierEmailAddress: 'test3@test.com',
            firstCarrierMeansOfTransport: 'inland waterways',
            firstCarrierMeansOfTransportDetails: 'details',
            secondCarrierOrganisationName: 'Test organisation 4',
            secondCarrierAddress: '3 Some Street, Paris, 75002',
            secondCarrierCountry: 'France',
            secondCarrierContactFullName: 'Jane Doe',
            secondCarrierContactPhoneNumber: '0033140000044',
            secondCarrierFaxNumber: '',
            secondCarrierEmailAddress: 'test4@test.com',
            secondCarrierMeansOfTransport: 'Road',
            secondCarrierMeansOfTransportDetails: '',
            thirdCarrierOrganisationName: '',
            thirdCarrierAddress: '',
            thirdCarrierCountry: '',
            thirdCarrierContactFullName: '',
            thirdCarrierContactPhoneNumber: '',
            thirdCarrierFaxNumber: '',
            thirdCarrierEmailAddress: '',
            thirdCarrierMeansOfTransport: '',
            thirdCarrierMeansOfTransportDetails: '',
            fourthCarrierOrganisationName: '',
            fourthCarrierAddress: '',
            fourthCarrierCountry: '',
            fourthCarrierContactFullName: '',
            fourthCarrierContactPhoneNumber: '',
            fourthCarrierFaxNumber: '',
            fourthCarrierEmailAddress: '',
            fourthCarrierMeansOfTransport: '',
            fourthCarrierMeansOfTransportDetails: '',
            fifthCarrierOrganisationName: '',
            fifthCarrierAddress: '',
            fifthCarrierCountry: '',
            fifthCarrierContactFullName: '',
            fifthCarrierContactPhoneNumber: '',
            fifthCarrierFaxNumber: '',
            fifthCarrierEmailAddress: '',
            fifthCarrierMeansOfTransport: '',
            fifthCarrierMeansOfTransportDetails: '',
            wasteCollectionOrganisationName: 'Test organisation 5',
            wasteCollectionAddressLine1: '5 Some Street',
            wasteCollectionAddressLine2: '',
            wasteCollectionTownOrCity: 'London',
            wasteCollectionCountry: 'England',
            wasteCollectionPostcode: 'EC2N4AY',
            wasteCollectionContactFullName: 'John Johnson',
            wasteCollectionContactPhoneNumber: '07888888855',
            wasteCollectionFaxNumber: '07888888855',
            wasteCollectionEmailAddress: 'test5@test.com',
            whereWasteLeavesUk: 'Dover',
            transitCountries: 'France;Belgium',
            interimSiteOrganisationName: '',
            interimSiteAddress: '',
            interimSiteCountry: '',
            interimSiteContactFullName: '',
            interimSiteContactPhoneNumber: '',
            interimSiteFaxNumber: '',
            interimSiteEmailAddress: '',
            interimSiteRecoveryCode: '',
            laboratoryOrganisationName: '',
            laboratoryAddress: '',
            laboratoryCountry: '',
            laboratoryContactFullName: '',
            laboratoryContactPhoneNumber: '',
            laboratoryFaxNumber: '',
            laboratoryEmailAddress: '',
            laboratoryDisposalCode: '',
            firstRecoveryFacilityOrganisationName: 'Test organisation 6',
            firstRecoveryFacilityAddress: '4 Some Street, Paris, 75002',
            firstRecoveryFacilityCountry: 'France',
            firstRecoveryFacilityContactFullName: 'Jean Philip',
            firstRecoveryFacilityContactPhoneNumber: '0033140000066',
            firstRecoveryFacilityFaxNumber: '',
            firstRecoveryFacilityEmailAddress: 'test6@test.com',
            firstRecoveryFacilityRecoveryCode: 'r1',
            secondRecoveryFacilityOrganisationName: '',
            secondRecoveryFacilityAddress: '',
            secondRecoveryFacilityCountry: '',
            secondRecoveryFacilityContactFullName: '',
            secondRecoveryFacilityContactPhoneNumber: '',
            secondRecoveryFacilityFaxNumber: '',
            secondRecoveryFacilityEmailAddress: '',
            secondRecoveryFacilityRecoveryCode: '',
            thirdRecoveryFacilityOrganisationName: '',
            thirdRecoveryFacilityAddress: '',
            thirdRecoveryFacilityCountry: '',
            thirdRecoveryFacilityContactFullName: '',
            thirdRecoveryFacilityContactPhoneNumber: '',
            thirdRecoveryFacilityFaxNumber: '',
            thirdRecoveryFacilityEmailAddress: '',
            thirdRecoveryFacilityRecoveryCode: '',
            fourthRecoveryFacilityOrganisationName: '',
            fourthRecoveryFacilityAddress: '',
            fourthRecoveryFacilityCountry: '',
            fourthRecoveryFacilityContactFullName: '',
            fourthRecoveryFacilityContactPhoneNumber: '',
            fourthRecoveryFacilityFaxNumber: '',
            fourthRecoveryFacilityEmailAddress: '',
            fourthRecoveryFacilityRecoveryCode: '',
            fifthRecoveryFacilityOrganisationName: '',
            fifthRecoveryFacilityAddress: '',
            fifthRecoveryFacilityCountry: '',
            fifthRecoveryFacilityContactFullName: '',
            fifthRecoveryFacilityContactPhoneNumber: '',
            fifthRecoveryFacilityFaxNumber: '',
            fifthRecoveryFacilityEmailAddress: '',
            fifthRecoveryFacilityRecoveryCode: '',
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
            exporterDetail: {
              exporterAddress: {
                addressLine1: '1 Some Street',
                townCity: 'London',
                postcode: 'EC2N4AY',
                country: 'England',
              },
              exporterContactDetails: {
                organisationName: 'Test organisation 1',
                fullName: 'John Smith',
                emailAddress: 'test1@test.com',
                phoneNumber: '07888888888',
              },
            },
            importerDetail: {
              importerAddressDetails: {
                organisationName: 'Test organisation 2',
                address: '2 Some Street, Kabul, 1001',
                country: 'Afghanistan [AF]',
              },
              importerContactDetails: {
                fullName: 'Jane Smith',
                emailAddress: 'test2@test.com',
                phoneNumber: '0033140000000',
                faxNumber: '0033140000000',
              },
            },
            collectionDate: {
              type: 'ActualDate',
              actualDate: {
                day: '01',
                month: '01',
                year: '2050',
              },
              estimateDate: {},
            },
            carriers: [
              {
                addressDetails: {
                  organisationName: 'Test organisation 3',
                  address: 'Some address, London, EC2N4AY',
                  country: 'United Kingdom (England) [GB-ENG]',
                },
                contactDetails: {
                  fullName: 'John Doe',
                  emailAddress: 'test3@test.com',
                  phoneNumber: '07888888844',
                  faxNumber: '07888888844',
                },
                transportDetails: {
                  type: 'InlandWaterways',
                  description: 'details',
                },
              },
              {
                addressDetails: {
                  organisationName: 'Test organisation 4',
                  address: '3 Some Street, Paris, 75002',
                  country: 'France [FR]',
                },
                contactDetails: {
                  fullName: 'Jane Doe',
                  emailAddress: 'test4@test.com',
                  phoneNumber: '0033140000044',
                },
                transportDetails: {
                  type: 'Road',
                },
              },
            ],
            collectionDetail: {
              address: {
                addressLine1: '5 Some Street',
                townCity: 'London',
                postcode: 'EC2N4AY',
                country: 'England',
              },
              contactDetails: {
                organisationName: 'Test organisation 5',
                fullName: 'John Johnson',
                emailAddress: 'test5@test.com',
                phoneNumber: '07888888855',
                faxNumber: '07888888855',
              },
            },
            ukExitLocation: {
              provided: 'Yes',
              value: 'Dover',
            },
            transitCountries: ['France [FR]', 'Belgium [BE]'],
            recoveryFacilityDetail: [
              {
                addressDetails: {
                  name: 'Test organisation 6',
                  address: '4 Some Street, Paris, 75002',
                  country: 'France [FR]',
                },
                contactDetails: {
                  fullName: 'Jean Philip',
                  emailAddress: 'test6@test.com',
                  phoneNumber: '0033140000066',
                },
                recoveryFacilityType: {
                  type: 'RecoveryFacility',
                  recoveryCode: 'R1',
                },
              },
            ],
          },
        ],
      });
    });

    it('fails submission validation on all sections', async () => {
      const accountId = faker.string.uuid();
      const response = await subject.validateSubmissions({
        accountId: accountId,
        padIndex: 2,
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
            exporterOrganisationName: '     ',
            exporterAddressLine1: '     ',
            exporterAddressLine2: '',
            exporterTownOrCity: '     ',
            exporterCountry: 'france',
            exporterPostcode: '     ',
            exporterContactFullName: '     ',
            exporterContactPhoneNumber: '     ',
            exporterFaxNumber: '     ',
            exporterEmailAddress: '     ',
            importerOrganisationName: '     ',
            importerAddress: '     ',
            importerCountry: '     ',
            importerContactFullName: '     ',
            importerContactPhoneNumber: '     ',
            importerFaxNumber: '     ',
            importerEmailAddress: '     ',
            wasteCollectionDate: 'date',
            estimatedOrActualCollectionDate: 'type',
            firstCarrierOrganisationName: '     ',
            firstCarrierAddress: '     ',
            firstCarrierCountry: '     ',
            firstCarrierContactFullName: '     ',
            firstCarrierContactPhoneNumber: '     ',
            firstCarrierFaxNumber: '     ',
            firstCarrierEmailAddress: '     ',
            firstCarrierMeansOfTransport: '     ',
            firstCarrierMeansOfTransportDetails: '     ',
            secondCarrierOrganisationName: '',
            secondCarrierAddress: '',
            secondCarrierCountry: '',
            secondCarrierContactFullName: '',
            secondCarrierContactPhoneNumber: '',
            secondCarrierFaxNumber: '',
            secondCarrierEmailAddress: '',
            secondCarrierMeansOfTransport: '',
            secondCarrierMeansOfTransportDetails: '',
            thirdCarrierOrganisationName: '',
            thirdCarrierAddress: '',
            thirdCarrierCountry: '',
            thirdCarrierContactFullName: '',
            thirdCarrierContactPhoneNumber: '',
            thirdCarrierFaxNumber: '',
            thirdCarrierEmailAddress: '',
            thirdCarrierMeansOfTransport: '',
            thirdCarrierMeansOfTransportDetails: '',
            fourthCarrierOrganisationName: '',
            fourthCarrierAddress: '',
            fourthCarrierCountry: '',
            fourthCarrierContactFullName: '',
            fourthCarrierContactPhoneNumber: '',
            fourthCarrierFaxNumber: '',
            fourthCarrierEmailAddress: '',
            fourthCarrierMeansOfTransport: '',
            fourthCarrierMeansOfTransportDetails: '',
            fifthCarrierOrganisationName: '',
            fifthCarrierAddress: '',
            fifthCarrierCountry: '',
            fifthCarrierContactFullName: '',
            fifthCarrierContactPhoneNumber: '',
            fifthCarrierFaxNumber: '',
            fifthCarrierEmailAddress: '',
            fifthCarrierMeansOfTransport: '',
            fifthCarrierMeansOfTransportDetails: '',
            wasteCollectionOrganisationName: '     ',
            wasteCollectionAddressLine1: '     ',
            wasteCollectionAddressLine2: '',
            wasteCollectionTownOrCity: '     ',
            wasteCollectionCountry: 'france',
            wasteCollectionPostcode: '     ',
            wasteCollectionContactFullName: '     ',
            wasteCollectionContactPhoneNumber: '     ',
            wasteCollectionFaxNumber: '     ',
            wasteCollectionEmailAddress: '     ',
            whereWasteLeavesUk: '     ',
            transitCountries: '     ',
            interimSiteOrganisationName: '     ',
            interimSiteAddress: '     ',
            interimSiteCountry: '     ',
            interimSiteContactFullName: '     ',
            interimSiteContactPhoneNumber: '     ',
            interimSiteFaxNumber: '     ',
            interimSiteEmailAddress: '     ',
            interimSiteRecoveryCode: '     ',
            laboratoryOrganisationName: '     ',
            laboratoryAddress: '     ',
            laboratoryCountry: '     ',
            laboratoryContactFullName: '     ',
            laboratoryContactPhoneNumber: '     ',
            laboratoryFaxNumber: '     ',
            laboratoryEmailAddress: '     ',
            laboratoryDisposalCode: '     ',
            firstRecoveryFacilityOrganisationName: '     ',
            firstRecoveryFacilityAddress: '     ',
            firstRecoveryFacilityCountry: '     ',
            firstRecoveryFacilityContactFullName: '     ',
            firstRecoveryFacilityContactPhoneNumber: '     ',
            firstRecoveryFacilityFaxNumber: '     ',
            firstRecoveryFacilityEmailAddress: '     ',
            firstRecoveryFacilityRecoveryCode: '     ',
            secondRecoveryFacilityOrganisationName: '',
            secondRecoveryFacilityAddress: '',
            secondRecoveryFacilityCountry: '',
            secondRecoveryFacilityContactFullName: '',
            secondRecoveryFacilityContactPhoneNumber: '',
            secondRecoveryFacilityFaxNumber: '',
            secondRecoveryFacilityEmailAddress: '',
            secondRecoveryFacilityRecoveryCode: '',
            thirdRecoveryFacilityOrganisationName: '',
            thirdRecoveryFacilityAddress: '',
            thirdRecoveryFacilityCountry: '',
            thirdRecoveryFacilityContactFullName: '',
            thirdRecoveryFacilityContactPhoneNumber: '',
            thirdRecoveryFacilityFaxNumber: '',
            thirdRecoveryFacilityEmailAddress: '',
            thirdRecoveryFacilityRecoveryCode: '',
            fourthRecoveryFacilityOrganisationName: '',
            fourthRecoveryFacilityAddress: '',
            fourthRecoveryFacilityCountry: '',
            fourthRecoveryFacilityContactFullName: '',
            fourthRecoveryFacilityContactPhoneNumber: '',
            fourthRecoveryFacilityFaxNumber: '',
            fourthRecoveryFacilityEmailAddress: '',
            fourthRecoveryFacilityRecoveryCode: '',
            fifthRecoveryFacilityOrganisationName: '',
            fifthRecoveryFacilityAddress: '',
            fifthRecoveryFacilityCountry: '',
            fifthRecoveryFacilityContactFullName: '',
            fifthRecoveryFacilityContactPhoneNumber: '',
            fifthRecoveryFacilityFaxNumber: '',
            fifthRecoveryFacilityEmailAddress: '',
            fifthRecoveryFacilityRecoveryCode: '',
          },
        ],
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      const carrierErrorMessages = validation.CarrierValidationErrorMessages(1);

      expect(response.value).toEqual({
        valid: false,
        accountId: accountId,
        values: [
          {
            index: 3,
            fieldFormatErrors: [
              {
                field: 'CustomerReference',
                message: validation.ReferenceValidationErrorMessages.invalid,
              },
              {
                field: 'WasteDescription',
                message:
                  glwe.errorMessages.invalidWasteCode['AnnexIIIA'][locale][
                    context
                  ],
              },
              {
                field: 'WasteDescription',
                message: glwe.errorMessages.invalidEwcCodes[locale][context],
              },
              {
                field: 'WasteQuantity',
                message:
                  validation.WasteQuantityValidationErrorMessages.missingType,
              },
              {
                field: 'ExporterDetail',
                message:
                  validation.ExporterDetailValidationErrorMessages
                    .emptyOrganisationName,
              },
              {
                field: 'ExporterDetail',
                message:
                  validation.ExporterDetailValidationErrorMessages
                    .emptyAddressLine1,
              },
              {
                field: 'ExporterDetail',
                message:
                  validation.ExporterDetailValidationErrorMessages
                    .emptyTownOrCity,
              },
              {
                field: 'ExporterDetail',
                message:
                  validation.ExporterDetailValidationErrorMessages
                    .invalidCountry,
              },
              {
                field: 'ExporterDetail',
                message:
                  validation.ExporterDetailValidationErrorMessages
                    .invalidPostcode,
              },
              {
                field: 'ExporterDetail',
                message:
                  validation.ExporterDetailValidationErrorMessages
                    .emptyContactFullName,
              },
              {
                field: 'ExporterDetail',
                message:
                  validation.ExporterDetailValidationErrorMessages.invalidPhone,
              },
              {
                field: 'ExporterDetail',
                message:
                  validation.ExporterDetailValidationErrorMessages.invalidFax,
              },
              {
                field: 'ExporterDetail',
                message:
                  validation.ExporterDetailValidationErrorMessages.invalidEmail,
              },
              {
                field: 'ImporterDetail',
                message:
                  validation.ImporterDetailValidationErrorMessages
                    .emptyOrganisationName,
              },
              {
                field: 'ImporterDetail',
                message:
                  validation.ImporterDetailValidationErrorMessages.emptyAddress,
              },
              {
                field: 'ImporterDetail',
                message:
                  validation.ImporterDetailValidationErrorMessages
                    .invalidCountry,
              },
              {
                field: 'ImporterDetail',
                message:
                  validation.ImporterDetailValidationErrorMessages
                    .emptyContactFullName,
              },
              {
                field: 'ImporterDetail',
                message:
                  validation.ImporterDetailValidationErrorMessages.invalidPhone,
              },
              {
                field: 'ImporterDetail',
                message:
                  validation.ImporterDetailValidationErrorMessages.invalidFax,
              },
              {
                field: 'ImporterDetail',
                message:
                  validation.ImporterDetailValidationErrorMessages.invalidEmail,
              },
              {
                field: 'CollectionDate',
                message:
                  commonValidation.commonErrorMessages.emptyCollectionDate.en
                    .csv,
              },
              {
                field: 'CollectionDate',
                message: glwe.errorMessages.missingTypeCollectionDate.en.csv,
              },
              {
                field: 'Carriers',
                message: carrierErrorMessages.emptyOrganisationName,
              },
              {
                field: 'Carriers',
                message: carrierErrorMessages.emptyAddress,
              },
              {
                field: 'Carriers',
                message: carrierErrorMessages.invalidCountry,
              },
              {
                field: 'Carriers',
                message: carrierErrorMessages.emptyContactFullName,
              },
              {
                field: 'Carriers',
                message: carrierErrorMessages.invalidPhone,
              },
              {
                field: 'Carriers',
                message: carrierErrorMessages.invalidFax,
              },
              {
                field: 'Carriers',
                message: carrierErrorMessages.invalidEmail,
              },
              {
                field: 'Carriers',
                message: carrierErrorMessages.emptyTransport,
              },
              {
                field: 'CollectionDetail',
                message:
                  validation.CollectionDetailValidationErrorMessages
                    .emptyOrganisationName,
              },
              {
                field: 'CollectionDetail',
                message:
                  validation.CollectionDetailValidationErrorMessages
                    .emptyAddressLine1,
              },
              {
                field: 'CollectionDetail',
                message:
                  validation.CollectionDetailValidationErrorMessages
                    .emptyTownOrCity,
              },
              {
                field: 'CollectionDetail',
                message:
                  validation.CollectionDetailValidationErrorMessages
                    .invalidCountry,
              },
              {
                field: 'CollectionDetail',
                message:
                  validation.CollectionDetailValidationErrorMessages
                    .invalidPostcode,
              },
              {
                field: 'CollectionDetail',
                message:
                  validation.CollectionDetailValidationErrorMessages
                    .emptyContactFullName,
              },
              {
                field: 'CollectionDetail',
                message:
                  validation.CollectionDetailValidationErrorMessages
                    .invalidPhone,
              },
              {
                field: 'CollectionDetail',
                message:
                  validation.CollectionDetailValidationErrorMessages.invalidFax,
              },
              {
                field: 'CollectionDetail',
                message:
                  validation.CollectionDetailValidationErrorMessages
                    .invalidEmail,
              },
            ],
            invalidStructureErrors: [],
          },
        ],
      });
    });

    it('fails submission validation on cross sections', async () => {
      const accountId = faker.string.uuid();
      const response = await subject.validateSubmissions({
        accountId: accountId,
        padIndex: 2,
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
            exporterOrganisationName: 'Test organisation 1',
            exporterAddressLine1: '1 Some Street',
            exporterAddressLine2: '',
            exporterTownOrCity: 'London',
            exporterCountry: 'England',
            exporterPostcode: 'EC2N4AY',
            exporterContactFullName: 'John Smith',
            exporterContactPhoneNumber: '07888888888',
            exporterFaxNumber: '',
            exporterEmailAddress: 'test1@test.com',
            importerOrganisationName: 'Test organisation 2',
            importerAddress: '2 Some Street, Paris, 75002',
            importerCountry: 'France',
            importerContactFullName: 'Jane Smith',
            importerContactPhoneNumber: '0033140000000',
            importerFaxNumber: '0033140000000',
            importerEmailAddress: 'test2@test.com',
            wasteCollectionDate: '01/01/2050',
            estimatedOrActualCollectionDate: 'actual',
            firstCarrierOrganisationName: 'Test organisation 3',
            firstCarrierAddress: 'Some address, London, EC2N4AY',
            firstCarrierCountry: 'England',
            firstCarrierContactFullName: 'England',
            firstCarrierContactPhoneNumber: '07888888844',
            firstCarrierFaxNumber: '07888888844',
            firstCarrierEmailAddress: 'test3@test.com',
            firstCarrierMeansOfTransport: 'inland waterways',
            firstCarrierMeansOfTransportDetails: 'details',
            secondCarrierOrganisationName: '',
            secondCarrierAddress: '',
            secondCarrierCountry: '',
            secondCarrierContactFullName: '',
            secondCarrierContactPhoneNumber: '',
            secondCarrierFaxNumber: '',
            secondCarrierEmailAddress: '',
            secondCarrierMeansOfTransport: '',
            secondCarrierMeansOfTransportDetails: '',
            thirdCarrierOrganisationName: '',
            thirdCarrierAddress: '',
            thirdCarrierCountry: '',
            thirdCarrierContactFullName: '',
            thirdCarrierContactPhoneNumber: '',
            thirdCarrierFaxNumber: '',
            thirdCarrierEmailAddress: '',
            thirdCarrierMeansOfTransport: '',
            thirdCarrierMeansOfTransportDetails: '',
            fourthCarrierOrganisationName: '',
            fourthCarrierAddress: '',
            fourthCarrierCountry: '',
            fourthCarrierContactFullName: '',
            fourthCarrierContactPhoneNumber: '',
            fourthCarrierFaxNumber: '',
            fourthCarrierEmailAddress: '',
            fourthCarrierMeansOfTransport: '',
            fourthCarrierMeansOfTransportDetails: '',
            fifthCarrierOrganisationName: '',
            fifthCarrierAddress: '',
            fifthCarrierCountry: '',
            fifthCarrierContactFullName: '',
            fifthCarrierContactPhoneNumber: '',
            fifthCarrierFaxNumber: '',
            fifthCarrierEmailAddress: '',
            fifthCarrierMeansOfTransport: '',
            fifthCarrierMeansOfTransportDetails: '',
            wasteCollectionOrganisationName: 'Test organisation 5',
            wasteCollectionAddressLine1: '5 Some Street',
            wasteCollectionAddressLine2: '',
            wasteCollectionTownOrCity: 'London',
            wasteCollectionCountry: 'England',
            wasteCollectionPostcode: 'EC2N4AY',
            wasteCollectionContactFullName: 'John Johnson',
            wasteCollectionContactPhoneNumber: '07888888855',
            wasteCollectionFaxNumber: '07888888855',
            wasteCollectionEmailAddress: 'test5@test.com',
            whereWasteLeavesUk: 'Dover',
            transitCountries: 'France;Belgium',
            interimSiteOrganisationName: '',
            interimSiteAddress: '',
            interimSiteCountry: '',
            interimSiteContactFullName: '',
            interimSiteContactPhoneNumber: '',
            interimSiteFaxNumber: '',
            interimSiteEmailAddress: '',
            interimSiteRecoveryCode: '',
            laboratoryOrganisationName: 'Test organisation 7',
            laboratoryAddress: '',
            laboratoryCountry: '',
            laboratoryContactFullName: '',
            laboratoryContactPhoneNumber: '',
            laboratoryFaxNumber: '',
            laboratoryEmailAddress: '',
            laboratoryDisposalCode: '',
            firstRecoveryFacilityOrganisationName: 'Test organisation 6',
            firstRecoveryFacilityAddress: '4 Some Street, Paris, 75002',
            firstRecoveryFacilityCountry: 'France',
            firstRecoveryFacilityContactFullName: 'Jean Philip',
            firstRecoveryFacilityContactPhoneNumber: '0033140000066',
            firstRecoveryFacilityFaxNumber: '',
            firstRecoveryFacilityEmailAddress: 'test6@test.com',
            firstRecoveryFacilityRecoveryCode: 'r1',
            secondRecoveryFacilityOrganisationName: '',
            secondRecoveryFacilityAddress: '',
            secondRecoveryFacilityCountry: '',
            secondRecoveryFacilityContactFullName: '',
            secondRecoveryFacilityContactPhoneNumber: '',
            secondRecoveryFacilityFaxNumber: '',
            secondRecoveryFacilityEmailAddress: '',
            secondRecoveryFacilityRecoveryCode: '',
            thirdRecoveryFacilityOrganisationName: '',
            thirdRecoveryFacilityAddress: '',
            thirdRecoveryFacilityCountry: '',
            thirdRecoveryFacilityContactFullName: '',
            thirdRecoveryFacilityContactPhoneNumber: '',
            thirdRecoveryFacilityFaxNumber: '',
            thirdRecoveryFacilityEmailAddress: '',
            thirdRecoveryFacilityRecoveryCode: '',
            fourthRecoveryFacilityOrganisationName: '',
            fourthRecoveryFacilityAddress: '',
            fourthRecoveryFacilityCountry: '',
            fourthRecoveryFacilityContactFullName: '',
            fourthRecoveryFacilityContactPhoneNumber: '',
            fourthRecoveryFacilityFaxNumber: '',
            fourthRecoveryFacilityEmailAddress: '',
            fourthRecoveryFacilityRecoveryCode: '',
            fifthRecoveryFacilityOrganisationName: '',
            fifthRecoveryFacilityAddress: '',
            fifthRecoveryFacilityCountry: '',
            fifthRecoveryFacilityContactFullName: '',
            fifthRecoveryFacilityContactPhoneNumber: '',
            fifthRecoveryFacilityFaxNumber: '',
            fifthRecoveryFacilityEmailAddress: '',
            fifthRecoveryFacilityRecoveryCode: '',
          },
        ],
      });

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
                field: 'CustomerReference',
                message: validation.ReferenceValidationErrorMessages.invalid,
              },
            ],
            invalidStructureErrors: [
              {
                fields: ['WasteDescription', 'WasteQuantity'],
                message:
                  validation.WasteQuantityValidationErrorMessages.laboratory,
              },
              {
                fields: ['ImporterDetail', 'TransitCountries'],
                message:
                  validation.ImporterDetailValidationErrorMessages
                    .invalidCrossSectionCountry,
              },
              {
                fields: ['ImporterDetail', 'TransitCountries'],
                message:
                  validation.TransitCountriesValidationErrorMessages
                    .invalidCrossSection,
              },
              {
                fields: ['WasteDescription', 'RecoveryFacilityDetail'],
                message:
                  'Do not enter any laboratory details if you are exporting bulk waste',
              },
            ],
          },
        ],
      });
    });
  });

  describe('createSubmissions', () => {
    it('creates submissions', async () => {
      const response = await subject.createSubmissions({
        id: faker.string.uuid(),
        accountId: faker.string.uuid(),
        values: [
          {
            reference: faker.string.sample(),
            wasteDescription: {
              wasteCode: {
                type: 'BaselAnnexIX',
                code: faker.string.sample(),
              },
              ewcCodes: [
                {
                  code: faker.string.sample(),
                },
                {
                  code: faker.string.sample(),
                },
              ],
              description: faker.string.sample(),
            },
            wasteQuantity: {
              type: 'ActualData',
              actualData: {
                quantityType: 'Weight',
                value: faker.number.float(),
                unit: 'Tonne',
              },
              estimateData: {
                quantityType: 'Weight',
                value: faker.number.float(),
                unit: 'Tonne',
              },
            },
            exporterDetail: {
              exporterAddress: {
                country: faker.string.sample(),
                postcode: faker.string.sample(),
                townCity: faker.string.sample(),
                addressLine1: faker.string.sample(),
                addressLine2: faker.string.sample(),
              },
              exporterContactDetails: {
                organisationName: faker.string.sample(),
                fullName: faker.string.sample(),
                emailAddress: faker.string.sample(),
                phoneNumber: faker.string.sample(),
              },
            },
            importerDetail: {
              importerAddressDetails: {
                address: faker.string.sample(),
                country: faker.string.sample(),
                organisationName: faker.string.sample(),
              },
              importerContactDetails: {
                fullName: faker.string.sample(),
                emailAddress: faker.string.sample(),
                phoneNumber: faker.string.sample(),
              },
            },
            collectionDate: {
              type: 'ActualDate',
              actualDate: {
                year: '01',
                month: '01',
                day: '2025',
              },
              estimateDate: {},
            },
            carriers: [
              {
                transportDetails: {
                  type: 'Air',
                  description: 'RyanAir',
                },
                addressDetails: {
                  address: faker.string.sample(),
                  country: faker.string.sample(),
                  organisationName: faker.string.sample(),
                },
                contactDetails: {
                  emailAddress: faker.string.sample(),
                  faxNumber: faker.string.sample(),
                  fullName: faker.string.sample(),
                  phoneNumber: faker.string.sample(),
                },
              },
            ],
            collectionDetail: {
              address: {
                addressLine1: faker.string.sample(),
                addressLine2: faker.string.sample(),
                townCity: faker.string.sample(),
                postcode: faker.string.sample(),
                country: faker.string.sample(),
              },
              contactDetails: {
                organisationName: faker.string.sample(),
                fullName: faker.string.sample(),
                emailAddress: faker.string.sample(),
                phoneNumber: faker.string.sample(),
              },
            },
            ukExitLocation: {
              provided: 'Yes',
              value: faker.string.sample(),
            },
            transitCountries: ['Albania (AL)'],
            recoveryFacilityDetail: [
              {
                addressDetails: {
                  address: faker.string.sample(),
                  country: faker.string.sample(),
                  name: faker.string.sample(),
                },
                contactDetails: {
                  emailAddress: faker.string.sample(),
                  faxNumber: faker.string.sample(),
                  fullName: faker.string.sample(),
                  phoneNumber: faker.string.sample(),
                },
                recoveryFacilityType: {
                  type: 'Laboratory',
                  disposalCode: 'D1',
                },
              },
            ],
          },
          {
            reference: faker.string.sample(),

            wasteDescription: {
              wasteCode: {
                type: 'BaselAnnexIX',
                code: faker.string.sample(),
              },
              ewcCodes: [
                {
                  code: faker.string.sample(),
                },
                {
                  code: faker.string.sample(),
                },
              ],
              description: faker.string.sample(),
            },
            wasteQuantity: {
              type: 'ActualData',
              actualData: {
                quantityType: 'Weight',
                value: faker.number.float(),
                unit: 'Tonne',
              },
              estimateData: {
                quantityType: 'Weight',
                value: faker.number.float(),
                unit: 'Tonne',
              },
            },
            exporterDetail: {
              exporterAddress: {
                country: faker.string.sample(),
                postcode: faker.string.sample(),
                townCity: faker.string.sample(),
                addressLine1: faker.string.sample(),
                addressLine2: faker.string.sample(),
              },
              exporterContactDetails: {
                organisationName: faker.string.sample(),
                fullName: faker.string.sample(),
                emailAddress: faker.string.sample(),
                phoneNumber: faker.string.sample(),
              },
            },
            importerDetail: {
              importerAddressDetails: {
                address: faker.string.sample(),
                country: faker.string.sample(),
                organisationName: faker.string.sample(),
              },
              importerContactDetails: {
                fullName: faker.string.sample(),
                emailAddress: faker.string.sample(),
                phoneNumber: faker.string.sample(),
              },
            },
            collectionDate: {
              type: 'ActualDate',
              actualDate: {
                year: '01',
                month: '01',
                day: '2025',
              },
              estimateDate: {},
            },
            carriers: [
              {
                transportDetails: {
                  type: 'Air',
                  description: 'RyanAir',
                },
                addressDetails: {
                  address: faker.string.sample(),
                  country: faker.string.sample(),
                  organisationName: faker.string.sample(),
                },
                contactDetails: {
                  emailAddress: faker.string.sample(),
                  faxNumber: faker.string.sample(),
                  fullName: faker.string.sample(),
                  phoneNumber: faker.string.sample(),
                },
              },
            ],
            collectionDetail: {
              address: {
                addressLine1: faker.string.sample(),
                addressLine2: faker.string.sample(),
                townCity: faker.string.sample(),
                postcode: faker.string.sample(),
                country: faker.string.sample(),
              },
              contactDetails: {
                organisationName: faker.string.sample(),
                fullName: faker.string.sample(),
                emailAddress: faker.string.sample(),
                phoneNumber: faker.string.sample(),
              },
            },
            ukExitLocation: {
              provided: 'Yes',
              value: faker.string.sample(),
            },
            transitCountries: ['Albania (AL)'],
            recoveryFacilityDetail: [
              {
                addressDetails: {
                  address: faker.string.sample(),
                  country: faker.string.sample(),
                  name: faker.string.sample(),
                },
                contactDetails: {
                  emailAddress: faker.string.sample(),
                  faxNumber: faker.string.sample(),
                  fullName: faker.string.sample(),
                  phoneNumber: faker.string.sample(),
                },
                recoveryFacilityType: {
                  type: 'Laboratory',
                  disposalCode: 'D1',
                },
              },
            ],
          },
        ],
      });
      expect(response.success).toBe(true);
      if (response.success) {
        return;
      }
      expect(mockRepository.createBulkRecords).toBeCalled();
      expect(response.error.statusCode).toBe(500);
    });
  });

  describe('getBulkSubmissions', () => {
    const id = faker.string.uuid();
    const submission = {
      id: id,
      reference: faker.string.sample(),
      wasteDescription: {
        wasteCode: {
          type: 'BaselAnnexIX',
          code: faker.string.sample(),
        },
        ewcCodes: [
          {
            code: faker.string.sample(),
          },
          {
            code: faker.string.sample(),
          },
        ],
        description: faker.string.sample(),
      },
      wasteQuantity: {
        type: 'ActualData',
        actualData: {
          quantityType: 'Weight',
          value: faker.number.float(),
          unit: 'Tonne',
        },
        estimateData: {
          quantityType: 'Weight',
          value: faker.number.float(),
          unit: 'Tonne',
        },
      },
      exporterDetail: {
        exporterAddress: {
          country: faker.string.sample(),
          postcode: faker.string.sample(),
          townCity: faker.string.sample(),
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
        },
        exporterContactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      importerDetail: {
        importerAddressDetails: {
          address: faker.string.sample(),
          country: faker.string.sample(),
          organisationName: faker.string.sample(),
        },
        importerContactDetails: {
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      collectionDate: {
        type: 'ActualDate',
        actualDate: {
          year: '01',
          month: '01',
          day: '2025',
        },
        estimateDate: {},
      },
      carriers: [
        {
          transportDetails: {
            type: 'Air',
            description: 'RyanAir',
          },
          addressDetails: {
            address: faker.string.sample(),
            country: faker.string.sample(),
            organisationName: faker.string.sample(),
          },
          contactDetails: {
            emailAddress: faker.string.sample(),
            faxNumber: faker.string.sample(),
            fullName: faker.string.sample(),
            phoneNumber: faker.string.sample(),
          },
        },
      ],
      collectionDetail: {
        address: {
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
          townCity: faker.string.sample(),
          postcode: faker.string.sample(),
          country: faker.string.sample(),
        },
        contactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      ukExitLocation: {
        provided: 'Yes',
        value: faker.string.sample(),
      },
      transitCountries: ['Albania (AL)'],
      recoveryFacilityDetail: [
        {
          addressDetails: {
            address: faker.string.sample(),
            country: faker.string.sample(),
            name: faker.string.sample(),
          },
          contactDetails: {
            emailAddress: faker.string.sample(),
            faxNumber: faker.string.sample(),
            fullName: faker.string.sample(),
            phoneNumber: faker.string.sample(),
          },
          recoveryFacilityType: {
            type: 'Laboratory',
            disposalCode: 'D1',
          },
        },
      ],
      submissionDeclaration: {
        declarationTimestamp: new Date(),
        transactionId: faker.string.sample(),
      },
      submissionState: {
        status: 'UpdatedWithActuals',
        timestamp: new Date(),
      },
    } as Submission;

    const bulkSubmissions = [submission, submission];
    bulkSubmissions[1].id = faker.string.uuid();

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecords.mockRejectedValue(Boom.notFound());

      const response = await subject.getBulkSubmissions({
        accountId: faker.string.uuid(),
        submissionIds: bulkSubmissions.map((s) => s.id),
      });
      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }
      expect(response.error.statusCode).toBe(404);
    });

    it('gets bulk submissions', async () => {
      const accountId = faker.string.uuid();

      mockRepository.getRecords.mockResolvedValue({
        totalRecords: 2,
        totalPages: 1,
        currentPage: 1,
        pages: [],
        values: bulkSubmissions,
      });

      const response = await subject.getBulkSubmissions({
        accountId,
        submissionIds: bulkSubmissions.map((s) => s.id),
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(response.value).toEqual(bulkSubmissions);
      expect(mockRepository.getRecords).toBeCalled();
    });
  });

  describe('getWasteQuantity', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();

    const submission = {
      id: id,
      reference: faker.string.sample(),
      wasteDescription: {
        wasteCode: {
          type: 'BaselAnnexIX',
          code: faker.string.sample(),
        },
        ewcCodes: [
          {
            code: faker.string.sample(),
          },
          {
            code: faker.string.sample(),
          },
        ],
        description: faker.string.sample(),
      },
      wasteQuantity: {
        type: 'ActualData',
        actualData: {
          quantityType: 'Weight',
          value: faker.number.float(),
          unit: 'Tonne',
        },
        estimateData: {
          quantityType: 'Weight',
          value: faker.number.float(),
          unit: 'Tonne',
        },
      },
      exporterDetail: {
        exporterAddress: {
          country: faker.string.sample(),
          postcode: faker.string.sample(),
          townCity: faker.string.sample(),
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
        },
        exporterContactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      importerDetail: {
        importerAddressDetails: {
          address: faker.string.sample(),
          country: faker.string.sample(),
          organisationName: faker.string.sample(),
        },
        importerContactDetails: {
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      collectionDate: {
        type: 'ActualDate',
        actualDate: {
          year: '01',
          month: '01',
          day: '2025',
        },
        estimateDate: {},
      },
      carriers: [
        {
          transportDetails: {
            type: 'Air',
            description: 'RyanAir',
          },
          addressDetails: {
            address: faker.string.sample(),
            country: faker.string.sample(),
            organisationName: faker.string.sample(),
          },
          contactDetails: {
            emailAddress: faker.string.sample(),
            faxNumber: faker.string.sample(),
            fullName: faker.string.sample(),
            phoneNumber: faker.string.sample(),
          },
        },
      ],
      collectionDetail: {
        address: {
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
          townCity: faker.string.sample(),
          postcode: faker.string.sample(),
          country: faker.string.sample(),
        },
        contactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      ukExitLocation: {
        provided: 'Yes',
        value: faker.string.sample(),
      },
      transitCountries: ['Albania (AL)'],
      recoveryFacilityDetail: [
        {
          addressDetails: {
            address: faker.string.sample(),
            country: faker.string.sample(),
            name: faker.string.sample(),
          },
          contactDetails: {
            emailAddress: faker.string.sample(),
            faxNumber: faker.string.sample(),
            fullName: faker.string.sample(),
            phoneNumber: faker.string.sample(),
          },
          recoveryFacilityType: {
            type: 'Laboratory',
            disposalCode: 'D1',
          },
        },
      ],
      submissionDeclaration: {
        declarationTimestamp: new Date(),
        transactionId: faker.string.sample(),
      },
      submissionState: {
        status: 'UpdatedWithActuals',
        timestamp: new Date(),
      },
    } as Submission;

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.notFound());

      const response = await subject.getWasteQuantity({ id, accountId });
      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }
      expect(response.error.statusCode).toBe(404);
    });

    it('returns waste quantity', async () => {
      mockRepository.getRecord.mockResolvedValue(submission);

      const response = await subject.getWasteQuantity({ id, accountId });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }
      expect(response.value).toBe(submission.wasteQuantity);
    });
  });

  describe('setWasteQuantity', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();

    const submission = {
      id: id,
      reference: faker.string.sample(),
      wasteDescription: {
        wasteCode: {
          type: 'BaselAnnexIX',
          code: faker.string.sample(),
        },
        ewcCodes: [
          {
            code: faker.string.sample(),
          },
          {
            code: faker.string.sample(),
          },
        ],
        description: faker.string.sample(),
      },
      wasteQuantity: {
        type: 'ActualData',
        actualData: {
          quantityType: 'Weight',
          value: faker.number.float(),
          unit: 'Tonne',
        },
        estimateData: {},
      },
      exporterDetail: {
        exporterAddress: {
          country: faker.string.sample(),
          postcode: faker.string.sample(),
          townCity: faker.string.sample(),
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
        },
        exporterContactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      importerDetail: {
        importerAddressDetails: {
          address: faker.string.sample(),
          country: faker.string.sample(),
          organisationName: faker.string.sample(),
        },
        importerContactDetails: {
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      collectionDate: {
        type: 'ActualDate',
        actualDate: {
          year: '01',
          month: '01',
          day: '2025',
        },
        estimateDate: {},
      },
      carriers: [
        {
          transportDetails: {
            type: 'Air',
            description: 'RyanAir',
          },
          addressDetails: {
            address: faker.string.sample(),
            country: faker.string.sample(),
            organisationName: faker.string.sample(),
          },
          contactDetails: {
            emailAddress: faker.string.sample(),
            faxNumber: faker.string.sample(),
            fullName: faker.string.sample(),
            phoneNumber: faker.string.sample(),
          },
        },
      ],
      collectionDetail: {
        address: {
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
          townCity: faker.string.sample(),
          postcode: faker.string.sample(),
          country: faker.string.sample(),
        },
        contactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      ukExitLocation: {
        provided: 'Yes',
        value: faker.string.sample(),
      },
      transitCountries: ['Albania (AL)'],
      recoveryFacilityDetail: [
        {
          addressDetails: {
            address: faker.string.sample(),
            country: faker.string.sample(),
            name: faker.string.sample(),
          },
          contactDetails: {
            emailAddress: faker.string.sample(),
            faxNumber: faker.string.sample(),
            fullName: faker.string.sample(),
            phoneNumber: faker.string.sample(),
          },
          recoveryFacilityType: {
            type: 'Laboratory',
            disposalCode: 'D1',
          },
        },
      ],
      submissionDeclaration: {
        declarationTimestamp: new Date(),
        transactionId: faker.string.sample(),
      },
      submissionState: {
        status: 'SubmittedWithEstimates',
        timestamp: new Date(),
      },
    } as Submission;

    const actualWasteQuantity = {
      type: 'ActualData',
      actualData: {
        quantityType: 'Weight',
        value: faker.number.float(),
        unit: 'Tonne',
      },
    } as WasteQuantity;

    const estimateWasteQuantity = {
      type: 'EstimateData',
      estimateData: {
        quantityType: 'Weight',
        value: faker.number.float(),
        unit: 'Tonne',
      },
    } as WasteQuantity;

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.notFound());

      const response = await subject.setWasteQuantity({
        id,
        accountId,
        value: actualWasteQuantity,
      });
      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }
      expect(response.error.statusCode).toBe(404);
    });

    it('is successful but does not update the record when it already contains actual values', async () => {
      mockRepository.getRecord.mockResolvedValue(submission);

      const response = await subject.setWasteQuantity({
        id,
        accountId,
        value: actualWasteQuantity,
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }
      expect(response.value).toBe(undefined);
    });

    it('updates the record when a valid waste quantity is provided', async () => {
      submission.submissionState = {
        status: 'SubmittedWithEstimates',
        timestamp: new Date(),
      };

      submission.wasteQuantity = {
        type: 'EstimateData',
        actualData: {},
        estimateData: {
          quantityType: 'Weight',
          value: faker.number.float(),
          unit: 'Tonne',
        },
      };

      mockRepository.getRecord.mockResolvedValue(submission);

      const response = await subject.setWasteQuantity({
        id,
        accountId,
        value: actualWasteQuantity,
      });

      expect(response.success).toBe(true);
      expect(submission.wasteQuantity.actualData).toBe(
        actualWasteQuantity.actualData,
      );
      expect(submission.wasteQuantity.actualData.unit).toBe('Tonne');
      expect(submission.submissionState.status).toBe('UpdatedWithActuals');
    });

    it('sets the correct WasteQuantity unit based upon the waste codes provided', async () => {
      submission.wasteDescription.wasteCode.type = 'NotApplicable';

      submission.wasteQuantity = {
        type: 'EstimateData',
        actualData: {},
        estimateData: {
          quantityType: 'Weight',
          value: faker.number.float(),
        },
      };

      submission.submissionState = {
        status: 'SubmittedWithEstimates',
        timestamp: new Date(),
      };

      mockRepository.getRecord.mockResolvedValue(submission);

      let response = await subject.setWasteQuantity({
        id,
        accountId,
        value: actualWasteQuantity,
      });

      expect(response.success).toBe(true);
      expect(submission.wasteQuantity.actualData).toBe(
        actualWasteQuantity.actualData,
      );
      expect(submission.wasteQuantity.actualData.unit).toBe('Kilogram');
      expect(submission.submissionState.status).toBe('UpdatedWithActuals');

      submission.wasteDescription.wasteCode.type = 'NotApplicable';
      actualWasteQuantity.actualData.quantityType = 'Volume';

      submission.wasteQuantity = {
        type: 'EstimateData',
        actualData: {},
        estimateData: {
          quantityType: 'Weight',
          value: faker.number.float(),
        },
      };

      submission.submissionState = {
        status: 'SubmittedWithEstimates',
        timestamp: new Date(),
      };

      mockRepository.getRecord.mockResolvedValue(submission);

      response = await subject.setWasteQuantity({
        id,
        accountId,
        value: actualWasteQuantity,
      });

      expect(response.success).toBe(true);
      expect(submission.wasteQuantity.actualData).toBe(
        actualWasteQuantity.actualData,
      );
      expect(submission.wasteQuantity.actualData.unit).toBe('Litre');
      expect(submission.submissionState.status).toBe('UpdatedWithActuals');

      submission.wasteDescription.wasteCode.type = 'NotApplicable';
      estimateWasteQuantity.estimateData.quantityType = 'Volume';

      submission.wasteQuantity = {
        type: 'EstimateData',
        actualData: {},
        estimateData: {
          quantityType: 'Volume',
          value: faker.number.float(),
        },
      };

      submission.submissionState = {
        status: 'SubmittedWithEstimates',
        timestamp: new Date(),
      };

      mockRepository.getRecord.mockResolvedValue(submission);

      response = await subject.setWasteQuantity({
        id,
        accountId,
        value: estimateWasteQuantity,
      });

      expect(response.success).toBe(true);
      expect(submission.wasteQuantity.estimateData).toBe(
        estimateWasteQuantity.estimateData,
      );
      expect(submission.wasteQuantity.estimateData.unit).toBe('Litre');
      expect(submission.submissionState.status).toBe('SubmittedWithEstimates');

      submission.wasteDescription.wasteCode.type = 'NotApplicable';
      estimateWasteQuantity.estimateData.quantityType = 'Weight';

      submission.wasteQuantity = {
        type: 'EstimateData',
        actualData: {},
        estimateData: {
          quantityType: 'Weight',
          value: faker.number.float(),
        },
      };

      submission.submissionState = {
        status: 'SubmittedWithEstimates',
        timestamp: new Date(),
      };

      mockRepository.getRecord.mockResolvedValue(submission);

      response = await subject.setWasteQuantity({
        id,
        accountId,
        value: estimateWasteQuantity,
      });

      expect(response.success).toBe(true);
      expect(submission.wasteQuantity.estimateData).toBe(
        estimateWasteQuantity.estimateData,
      );
      expect(submission.wasteQuantity.estimateData.unit).toBe('Kilogram');
      expect(submission.submissionState.status).toBe('SubmittedWithEstimates');

      submission.wasteDescription.wasteCode.type = 'AnnexIIIB';
      actualWasteQuantity.actualData.quantityType = 'Volume';

      submission.wasteQuantity = {
        type: 'EstimateData',
        actualData: {},
        estimateData: {
          quantityType: 'Volume',
          value: faker.number.float(),
        },
      };

      submission.submissionState = {
        status: 'SubmittedWithEstimates',
        timestamp: new Date(),
      };

      mockRepository.getRecord.mockResolvedValue(submission);

      response = await subject.setWasteQuantity({
        id,
        accountId,
        value: actualWasteQuantity,
      });

      expect(response.success).toBe(true);
      expect(submission.wasteQuantity.actualData).toBe(
        actualWasteQuantity.actualData,
      );
      expect(submission.wasteQuantity.actualData.unit).toBe('Cubic Metre');
      expect(submission.submissionState.status).toBe('UpdatedWithActuals');

      submission.wasteDescription.wasteCode.type = 'AnnexIIIB';
      actualWasteQuantity.actualData.quantityType = 'Weight';

      submission.wasteQuantity = {
        type: 'EstimateData',
        actualData: {},
        estimateData: {
          quantityType: 'Weight',
          value: faker.number.float(),
        },
      };

      submission.submissionState = {
        status: 'SubmittedWithEstimates',
        timestamp: new Date(),
      };

      mockRepository.getRecord.mockResolvedValue(submission);

      response = await subject.setWasteQuantity({
        id,
        accountId,
        value: actualWasteQuantity,
      });

      expect(response.success).toBe(true);
      expect(submission.wasteQuantity.actualData).toBe(
        actualWasteQuantity.actualData,
      );
      expect(submission.wasteQuantity.actualData.unit).toBe('Tonne');
      expect(submission.submissionState.status).toBe('UpdatedWithActuals');

      submission.wasteDescription.wasteCode.type = 'AnnexIIIB';
      estimateWasteQuantity.estimateData.quantityType = 'Weight';

      submission.wasteQuantity = {
        type: 'EstimateData',
        actualData: {},
        estimateData: {
          quantityType: 'Weight',
          value: faker.number.float(),
        },
      };

      submission.submissionState = {
        status: 'SubmittedWithEstimates',
        timestamp: new Date(),
      };

      mockRepository.getRecord.mockResolvedValue(submission);

      response = await subject.setWasteQuantity({
        id,
        accountId,
        value: estimateWasteQuantity,
      });

      expect(response.success).toBe(true);
      expect(submission.wasteQuantity.estimateData).toBe(
        estimateWasteQuantity.estimateData,
      );
      expect(submission.wasteQuantity.estimateData.unit).toBe('Tonne');
      expect(submission.submissionState.status).toBe('SubmittedWithEstimates');

      submission.wasteDescription.wasteCode.type = 'AnnexIIIB';
      estimateWasteQuantity.estimateData.quantityType = 'Volume';

      submission.wasteQuantity = {
        type: 'EstimateData',
        actualData: {},
        estimateData: {
          quantityType: 'Volume',
          value: faker.number.float(),
        },
      };

      submission.submissionState = {
        status: 'SubmittedWithEstimates',
        timestamp: new Date(),
      };

      mockRepository.getRecord.mockResolvedValue(submission);

      response = await subject.setWasteQuantity({
        id,
        accountId,
        value: estimateWasteQuantity,
      });

      expect(response.success).toBe(true);
      expect(submission.wasteQuantity.estimateData).toBe(
        estimateWasteQuantity.estimateData,
      );
      expect(submission.wasteQuantity.estimateData.unit).toBe('Cubic Metre');
      expect(submission.submissionState.status).toBe('SubmittedWithEstimates');
    });
  });

  describe('getCollectionDate', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();

    const submission = {
      id: id,
      reference: faker.string.sample(),
      wasteDescription: {
        wasteCode: {
          type: 'BaselAnnexIX',
          code: faker.string.sample(),
        },
        ewcCodes: [
          {
            code: faker.string.sample(),
          },
          {
            code: faker.string.sample(),
          },
        ],
        description: faker.string.sample(),
      },
      wasteQuantity: {
        type: 'ActualData',
        actualData: {
          quantityType: 'Weight',
          value: faker.number.float(),
          unit: 'Tonne',
        },
        estimateData: {
          quantityType: 'Weight',
          value: faker.number.float(),
          unit: 'Tonne',
        },
      },
      exporterDetail: {
        exporterAddress: {
          country: faker.string.sample(),
          postcode: faker.string.sample(),
          townCity: faker.string.sample(),
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
        },
        exporterContactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      importerDetail: {
        importerAddressDetails: {
          address: faker.string.sample(),
          country: faker.string.sample(),
          organisationName: faker.string.sample(),
        },
        importerContactDetails: {
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      collectionDate: {
        type: 'ActualDate',
        actualDate: {
          year: '01',
          month: '01',
          day: '2025',
        },
        estimateDate: {},
      },
      carriers: [
        {
          transportDetails: {
            type: 'Air',
            description: 'RyanAir',
          },
          addressDetails: {
            address: faker.string.sample(),
            country: faker.string.sample(),
            organisationName: faker.string.sample(),
          },
          contactDetails: {
            emailAddress: faker.string.sample(),
            faxNumber: faker.string.sample(),
            fullName: faker.string.sample(),
            phoneNumber: faker.string.sample(),
          },
        },
      ],
      collectionDetail: {
        address: {
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
          townCity: faker.string.sample(),
          postcode: faker.string.sample(),
          country: faker.string.sample(),
        },
        contactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      ukExitLocation: {
        provided: 'Yes',
        value: faker.string.sample(),
      },
      transitCountries: ['Albania (AL)'],
      recoveryFacilityDetail: [
        {
          addressDetails: {
            address: faker.string.sample(),
            country: faker.string.sample(),
            name: faker.string.sample(),
          },
          contactDetails: {
            emailAddress: faker.string.sample(),
            faxNumber: faker.string.sample(),
            fullName: faker.string.sample(),
            phoneNumber: faker.string.sample(),
          },
          recoveryFacilityType: {
            type: 'Laboratory',
            disposalCode: 'D1',
          },
        },
      ],
      submissionDeclaration: {
        declarationTimestamp: new Date(),
        transactionId: faker.string.sample(),
      },
      submissionState: {
        status: 'UpdatedWithActuals',
        timestamp: new Date(),
      },
    } as Submission;

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.notFound());

      const response = await subject.getCollectionDate({ id, accountId });
      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }
      expect(response.error.statusCode).toBe(404);
    });

    it('returns the collection date', async () => {
      mockRepository.getRecord.mockResolvedValue(submission);

      const response = await subject.getCollectionDate({ id, accountId });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }
      expect(response.value).toBe(submission.collectionDate);
    });
  });

  describe('setCollectionDate', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();

    const submission = {
      id: id,
      reference: faker.string.sample(),
      wasteDescription: {
        wasteCode: {
          type: 'BaselAnnexIX',
          code: faker.string.sample(),
        },
        ewcCodes: [
          {
            code: faker.string.sample(),
          },
          {
            code: faker.string.sample(),
          },
        ],
        description: faker.string.sample(),
      },
      wasteQuantity: {
        type: 'ActualData',
        actualData: {
          quantityType: 'Weight',
          value: faker.number.float(),
          unit: 'Tonne',
        },
        estimateData: {},
      },
      exporterDetail: {
        exporterAddress: {
          country: faker.string.sample(),
          postcode: faker.string.sample(),
          townCity: faker.string.sample(),
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
        },
        exporterContactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      importerDetail: {
        importerAddressDetails: {
          address: faker.string.sample(),
          country: faker.string.sample(),
          organisationName: faker.string.sample(),
        },
        importerContactDetails: {
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      collectionDate: {
        type: 'EstimateDate',
        actualDate: {},
        estimateDate: {
          year: '01',
          month: '01',
          day: '2025',
        },
      },
      carriers: [
        {
          transportDetails: {
            type: 'Air',
            description: 'RyanAir',
          },
          addressDetails: {
            address: faker.string.sample(),
          },
          contactDetails: {
            emailAddress: faker.string.sample(),
            faxNumber: faker.string.sample(),
            fullName: faker.string.sample(),
            phoneNumber: faker.string.sample(),
          },
        },
      ],
      collectionDetail: {
        address: {
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
          townCity: faker.string.sample(),
          postcode: faker.string.sample(),
          country: faker.string.sample(),
        },
        contactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      ukExitLocation: {
        provided: 'Yes',
        value: faker.string.sample(),
      },
      transitCountries: ['Albania (AL)'],
      recoveryFacilityDetail: [
        {
          addressDetails: {
            address: faker.string.sample(),
            country: faker.string.sample(),
            name: faker.string.sample(),
          },
          contactDetails: {
            emailAddress: faker.string.sample(),
            faxNumber: faker.string.sample(),
            fullName: faker.string.sample(),
            phoneNumber: faker.string.sample(),
          },
          recoveryFacilityType: {
            type: 'Laboratory',
            disposalCode: 'D1',
          },
        },
      ],
      submissionDeclaration: {
        declarationTimestamp: new Date(),
        transactionId: faker.string.sample(),
      },
      submissionState: {
        status: 'SubmittedWithEstimates',
        timestamp: new Date(),
      },
    } as Submission;

    const actualCollectionDate = {
      type: 'ActualDate',
      actualDate: {
        year: '2025',
        month: '01',
        day: '01',
      },
    } as CollectionDate;

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.notFound());

      const response = await subject.setCollectionDate({
        id,
        accountId,
        value: actualCollectionDate,
      });
      expect(response.success).toBe(false);

      if (response.success) {
        return;
      }
      expect(response.error.statusCode).toBe(404);
    });

    it('successfully sets the collection date', async () => {
      mockRepository.getRecord.mockResolvedValue(submission);

      const response = await subject.setCollectionDate({
        id,
        accountId,
        value: actualCollectionDate,
      });

      expect(response.success).toBe(true);
      expect(submission.collectionDate.actualDate).toStrictEqual(
        actualCollectionDate.actualDate,
      );
      expect(submission.submissionState.status).toBe('UpdatedWithActuals');
    });

    it('returns undefined success when the submission status is not SubmittedWithEstimates', async () => {
      submission.submissionState = {
        status: 'UpdatedWithActuals',
        timestamp: new Date(),
      };

      mockRepository.getRecord.mockResolvedValue(submission);

      const response = await subject.setCollectionDate({
        id,
        accountId,
        value: actualCollectionDate,
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }
      expect(response.value).toBe(undefined);
    });
  });
});
