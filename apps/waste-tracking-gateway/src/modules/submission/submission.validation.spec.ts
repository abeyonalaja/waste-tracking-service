import { faker } from '@faker-js/faker';
import {
  validateCreateSubmissionRequest,
  validatePutReferenceRequest,
  validatePutWasteDescriptionRequest,
  validatePutWasteQuantityRequest,
  validatePutExporterDetailRequest,
  validatePutImporterDetailRequest,
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
        value: {
          type: 'NotApplicable',
          value: faker.datatype.string(10),
        },
      })
    ).toBe(false);

    expect(
      validate({
        status: 'NotStarted',
        value: {
          type: 'ActualData',
          quantityType: 'Volume',
          value: faker.datatype.number(),
        },
      })
    ).toBe(false);

    expect(
      validate({
        status: 'Complete',
        value: {
          type: 'EstimateData',
          value: faker.datatype.number(),
        },
      })
    ).toBe(false);

    expect(
      validate({
        status: 'Started',
        value: {
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
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Started',
        value: { type: 'NotApplicable' },
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Started',
        value: {
          type: 'ActualData',
          quantityType: 'Weight',
          value: faker.datatype.float({ precision: 0.01 }),
        },
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Complete',
        value: {
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

  test('should return true for object without faxNumber', () => {
    const data = {
      status: 'Started',
      exporterContactDetails: {
        organisationName: 'Acme Inc.',
        fullName: 'John Doe',
        emailAddress: 'johndoe@acme.com',
        phoneNumber: '555-1234',
      },
    };
    expect(validatePutExporterDetailRequest(data)).toBe(true);
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

  it('should return true for a request with a missing addressLine2', () => {
    const data = {
      status: 'Complete',
      exporterAddress: {
        addressLine1: '123 Main St',
        townCity: 'Anytown',
        postcode: '12345',
        country: 'UK',
      },
      exporterContactDetails: {
        organisationName: 'Acme Inc.',
        fullName: 'John Doe',
        emailAddress: 'johndoe@acme.com',
        phoneNumber: '555-1234',
        faxNumber: '555-5678',
      },
    };
    expect(validatePutExporterDetailRequest(data)).toBe(true);
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

describe('validatePutImporterDetailRequest', () => {
  test('should return true for object with status: NotStarted', () => {
    expect(validatePutImporterDetailRequest({ status: 'NotStarted' })).toBe(
      true
    );
  });

  it('should return true for a request with a complete importer detail', () => {
    const data = {
      status: 'Started',
      importerAddressDetails: {
        organisationName: 'Acme Inc',
        address: '123 Anytown',
        country: 'UK',
      },
      importerContactDetails: {
        fullName: 'John Doe',
        emailAddress: 'johndoe@acme.com',
        phoneNumber: '555-1234',
        faxNumber: '555-5678',
      },
    };
    expect(validatePutImporterDetailRequest(data)).toBe(true);
  });

  it('should return false for a request with a missing property', () => {
    const data = {
      status: 'Complete',
      importerContactDetails: {
        organisationName: 'Acme Inc.',
        address: '123 Anytown',
        country: undefined,
        fullName: 'John Doe',
        emailAddress: 'johndoe@acme.com',
        phoneNumber: '555-1234',
        faxNumber: '555-5678',
      },
    };

    expect(validatePutImporterDetailRequest(data)).toBe(false);
  });

  test('should return false for object with invalid importerContactDetails', () => {
    const data = {
      status: 'Started',
      importerContactDetails: {
        organisationName: 'Acme Inc.',
        address: '123 Anytown',
        country: 'UK',
        fullName: 'John Doe',
        emailAddress: 'johndoe@acme.com',
        phoneNumber: 5551234,
        faxNumber: '555-5678',
      },
    };
    expect(validatePutImporterDetailRequest(data)).toBe(false);
  });

  test('should return false for object where status is not started', () => {
    const data = {
      status: 'NotStarted',
      importerContactDetails: {
        fullName: 'John Doe',
      },
    };
    expect(validatePutImporterDetailRequest(data)).toBe(false);
  });
});
