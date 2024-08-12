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
          status: 'Complete',
          producer: {
            reference: s.producer.reference,
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
        };

        const draftReceiver: api.DraftReceiverDetail = {
          status: 'Complete',
          value: s.receiver,
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
      const draft = (await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      )) as api.Draft;
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
        const draft: Draft = {
          id: uuidv4(),
          producerAndCollection: {
            status: 'Started',
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
              reference: request.reference,
            },
            wasteCollection: {
              address: {
                status: 'NotStarted',
              },
              wasteSource: {
                status: 'NotStarted',
              },
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
            status: 'NotStarted',
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
      const draft = (await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      )) as api.Draft;

      if (draft === undefined) {
        return fromBoom(Boom.notFound());
      }

      if (
        draft.producerAndCollection.status !== 'NotStarted' &&
        draft.producerAndCollection.producer
      ) {
        if (saveAsDraft) {
          const partialProducerAddressDetailsValidation =
            ukwmValidation.validationRules.validatePartialProducerAddressDetails(
              value,
            );

          if (!partialProducerAddressDetailsValidation.valid) {
            return fromBoom(
              Boom.badRequest(
                'Validation failed',
                partialProducerAddressDetailsValidation.errors,
              ),
            );
          }

          draft.producerAndCollection.producer.address = {
            status: 'Started',
            ...value,
          };
        } else {
          const producerAddressDetailsValidation =
            ukwmValidation.validationRules.validateProducerAddressDetails(
              value,
            );

          if (!producerAddressDetailsValidation.valid) {
            return fromBoom(
              Boom.badRequest(
                'Validation failed',
                producerAddressDetailsValidation.errors,
              ),
            );
          }

          draft.producerAndCollection.producer.address = {
            status: 'Complete',
            ...producerAddressDetailsValidation.value,
          };
        }
      }

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
      const draft = (await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      )) as api.Draft;

      if (draft === undefined) {
        return fromBoom(Boom.notFound());
      }

      if (
        draft.producerAndCollection.status !== 'NotStarted' &&
        draft.producerAndCollection.producer
      ) {
        return success(draft.producerAndCollection.producer.address);
      }
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
      const draft = (await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      )) as api.Draft;

      if (!draft) {
        return fromBoom(Boom.notFound());
      }

      if (
        (draft.producerAndCollection.status === 'Started' ||
          draft.producerAndCollection.status === 'Complete') &&
        draft.producerAndCollection.producer
      ) {
        return success(draft.producerAndCollection.producer.contact);
      } else {
        return success({ status: 'NotStarted' });
      }
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
      const draft = (await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      )) as api.Draft;

      if (!draft) {
        return fromBoom(Boom.notFound());
      }

      if (value.organisationName && value.name && value.email && value.phone) {
        saveAsDraft = false;
      }

      if (saveAsDraft) {
        const partialProducerContactDetailValidationResult =
          ukwmValidation.validationRules.validatePartialProducerContactDetailSection(
            value,
          );
        if (!partialProducerContactDetailValidationResult.valid) {
          const boom = Boom.badRequest(
            'Validation failed',
            partialProducerContactDetailValidationResult.errors,
          );
          return fromBoom(boom);
        }
      } else {
        const producerContactDetailValidationResult =
          ukwmValidation.validationRules.validateProducerContactDetailSection(
            value as api.Contact,
          );
        if (!producerContactDetailValidationResult.valid) {
          const boom = Boom.badRequest(
            'Validation failed',
            producerContactDetailValidationResult.errors,
          );
          return fromBoom(boom);
        }
      }
      const draftContact: api.DraftContact = saveAsDraft
        ? { status: 'Started', ...(value as Promise<api.Contact>) }
        : { status: 'Complete', ...(value as api.Contact) };
      if (
        draft.producerAndCollection.status === 'Started' ||
        draft.producerAndCollection.status === 'Complete'
      ) {
        if (draft.producerAndCollection.producer) {
          draft.producerAndCollection.producer.contact = draftContact;
        }
      }

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
      const draft = (await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      )) as api.Draft;

      if (!draft) {
        return fromBoom(Boom.notFound());
      }

      if (
        (draft.producerAndCollection.status === 'Started' ||
          draft.producerAndCollection.status === 'Complete') &&
        draft.producerAndCollection.wasteCollection
      ) {
        return success(draft.producerAndCollection.wasteCollection.wasteSource);
      } else {
        return success({ status: 'NotStarted' });
      }
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
      const draft = (await this.repository.getDraft(
        draftsContainerName,
        id,
        accountId,
      )) as api.Draft;

      if (!draft) {
        return fromBoom(Boom.notFound());
      }

      const wasteSourceValidationResult =
        ukwmValidation.validationRules.validateWasteSourceSection(wasteSource);
      if (!wasteSourceValidationResult.valid) {
        const boom = Boom.badRequest(
          'Validation failed',
          wasteSourceValidationResult.errors,
        );
        return fromBoom(boom);
      }

      if (
        draft.producerAndCollection.status === 'Started' ||
        draft.producerAndCollection.status === 'Complete'
      ) {
        if (draft.producerAndCollection.wasteCollection) {
          draft.producerAndCollection.wasteCollection.wasteSource = {
            status: 'Complete',
            value: wasteSource,
          };
        }
      }

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
}
