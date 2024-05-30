import { faker } from '@faker-js/faker';
import Ajv from 'ajv/dist/jtd';
import {
  AddContentToBatchRequest,
  AddContentToBatchResponse,
  GetBatchRequest,
  GetBatchResponse,
  FinalizeBatchRequest,
  FinalizeBatchResponse,
  BulkSubmission,
  DownloadBatchRequest,
  DownloadBatchResponse,
} from './dto';
import {
  addContentToBatchRequest,
  addContentToBatchResponse,
  getBatchRequest,
  getBatchResponse,
  finalizeBatchRequest,
  finalizeBatchResponse,
  bulkSubmissionCode,
  downloadCsvRequest,
  downloadCsvResponse,
} from './schema';

const ajv = new Ajv();

describe('addContentToBatchRequest', () => {
  const validate = ajv.compile<AddContentToBatchRequest>(
    addContentToBatchRequest,
  );

  it('is compatible with dto values', () => {
    let value: AddContentToBatchRequest = {
      accountId: faker.datatype.uuid(),
      batchId: faker.datatype.uuid(),
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
    addContentToBatchResponse,
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
          rowErrors: [
            {
              errorAmount: 3,
              rowNumber: 1,
              errorDetails: ['error1', 'error2'],
            },
          ],
          columnErrors: [
            {
              columnName: 'column1',
              errorAmount: 3,
              errorDetails: [
                {
                  errorReason: 'error1',
                  rowNumber: 1,
                },
              ],
            },
          ],
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
          hasEstimates: true,
          submissions: [
            {
              wasteTransportation: {
                numberAndTypeOfContainers: 'test',
                specialHandlingRequirements: 'test',
              },
              receiver: {
                authorizationType: 'permit',
                environmentalPermitNumber: '1234',
                address: {
                  addressLine1: 'address1',
                  addressLine2: 'address2',
                  country: 'England',
                  townCity: 'London',
                  postcode: '1234',
                },
                contact: {
                  name: 'test',
                  organisationName: 'test',
                  phone: '1234',
                  email: 'test@organisation.com',
                },
              },
              producer: {
                reference: '1234',
                sicCode: '123456',
                address: {
                  addressLine1: 'address1',
                  addressLine2: 'address2',
                  country: 'England',
                  townCity: 'London',
                  postcode: 'SW1A 1AA',
                },
                contact: {
                  name: 'test',
                  organisationName: 'test',
                  phone: '1234',
                  email: 'test@organisation.com',
                },
              },
              wasteCollection: {
                wasteSource: 'Household',
                localAuthority: 'Local authority',
                expectedWasteCollectionDate: {
                  day: '01',
                  month: '01',
                  year: '2028',
                },
                address: {
                  addressLine1: 'address1',
                  addressLine2: 'address2',
                  country: 'England',
                  townCity: 'London',
                  postcode: 'SW1A 1AA',
                },
                brokerRegistrationNumber: '1234567',
                carrierRegistrationNumber: 'CBDL1234',
              },
              carrier: {
                contact: {
                  organisationName: 'org',
                  name: 'name',
                  email: 'example@email.co.uk',
                  phone: '02071234567',
                },
                address: {
                  addressLine1: '123 Oxford Street',
                  addressLine2: 'Westminster',
                  townCity: 'London',
                  postcode: 'W1A 1AA',
                  country: 'England',
                },
              },
              wasteTypes: [
                {
                  ewcCode: '1234',
                  wasteDescription: 'test',
                  physicalForm: 'Solid',
                  wasteQuantity: 1,
                  quantityUnit: 'Kilogram',
                  wasteQuantityType: 'EstimateData',
                  hasHazardousProperties: false,
                  containsPops: false,
                  chemicalAndBiologicalComponents: [
                    {
                      concentration: 1,
                      concentrationUnit: 'Kilogram',
                      name: 'test',
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      success: true,
      value: {
        id: faker.datatype.uuid(),
        state: {
          status: 'Submitting',
          timestamp: new Date(),
          transactionId: '2307_5678ABCD',
          hasEstimates: true,
          submissions: [
            {
              receiver: {
                authorizationType: 'permit',
                environmentalPermitNumber: '1234',
                address: {
                  addressLine1: 'address1',
                  addressLine2: 'address2',
                  country: 'England',
                  townCity: 'London',
                  postcode: '1234',
                },
                contact: {
                  name: 'test',
                  organisationName: 'test',
                  phone: '1234',
                  email: 'test@organisation.com',
                },
              },
              wasteTransportation: {
                numberAndTypeOfContainers: 'test',
                specialHandlingRequirements: 'test',
              },
              producer: {
                reference: '1234',
                sicCode: '123456',
                address: {
                  addressLine1: 'address1',
                  addressLine2: 'address2',
                  country: 'England',
                  townCity: 'London',
                  postcode: 'SW1A 1AA',
                },
                contact: {
                  name: 'test',
                  organisationName: 'test',
                  phone: '1234',
                  email: 'test@organisation.com',
                },
              },
              wasteCollection: {
                address: {
                  addressLine1: 'address1',
                  addressLine2: 'address2',
                  country: 'England',
                  townCity: 'London',
                  postcode: 'SW1A 1AA',
                },
                brokerRegistrationNumber: 'CBDU1234',
                carrierRegistrationNumber: 'CBDU1234',
                wasteSource: 'Household',
                localAuthority: 'Local authority',
                expectedWasteCollectionDate: {
                  day: '01',
                  month: '01',
                  year: '2028',
                },
              },
              carrier: {
                contact: {
                  organisationName: 'org',
                  name: 'name',
                  email: 'example@email.co.uk',
                  phone: '02071234567',
                },
                address: {
                  addressLine1: '123 Oxford Street',
                  addressLine2: 'Westminster',
                  townCity: 'London',
                  postcode: 'W1A 1AA',
                  country: 'England',
                },
              },
              wasteTypes: [
                {
                  ewcCode: '1234',
                  wasteDescription: 'test',
                  physicalForm: 'Solid',
                  wasteQuantity: 1,
                  quantityUnit: 'Kilogram',
                  wasteQuantityType: 'EstimateData',
                  chemicalAndBiologicalComponents: [
                    {
                      concentration: 1,
                      concentrationUnit: 'Kilogram',
                      name: 'test',
                    },
                  ],
                  hasHazardousProperties: false,
                  containsPops: false,
                  hazardousWasteCodes: [
                    {
                      code: 'HP1',
                      name: 'test',
                    },
                  ],
                  pops: [
                    {
                      concentration: 1,
                      name: 'test',
                      concentrationUnit: 'Kilogram',
                    },
                  ],
                },
              ],
            },
          ],
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
          hasEstimates: true,
          submissions: [
            {
              id: faker.datatype.uuid(),
              collectionDate: {
                day: '1',
                month: '3',
                year: '2024',
              },
              ewcCodes: ['010101'],
              producerName: 'Test Producer',
              wasteMovementId: 'WM2405_FDF4428',
            },
          ],
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

describe('downloadCsvRequest', () => {
  const validate = ajv.compile<DownloadBatchRequest>(downloadCsvRequest);

  it('is compatible with dto values', () => {
    const value: DownloadBatchRequest = {
      id: faker.datatype.uuid(),
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

describe('bulkSubmissionCode', () => {
  const validate = ajv.compile<BulkSubmission>(bulkSubmissionCode);

  it('is compatible with dto values', () => {
    const value: BulkSubmission = {
      id: faker.datatype.uuid(),
      state: {
        status: 'FailedValidation',
        timestamp: new Date(),
        rowErrors: [
          {
            errorAmount: 3,
            rowNumber: 1,
            errorCodes: [
              {
                code: 1234,
                args: ['test'],
              },
            ],
          },
        ],
      },
    };

    expect(validate(value)).toBe(true);
  });
});
