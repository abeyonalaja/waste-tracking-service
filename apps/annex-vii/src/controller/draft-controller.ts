import Boom from '@hapi/boom';
import * as api from '@wts/api/annex-vii';
import { fromBoom, success } from '@wts/util/invocation';
import { differenceInBusinessDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import { DraftRepository } from '../data';
import { DraftSubmission } from '../model';

export type Handler<Request, Response> = (
  request: Request
) => Promise<Response>;

type DraftWasteDescription = api.DraftSubmission['wasteDescription'];

function isWasteCodeChangingBulkToSmall(
  currentWasteDescription: DraftWasteDescription,
  newWasteDescription: DraftWasteDescription
): boolean {
  return (
    currentWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type !== 'NotApplicable' &&
    newWasteDescription.status !== 'NotStarted' &&
    newWasteDescription.wasteCode?.type === 'NotApplicable'
  );
}

function isWasteCodeChangingSmallToBulk(
  currentWasteDescription: DraftWasteDescription,
  newWasteDescription: DraftWasteDescription
): boolean {
  return (
    currentWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type === 'NotApplicable' &&
    newWasteDescription.status !== 'NotStarted' &&
    newWasteDescription.wasteCode?.type !== 'NotApplicable'
  );
}

function isWasteCodeChangingBulkToBulkDifferentType(
  currentWasteDescription: DraftWasteDescription,
  newWasteDescription: DraftWasteDescription
): boolean {
  return (
    currentWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type !== 'NotApplicable' &&
    newWasteDescription.status !== 'NotStarted' &&
    newWasteDescription.wasteCode?.type !== 'NotApplicable' &&
    currentWasteDescription.wasteCode?.type !==
      newWasteDescription.wasteCode?.type
  );
}

function isWasteCodeChangingBulkToBulkSameType(
  currentWasteDescription: DraftWasteDescription,
  newWasteDescription: DraftWasteDescription
): boolean {
  return (
    currentWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type !== 'NotApplicable' &&
    newWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type ===
      newWasteDescription.wasteCode?.type &&
    currentWasteDescription.wasteCode?.value !==
      newWasteDescription.wasteCode?.value
  );
}

export default class DraftController {
  constructor(private repository: DraftRepository, private logger: Logger) {}

  isCollectionDateValid(date: DraftSubmission['collectionDate']) {
    if (date.status !== 'NotStarted') {
      const { day: dayStr, month: monthStr, year: yearStr } = date.value;

      const [day, month, year] = [
        parseInt(dayStr),
        parseInt(monthStr) - 1,
        parseInt(yearStr),
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
    submission: DraftSubmission
  ): DraftSubmission['submissionConfirmation'] {
    const {
      id,
      reference,
      submissionConfirmation,
      submissionDeclaration,
      ...filteredValues
    } = submission;

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
    submission: DraftSubmission
  ): DraftSubmission['submissionDeclaration'] {
    if (submission.submissionConfirmation.status === 'Complete') {
      return { status: 'NotStarted' };
    } else {
      return { status: 'CannotStart' };
    }
  }

  getDrafts: Handler<api.GetDraftsRequest, api.GetDraftsResponse> = async ({
    accountId,
  }) => {
    try {
      return success(await this.repository.getDrafts(accountId));
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDraftById: Handler<api.GetDraftByIdRequest, api.GetDraftByIdResponse> =
    async ({ id, accountId }) => {
      try {
        return success(await this.repository.getDraft(id, accountId));
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
        if (reference && reference.length > 20) {
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
  > = async ({ id, accountId, value }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);
      if (value && value.length > 20) {
        return fromBoom(
          Boom.badRequest('Supplied reference cannot exceed 20 characters')
        );
      }

      draft.reference = value;

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

      let recoveryFacilityDetail: DraftSubmission['recoveryFacilityDetail'] =
        draft.recoveryFacilityDetail.status === 'CannotStart' &&
        value.status !== 'NotStarted' &&
        value.wasteCode !== undefined
          ? { status: 'NotStarted' }
          : draft.recoveryFacilityDetail;

      let carriers: DraftSubmission['carriers'] = draft.carriers;

      if (
        draft.wasteDescription.status === 'NotStarted' &&
        value.status !== 'NotStarted' &&
        value.wasteCode?.type === 'NotApplicable'
      ) {
        carriers.transport = false;
      }

      if (isWasteCodeChangingBulkToSmall(draft.wasteDescription, value)) {
        if (value.status === 'Started') {
          value.ewcCodes = undefined;
          value.nationalCode = undefined;
          value.description = undefined;
        }

        wasteQuantity = { status: 'NotStarted' };

        carriers = { status: 'NotStarted', transport: false };

        recoveryFacilityDetail = { status: 'NotStarted' };
      }

      if (isWasteCodeChangingSmallToBulk(draft.wasteDescription, value)) {
        if (value.status === 'Started') {
          value.ewcCodes = undefined;
          value.nationalCode = undefined;
          value.description = undefined;
        }

        wasteQuantity = { status: 'NotStarted' };

        carriers = { status: 'NotStarted', transport: true };

        recoveryFacilityDetail = { status: 'NotStarted' };
      }

      if (
        isWasteCodeChangingBulkToBulkDifferentType(
          draft.wasteDescription,
          value
        )
      ) {
        if (value.status === 'Started') {
          value.ewcCodes = undefined;
          value.nationalCode = undefined;
          value.description = undefined;
        }

        wasteQuantity = { status: 'NotStarted' };

        carriers = { status: 'NotStarted', transport: true };

        recoveryFacilityDetail = { status: 'NotStarted' };
      }

      if (
        isWasteCodeChangingBulkToBulkSameType(draft.wasteDescription, value)
      ) {
        if (value.status === 'Started') {
          value.ewcCodes = undefined;
          value.nationalCode = undefined;
          value.description = undefined;
        }

        if (
          draft.wasteQuantity.status !== 'CannotStart' &&
          draft.wasteQuantity.status !== 'NotStarted'
        ) {
          wasteQuantity = {
            status: 'Started',
            value: draft.wasteQuantity.value,
          };
        }

        if (draft.carriers.status !== 'NotStarted') {
          carriers = {
            status: 'Started',
            transport: true,
            values: draft.carriers.values,
          };
        }

        if (
          draft.recoveryFacilityDetail.status === 'Started' ||
          draft.recoveryFacilityDetail.status === 'Complete'
        ) {
          recoveryFacilityDetail = {
            status: 'Started',
            values: draft.recoveryFacilityDetail.values,
          };
        }
      }

      draft.wasteDescription = value;
      draft.wasteQuantity = wasteQuantity;
      draft.carriers = carriers;
      draft.recoveryFacilityDetail = recoveryFacilityDetail;

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
      draft.wasteQuantity = value;

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
      draft.exporterDetail = value;

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
      draft.importerDetail = value;

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
      if (!this.isCollectionDateValid(value))
        return fromBoom(
          Boom.badRequest(
            'Date should be at least three business days in the future'
          )
        );

      const draft = await this.repository.getDraft(id, accountId);
      draft.collectionDate = value;

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

      const transport: api.DraftCarriers['transport'] =
        draft.wasteDescription.status !== 'NotStarted' &&
        draft.wasteDescription.wasteCode?.type === 'NotApplicable'
          ? false
          : true;

      const carrier = { id: uuidv4() };
      if (draft.carriers.status === 'NotStarted') {
        draft.carriers = {
          status: value.status,
          transport: transport,
          values: [carrier],
        };

        draft.submissionConfirmation =
          this.setSubmissionConfirmationStatus(draft);
        draft.submissionDeclaration =
          this.setSubmissionDeclarationStatus(draft);

        await this.repository.saveDraft({ ...draft }, accountId);
        return success(draft.carriers);
      }

      if (draft.carriers.values.length === 5) {
        return fromBoom(Boom.badRequest('Cannot add more than 5 carriers'));
      }

      const carriers: api.DraftCarrier[] = [];
      for (const c of draft.carriers.values) {
        carriers.push(c);
      }
      carriers.push(carrier);
      draft.carriers = {
        status: value.status,
        transport: transport,
        values: carriers,
      };

      draft.submissionConfirmation =
        this.setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = this.setSubmissionDeclarationStatus(draft);

      await this.repository.saveDraft({ ...draft }, accountId);
      return success({
        status: value.status,
        transport: transport,
        values: [carrier],
      });
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

      const value: api.DraftCarriers = {
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

  setDraftCarriers: Handler<
    api.SetDraftCarriersRequest,
    api.SetDraftCarriersResponse
  > = async ({ id, accountId, carrierId, value }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);
      if (draft.carriers.status === 'NotStarted') {
        return fromBoom(Boom.notFound());
      }

      if (value.status === 'NotStarted') {
        draft.carriers = value;

        draft.submissionConfirmation =
          this.setSubmissionConfirmationStatus(draft);
        draft.submissionDeclaration =
          this.setSubmissionDeclarationStatus(draft);

        await this.repository.saveDraft({ ...draft }, accountId);
        return success(undefined);
      }

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

      draft.carriers.status = value.status;
      draft.carriers.values[index] = carrier as api.DraftCarrier;

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
      if (draft.carriers.status === 'NotStarted') {
        return fromBoom(Boom.notFound());
      }

      const index = draft.carriers.values.findIndex((c) => {
        return c.id === carrierId;
      });

      if (index === -1) {
        return fromBoom(Boom.notFound());
      }

      draft.carriers.values.splice(index, 1);
      if (draft.carriers.values.length === 0) {
        const transport: api.DraftCarriers['transport'] =
          draft.wasteDescription.status !== 'NotStarted' &&
          draft.wasteDescription.wasteCode?.type === 'NotApplicable'
            ? false
            : true;

        draft.carriers = {
          status: 'NotStarted',
          transport: transport,
        };
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
      draft.collectionDetail = value;

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

  setDraftExitLocationById: Handler<
    api.SetDraftExitLocationByIdRequest,
    api.SetDraftExitLocationByIdResponse
  > = async ({ id, accountId, value }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);
      draft.ukExitLocation = value;

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

  setDraftTransitCountries: Handler<
    api.SetDraftTransitCountriesRequest,
    api.SetDraftTransitCountriesResponse
  > = async ({ id, accountId, value }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);
      draft.transitCountries = value;

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

      const rfdId = { id: uuidv4() };
      if (
        draft.recoveryFacilityDetail.status !== 'Started' &&
        draft.recoveryFacilityDetail.status !== 'Complete'
      ) {
        draft.recoveryFacilityDetail = {
          status: value.status,
          values: [rfdId],
        };

        draft.submissionConfirmation =
          this.setSubmissionConfirmationStatus(draft);
        draft.submissionDeclaration =
          this.setSubmissionDeclarationStatus(draft);

        await this.repository.saveDraft({ ...draft }, accountId);
        return success(draft.recoveryFacilityDetail);
      }

      if (draft.recoveryFacilityDetail.values.length === 3) {
        return fromBoom(
          Boom.badRequest(
            'Cannot add more than 3 recovery facilities (Maximum: 1 InterimSite & 2 Recovery Facilities )'
          )
        );
      }

      const recoveryFacility = [];
      for (const rfd of draft.recoveryFacilityDetail.values) {
        recoveryFacility.push(rfd);
      }
      recoveryFacility.push(rfdId);
      draft.recoveryFacilityDetail = {
        status: value.status,
        values: recoveryFacility,
      };

      draft.submissionConfirmation =
        this.setSubmissionConfirmationStatus(draft);
      draft.submissionDeclaration = this.setSubmissionDeclarationStatus(draft);

      await this.repository.saveDraft({ ...draft }, accountId);
      return success({
        status: value.status,
        values: [rfdId],
      });
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

      const value: api.DraftRecoveryFacilityDetail = {
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

  setDraftRecoveryFacilityDetails: Handler<
    api.SetDraftRecoveryFacilityDetailsRequest,
    api.SetDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId, rfdId, value }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);
      if (
        draft.recoveryFacilityDetail.status !== 'Started' &&
        draft.recoveryFacilityDetail.status !== 'Complete'
      ) {
        return fromBoom(Boom.notFound());
      }

      if (value.status !== 'Started' && value.status !== 'Complete') {
        draft.recoveryFacilityDetail = value;

        draft.submissionConfirmation =
          this.setSubmissionConfirmationStatus(draft);
        draft.submissionDeclaration =
          this.setSubmissionDeclarationStatus(draft);

        await this.repository.saveDraft({ ...draft }, accountId);
        return success(undefined);
      }

      const recoveryFacility = value.values.find((c) => {
        return c.id === rfdId;
      });
      if (recoveryFacility === undefined) {
        return fromBoom(Boom.badRequest());
      }

      const index = draft.recoveryFacilityDetail.values.findIndex((c) => {
        return c.id === rfdId;
      });
      if (index === -1) {
        return fromBoom(Boom.notFound());
      }

      draft.recoveryFacilityDetail.status = value.status;
      draft.recoveryFacilityDetail.values[index] = recoveryFacility;

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
      if (
        draft.recoveryFacilityDetail.status !== 'Started' &&
        draft.recoveryFacilityDetail.status !== 'Complete'
      ) {
        return fromBoom(Boom.notFound());
      }

      const index = draft.recoveryFacilityDetail.values.findIndex((c) => {
        return c.id === rfdId;
      });

      if (index === -1) {
        return fromBoom(Boom.notFound());
      }

      draft.recoveryFacilityDetail.values.splice(index, 1);
      if (draft.recoveryFacilityDetail.values.length === 0) {
        draft.recoveryFacilityDetail = { status: 'NotStarted' };
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

      await this.repository.saveDraft(
        { ...draft, submissionDeclaration: submissionDeclaration },
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
