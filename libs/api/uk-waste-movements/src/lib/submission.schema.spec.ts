import Ajv from 'ajv/dist/jtd';
import { receiver } from './submission.schema';
import { ReceiverDetails } from './submission.dto';
import { producer } from './submission.schema';
import { ProducerDetails } from './submission.dto';
import { wasteTypeDetails } from './submission.schema';
import { WasteTypeDetails } from './submission.dto';

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
