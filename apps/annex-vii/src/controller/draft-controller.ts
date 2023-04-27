import Boom from '@hapi/boom';
import * as api from '@wts/api/annex-vii';
import { fromBoom, success } from '@wts/util/invocation';
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
    async ({ accountId }) => {
      try {
        const value: DraftSubmission = {
          id: uuidv4(),
          reference: null,
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
}
