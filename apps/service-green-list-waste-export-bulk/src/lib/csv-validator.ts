import { Logger } from 'winston';
import { uncompress } from 'snappy';
import { Readable } from 'stream';
import { parse } from 'csv-parse';
import { BulkSubmissionCsvRow, headersFormatted } from './csv-content';
import { finished } from 'stream/promises';
import {
  ValidateCsvContentRequest,
  ValidateCsvContentResponse,
} from '../model';
import Boom from '@hapi/boom';
import { fromBoom, success } from '@wts/util/invocation';

export class CsvValidator {
  constructor(private logger: Logger) {}

  async validateBatch(
    request: ValidateCsvContentRequest
  ): Promise<ValidateCsvContentResponse> {
    try {
      const content = request.content;
      const batchData =
        content.compression !== 'Snappy'
          ? Buffer.from(content.value, 'base64')
          : await uncompress(Buffer.from(content.value, 'base64'));

      const records: BulkSubmissionCsvRow[] = [];

      const stream = Readable.from(batchData);
      const parser = stream.pipe(
        parse({
          columns: headersFormatted,
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

      const response = {
        batchId: request.batchId,
        accountId: request.accountId,
        rows: records,
      };

      return success(response);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      if (
        err instanceof Error &&
        'code' in err &&
        typeof err.code === 'string'
      ) {
        return fromBoom(Boom.badRequest(err.code));
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  }
}
