import Boom from '@hapi/boom';
import { submission as api, common } from '@wts/api/green-list-waste-export';
import { fromBoom, success } from '@wts/util/invocation';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import {
  FieldFormatError,
  InvalidAttributeCombinationError,
  Value,
  Error,
  ValidationResult,
  RecoveryFacilityDetail,
  Submission,
  WasteQuantity,
} from '../../model';
import { validationRules } from '../../lib';
import {
  Country,
  RecoveryCode,
  WasteCode,
  WasteCodeType,
} from '@wts/api/reference-data';
import { CosmosRepository } from '../../data';
import { common as commonValidation } from '@wts/util/shared-validation';

export type Handler<Request, Response> = (
  request: Request,
) => Promise<Response>;

const draftContainerName = 'drafts';
const submissionContainerName = 'submissions';

export default class SubmissionController {
  constructor(
    private repository: CosmosRepository,
    private wasteCodeList: WasteCodeType[],
    private ewcCodeList: WasteCode[],
    private countryList: Country[],
    private countryIncludingUkList: Country[],
    private recoveryCodeList: RecoveryCode[],
    private disposalCodeList: WasteCode[],
    private logger: Logger,
  ) {}

  getSubmission: Handler<api.GetSubmissionRequest, api.GetSubmissionResponse> =
    async ({ id, accountId }) => {
      try {
        const submission = (await this.repository.getRecord(
          submissionContainerName,
          id,
          accountId,
        )) as api.Submission;
        if (submission.submissionState.status === 'Cancelled') {
          return fromBoom(Boom.notFound());
        }
        return success(submission);
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };

  getSubmissions: Handler<
    common.GetRecordsRequest,
    api.GetSubmissionsResponse
  > = async ({ accountId, order, pageLimit, state, token }) => {
    try {
      return success(
        await this.repository.getRecords(
          submissionContainerName,
          accountId,
          order,
          pageLimit,
          token,
          state,
        ),
      ) as api.GetSubmissionsResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getWasteQuantity: Handler<
    api.GetWasteQuantityRequest,
    api.GetWasteQuantityResponse
  > = async ({ id, accountId }) => {
    try {
      const submission = (await this.repository.getRecord(
        submissionContainerName,
        id,
        accountId,
      )) as Submission;
      return success(submission.wasteQuantity);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setWasteQuantity: Handler<
    api.SetWasteQuantityRequest,
    api.SetWasteQuantityResponse
  > = async ({ id, accountId, value }) => {
    try {
      const submission = (await this.repository.getRecord(
        submissionContainerName,
        id,
        accountId,
      )) as Submission;

      if (submission.submissionState.status !== 'SubmittedWithEstimates') {
        return success(undefined);
      }

      let volumeUnit: WasteQuantity['actualData']['unit'] = 'Cubic Metre';
      let wasteUnit: WasteQuantity['actualData']['unit'] = 'Tonne';

      if (submission.wasteDescription.wasteCode.type === 'NotApplicable') {
        volumeUnit = 'Litre';
        wasteUnit = 'Kilogram';
      }

      if (value.type === 'ActualData') {
        value.actualData.quantityType === 'Volume'
          ? (value.actualData.unit = volumeUnit)
          : value.actualData.quantityType === 'Weight'
            ? (value.actualData.unit = wasteUnit)
            : null;
      } else {
        value.estimateData.quantityType === 'Volume'
          ? (value.estimateData.unit = volumeUnit)
          : value.estimateData.quantityType === 'Weight'
            ? (value.estimateData.unit = wasteUnit)
            : null;
      }
      submission.wasteQuantity = value;

      submission.submissionState =
        submission.collectionDate.type === 'ActualDate' &&
        value.type === 'ActualData'
          ? { status: 'UpdatedWithActuals', timestamp: new Date() }
          : submission.submissionState;

      return success(
        await this.repository.saveRecord(
          submissionContainerName,
          { ...submission },
          accountId,
        ),
      );
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getCollectionDate: Handler<
    api.GetCollectionDateRequest,
    api.GetCollectionDateResponse
  > = async ({ id, accountId }) => {
    try {
      const submission = (await this.repository.getRecord(
        submissionContainerName,
        id,
        accountId,
      )) as Submission;
      return success(submission.collectionDate);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setCollectionDate: Handler<
    api.SetCollectionDateRequest,
    api.SetCollectionDateResponse
  > = async ({ id, accountId, value }) => {
    try {
      const date =
        value.type === 'ActualDate' ? value.actualDate : value.estimateDate;
      const dateValidationResult =
        commonValidation.commonValidationRules.validateCollectionDate(
          date.day,
          date.month,
          date.year,
        );

      if (!dateValidationResult.valid) {
        return fromBoom(
          Boom.badRequest('Validation failed', dateValidationResult.errors),
        );
      }

      const submission = (await this.repository.getRecord(
        submissionContainerName,
        id,
        accountId,
      )) as Submission;

      if (submission.submissionState.status !== 'SubmittedWithEstimates') {
        return success(undefined);
      }

      let collectionDate = value;
      if (value.type === 'ActualDate') {
        collectionDate = {
          type: value.type,
          actualDate: {
            day: value.actualDate.day?.padStart(2, '0'),
            month: value.actualDate.month?.padStart(2, '0'),
            year: value.actualDate.year,
          },
          estimateDate: submission.collectionDate.estimateDate,
        };
      } else {
        collectionDate = {
          type: value.type,
          estimateDate: {
            day: value.estimateDate.day?.padStart(2, '0'),
            month: value.estimateDate.month?.padStart(2, '0'),
            year: value.estimateDate.year,
          },
          actualDate: submission.collectionDate.actualDate,
        };
      }

      submission.collectionDate = collectionDate;

      submission.submissionState =
        submission.wasteQuantity.type === 'ActualData' &&
        value.type === 'ActualDate'
          ? { status: 'UpdatedWithActuals', timestamp: new Date() }
          : submission.submissionState;

      return success(
        await this.repository.saveRecord(
          submissionContainerName,
          { ...submission },
          accountId,
        ),
      );
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  cancelSubmission: Handler<
    api.CancelSubmissionRequest,
    api.CancelSubmissionResponse
  > = async ({ id, accountId, cancellationType }) => {
    try {
      const submission = (await this.repository.getRecord(
        submissionContainerName,
        id,
        accountId,
      )) as Submission;
      if (submission.submissionState.status === 'SubmittedWithEstimates') {
        const timestamp = new Date();
        submission.submissionState = {
          status: 'Cancelled',
          timestamp: timestamp,
          cancellationType: cancellationType,
        };
        await this.repository.saveRecord(
          submissionContainerName,
          { ...submission },
          accountId,
        );
      }
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getNumberOfSubmissions: Handler<
    api.GetNumberOfSubmissionsRequest,
    api.GetNumberOfSubmissionsResponse
  > = async ({ accountId }) => {
    try {
      const completedWithActuals = await this.repository.getTotalNumber(
        submissionContainerName,
        accountId,
        false,
      );
      const completedWithEstimates = await this.repository.getTotalNumber(
        submissionContainerName,
        accountId,
        true,
      );
      const incomplete = await this.repository.getTotalNumber(
        draftContainerName,
        accountId,
      );
      return success({
        completedWithActuals,
        completedWithEstimates,
        incomplete,
      }) as api.GetNumberOfSubmissionsResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

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
        const reference = validationRules.validateCustomerReferenceSection({
          reference: s.reference,
        });
        const fieldFormatErrors: FieldFormatError[] = [];
        if (!reference.valid) {
          fieldFormatErrors.push(reference.value);
        }

        const wasteCodeSubSection = validationRules.validateWasteCodeSubSection(
          {
            baselAnnexIXCode: s.baselAnnexIXCode,
            oecdCode: s.oecdCode,
            annexIIIACode: s.annexIIIACode,
            annexIIIBCode: s.annexIIIBCode,
            laboratory: s.laboratory,
          },
          this.wasteCodeList,
        );
        if (!wasteCodeSubSection.valid) {
          fieldFormatErrors.push(wasteCodeSubSection.value);
        }

        const wasteDescriptionSubSection =
          validationRules.validateWasteDescriptionSubSection(
            {
              ewcCodes: s.ewcCodes,
              nationalCode: s.nationalCode,
              wasteDescription: s.wasteDescription,
            },
            this.ewcCodeList,
          );
        if (!wasteDescriptionSubSection.valid) {
          fieldFormatErrors.push(...wasteDescriptionSubSection.value);
        }

        const wasteQuantity = validationRules.validateWasteQuantitySection({
          wasteQuantityTonnes: s.wasteQuantityTonnes,
          wasteQuantityCubicMetres: s.wasteQuantityCubicMetres,
          wasteQuantityKilograms: s.wasteQuantityKilograms,
          estimatedOrActualWasteQuantity: s.estimatedOrActualWasteQuantity,
        });
        if (!wasteQuantity.valid) {
          fieldFormatErrors.push(...wasteQuantity.value);
        }

        const invalidStructureErrors: InvalidAttributeCombinationError[] = [];
        if (wasteCodeSubSection.valid && wasteQuantity.valid) {
          const crossSection =
            validationRules.validateWasteCodeSubSectionAndQuantityCrossSection(
              wasteCodeSubSection.value,
              wasteQuantity.value,
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
          fieldFormatErrors.push(...exporterDetail.value);
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
          this.countryList,
        );
        if (!importerDetail.valid) {
          fieldFormatErrors.push(...importerDetail.value);
        }

        const collectionDate = validationRules.validateCollectionDateSection({
          wasteCollectionDate: s.wasteCollectionDate,
          estimatedOrActualCollectionDate: s.estimatedOrActualCollectionDate,
        });
        if (!collectionDate.valid) {
          fieldFormatErrors.push(...collectionDate.value);
        }

        const transport =
          !wasteCodeSubSection.valid ||
          (wasteCodeSubSection.valid &&
            wasteCodeSubSection.value.type !== 'NotApplicable');
        const carriersFlattened = {
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
        };
        const carriers = validationRules.validateCarriersSection(
          carriersFlattened,
          transport,
          this.countryIncludingUkList,
        );
        if (!carriers.valid) {
          fieldFormatErrors.push(...carriers.value);
        }

        if (wasteCodeSubSection.valid) {
          const crossSection =
            validationRules.validateWasteCodeSubSectionAndCarriersCrossSection(
              wasteCodeSubSection.value,
              carriersFlattened,
            );
          if (!crossSection.valid) {
            invalidStructureErrors.push(...crossSection.value);
          }
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
          fieldFormatErrors.push(...collectionDetail.value);
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
            this.countryList,
          );
        if (!transitCountries.valid) {
          fieldFormatErrors.push(transitCountries.value);
        }

        if (importerDetail.valid && transitCountries.valid) {
          const crossSection =
            validationRules.validateImporterDetailAndTransitCountriesCrossSection(
              importerDetail.value,
              transitCountries.value,
            );
          if (!crossSection.valid) {
            invalidStructureErrors.push(...crossSection.value);
          }
        }

        let recoveryFacilityDetail:
          | { valid: false; value: FieldFormatError[] }
          | { valid: true; value: RecoveryFacilityDetail[] } = {
          valid: false,
          value: [],
        };
        if (wasteCodeSubSection.valid) {
          const recoveryFacilityDetailFlattened = {
            interimSiteOrganisationName: s.interimSiteOrganisationName,
            interimSiteAddress: s.interimSiteAddress,
            interimSiteCountry: s.interimSiteCountry,
            interimSiteContactFullName: s.interimSiteContactFullName,
            interimSiteContactPhoneNumber: s.interimSiteContactPhoneNumber,
            interimSiteFaxNumber: s.interimSiteFaxNumber,
            interimSiteEmailAddress: s.interimSiteEmailAddress,
            interimSiteRecoveryCode: s.interimSiteRecoveryCode,
            laboratoryOrganisationName: s.laboratoryOrganisationName,
            laboratoryAddress: s.laboratoryAddress,
            laboratoryCountry: s.laboratoryCountry,
            laboratoryContactFullName: s.laboratoryContactFullName,
            laboratoryContactPhoneNumber: s.laboratoryContactPhoneNumber,
            laboratoryFaxNumber: s.laboratoryFaxNumber,
            laboratoryEmailAddress: s.laboratoryEmailAddress,
            laboratoryDisposalCode: s.laboratoryDisposalCode,
            firstRecoveryFacilityOrganisationName:
              s.firstRecoveryFacilityOrganisationName,
            firstRecoveryFacilityAddress: s.firstRecoveryFacilityAddress,
            firstRecoveryFacilityCountry: s.firstRecoveryFacilityCountry,
            firstRecoveryFacilityContactFullName:
              s.firstRecoveryFacilityContactFullName,
            firstRecoveryFacilityContactPhoneNumber:
              s.firstRecoveryFacilityContactPhoneNumber,
            firstRecoveryFacilityFaxNumber: s.firstRecoveryFacilityFaxNumber,
            firstRecoveryFacilityEmailAddress:
              s.firstRecoveryFacilityEmailAddress,
            firstRecoveryFacilityRecoveryCode:
              s.firstRecoveryFacilityRecoveryCode,
            secondRecoveryFacilityOrganisationName:
              s.secondRecoveryFacilityOrganisationName,
            secondRecoveryFacilityAddress: s.secondRecoveryFacilityAddress,
            secondRecoveryFacilityCountry: s.secondRecoveryFacilityCountry,
            secondRecoveryFacilityContactFullName:
              s.secondRecoveryFacilityContactFullName,
            secondRecoveryFacilityContactPhoneNumber:
              s.secondRecoveryFacilityContactPhoneNumber,
            secondRecoveryFacilityFaxNumber: s.secondRecoveryFacilityFaxNumber,
            secondRecoveryFacilityEmailAddress:
              s.secondRecoveryFacilityEmailAddress,
            secondRecoveryFacilityRecoveryCode:
              s.secondRecoveryFacilityRecoveryCode,
            thirdRecoveryFacilityOrganisationName:
              s.thirdRecoveryFacilityOrganisationName,
            thirdRecoveryFacilityAddress: s.thirdRecoveryFacilityAddress,
            thirdRecoveryFacilityCountry: s.thirdRecoveryFacilityCountry,
            thirdRecoveryFacilityContactFullName:
              s.thirdRecoveryFacilityContactFullName,
            thirdRecoveryFacilityContactPhoneNumber:
              s.thirdRecoveryFacilityContactPhoneNumber,
            thirdRecoveryFacilityFaxNumber: s.thirdRecoveryFacilityFaxNumber,
            thirdRecoveryFacilityEmailAddress:
              s.thirdRecoveryFacilityEmailAddress,
            thirdRecoveryFacilityRecoveryCode:
              s.thirdRecoveryFacilityRecoveryCode,
            fourthRecoveryFacilityOrganisationName:
              s.fourthRecoveryFacilityOrganisationName,
            fourthRecoveryFacilityAddress: s.fourthRecoveryFacilityAddress,
            fourthRecoveryFacilityCountry: s.fourthRecoveryFacilityCountry,
            fourthRecoveryFacilityContactFullName:
              s.fourthRecoveryFacilityContactFullName,
            fourthRecoveryFacilityContactPhoneNumber:
              s.fourthRecoveryFacilityContactPhoneNumber,
            fourthRecoveryFacilityFaxNumber: s.fourthRecoveryFacilityFaxNumber,
            fourthRecoveryFacilityEmailAddress:
              s.fourthRecoveryFacilityEmailAddress,
            fourthRecoveryFacilityRecoveryCode:
              s.fourthRecoveryFacilityRecoveryCode,
            fifthRecoveryFacilityOrganisationName:
              s.fifthRecoveryFacilityOrganisationName,
            fifthRecoveryFacilityAddress: s.fifthRecoveryFacilityAddress,
            fifthRecoveryFacilityCountry: s.fifthRecoveryFacilityCountry,
            fifthRecoveryFacilityContactFullName:
              s.fifthRecoveryFacilityContactFullName,
            fifthRecoveryFacilityContactPhoneNumber:
              s.fifthRecoveryFacilityContactPhoneNumber,
            fifthRecoveryFacilityFaxNumber: s.fifthRecoveryFacilityFaxNumber,
            fifthRecoveryFacilityEmailAddress:
              s.fifthRecoveryFacilityEmailAddress,
            fifthRecoveryFacilityRecoveryCode:
              s.fifthRecoveryFacilityRecoveryCode,
          };
          recoveryFacilityDetail =
            validationRules.validateRecoveryFacilityDetailSection(
              recoveryFacilityDetailFlattened,
              wasteCodeSubSection.value.type === 'NotApplicable',
              this.countryList,
              this.recoveryCodeList,
              this.disposalCodeList,
            );

          if (!recoveryFacilityDetail.valid) {
            fieldFormatErrors.push(...recoveryFacilityDetail.value);
          }

          const crossSection =
            validationRules.validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
              wasteCodeSubSection.value,
              recoveryFacilityDetailFlattened,
            );
          if (!crossSection.valid) {
            invalidStructureErrors.push(...crossSection.value);
          }
        }

        if (
          reference.valid &&
          wasteCodeSubSection.valid &&
          wasteDescriptionSubSection.valid &&
          wasteQuantity.valid &&
          exporterDetail.valid &&
          importerDetail.valid &&
          collectionDate.valid &&
          carriers.valid &&
          collectionDetail.valid &&
          ukExitLocation.valid &&
          transitCountries.valid &&
          recoveryFacilityDetail.valid &&
          invalidStructureErrors.length === 0
        ) {
          submissions.push({
            reference: reference.value,
            wasteDescription: {
              wasteCode: wasteCodeSubSection.value,
              ewcCodes: wasteDescriptionSubSection.value.ewcCodes,
              nationalCode: wasteDescriptionSubSection.value.nationalCode,
              description: wasteDescriptionSubSection.value.description,
            },
            wasteQuantity: wasteQuantity.value,
            exporterDetail: exporterDetail.value,
            importerDetail: importerDetail.value,
            collectionDate: collectionDate.value,
            carriers: carriers.value,
            collectionDetail: collectionDetail.value,
            ukExitLocation: ukExitLocation.value,
            transitCountries: transitCountries.value,
            recoveryFacilityDetail: recoveryFacilityDetail.value,
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
        const submissionState: Submission['submissionState'] = {
          status:
            s.wasteQuantity.type == 'ActualData' &&
            s.collectionDate.type == 'ActualDate'
              ? 'SubmittedWithActuals'
              : 'SubmittedWithEstimates',
          timestamp: new Date(),
        };
        return {
          id,
          ...s,
          submissionDeclaration: {
            declarationTimestamp: new Date(),
            transactionId:
              timestamp.getFullYear().toString().substring(2) +
              (timestamp.getMonth() + 1).toString().padStart(2, '0') +
              '_' +
              id.substring(0, 8).toUpperCase(),
          },
          submissionState,
        };
      });

      await this.repository.createBulkRecords(
        submissionContainerName,
        accountId,
        submissions,
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

  getBulkSubmissions: Handler<
    api.GetBulkSubmissionsRequest,
    api.GetBulkSubmissionsResponse
  > = async ({ accountId, submissionIds }) => {
    try {
      const submissions = await this.repository.getRecords(
        submissionContainerName,
        accountId,
        'DESC',
        -1,
        '',
        [
          'SubmittedWithEstimates',
          'SubmittedWithActuals',
          'UpdatedWithActuals',
        ],
        submissionIds,
        true,
      );
      return success(submissions.values as Submission[]);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
