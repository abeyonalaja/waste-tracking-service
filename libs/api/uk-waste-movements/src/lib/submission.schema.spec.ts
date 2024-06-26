import Ajv from 'ajv/dist/jtd';
import { faker } from '@faker-js/faker';
import {
  producer,
  receiver,
  wasteType,
  wasteTransportation,
  validateSubmissionsRequest,
  validateSubmissionsResponse,
  wasteCollection,
  carrier,
  createSubmissionsRequest,
} from './submission.schema';
import {
  ProducerDetail,
  ReceiverDetail,
  WasteTypeDetail,
  WasteTransportationDetail,
  ValidateSubmissionsRequest,
  ValidateSubmissionsResponse,
  WasteCollectionDetail,
  CarrierDetail,
  CreateSubmissionsRequest,
} from './submission.dto';

const ajv = new Ajv();

describe('producer', () => {
  const validate = ajv.compile<ProducerDetail>(producer);

  it('is compatible with dto values', () => {
    const value: ProducerDetail = {
      reference: 'testRef',
      sicCode: '123456',
      contact: {
        organisationName: 'org',
        name: 'name',
        email: 'example@email.co.uk',
        phone: '02071234567',
      },
      address: {
        addressLine1: '123 Oxford Street',
        addressLine2: 'Westminster',
        townCity: 'London',
        postcode: 'W1A 1AA',
        country: 'England',
      },
    };

    const isValid = validate(value);

    expect(isValid).toBe(true);
  });
});

describe('wasteTypeDetails', () => {
  const validate = ajv.compile<WasteTypeDetail>(wasteType);

  it('is compatible with dto values', () => {
    const value: WasteTypeDetail = {
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
    };

    const isValid = validate(value);

    expect(isValid).toBe(true);
  });
});

describe('receiver', () => {
  const validate = ajv.compile<ReceiverDetail>(receiver);

  it('is compatible with dto values and phone number contains 11 caracters', () => {
    const value: ReceiverDetail = {
      authorizationType: 'permit',
      environmentalPermitNumber: '123',
      contact: {
        organisationName: 'org',
        name: 'name',
        email: 'example@email.co.uk',
        phone: '02071234567',
      },
      address: {
        addressLine1: '123 Oxford Street',
        addressLine2: 'Westminster',
        townCity: 'London',
        postcode: 'W1A 1AA',
        country: 'England',
      },
    };

    expect(validate(value)).toBe(true);
  });

  it('is compatible with dto values and phone number contains 13 caracters', () => {
    const value: ReceiverDetail = {
      authorizationType: 'permit',
      environmentalPermitNumber: '123',
      contact: {
        organisationName: 'org',
        name: 'name',
        email: 'myemail@sample.com',
        phone: '+442071234567',
      },
      address: {
        addressLine1: '123 Oxford Street',
        addressLine2: 'Westminster',
        townCity: 'London',
        postcode: 'W1A 1AA',
        country: 'England',
      },
    };

    expect(validate(value)).toBe(true);
  });

  it('is compatible with dto values and phone number contains 13 caracters and an environmental Permit number with space and ()', () => {
    const value: ReceiverDetail = {
      authorizationType: 'permit',
      environmentalPermitNumber: 'E123-456-ABC (1)',
      contact: {
        organisationName: 'org',
        name: 'name',
        email: 'myemail@sample.com',
        phone: '+442071234567',
      },
      address: {
        addressLine1: '123 Oxford Street',
        addressLine2: 'Westminster',
        townCity: 'London',
        postcode: 'W1A 1AA',
        country: 'England',
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('wasteCollection', () => {
  const validate = ajv.compile<WasteCollectionDetail>(wasteCollection);

  it('is compatible with dto values', () => {
    const value: WasteCollectionDetail = {
      address: {
        addressLine1: '123 Oxford Street',
        addressLine2: 'Westminster',
        townCity: 'London',
        postcode: 'W1A 1AA',
        country: 'England',
      },
      wasteSource: 'Household',
      brokerRegistrationNumber: '1234567',
      carrierRegistrationNumber: 'CBDU1234',
      localAuthority: 'local authority',
      expectedWasteCollectionDate: {
        day: '01',
        month: '01',
        year: '2028',
      },
    };

    const isValid = validate(value);

    expect(isValid).toBe(true);
  });
});

describe('carrier', () => {
  const validate = ajv.compile<CarrierDetail>(carrier);

  it('is compatible with dto values', () => {
    const value: CarrierDetail = {
      contact: {
        organisationName: 'org',
        name: 'name',
        email: 'example@email.co.uk',
        phone: '02071234567',
      },
      address: {
        addressLine1: '123 Oxford Street',
        addressLine2: 'Westminster',
        townCity: 'London',
        postcode: 'W1A 1AA',
        country: 'England',
      },
    };

    const isValid = validate(value);

    expect(isValid).toBe(true);
  });
});

describe('wasteTransportationDetails', () => {
  const validate = ajv.compile<WasteTransportationDetail>(wasteTransportation);

  it('is compatible with dto values', () => {
    const value: WasteTransportationDetail = {
      numberAndTypeOfContainers: '1 x 20L drum',
      specialHandlingRequirements: 'special handling requirements',
    };

    expect(validate(value)).toBe(true);
  });

  it('handles optional properties', () => {
    const value: WasteTransportationDetail = {
      numberAndTypeOfContainers: '1 x 20L drum',
    };

    expect(validate(value)).toBe(true);
  });
});

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
          producerOrganisationName: 'Producer Organisation Name',
          producerContactName: 'Producer Contact Name',
          producerContactEmail: 'Producer Email',
          producerContactPhone: 'Producer Phone',
          producerAddressLine1: 'Producer Address Line 1',
          producerAddressLine2: 'Producer Address Line 2',
          producerTownCity: 'Producer Town/City',
          producerPostcode: 'Producer Postcode',
          producerCountry: 'Producer Country',
          producerSicCode: 'Producer SIC Code',
          customerReference: 'Reference',
          receiverAuthorizationType: 'Receiver Authorization Type',
          receiverEnvironmentalPermitNumber:
            'Receiver Environmental Permit Number',
          receiverOrganisationName: 'Receiver Organisation Name',
          receiverAddressLine1: 'Receiver Address Line 1',
          receiverAddressLine2: 'Receiver Address Line 2',
          receiverTownCity: 'Receiver Town/City',
          receiverPostcode: 'Receiver Postcode',
          receiverCountry: 'Receiver Country',
          receiverContactName: 'Receiver Contact Name',
          receiverContactPhone: 'Receiver Contact Phone',
          receiverContactEmail: 'Receiver Contact Email',
          wasteTransportationNumberAndTypeOfContainers:
            'Waste Transportation Number And Type Of Containers',
          wasteTransportationSpecialHandlingRequirements:
            'Waste Transportation Special Handling Requirements',
          wasteCollectionExpectedWasteCollectionDate: '2022-01-01',
          wasteCollectionLocalAuthority: 'Waste Collection Local Authority',
          wasteCollectionWasteSource: 'Household',
          wasteCollectionAddressLine1: 'Waste Collection Address Line 1',
          wasteCollectionAddressLine2: 'Waste Collection Address Line 2',
          wasteCollectionBrokerRegistrationNumber:
            'Waste Collection Broker Registration Number',
          wasteCollectionCarrierRegistrationNumber:
            'Waste Collection Carrier Registration Number',
          wasteCollectionCountry: 'Waste Collection Country',
          wasteCollectionPostcode: 'Waste Collection Postcode',
          wasteCollectionTownCity: 'Waste Collection Town/City',
          firstWasteTypeEwcCode: '010203',
          firstWasteTypeWasteDescription: 'Waste',
          firstWasteTypePhysicalForm: 'Solid',
          firstWasteTypeWasteQuantity: '15',
          firstWasteTypeWasteQuantityUnit: 'Tonne',
          firstWasteTypeWasteQuantityType: 'EstimateData',
          firstWasteTypeHasHazardousProperties: 'Yes',
          firstWasteTypeHazardousWasteCodesString: 'HP1',
          firstWasteTypeContainsPops: 'No',
          firstWasteTypePopsString: '',
          firstWasteTypePopsConcentrationsString: '',
          firstWasteTypePopsConcentrationUnitsString: '',
          firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString: '',
          firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            '',
          firstWasteTypeChemicalAndBiologicalComponentsString: '',
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

  it('is compatible with dto values when valid', () => {
    const value: ValidateSubmissionsResponse = {
      success: true,
      value: {
        valid: true,
        accountId: faker.string.uuid(),
        values: [
          {
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
              localAuthority: 'Waste Collection Local Authority',
              wasteSource: 'Household',
              brokerRegistrationNumber:
                'Waste Collection Broker Registration Number',
              carrierRegistrationNumber:
                'Waste Collection Carrier Registration Number',
            },
            carrier: {
              contact: {
                organisationName: 'org',
                name: 'name',
                email: 'example@email.co.uk',
                phone: '02071234567',
              },
              address: {
                addressLine1: '123 Oxford Street',
                addressLine2: 'Westminster',
                townCity: 'London',
                postcode: 'W1A 1AA',
                country: 'England',
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
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('createSubmissionsRequest', () => {
  const validate = ajv.compile<CreateSubmissionsRequest>(
    createSubmissionsRequest,
  );

  it('is compatible with dto value', () => {
    const value: CreateSubmissionsRequest = {
      accountId: faker.string.uuid(),
      values: [
        {
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
            localAuthority: 'Waste Collection Local Authority',
            wasteSource: 'Household',
            brokerRegistrationNumber:
              'Waste Collection Broker Registration Number',
            carrierRegistrationNumber:
              'Waste Collection Carrier Registration Number',
          },
          carrier: {
            contact: {
              organisationName: 'org',
              name: 'name',
              email: 'example@email.co.uk',
              phone: '02071234567',
            },
            address: {
              addressLine1: '123 Oxford Street',
              addressLine2: 'Westminster',
              townCity: 'London',
              postcode: 'W1A 1AA',
              country: 'England',
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
    };

    expect(validate(value)).toBe(true);
  });
});
