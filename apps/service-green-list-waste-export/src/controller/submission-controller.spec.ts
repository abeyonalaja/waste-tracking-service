import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { expect, jest } from '@jest/globals';
import winston from 'winston';
import SubmissionController from './submission-controller';
import { DaprReferenceDataClient } from '@wts/client/reference-data';
import { validation } from '../model';

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
          {
            name: 'France [FR]',
          },
          {
            name: 'Belgium [BE]',
          },
        ],
      });
      mockClient.getCountries.mockResolvedValueOnce({
        success: true,
        value: [
          {
            name: 'United Kingdom (England) [GB-ENG]',
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
          },
        ],
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockClient.getWasteCodes).toBeCalled();
      expect(mockClient.getEWCCodes).toBeCalled();
      expect(mockClient.getCountries).toBeCalledTimes(2);
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
      mockClient.getCountries.mockResolvedValueOnce({
        success: true,
        value: [
          {
            name: 'United Kingdom (England) [GB-ENG]',
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
          },
        ],
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockClient.getWasteCodes).toBeCalled();
      expect(mockClient.getEWCCodes).toBeCalled();
      expect(mockClient.getCountries).toBeCalledTimes(2);
      expect(mockClient.getRecoveryCodes).toBeCalled();
      expect(mockClient.getDisposalCodes).toBeCalled();

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
                  validation.AnnexIIIACodeValidationErrorMessages.invalid,
              },
              {
                field: 'WasteDescription',
                message: validation.EWCCodeErrorMessages.invalid,
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
                message: validation.CollectionDateValidationErrorMessages.empty,
              },
              {
                field: 'CollectionDate',
                message:
                  validation.CollectionDateValidationErrorMessages.missingType,
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
          {
            name: 'France [FR]',
          },
          {
            name: 'Belgium [BE]',
          },
        ],
      });
      mockClient.getCountries.mockResolvedValueOnce({
        success: true,
        value: [
          {
            name: 'United Kingdom (England) [GB-ENG]',
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
          },
        ],
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockClient.getWasteCodes).toBeCalled();
      expect(mockClient.getEWCCodes).toBeCalled();
      expect(mockClient.getCountries).toBeCalledTimes(2);
      expect(mockClient.getRecoveryCodes).toBeCalled();
      expect(mockClient.getDisposalCodes).toBeCalled();

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
                  validation.TransitCountriesErrorMessages.invalidCrossSection,
              },
            ],
          },
        ],
      });
    });
  });
});
