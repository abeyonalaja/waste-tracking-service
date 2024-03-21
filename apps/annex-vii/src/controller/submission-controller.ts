import Boom from '@hapi/boom';
import * as api from '@wts/api/annex-vii';
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
import {
  GetCountriesResponse,
  GetDisposalCodesResponse,
  GetEWCCodesResponse,
  GetRecoveryCodesResponse,
  GetWasteCodesResponse,
} from '@wts/api/reference-data';

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
      let wasteCodesResponse: GetWasteCodesResponse;
      let ewcCodesResponse: GetEWCCodesResponse;
      let countriesResponse: GetCountriesResponse;
      let recoveryCodesResponse: GetRecoveryCodesResponse;
      let disposalCodesResponse: GetDisposalCodesResponse;
      try {
        wasteCodesResponse = await this.referenceDataClient.getWasteCodes();
        ewcCodesResponse = await this.referenceDataClient.getEWCCodes();
        countriesResponse = await this.referenceDataClient.getCountries({});
        recoveryCodesResponse =
          await this.referenceDataClient.getRecoveryCodes();
        disposalCodesResponse =
          await this.referenceDataClient.getDisposalCodes();
      } catch (error) {
        this.logger.error(error);
        throw Boom.internal();
      }

      if (
        !wasteCodesResponse.success ||
        !ewcCodesResponse.success ||
        !countriesResponse.success ||
        !recoveryCodesResponse.success ||
        !disposalCodesResponse.success
      ) {
        this.logger.error('Failed to get reference datasets');
        throw Boom.internal();
      }
      const wasteCodeList = wasteCodesResponse.value;
      const ewcCodeList = ewcCodesResponse.value;

      let index = 0;
      const errors: Error[] = [];
      const submissions: Value[] = [];
      values.map((s) => {
        index += 1;
        const reference = validationRules.validateCustomerReferenceSection({
          reference: s.reference,
        });
        const fieldFormatErrors: FieldFormatError[] = [];
        if (!reference.valid) {
          fieldFormatErrors.push(reference.value);
        }

        const wasteDescription =
          validationRules.validateWasteDescriptionSection(
            {
              baselAnnexIXCode: s.baselAnnexIXCode,
              oecdCode: s.oecdCode,
              annexIIIACode: s.annexIIIACode,
              annexIIIBCode: s.annexIIIBCode,
              laboratory: s.laboratory,
              ewcCodes: s.ewcCodes,
              nationalCode: s.nationalCode,
              wasteDescription: s.wasteDescription,
            },
            wasteCodeList,
            ewcCodeList
          );
        if (!wasteDescription.valid) {
          fieldFormatErrors.push(wasteDescription.value);
        }

        const wasteQuantity = validationRules.validateWasteQuantitySection({
          wasteQuantityTonnes: s.wasteQuantityTonnes,
          wasteQuantityCubicMetres: s.wasteQuantityCubicMetres,
          wasteQuantityKilograms: s.wasteQuantityKilograms,
          estimatedOrActualWasteQuantity: s.estimatedOrActualWasteQuantity,
        });
        if (!wasteQuantity.valid) {
          fieldFormatErrors.push(wasteQuantity.value);
        }

        const invalidStructureErrors: InvalidAttributeCombinationError[] = [];
        if (wasteDescription.valid && wasteQuantity.valid) {
          const crossSection =
            validationRules.validateWasteDescriptionAndQuantityCrossSection(
              wasteDescription.value,
              wasteQuantity.value
            );
          if (!crossSection.valid) {
            invalidStructureErrors.push(crossSection.value);
          }
        }

        if (reference.valid && wasteDescription.valid && wasteQuantity.valid) {
          submissions.push({
            reference: reference.value,
            wasteDescription: wasteDescription.value,
            wasteQuantity: wasteQuantity.value,
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
