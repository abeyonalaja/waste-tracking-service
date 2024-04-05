import Ajv from 'ajv/dist/jtd';
import { producer, wasteTypeDetails } from './submission.schema';
import { ProducerDetails, WasteTypeDetails } from './submission.dto';

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
      quantityUnits: 'Tonnes',
      wasteQuantityType: 'ActualData',
      haveHazardousProperties: true,
      containsPop: false,
      hazardousPropertiesCode: 'H1',
      popDetails: 'pop details',
    };

    const isValid = validate(value);

    expect(isValid).toBe(true);
  });
});
