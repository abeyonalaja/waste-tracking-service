import { faker } from '@faker-js/faker';
import {
  validateCreateSubmissionRequest,
  validatePutReferenceRequest,
  validatePutWasteDescriptionRequest,
  validatePutWasteQuantityRequest,
  validatePutExporterDetailRequest,
  validatePutImporterDetailRequest,
  validatePutCollectionDateRequest,
  validateSetCarriersRequest,
  validateSetCollectionDetailRequest,
  validatePutExitLocationRequest,
  validatePutTransitCountriesRequest,
  validateSetRecoveryFacilityDetailRequest,
  validatePutSubmissionConfirmationRequest,
  validatePutSubmissionDeclarationRequest,
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

  it('should return true for a request with a missing addressLine2 and postcode', () => {
    const data = {
      status: 'Complete',
      exporterAddress: {
        addressLine1: '123 Main St',
        townCity: 'Anytown',
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

describe('validatePutCollectionDateRequest', () => {
  const validate = validatePutCollectionDateRequest;

  it('Rejects invalid values', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'NotStarted',
        value: {
          type: 'ActualDate',
        },
      })
    ).toBe(false);

    expect(
      validate({
        status: 'Started',
      })
    ).toBe(false);

    expect(
      validate({
        status: 'Complete',
        value: {
          type: 'EstimateData',
        },
      })
    ).toBe(false);

    expect(
      validate({
        status: 'Complete',
        value: {
          type: 'ActualDate',
          day: 10,
          month: 12,
          year: 2020,
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
        status: 'Complete',
        value: {
          type: 'ActualDate',
          day: '10',
          month: '07',
          year: '2020',
        },
      })
    ).toBe(true);
  });
});

describe('validateSetCarriersRequest', () => {
  it('should return true for a request with a complete carrier detail and transport type shipping container', () => {
    const data = {
      status: 'Started',
      transport: true,
      values: [
        {
          id: faker.datatype.uuid(),
          addressDetails: {
            organisationName: 'Acme Inc',
            address: '123 Anytown',
            country: 'UK',
          },
          contactDetails: {
            fullName: 'John Doe',
            emailAddress: 'johndoe@acme.com',
            phoneNumber: '555-1234',
            faxNumber: '555-5678',
          },
          transportDetails: {
            type: 'ShippingContainer',
            shippingContainerNumber: '2347027',
            vehicleRegistration: 'TL12 TFL',
          },
        },
      ],
    };
    expect(validateSetCarriersRequest(data)).toBe(true);
  });

  it('should return true for a request with a complete carrier detail and transport type trailer', () => {
    const data = {
      status: 'Started',
      transport: true,
      values: [
        {
          id: faker.datatype.uuid(),
          addressDetails: {
            organisationName: 'Acme Inc',
            address: '123 Anytown',
            country: 'UK',
          },
          contactDetails: {
            fullName: 'John Doe',
            emailAddress: 'johndoe@acme.com',
            phoneNumber: '555-1234',
            faxNumber: '555-5678',
          },
          transportDetails: {
            type: 'Trailer',
            vehicleRegistration: 'TL12 TFL',
            trailerNumber: '2347027',
          },
        },
      ],
    };
    expect(validateSetCarriersRequest(data)).toBe(true);
  });

  it('should return true for a request with a complete carrier detail and transport type bulk vessel', () => {
    const data = {
      status: 'Started',
      transport: true,
      values: [
        {
          id: faker.datatype.uuid(),
          addressDetails: {
            organisationName: 'Acme Inc',
            address: '123 Anytown',
            country: 'UK',
          },
          contactDetails: {
            fullName: 'John Doe',
            emailAddress: 'johndoe@acme.com',
            phoneNumber: '555-1234',
            faxNumber: '555-5678',
          },
          transportDetails: {
            type: 'BulkVessel',
            imo: '2347027',
          },
        },
      ],
    };

    expect(validateSetCarriersRequest(data)).toBe(true);
  });

  it('should return false for a request with a invalid transportDetails', () => {
    const data = {
      status: 'Started',
      transport: true,
      values: [
        {
          id: faker.datatype.uuid(),
          addressDetails: {
            organisationName: 'Acme Inc',
            address: '123 Anytown',
            country: 'UK',
          },
          contactDetails: {
            fullName: 'John Doe',
            emailAddress: 'johndoe@acme.com',
            phoneNumber: '555-1234',
            faxNumber: '555-5678',
          },
          transportDetails: {
            type: 0,
            transportTypeNumber: 'number',
          },
        },
      ],
    };

    expect(validateSetCarriersRequest(data)).toBe(false);
  });

  it('should return false for a request with a missing id property', () => {
    const data = {
      status: 'Started',
      transport: true,
      values: [
        {
          addressDetails: {
            fullName: 'John Doe',
            emailAddress: 'johndoe@acme.com',
            phoneNumber: 5551234,
            faxNumber: '555-5678',
          },
          contactDetails: {
            fullName: 'John Doe',
            emailAddress: 'johndoe@acme.com',
            phoneNumber: '555-1234',
            faxNumber: '555-5678',
          },
          transportDetails: {
            type: 'ShippingContainer',
            shippingContainerNumber: '986960',
          },
        },
      ],
    };

    expect(validateSetCarriersRequest(data)).toBe(false);
  });

  it('should return false for object with invalid addressDetails', () => {
    const data = {
      status: 'Started',
      transport: true,
      values: [
        {
          id: faker.datatype.uuid(),
          addressDetails: {
            fullName: 'John Doe',
            emailAddress: 'johndoe@acme.com',
            phoneNumber: 5551234,
            faxNumber: '555-5678',
          },
          contactDetails: {
            fullName: 'John Doe',
            emailAddress: 'johndoe@acme.com',
            phoneNumber: '555-1234',
            faxNumber: '555-5678',
          },
          transportDetails: {
            type: 'ShippingContainer',
            shippingContainerNumber: '986960',
          },
        },
      ],
    };

    expect(validateSetCarriersRequest(data)).toBe(false);
  });
});

describe('validateSetCollectionDetailRequest', () => {
  it('should return true for object with status: NotStarted', () => {
    expect(validateSetCollectionDetailRequest({ status: 'NotStarted' })).toBe(
      true
    );
  });

  it('should return true for object without faxNumber', () => {
    const data = {
      status: 'Started',
      contactDetails: {
        organisationName: 'Acme Inc.',
        fullName: 'John Doe',
        emailAddress: 'johndoe@acme.com',
        phoneNumber: '555-1234',
      },
    };
    expect(validateSetCollectionDetailRequest(data)).toBe(true);
  });

  it('should return false for a request with a missing property', () => {
    const data = {
      status: 'Complete',
      address: {
        addressLine1: '123 Main St',
        addressLine2: '',
        townCity: 'Anytown',
        postcode: '12345',
      },
      contactDetails: {
        organisationName: 'Acme Inc.',
        fullName: 'John Doe',
        emailAddress: 'johndoe@acme.com',
        phoneNumber: '555-1234',
        faxNumber: '555-5678',
      },
    };

    expect(validateSetCollectionDetailRequest(data)).toBe(false);
  });

  it('should return true for a request with a missing addressLine2', () => {
    const data = {
      status: 'Complete',
      address: {
        addressLine1: '123 Main St',
        townCity: 'Anytown',
        postcode: '12345',
        country: 'UK',
      },
      contactDetails: {
        organisationName: 'Acme Inc.',
        fullName: 'John Doe',
        emailAddress: 'johndoe@acme.com',
        phoneNumber: '555-1234',
        faxNumber: '555-5678',
      },
    };
    expect(validateSetCollectionDetailRequest(data)).toBe(true);
  });

  it('should return false for object with invalid address', () => {
    const data = {
      status: 'Started',
      address: {
        addressLine1: 123,
        townCity: 'Anytown',
        postcode: '12345',
        country: 'UK',
      },
    };
    expect(validateSetCollectionDetailRequest(data)).toBe(false);
  });

  it('should return false for object with invalid contactDetails', () => {
    const data = {
      status: 'Started',
      contactDetails: {
        fullName: 'John Doe',
        emailAddress: 123,
      },
    };
    expect(validateSetCollectionDetailRequest(data)).toBe(false);
  });

  it('should return false for object where status is not started', () => {
    const data = {
      status: 'NotStarted',
      contactDetails: {
        fullName: 'John Doe',
      },
    };
    expect(validateSetCollectionDetailRequest(data)).toBe(false);
  });
});

describe('validatePutExitLocationRequest', () => {
  const validate = validatePutExitLocationRequest;

  it('Rejects an invalid request', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'Complete',
        exitLocation: {
          provided: 'No',
          value: faker.datatype.string(),
        },
      })
    ).toBe(false);

    expect(
      validate({
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
        },
      })
    ).toBe(false);
  });

  it('Accepts a valid request', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: faker.datatype.string(),
        },
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Complete',
        exitLocation: {
          provided: 'No',
        },
      })
    ).toBe(true);
  });
});

describe('validatePutTransitCountriesRequest', () => {
  const validate = validatePutTransitCountriesRequest;

  it('Rejects an invalid request', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'Complete',
        values: {},
      })
    ).toBe(false);

    expect(
      validate({
        status: 'Started',
        values: [1, 2, 3],
      })
    ).toBe(false);

    expect(
      validate({
        status: 'NotStarted',
        values: ['N.Ireland', 'Wales'],
      })
    ).toBe(false);
  });

  it('Accepts a valid request', () => {
    expect(
      validate({
        status: 'NotStarted',
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Started',
        values: [],
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Complete',
        values: ['N.Ireland', 'Wales'],
      })
    ).toBe(true);
  });
});

describe('validateSetRecoveryFacilityDetailRequest', () => {
  it('should return true for a request with a valid Laboratory and code type = disposalCode', () => {
    const data = {
      status: 'Started',
      values: [
        {
          id: faker.datatype.uuid(),
          recoveryFacilityType: {
            type: 'Laboratory',
            disposalCode: faker.datatype.string(),
          },
          addressDetails: {
            name: faker.datatype.string(),
            address: faker.datatype.string(),
            country: faker.datatype.string(),
          },
          contactDetails: {
            fullName: faker.datatype.string(),
            emailAddress: faker.datatype.string(),
            phoneNumber: faker.datatype.string(),
            faxNumber: faker.datatype.string(),
          },
        },
      ],
    };
    expect(validateSetRecoveryFacilityDetailRequest(data)).toBe(true);
  });

  it('should return true for a request with a valid InterimSite and code type = recoveryCode', () => {
    const data = {
      status: 'Started',
      values: [
        {
          id: faker.datatype.uuid(),
          recoveryFacilityType: {
            type: 'InterimSite',
            recoveryCode: faker.datatype.string(),
          },
          addressDetails: {
            name: faker.datatype.string(),
            address: faker.datatype.string(),
            country: faker.datatype.string(),
          },
          contactDetails: {
            fullName: faker.datatype.string(),
            emailAddress: faker.datatype.string(),
            phoneNumber: faker.datatype.string(),
            faxNumber: faker.datatype.string(),
          },
        },
      ],
    };
    expect(validateSetRecoveryFacilityDetailRequest(data)).toBe(true);
  });

  it('should return false for a request with an invalid Laboratory and code type = recoveryCode', () => {
    const data = {
      status: 'Started',
      values: [
        {
          id: faker.datatype.uuid(),
          recoveryFacilityType: {
            type: 'Laboratory',
            recoveryCode: faker.datatype.string(),
          },
          addressDetails: {
            name: faker.datatype.string(),
            address: faker.datatype.string(),
            country: faker.datatype.string(),
          },
          contactDetails: {
            fullName: faker.datatype.string(),
            emailAddress: faker.datatype.string(),
            phoneNumber: faker.datatype.string(),
            faxNumber: faker.datatype.string(),
          },
        },
      ],
    };
    expect(validateSetRecoveryFacilityDetailRequest(data)).toBe(false);
  });

  it('should return false for a request with a missing mandatopry property', () => {
    const data = {
      status: 'Started',
      values: [
        {
          id: faker.datatype.uuid(),
          recoveryFacilityType: {
            type: 'InterimSite',
            recoveryCode: faker.datatype.string(),
          },
          addressDetails: {
            name: faker.datatype.string(),
            country: faker.datatype.string(),
          },
          contactDetails: {
            fullName: faker.datatype.string(),
            emailAddress: faker.datatype.string(),
            phoneNumber: faker.datatype.string(),
            faxNumber: faker.datatype.string(),
          },
        },
      ],
    };
    expect(validateSetRecoveryFacilityDetailRequest(data)).toBe(false);
  });

  it('should return false for object with invalid addressDetails', () => {
    const data = {
      status: 'Started',
      values: [
        {
          id: faker.datatype.uuid(),
          recoveryFacilityType: {
            type: 'InterimSite',
            recoveryCode: faker.datatype.string(),
          },
          addressDetails: {
            name: faker.datatype.string(),
            address: faker.datatype.bigInt(),
            country: faker.datatype.string(),
          },
          contactDetails: {
            fullName: faker.datatype.string(),
            emailAddress: faker.datatype.string(),
            phoneNumber: faker.datatype.string(),
            faxNumber: faker.datatype.string(),
          },
        },
      ],
    };
    expect(validateSetRecoveryFacilityDetailRequest(data)).toBe(false);
  });
});

describe('validatePutSubmissionConfirmationRequest', () => {
  const validate = validatePutSubmissionConfirmationRequest;

  it('Rejects an invalid request', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'Complete',
      })
    ).toBe(false);
  });

  it('Accepts a valid request', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'NotStarted',
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Complete',
        confirmation: true,
      })
    ).toBe(true);
  });
});

describe('validatePutSubmissionDeclarationRequest', () => {
  const validate = validatePutSubmissionDeclarationRequest;

  it('Rejects an invalid request', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'Test',
      })
    ).toBe(false);
  });

  it('Accepts a valid request', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        status: 'NotStarted',
      })
    ).toBe(true);

    expect(
      validate({
        status: 'Complete',
      })
    ).toBe(true);
  });
});
