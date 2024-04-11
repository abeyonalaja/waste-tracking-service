import { faker } from '@faker-js/faker';
import Ajv from 'ajv/dist/jtd';
import {
  AddContentToBatchRequest,
  AddContentToBatchResponse,
  GetBatchRequest,
  GetBatchResponse,
  UpdateBatchRequest,
  UpdateBatchResponse,
} from './dto';
import {
  addContentToBatchRequest,
  addContentToBatchResponse,
  getBatchRequest,
  getBatchResponse,
  updateBatchRequest,
  updateBatchResponse,
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
          error: 'CSV_RECORD_INCONSISTENT_COLUMNS',
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
              rowNumber: 3,
              errorAmount: 9,
              errorDetails: [
                'Enter a uniqure reference',
                'Enter a second EWC code in correct format',
                'Waste description must be less than 100 characheters',
                'Enter a real phone number for the importer',
                'Enter a real collection date',
                'Enter the first carrier country',
                'Enter the first carrier email address',
                'Enter the first recovery facility or laboratory address',
                'Enter the first recovery code of the first laboratory facility',
              ],
            },
            {
              rowNumber: 12,
              errorAmount: 6,
              errorDetails: [
                'Enter a real phone number for the importer',
                'Enter a real collection date',
                'Enter the first carrier country',
                'Enter the first carrier email address',
                'Enter the first recovery facility or laboratory address',
                'Enter the first recovery code of the first laboratory facility',
              ],
            },
            {
              rowNumber: 24,
              errorAmount: 5,
              errorDetails: [
                'Enter a uniqure reference',
                'Enter a second EWC code in correct format',
                'Waste description must be less than 100 characheters',
                'Enter a real phone number for the importer',
                'Enter a real collection date',
              ],
            },
            {
              rowNumber: 34,
              errorAmount: 1,
              errorDetails: [
                'Waste description must be less than 100 characheters',
              ],
            },
          ],
          columnErrors: [
            {
              errorAmount: 9,
              columnName: 'Organisation contact person phone number',
              errorDetails: [
                {
                  rowNumber: 2,
                  errorReason: 'Enter contact phone number',
                },
                {
                  rowNumber: 3,
                  errorReason: 'Enter a valid contact phone number',
                },
                {
                  rowNumber: 12,
                  errorReason: 'Enter contact phone number',
                },
                {
                  rowNumber: 24,
                  errorReason: 'Enter contact phone number',
                },
                {
                  rowNumber: 27,
                  errorReason: 'Enter contact phone number',
                },
                {
                  rowNumber: 32,
                  errorReason: 'Enter a valid contact phone number',
                },
                {
                  rowNumber: 41,
                  errorReason: 'Enter a valid contact phone number',
                },
                {
                  rowNumber: 56,
                  errorReason: 'Enter contact phone number',
                },
                {
                  rowNumber: 63,
                  errorReason: 'Enter a valid contact phone number',
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
          hasEstimates: false,
          submissions: [
            {
              reference: 'testRef',
              wasteDescription: {
                wasteCode: {
                  type: 'AnnexIIIA',
                  code: 'B1010 and B1050',
                },
                ewcCodes: [
                  {
                    code: '010101',
                  },
                  {
                    code: '010102',
                  },
                ],
                nationalCode: {
                  provided: 'No',
                },
                description: 'test',
              },
              wasteQuantity: {
                type: 'ActualData',
                estimateData: {},
                actualData: {
                  quantityType: 'Weight',
                  unit: 'Tonne',
                  value: 2,
                },
              },
              exporterDetail: {
                exporterAddress: {
                  addressLine1: '1 Some Street',
                  townCity: 'London',
                  postcode: 'EC2N4AY',
                  country: 'England',
                },
                exporterContactDetails: {
                  organisationName: 'Test organisation 1',
                  fullName: 'John Smith',
                  emailAddress: 'test1@test.com',
                  phoneNumber: '07888888888',
                },
              },
              importerDetail: {
                importerAddressDetails: {
                  organisationName: 'Test organisation 2',
                  address: '2 Some Street, Kabul, 1001',
                  country: 'Afghanistan [AF]',
                },
                importerContactDetails: {
                  fullName: 'Jane Smith',
                  emailAddress: 'test2@test.com',
                  phoneNumber: '0033140000000',
                  faxNumber: '0033140000000',
                },
              },
              collectionDate: {
                type: 'ActualDate',
                actualDate: {
                  day: '01',
                  month: '01',
                  year: '2050',
                },
                estimateDate: {},
              },
              carriers: [
                {
                  addressDetails: {
                    organisationName: 'Test organisation 3',
                    address: 'Some address, London, EC2N4AY',
                    country: 'United Kingdom (England) [GB-ENG]',
                  },
                  contactDetails: {
                    fullName: 'John Doe',
                    emailAddress: 'test3@test.com',
                    phoneNumber: '07888888844',
                    faxNumber: '07888888844',
                  },
                  transportDetails: {
                    type: 'InlandWaterways',
                    description: 'details',
                  },
                },
                {
                  addressDetails: {
                    organisationName: 'Test organisation 4',
                    address: '3 Some Street, Paris, 75002',
                    country: 'France [FR]',
                  },
                  contactDetails: {
                    fullName: 'Jane Doe',
                    emailAddress: 'test4@test.com',
                    phoneNumber: '0033140000044',
                  },
                  transportDetails: {
                    type: 'Road',
                  },
                },
              ],
              collectionDetail: {
                address: {
                  addressLine1: '5 Some Street',
                  townCity: 'London',
                  postcode: 'EC2N4AY',
                  country: 'England',
                },
                contactDetails: {
                  organisationName: 'Test organisation 5',
                  fullName: 'John Johnson',
                  emailAddress: 'test5@test.com',
                  phoneNumber: '07888888855',
                  faxNumber: '07888888855',
                },
              },
              ukExitLocation: {
                provided: 'Yes',
                value: 'Dover',
              },
              transitCountries: ['France [FR]', 'Belgium [BE]'],
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
          hasEstimates: false,
          submissions: [
            {
              reference: 'testRef',
              wasteDescription: {
                wasteCode: {
                  type: 'AnnexIIIA',
                  code: 'B1010 and B1050',
                },
                ewcCodes: [
                  {
                    code: '010101',
                  },
                  {
                    code: '010102',
                  },
                ],
                nationalCode: {
                  provided: 'No',
                },
                description: 'test',
              },
              wasteQuantity: {
                type: 'ActualData',
                estimateData: {},
                actualData: {
                  quantityType: 'Weight',
                  unit: 'Tonne',
                  value: 2,
                },
              },
              exporterDetail: {
                exporterAddress: {
                  addressLine1: '1 Some Street',
                  townCity: 'London',
                  postcode: 'EC2N4AY',
                  country: 'England',
                },
                exporterContactDetails: {
                  organisationName: 'Test organisation 1',
                  fullName: 'John Smith',
                  emailAddress: 'test1@test.com',
                  phoneNumber: '07888888888',
                },
              },
              importerDetail: {
                importerAddressDetails: {
                  organisationName: 'Test organisation 2',
                  address: '2 Some Street, Kabul, 1001',
                  country: 'Afghanistan [AF]',
                },
                importerContactDetails: {
                  fullName: 'Jane Smith',
                  emailAddress: 'test2@test.com',
                  phoneNumber: '0033140000000',
                  faxNumber: '0033140000000',
                },
              },
              collectionDate: {
                type: 'ActualDate',
                actualDate: {
                  day: '01',
                  month: '01',
                  year: '2050',
                },
                estimateDate: {},
              },
              carriers: [
                {
                  addressDetails: {
                    organisationName: 'Test organisation 3',
                    address: 'Some address, London, EC2N4AY',
                    country: 'United Kingdom (England) [GB-ENG]',
                  },
                  contactDetails: {
                    fullName: 'John Doe',
                    emailAddress: 'test3@test.com',
                    phoneNumber: '07888888844',
                    faxNumber: '07888888844',
                  },
                  transportDetails: {
                    type: 'InlandWaterways',
                    description: 'details',
                  },
                },
                {
                  addressDetails: {
                    organisationName: 'Test organisation 4',
                    address: '3 Some Street, Paris, 75002',
                    country: 'France [FR]',
                  },
                  contactDetails: {
                    fullName: 'Jane Doe',
                    emailAddress: 'test4@test.com',
                    phoneNumber: '0033140000044',
                  },
                  transportDetails: {
                    type: 'Road',
                  },
                },
              ],
              collectionDetail: {
                address: {
                  addressLine1: '5 Some Street',
                  townCity: 'London',
                  postcode: 'EC2N4AY',
                  country: 'England',
                },
                contactDetails: {
                  organisationName: 'Test organisation 5',
                  fullName: 'John Johnson',
                  emailAddress: 'test5@test.com',
                  phoneNumber: '07888888855',
                  faxNumber: '07888888855',
                },
              },
              ukExitLocation: {
                provided: 'Yes',
                value: 'Dover',
              },
              transitCountries: ['France [FR]', 'Belgium [BE]'],
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
          transactionId: '3497_1224DCBA',
          timestamp: new Date(),
          hasEstimates: true,
          submissions: [
            {
              id: faker.datatype.uuid(),
              transactionId: '2307_5678ABCD',
              hasEstimates: true,
              collectionDate: new Date(),
              wasteCode: 'Not Applicable',
              reference: 'ref1',
            },
          ],
        },
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('updateBatchRequest', () => {
  const validate = ajv.compile<UpdateBatchRequest>(updateBatchRequest);

  it('is compatible with dto values', () => {
    const value: UpdateBatchRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('updateBatchResponse', () => {
  const validate = ajv.compile<UpdateBatchResponse>(updateBatchResponse);

  it('is compatible with dto values', () => {
    const value: UpdateBatchResponse = {
      success: true,
      value: undefined,
    };

    expect(validate(value)).toBe(true);
  });
});
