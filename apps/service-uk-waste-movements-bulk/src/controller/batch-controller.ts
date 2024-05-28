import { Logger } from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { fromBoom, success } from '@wts/util/invocation';
import Boom from '@hapi/boom';
import { BatchRepository } from '../data';
import { Handler } from '@wts/api/common';
import * as api from '@wts/api/uk-waste-movements-bulk';
import { BulkSubmission } from '../model';
import { Field, ErrorCodeData, validation } from '@wts/api/uk-waste-movements';
import { compress } from 'snappy';
import { downloadHeaders, downloadSections } from '../lib/csv-content';

export class BatchController {
  constructor(private repository: BatchRepository, private logger: Logger) {}

  addContentToBatch: Handler<
    api.AddContentToBatchRequest,
    api.AddContentToBatchResponse
  > = async ({ accountId }) => {
    try {
      const bulkSubmission: BulkSubmission = {
        id: uuidv4(),
        state: {
          status: 'Processing',
          timestamp: new Date(),
        },
      };

      await this.repository.saveBatch(bulkSubmission, accountId);
      return success({ batchId: bulkSubmission.id });
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getBatch: Handler<api.GetBatchRequest, api.GetBatchResponse> = async ({
    id,
    accountId,
  }) => {
    try {
      const data: BulkSubmission = await this.repository.getBatch(
        id,
        accountId
      );
      const response: api.GetBatchResponse = success(
        data as unknown as api.BulkSubmissionDetail
      );

      if (data.state.status === 'FailedValidation') {
        const columnErrors: api.BulkSubmissionValidationColumnError[] = [];
        const columnErrorsObj: {
          [key in Field]: api.BulkSubmissionValidationColumnErrorDetail[];
        } = {
          'Producer address line 1': [],
          'Producer address line 2': [],
          'Producer contact name': [],
          'Producer contact email address': [],
          'Producer contact phone number': [],
          'Producer country': [],
          'Producer organisation name': [],
          'Producer postcode': [],
          'Producer Standard Industrial Classification (SIC) code': [],
          'Producer town or city': [],
          'Receiver address line 1': [],
          'Receiver address line 2': [],
          'Receiver postcode': [],
          'Receiver contact name': [],
          'Receiver contact email address': [],
          'Receiver contact phone number': [],
          'Receiver country': [],
          'Receiver environmental permit number': [],
          'Receiver organisation name': [],
          'Receiver town or city': [],
          'Receiver authorization type': [],
          'Waste Collection Details Address Line 1': [],
          'Waste Collection Details Address Line 2': [],
          'Waste Collection Details Town or City': [],
          'Waste Collection Details Country': [],
          'Waste Collection Details Postcode': [],
          'Waste Collection Details Waste Source': [],
          'Waste Collection Details Broker Registration Number': [],
          'Waste Collection Details Carrier Registration Number': [],
          'Waste Collection Details Expected Waste Collection Date': [],
          'Number and type of transportation containers': [],
          'Special handling requirements details': [],
          'EWC Code': [],
          'Waste Description': [],
          'Physical Form': [],
          'Waste Quantity': [],
          'Waste Quantity Units': [],
          'Quantity of waste (actual or estimate)': [],
          'Waste Has Hazardous Properties': [],
          'Hazardous Waste Codes': [],
          'Waste Contains POPs': [],
          'Persistant organic pollutants (POPs)': [],
          'Persistant organic pollutants (POPs) Concentration Values': [],
          'Persistant organic pollutants (POPs) Concentration Units': [],
          'Chemical and biological components of the waste': [],
          'Chemical and biological concentration units of measure': [],
          'Chemical and biological concentration values': [],
          'Local authority': [],
          'Carrier organisation name': [],
          'Carrier address line 1': [],
          'Carrier address line 2': [],
          'Carrier town or city': [],
          'Carrier country': [],
          'Carrier postcode': [],
          'Carrier contact name': [],
          'Carrier contact email address': [],
          'Carrier contact phone number': [],
          Reference: [],
        };

        const rowErrors: api.BulkSubmissionValidationRowError[] = [];

        for (const rowCodeError of data.state.rowErrors) {
          rowErrors.push({
            errorAmount: rowCodeError.errorAmount,
            rowNumber: rowCodeError.rowNumber,
            errorDetails: rowCodeError.errorCodes.map((ec) => {
              let errorData: ErrorCodeData;
              let args: string[] = [];

              if (typeof ec === 'number') {
                errorData = validation.UkwmErrorData[ec];
              } else {
                args = ec.args;
                errorData = validation.UkwmErrorData[ec.code];
              }

              if (errorData.type === 'message') {
                return errorData.message;
              } else {
                return errorData.builder(args);
              }
            }),
          });
        }

        for (const rowError of data.state.rowErrors) {
          for (const errorCode of rowError.errorCodes) {
            let errorData: ErrorCodeData;
            let args: string[] = [];

            if (typeof errorCode === 'number') {
              errorData = validation.UkwmErrorData[errorCode];
            } else {
              args = errorCode.args;
              errorData = validation.UkwmErrorData[errorCode.code];
            }

            if (!columnErrorsObj[errorData.field]) {
              continue;
            }

            columnErrorsObj[errorData.field].push({
              rowNumber: rowError.rowNumber,
              errorReason:
                errorData.type === 'message'
                  ? errorData.message
                  : errorData.builder(args),
            });
          }
        }

        for (const key in columnErrorsObj) {
          const keyAsField = key as Field;
          const errorDetails = columnErrorsObj[keyAsField];
          columnErrors.push({
            columnName: keyAsField,
            errorAmount: errorDetails.length,
            errorDetails: errorDetails,
          });
        }

        if (
          response.success &&
          response.value.state.status === 'FailedValidation'
        ) {
          response.value.state.columnErrors = columnErrors.filter(
            (ce) => ce.errorAmount > 0
          );
          response.value.state.rowErrors = rowErrors;
        }
      } else if (data.state.status === 'Submitted') {
        const bulkSubmission = {
          id: data.id,
          state: {
            status: data.state.status,
            timestamp: data.state.timestamp,
            transactionId: data.state.transactionId,
            submissions: data.state.submissions.map((v) => ({
              id: v.id,
              wasteMovementId:
                v.submissionDeclaration.status === 'Complete' &&
                v.submissionDeclaration.values.transactionId,
              producerName:
                v.producerAndCollection.status === 'Complete' &&
                v.producerAndCollection.producer.contact?.organisationName,
              ewcCodes:
                v.wasteInformation.status === 'Complete' &&
                v.wasteInformation.wasteTypes.map((wt) => wt?.ewcCode),
              collectionDate: v.producerAndCollection.status === 'Complete' && {
                day: v.producerAndCollection.wasteCollection
                  .expectedWasteCollectionDate?.day,
                month:
                  v.producerAndCollection.wasteCollection
                    .expectedWasteCollectionDate?.month,
                year: v.producerAndCollection.wasteCollection
                  .expectedWasteCollectionDate?.year,
              },
            })),
          },
        } as api.BulkSubmissionDetail;
        return success(bulkSubmission);
      }
      return response;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  finalizeBatch: Handler<api.FinalizeBatchRequest, api.FinalizeBatchResponse> =
    async ({ id, accountId }) => {
      try {
        const submissions = await this.repository.getBatch(id, accountId);

        if (submissions.state.status !== 'PassedValidation') {
          throw Boom.badRequest('Batch has not passed validation');
        }

        const timestamp = new Date();
        const transactionId =
          timestamp.getFullYear().toString().substring(2) +
          (timestamp.getMonth() + 1).toString().padStart(2, '0') +
          '_' +
          id.substring(0, 8).toUpperCase();

        const bulkSubmission: BulkSubmission = {
          id: id,
          state: {
            status: 'Submitting',
            transactionId,
            timestamp,
            hasEstimates: submissions.state.hasEstimates,
            submissions: submissions.state.submissions,
          },
        };
        return success(
          await this.repository.saveBatch(bulkSubmission, accountId)
        );
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };

  downloadProducerCsv: Handler<
    api.DownloadBatchRequest,
    api.DownloadBatchResponse
  > = async ({ id }) => {
    try {
      const result = (await this.repository.downloadProducerCsv(
        id
      )) as api.SubmissionFlattenedDownload[];

      let csvText = downloadSections + '\n' + downloadHeaders + '\n';
      console.log(downloadHeaders);
      for (const submission of result) {
        const keys = Object.keys(submission);
        const values = keys.map((key) => {
          if (submission[key].includes(',')) {
            return `"${submission[key]}"`;
          }
          return submission[key];
        });
        csvText += values.join(',') + '\n';
      }

      const buffer = Buffer.from(csvText, 'utf-8');

      const compressedBuffer = await compress(buffer);

      const base64Data = compressedBuffer.toString('base64');

      return success({ data: base64Data });
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
