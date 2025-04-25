import { faker } from '@faker-js/faker';
import Ajv from 'ajv/dist/jtd';
import {
  AddContentToBatchRequest,
  AddContentToBatchResponse,
  GetBatchRequest,
  GetBatchResponse,
  FinalizeBatchRequest,
  FinalizeBatchResponse,
  DownloadBatchRequest,
  DownloadBatchResponse,
  GetRowRequest,
  GetRowResponse,
  GetColumnRequest,
  GetColumnResponse,
  GetBulkSubmissionsRequest,
  GetBulkSubmissionsResponse,
} from './dto';
import {
  addContentToBatchRequest,
  addContentToBatchResponse,
  getBatchRequest,
  getBatchResponse,
  finalizeBatchRequest,
  finalizeBatchResponse,
  downloadCsvRequest,
  downloadCsvResponse,
  getRowRequest,
  getRowResponse,
  getColumnRequest,
  getColumnResponse,
  getBulkSubmissionsRequest,
  getBulkSubmissionsResponse,
} from './schema';

const ajv = new Ajv();

describe('addContentToBatchRequest', () => {
  const validate = ajv.compile<AddContentToBatchRequest>(
    addContentToBatchRequest,
  );

  it('is compatible with dto values', () => {
    let value: AddContentToBatchRequest = {
      accountId: faker.string.uuid(),
      batchId: faker.string.uuid(),
      content: {
        type: 'text/csv',
        compression: 'Snappy',
        value: faker.string.sample(),
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      accountId: faker.string.uuid(),
      batchId: faker.string.uuid(),
      content: {
        type: 'text/csv',
        compression: 'Snappy',
        value: faker.string.sample(),
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('addContentToBatchResponse', () => {
  const validate = ajv.compile<AddContentToBatchResponse>(
    addContentToBatchResponse,
  );

  it('is compatible with dto values', () => {
    const value: AddContentToBatchResponse = {
      success: true,
      value: {
        batchId: faker.string.uuid(),
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
      id: faker.string.uuid(),
      accountId: faker.string.uuid(),
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
        id: faker.string.uuid(),
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
        id: faker.string.uuid(),
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
        id: faker.string.uuid(),
        state: {
          status: 'FailedValidation',
          timestamp: new Date(),
          errorSummary: {
            columnBased: [
              {
                columnRef: 'Carrier address line 1',
                count: 3,
              },
            ],
            rowBased: [
              {
                count: 3,
                rowId: faker.string.uuid(),
                rowNumber: 1,
              },
            ],
          },
        },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      success: true,
      value: {
        id: faker.string.uuid(),
        state: {
          status: 'PassedValidation',
          timestamp: new Date(),
          hasEstimates: true,
          rowsCount: 5,
        },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      success: true,
      value: {
        id: faker.string.uuid(),
        state: {
          status: 'Submitting',
          timestamp: new Date(),
          transactionId: '2307_5678ABCD',
          hasEstimates: true,
        },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      success: true,
      value: {
        id: faker.string.uuid(),
        state: {
          status: 'Submitted',
          timestamp: new Date(),
          transactionId: '2307_5678ABCD',
          hasEstimates: true,
          createdRowsCount: 5,
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
      id: faker.string.uuid(),
      accountId: faker.string.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('downloadCsvRequest', () => {
  const validate = ajv.compile<DownloadBatchRequest>(downloadCsvRequest);

  it('is compatible with dto values', () => {
    const value: DownloadBatchRequest = {
      id: faker.string.uuid(),
      accountId: faker.string.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('downloadCsvResponse', () => {
  const validate = ajv.compile<DownloadBatchResponse>(downloadCsvResponse);

  it('is compatible with dto values', () => {
    const value: DownloadBatchResponse = {
      success: true,
      value: {
        data: 'ExampleBase64Data',
      },
    };

    expect(validate(value)).toBe(true);
  });

  it('is compatible with error values', () => {
    const value: DownloadBatchResponse = {
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

describe('getRowRequest', () => {
  const validate = ajv.compile<GetRowRequest>(getRowRequest);

  it('is compatible with dto values', () => {
    const value: GetRowRequest = {
      rowId: faker.string.uuid(),
      batchId: faker.string.uuid(),
      accountId: faker.string.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getRowResponse', () => {
  const validate = ajv.compile<GetRowResponse>(getRowResponse);

  it('is compatible with dto values', () => {
    const value: GetRowResponse = {
      success: true,
      value: {
        id: faker.string.uuid(),
        batchId: faker.string.uuid(),
        accountId: faker.string.uuid(),
        messages: [
          faker.string.sample(),
          faker.string.sample(),
          faker.string.sample(),
        ],
      },
    };

    expect(validate(value)).toBe(true);
  });

  it('is compatible with error values', () => {
    const value: DownloadBatchResponse = {
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

describe('getColumnRequest', () => {
  const validate = ajv.compile<GetColumnRequest>(getColumnRequest);

  it('is compatible with dto values', () => {
    const value: GetColumnRequest = {
      columnRef: faker.string.sample(),
      batchId: faker.string.uuid(),
      accountId: faker.string.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getColumnReponse', () => {
  const validate = ajv.compile<GetColumnResponse>(getColumnResponse);

  it('is compatible with dto values', () => {
    const value: GetColumnResponse = {
      success: true,
      value: {
        columnRef: faker.string.sample(),
        batchId: faker.string.uuid(),
        accountId: faker.string.uuid(),
        errors: [
          {
            messages: ['Error 1', 'Error 2', 'Error 3'],
            rowNumber: 1,
          },
        ],
      },
    };

    expect(validate(value)).toBe(true);
  });

  it('is compatible with error values', () => {
    const value: DownloadBatchResponse = {
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

describe('getBulkSubmissionsRequest', () => {
  const validate = ajv.compile<GetBulkSubmissionsRequest>(
    getBulkSubmissionsRequest,
  );

  it('is compatible with dto values', () => {
    const value: GetBulkSubmissionsRequest = {
      batchId: faker.string.uuid(),
      accountId: faker.string.uuid(),
      page: 1,
      collectionDate: new Date(),
      ewcCode: faker.string.sample(),
      pageSize: 1,
      producerName: faker.string.sample(),
      wasteMovementId: faker.string.sample(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getBulkSubmissionsResponse', () => {
  const validate = ajv.compile<GetBulkSubmissionsResponse>(
    getBulkSubmissionsResponse,
  );

  it('is compatible with dto values', () => {
    const value: GetBulkSubmissionsResponse = {
      success: true,
      value: {
        page: 1,
        totalPages: 1,
        totalRecords: 1,
        values: [
          {
            id: faker.string.uuid(),
            wasteMovementId: 'WM2406_C7049A7F',
            ewcCode: faker.string.sample(),
            producerName: faker.company.name(),
            collectionDate: {
              day: faker.date.soon().getDay().toString(),
              month: faker.date.soon().getMonth().toString(),
              year: faker.date.soon().getFullYear().toString(),
            },
          },
        ],
      },
    };

    expect(validate(value)).toBe(true);
  });

  it('is compatible with error values', () => {
    const value: GetBulkSubmissionsResponse = {
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
