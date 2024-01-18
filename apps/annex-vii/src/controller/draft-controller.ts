import Boom from '@hapi/boom';
import * as api from '@wts/api/annex-vii';
import { fromBoom, success } from '@wts/util/invocation';
import { differenceInBusinessDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import {
  DraftCarriers,
  DraftRecoveryFacilityDetail,
  DraftSubmission,
  SubmissionBase,
} from '../model';
import { BaseController, SubmissionBasePlusId } from './base-controller';
import { DraftRepository } from '../data/repository';
import { Handler } from '@wts/api/common';

export default class DraftController extends BaseController {
  constructor(private repository: DraftRepository, private logger: Logger) {
    super();
  }

  isCollectionDateValid(date: DraftSubmission['collectionDate']) {
    if (date.status !== 'NotStarted') {
      const {
        day: dayStr,
        month: monthStr,
        year: yearStr,
      } = date.value[
        date.value.type === 'ActualDate' ? 'actualDate' : 'estimateDate'
      ];
      const [day, month, year] = [
        parseInt(dayStr as string),
        parseInt(monthStr as string) - 1,
        parseInt(yearStr as string),
      ];

      if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
        return false;
      }

      if (
        differenceInBusinessDays(new Date(year, month, day), new Date()) < 3
      ) {
        return false;
      }
    }
    return true;
  }

  setSubmissionConfirmationStatus(
    draft: DraftSubmission
  ): DraftSubmission['submissionConfirmation'] {
    const {
      id,
      reference,
      submissionConfirmation,
      submissionDeclaration,
      submissionState,
      ...filteredValues
    } = draft;

    if (
      Object.values(filteredValues).every(
        (value) => value.status === 'Complete'
      )
    ) {
      return { status: 'NotStarted' };
    } else {
      return { status: 'CannotStart' };
    }
  }

  setSubmissionDeclarationStatus(
    draft: DraftSubmission
  ): DraftSubmission['submissionDeclaration'] {
    if (draft.submissionConfirmation.status === 'Complete') {
      return { status: 'NotStarted' };
    } else {
      return { status: 'CannotStart' };
    }
  }

  getDraftById: Handler<api.GetDraftByIdRequest, api.GetDraftByIdResponse> =
    async ({ id, accountId }) => {
      try {
        const draft = await this.repository.getDraft(id, accountId);
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

  getDrafts: Handler<api.GetDraftsRequest, api.GetDraftsResponse> = async ({
    accountId,
    order,
    pageLimit,
    state,
    token,
  }) => {
    try {
      return success(
        await this.repository.getDrafts(
          accountId,
          order,
          pageLimit,
          state,
          token
        )
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
        if (reference.length > 20) {
          return fromBoom(
            Boom.badRequest('Supplied reference cannot exceed 20 characters')
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

        await this.repository.saveDraft(value, accountId);
        return success(value);
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };

  createDraftFromTemplate: Handler<
    api.CreateDraftFromTemplateRequest,
    api.CreateDraftResponse
  > = async ({ id, accountId, reference }) => {
    try {
      if (reference.length > 20) {
        return fromBoom(
          Boom.badRequest('Supplied reference cannot exceed 20 characters')
        );
      }

      return success(
        await this.repository.createDraftFromTemplate(id, accountId, reference)
      );
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
        const draft = await this.repository.getDraft(id, accountId);
        draft.submissionState = { status: 'Deleted', timestamp: new Date() };
        await this.repository.saveDraft({ ...draft }, accountId);
        return success(undefined);
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };

  cancelDraft: Handler<
    api.CancelDraftByIdRequest,
    api.CancelDraftByIdResponse
  > = async ({ id, accountId, cancellationType }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);
      draft.submissionState = {
        status: 'Cancelled',
        timestamp: new Date(),
        cancellationType: cancellationType,
      };
      await this.repository.saveDraft({ ...draft }, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDraftCustomerReferenceById: Handler<
    api.GetDraftCustomerReferenceByIdRequest,
    api.GetDraftCustomerReferenceByIdResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);
      return success(draft.reference);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftCustomerReferenceById: Handler<
    api.SetDraftCustomerReferenceByIdRequest,
    api.SetDraftCustomerReferenceByIdResponse
  > = async ({ id, accountId, reference }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);
      if (reference.length > 20) {
        return fromBoom(
          Boom.badRequest('Supplied reference cannot exceed 20 characters')
        );
      }

      draft.reference = reference;

      draft.submissionConfirmation =
        this.setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = this.setSubmissionDeclarationStatus(draft);

      await this.repository.saveDraft({ ...draft }, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDraftWasteDescriptionById: Handler<
    api.GetDraftWasteDescriptionByIdRequest,
    api.GetDraftWasteDescriptionByIdResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);
      return success(draft.wasteDescription);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftWasteDescriptionById: Handler<
    api.SetDraftWasteDescriptionByIdRequest,
    api.SetDraftCustomerReferenceByIdResponse
  > = async ({ id, accountId, value }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);

      let wasteQuantity: DraftSubmission['wasteQuantity'] = draft.wasteQuantity;

      if (
        wasteQuantity.status === 'CannotStart' &&
        (value.status === 'Started' || value.status === 'Complete')
      ) {
        wasteQuantity = { status: 'NotStarted' };
      }

      if (this.isWasteCodeChangingBulkToSmall(draft.wasteDescription, value)) {
        wasteQuantity = { status: 'NotStarted' };
      }

      if (this.isWasteCodeChangingSmallToBulk(draft.wasteDescription, value)) {
        wasteQuantity = { status: 'NotStarted' };
      }

      if (
        this.isWasteCodeChangingBulkToBulkDifferentType(
          draft.wasteDescription,
          value
        )
      ) {
        wasteQuantity = { status: 'NotStarted' };
      }

      if (
        this.isWasteCodeChangingBulkToBulkSameType(
          draft.wasteDescription,
          value
        )
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

      const submissionBase = this.setBaseWasteDescription(
        draft as SubmissionBase,
        value
      );

      draft.wasteDescription = submissionBase.wasteDescription;
      draft.carriers = submissionBase.carriers;
      draft.recoveryFacilityDetail = submissionBase.recoveryFacilityDetail;
      draft.wasteQuantity = wasteQuantity;

      draft.submissionConfirmation =
        this.setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = this.setSubmissionDeclarationStatus(draft);

      await this.repository.saveDraft(
        {
          ...draft,
        },
        accountId
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

  getDraftWasteQuantityById: Handler<
    api.GetDraftWasteQuantityByIdRequest,
    api.GetDraftWasteQuantityByIdResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);
      return success(draft.wasteQuantity);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftWasteQuantityById: Handler<
    api.SetDraftWasteQuantityByIdRequest,
    api.SetDraftWasteQuantityByIdResponse
  > = async ({ id, accountId, value }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);

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

      if (draft.submissionConfirmation.status !== 'Complete') {
        draft.submissionConfirmation =
          this.setSubmissionConfirmationStatus(draft);
      }

      if (draft.submissionDeclaration.status !== 'Complete') {
        draft.submissionDeclaration =
          this.setSubmissionDeclarationStatus(draft);
      }

      draft.submissionState =
        draft.collectionDate.status === 'Complete' &&
        draft.collectionDate.value.type === 'ActualDate' &&
        draft.submissionState.status === 'SubmittedWithEstimates' &&
        value.status === 'Complete' &&
        value.value.type === 'ActualData'
          ? { status: 'UpdatedWithActuals', timestamp: new Date() }
          : draft.submissionState;

      await this.repository.saveDraft({ ...draft }, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDraftExporterDetailById: Handler<
    api.GetDraftExporterDetailByIdRequest,
    api.GetDraftExporterDetailByIdResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);
      return success(draft.exporterDetail);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftExporterDetailById: Handler<
    api.SetDraftExporterDetailByIdRequest,
    api.SetDraftExporterDetailByIdResponse
  > = async ({ id, accountId, value }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);

      draft.exporterDetail = this.setBaseExporterDetail(
        draft as SubmissionBase,
        value
      ).exporterDetail;

      draft.submissionConfirmation =
        this.setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = this.setSubmissionDeclarationStatus(draft);

      await this.repository.saveDraft({ ...draft }, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDraftImporterDetailById: Handler<
    api.GetDraftImporterDetailByIdRequest,
    api.GetDraftImporterDetailByIdResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);
      return success(draft.importerDetail);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftImporterDetailById: Handler<
    api.SetDraftImporterDetailByIdRequest,
    api.SetDraftImporterDetailByIdResponse
  > = async ({ id, accountId, value }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);
      draft.importerDetail = this.setBaseImporterDetail(
        draft as SubmissionBase,
        value
      ).importerDetail;

      draft.submissionConfirmation =
        this.setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = this.setSubmissionDeclarationStatus(draft);

      await this.repository.saveDraft({ ...draft }, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDraftCollectionDateById: Handler<
    api.GetDraftCollectionDateByIdRequest,
    api.GetDraftCollectionDateByIdResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);
      return success(draft.collectionDate);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftCollectionDateById: Handler<
    api.SetDraftCollectionDateByIdRequest,
    api.SetDraftCollectionDateByIdResponse
  > = async ({ id, accountId, value }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);

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

      if (draft.submissionConfirmation.status !== 'Complete') {
        draft.submissionConfirmation =
          this.setSubmissionConfirmationStatus(draft);
      }

      if (draft.submissionDeclaration.status !== 'Complete') {
        draft.submissionDeclaration =
          this.setSubmissionDeclarationStatus(draft);
      }

      draft.submissionState =
        draft.wasteQuantity.status === 'Complete' &&
        draft.wasteQuantity.value.type === 'ActualData' &&
        draft.submissionState.status === 'SubmittedWithEstimates' &&
        value.status === 'Complete' &&
        value.value.type === 'ActualDate'
          ? { status: 'UpdatedWithActuals', timestamp: new Date() }
          : draft.submissionState;

      await this.repository.saveDraft({ ...draft }, accountId);
      return success(undefined);
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
      const draft = await this.repository.getDraft(id, accountId);
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
      const draft = await this.repository.getDraft(id, accountId);
      if (draft.carriers.status === 'NotStarted') {
        return fromBoom(Boom.notFound());
      }

      const carrier = draft.carriers.values.find((c) => {
        return c.id === carrierId;
      });

      if (carrier === undefined) {
        return fromBoom(Boom.notFound());
      }

      const value: DraftCarriers = {
        status: draft.carriers.status,
        transport: draft.carriers.transport,
        values: [carrier],
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
            `"Status cannot be ${value.status} on carrier detail creation"`
          )
        );
      }

      const draft = await this.repository.getDraft(id, accountId);
      if (draft === undefined) {
        return Promise.reject(Boom.notFound());
      }

      if (draft.carriers.status !== 'NotStarted') {
        if (draft.carriers.values.length === 5) {
          return fromBoom(Boom.badRequest('Cannot add more than 5 carriers'));
        }
      }

      const submissionBasePlusId: SubmissionBasePlusId =
        this.createBaseCarriers(draft as SubmissionBase, value);

      draft.carriers = submissionBasePlusId.submissionBase.carriers;

      draft.submissionConfirmation =
        this.setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = this.setSubmissionDeclarationStatus(draft);

      await this.repository.saveDraft({ ...draft }, accountId);
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
      const draft = await this.repository.getDraft(id, accountId);
      if (draft === undefined) {
        return Promise.reject(Boom.notFound());
      }

      if (draft.carriers.status === 'NotStarted') {
        return Promise.reject(Boom.notFound());
      }

      if (value.status === 'NotStarted') {
        draft.carriers = this.setBaseNoCarriers(
          draft as SubmissionBase,
          carrierId,
          value
        ).carriers;
      } else {
        const carrier = value.values.find((c) => {
          return c.id === carrierId;
        });
        if (carrier === undefined) {
          return Promise.reject(Boom.badRequest());
        }

        const index = draft.carriers.values.findIndex((c) => {
          return c.id === carrierId;
        });
        if (index === -1) {
          return Promise.reject(Boom.notFound());
        }
        draft.carriers = this.setBaseCarriers(
          draft as SubmissionBase,
          carrierId,
          value,
          carrier,
          index
        ).carriers;
      }

      draft.submissionConfirmation =
        this.setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = this.setSubmissionDeclarationStatus(draft);

      await this.repository.saveDraft({ ...draft }, accountId);
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
      const draft = await this.repository.getDraft(id, accountId);
      if (draft === undefined) {
        return Promise.reject(Boom.notFound());
      }

      if (draft.carriers.status === 'NotStarted') {
        return Promise.reject(Boom.notFound());
      }

      const index = draft.carriers.values.findIndex((c) => {
        return c.id === carrierId;
      });

      if (index === -1) {
        return Promise.reject(Boom.notFound());
      }

      draft.carriers = this.deleteBaseCarriers(
        draft as SubmissionBase,
        carrierId
      ).carriers;

      draft.submissionConfirmation =
        this.setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = this.setSubmissionDeclarationStatus(draft);

      await this.repository.saveDraft({ ...draft }, accountId);
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
      const draft = await this.repository.getDraft(id, accountId);
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
      const draft = await this.repository.getDraft(id, accountId);
      draft.collectionDetail = this.setBaseCollectionDetail(
        draft as SubmissionBase,
        value
      ).collectionDetail;

      draft.submissionConfirmation =
        this.setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = this.setSubmissionDeclarationStatus(draft);

      await this.repository.saveDraft({ ...draft }, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDraftExitLocationById: Handler<
    api.GetDraftExitLocationByIdRequest,
    api.GetDraftExitLocationByIdResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);
      return success(draft.ukExitLocation);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftExitLocationById: Handler<
    api.SetDraftExitLocationByIdRequest,
    api.SetDraftExitLocationByIdResponse
  > = async ({ id, accountId, value }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);
      draft.ukExitLocation = this.setBaseExitLocation(
        draft as SubmissionBase,
        value
      ).ukExitLocation;

      draft.submissionConfirmation =
        this.setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = this.setSubmissionDeclarationStatus(draft);

      await this.repository.saveDraft({ ...draft }, accountId);
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
      const draft = await this.repository.getDraft(id, accountId);
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
      const draft = await this.repository.getDraft(id, accountId);
      draft.transitCountries = this.setBaseTransitCountries(
        draft as SubmissionBase,
        value
      ).transitCountries;

      draft.submissionConfirmation =
        this.setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = this.setSubmissionDeclarationStatus(draft);

      await this.repository.saveDraft({ ...draft }, accountId);
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
      const draft = await this.repository.getDraft(id, accountId);
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
      const draft = await this.repository.getDraft(id, accountId);
      if (
        draft.recoveryFacilityDetail.status !== 'Started' &&
        draft.recoveryFacilityDetail.status !== 'Complete'
      ) {
        return fromBoom(Boom.notFound());
      }

      const recoveryFacilityDetail = draft.recoveryFacilityDetail.values.find(
        (c) => {
          return c.id === rfdId;
        }
      );

      if (recoveryFacilityDetail === undefined) {
        return fromBoom(Boom.notFound());
      }

      const value: DraftRecoveryFacilityDetail = {
        status: draft.recoveryFacilityDetail.status,
        values: [recoveryFacilityDetail],
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
            `"Status cannot be ${value.status} on recovery facility detail creation"`
          )
        );
      }

      const draft = await this.repository.getDraft(id, accountId);

      if (draft === undefined) {
        return Promise.reject(Boom.notFound());
      }

      if (
        draft.recoveryFacilityDetail.status === 'Started' ||
        draft.recoveryFacilityDetail.status === 'Complete'
      ) {
        if (draft.recoveryFacilityDetail.values.length === 6) {
          return fromBoom(
            Boom.badRequest(
              'Cannot add more than 6 recovery facilities (Maximum: 1 InterimSite & 5 Recovery Facilities )'
            )
          );
        }
      }

      const submissionBasePlusId: SubmissionBasePlusId =
        this.createBaseRecoveryFacilityDetail(draft as SubmissionBase, value);

      draft.recoveryFacilityDetail =
        submissionBasePlusId.submissionBase.recoveryFacilityDetail;

      draft.submissionConfirmation =
        this.setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = this.setSubmissionDeclarationStatus(draft);

      await this.repository.saveDraft({ ...draft }, accountId);
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
      const draft = await this.repository.getDraft(id, accountId);
      if (draft === undefined) {
        return Promise.reject(Boom.notFound());
      }

      if (
        draft.recoveryFacilityDetail.status !== 'Started' &&
        draft.recoveryFacilityDetail.status !== 'Complete'
      ) {
        return Promise.reject(Boom.notFound());
      }

      if (value.status === 'Started' || value.status === 'Complete') {
        const recoveryFacility = value.values.find((rf) => {
          return rf.id === rfdId;
        });

        if (recoveryFacility === undefined) {
          return Promise.reject(Boom.badRequest());
        }
        const index = draft.recoveryFacilityDetail.values.findIndex((rf) => {
          return rf.id === rfdId;
        });
        if (index === -1) {
          return Promise.reject(Boom.notFound());
        }
      }

      draft.recoveryFacilityDetail = this.setBaseRecoveryFacilityDetail(
        draft as SubmissionBase,
        rfdId,
        value
      ).recoveryFacilityDetail;

      draft.submissionConfirmation =
        this.setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = this.setSubmissionDeclarationStatus(draft);

      await this.repository.saveDraft({ ...draft }, accountId);
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
      const draft = await this.repository.getDraft(id, accountId);
      if (draft === undefined) {
        return Promise.reject(Boom.notFound());
      }
      if (
        draft.recoveryFacilityDetail.status !== 'Started' &&
        draft.recoveryFacilityDetail.status !== 'Complete'
      ) {
        return Promise.reject(Boom.notFound());
      }

      const index = draft.recoveryFacilityDetail.values.findIndex((rf) => {
        return rf.id === rfdId;
      });

      if (index === -1) {
        return Promise.reject(Boom.notFound());
      }

      draft.recoveryFacilityDetail = this.deleteBaseRecoveryFacilityDetail(
        draft as SubmissionBase,
        rfdId
      ).recoveryFacilityDetail;

      draft.submissionConfirmation =
        this.setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = this.setSubmissionDeclarationStatus(draft);

      await this.repository.saveDraft({ ...draft }, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftSubmissionConfirmationById: Handler<
    api.SetDraftSubmissionConfirmationByIdRequest,
    api.SetDraftSubmissionConfirmationByIdResponse
  > = async ({ id, accountId, value }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);

      if (draft.submissionConfirmation.status === 'CannotStart') {
        return fromBoom(Boom.badRequest());
      }

      if (!this.isCollectionDateValid(draft.collectionDate)) {
        draft.collectionDate = { status: 'NotStarted' };
        draft.submissionConfirmation =
          this.setSubmissionConfirmationStatus(draft);
        await this.repository.saveDraft({ ...draft }, accountId);
        return fromBoom(Boom.badRequest());
      }
      draft.submissionConfirmation = value;
      draft.submissionDeclaration = this.setSubmissionDeclarationStatus(draft);
      await this.repository.saveDraft({ ...draft }, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDraftSubmissionConfirmationById: Handler<
    api.GetDraftSubmissionConfirmationByIdRequest,
    api.GetDraftSubmissionConfirmationByIdResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);
      return success(draft.submissionConfirmation);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setDraftSubmissionDeclarationById: Handler<
    api.SetDraftSubmissionDeclarationByIdRequest,
    api.SetDraftSubmissionDeclarationByIdResponse
  > = async ({ id, accountId, value }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);

      if (draft.submissionDeclaration.status === 'CannotStart') {
        return fromBoom(Boom.badRequest());
      }

      if (!this.isCollectionDateValid(draft.collectionDate)) {
        draft.collectionDate = { status: 'NotStarted' };

        draft.submissionConfirmation =
          this.setSubmissionConfirmationStatus(draft);
        draft.submissionDeclaration =
          this.setSubmissionDeclarationStatus(draft);

        await this.repository.saveDraft({ ...draft }, accountId);
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
      const submissionState: DraftSubmission['submissionState'] =
        draft.collectionDate.status === 'Complete' &&
        draft.wasteQuantity.status === 'Complete' &&
        draft.collectionDate.value.type === 'ActualDate' &&
        draft.wasteQuantity.value.type === 'ActualData'
          ? { status: 'SubmittedWithActuals', timestamp: timestamp }
          : { status: 'SubmittedWithEstimates', timestamp: timestamp };

      await this.repository.saveDraft(
        {
          ...draft,
          submissionDeclaration: submissionDeclaration,
          submissionState: submissionState,
        },
        accountId
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

  getDraftSubmissionDeclarationById: Handler<
    api.GetDraftSubmissionDeclarationByIdRequest,
    api.GetDraftSubmissionDeclarationByIdResponse
  > = async ({ id, accountId }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);
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
