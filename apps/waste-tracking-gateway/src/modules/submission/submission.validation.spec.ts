import { faker } from '@faker-js/faker';
import {
  validateCreateSubmissionRequest,
  validatePutReferenceRequest,
  validatePutWasteDescriptionRequest,
  validatePutWasteQuantityRequest,
  validatePutExporterDetailRequest,
} from './submission.validation';

describe('validateCreateSubmissionRequest', () => {
  const validate = validateCreateSubmissionRequest;

  it('Rejects invalid values', () => {
    expect(validate(undefined)).toBe(false);
    expect(validate(faker.datatype.string(10))).toBe(false);
    expect(validate({ ref: faker.datatype.string(10) })).toBe(false);
    expect(validate({ reference: faker.datatype.number() })).toBe(false);
    expect(validate({ reference: faker.datatype.boolean() })).toBe(false);
    expect(validate({ reference: {} })).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(validate({})).toBe(true);
    expect(validate({ reference: faker.datatype.string(10) })).toBe(true);
  });
});

describe('validatePutReferenceRequest', () => {
  const validate = validatePutReferenceRequest;

  it('Rejects invalid values', () => {
    expect(validate(faker.datatype.number())).toBe(false);
    expect(validate(faker.datatype.array())).toBe(false);
    expect(validate({})).toBe(false);
    expect(validate({ reference: faker.datatype.string(10) })).toBe(false);
    expect(validate(undefined)).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(validate(faker.datatype.string(10))).toBe(true);
    expect(validate(null)).toBe(true);
  });
});

describe('validatePutWasteDescriptionRequest', () => {
  const validate = validatePutWasteDescriptionRequest;

  it('Rejects invalid values', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'Started',
        wasteCode: { type: 'NotApplicable', value: faker.datatype.string(10) },
      })
    ).toBe(false);

    expect(
      validate({
        status: 'Started',
        nationalCode: { provided: 'No', value: faker.datatype.string(10) },
      })
    ).toBe(false);

    expect(
      validate({
        status: 'Complete',
        wasteCode: { type: 'BaselAnnexIX', value: faker.datatype.string(10) },
      })
    ).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        status: 'NotStarted',
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Started',
        wasteCode: { type: 'NotApplicable' },
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Started',
        wasteCode: { type: 'BaselAnnexIX', value: faker.datatype.string(10) },
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Complete',
        wasteCode: { type: 'AnnexIIIA', value: faker.datatype.string(10) },
        ewcCodes: ['Z'],
        nationalCode: { provided: 'No' },
        description: 'Waste',
      })
    ).toBe(true);
  });
});

describe('validatePutWasteQuantityRequest', () => {
  const validate = validatePutWasteQuantityRequest;

  it('Rejects invalid values', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'Started',
        wasteQuantity: {
          type: 'NotApplicable',
          value: faker.datatype.string(10),
        },
      })
    ).toBe(false);

    expect(
      validate({
        status: 'NotStarted',
        wasteQuantity: {
          type: 'ActualData',
          quantityType: 'Volume',
          value: faker.datatype.number(10),
        },
      })
    ).toBe(false);

    expect(
      validate({
        status: 'Complete',
        wasteCode: { type: 'EstimateData', value: faker.datatype.number(10) },
      })
    ).toBe(false);

    expect(
      validate({
        status: 'Started',
        wasteQuantity: {
          type: 'ActualData',
          quantityType: 'Weight',
          value: faker.datatype.string(10),
        },
      })
    ).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        status: 'NotStarted',
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Started',
        wasteQuantity: { type: 'NotApplicable' },
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Started',
        wasteQuantity: {
          type: 'ActualData',
          quantityType: 'Weight',
          value: faker.datatype.float({ precision: 0.01 }),
        },
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Complete',
        wasteQuantity: {
          type: 'ActualData',
          quantityType: 'Volume',
          value: faker.datatype.float({ precision: 0.01 }),
        },
      })
    ).toBe(true);
  });
});

describe('validatePutExporterDetailRequest', () => {
  test('should return true for object with status: NotStarted', () => {
    expect(validatePutExporterDetailRequest({ status: 'NotStarted' })).toBe(
      true
    );
  });

  it('should return false for a request with a missing property', () => {
    const data = {
      status: 'Complete',
      exporterAddress: {
        addressLine1: '123 Main St',
        addressLine2: '',
        townCity: 'Anytown',
        postcode: '12345',
      },
      exporterContactDetails: {
        organisationName: 'Acme Inc.',
        fullName: 'John Doe',
        emailAddress: 'johndoe@acme.com',
        phoneNumber: '555-1234',
        faxNumber: '555-5678',
      },
    };

    expect(validatePutExporterDetailRequest(data)).toBe(false);
  });

  test('should return false for object with invalid exporterAddress', () => {
    const data = {
      status: 'Started',
      exporterAddress: {
        addressLine1: 123,
        townCity: 'Anytown',
        postcode: '12345',
        country: 'UK',
      },
    };
    expect(validatePutExporterDetailRequest(data)).toBe(false);
  });

  test('should return false for object with invalid exporterContactDetails', () => {
    const data = {
      status: 'Started',
      exporterContactDetails: {
        fullName: 'John Doe',
        emailAddress: 123,
      },
    };
    expect(validatePutExporterDetailRequest(data)).toBe(false);
  });

  test('should return false for object where status is not started', () => {
    const data = {
      status: 'NotStarted',
      exporterContactDetails: {
        fullName: 'John Doe',
      },
    };
    expect(validatePutExporterDetailRequest(data)).toBe(false);
  });
});
