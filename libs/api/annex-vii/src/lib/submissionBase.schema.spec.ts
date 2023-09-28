import { faker } from '@faker-js/faker';
import Ajv from 'ajv/dist/jtd';
import {
  ListDraftCarriersResponse,
  CreateDraftCarriersRequest,
  SetDraftCarriersRequest,
  DeleteDraftCarriersRequest,
  ListDraftRecoveryFacilityDetailsResponse,
  CreateDraftRecoveryFacilityDetailsRequest,
  SetDraftRecoveryFacilityDetailsRequest,
  DeleteDraftRecoveryFacilityDetailsRequest,
  SetDraftExitLocationByIdRequest,
  SetDraftTransitCountriesRequest,
} from './submissionBase.dto';
import {
  listDraftCarriersResponse,
  createDraftCarriersRequest,
  setDraftCarriersRequest,
  deleteDraftCarriersRequest,
  listDraftRecoveryFacilityDetailsResponse,
  createDraftRecoveryFacilityDetailsRequest,
  setDraftRecoveryFacilityDetailsRequest,
  deleteDraftRecoveryFacilityDetailsRequest,
  setDraftExitLocationByIdRequest,
  setDraftTransitCountriesRequest,
} from './submissionBase.schema';

const ajv = new Ajv();

describe('listDraftCarriersResponse', () => {
  const validate = ajv.compile<ListDraftCarriersResponse>(
    listDraftCarriersResponse
  );

  it('is compatible with success value', () => {
    const value: ListDraftCarriersResponse = {
      success: true,
      value: {
        status: 'Complete',
        transport: true,
        values: [
          {
            id: faker.datatype.uuid(),
            addressDetails: {
              organisationName: faker.datatype.string(),
              address: faker.datatype.string(),
              country: faker.datatype.string(),
            },
            contactDetails: {
              fullName: faker.datatype.string(),
              emailAddress: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
            },
            transportDetails: {
              type: 'ShippingContainer',
              shippingContainerNumber: faker.datatype.string(),
            },
          },
        ],
      },
    };

    expect(validate(value)).toBe(true);
  });

  it('is compatible with error value', () => {
    validate({
      success: false,
      error: {
        statusCode: 400,
        name: 'BadRequest',
        message: 'Bad request',
      },
    });
  });
});

describe('createDraftCarriersRequest', () => {
  const validate = ajv.compile<CreateDraftCarriersRequest>(
    createDraftCarriersRequest
  );

  it('is compatible with dto values', () => {
    const value: CreateDraftCarriersRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Started',
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftCarrierRequest', () => {
  const validate = ajv.compile<SetDraftCarriersRequest>(
    setDraftCarriersRequest
  );

  it('is compatible with dto values', () => {
    const carrierId = faker.datatype.uuid();
    let value: SetDraftCarriersRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      carrierId: carrierId,
      value: {
        status: 'Started',
        transport: true,
        values: [
          {
            id: carrierId,
            addressDetails: {
              organisationName: faker.datatype.string(),
              address: faker.datatype.string(),
              country: faker.datatype.string(),
            },
            contactDetails: {
              fullName: faker.datatype.string(),
              emailAddress: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
            },
            transportDetails: {
              type: 'ShippingContainer',
              shippingContainerNumber: faker.datatype.string(),
            },
          },
        ],
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      carrierId: carrierId,
      value: {
        status: 'NotStarted',
        transport: true,
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      carrierId: carrierId,
      value: {
        status: 'Started',
        transport: false,
        values: [
          {
            id: carrierId,
            addressDetails: {
              organisationName: faker.datatype.string(),
              address: faker.datatype.string(),
              country: faker.datatype.string(),
            },
            contactDetails: {
              fullName: faker.datatype.string(),
              emailAddress: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
            },
          },
        ],
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('deleteDraftCarrierRequest', () => {
  const validate = ajv.compile<DeleteDraftCarriersRequest>(
    deleteDraftCarriersRequest
  );

  it('is compatible with dto values', () => {
    const value: DeleteDraftCarriersRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      carrierId: faker.datatype.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftExitLocationByIdRequest', () => {
  const validate = ajv.compile<SetDraftExitLocationByIdRequest>(
    setDraftExitLocationByIdRequest
  );

  it('is compatible with dto values', () => {
    let value: SetDraftExitLocationByIdRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: faker.datatype.string(),
        },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Complete',
        exitLocation: {
          provided: 'No',
        },
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftTransitCountriesRequest', () => {
  const validate = ajv.compile<SetDraftTransitCountriesRequest>(
    setDraftTransitCountriesRequest
  );

  it('is compatible with dto values', () => {
    let value: SetDraftTransitCountriesRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'NotStarted',
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Started',
        values: ['N.Ireland', 'Wales'],
      },
    };

    expect(validate(value)).toBe(true);
    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Complete',
        values: ['N.Ireland', 'Wales', 'England'],
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('listDraftRecoveryFacilityDetailsResponse', () => {
  const validate = ajv.compile<ListDraftRecoveryFacilityDetailsResponse>(
    listDraftRecoveryFacilityDetailsResponse
  );

  it('is compatible with success value', () => {
    const value: ListDraftRecoveryFacilityDetailsResponse = {
      success: true,
      value: {
        status: 'Complete',
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
            },
          },
        ],
      },
    };

    expect(validate(value)).toBe(true);
  });

  it('is compatible with error value', () => {
    validate({
      success: false,
      error: {
        statusCode: 400,
        name: 'BadRequest',
        message: 'Bad request',
      },
    });
  });
});

describe('createDraftRecoveryFacilityDetailsRequest', () => {
  const validate = ajv.compile<CreateDraftRecoveryFacilityDetailsRequest>(
    createDraftRecoveryFacilityDetailsRequest
  );

  it('is compatible with dto values', () => {
    const value: CreateDraftRecoveryFacilityDetailsRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Started',
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftRecoveryFacilityDetailsRequest', () => {
  const validate = ajv.compile<SetDraftRecoveryFacilityDetailsRequest>(
    setDraftRecoveryFacilityDetailsRequest
  );

  it('is compatible with dto values', () => {
    let value: SetDraftRecoveryFacilityDetailsRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      rfdId: faker.datatype.uuid(),
      value: {
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
            },
          },
        ],
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      rfdId: faker.datatype.uuid(),
      value: {
        status: 'NotStarted',
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      rfdId: faker.datatype.uuid(),
      value: {
        status: 'Started',
        values: [
          {
            id: faker.datatype.uuid(),
            recoveryFacilityType: {
              type: 'RecoveryFacility',
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
            },
          },
        ],
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('deleteDraftRecoveryFacilityDetailsRequest', () => {
  const validate = ajv.compile<DeleteDraftRecoveryFacilityDetailsRequest>(
    deleteDraftRecoveryFacilityDetailsRequest
  );

  it('is compatible with dto values', () => {
    const value: DeleteDraftRecoveryFacilityDetailsRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      rfdId: faker.datatype.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});
