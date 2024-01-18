import { uncompress } from 'snappy';
import { Readable } from 'stream';
import { parse } from 'csv-parse';
import { BulkSubmissionCsvRow, headersFormatted } from '../lib/csv-content';
import { finished } from 'stream/promises';
import {
  ValidateCsvContentRequest,
  ValidateCsvContentResponse,
} from '../model';

export async function validateBatch(
  request: ValidateCsvContentRequest
): Promise<ValidateCsvContentResponse> {
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

  return Promise.resolve(response);
}
