import { faker } from '@faker-js/faker';
import Ajv from 'ajv/dist/jtd';
import {
  AddBatchContentRequest,
  GetBatchContentRequest,
  GetBatchContentResponse,
} from './dto';
import {
  addBatchContentRequest,
  getBatchContentRequest,
  getBatchContentResponse,
} from './schema';

const ajv = new Ajv();

describe('addBatchContentRequest', () => {
  const validate = ajv.compile<AddBatchContentRequest>(addBatchContentRequest);

  it('is compatible with dto values', () => {
    let value: AddBatchContentRequest = {
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

describe('getBatchContentRequest', () => {
  const validate = ajv.compile<GetBatchContentRequest>(getBatchContentRequest);

  it('is compatible with dto values', () => {
    const value: GetBatchContentRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getBatchContentResponse', () => {
  const validate = ajv.compile<GetBatchContentResponse>(
    getBatchContentResponse
  );

  it('is compatible with dto value', () => {
    const value: GetBatchContentResponse = {
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
  });
});
