import Boom from '@hapi/boom';
import { common, draft as api } from '@wts/api/green-list-waste-export';
import { fromBoom, success } from '@wts/util/invocation';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import {
  DraftCarrier,
  DraftCarrierPartial,
  DraftCarriers,
  DraftRecoveryFacility,
  DraftRecoveryFacilityDetails,
  DraftRecoveryFacilityPartial,
  DraftSubmission,
  FieldFormatError,
  RecordState,
  RecoveryFacilityDetail,
  Submission,
  WasteQuantity,
} from '../../model';
import {
  isWasteCodeChangingBulkToBulkDifferentType,
  isWasteCodeChangingBulkToBulkSameType,
  isWasteCodeChangingBulkToSmall,
  isWasteCodeChangingSmallToBulk,
  setBaseWasteDescription,
  setSubmissionConfirmationStatus,
  setSubmissionDeclarationStatus,
} from '../../lib';
import { CosmosRepository } from '../../data';
import {
  common as commonValidation,
  glwe as glweValidation,
} from '@wts/util/shared-validation';
import {
  Country,
  WasteCode,
  WasteCodeType,
  RecoveryCode,
} from '@wts/api/reference-data';

export type Handler<Request, Response> = (
  request: Request,
) => Promise<Response>;

const locale = 'en';
const context = 'api';

const draftContainerName = 'drafts';
const submissionContainerName = 'submissions';

export default class DraftController {
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

  getDraft: Handler<api.GetDraftRequest, api.GetDraftResponse> = async ({
    id,
    accountId,
  }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as api.DraftSubmission;
      if (
        draft.submissionState.status === 'Cancelled' ||
        draft.submissionState.status === 'Deleted'
      ) {
        return fromBoom(Boom.notFound());
      }
      return success(draft);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDrafts: Handler<common.GetRecordsRequest, api.GetDraftsResponse> = async ({
    accountId,
    order,
    pageLimit,
    state,
    token,
  }) => {
    try {
      return success(
        await this.repository.getRecords(
          draftContainerName,
          accountId,
          order,
          pageLimit,
          token,
          state,
        ),
      ) as api.GetDraftsResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createDraft: Handler<api.CreateDraftRequest, api.CreateDraftResponse> =
    async ({ accountId, reference }) => {
      try {
        const referenceValidationResult =
          glweValidation.validationRules.validateReference(reference);

        if (!referenceValidationResult.valid) {
          const boom = Boom.badRequest(
            'Validation failed',
            referenceValidationResult.errors,
          );
          return fromBoom(boom);
        }

        const value: DraftSubmission = {
          id: uuidv4(),
          reference,
          wasteDescription: { status: 'NotStarted' },
          wasteQuantity: { status: 'CannotStart' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: {
            status: 'NotStarted',
            transport: true,
          },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'CannotStart' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: new Date(),
          },
        };

        await this.repository.saveRecord(draftContainerName, value, accountId);
        return success(value);
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };

  deleteDraft: Handler<api.DeleteDraftRequest, api.DeleteDraftResponse> =
    async ({ id, accountId }) => {
      try {
        const draft = (await this.repository.getRecord(
          draftContainerName,
          id,
          accountId,
        )) as DraftSubmission;
        if (draft.submissionState.status === 'InProgress') {
          draft.submissionState = { status: 'Deleted', timestamp: new Date() };

          await this.repository.saveRecord(
            draftContainerName,
            { ...draft },
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

  getDraftCustomerReference: Handler<
    api.GetDraftCustomerReferenceRequest,
    api.GetDraftCustomerReferenceResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      return success(draft.reference);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftCustomerReference: Handler<
    api.SetDraftCustomerReferenceRequest,
    api.SetDraftCustomerReferenceResponse
  > = async ({ id, accountId, reference }) => {
    try {
      const referenceValidationResult =
        glweValidation.validationRules.validateReference(reference);

      if (!referenceValidationResult.valid) {
        const boom = Boom.badRequest(
          'Validation failed',
          referenceValidationResult.errors,
        );
        return fromBoom(boom);
      }

      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;

      draft.reference = reference;

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);
      draft.submissionState.timestamp = new Date();

      await this.repository.saveRecord(
        draftContainerName,
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

  getDraftWasteDescription: Handler<
    api.GetDraftWasteDescriptionRequest,
    api.GetDraftWasteDescriptionResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      return success(draft.wasteDescription);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftWasteDescription: Handler<
    api.SetDraftWasteDescriptionRequest,
    api.SetDraftWasteDescriptionResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status !== 'NotStarted') {
        const errors = {
          fieldFormatErrors: [] as FieldFormatError[],
        };
        if (value.wasteCode) {
          if (
            value.status === 'Complete' &&
            value.wasteCode.type !== 'NotApplicable' &&
            !('code' in value.wasteCode)
          ) {
            const wasteCodeValidationResult =
              glweValidation.validationRules.validateWasteCode(
                '',
                value.wasteCode.type,
                this.wasteCodeList,
              );
            if (!wasteCodeValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...wasteCodeValidationResult.errors.fieldFormatErrors,
              );
            } else {
              value.wasteCode = wasteCodeValidationResult.value;
            }
          } else if (
            'code' in value.wasteCode &&
            typeof value.wasteCode.code === 'string'
          ) {
            const wasteCodeValidationResult =
              glweValidation.validationRules.validateWasteCode(
                value.wasteCode.code,
                value.wasteCode.type,
                this.wasteCodeList,
              );

            if (!wasteCodeValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...wasteCodeValidationResult.errors.fieldFormatErrors,
              );
            } else {
              value.wasteCode = wasteCodeValidationResult.value;
            }
          } else {
            value.wasteCode = {
              type: value.wasteCode.type,
            };
          }
        }

        if (value.ewcCodes) {
          const ewcCodesValidationResult =
            glweValidation.validationRules.validateEwcCodes(
              value.ewcCodes.map((e) => e.code),
              this.ewcCodeList,
            );

          if (!ewcCodesValidationResult.valid) {
            errors.fieldFormatErrors.push(
              ...ewcCodesValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.ewcCodes = ewcCodesValidationResult.value;
          }
        }

        if (value.nationalCode) {
          const nationalCodeValidationResult =
            glweValidation.validationRules.validateNationalCode(
              value.nationalCode.provided === 'Yes'
                ? value.nationalCode.value
                : undefined,
            );

          if (!nationalCodeValidationResult.valid) {
            errors.fieldFormatErrors.push(
              ...nationalCodeValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.nationalCode = nationalCodeValidationResult.value;
          }
        }

        if (value.description) {
          const descriptionValidationResult =
            glweValidation.validationRules.validateWasteDecription(
              value.description,
            );

          if (!descriptionValidationResult.valid) {
            errors.fieldFormatErrors.push(
              ...descriptionValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.description = descriptionValidationResult.value;
          }
        }

        if (errors.fieldFormatErrors.length > 0) {
          return fromBoom(Boom.badRequest('Validation failed', errors));
        }
      }

      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;

      let wasteQuantity: DraftSubmission['wasteQuantity'] = draft.wasteQuantity;

      if (
        wasteQuantity.status === 'CannotStart' &&
        (value.status === 'Started' || value.status === 'Complete')
      ) {
        wasteQuantity = { status: 'NotStarted' };
      }

      if (isWasteCodeChangingBulkToSmall(draft.wasteDescription, value)) {
        wasteQuantity = { status: 'NotStarted' };
      }

      if (isWasteCodeChangingSmallToBulk(draft.wasteDescription, value)) {
        wasteQuantity = { status: 'NotStarted' };
      }

      if (
        isWasteCodeChangingBulkToBulkDifferentType(
          draft.wasteDescription,
          value,
        )
      ) {
        wasteQuantity = { status: 'NotStarted' };
      }

      if (
        isWasteCodeChangingBulkToBulkSameType(draft.wasteDescription, value)
      ) {
        if (
          draft.wasteQuantity.status !== 'CannotStart' &&
          draft.wasteQuantity.status !== 'NotStarted'
        ) {
          wasteQuantity = {
            status: 'Started',
            value: draft.wasteQuantity.value,
          };
        }
      }

      const submissionBase = setBaseWasteDescription(
        draft.wasteDescription,
        draft.carriers,
        draft.recoveryFacilityDetail,
        value,
      );

      draft.wasteDescription = submissionBase.wasteDescription;
      draft.carriers = submissionBase.carriers;
      draft.recoveryFacilityDetail = submissionBase.recoveryFacilityDetail;
      draft.wasteQuantity = wasteQuantity;

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);
      draft.submissionState.timestamp = new Date();

      await this.repository.saveRecord(
        draftContainerName,
        {
          ...draft,
        },
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

  getDraftWasteQuantity: Handler<
    api.GetDraftWasteQuantityRequest,
    api.GetDraftWasteQuantityResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      return success(draft.wasteQuantity);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftWasteQuantity: Handler<
    api.SetDraftWasteQuantityRequest,
    api.SetDraftWasteQuantityResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (
        (value.status === 'Started' || value.status === 'Complete') &&
        value.value?.type !== 'NotApplicable'
      ) {
        const wasteQuantity =
          value.value?.type === 'ActualData'
            ? value.value.actualData
            : value.value?.type === 'EstimateData'
              ? value.value.estimateData
              : undefined;

        if (
          wasteQuantity &&
          wasteQuantity.value !== undefined &&
          wasteQuantity.value !== null
        ) {
          const wasteQuantityValidationResult =
            glweValidation.validationRules.validateWasteQuantity(
              wasteQuantity.quantityType!,
              wasteQuantity.unit!,
              wasteQuantity.value,
            );

          if (!wasteQuantityValidationResult.valid) {
            const boom = Boom.badRequest(
              'Validation failed',
              wasteQuantityValidationResult.errors,
            );
            return fromBoom(boom);
          }
        }
      }
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;

      if (
        draft.wasteDescription.status !== 'NotStarted' &&
        value.status !== 'CannotStart' &&
        value.status !== 'NotStarted'
      ) {
        let volumeUnit: WasteQuantity['actualData']['unit'] = 'Cubic Metre';
        let wasteUnit: WasteQuantity['actualData']['unit'] = 'Tonne';

        if (draft.wasteDescription.wasteCode?.type === 'NotApplicable') {
          volumeUnit = 'Litre';
          wasteUnit = 'Kilogram';
        }

        if (value.value?.type === 'ActualData') {
          value.value?.actualData?.quantityType === 'Volume'
            ? (value.value.actualData.unit = volumeUnit)
            : value.value.actualData?.quantityType === 'Weight'
              ? (value.value.actualData.unit = wasteUnit)
              : null;
        } else if (value.value?.type === 'EstimateData') {
          value.value?.estimateData?.quantityType === 'Volume'
            ? (value.value.estimateData.unit = volumeUnit)
            : value.value.estimateData?.quantityType === 'Weight'
              ? (value.value.estimateData.unit = wasteUnit)
              : null;
        }
      }

      let wasteQuantity = value;
      if (
        value.status !== 'CannotStart' &&
        value.status !== 'NotStarted' &&
        value.value &&
        value.value.type &&
        value.value.type !== 'NotApplicable' &&
        draft.wasteQuantity.status !== 'CannotStart' &&
        draft.wasteQuantity.status !== 'NotStarted' &&
        draft.wasteQuantity.value &&
        draft.wasteQuantity.value.type &&
        draft.wasteQuantity.value.type !== 'NotApplicable'
      ) {
        if (
          value.value.type === 'ActualData' &&
          draft.wasteQuantity.value.estimateData
        ) {
          wasteQuantity = {
            status: value.status,
            value: {
              type: value.value.type,
              actualData: value.value.actualData ?? {},
              estimateData: draft.wasteQuantity.value.estimateData,
            },
          };
        }

        if (
          value.value.type === 'EstimateData' &&
          draft.wasteQuantity.value.actualData
        ) {
          wasteQuantity = {
            status: value.status,
            value: {
              type: value.value.type,
              actualData: draft.wasteQuantity.value.actualData,
              estimateData: value.value.estimateData ?? {},
            },
          };
        }
      }

      draft.wasteQuantity = wasteQuantity;

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);
      draft.submissionState.timestamp = new Date();

      if (
        draft.wasteDescription.status !== 'NotStarted' &&
        draft.wasteQuantity.status !== 'NotStarted' &&
        draft.wasteQuantity.status !== 'CannotStart' &&
        draft.wasteQuantity.value?.type !== 'NotApplicable'
      ) {
        const wasteQuantityCrossSectionValidationResult =
          glweValidation.validationRules.validateWasteCodeSubSectionAndQuantityCrossSection(
            draft.wasteDescription.wasteCode,
            draft.wasteQuantity.value,
          );

        if (!wasteQuantityCrossSectionValidationResult.valid) {
          const boom = Boom.badRequest(
            'Validation failed',
            wasteQuantityCrossSectionValidationResult.errors,
          );
          return fromBoom(boom);
        }
      }

      return success(
        await this.repository.saveRecord(
          draftContainerName,
          { ...draft },
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

  getDraftExporterDetail: Handler<
    api.GetDraftExporterDetailRequest,
    api.GetDraftExporterDetailResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      return success(draft.exporterDetail);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftExporterDetail: Handler<
    api.SetDraftExporterDetailRequest,
    api.SetDraftExporterDetailResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status !== 'NotStarted') {
        const section = 'ExporterDetail';
        const errors: FieldFormatError[] = [];
        if (value.exporterAddress) {
          const addressLine1ValidationResult =
            glweValidation.validationRules.validateAddressLine1(
              value.exporterAddress.addressLine1,
              section,
              locale,
              context,
            );

          if (!addressLine1ValidationResult.valid) {
            errors.push(
              ...addressLine1ValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.exporterAddress.addressLine1 =
              addressLine1ValidationResult.value;
          }

          const addressLine2ValidationResult =
            glweValidation.validationRules.validateAddressLine2(
              value.exporterAddress.addressLine2,
              section,
              locale,
              context,
            );

          if (!addressLine2ValidationResult.valid) {
            errors.push(
              ...addressLine2ValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.exporterAddress.addressLine2 =
              addressLine2ValidationResult.value;
          }

          const townOrCityValidationResult =
            glweValidation.validationRules.validateTownOrCity(
              value.exporterAddress.townCity,
              section,
              locale,
              context,
            );

          if (!townOrCityValidationResult.valid) {
            errors.push(...townOrCityValidationResult.errors.fieldFormatErrors);
          } else {
            value.exporterAddress.townCity = townOrCityValidationResult.value;
          }

          const postcodeValidationResult =
            glweValidation.validationRules.validatePostcode(
              value.exporterAddress.postcode,
              section,
              locale,
              context,
            );

          if (!postcodeValidationResult.valid) {
            errors.push(...postcodeValidationResult.errors.fieldFormatErrors);
          } else {
            value.exporterAddress.postcode = postcodeValidationResult.value;
          }

          const countryValidationResult =
            glweValidation.validationRules.validateCountry(
              value.exporterAddress.country,
              section,
              locale,
              context,
            );

          if (!countryValidationResult.valid) {
            errors.push(...countryValidationResult.errors.fieldFormatErrors);
          } else {
            value.exporterAddress.country = countryValidationResult.value;
          }
        }

        if (value.exporterContactDetails) {
          const organisationNameValidationResult =
            glweValidation.validationRules.validateOrganisationName(
              value.exporterContactDetails.organisationName,
              section,
              locale,
              context,
            );

          if (!organisationNameValidationResult.valid) {
            errors.push(
              ...organisationNameValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.exporterContactDetails.organisationName =
              organisationNameValidationResult.value;
          }

          const fullNameValidationResult =
            glweValidation.validationRules.validateFullName(
              value.exporterContactDetails.fullName,
              section,
              locale,
              context,
            );

          if (!fullNameValidationResult.valid) {
            errors.push(...fullNameValidationResult.errors.fieldFormatErrors);
          } else {
            value.exporterContactDetails.fullName =
              fullNameValidationResult.value;
          }

          const emailAddressValidationResult =
            glweValidation.validationRules.validateEmailAddress(
              value.exporterContactDetails.emailAddress,
              section,
              locale,
              context,
            );

          if (!emailAddressValidationResult.valid) {
            errors.push(
              ...emailAddressValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.exporterContactDetails.emailAddress =
              emailAddressValidationResult.value;
          }

          const phoneNumberValidationResult =
            glweValidation.validationRules.validatePhoneNumber(
              value.exporterContactDetails.phoneNumber,
              section,
              locale,
              context,
            );

          if (!phoneNumberValidationResult.valid) {
            errors.push(
              ...phoneNumberValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.exporterContactDetails.phoneNumber =
              phoneNumberValidationResult.value;
          }

          const faxNumberValidationResult =
            glweValidation.validationRules.validateFaxNumber(
              value.exporterContactDetails.faxNumber,
              section,
              locale,
              context,
            );

          if (!faxNumberValidationResult.valid) {
            errors.push(...faxNumberValidationResult.errors.fieldFormatErrors);
          } else {
            value.exporterContactDetails.faxNumber =
              faxNumberValidationResult.value;
          }
        }

        if (errors.length > 0) {
          return fromBoom(Boom.badRequest('Validation failed', errors));
        }
      }

      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;

      draft.exporterDetail = value;

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);
      draft.submissionState.timestamp = new Date();

      await this.repository.saveRecord(
        draftContainerName,
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

  getDraftImporterDetail: Handler<
    api.GetDraftImporterDetailRequest,
    api.GetDraftImporterDetailResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      return success(draft.importerDetail);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftImporterDetail: Handler<
    api.SetDraftImporterDetailRequest,
    api.SetDraftImporterDetailResponse
  > = async ({ id, accountId, value }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;

      if (
        (draft.transitCountries.status === 'Complete' ||
          draft.transitCountries.status === 'Started') &&
        (value.status === 'Complete' || value.status === 'Started')
      ) {
        const transitCountriesCrossValidationResult =
          glweValidation.validationRules.validateImporterDetailAndTransitCountriesCross(
            value,
            draft.transitCountries.values,
          );
        if (!transitCountriesCrossValidationResult.valid) {
          const boom = Boom.badRequest(
            'Validation failed',
            transitCountriesCrossValidationResult.errors,
          );
          return fromBoom(boom);
        }
      }

      draft.importerDetail = value;

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);
      draft.submissionState.timestamp = new Date();

      await this.repository.saveRecord(
        draftContainerName,
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

  getDraftCollectionDate: Handler<
    api.GetDraftCollectionDateRequest,
    api.GetDraftCollectionDateResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      return success(draft.collectionDate);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftCollectionDate: Handler<
    api.SetDraftCollectionDateRequest,
    api.SetDraftCollectionDateResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status !== 'NotStarted') {
        const date =
          value.value.type === 'ActualDate'
            ? value.value.actualDate
            : value.value.estimateDate;
        const collectionDateValidationResult =
          commonValidation.commonValidationRules.validateCollectionDate(
            date.day,
            date.month,
            date.year,
          );

        if (!collectionDateValidationResult.valid) {
          return fromBoom(
            Boom.badRequest(
              'Validation failed',
              collectionDateValidationResult.errors,
            ),
          );
        }
      }
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;

      let collectionDate = value;
      if (
        value.status !== 'NotStarted' &&
        draft.collectionDate.status !== 'NotStarted'
      ) {
        if (value.value.type === 'ActualDate') {
          collectionDate = {
            status: value.status,
            value: {
              type: value.value.type,
              actualDate: {
                day: value.value.actualDate.day?.padStart(2, '0'),
                month: value.value.actualDate.month?.padStart(2, '0'),
                year: value.value.actualDate.year,
              },
              estimateDate: draft.collectionDate.value.estimateDate,
            },
          };
        } else {
          collectionDate = {
            status: value.status,
            value: {
              type: value.value.type,
              estimateDate: {
                day: value.value.estimateDate.day?.padStart(2, '0'),
                month: value.value.estimateDate.month?.padStart(2, '0'),
                year: value.value.estimateDate.year,
              },
              actualDate: draft.collectionDate.value.actualDate,
            },
          };
        }
      }

      draft.collectionDate = collectionDate;

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);
      draft.submissionState.timestamp = new Date();

      return success(
        await this.repository.saveRecord(
          draftContainerName,
          { ...draft },
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

  listDraftCarriers: Handler<
    api.ListDraftCarriersRequest,
    api.ListDraftCarriersResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      return success(draft.carriers);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDraftCarriers: Handler<
    api.GetDraftCarriersRequest,
    api.GetDraftCarriersResponse
  > = async ({ id, accountId, carrierId }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      if (draft.carriers.status === 'NotStarted') {
        return fromBoom(Boom.notFound());
      }

      const carrier = draft.carriers.values.find((c) => {
        return c.id === carrierId;
      });

      if (carrier === undefined) {
        return fromBoom(Boom.notFound());
      }

      const value: DraftCarriers =
        draft.carriers.status !== 'Complete'
          ? {
              status: draft.carriers.status,
              transport: draft.carriers.transport,
              values: [carrier as DraftCarrierPartial],
            }
          : {
              status: draft.carriers.status,
              transport: draft.carriers.transport,
              values: [carrier as DraftCarrier],
            };

      return success(value);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createDraftCarriers: Handler<
    api.CreateDraftCarriersRequest,
    api.CreateDraftCarriersResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status !== 'Started') {
        return fromBoom(
          Boom.badRequest(
            `"Status cannot be ${value.status} on carrier detail creation"`,
          ),
        );
      }

      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      if (draft === undefined) {
        return fromBoom(Boom.notFound());
      }

      if (draft.carriers.status !== 'NotStarted') {
        if (
          draft.carriers.values.length ===
          glweValidation.constraints.CarrierLength.max
        ) {
          return fromBoom(
            Boom.badRequest(
              `Cannot add more than ${glweValidation.constraints.CarrierLength.max} carriers`,
            ),
          );
        }
      }

      draft.carriers.transport =
        draft.wasteDescription.status !== 'NotStarted' &&
        draft.wasteDescription.wasteCode?.type === 'NotApplicable'
          ? false
          : true;

      const uuid = uuidv4();

      if (draft.carriers.status === 'NotStarted') {
        draft.carriers = {
          status: 'Started',
          transport: draft.carriers.transport,
          values: [{ id: uuid }],
        };
      } else {
        const carriers: DraftCarrierPartial[] = [];
        for (const c of draft.carriers.values) {
          carriers.push(c);
        }
        carriers.push({ id: uuid });

        draft.carriers = {
          status: 'Started',
          transport: draft.carriers.transport,
          values: carriers,
        };
      }

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);
      draft.submissionState.timestamp = new Date();

      await this.repository.saveRecord(
        draftContainerName,
        { ...draft },
        accountId,
      );

      return success({
        status: value.status,
        transport: draft.carriers.transport,
        values: [{ id: uuid }],
      });
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftCarriers: Handler<
    api.SetDraftCarriersRequest,
    api.SetDraftCarriersResponse
  > = async ({ id, accountId, carrierId, value }) => {
    try {
      if (value.status !== 'NotStarted') {
        const errors = {
          fieldFormatErrors: [] as FieldFormatError[],
        };
        let index = 0;
        value.values.forEach((v) => {
          const section = 'Carriers';
          index += 1;
          if (v.addressDetails) {
            const organisationNameValidationResult =
              glweValidation.validationRules.validateOrganisationName(
                v.addressDetails.organisationName,
                section,
                locale,
                context,
                index,
              );

            if (!organisationNameValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...organisationNameValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.addressDetails.organisationName =
                organisationNameValidationResult.value;
            }

            const addressValidationResult =
              glweValidation.validationRules.validateAddress(
                v.addressDetails.address,
                section,
                locale,
                context,
                index,
              );

            if (!addressValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...addressValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.addressDetails.address = addressValidationResult.value;
            }

            const countryValidationResult =
              glweValidation.validationRules.validateCountry(
                v.addressDetails.country,
                section,
                locale,
                context,
                this.countryIncludingUkList,
                index,
              );

            if (!countryValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...countryValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.addressDetails.country = countryValidationResult.value;
            }
          }

          if (v.contactDetails) {
            const contactFullNameValidationResult =
              glweValidation.validationRules.validateFullName(
                v.contactDetails.fullName,
                section,
                locale,
                context,
                index,
              );

            if (!contactFullNameValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...contactFullNameValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.contactDetails.fullName = contactFullNameValidationResult.value;
            }

            const phoneValidationResult =
              glweValidation.validationRules.validatePhoneNumber(
                v.contactDetails.phoneNumber,
                section,
                locale,
                context,
                index,
              );

            if (!phoneValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...phoneValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.contactDetails.phoneNumber = phoneValidationResult.value;
            }

            const faxValidationResult =
              glweValidation.validationRules.validateFaxNumber(
                v.contactDetails.faxNumber,
                section,
                locale,
                context,
                index,
              );

            if (!faxValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...faxValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.contactDetails.faxNumber = faxValidationResult.value;
            }

            const emailValidationResult =
              glweValidation.validationRules.validateEmailAddress(
                v.contactDetails.emailAddress,
                section,
                locale,
                context,
                index,
              );

            if (!emailValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...emailValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.contactDetails.emailAddress = emailValidationResult.value;
            }
          }

          if (value.transport && v.transportDetails) {
            const meansOfTransportDetailsValidationResult =
              glweValidation.validationRules.validateCarrierMeansOfTransportDetails(
                locale,
                context,
                v.transportDetails.description,
                index,
              );

            if (!meansOfTransportDetailsValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...meansOfTransportDetailsValidationResult.errors
                  .fieldFormatErrors,
              );
            } else {
              v.transportDetails.description =
                meansOfTransportDetailsValidationResult.value;
            }
          }
        });

        if (errors.fieldFormatErrors.length > 0) {
          return fromBoom(Boom.badRequest('Validation failed', errors));
        }
      }

      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      if (draft === undefined) {
        return fromBoom(Boom.notFound());
      }

      if (draft.carriers.status === 'NotStarted') {
        return fromBoom(Boom.notFound());
      }

      if (value.status === 'NotStarted') {
        draft.carriers = value;
      } else {
        const carrier = value.values.find((c) => {
          return c.id === carrierId;
        });
        if (carrier === undefined) {
          return fromBoom(Boom.badRequest());
        }

        const index = draft.carriers.values.findIndex((c) => {
          return c.id === carrierId;
        });
        if (index === -1) {
          return fromBoom(Boom.notFound());
        }

        if (
          draft.wasteDescription.status !== 'NotStarted' &&
          draft.wasteDescription.wasteCode
        ) {
          const transportValidationResult =
            glweValidation.validationRules.validateWasteCodeSubSectionAndCarriersCrossSection(
              draft.wasteDescription.wasteCode,
              value.values.map((v) => v.transportDetails),
            );

          if (!transportValidationResult.valid) {
            return fromBoom(
              Boom.badRequest(
                'Validation failed',
                transportValidationResult.errors,
              ),
            );
          } else {
            value.transport =
              draft.wasteDescription.wasteCode.type !== 'NotApplicable';
          }
        }

        if (draft.carriers !== undefined) {
          draft.carriers.status = value.status;
          draft.carriers.values[index] = carrier;
        }
      }

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);
      draft.submissionState.timestamp = new Date();

      await this.repository.saveRecord(
        draftContainerName,
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

  deleteDraftCarriers: Handler<
    api.DeleteDraftCarriersRequest,
    api.DeleteDraftCarriersResponse
  > = async ({ id, accountId, carrierId }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      if (draft === undefined) {
        return fromBoom(Boom.notFound());
      }

      if (draft.carriers.status === 'NotStarted') {
        return fromBoom(Boom.notFound());
      }

      const index = draft.carriers.values.findIndex((c) => {
        return c.id === carrierId;
      });

      if (index === -1) {
        return fromBoom(Boom.notFound());
      }

      draft.carriers.transport =
        draft.wasteDescription.status !== 'NotStarted' &&
        draft.wasteDescription.wasteCode?.type === 'NotApplicable'
          ? false
          : true;

      draft.carriers.values.splice(index, 1);

      if (draft.carriers.values.length === 0) {
        draft.carriers = {
          status: 'NotStarted',
          transport: draft.carriers.transport,
        };
      }

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);
      draft.submissionState.timestamp = new Date();

      await this.repository.saveRecord(
        draftContainerName,
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

  getDraftCollectionDetail: Handler<
    api.GetDraftCollectionDetailRequest,
    api.GetDraftCollectionDetailResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      return success(draft.collectionDetail);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftCollectionDetail: Handler<
    api.SetDraftCollectionDetailRequest,
    api.SetDraftCollectionDetailResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status !== 'NotStarted') {
        const section = 'CollectionDetail';
        const errors: FieldFormatError[] = [];
        if (value.address) {
          const addressLine1ValidationResult =
            glweValidation.validationRules.validateAddressLine1(
              value.address.addressLine1,
              section,
              locale,
              context,
            );

          if (!addressLine1ValidationResult.valid) {
            errors.push(
              ...addressLine1ValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.address.addressLine1 = addressLine1ValidationResult.value;
          }

          const addressLine2ValidationResult =
            glweValidation.validationRules.validateAddressLine2(
              value.address.addressLine2,
              section,
              locale,
              context,
            );

          if (!addressLine2ValidationResult.valid) {
            errors.push(
              ...addressLine2ValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.address.addressLine2 = addressLine2ValidationResult.value;
          }

          const townOrCityValidationResult =
            glweValidation.validationRules.validateTownOrCity(
              value.address.townCity,
              section,
              locale,
              context,
            );

          if (!townOrCityValidationResult.valid) {
            errors.push(...townOrCityValidationResult.errors.fieldFormatErrors);
          } else {
            value.address.townCity = townOrCityValidationResult.value;
          }

          const postcodeValidationResult =
            glweValidation.validationRules.validatePostcode(
              value.address.postcode,
              section,
              locale,
              context,
            );

          if (!postcodeValidationResult.valid) {
            errors.push(...postcodeValidationResult.errors.fieldFormatErrors);
          } else {
            value.address.postcode = postcodeValidationResult.value;
          }

          const countryValidationResult =
            glweValidation.validationRules.validateCountry(
              value.address.country,
              section,
              locale,
              context,
            );

          if (!countryValidationResult.valid) {
            errors.push(...countryValidationResult.errors.fieldFormatErrors);
          } else {
            value.address.country = countryValidationResult.value;
          }
        }

        if (value.contactDetails) {
          const organisationNameValidationResult =
            glweValidation.validationRules.validateOrganisationName(
              value.contactDetails.organisationName,
              section,
              locale,
              context,
            );

          if (!organisationNameValidationResult.valid) {
            errors.push(
              ...organisationNameValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.contactDetails.organisationName =
              organisationNameValidationResult.value;
          }

          const fullNameValidationResult =
            glweValidation.validationRules.validateFullName(
              value.contactDetails.fullName,
              section,
              locale,
              context,
            );

          if (!fullNameValidationResult.valid) {
            errors.push(...fullNameValidationResult.errors.fieldFormatErrors);
          } else {
            value.contactDetails.fullName = fullNameValidationResult.value;
          }

          const emailAddressValidationResult =
            glweValidation.validationRules.validateEmailAddress(
              value.contactDetails.emailAddress,
              section,
              locale,
              context,
            );

          if (!emailAddressValidationResult.valid) {
            errors.push(
              ...emailAddressValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.contactDetails.emailAddress =
              emailAddressValidationResult.value;
          }

          const phoneNumberValidationResult =
            glweValidation.validationRules.validatePhoneNumber(
              value.contactDetails.phoneNumber,
              section,
              locale,
              context,
            );

          if (!phoneNumberValidationResult.valid) {
            errors.push(
              ...phoneNumberValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.contactDetails.phoneNumber =
              phoneNumberValidationResult.value;
          }

          const faxNumberValidationResult =
            glweValidation.validationRules.validateFaxNumber(
              value.contactDetails.faxNumber,
              section,
              locale,
              context,
            );

          if (!faxNumberValidationResult.valid) {
            errors.push(...faxNumberValidationResult.errors.fieldFormatErrors);
          } else {
            value.contactDetails.faxNumber = faxNumberValidationResult.value;
          }
        }

        if (errors.length > 0) {
          return fromBoom(Boom.badRequest('Validation failed', errors));
        }
      }

      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;

      draft.collectionDetail = value;
      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);
      draft.submissionState.timestamp = new Date();

      await this.repository.saveRecord(
        draftContainerName,
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

  getDraftUkExitLocation: Handler<
    api.GetDraftUkExitLocationRequest,
    api.GetDraftUkExitLocationResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      return success(draft.ukExitLocation);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftUkExitLocation: Handler<
    api.SetDraftUkExitLocationRequest,
    api.SetDraftUkExitLocationResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status !== 'NotStarted') {
        const ukExitLocationValidationResult =
          glweValidation.validationRules.validateUkExitLocation(
            'value' in value.exitLocation &&
              typeof value.exitLocation.value === 'string'
              ? value.exitLocation.value
              : undefined,
          );

        if (!ukExitLocationValidationResult.valid) {
          return fromBoom(
            Boom.badRequest(
              'Validation failed',
              ukExitLocationValidationResult.errors,
            ),
          );
        } else {
          value.exitLocation = ukExitLocationValidationResult.value;
        }
      }

      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;

      draft.ukExitLocation = value;
      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);
      draft.submissionState.timestamp = new Date();

      await this.repository.saveRecord(
        draftContainerName,
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

  getDraftTransitCountries: Handler<
    api.GetDraftTransitCountriesRequest,
    api.GetDraftTransitCountriesResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      return success(draft.transitCountries);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftTransitCountries: Handler<
    api.SetDraftTransitCountriesRequest,
    api.SetDraftTransitCountriesResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status !== 'NotStarted') {
        const transitCountriesValidationResult =
          glweValidation.validationRules.validateTransitCountries(
            value.values,
            this.countryList,
          );

        if (!transitCountriesValidationResult.valid) {
          return fromBoom(
            Boom.badRequest(
              'Validation failed',
              transitCountriesValidationResult.errors,
            ),
          );
        } else {
          value.values = transitCountriesValidationResult.value;
        }
      }

      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;

      if (
        draft.importerDetail.status !== 'NotStarted' &&
        value.status !== 'NotStarted'
      ) {
        const transitCountriesCrossValidationResult =
          glweValidation.validationRules.validateImporterDetailAndTransitCountriesCross(
            draft.importerDetail,
            value.values,
          );

        if (!transitCountriesCrossValidationResult.valid) {
          return fromBoom(
            Boom.badRequest(
              'Validation failed',
              transitCountriesCrossValidationResult.errors,
            ),
          );
        }
      }

      draft.transitCountries = value;
      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);
      draft.submissionState.timestamp = new Date();

      await this.repository.saveRecord(
        draftContainerName,
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

  listDraftRecoveryFacilityDetails: Handler<
    api.ListDraftRecoveryFacilityDetailsRequest,
    api.ListDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      return success(draft.recoveryFacilityDetail);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDraftRecoveryFacilityDetails: Handler<
    api.GetDraftRecoveryFacilityDetailsRequest,
    api.GetDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId, rfdId }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      if (
        draft.recoveryFacilityDetail.status !== 'Started' &&
        draft.recoveryFacilityDetail.status !== 'Complete'
      ) {
        return fromBoom(Boom.notFound());
      }

      const recoveryFacilityDetail = draft.recoveryFacilityDetail.values.find(
        (c) => {
          return c.id === rfdId;
        },
      );

      if (recoveryFacilityDetail === undefined) {
        return fromBoom(Boom.notFound());
      }

      const value: DraftRecoveryFacilityDetails =
        draft.recoveryFacilityDetail.status !== 'Complete'
          ? {
              status: draft.recoveryFacilityDetail.status as 'Started',
              values: [recoveryFacilityDetail as DraftRecoveryFacilityPartial],
            }
          : {
              status: draft.recoveryFacilityDetail.status,
              values: [recoveryFacilityDetail as DraftRecoveryFacility],
            };

      return success(value);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createDraftRecoveryFacilityDetails: Handler<
    api.CreateDraftRecoveryFacilityDetailsRequest,
    api.CreateDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status !== 'Started') {
        return fromBoom(
          Boom.badRequest(
            `"Status cannot be ${value.status} on recovery facility detail creation"`,
          ),
        );
      }

      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;

      if (draft === undefined) {
        return fromBoom(Boom.notFound());
      }

      const uuid = uuidv4();

      if (
        draft.recoveryFacilityDetail.status === 'Started' ||
        draft.recoveryFacilityDetail.status === 'Complete'
      ) {
        const maxFacilities =
          glweValidation.constraints.InterimSiteLength.max +
          glweValidation.constraints.RecoveryFacilityLength.max;
        if (draft.recoveryFacilityDetail.values.length === maxFacilities) {
          return fromBoom(
            Boom.badRequest(
              `Cannot add more than ${maxFacilities} recovery facilities (Maximum: ${glweValidation.constraints.InterimSiteLength.max} InterimSite & ${glweValidation.constraints.RecoveryFacilityLength.max} Recovery Facilities)`,
            ),
          );
        }

        const facilities: DraftRecoveryFacilityPartial[] = [];
        for (const rf of draft.recoveryFacilityDetail.values) {
          facilities.push(rf);
        }
        facilities.push({ id: uuid });

        draft.recoveryFacilityDetail = {
          status: 'Started',
          values: facilities,
        };
      } else {
        draft.recoveryFacilityDetail = {
          status: 'Started',
          values: [{ id: uuid }],
        };
      }

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);
      draft.submissionState.timestamp = new Date();

      await this.repository.saveRecord(
        draftContainerName,
        { ...draft },
        accountId,
      );

      return success({
        status: value.status,
        values: [{ id: uuid }],
      });
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftRecoveryFacilityDetails: Handler<
    api.SetDraftRecoveryFacilityDetailsRequest,
    api.SetDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId, rfdId, value }) => {
    try {
      if (value.status === 'Started' || value.status === 'Complete') {
        const errors = {
          fieldFormatErrors: [] as FieldFormatError[],
        };
        let index = 0;
        value.values.forEach((v) => {
          const section = 'RecoveryFacilityDetail';
          index += 1;
          if (v.addressDetails) {
            const organisationNameValidationResult =
              glweValidation.validationRules.validateOrganisationName(
                v.addressDetails.name,
                section,
                locale,
                context,
                index,
                v.recoveryFacilityType?.type,
              );

            if (!organisationNameValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...organisationNameValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.addressDetails.name = organisationNameValidationResult.value;
            }

            const addressValidationResult =
              glweValidation.validationRules.validateAddress(
                v.addressDetails.address,
                section,
                locale,
                context,
                index,
                v.recoveryFacilityType?.type,
              );

            if (!addressValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...addressValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.addressDetails.address = addressValidationResult.value;
            }

            const countryValidationResult =
              glweValidation.validationRules.validateCountry(
                v.addressDetails.country,
                section,
                locale,
                context,
                this.countryIncludingUkList,
                index,
                v.recoveryFacilityType?.type,
              );

            if (!countryValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...countryValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.addressDetails.country = countryValidationResult.value;
            }
          }

          if (v.contactDetails) {
            const contactFullNameValidationResult =
              glweValidation.validationRules.validateFullName(
                v.contactDetails.fullName,
                section,
                locale,
                context,
                index,
                v.recoveryFacilityType?.type,
              );

            if (!contactFullNameValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...contactFullNameValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.contactDetails.fullName = contactFullNameValidationResult.value;
            }

            const phoneValidationResult =
              glweValidation.validationRules.validatePhoneNumber(
                v.contactDetails.phoneNumber,
                section,
                locale,
                context,
                index,
                v.recoveryFacilityType?.type,
              );

            if (!phoneValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...phoneValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.contactDetails.phoneNumber = phoneValidationResult.value;
            }

            const faxValidationResult =
              glweValidation.validationRules.validateFaxNumber(
                v.contactDetails.faxNumber,
                section,
                locale,
                context,
                index,
                v.recoveryFacilityType?.type,
              );

            if (!faxValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...faxValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.contactDetails.faxNumber = faxValidationResult.value;
            }

            const emailValidationResult =
              glweValidation.validationRules.validateEmailAddress(
                v.contactDetails.emailAddress,
                section,
                locale,
                context,
                index,
                v.recoveryFacilityType?.type,
              );

            if (!emailValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...emailValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.contactDetails.emailAddress = emailValidationResult.value;
            }
          }

          if (
            v.recoveryFacilityType &&
            ((v.recoveryFacilityType.type === 'Laboratory' &&
              v.recoveryFacilityType.disposalCode !== undefined) ||
              (v.recoveryFacilityType.type !== 'Laboratory' &&
                v.recoveryFacilityType.recoveryCode !== undefined))
          ) {
            const codeValidationResult =
              glweValidation.validationRules.validateDisposalOrRecoveryCode(
                v.recoveryFacilityType.type === 'Laboratory'
                  ? v.recoveryFacilityType.disposalCode
                  : v.recoveryFacilityType.recoveryCode,
                v.recoveryFacilityType.type === 'Laboratory'
                  ? {
                      type: v.recoveryFacilityType.type,
                      codeList: this.disposalCodeList,
                    }
                  : {
                      type: v.recoveryFacilityType.type,
                      codeList: this.recoveryCodeList,
                    },
                locale,
                context,
              );

            if (!codeValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...codeValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.recoveryFacilityType.type === 'Laboratory'
                ? (v.recoveryFacilityType.disposalCode =
                    codeValidationResult.value)
                : (v.recoveryFacilityType.recoveryCode =
                    codeValidationResult.value);
            }
          }
        });

        if (errors.fieldFormatErrors.length > 0) {
          return fromBoom(Boom.badRequest('Validation failed', errors));
        }
      }

      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      if (draft === undefined) {
        return fromBoom(Boom.notFound());
      }

      if (
        draft.recoveryFacilityDetail.status !== 'Started' &&
        draft.recoveryFacilityDetail.status !== 'Complete'
      ) {
        return fromBoom(Boom.notFound());
      }

      if (value.status === 'Started' || value.status === 'Complete') {
        const recoveryFacility = value.values.find((rf) => {
          return rf.id === rfdId;
        });

        if (recoveryFacility === undefined) {
          return fromBoom(Boom.badRequest());
        }
        const index = draft.recoveryFacilityDetail.values.findIndex((rf) => {
          return rf.id === rfdId;
        });
        if (index === -1) {
          return fromBoom(Boom.notFound());
        }

        if (
          draft.wasteDescription.status !== 'NotStarted' &&
          draft.wasteDescription.wasteCode
        ) {
          const recoveryFacilityTypes: RecoveryFacilityDetail['recoveryFacilityType']['type'][] =
            [];
          value.values.forEach((v) => {
            if (v.recoveryFacilityType) {
              recoveryFacilityTypes.push(v.recoveryFacilityType.type);
            }
          });
          const recoveryFacilityTypesValidationResult =
            glweValidation.validationRules.validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
              draft.wasteDescription.wasteCode,
              recoveryFacilityTypes,
            );

          if (!recoveryFacilityTypesValidationResult.valid) {
            return fromBoom(
              Boom.badRequest(
                'Validation failed',
                recoveryFacilityTypesValidationResult.errors,
              ),
            );
          }
        }

        draft.recoveryFacilityDetail.status = value.status;
        draft.recoveryFacilityDetail.values[index] =
          recoveryFacility as DraftRecoveryFacility;
      }

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);
      draft.submissionState.timestamp = new Date();

      await this.repository.saveRecord(
        draftContainerName,
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

  deleteDraftRecoveryFacilityDetails: Handler<
    api.DeleteDraftRecoveryFacilityDetailsRequest,
    api.DeleteDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId, rfdId }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      if (draft === undefined) {
        return fromBoom(Boom.notFound());
      }
      if (
        draft.recoveryFacilityDetail.status !== 'Started' &&
        draft.recoveryFacilityDetail.status !== 'Complete'
      ) {
        return fromBoom(Boom.notFound());
      }

      const index = draft.recoveryFacilityDetail.values.findIndex((rf) => {
        return rf.id === rfdId;
      });

      if (index === -1) {
        return fromBoom(Boom.notFound());
      }

      draft.recoveryFacilityDetail.values.splice(index, 1);
      if (draft.recoveryFacilityDetail.values.length === 0) {
        draft.recoveryFacilityDetail = { status: 'NotStarted' };
      }

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);
      draft.submissionState.timestamp = new Date();

      await this.repository.saveRecord(
        draftContainerName,
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

  setDraftSubmissionConfirmation: Handler<
    api.SetDraftSubmissionConfirmationRequest,
    api.SetDraftSubmissionConfirmationResponse
  > = async ({ id, accountId, value }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;

      if (draft.submissionConfirmation.status === 'CannotStart') {
        return fromBoom(Boom.badRequest());
      }

      if (draft.collectionDate.status !== 'NotStarted') {
        const date =
          draft.collectionDate.value.type === 'ActualDate'
            ? draft.collectionDate.value.actualDate
            : draft.collectionDate.value.estimateDate;

        const collectionDateValidationResult =
          commonValidation.commonValidationRules.validateCollectionDate(
            date.day,
            date.month,
            date.year,
          );

        if (!collectionDateValidationResult.valid) {
          draft.collectionDate = { status: 'NotStarted' };
          draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
          draft.submissionState.timestamp = new Date();

          await this.repository.saveRecord(
            draftContainerName,
            { ...draft },
            accountId,
          );
          return fromBoom(Boom.badRequest());
        }
      }

      draft.submissionConfirmation = value;
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);
      draft.submissionState.timestamp = new Date();

      await this.repository.saveRecord(
        draftContainerName,
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

  getDraftSubmissionConfirmation: Handler<
    api.GetDraftSubmissionConfirmationRequest,
    api.GetDraftSubmissionConfirmationResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      return success(draft.submissionConfirmation);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftSubmissionDeclaration: Handler<
    api.SetDraftSubmissionDeclarationRequest,
    api.SetDraftSubmissionDeclarationResponse
  > = async ({ id, accountId, value }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;

      if (draft.submissionDeclaration.status === 'CannotStart') {
        return fromBoom(Boom.badRequest());
      }

      if (draft.collectionDate.status !== 'NotStarted') {
        const date =
          draft.collectionDate.value.type === 'ActualDate'
            ? draft.collectionDate.value.actualDate
            : draft.collectionDate.value.estimateDate;

        const collectionDateValidationResult =
          commonValidation.commonValidationRules.validateCollectionDate(
            date.day,
            date.month,
            date.year,
          );

        if (!collectionDateValidationResult.valid) {
          draft.collectionDate = { status: 'NotStarted' };

          draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
          draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);
          draft.submissionState.timestamp = new Date();

          await this.repository.saveRecord(
            draftContainerName,
            { ...draft },
            accountId,
          );
          return fromBoom(Boom.badRequest());
        }
      }

      let submissionDeclaration: DraftSubmission['submissionDeclaration'] =
        draft.submissionDeclaration;

      if (
        value.status === 'Complete' &&
        draft.submissionDeclaration.status === 'NotStarted'
      ) {
        const timestamp = new Date();
        const transactionId =
          timestamp.getFullYear().toString().substring(2) +
          (timestamp.getMonth() + 1).toString().padStart(2, '0') +
          '_' +
          id.substring(0, 8).toUpperCase();
        submissionDeclaration = {
          status: value.status,
          values: {
            declarationTimestamp: timestamp,
            transactionId: transactionId,
          },
        };
      }

      const timestamp = new Date();
      const submissionState: RecordState =
        draft.collectionDate.status === 'Complete' &&
        draft.wasteQuantity.status === 'Complete' &&
        draft.collectionDate.value.type === 'ActualDate' &&
        draft.wasteQuantity.value.type === 'ActualData'
          ? { status: 'SubmittedWithActuals', timestamp: timestamp }
          : { status: 'SubmittedWithEstimates', timestamp: timestamp };

      if (
        draft.wasteDescription.status === 'Complete' &&
        draft.wasteQuantity.status === 'Complete' &&
        draft.wasteQuantity.value.type !== 'NotApplicable' &&
        draft.exporterDetail.status === 'Complete' &&
        draft.importerDetail.status === 'Complete' &&
        draft.collectionDate.status === 'Complete' &&
        draft.carriers.status === 'Complete' &&
        draft.collectionDetail.status === 'Complete' &&
        draft.ukExitLocation.status === 'Complete' &&
        draft.transitCountries.status === 'Complete' &&
        draft.recoveryFacilityDetail.status === 'Complete' &&
        submissionDeclaration.status === 'Complete' &&
        (submissionState.status === 'SubmittedWithActuals' ||
          submissionState.status === 'SubmittedWithEstimates' ||
          submissionState.status === 'UpdatedWithActuals')
      ) {
        const submission: Submission = {
          id: draft.id,
          reference: draft.reference,
          wasteDescription: {
            wasteCode: draft.wasteDescription.wasteCode,
            ewcCodes: draft.wasteDescription.ewcCodes,
            nationalCode: draft.wasteDescription.nationalCode,
            description: draft.wasteDescription.description,
          },
          wasteQuantity: draft.wasteQuantity.value,
          exporterDetail: {
            exporterAddress: draft.exporterDetail.exporterAddress,
            exporterContactDetails: draft.exporterDetail.exporterContactDetails,
          },
          importerDetail: {
            importerAddressDetails: draft.importerDetail.importerAddressDetails,
            importerContactDetails: draft.importerDetail.importerContactDetails,
          },
          collectionDate: draft.collectionDate.value,
          carriers: draft.carriers.values.map((c) => {
            return {
              addressDetails: c.addressDetails,
              contactDetails: c.contactDetails,
              transportDetails: c.transportDetails,
            };
          }),
          collectionDetail: {
            address: draft.collectionDetail.address,
            contactDetails: draft.collectionDetail.contactDetails,
          },
          ukExitLocation: draft.ukExitLocation.exitLocation,
          transitCountries: draft.transitCountries.values,
          recoveryFacilityDetail: draft.recoveryFacilityDetail.values.map(
            (rf) => {
              return {
                addressDetails: rf.addressDetails,
                contactDetails: rf.contactDetails,
                recoveryFacilityType: rf.recoveryFacilityType,
              };
            },
          ),
          submissionDeclaration: submissionDeclaration.values,
          submissionState: {
            status: submissionState.status,
            timestamp: submissionState.timestamp,
          },
        };

        await this.repository.saveRecord(
          submissionContainerName,
          submission,
          accountId,
        );
        await this.repository.deleteRecord(
          draftContainerName,
          draft.id,
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

  getDraftSubmissionDeclaration: Handler<
    api.GetDraftSubmissionDeclarationRequest,
    api.GetDraftSubmissionDeclarationResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      return success(draft.submissionDeclaration);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
