import Boom from '@hapi/boom';
import { DaprAnnexViiBulkClient } from '@wts/client/annex-vii-bulk';
import { compress } from 'snappy';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import { BulkSubmission } from '@wts/api/waste-tracking-gateway';
import { GetBatchContentResponse } from '@wts/api/annex-vii-bulk';
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

const batches = new Map<string, BulkSubmission>();

export interface BulkSubmissionBackend {
  createBatch(accountId: string, inputs: Input[]): Promise<{ id: string }>;
  getBatch(ref: BatchRef): Promise<BulkSubmission>;
}

export class BulkSubmissionStub implements BulkSubmissionBackend {
  async createBatch(
    accountId: string,
    inputs: Input[]
  ): Promise<{ id: string }> {
    const id = uuidv4();

    const records: TestCsvRow[] = [];
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

    let value: BulkSubmission = {
      id: id,
      state: {
        status: 'Processing',
        timestamp: new Date(),
      },
    };

    switch (records[0].state) {
      case 'Processing':
        value = {
          id: id,
          state: {
            status: 'Processing',
            timestamp: new Date(),
          },
        };
        break;
      case 'FailedValidation':
        value = {
          id: uuidv4(),
          state: {
            status: 'FailedValidation',
            timestamp: new Date(),
            errors: [
              {
                rowNumber: 3,
                errorAmount: 9,
                errorDescriptions: [
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
                errorDescriptions: [
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
                errorDescriptions: [
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
                errorDescriptions: [
                  'Waste description must be less than 100 characheters',
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
            timestamp: new Date(),
            drafts: [
              {
                id: uuidv4(),
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
            timestamp: new Date(),
            submissions: [
              {
                id: uuidv4(),
                transactionNumber: 'transaction_number',
              },
            ],
          },
        };
        break;
    }

    batches.set(JSON.stringify({ id, accountId }), value);
    return Promise.resolve({ id: id });
  }

  getBatch({ id, accountId }: BatchRef): Promise<BulkSubmission> {
    const value = batches.get(JSON.stringify({ id, accountId }));
    if (value === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(value);
  }
}

export class AnnexViiBulkServiceBackend implements BulkSubmissionBackend {
  constructor(private client: DaprAnnexViiBulkClient, private logger: Logger) {}

  async createBatch(
    accountId: string,
    inputs: Input[]
  ): Promise<{ id: string }> {
    try {
      let batchId: string | undefined;

      for (const input of inputs) {
        const content = (await compress(input.data)).toString('base64');
        const response = await this.client.addBatchContent({
          accountId,
          batchId,
          content: {
            type: input.type as 'text/csv',
            compression: 'Snappy',
            value: (await compress(input.data)).toString('base64'),
          },
        });

        if (!response.success) {
          this.logger.error('Error response from backend', {
            message: response.error.message,
          });

          throw Boom.internal();
        }

        this.logger.info('Added content to batch', {
          batchId: response.value.batchId,
          length: content.length,
        });

        batchId = response.value.batchId;
      }

      return { id: batchId as string };
    } catch (err) {
      this.logger.error('Error handling request', err);
      throw Boom.internal();
    }
  }

  async getBatch({ id, accountId }: BatchRef): Promise<BulkSubmission> {
    let response: GetBatchContentResponse;
    try {
      response = await this.client.getBatchContent({ id, accountId });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value as BulkSubmission;
  }
}
