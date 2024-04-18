import Ajv from 'ajv/dist/jtd';
import { faker } from '@faker-js/faker';
import {
  producer,
  receiver,
  wasteTypeDetails,
  wasteTransportationDetails,
  validateSubmissionsRequest,
  validateSubmissionsResponse,
} from './submission.schema';
import {
  ProducerDetails,
  ReceiverDetails,
  WasteTypeDetails,
  WasteTransportationDetails,
  ValidateSubmissionsRequest,
  ValidateSubmissionsResponse,
} from './submission.dto';

const ajv = new Ajv();

describe('producer', () => {
  const validate = ajv.compile<ProducerDetails>(producer);

  it('is compatible with dto values', () => {
    const value: ProducerDetails = {
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
  const validate = ajv.compile<WasteTypeDetails>(wasteTypeDetails);

  it('is compatible with dto values', () => {
    const value: WasteTypeDetails = {
      ewcCode: '01 03 04',
      wasteDescription: 'waste description',
      physicalForm: 'Solid',
      wasteQuantity: 100,
      quantityUnits: 'Tonne',
      wasteQuantityType: 'ActualData',
      hasHazardousProperties: false,
      containsPops: false,
      hazardousWasteCodes: [
        {
          code: 'HP1',
          concentration: 1,
          concentrationUnit: 'Kilogram',
          name: 'test',
          packageGroup: 'I',
          properShippingName: 'test',
          specialHandlingRequirements: 'test',
          unClass: '1.1',
          unIdentificationNumber: '1234',
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
  const validate = ajv.compile<ReceiverDetails>(receiver);

  it('is compatible with dto values and phone number contains 11 caracters', () => {
    const value: ReceiverDetails = {
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

    const isValid = validate(value);

    if (!isValid) {
      console.log('error validation case 1');
      console.log(validate.errors);
    }

    expect(isValid).toBe(true);
  });

  it('is compatible with dto values and phone number contains 13 caracters', () => {
    const value: ReceiverDetails = {
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
    const value: ReceiverDetails = {
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

describe('wasteTransportationDetails', () => {
  const validate = ajv.compile<WasteTransportationDetails>(
    wasteTransportationDetails
  );

  it('is compatible with dto values', () => {
    const value: WasteTransportationDetails = {
      numberAndTypeOfContainers: '1 x 20L drum',
      specialHandlingRequirements: 'special handling requirements',
    };

    expect(validate(value)).toBe(true);
  });

  it('handles optional properties', () => {
    const value: WasteTransportationDetails = {
      numberAndTypeOfContainers: '1 x 20L drum',
    };

    expect(validate(value)).toBe(true);
  });
});

describe('validateSubmissionsRequest', () => {
  const validate = ajv.compile<ValidateSubmissionsRequest>(
    validateSubmissionsRequest
  );

  it('is compatible with dto values', () => {
    const value: ValidateSubmissionsRequest = {
      accountId: faker.datatype.uuid(),
      values: [
        {
          producerOrganisationName: 'Producer Organisation Name',
          producerContactName: 'Producer Contact Name',
          producerEmail: 'Producer Email',
          producerPhone: 'Producer Phone',
          producerAddressLine1: 'Producer Address Line 1',
          producerAddressLine2: 'Producer Address Line 2',
          producerTownCity: 'Producer Town/City',
          producerPostcode: 'Producer Postcode',
          producerCountry: 'Producer Country',
          producerSicCode: 'Producer SIC Code',
          reference: 'Reference',
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
        },
      ],
    };

    expect(validate(value)).toBe(true);
  });
});

describe('validateSubmissionsResponse', () => {
  const validate = ajv.compile<ValidateSubmissionsResponse>(
    validateSubmissionsResponse
  );

  it('is compatible with dto values when valid', () => {
    const value: ValidateSubmissionsResponse = {
      success: true,
      value: {
        valid: true,
        accountId: faker.datatype.uuid(),
        values: [
          {
            wasteTransportationDetails: {
              numberAndTypeOfContainers: 'test',
              specialHandlingRequirements: 'test',
            },
            wasteTypeDetails: [
              {
                ewcCode: '01 03 04',
                wasteDescription: 'waste description',
                physicalForm: 'Solid',
                wasteQuantity: 100,
                quantityUnits: 'Tonne',
                wasteQuantityType: 'ActualData',
                hasHazardousProperties: false,
                containsPops: false,
                hazardousWasteCodes: [
                  {
                    code: 'HP1',
                    concentration: 1,
                    concentrationUnit: 'Kilogram',
                    name: 'test',
                    packageGroup: 'I',
                    properShippingName: 'test',
                    specialHandlingRequirements: 'test',
                    unClass: '1.1',
                    unIdentificationNumber: '1234',
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
