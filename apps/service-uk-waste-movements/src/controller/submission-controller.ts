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
  > = async ({ accountId, padIndex, values }) => {
    try {
      let index = padIndex;
      const errors: Error[] = [];
      const submissions: Value[] = [];
      values.map((s) => {
        index += 1;
        const fieldFormatErrors: FieldFormatError[] = [];

        const producer = validationRules.validateProducerDetailSection({
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

        const wasteCollectionDetails =
          validationRules.validateWasteCollectionDetailSection({
            wasteCollectionAddressLine1: s.wasteCollectionDetailsAddressLine1,
            wasteCollectionAddressLine2: s.wasteCollectionDetailsAddressLine2,
            wasteCollectionTownCity: s.wasteCollectionDetailsTownCity,
            wasteCollectionCountry: s.wasteCollectionDetailsCountry,
            wasteCollectionPostcode: s.wasteCollectionDetailsPostcode,
            wasteSource: s.wasteCollectionDetailsWasteSource,
            brokerRegNumber: s.wasteCollectionDetailsBrokerRegistrationNumber,
            carrierRegNumber: s.wasteCollectionDetailsCarrierRegistrationNumber,
            modeOfWasteTransport: s.wasteCollectionDetailsModeOfWasteTransport,
            expectedWasteCollectionDate:
              s.wasteCollectionDetailsExpectedWasteCollectionDate,
          });

        if (!wasteCollectionDetails.valid) {
          fieldFormatErrors.push(...wasteCollectionDetails.value);
        }

        const invalidStructureErrors: InvalidAttributeCombinationError[] = [];

        const receiver = validationRules.validateReceiverDetailSection({
          receiverAuthorizationType: s.receiverAuthorizationType,
          receiverEnvironmentalPermitNumber:
            s.receiverEnvironmentalPermitNumber,
          receiverOrganisationName: s.receiverOrganisationName,
          receiverAddressLine1: s.receiverAddressLine1,
          receiverAddressLine2: s.receiverAddressLine2,
          receiverTownCity: s.receiverTownCity,
          receiverPostcode: s.receiverPostcode,
          receiverCountry: s.receiverCountry,
          receiverContactName: s.receiverContactName,
          receiverContactEmail: s.receiverContactEmail,
          receiverContactPhone: s.receiverContactPhone,
        });

        if (!receiver.valid) {
          fieldFormatErrors.push(...receiver.value);
        }

        const wasteTransportation =
          validationRules.validateWasteTransportationDetailSection({
            wasteTransportationNumberAndTypeOfContainers:
              s.wasteTransportationNumberAndTypeOfContainers,
            wasteTransportationSpecialHandlingRequirements:
              s.wasteTransportationSpecialHandlingRequirements,
          });

        if (!wasteTransportation.valid) {
          fieldFormatErrors.push(...wasteTransportation.value);
        }

        if (
          receiver.valid &&
          producer.valid &&
          wasteCollectionDetails.valid &&
          wasteTransportation.valid
        ) {
          if (!wasteCollectionDetails.value.address.addressLine1?.trim()) {
            wasteCollectionDetails.value.address = producer.value.address;
          }

          submissions.push({
            producer: producer.value,
            receiver: receiver.value,
            wasteType: [],
            wasteCollection: wasteCollectionDetails.value,
            wasteTransportation: wasteTransportation.value,
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
