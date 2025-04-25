import Ajv from 'ajv/dist/jtd';
import {
  CancelPaymentRequest,
  CancelPaymentResponse,
  CreatePaymentRequest,
  CreatePaymentResponse,
  GetPaymentRequest,
  GetPaymentResponse,
  SetPaymentRequest,
  SetPaymentResponse,
} from './payment';
import {
  cancelPaymentRequest,
  cancelPaymentResponse,
  createPaymentRequest,
  createPaymentResponse,
  getPaymentRequest,
  getPaymentResponse,
  setPaymentRequest,
  setPaymentResponse,
} from './schema';
import { faker } from '@faker-js/faker';

const ajv = new Ajv();

describe('createPaymentRequest', () => {
  const validate = ajv.compile<CreatePaymentRequest>(createPaymentRequest);

  it('is compatible with success value', () => {
    const value: CreatePaymentRequest = {
      accountId: faker.string.uuid(),
      amount: 2000,
      description: 'Annual service charge',
      returnUrl: 'https://track-waste-snd.azure.defra.cloud/',
    };

    expect(validate(value)).toBe(true);
  });
});

describe('createPaymentResponse', () => {
  const validate = ajv.compile<CreatePaymentResponse>(createPaymentResponse);

  it('is compatible with success value', () => {
    const id = faker.string.uuid();
    const value: CreatePaymentResponse = {
      success: true,
      value: {
        id,
        redirectUrl:
          'https://card.payments.service.gov.uk/secure/aa1afcd5-8f26-4e07-b4bd-b51076e61404',
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

describe('setPaymentRequest', () => {
  const validate = ajv.compile<SetPaymentRequest>(setPaymentRequest);

  it('is compatible with success value', () => {
    const value: SetPaymentRequest = {
      id: faker.string.uuid(),
      accountId: faker.string.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setPaymentResponse', () => {
  const validate = ajv.compile<SetPaymentResponse>(setPaymentResponse);

  it('is compatible with success value', () => {
    const id = faker.string.uuid();
    const value: SetPaymentResponse = {
      success: true,
      value: {
        id,
        amount: 2000,
        description: 'Annual service charge',
        reference: 'Demo reference',
        state: {
          status: 'Success',
          capturedDate: '2024-06-28',
        },
      },
    };

    expect(validate(value)).toBe(true);

    value.value.state = {
      status: 'InProgress',
    };

    expect(validate(value)).toBe(true);

    value.value.state = {
      status: 'Rejected',
      code: 'P0010',
    };

    expect(validate(value)).toBe(true);

    value.value.state = {
      status: 'SessionExpired',
      code: 'P0020',
    };

    expect(validate(value)).toBe(true);

    value.value.state = {
      status: 'CancelledByUser',
      code: 'P0030',
    };

    expect(validate(value)).toBe(true);

    value.value.state = {
      status: 'CancelledByService',
      code: 'P0040',
    };

    expect(validate(value)).toBe(true);

    value.value.state = {
      status: 'Error',
      code: 'P0050',
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

describe('getPaymentRequest', () => {
  const validate = ajv.compile<GetPaymentRequest>(getPaymentRequest);

  it('is compatible with success value', () => {
    const value: GetPaymentRequest = {
      accountId: faker.string.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getPaymentResponse', () => {
  const validate = ajv.compile<GetPaymentResponse>(getPaymentResponse);

  it('is compatible with success value', () => {
    const value: GetPaymentResponse = {
      success: true,
      value: {
        serviceChargePaid: true,
        expiryDate: '2024-06-28',
        renewalDate: '2025-06-27',
      },
    };

    expect(validate(value)).toBe(true);

    value.value.serviceChargePaid = false;

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

describe('cancelPaymentRequest', () => {
  const validate = ajv.compile<CancelPaymentRequest>(cancelPaymentRequest);

  it('is compatible with success value', () => {
    const value: CancelPaymentRequest = {
      id: faker.string.uuid(),
      accountId: faker.string.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('cancelPaymentResponse', () => {
  const validate = ajv.compile<CancelPaymentResponse>(cancelPaymentResponse);

  it('is compatible with success value', () => {
    const value: CancelPaymentResponse = {
      success: true,
      value: undefined,
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
