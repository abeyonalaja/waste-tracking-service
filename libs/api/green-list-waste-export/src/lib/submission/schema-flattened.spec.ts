import { faker } from '@faker-js/faker';
import Ajv from 'ajv/dist/jtd';
import {
  ValidateSubmissionsRequest,
  ValidateSubmissionsResponse,
} from './dto-flattened';
import {
  validateSubmissionsRequest,
  validateSubmissionsResponse,
} from './schema-flattened';

const ajv = new Ajv();

describe('validateSubmissionsRequest', () => {
  const validate = ajv.compile<ValidateSubmissionsRequest>(
    validateSubmissionsRequest,
  );

  it('is compatible with dto values', () => {
    const value: ValidateSubmissionsRequest = {
      accountId: faker.string.uuid(),
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
          wasteQuantityTonnes: '',
          wasteQuantityCubicMetres: '1.2',
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
          wasteCollectionDate: '01/01/0001',
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
    };

    expect(validate(value)).toBe(true);
  });
});

describe('validateSubmissionsResponse', () => {
  const validate = ajv.compile<ValidateSubmissionsResponse>(
    validateSubmissionsResponse,
  );

  it('is compatible with dto values', () => {
    const value: ValidateSubmissionsResponse = {
      success: true,
      value: {
        valid: true,
        accountId: faker.string.uuid(),
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
                address: '2 Some Street, Paris, 75002',
                country: 'France',
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
                year: '0001',
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
      },
    };

    expect(validate(value)).toBe(true);
  });
});
