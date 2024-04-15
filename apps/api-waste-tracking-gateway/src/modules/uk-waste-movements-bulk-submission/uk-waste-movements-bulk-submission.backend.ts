import Boom from '@hapi/boom';
import { DaprUkWasteMovementsBulkClient } from '@wts/client/uk-waste-movements-bulk';
import { compress } from 'snappy';
import { Logger } from 'winston';
import { UkwmBulkSubmission } from '@wts/api/waste-tracking-gateway';
import * as api from '@wts/api/uk-waste-movements-bulk';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import { parse } from 'csv-parse';
import { finished } from 'stream/promises';

export type BatchRef = {
  id: string;
  accountId: string;
};

export type Input = {
  type: string;
  data: Buffer;
};

type TestCsvRow = {
  state: string;
};

const batches = new Map<string, UkwmBulkSubmission>();

export interface UkWasteMovementsBulkSubmissionBackend {
  createBatch(accountId: string, inputs: Input[]): Promise<{ id: string }>;
  getBatch(ref: BatchRef): Promise<UkwmBulkSubmission>;
  finalizeBatch(ref: BatchRef): Promise<void>;
}

export class InMemoryUkWasteMovementsBulkSubmissionBackend
  implements UkWasteMovementsBulkSubmissionBackend
{
  async createBatch(
    accountId: string,
    inputs: Input[]
  ): Promise<{ id: string }> {
    const id = uuidv4();

    const records: TestCsvRow[] = [];

    try {
      for (const input of inputs) {
        const stream = Readable.from(input.data);

        const parser = stream.pipe(
          parse({
            columns: ['state'],
            fromLine: 3,
            relax_quotes: true,
            escape: '\\',
            ltrim: true,
            rtrim: true,
          })
        );

        parser.on('readable', function () {
          let record;
          while ((record = parser.read()) !== null) {
            records.push(record);
          }
        });

        await finished(parser);
      }
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return Promise.reject(err);
      }

      if (
        err instanceof Error &&
        'code' in err &&
        typeof err.code === 'string'
      ) {
        const value: UkwmBulkSubmission = {
          id: id,
          state: {
            status: 'FailedCsvValidation',
            timestamp: new Date(),
            error: err.code,
          },
        };
        batches.set(JSON.stringify({ id, accountId }), value);
        return Promise.resolve({ id: id });
      }

      return Promise.reject(Boom.internal());
    }

    const timestamp = new Date();
    const transactionId =
      timestamp.getFullYear().toString().substring(2) +
      (timestamp.getMonth() + 1).toString().padStart(2, '0') +
      '_' +
      id.substring(0, 8).toUpperCase();

    let value: UkwmBulkSubmission = {
      id: id,
      state: {
        status: 'Processing',
        timestamp: timestamp,
      },
    };

    switch (records[0].state) {
      case 'Processing':
        value = {
          id: id,
          state: {
            status: 'Processing',
            timestamp: timestamp,
          },
        };
        break;
      case 'FailedValidation':
        value = {
          id: uuidv4(),
          state: {
            status: 'FailedValidation',
            timestamp: new Date(),
            rowErrors: [
              {
                rowNumber: 3,
                errorAmount: 6,
                errorDetails: [
                  'The unique reference must be 20 characters or less',
                  'Enter the producer organisation name',
                  'Enter the producer address',
                  'Enter the producer town or city',
                  'Enter full name of producer contact',
                  'Enter producer contact email address in correct format',
                  'Enter the receiver organisation name',
                  'Enter the receiver address',
                  'Enter the receiver town or city',
                  'Enter full name of receiver contact',
                  'Enter receiver contact email address in correct format',
                ],
              },
              {
                rowNumber: 4,
                errorAmount: 7,
                errorDetails: [
                  'The unique reference must be 20 characters or less',
                  'Enter the producer organisation name',
                  'Enter the producer address',
                  'Enter the producer town or city',
                  'The producer country must only be England, Wales, Scotland, or Northern Ireland',
                  'Enter full name of producer contact',
                  'Enter producer contact email address',
                  'Enter the receiver organisation name',
                  'Enter the receiver address',
                  'Enter the receiver town or city',
                  'The receiver country must only be England, Wales, Scotland, or Northern Ireland',
                  'Enter full name of receiver contact',
                  'Enter receiver contact email address',
                ],
              },
            ],
            columnErrors: [
              {
                columnName: 'Producer address line 1',
                errorAmount: 2,
                errorDetails: [
                  {
                    rowNumber: 3,
                    errorReason: 'Enter the producer address',
                  },
                  {
                    rowNumber: 4,
                    errorReason: 'Enter the producer address',
                  },
                ],
              },
              {
                columnName: 'Producer contact name',
                errorAmount: 2,
                errorDetails: [
                  {
                    rowNumber: 3,
                    errorReason: 'Enter full name of producer contact',
                  },
                  {
                    rowNumber: 4,
                    errorReason: 'Enter full name of producer contact',
                  },
                ],
              },
              {
                columnName: 'Producer contact email address',
                errorAmount: 2,
                errorDetails: [
                  {
                    rowNumber: 3,
                    errorReason:
                      'Enter producer contact email address in correct format',
                  },
                  {
                    rowNumber: 4,
                    errorReason: 'Enter producer contact email address',
                  },
                ],
              },
              {
                columnName: 'Producer country',
                errorAmount: 1,
                errorDetails: [
                  {
                    rowNumber: 4,
                    errorReason:
                      'The producer country must only be England, Wales, Scotland, or Northern Ireland',
                  },
                ],
              },
              {
                columnName: 'Producer organisation name',
                errorAmount: 2,
                errorDetails: [
                  {
                    rowNumber: 3,
                    errorReason: 'Enter the producer organisation name',
                  },
                  {
                    rowNumber: 4,
                    errorReason: 'Enter the producer organisation name',
                  },
                ],
              },
              {
                columnName: 'Producer town or city',
                errorAmount: 2,
                errorDetails: [
                  {
                    rowNumber: 3,
                    errorReason: 'Enter the producer town or city',
                  },
                  {
                    rowNumber: 4,
                    errorReason: 'Enter the producer town or city',
                  },
                ],
              },
              {
                columnName: 'Receiver address line 1',
                errorAmount: 2,
                errorDetails: [
                  {
                    rowNumber: 3,
                    errorReason: 'Enter the receiver address',
                  },
                  {
                    rowNumber: 4,
                    errorReason: 'Enter the receiver address',
                  },
                ],
              },
              {
                columnName: 'Receiver contact name',
                errorAmount: 2,
                errorDetails: [
                  {
                    rowNumber: 3,
                    errorReason: 'Enter full name of receiver contact',
                  },
                  {
                    rowNumber: 4,
                    errorReason: 'Enter full name of receiver contact',
                  },
                ],
              },
              {
                columnName: 'Receiver contact email address',
                errorAmount: 2,
                errorDetails: [
                  {
                    rowNumber: 3,
                    errorReason:
                      'Enter receiver contact email address in correct format',
                  },
                  {
                    rowNumber: 4,
                    errorReason: 'Enter receiver contact email address',
                  },
                ],
              },
              {
                columnName: 'Receiver country',
                errorAmount: 1,
                errorDetails: [
                  {
                    rowNumber: 4,
                    errorReason:
                      'The receiver country must only be England, Wales, Scotland, or Northern Ireland',
                  },
                ],
              },
              {
                columnName: 'Receiver organisation name',
                errorAmount: 2,
                errorDetails: [
                  {
                    rowNumber: 3,
                    errorReason: 'Enter the receiver organisation name',
                  },
                  {
                    rowNumber: 4,
                    errorReason: 'Enter the receiver organisation name',
                  },
                ],
              },
              {
                columnName: 'Receiver town or city',
                errorAmount: 2,
                errorDetails: [
                  {
                    rowNumber: 3,
                    errorReason: 'Enter the receiver town or city',
                  },
                  {
                    rowNumber: 4,
                    errorReason: 'Enter the receiver town or city',
                  },
                ],
              },
              {
                columnName: 'Reference',
                errorAmount: 2,
                errorDetails: [
                  {
                    rowNumber: 3,
                    errorReason:
                      'The unique reference must be 20 characters or less',
                  },
                  {
                    rowNumber: 4,
                    errorReason:
                      'The unique reference must be 20 characters or less',
                  },
                ],
              },
            ],
          },
        };
        break;
      case 'PassedValidation':
        value = {
          id: uuidv4(),
          state: {
            status: 'PassedValidation',
            timestamp: timestamp,
            hasEstimates: true,
            submissions: [
              {
                producer: {
                  reference: 'ref1',
                  sicCode: '1010101',
                  contact: {
                    email: 'example@email.com',
                    name: 'John Doe',
                    organisationName: 'Example Ltd',
                    phone: '0044140000000',
                  },
                  address: {
                    addressLine1: '123 Fake Street',
                    addressLine2: 'Apt 10',
                    country: 'England',
                    townCity: 'London',
                    postcode: 'FA1 2KE',
                  },
                },
                receiver: {
                  authorizationType: 'permit',
                  environmentalPermitNumber: '1010101',
                  contact: {
                    email: 'example@email.com',
                    name: 'John Doe',
                    organisationName: 'Example Ltd',
                    phone: '0044140000000',
                  },
                  address: {
                    addressLine1: '123 Fake Street',
                    addressLine2: 'Apt 10',
                    country: 'England',
                    townCity: 'London',
                    postcode: 'FA1 2KE',
                  },
                },
                wasteTypeDetails: {
                  containsPop: false,
                  ewcCode: '01 03 04',
                  haveHazardousProperties: false,
                  physicalForm: 'Solid',
                  quantityUnits: 'Tonne',
                  wasteDescription: 'Waste description',
                  wasteQuantity: 100,
                  wasteQuantityType: 'ActualData',
                },
              },
              {
                producer: {
                  reference: 'ref2',
                  sicCode: '20202',
                  contact: {
                    email: 'janedoe@email.com',
                    name: 'Jane Doe',
                    organisationName: 'Company Ltd',
                    phone: '0044140000000',
                  },
                  address: {
                    addressLine1: '123 Real Street',
                    addressLine2: 'Apt 20',
                    country: 'England',
                    townCity: 'Manchester',
                    postcode: 'FA1 2KE',
                  },
                },
                receiver: {
                  authorizationType: 'permit',
                  environmentalPermitNumber: '2020202',
                  contact: {
                    email: 'example@email.com',
                    name: 'John Doe',
                    organisationName: 'Example Ltd',
                    phone: '0044140000000',
                  },
                  address: {
                    addressLine1: '123 Fake Street',
                    addressLine2: 'Apt 10',
                    country: 'England',
                    townCity: 'London',
                    postcode: 'FA1 2KE',
                  },
                },
                wasteTypeDetails: {
                  containsPop: true,
                  ewcCode: '02 03 02',
                  haveHazardousProperties: true,
                  physicalForm: 'Liquid',
                  quantityUnits: 'Cubic Metre',
                  wasteDescription: 'Waste description',
                  wasteQuantity: 200,
                  wasteQuantityType: 'EstimateData',
                },
              },
            ],
          },
        };
        break;
      case 'Submitted':
        value = {
          id: uuidv4(),
          state: {
            status: 'Submitted',
            transactionId: transactionId,
            timestamp: timestamp,
            submissions: [
              {
                id: uuidv4(),
                transactionId: transactionId,
                reference: 'ref1',
              },
            ],
          },
        };
        break;
    }

    batches.set(JSON.stringify({ id, accountId }), value);
    return { id: id };
  }

  getBatch({ id, accountId }: BatchRef): Promise<UkwmBulkSubmission> {
    const value = batches.get(JSON.stringify({ id, accountId }));
    if (value === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(value);
  }

  finalizeBatch({ id, accountId }: BatchRef): Promise<void> {
    const value = batches.get(JSON.stringify({ id, accountId }));
    if (value === undefined) {
      return Promise.reject(Boom.notFound());
    }

    const timestamp = new Date();
    const transactionId =
      timestamp.getFullYear().toString().substring(2) +
      (timestamp.getMonth() + 1).toString().padStart(2, '0') +
      '_' +
      id.substring(0, 8).toUpperCase();

    value.state = {
      status: 'Submitted',
      timestamp: timestamp,
      transactionId: transactionId,
      submissions: [
        {
          id: id,
          transactionId: transactionId,
          reference: '12345',
        },
      ],
    };

    batches.set(JSON.stringify({ id, accountId }), value);
    return Promise.resolve();
  }
}

export class ServiceUkWasteMovementsBulkSubmissionBackend
  implements UkWasteMovementsBulkSubmissionBackend
{
  constructor(
    private client: DaprUkWasteMovementsBulkClient,
    private logger: Logger
  ) {}

  async createBatch(
    accountId: string,
    inputs: Input[]
  ): Promise<{ id: string }> {
    try {
      if (inputs.length === 0) {
        throw Boom.badRequest();
      }

      let batchId: string | undefined;
      for (const input of inputs) {
        if (input.type !== 'text/csv') {
          throw Boom.badRequest("Input type must be 'text/csv'");
        }

        const content = (await compress(input.data)).toString('base64');
        const response = await this.client.addContentToBatch({
          accountId,
          batchId,
          content: {
            type: input.type as 'text/csv',
            compression: 'Snappy',
            value: content,
          },
        });

        if (!response.success) {
          this.logger.error('Error response from backend', {
            message: response.error.message,
          });

          throw new Boom.Boom(response.error.message, {
            statusCode: response.error.statusCode,
          });
        }

        this.logger.info('Added content to batch', {
          batchId: response.value.batchId,
          length: content.length,
        });

        batchId = response.value.batchId;
      }

      return { id: batchId as string };
    } catch (err) {
      if (err instanceof Boom.Boom) {
        throw new Boom.Boom(err.message, {
          statusCode: err.output.statusCode,
        });
      }

      this.logger.error('Error handling request', err);
      throw Boom.internal();
    }
  }

  async getBatch({ id, accountId }: BatchRef): Promise<UkwmBulkSubmission> {
    let response: api.GetBatchResponse;
    try {
      response = await this.client.getBatch({ id, accountId });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value as UkwmBulkSubmission;
  }

  async finalizeBatch({ id, accountId }: BatchRef): Promise<void> {
    let response: api.FinalizeBatchResponse;
    try {
      response = await this.client.finalizeBatch({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }
}
