import { faker } from '@faker-js/faker';
import Ajv from 'ajv/dist/jtd';
import {
  GetDraftByIdResponse,
  GetDraftsResponse,
  SetDraftCustomerReferenceByIdResponse,
  SetDraftWasteQuantityByIdRequest,
} from './dto';
import {
  getDraftByIdResponse,
  getDraftsResponse,
  setDraftCustomerReferenceByIdResponse,
  setDraftWasteQuantityByIdRequest,
} from './schema';

const ajv = new Ajv();

describe('getDraftsResponse', () => {
  const validate = ajv.compile<GetDraftsResponse>(getDraftsResponse);

  it('is compatible with success value', () => {
    const value: GetDraftsResponse = {
      success: true,
      value: [
        {
          id: faker.datatype.uuid(),
          reference: null,
          wasteDescription: { status: 'NotStarted' },
          wasteQuantity: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: { status: 'NotStarted' },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'NotStarted' },
        },
      ],
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

describe('getDraftByIdResponse', () => {
  const validate = ajv.compile<GetDraftByIdResponse>(getDraftByIdResponse);

  it('is compatible with dto value', () => {
    const value: GetDraftByIdResponse = {
      success: true,
      value: {
        id: faker.datatype.uuid(),
        reference: null,
        wasteDescription: {
          status: 'Complete',
          wasteCode: { type: 'NotApplicable' },
          ewcCodes: [],
          nationalCode: { provided: 'No' },
          description: '',
        },
        wasteQuantity: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: { status: 'NotStarted' },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'NotStarted' },
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftCustomerReferenceByIdResponse', () => {
  const validate = ajv.compile<SetDraftCustomerReferenceByIdResponse>(
    setDraftCustomerReferenceByIdResponse
  );

  it('is compatible with dto value', () => {
    const value: SetDraftCustomerReferenceByIdResponse = {
      success: true,
      value: undefined,
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftWasteQuantityByIdRequest', () => {
  const validate = ajv.compile<SetDraftWasteQuantityByIdRequest>(
    setDraftWasteQuantityByIdRequest
  );

  it('is compatible with dto values', () => {
    let value: SetDraftWasteQuantityByIdRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: { status: 'NotStarted' },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: { status: 'Started' },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Started',
        value: { type: 'ActualData' },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Complete',
        value: {
          type: 'ActualData',
          quantityType: 'Volume',
          value: 12,
        },
      },
    };

    expect(validate(value)).toBe(true);
  });
});
