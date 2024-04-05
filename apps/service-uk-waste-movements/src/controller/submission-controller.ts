import Boom from '@hapi/boom';
import * as api from '@wts/api/uk-waste-movements';
import { fromBoom, success } from '@wts/util/invocation';
import { Logger } from 'winston';
import { Handler } from '@wts/api/common';
import {
  FieldFormatError,
  InvalidAttributeCombinationError,
  Value,
  Error,
  ValidationResult,
} from '../model';
import { validationRules } from '../lib';
import { DaprReferenceDataClient } from '@wts/client/reference-data';

export default class SubmissionController {
  constructor(
    private referenceDataClient: DaprReferenceDataClient,
    private logger: Logger
  ) {}

  validateSubmissions: Handler<
    api.ValidateSubmissionsRequest,
    api.ValidateSubmissionsResponse
  > = async ({ accountId, values }) => {
    try {
      // 2 handles the padding at the top of the CSV (header and instruction rows)
      let index = 2;
      const errors: Error[] = [];
      const submissions: Value[] = [];
      values.map((s) => {
        index += 1;
        const fieldFormatErrors: FieldFormatError[] = [];

        const producer = validationRules.validateProducerDetailsSection({
          producerAddressLine1: s.producerAddressLine1,
          producerAddressLine2: s.producerAddressLine2,
          producerCountry: s.producerCountry,
          producerEmail: s.producerEmail,
          producerContactName: s.producerContactName,
          producerOrganisationName: s.producerOrganisationName,
          producerPhone: s.producerPhone,
          producerPostcode: s.producerPostcode,
          producerSicCode: s.producerSicCode,
          producerTownCity: s.producerTownCity,
          reference: s.reference,
        });

        if (!producer.valid) {
          fieldFormatErrors.push(...producer.value);
        }

        const invalidStructureErrors: InvalidAttributeCombinationError[] = [];

        if (producer.valid) {
          submissions.push({
            producer: producer.value,
            wasteTypeDetails: [],
          });
        } else {
          errors.push({
            index: index,
            fieldFormatErrors: fieldFormatErrors,
            invalidStructureErrors: invalidStructureErrors,
          });
        }
      });

      const result: ValidationResult =
        errors.length > 0
          ? {
              valid: false,
              accountId: accountId,
              values: errors,
            }
          : {
              valid: true,
              accountId: accountId,
              values: submissions,
            };

      return success(result);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
