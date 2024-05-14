import Boom from '@hapi/boom';
import * as api from '@wts/api/uk-waste-movements';
import { v4 as uuidv4 } from 'uuid';
import { fromBoom, success } from '@wts/util/invocation';
import { Logger } from 'winston';
import { Handler } from '@wts/api/common';
import {
  FieldFormatError,
  InvalidAttributeCombinationError,
  Value,
  Error,
  ValidationResult,
  WasteTypeDetailFlattened,
} from '../model';
import { validationRules } from '../lib';
import { Pop, WasteCode } from '@wts/api/reference-data';
import { CosmosRepository } from '../data';

const submissionsContainerName = 'drafts';

export default class SubmissionController {
  constructor(
    private repository: CosmosRepository,
    private logger: Logger,
    private hazardousCodes: WasteCode[],
    private pops: Pop[],
    private ewcCodes: WasteCode[]
  ) {}

  validateSubmissions: Handler<
    api.ValidateSubmissionsRequest,
    api.ValidateSubmissionsResponse
  > = async ({ accountId, padIndex, values }) => {
    try {
      let index = padIndex;
      const errors: Error[] = [];
      const submissions: Value[] = [];
      values.forEach((s) => {
        index += 1;

        let hasAnyPopulatedProp = false;
        for (const key in s) {
          if ((s as { [key: string]: string })[key]?.trim()) {
            hasAnyPopulatedProp = true;
            break;
          }
        }

        if (!hasAnyPopulatedProp) {
          return;
        }

        const fieldFormatErrors: FieldFormatError[] = [];

        const producer = validationRules.validateProducerDetailSection({
          producerAddressLine1: s.producerAddressLine1,
          producerAddressLine2: s.producerAddressLine2,
          producerCountry: s.producerCountry,
          producerContactEmail: s.producerContactEmail,
          producerContactName: s.producerContactName,
          producerOrganisationName: s.producerOrganisationName,
          producerContactPhone: s.producerContactPhone,
          producerPostcode: s.producerPostcode,
          producerSicCode: s.producerSicCode,
          producerTownCity: s.producerTownCity,
          customerReference: s.customerReference,
        });

        if (!producer.valid) {
          fieldFormatErrors.push(...producer.value);
        }

        const wasteCollection =
          validationRules.validateWasteCollectionDetailSection({
            wasteCollectionAddressLine1: s.wasteCollectionAddressLine1,
            wasteCollectionAddressLine2: s.wasteCollectionAddressLine2,
            wasteCollectionTownCity: s.wasteCollectionTownCity,
            wasteCollectionCountry: s.wasteCollectionCountry,
            wasteCollectionPostcode: s.wasteCollectionPostcode,
            wasteCollectionWasteSource: s.wasteCollectionWasteSource,
            wasteCollectionBrokerRegistrationNumber:
              s.wasteCollectionBrokerRegistrationNumber,
            wasteCollectionCarrierRegistrationNumber:
              s.wasteCollectionCarrierRegistrationNumber,
            wasteCollectionModeOfWasteTransport:
              s.wasteCollectionModeOfWasteTransport,
            wasteCollectionExpectedWasteCollectionDate:
              s.wasteCollectionExpectedWasteCollectionDate,
          });

        if (!wasteCollection.valid) {
          fieldFormatErrors.push(...wasteCollection.value);
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

        const wasteTypeDetailFlattened: WasteTypeDetailFlattened = {
          firstWasteTypeEwcCode: s.firstWasteTypeEwcCode,
          firstWasteTypeWasteDescription: s.firstWasteTypeWasteDescription,
          firstWasteTypePhysicalForm: s.firstWasteTypePhysicalForm,
          firstWasteTypeWasteQuantity: s.firstWasteTypeWasteQuantity,
          firstWasteTypeWasteQuantityUnit: s.firstWasteTypeWasteQuantityUnit,
          firstWasteTypeWasteQuantityType: s.firstWasteTypeWasteQuantityType,
          firstWasteTypeChemicalAndBiologicalComponentsString:
            s.firstWasteTypeChemicalAndBiologicalComponentsString,
          firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            s.firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
          firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            s.firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
          firstWasteTypeHasHazardousProperties:
            s.firstWasteTypeHasHazardousProperties,
          firstWasteTypeHazardousWasteCodesString:
            s.firstWasteTypeHazardousWasteCodesString,
          firstWasteTypeContainsPops: s.firstWasteTypeContainsPops,
          firstWasteTypePopsString: s.firstWasteTypePopsString,
          firstWasteTypePopsConcentrationsString:
            s.firstWasteTypePopsConcentrationsString,
          firstWasteTypePopsConcentrationUnitsString:
            s.firstWasteTypePopsConcentrationUnitsString,
          secondWasteTypeEwcCode: s.secondWasteTypeEwcCode,
          secondWasteTypeWasteDescription: s.secondWasteTypeWasteDescription,
          secondWasteTypePhysicalForm: s.secondWasteTypePhysicalForm,
          secondWasteTypeWasteQuantity: s.secondWasteTypeWasteQuantity,
          secondWasteTypeWasteQuantityUnit: s.secondWasteTypeWasteQuantityUnit,
          secondWasteTypeWasteQuantityType: s.secondWasteTypeWasteQuantityType,
          secondWasteTypeChemicalAndBiologicalComponentsString:
            s.secondWasteTypeChemicalAndBiologicalComponentsString,
          secondWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            s.secondWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
          secondWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            s.secondWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
          secondWasteTypeHasHazardousProperties:
            s.secondWasteTypeHasHazardousProperties,
          secondWasteTypeHazardousWasteCodesString:
            s.secondWasteTypeHazardousWasteCodesString,
          secondWasteTypeContainsPops: s.secondWasteTypeContainsPops,
          secondWasteTypePopsString: s.secondWasteTypePopsString,
          secondWasteTypePopsConcentrationsString:
            s.secondWasteTypePopsConcentrationsString,
          secondWasteTypePopsConcentrationUnitsString:
            s.secondWasteTypePopsConcentrationUnitsString,
          thirdWasteTypeEwcCode: s.thirdWasteTypeEwcCode,
          thirdWasteTypeWasteDescription: s.thirdWasteTypeWasteDescription,
          thirdWasteTypePhysicalForm: s.thirdWasteTypePhysicalForm,
          thirdWasteTypeWasteQuantity: s.thirdWasteTypeWasteQuantity,
          thirdWasteTypeWasteQuantityUnit: s.thirdWasteTypeWasteQuantityUnit,
          thirdWasteTypeWasteQuantityType: s.thirdWasteTypeWasteQuantityType,
          thirdWasteTypeChemicalAndBiologicalComponentsString:
            s.thirdWasteTypeChemicalAndBiologicalComponentsString,
          thirdWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            s.thirdWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
          thirdWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            s.thirdWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
          thirdWasteTypeHasHazardousProperties:
            s.thirdWasteTypeHasHazardousProperties,
          thirdWasteTypeHazardousWasteCodesString:
            s.thirdWasteTypeHazardousWasteCodesString,
          thirdWasteTypeContainsPops: s.thirdWasteTypeContainsPops,
          thirdWasteTypePopsString: s.thirdWasteTypePopsString,
          thirdWasteTypePopsConcentrationsString:
            s.thirdWasteTypePopsConcentrationsString,
          thirdWasteTypePopsConcentrationUnitsString:
            s.thirdWasteTypePopsConcentrationUnitsString,
          fourthWasteTypeEwcCode: s.fourthWasteTypeEwcCode,
          fourthWasteTypeWasteDescription: s.fourthWasteTypeWasteDescription,
          fourthWasteTypePhysicalForm: s.fourthWasteTypePhysicalForm,
          fourthWasteTypeWasteQuantity: s.fourthWasteTypeWasteQuantity,
          fourthWasteTypeWasteQuantityUnit: s.fourthWasteTypeWasteQuantityUnit,
          fourthWasteTypeWasteQuantityType: s.fourthWasteTypeWasteQuantityType,
          fourthWasteTypeChemicalAndBiologicalComponentsString:
            s.fourthWasteTypeChemicalAndBiologicalComponentsString,
          fourthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            s.fourthWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
          fourthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            s.fourthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
          fourthWasteTypeHasHazardousProperties:
            s.fourthWasteTypeHasHazardousProperties,
          fourthWasteTypeHazardousWasteCodesString:
            s.fourthWasteTypeHazardousWasteCodesString,
          fourthWasteTypeContainsPops: s.fourthWasteTypeContainsPops,
          fourthWasteTypePopsString: s.fourthWasteTypePopsString,
          fourthWasteTypePopsConcentrationsString:
            s.fourthWasteTypePopsConcentrationsString,
          fourthWasteTypePopsConcentrationUnitsString:
            s.fourthWasteTypePopsConcentrationUnitsString,
          fifthWasteTypeEwcCode: s.fifthWasteTypeEwcCode,
          fifthWasteTypeWasteDescription: s.fifthWasteTypeWasteDescription,
          fifthWasteTypePhysicalForm: s.fifthWasteTypePhysicalForm,
          fifthWasteTypeWasteQuantity: s.fifthWasteTypeWasteQuantity,
          fifthWasteTypeWasteQuantityUnit: s.fifthWasteTypeWasteQuantityUnit,
          fifthWasteTypeWasteQuantityType: s.fifthWasteTypeWasteQuantityType,
          fifthWasteTypeChemicalAndBiologicalComponentsString:
            s.fifthWasteTypeChemicalAndBiologicalComponentsString,
          fifthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            s.fifthWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
          fifthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            s.fifthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
          fifthWasteTypeHasHazardousProperties:
            s.fifthWasteTypeHasHazardousProperties,
          fifthWasteTypeHazardousWasteCodesString:
            s.fifthWasteTypeHazardousWasteCodesString,
          fifthWasteTypeContainsPops: s.fifthWasteTypeContainsPops,
          fifthWasteTypePopsString: s.fifthWasteTypePopsString,
          fifthWasteTypePopsConcentrationsString:
            s.fifthWasteTypePopsConcentrationsString,
          fifthWasteTypePopsConcentrationUnitsString:
            s.fifthWasteTypePopsConcentrationUnitsString,
          sixthWasteTypeEwcCode: s.sixthWasteTypeEwcCode,
          sixthWasteTypeWasteDescription: s.sixthWasteTypeWasteDescription,
          sixthWasteTypePhysicalForm: s.sixthWasteTypePhysicalForm,
          sixthWasteTypeWasteQuantity: s.sixthWasteTypeWasteQuantity,
          sixthWasteTypeWasteQuantityUnit: s.sixthWasteTypeWasteQuantityUnit,
          sixthWasteTypeWasteQuantityType: s.sixthWasteTypeWasteQuantityType,
          sixthWasteTypeChemicalAndBiologicalComponentsString:
            s.sixthWasteTypeChemicalAndBiologicalComponentsString,
          sixthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            s.sixthWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
          sixthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            s.sixthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
          sixthWasteTypeHasHazardousProperties:
            s.sixthWasteTypeHasHazardousProperties,
          sixthWasteTypeHazardousWasteCodesString:
            s.sixthWasteTypeHazardousWasteCodesString,
          sixthWasteTypeContainsPops: s.sixthWasteTypeContainsPops,
          sixthWasteTypePopsString: s.sixthWasteTypePopsString,
          sixthWasteTypePopsConcentrationsString:
            s.sixthWasteTypePopsConcentrationsString,
          sixthWasteTypePopsConcentrationUnitsString:
            s.sixthWasteTypePopsConcentrationUnitsString,
          seventhWasteTypeEwcCode: s.seventhWasteTypeEwcCode,
          seventhWasteTypeWasteDescription: s.seventhWasteTypeWasteDescription,
          seventhWasteTypePhysicalForm: s.seventhWasteTypePhysicalForm,
          seventhWasteTypeWasteQuantity: s.seventhWasteTypeWasteQuantity,
          seventhWasteTypeWasteQuantityUnit:
            s.seventhWasteTypeWasteQuantityUnit,
          seventhWasteTypeWasteQuantityType:
            s.seventhWasteTypeWasteQuantityType,
          seventhWasteTypeChemicalAndBiologicalComponentsString:
            s.seventhWasteTypeChemicalAndBiologicalComponentsString,
          seventhWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            s.seventhWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
          seventhWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            s.seventhWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
          seventhWasteTypeHasHazardousProperties:
            s.seventhWasteTypeHasHazardousProperties,
          seventhWasteTypeHazardousWasteCodesString:
            s.seventhWasteTypeHazardousWasteCodesString,
          seventhWasteTypeContainsPops: s.seventhWasteTypeContainsPops,
          seventhWasteTypePopsString: s.seventhWasteTypePopsString,
          seventhWasteTypePopsConcentrationsString:
            s.seventhWasteTypePopsConcentrationsString,
          seventhWasteTypePopsConcentrationUnitsString:
            s.seventhWasteTypePopsConcentrationUnitsString,
          eighthWasteTypeEwcCode: s.eighthWasteTypeEwcCode,
          eighthWasteTypeWasteDescription: s.eighthWasteTypeWasteDescription,
          eighthWasteTypePhysicalForm: s.eighthWasteTypePhysicalForm,
          eighthWasteTypeWasteQuantity: s.eighthWasteTypeWasteQuantity,
          eighthWasteTypeWasteQuantityUnit: s.eighthWasteTypeWasteQuantityUnit,
          eighthWasteTypeWasteQuantityType: s.eighthWasteTypeWasteQuantityType,
          eighthWasteTypeChemicalAndBiologicalComponentsString:
            s.eighthWasteTypeChemicalAndBiologicalComponentsString,
          eighthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            s.eighthWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
          eighthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            s.eighthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
          eighthWasteTypeHasHazardousProperties:
            s.eighthWasteTypeHasHazardousProperties,
          eighthWasteTypeHazardousWasteCodesString:
            s.eighthWasteTypeHazardousWasteCodesString,
          eighthWasteTypeContainsPops: s.eighthWasteTypeContainsPops,
          eighthWasteTypePopsString: s.eighthWasteTypePopsString,
          eighthWasteTypePopsConcentrationsString:
            s.eighthWasteTypePopsConcentrationsString,
          eighthWasteTypePopsConcentrationUnitsString:
            s.eighthWasteTypePopsConcentrationUnitsString,
          ninthWasteTypeEwcCode: s.ninthWasteTypeEwcCode,
          ninthWasteTypeWasteDescription: s.ninthWasteTypeWasteDescription,
          ninthWasteTypePhysicalForm: s.ninthWasteTypePhysicalForm,
          ninthWasteTypeWasteQuantity: s.ninthWasteTypeWasteQuantity,
          ninthWasteTypeWasteQuantityUnit: s.ninthWasteTypeWasteQuantityUnit,
          ninthWasteTypeWasteQuantityType: s.ninthWasteTypeWasteQuantityType,
          ninthWasteTypeChemicalAndBiologicalComponentsString:
            s.ninthWasteTypeChemicalAndBiologicalComponentsString,
          ninthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            s.ninthWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
          ninthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            s.ninthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
          ninthWasteTypeHasHazardousProperties:
            s.ninthWasteTypeHasHazardousProperties,
          ninthWasteTypeHazardousWasteCodesString:
            s.ninthWasteTypeHazardousWasteCodesString,
          ninthWasteTypeContainsPops: s.ninthWasteTypeContainsPops,
          ninthWasteTypePopsString: s.ninthWasteTypePopsString,
          ninthWasteTypePopsConcentrationsString:
            s.ninthWasteTypePopsConcentrationsString,
          ninthWasteTypePopsConcentrationUnitsString:
            s.ninthWasteTypePopsConcentrationUnitsString,
          tenthWasteTypeEwcCode: s.tenthWasteTypeEwcCode,
          tenthWasteTypeWasteDescription: s.tenthWasteTypeWasteDescription,
          tenthWasteTypePhysicalForm: s.tenthWasteTypePhysicalForm,
          tenthWasteTypeWasteQuantity: s.tenthWasteTypeWasteQuantity,
          tenthWasteTypeWasteQuantityUnit: s.tenthWasteTypeWasteQuantityUnit,
          tenthWasteTypeWasteQuantityType: s.tenthWasteTypeWasteQuantityType,
          tenthWasteTypeChemicalAndBiologicalComponentsString:
            s.tenthWasteTypeChemicalAndBiologicalComponentsString,
          tenthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            s.tenthWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
          tenthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            s.tenthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
          tenthWasteTypeHasHazardousProperties:
            s.tenthWasteTypeHasHazardousProperties,
          tenthWasteTypeHazardousWasteCodesString:
            s.tenthWasteTypeHazardousWasteCodesString,
          tenthWasteTypeContainsPops: s.tenthWasteTypeContainsPops,
          tenthWasteTypePopsString: s.tenthWasteTypePopsString,
          tenthWasteTypePopsConcentrationsString:
            s.tenthWasteTypePopsConcentrationsString,
          tenthWasteTypePopsConcentrationUnitsString:
            s.tenthWasteTypePopsConcentrationUnitsString,
        };

        const wasteTypes = validationRules.validateWasteTypeDetailSection(
          wasteTypeDetailFlattened,
          this.hazardousCodes,
          this.pops,
          this.ewcCodes
        );

        if (!wasteTypes.valid) {
          fieldFormatErrors.push(...wasteTypes.value);
        }

        if (
          receiver.valid &&
          producer.valid &&
          wasteCollection.valid &&
          wasteTransportation.valid &&
          wasteTypes.valid
        ) {
          if (!wasteCollection.value.address.addressLine1?.trim()) {
            wasteCollection.value.address = producer.value.address;
          }

          submissions.push({
            producer: producer.value,
            receiver: receiver.value,
            wasteTypes: wasteTypes.value,
            wasteCollection: wasteCollection.value,
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

  createSubmissions: Handler<
    api.CreateSubmissionsRequest,
    api.CreateSubmissionsResponse
  > = async ({ accountId, values }) => {
    try {
      const submissions = values.map((s) => {
        const id = uuidv4();
        const timestamp = new Date();

        const transactionId =
          'WM' +
          timestamp.getFullYear().toString().substring(2) +
          (timestamp.getMonth() + 1).toString().padStart(2, '0') +
          '_' +
          id.substring(0, 8).toUpperCase();

        const wasteInformation: api.WasteInformation = {
          status: 'Complete',
          wasteTypes: s.wasteTypes,
          wasteTransportation: s.wasteTransportation,
        };

        const producerAndCollection: api.ProducerAndWasteCollectionDetail = {
          status: 'Complete',
          producer: s.producer,
          wasteCollection: s.wasteCollection,
        };

        const draftReceiver: api.DraftReceiverDetail = {
          status: 'Completed',
          ...s.receiver,
        };

        const draftSubmissionDeclaration: api.DraftSubmissionDeclaration = {
          status: 'Complete',
          values: {
            declarationTimestamp: new Date(),
            transactionId: transactionId,
          },
        };

        const submissionState: api.Submission['submissionState'] = {
          status: s.wasteTypes.some((wt) => {
            wt.wasteQuantityType == 'EstimateData';
          })
            ? 'SubmittedWithEstimates'
            : 'SubmittedWithActuals',
          timestamp: new Date(),
        };

        return {
          id: id,
          transactionId: transactionId,
          producerAndCollection: producerAndCollection,
          receiver: draftReceiver,
          wasteInformation: wasteInformation,
          submissionDeclaration: draftSubmissionDeclaration,
          submissionState,
        };
      });
      await this.repository.createBulkRecords(
        submissionsContainerName,
        accountId,
        submissions
      );
      return {
        success: true,
        value: submissions,
      };
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
