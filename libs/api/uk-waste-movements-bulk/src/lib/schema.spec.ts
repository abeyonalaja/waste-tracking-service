import { faker } from '@faker-js/faker';
import Ajv from 'ajv/dist/jtd';
import {
  AddContentToBatchRequest,
  AddContentToBatchResponse,
  GetBatchRequest,
  GetBatchResponse,
  FinalizeBatchRequest,
  FinalizeBatchResponse,
} from './dto';
import {
  addContentToBatchRequest,
  addContentToBatchResponse,
  getBatchRequest,
  getBatchResponse,
  finalizeBatchRequest,
  finalizeBatchResponse,
} from './schema';

const ajv = new Ajv();

describe('addContentToBatchRequest', () => {
  const validate = ajv.compile<AddContentToBatchRequest>(
    addContentToBatchRequest
  );

  it('is compatible with dto values', () => {
    let value: AddContentToBatchRequest = {
      accountId: faker.datatype.uuid(),
      content: {
        type: 'text/csv',
        compression: 'Snappy',
        value: faker.datatype.string(),
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      accountId: faker.datatype.uuid(),
      batchId: faker.datatype.uuid(),
      content: {
        type: 'text/csv',
        compression: 'Snappy',
        value: faker.datatype.string(),
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('addContentToBatchResponse', () => {
  const validate = ajv.compile<AddContentToBatchResponse>(
    addContentToBatchResponse
  );

  it('is compatible with dto values', () => {
    const value: AddContentToBatchResponse = {
      success: true,
      value: {
        batchId: faker.datatype.uuid(),
      },
    };

    expect(validate(value)).toBe(true);
  });

  it('is compatible with error values', () => {
    const value: AddContentToBatchResponse = {
      success: false,
      error: {
        message: '',
        name: '',
        statusCode: 0,
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getBatchRequest', () => {
  const validate = ajv.compile<GetBatchRequest>(getBatchRequest);

  it('is compatible with dto values', () => {
    const value: GetBatchRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getBatchResponse', () => {
  const validate = ajv.compile<GetBatchResponse>(getBatchResponse);

  it('is compatible with dto value', () => {
    let value: GetBatchResponse = {
      success: true,
      value: {
        id: faker.datatype.uuid(),
        state: {
          status: 'Processing',
          timestamp: new Date(),
        },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      success: true,
      value: {
        id: faker.datatype.uuid(),
        state: {
          status: 'FailedCsvValidation',
          timestamp: new Date(),
          error: '',
        },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      success: true,
      value: {
        id: faker.datatype.uuid(),
        state: {
          status: 'FailedValidation',
          timestamp: new Date(),
        },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      success: true,
      value: {
        id: faker.datatype.uuid(),
        state: {
          status: 'PassedValidation',
          timestamp: new Date(),
          hasEstimates: false,
        },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      success: true,
      value: {
        id: faker.datatype.uuid(),
        state: {
          status: 'Submitted',
          timestamp: new Date(),
          transactionId: '2307_5678ABCD',
        },
      },
    };

    expect(validate(value)).toBe(true);
  });

  it('is compatible with error values', () => {
    const value: GetBatchResponse = {
      success: false,
      error: {
        message: '',
        name: '',
        statusCode: 0,
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('finalizeBatchRequest', () => {
  const validate = ajv.compile<FinalizeBatchRequest>(finalizeBatchRequest);

  it('is compatible with dto values', () => {
    const value: FinalizeBatchRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('finalizeBatchResponse', () => {
  const validate = ajv.compile<FinalizeBatchResponse>(finalizeBatchResponse);

  it('is compatible with dto values', () => {
    const value: FinalizeBatchResponse = {
      success: true,
      value: undefined,
    };

    expect(validate(value)).toBe(true);
  });

  it('is compatible with error values', () => {
    const value: FinalizeBatchResponse = {
      success: false,
      error: {
        message: '',
        name: '',
        statusCode: 0,
      },
    };

    expect(validate(value)).toBe(true);
  });
});
