import Boom from '@hapi/boom';
import {
  common,
  draft as api,
  validation,
} from '@wts/api/green-list-waste-export';
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
  RecordState,
  Submission,
  SubmissionBase,
} from '../../model';
import { Handler } from '@wts/api/common';
import {
  SubmissionBasePlusId,
  createBaseCarriers,
  createBaseRecoveryFacilityDetail,
  deleteBaseCarriers,
  deleteBaseRecoveryFacilityDetail,
  getSubmissionData,
  isCollectionDateValid,
  isWasteCodeChangingBulkToBulkDifferentType,
  isWasteCodeChangingBulkToBulkSameType,
  isWasteCodeChangingBulkToSmall,
  isWasteCodeChangingSmallToBulk,
  setBaseCarriers,
  setBaseCollectionDetail,
  setBaseExitLocation,
  setBaseExporterDetail,
  setBaseImporterDetail,
  setBaseNoCarriers,
  setBaseRecoveryFacilityDetail,
  setBaseTransitCountries,
  setBaseWasteDescription,
  setSubmissionConfirmationStatus,
  setSubmissionDeclarationStatus,
  setDraftWasteQuantityUnit,
} from '../../lib/util';
import { CosmosRepository } from '../../data';

const draftContainerName = 'drafts';
const submissionContainerName = 'submissions';

export default class DraftController {
  constructor(
    private repository: CosmosRepository,
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
        if (reference.length > validation.ReferenceChar.max) {
          return fromBoom(
            Boom.badRequest(
              `Supplied reference cannot exceed ${validation.ReferenceChar.max} characters`,
            ),
          );
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
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      if (reference.length > validation.ReferenceChar.max) {
        return fromBoom(
          Boom.badRequest(
            `Supplied reference cannot exceed ${validation.ReferenceChar.max} characters`,
          ),
        );
      }

      draft.reference = reference;

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);

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
        draft as SubmissionBase,
        value,
      );

      draft.wasteDescription = submissionBase.wasteDescription;
      draft.carriers = submissionBase.carriers;
      draft.recoveryFacilityDetail = submissionBase.recoveryFacilityDetail;
      draft.wasteQuantity = wasteQuantity;

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);

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
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;

      setDraftWasteQuantityUnit(value, draft);
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
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;

      draft.exporterDetail = setBaseExporterDetail(
        draft as SubmissionBase,
        value,
      ).exporterDetail;

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);

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
      draft.importerDetail = setBaseImporterDetail(
        draft as SubmissionBase,
        value,
      ).importerDetail;

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);

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
                day: value.value.actualDate.day,
                month: value.value.actualDate.month,
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
                day: value.value.estimateDate.day,
                month: value.value.estimateDate.month,
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
        if (draft.carriers.values.length === validation.CarrierLength.max) {
          return fromBoom(
            Boom.badRequest(
              `Cannot add more than ${validation.CarrierLength.max} carriers`,
            ),
          );
        }
      }

      const submissionBasePlusId: SubmissionBasePlusId = createBaseCarriers(
        draft as SubmissionBase,
        value,
      );

      draft.carriers = submissionBasePlusId.submissionBase.carriers;

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);

      await this.repository.saveRecord(
        draftContainerName,
        { ...draft },
        accountId,
      );
      return success({
        status: value.status,
        transport: submissionBasePlusId.submissionBase.carriers.transport,
        values: [{ id: submissionBasePlusId.id }],
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
        draft.carriers = setBaseNoCarriers(
          draft as SubmissionBase,
          carrierId,
          value,
        ).carriers;
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
        draft.carriers = setBaseCarriers(
          draft as SubmissionBase,
          carrierId,
          value,
          carrier,
          index,
        ).carriers;
      }

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);

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

      draft.carriers = deleteBaseCarriers(
        draft as SubmissionBase,
        carrierId,
      ).carriers;

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);

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
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      draft.collectionDetail = setBaseCollectionDetail(
        draft as SubmissionBase,
        value,
      ).collectionDetail;

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);

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
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      draft.ukExitLocation = setBaseExitLocation(
        draft as SubmissionBase,
        value,
      ).ukExitLocation;

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);

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
      const draft = (await this.repository.getRecord(
        draftContainerName,
        id,
        accountId,
      )) as DraftSubmission;
      draft.transitCountries = setBaseTransitCountries(
        draft as SubmissionBase,
        value,
      ).transitCountries;

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);

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
              status: draft.carriers.status as 'Started',
              values: [recoveryFacilityDetail as DraftRecoveryFacilityPartial],
            }
          : {
              status: draft.carriers.status,
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

      if (
        draft.recoveryFacilityDetail.status === 'Started' ||
        draft.recoveryFacilityDetail.status === 'Complete'
      ) {
        const maxFacilities =
          validation.InterimSiteLength.max +
          validation.RecoveryFacilityLength.max;
        if (draft.recoveryFacilityDetail.values.length === maxFacilities) {
          return fromBoom(
            Boom.badRequest(
              `Cannot add more than ${maxFacilities} recovery facilities (Maximum: ${validation.InterimSiteLength.max} InterimSite & ${validation.RecoveryFacilityLength.max} Recovery Facilities)`,
            ),
          );
        }
      }

      const submissionBasePlusId: SubmissionBasePlusId =
        createBaseRecoveryFacilityDetail(draft as SubmissionBase, value);

      draft.recoveryFacilityDetail =
        submissionBasePlusId.submissionBase.recoveryFacilityDetail;

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);

      await this.repository.saveRecord(
        draftContainerName,
        { ...draft },
        accountId,
      );
      return success({
        status: value.status,
        values: [{ id: submissionBasePlusId.id }],
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
      }

      draft.recoveryFacilityDetail = setBaseRecoveryFacilityDetail(
        draft as SubmissionBase,
        rfdId,
        value,
      ).recoveryFacilityDetail;

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);

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

      draft.recoveryFacilityDetail = deleteBaseRecoveryFacilityDetail(
        draft as SubmissionBase,
        rfdId,
      ).recoveryFacilityDetail;

      draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);

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

      if (!isCollectionDateValid(draft.collectionDate)) {
        draft.collectionDate = { status: 'NotStarted' };
        draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
        await this.repository.saveRecord(
          draftContainerName,
          { ...draft },
          accountId,
        );
        return fromBoom(Boom.badRequest());
      }
      draft.submissionConfirmation = value;
      draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);
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

      if (!isCollectionDateValid(draft.collectionDate)) {
        draft.collectionDate = { status: 'NotStarted' };

        draft.submissionConfirmation = setSubmissionConfirmationStatus(draft);
        draft.submissionDeclaration = setSubmissionDeclarationStatus(draft);

        await this.repository.saveRecord(
          draftContainerName,
          { ...draft },
          accountId,
        );
        return fromBoom(Boom.badRequest());
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

      await this.repository.saveRecord(
        submissionContainerName,
        getSubmissionData({
          ...draft,
          submissionDeclaration: submissionDeclaration,
          submissionState: submissionState,
        }) as Submission,
        accountId,
      );

      await this.repository.deleteRecord(
        draftContainerName,
        draft.id,
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
