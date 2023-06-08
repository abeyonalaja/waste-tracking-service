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

export default class DraftController {
  constructor(private repository: DraftRepository, private logger: Logger) {}

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
        const value: DraftSubmission = {
          id: uuidv4(),
          reference,
          wasteDescription: { status: 'NotStarted' },
          wasteQuantity: { status: 'CannotStart' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          carriers: { status: 'NotStarted' },
          collectionDetail: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          transitCountries: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'CannotStart' },
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
      await this.repository.saveDraft(
        { ...draft, reference: value },
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

      let carriers: DraftSubmission['carriers'] = draft.carriers;

      if (
        draft.wasteDescription.status !== 'NotStarted' &&
        draft.wasteDescription.wasteCode?.type !== 'NotApplicable' &&
        value.status !== 'NotStarted' &&
        value.wasteCode?.type === 'NotApplicable'
      ) {
        wasteQuantity = { status: 'NotStarted' };

        if (draft.carriers.status !== 'NotStarted') {
          const updatedCarriers: api.DraftCarrier[] = [];
          for (const c of draft.carriers.values) {
            const carrier: api.DraftCarrier = {
              id: c.id,
              addressDetails: c.addressDetails,
              contactDetails: c.contactDetails,
            };
            updatedCarriers.push(carrier);
          }
          carriers = {
            status: 'Started',
            values: updatedCarriers,
          };
        }
      }

      if (
        draft.wasteDescription.status !== 'NotStarted' &&
        draft.wasteDescription.wasteCode?.type === 'NotApplicable' &&
        value.status !== 'NotStarted' &&
        value.wasteCode?.type !== 'NotApplicable'
      ) {
        wasteQuantity = { status: 'NotStarted' };
      }

      const recoveryFacilityDetail: DraftSubmission['recoveryFacilityDetail'] =
        draft.recoveryFacilityDetail.status === 'CannotStart' &&
        value.status !== 'NotStarted' &&
        value.wasteCode !== undefined
          ? { status: 'NotStarted' }
          : draft.recoveryFacilityDetail;

      await this.repository.saveDraft(
        {
          ...draft,
          wasteDescription: value,
          wasteQuantity,
          carriers,
          recoveryFacilityDetail,
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
      await this.repository.saveDraft(
        { ...draft, wasteQuantity: value },
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
      await this.repository.saveDraft(
        { ...draft, exporterDetail: value },
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
      await this.repository.saveDraft(
        { ...draft, importerDetail: value },
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
      if (value.status !== 'NotStarted') {
        const { day: dayStr, month: monthStr, year: yearStr } = value.value;

        const [day, month, year] = [
          parseInt(dayStr),
          parseInt(monthStr) - 1,
          parseInt(yearStr),
        ];

        if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
          return fromBoom(Boom.badRequest('Invalid date'));
        }

        if (
          differenceInBusinessDays(new Date(year, month, day), new Date()) < 3
        ) {
          return fromBoom(
            Boom.badRequest(
              'Date should be at least three business days in the future'
            )
          );
        }
      }

      const draft = await this.repository.getDraft(id, accountId);
      await this.repository.saveDraft(
        { ...draft, collectionDate: value },
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

      const carrier = { id: uuidv4() };
      if (draft.carriers.status === 'NotStarted') {
        draft.carriers = {
          status: value.status,
          values: [carrier],
        };

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
        values: carriers,
      };

      await this.repository.saveDraft({ ...draft }, accountId);
      return success({
        status: value.status,
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
        draft.carriers = { status: 'NotStarted' };
      }

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
      await this.repository.saveDraft(
        { ...draft, collectionDetail: value },
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

  setDraftExitLocationById: Handler<
    api.SetDraftExitLocationByIdRequest,
    api.SetDraftExitLocationByIdResponse
  > = async ({ id, accountId, value }) => {
    try {
      const draft = await this.repository.getDraft(id, accountId);
      await this.repository.saveDraft(
        { ...draft, ukExitLocation: value },
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
      await this.repository.saveDraft(
        { ...draft, transitCountries: value },
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
}
