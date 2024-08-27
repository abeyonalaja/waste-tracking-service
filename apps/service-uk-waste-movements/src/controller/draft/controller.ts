import Boom from '@hapi/boom';
import * as api from '@wts/api/uk-waste-movements';
import { fromBoom, success } from '@wts/util/invocation';
import { Logger } from 'winston';
import {
  FieldFormatError,
  InvalidAttributeCombinationError,
  Value,
  Error,
  ValidationResult,
  WasteTypeDetailFlattened,
  SubmissionValidationReferenceData,
  Draft,
} from '../../model';
import { ukwm as ukwmValidation } from '@wts/util/shared-validation';
import { validationRules } from '../../lib';
import { CosmosRepository } from '../../data';
import { v4 as uuidv4 } from 'uuid';

export type Handler<Request, Response> = (
  request: Request,
) => Promise<Response>;

const draftsContainerName = 'drafts';

export default class SubmissionController {
  constructor(
    private repository: CosmosRepository,
    private logger: Logger,
    private referenceData: SubmissionValidationReferenceData,
  ) {}

  validateMultipleDrafts: Handler<
    api.ValidateMultipleDraftsRequest,
    api.ValidateMultipleDraftsResponse
  > = async ({ accountId, padIndex, values }) => {
    try {
      let index = padIndex;
      const errors: Error[] = [];
      const submissions: Value[] = [];
      values.forEach((s) => {
        index += 1;

        let hasAnyPopulatedProp = false;
        for (const key in s) {
          if ((s as unknown as { [key: string]: string })[key]?.trim()) {
            hasAnyPopulatedProp = true;
            break;
          }
        }

        if (!hasAnyPopulatedProp) {
          return;
        }

        const fieldFormatErrors: FieldFormatError[] = [];

        const reference = validationRules.validateCustomerReference(
          s.customerReference,
        );

        if (!reference.valid) {
          fieldFormatErrors.push(...reference.value);
        }

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
        });

        if (!producer.valid) {
          fieldFormatErrors.push(...producer.value);
        }

        const wasteCollection =
          validationRules.validateWasteCollectionDetailSection(
            {
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
              wasteCollectionExpectedWasteCollectionDate:
                s.wasteCollectionExpectedWasteCollectionDate,
              wasteCollectionLocalAuthority: s.wasteCollectionLocalAuthority,
            },
            this.referenceData.localAuthorities,
          );

        if (!wasteCollection.valid) {
          fieldFormatErrors.push(...wasteCollection.value);
        }

        const carrier = validationRules.validateCarrierDetailSection({
          carrierAddressLine1: s.carrierAddressLine1,
          carrierAddressLine2: s.carrierAddressLine2,
          carrierTownCity: s.carrierTownCity,
          carrierCountry: s.carrierCountry,
          carrierPostcode: s.carrierPostcode,
          carrierContactName: s.carrierContactName,
          carrierContactEmail: s.carrierContactEmail,
          carrierContactPhone: s.carrierContactPhone,
          carrierOrganisationName: s.carrierOrganisationName,
        });

        if (!carrier.valid) {
          fieldFormatErrors.push(...carrier.value);
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
          this.referenceData.hazardousCodes,
          this.referenceData.pops,
          this.referenceData.ewcCodes,
        );

        if (!wasteTypes.valid) {
          fieldFormatErrors.push(...wasteTypes.value);
        }

        if (
          reference.valid &&
          receiver.valid &&
          producer.valid &&
          wasteCollection.valid &&
          wasteTransportation.valid &&
          wasteTypes.valid &&
          carrier.valid
        ) {
          if (!wasteCollection.value.address.addressLine1?.trim()) {
            wasteCollection.value.address = producer.value.address;
          }

          submissions.push({
            reference: reference.value,
            producer: producer.value,
            receiver: receiver.value,
            wasteTypes: wasteTypes.value,
            wasteCollection: wasteCollection.value,
            wasteTransportation: wasteTransportation.value,
            carrier: carrier.value,
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

  createMultipleDrafts: Handler<
    api.CreateMultipleDraftsRequest,
    api.CreateMultipleDraftsResponse
  > = async ({ accountId, values }) => {
    try {
      const submissions = values.map((s) => {
        const id = uuidv4();
        if (!s.id) {
          s.id = id;
        }

        if (!s.transactionId) {
          const timestamp = new Date();

          const transactionId =
            'WM' +
            timestamp.getFullYear().toString().substring(2) +
            (timestamp.getMonth() + 1).toString().padStart(2, '0') +
            '_' +
            id.substring(0, 8).toUpperCase();

          s.transactionId = transactionId;
        }

        const wasteInformation: api.WasteInformation = {
          status: 'Complete',
          wasteTypes: s.wasteTypes,
          wasteTransportation: s.wasteTransportation,
        };

        const producerAndCollection: api.ProducerAndWasteCollectionDetail = {
          producer: {
            sicCodes: s.producer.sicCode
              ? {
                  status: 'Complete',
                  values: [s.producer.sicCode],
                }
              : {
                  status: 'NotStarted',
                  values: [],
                },
            address: {
              status: 'Complete',
              ...s.producer.address,
            },
            contact: {
              status: 'Complete',
              ...s.producer.contact,
            },
          },
          wasteCollection: {
            address: {
              status: 'Complete',
              ...s.wasteCollection.address,
            },
            expectedWasteCollectionDate:
              s.wasteCollection.expectedWasteCollectionDate,
            localAuthority: s.wasteCollection.localAuthority,
            wasteSource: {
              status: 'Complete',
              value: s.wasteCollection.wasteSource,
            },
            brokerRegistrationNumber:
              s.wasteCollection.brokerRegistrationNumber,
            carrierRegistrationNumber:
              s.wasteCollection.carrierRegistrationNumber,
          },
          confirmation: {
            status: 'Complete',
          },
        };

        const draftReceiver: api.DraftReceiver = {
          address: {
            status: 'Complete',
            ...s.receiver.address,
          },
          contact: {
            status: 'Complete',
            ...s.receiver.contact,
          },
          permitDetails: {
            status: 'Complete',
            ...s.receiver.permitDetails,
          },
        };

        const draftCarrier: api.DraftCarrier = {
          address: {
            status: 'Complete',
            ...s.carrier.address,
          },
          contact: {
            status: 'Complete',
            ...s.carrier.contact,
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
        };

        const draftDeclaration: api.DraftDeclaration = {
          status: 'Complete',
          value: {
            declarationTimestamp: new Date(),
            transactionId: s.transactionId,
          },
        };

        const state: api.Draft['state'] = {
          status: s.wasteTypes.some((wt) => {
            wt.wasteQuantityType == 'EstimateData';
          })
            ? 'SubmittedWithEstimates'
            : 'SubmittedWithActuals',
          timestamp: new Date(),
        };
        return {
          id: s.id,
          reference: s.reference,
          transactionId: s.transactionId,
          producerAndCollection: producerAndCollection,
          receiver: draftReceiver,
          wasteInformation: wasteInformation,
          carrier: draftCarrier,
          declaration: draftDeclaration,
          state,
        };
      });
      await this.repository.createBulkRecords(
        draftsContainerName,
        accountId,
        submissions,
      );
      return success(undefined);
    } catch (err) {
      console.error(err);
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDraft: Handler<api.GetDraftRequest, api.GetDraftResponse> = async ({
    id,
    accountId,
  }) => {
    try {
      const draft = await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      );
      return success(draft);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDrafts: Handler<api.GetDraftsRequest, api.GetDraftsResponse> = async (
    request,
  ) => {
    try {
      const result = await this.repository.getDrafts(
        draftsContainerName,
        request.page,
        request.pageSize || 16,
        request.collectionDate,
        request.ewcCode,
        request.producerName,
        request.wasteMovementId,
      );
      return success(result);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createDraft: Handler<api.CreateDraftRequest, api.CreateDraftResponse> =
    async (request) => {
      try {
        const referenceValidationResult =
          ukwmValidation.validationRules.validateReference(request.reference);

        if (!referenceValidationResult.valid) {
          const boom = Boom.badRequest(
            'Validation failed',
            referenceValidationResult.errors,
          );
          return fromBoom(boom);
        }

        const draft: Draft = {
          id: uuidv4(),
          reference: referenceValidationResult.value,
          producerAndCollection: {
            producer: {
              contact: {
                status: 'NotStarted',
              },
              address: {
                status: 'NotStarted',
              },
              sicCodes: {
                status: 'NotStarted',
                values: [],
              },
            },
            wasteCollection: {
              address: {
                status: 'NotStarted',
              },
              wasteSource: {
                status: 'NotStarted',
              },
            },
            confirmation: {
              status: 'NotStarted',
            },
          },
          carrier: {
            address: {
              status: 'NotStarted',
            },
            contact: {
              status: 'NotStarted',
            },
            modeOfTransport: {
              status: 'NotStarted',
            },
          },
          receiver: {
            address: {
              status: 'NotStarted',
            },
            contact: {
              status: 'NotStarted',
            },
            permitDetails: {
              status: 'NotStarted',
            },
          },
          wasteInformation: {
            status: 'NotStarted',
          },
          declaration: {
            status: 'CannotStart',
          },
          state: {
            status: 'InProgress',
            timestamp: new Date(),
          },
        };

        await this.repository.saveRecord(
          draftsContainerName,
          draft,
          request.accountId,
        );

        return success(draft);
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };

  setDraftProducerAddressDetails: Handler<
    api.SetDraftProducerAddressDetailsRequest,
    api.SetDraftProducerAddressDetailsResponse
  > = async ({ id, accountId, value, saveAsDraft }) => {
    try {
      const addressDetailsValidationResult =
        ukwmValidation.validationRules.validateAddressDetails(
          value,
          'Producer',
          saveAsDraft,
        );

      if (!addressDetailsValidationResult.valid) {
        return fromBoom(
          Boom.badRequest(
            'Validation failed',
            addressDetailsValidationResult.errors,
          ),
        );
      }

      const draft = await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      );

      draft.producerAndCollection.producer.address = !saveAsDraft
        ? {
            status: 'Complete',
            ...(addressDetailsValidationResult.value as api.Address),
          }
        : {
            status: 'Started',
            ...(addressDetailsValidationResult.value as Partial<api.Address>),
          };

      draft.producerAndCollection.confirmation.status = 'NotStarted';

      await this.repository.saveRecord(
        draftsContainerName,
        { ...draft },
        accountId,
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDraftProducerAddressDetails: Handler<
    api.GetDraftProducerAddressDetailsRequest,
    api.GetDraftProducerAddressDetailsResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      );

      return success(draft.producerAndCollection.producer.address);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDraftProducerContactDetail: Handler<
    api.GetDraftProducerContactDetailRequest,
    api.GetDraftProducerContactDetailResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      );

      return success(draft.producerAndCollection.producer.contact);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftProducerContactDetail: Handler<
    api.SetDraftProducerContactDetailRequest,
    api.SetDraftProducerContactDetailResponse
  > = async ({ id, accountId, value, saveAsDraft }) => {
    try {
      const contactDetailsValidationResult =
        ukwmValidation.validationRules.validateContactDetails(
          value,
          'Producer',
          saveAsDraft,
        );

      if (!contactDetailsValidationResult.valid) {
        const boom = Boom.badRequest(
          'Validation failed',
          contactDetailsValidationResult.errors,
        );
        return fromBoom(boom);
      }

      const draft = await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      );

      draft.producerAndCollection.producer.contact = !saveAsDraft
        ? {
            status: 'Complete',
            ...(contactDetailsValidationResult.value as api.Contact),
          }
        : {
            status: 'Started',
            ...(contactDetailsValidationResult.value as Promise<api.Contact>),
          };

      draft.producerAndCollection.confirmation.status = 'NotStarted';

      await this.repository.saveRecord(
        draftsContainerName,
        { ...draft },
        accountId,
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDraftWasteSource: Handler<
    api.GetDraftWasteSourceRequest,
    api.GetDraftWasteSourceResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      );

      return success(draft.producerAndCollection.wasteCollection.wasteSource);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftWasteSource: Handler<
    api.SetDraftWasteSourceRequest,
    api.SetDraftWasteSourceResponse
  > = async ({ id, accountId, wasteSource }) => {
    try {
      const wasteSourceValidationResult =
        ukwmValidation.validationRules.validateWasteSourceSection(wasteSource);
      if (!wasteSourceValidationResult.valid) {
        const boom = Boom.badRequest(
          'Validation failed',
          wasteSourceValidationResult.errors,
        );
        return fromBoom(boom);
      }

      const draft = await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      );

      if (draft.producerAndCollection.wasteCollection) {
        draft.producerAndCollection.wasteCollection.wasteSource = {
          status: 'Complete',
          value: wasteSource,
        };
      }

      draft.producerAndCollection.confirmation.status = 'NotStarted';

      await this.repository.saveRecord(
        draftsContainerName,
        { ...draft },
        accountId,
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftWasteCollectionAddressDetails: Handler<
    api.SetDraftWasteCollectionAddressDetailsRequest,
    api.SetDraftWasteCollectionAddressDetailsResponse
  > = async ({ id, accountId, value, saveAsDraft }) => {
    try {
      const addressDetailsValidationResult =
        ukwmValidation.validationRules.validateAddressDetails(
          value,
          'Waste collection',
          saveAsDraft,
        );

      if (!addressDetailsValidationResult.valid) {
        return fromBoom(
          Boom.badRequest(
            'Validation failed',
            addressDetailsValidationResult.errors,
          ),
        );
      }

      const draft = await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      );

      draft.producerAndCollection.wasteCollection.address = !saveAsDraft
        ? {
            status: 'Complete',
            ...(addressDetailsValidationResult.value as api.Address),
          }
        : {
            status: 'Started',
            ...(addressDetailsValidationResult.value as Partial<api.Address>),
          };

      draft.producerAndCollection.confirmation.status = 'NotStarted';

      await this.repository.saveRecord(
        draftsContainerName,
        { ...draft },
        accountId,
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDraftWasteCollectionAddressDetails: Handler<
    api.GetDraftWasteCollectionAddressDetailsRequest,
    api.GetDraftWasteCollectionAddressDetailsResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      );

      return success(draft.producerAndCollection.wasteCollection.address);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createDraftSicCode: Handler<
    api.CreateDraftSicCodeRequest,
    api.CreateDraftSicCodeResponse
  > = async ({ id, accountId, sicCode }) => {
    try {
      const draft = await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      );

      const draftSicCodesList =
        draft.producerAndCollection.producer.sicCodes.values;
      const sicCodesValidationResult =
        ukwmValidation.validationRules.validateSicCodesSection(
          sicCode,
          draftSicCodesList,
          this.referenceData.sicCodes,
        );
      if (!sicCodesValidationResult.valid) {
        const boom = Boom.badRequest(
          'Validation failed',
          sicCodesValidationResult.errors,
        );
        return fromBoom(boom);
      }
      draft.producerAndCollection.producer.sicCodes.values.push(sicCode);
      draft.producerAndCollection.producer.sicCodes.status = 'Complete';

      draft.producerAndCollection.confirmation.status = 'NotStarted';

      await this.repository.saveRecord(
        draftsContainerName,
        { ...draft },
        accountId,
      );
      return success(sicCode);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDraftSicCodes: Handler<
    api.GetDraftSicCodesRequest,
    api.GetDraftSicCodesResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      );

      return success(draft.producerAndCollection.producer.sicCodes);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftProducerConfirmation: Handler<
    api.SetDraftProducerConfirmationRequest,
    api.SetDraftProducerConfirmationResponse
  > = async ({ id, accountId, isConfirmed }) => {
    try {
      const draft = await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      );

      if (
        !draft.reference ||
        draft.producerAndCollection.producer.contact.status !== 'Complete' ||
        draft.producerAndCollection.producer.sicCodes.status !== 'Complete' ||
        draft.producerAndCollection.wasteCollection.address.status !==
          'Complete' ||
        draft.producerAndCollection.wasteCollection.wasteSource.status !==
          'Complete'
      ) {
        return fromBoom(
          Boom.badRequest(
            'Producer and waste collection section is not complete',
          ),
        );
      }

      draft.producerAndCollection.confirmation.status = isConfirmed
        ? 'Complete'
        : 'InProgress';

      await this.repository.saveRecord(
        draftsContainerName,
        { ...draft },
        accountId,
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftCarrierAddressDetails: Handler<
    api.SetDraftCarrierAddressDetailsRequest,
    api.SetDraftCarrierAddressDetailsResponse
  > = async ({ id, accountId, value, saveAsDraft }) => {
    try {
      const addressDetailsValidationResult =
        ukwmValidation.validationRules.validateAddressDetails(
          value,
          'Carrier',
          saveAsDraft,
        );

      if (!addressDetailsValidationResult.valid) {
        return fromBoom(
          Boom.badRequest(
            'Validation failed',
            addressDetailsValidationResult.errors,
          ),
        );
      }

      const draft = await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      );

      draft.carrier.address = !saveAsDraft
        ? {
            status: 'Complete',
            ...(addressDetailsValidationResult.value as api.Address),
          }
        : {
            status: 'Started',
            ...(addressDetailsValidationResult.value as Partial<api.Address>),
          };

      await this.repository.saveRecord(
        draftsContainerName,
        { ...draft },
        accountId,
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDraftCarrierAddressDetails: Handler<
    api.GetDraftCarrierAddressDetailsRequest,
    api.GetDraftCarrierAddressDetailsResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      );

      return success(draft.carrier.address);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftReceiverAddressDetails: Handler<
    api.SetDraftReceiverAddressDetailsRequest,
    api.SetDraftReceiverAddressDetailsResponse
  > = async ({ id, accountId, value, saveAsDraft }) => {
    try {
      const addressDetailsValidationResult =
        ukwmValidation.validationRules.validateAddressDetails(
          value,
          'Receiver',
          saveAsDraft,
        );

      if (!addressDetailsValidationResult.valid) {
        return fromBoom(
          Boom.badRequest(
            'Validation failed',
            addressDetailsValidationResult.errors,
          ),
        );
      }

      const draft = await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      );

      draft.receiver.address = !saveAsDraft
        ? {
            status: 'Complete',
            ...(addressDetailsValidationResult.value as api.Address),
          }
        : {
            status: 'Started',
            ...(addressDetailsValidationResult.value as Partial<api.Address>),
          };

      await this.repository.saveRecord(
        draftsContainerName,
        { ...draft },
        accountId,
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDraftReceiverAddressDetails: Handler<
    api.GetDraftReceiverAddressDetailsRequest,
    api.GetDraftReceiverAddressDetailsResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      );

      return success(draft.receiver.address);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  deleteDraftSicCode: Handler<
    api.DeleteDraftSicCodeRequest,
    api.DeleteDraftSicCodeResponse
  > = async ({ id, accountId, code }) => {
    try {
      const draft = await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      );

      const index =
        draft.producerAndCollection.producer.sicCodes.values.findIndex(
          (c) => c === code,
        );

      if (index === -1) {
        return fromBoom(Boom.notFound());
      }

      draft.producerAndCollection.producer.sicCodes.values.splice(index, 1);

      if (draft.producerAndCollection.producer.sicCodes.values.length === 0) {
        draft.producerAndCollection.producer.sicCodes = {
          status: 'NotStarted',
          values: [],
        };
      }

      draft.producerAndCollection.confirmation.status = 'NotStarted';

      await this.repository.saveRecord(
        draftsContainerName,
        { ...draft },
        accountId,
      );

      return success(draft.producerAndCollection.producer.sicCodes.values);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftReceiverContactDetail: Handler<
    api.SetDraftReceiverContactDetailsRequest,
    api.SetDraftReceiverContactDetailsResponse
  > = async ({ id, accountId, value, saveAsDraft }) => {
    try {
      const contactDetailsValidationResult =
        ukwmValidation.validationRules.validateContactDetails(
          value,
          'Receiver',
          saveAsDraft,
        );

      if (!contactDetailsValidationResult.valid) {
        return fromBoom(
          Boom.badRequest(
            'Validation failed',
            contactDetailsValidationResult.errors,
          ),
        );
      }

      const draft = await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      );

      draft.receiver.contact = !saveAsDraft
        ? {
            status: 'Complete',
            ...(contactDetailsValidationResult.value as api.Contact),
          }
        : {
            status: 'Started',
            ...(contactDetailsValidationResult.value as Promise<api.Contact>),
          };

      await this.repository.saveRecord(
        draftsContainerName,
        { ...draft },
        accountId,
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDraftReceiverContactDetail: Handler<
    api.GetDraftReceiverContactDetailsRequest,
    api.GetDraftReceiverContactDetailsResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      );

      return success(draft.receiver.contact);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
