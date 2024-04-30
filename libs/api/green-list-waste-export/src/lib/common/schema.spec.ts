import Ajv from 'ajv/dist/jtd';
import { faker } from '@faker-js/faker';
import {
  GetRecordsRequest,
  OptionalStringInput,
  OrganisationDetail,
  RecordState,
  UkOrganisationDetail,
} from './dto';
import {
  getRecordsRequest,
  optionalStringInput,
  organisationDetail,
  recordState,
  ukOrganisationDetail,
} from './schema';

const ajv = new Ajv();

describe('ukOrganisationDetail', () => {
  const validate = ajv.compile<UkOrganisationDetail>(ukOrganisationDetail);

  it('is compatible with dto value', () => {
    const value: UkOrganisationDetail = {
      addressDetail: {
        addressLine1: 'Address line 1',
        addressLine2: 'Address line 2',
        townCity: 'London',
        postcode: 'EC1N 2HA',
        country: 'England',
      },
      contactDetail: {
        organisationName: 'Org name',
        fullName: 'John Doe',
        emailAddress: 'test@test.com',
        phoneNumber: '07888888888',
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('organisationDetail', () => {
  const validate = ajv.compile<OrganisationDetail>(organisationDetail);

  it('is compatible with dto value', () => {
    const value: OrganisationDetail = {
      addressDetail: {
        organisationName: 'Org name',
        address: 'Address, Paris, 14444',
        country: 'France',
      },
      contactDetail: {
        fullName: 'Jean Doe',
        emailAddress: 'test@test.com',
        phoneNumber: '07888888888',
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('optionalStringInput', () => {
  const validate = ajv.compile<OptionalStringInput>(optionalStringInput);

  it('is compatible with dto value', () => {
    const value: OptionalStringInput = {
      provided: 'Yes',
      value: 'Option',
    };

    expect(validate(value)).toBe(true);
  });
});

describe('recordState', () => {
  const validate = ajv.compile<RecordState>(recordState);

  it('is compatible with dto value', () => {
    const value: RecordState = {
      status: 'Cancelled',
      timestamp: new Date(),
      cancellationType: {
        type: 'Other',
        reason: 'Some reason',
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getRecordsRequest', () => {
  const validate = ajv.compile<GetRecordsRequest>(getRecordsRequest);

  it('is compatible with success value', () => {
    const value: GetRecordsRequest = {
      accountId: faker.datatype.uuid(),
      order: 'DESC',
      state: ['SubmittedWithActuals', 'UpdatedWithActuals'],
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
