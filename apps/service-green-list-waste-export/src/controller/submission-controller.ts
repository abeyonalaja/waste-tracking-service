import Boom from '@hapi/boom';
import * as api from '@wts/api/green-list-waste-export';
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
      let countriesIncludingUkResponse: GetCountriesResponse;
      let recoveryCodesResponse: GetRecoveryCodesResponse;
      let disposalCodesResponse: GetDisposalCodesResponse;
      try {
        wasteCodesResponse = await this.referenceDataClient.getWasteCodes();
        ewcCodesResponse = await this.referenceDataClient.getEWCCodes({});
        countriesResponse = await this.referenceDataClient.getCountries({});
        countriesIncludingUkResponse =
          await this.referenceDataClient.getCountries({ includeUk: true });
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
        !countriesIncludingUkResponse.success ||
        !recoveryCodesResponse.success ||
        !disposalCodesResponse.success
      ) {
        this.logger.error('Failed to get reference datasets');
        throw Boom.internal();
      }
      const wasteCodeList = wasteCodesResponse.value;
      const ewcCodeList = ewcCodesResponse.value;
      const countryList = countriesResponse.value;
      const countryIncludingUkList = countriesIncludingUkResponse.value;

      let index = 2;
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
          wasteDescription.value.map((e) => {
            fieldFormatErrors.push(e);
          });
        }

        const wasteQuantity = validationRules.validateWasteQuantitySection({
          wasteQuantityTonnes: s.wasteQuantityTonnes,
          wasteQuantityCubicMetres: s.wasteQuantityCubicMetres,
          wasteQuantityKilograms: s.wasteQuantityKilograms,
          estimatedOrActualWasteQuantity: s.estimatedOrActualWasteQuantity,
        });
        if (!wasteQuantity.valid) {
          wasteQuantity.value.map((e) => {
            fieldFormatErrors.push(e);
          });
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

        const exporterDetail = validationRules.validateExporterDetailSection({
          exporterOrganisationName: s.exporterOrganisationName,
          exporterAddressLine1: s.exporterAddressLine1,
          exporterAddressLine2: s.exporterAddressLine2,
          exporterTownOrCity: s.exporterTownOrCity,
          exporterCountry: s.exporterCountry,
          exporterPostcode: s.exporterPostcode,
          exporterContactFullName: s.exporterContactFullName,
          exporterContactPhoneNumber: s.exporterContactPhoneNumber,
          exporterFaxNumber: s.exporterFaxNumber,
          exporterEmailAddress: s.exporterEmailAddress,
        });
        if (!exporterDetail.valid) {
          exporterDetail.value.map((e) => {
            fieldFormatErrors.push(e);
          });
        }

        const importerDetail = validationRules.validateImporterDetailSection(
          {
            importerOrganisationName: s.importerOrganisationName,
            importerAddress: s.importerAddress,
            importerCountry: s.importerCountry,
            importerContactFullName: s.importerContactFullName,
            importerContactPhoneNumber: s.importerContactPhoneNumber,
            importerFaxNumber: s.importerFaxNumber,
            importerEmailAddress: s.importerEmailAddress,
          },
          countryList
        );
        if (!importerDetail.valid) {
          importerDetail.value.map((e) => {
            fieldFormatErrors.push(e);
          });
        }

        const collectionDate = validationRules.validateCollectionDateSection({
          wasteCollectionDate: s.wasteCollectionDate,
          estimatedOrActualCollectionDate: s.estimatedOrActualCollectionDate,
        });
        if (!collectionDate.valid) {
          collectionDate.value.map((e) => {
            fieldFormatErrors.push(e);
          });
        }

        const transport =
          !wasteDescription.valid ||
          (wasteDescription.valid &&
            wasteDescription.value.wasteCode.type !== 'NotApplicable');
        const carriers = validationRules.validateCarriersSection(
          {
            firstCarrierOrganisationName: s.firstCarrierOrganisationName,
            firstCarrierAddress: s.firstCarrierAddress,
            firstCarrierCountry: s.firstCarrierCountry,
            firstCarrierContactFullName: s.firstCarrierContactFullName,
            firstCarrierContactPhoneNumber: s.firstCarrierContactPhoneNumber,
            firstCarrierFaxNumber: s.firstCarrierFaxNumber,
            firstCarrierEmailAddress: s.firstCarrierEmailAddress,
            firstCarrierMeansOfTransport: s.firstCarrierMeansOfTransport,
            firstCarrierMeansOfTransportDetails:
              s.firstCarrierMeansOfTransportDetails,
            secondCarrierOrganisationName: s.secondCarrierOrganisationName,
            secondCarrierAddress: s.secondCarrierAddress,
            secondCarrierCountry: s.secondCarrierCountry,
            secondCarrierContactFullName: s.secondCarrierContactFullName,
            secondCarrierContactPhoneNumber: s.secondCarrierContactPhoneNumber,
            secondCarrierFaxNumber: s.secondCarrierFaxNumber,
            secondCarrierEmailAddress: s.secondCarrierEmailAddress,
            secondCarrierMeansOfTransport: s.secondCarrierMeansOfTransport,
            secondCarrierMeansOfTransportDetails:
              s.secondCarrierMeansOfTransportDetails,
            thirdCarrierOrganisationName: s.thirdCarrierOrganisationName,
            thirdCarrierAddress: s.thirdCarrierAddress,
            thirdCarrierCountry: s.thirdCarrierCountry,
            thirdCarrierContactFullName: s.thirdCarrierContactFullName,
            thirdCarrierContactPhoneNumber: s.thirdCarrierContactPhoneNumber,
            thirdCarrierFaxNumber: s.thirdCarrierFaxNumber,
            thirdCarrierEmailAddress: s.thirdCarrierEmailAddress,
            thirdCarrierMeansOfTransport: s.thirdCarrierMeansOfTransport,
            thirdCarrierMeansOfTransportDetails:
              s.thirdCarrierMeansOfTransportDetails,
            fourthCarrierOrganisationName: s.fourthCarrierOrganisationName,
            fourthCarrierAddress: s.fourthCarrierAddress,
            fourthCarrierCountry: s.fourthCarrierCountry,
            fourthCarrierContactFullName: s.fourthCarrierContactFullName,
            fourthCarrierContactPhoneNumber: s.fourthCarrierContactPhoneNumber,
            fourthCarrierFaxNumber: s.fourthCarrierFaxNumber,
            fourthCarrierEmailAddress: s.fourthCarrierEmailAddress,
            fourthCarrierMeansOfTransport: s.fourthCarrierMeansOfTransport,
            fourthCarrierMeansOfTransportDetails:
              s.fourthCarrierMeansOfTransportDetails,
            fifthCarrierOrganisationName: s.fifthCarrierOrganisationName,
            fifthCarrierAddress: s.fifthCarrierAddress,
            fifthCarrierCountry: s.fifthCarrierCountry,
            fifthCarrierContactFullName: s.fifthCarrierContactFullName,
            fifthCarrierContactPhoneNumber: s.fifthCarrierContactPhoneNumber,
            fifthCarrierFaxNumber: s.fifthCarrierFaxNumber,
            fifthCarrierEmailAddress: s.fifthCarrierEmailAddress,
            fifthCarrierMeansOfTransport: s.fifthCarrierMeansOfTransport,
            fifthCarrierMeansOfTransportDetails:
              s.fifthCarrierMeansOfTransportDetails,
          },
          transport,
          countryList,
          countryIncludingUkList
        );
        if (!carriers.valid) {
          carriers.value.map((e) => {
            fieldFormatErrors.push(e);
          });
        }

        const collectionDetail =
          validationRules.validateCollectionDetailSection({
            wasteCollectionOrganisationName: s.wasteCollectionOrganisationName,
            wasteCollectionAddressLine1: s.wasteCollectionAddressLine1,
            wasteCollectionAddressLine2: s.wasteCollectionAddressLine2,
            wasteCollectionTownOrCity: s.wasteCollectionTownOrCity,
            wasteCollectionCountry: s.wasteCollectionCountry,
            wasteCollectionPostcode: s.wasteCollectionPostcode,
            wasteCollectionContactFullName: s.wasteCollectionContactFullName,
            wasteCollectionContactPhoneNumber:
              s.wasteCollectionContactPhoneNumber,
            wasteCollectionFaxNumber: s.wasteCollectionFaxNumber,
            wasteCollectionEmailAddress: s.wasteCollectionEmailAddress,
          });
        if (!collectionDetail.valid) {
          collectionDetail.value.map((e) => {
            fieldFormatErrors.push(e);
          });
        }

        const ukExitLocation = validationRules.validateUkExitLocationSection({
          whereWasteLeavesUk: s.whereWasteLeavesUk,
        });
        if (!ukExitLocation.valid) {
          fieldFormatErrors.push(ukExitLocation.value);
        }

        const transitCountries =
          validationRules.validateTransitCountriesSection(
            {
              transitCountries: s.transitCountries,
            },
            countryList
          );
        if (!transitCountries.valid) {
          fieldFormatErrors.push(transitCountries.value);
        }

        if (importerDetail.valid && transitCountries.valid) {
          const crossSection =
            validationRules.validateImporterDetailAndTransitCountriesCrossSection(
              importerDetail.value,
              transitCountries.value
            );
          if (!crossSection.valid) {
            crossSection.value.map((e) => {
              invalidStructureErrors.push(e);
            });
          }
        }

        if (
          reference.valid &&
          wasteDescription.valid &&
          wasteQuantity.valid &&
          exporterDetail.valid &&
          importerDetail.valid &&
          collectionDate.valid &&
          carriers.valid &&
          collectionDetail.valid &&
          ukExitLocation.valid &&
          transitCountries.valid &&
          invalidStructureErrors.length === 0
        ) {
          submissions.push({
            reference: reference.value,
            wasteDescription: wasteDescription.value,
            wasteQuantity: wasteQuantity.value,
            exporterDetail: exporterDetail.value,
            importerDetail: importerDetail.value,
            collectionDate: collectionDate.value,
            carriers: carriers.value,
            collectionDetail: collectionDetail.value,
            ukExitLocation: ukExitLocation.value,
            transitCountries: transitCountries.value,
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
