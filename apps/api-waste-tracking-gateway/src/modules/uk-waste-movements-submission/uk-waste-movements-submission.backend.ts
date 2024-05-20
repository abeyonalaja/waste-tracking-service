import {
  UkwmGetDraftsRequest,
  UkwmDraftSubmission,
  UkwmGetDraftsResult,
} from '@wts/api/waste-tracking-gateway';
import { Logger } from 'winston';
import Boom from '@hapi/boom';
import {
  GetDraftResponse,
  GetDraftsResponse,
} from '@wts/api/uk-waste-movements';
import { DaprUkWasteMovementsClient } from '@wts/client/uk-waste-movements';

export type SubmissionRef = {
  id: string;
};

export interface UkWasteMovementsSubmissionBackend {
  getUkwmSubmission(ref: SubmissionRef): Promise<UkwmDraftSubmission>;
  getDrafts(request: UkwmGetDraftsRequest): Promise<UkwmGetDraftsResult>;
}

export class ServiceUkWasteMovementsSubmissionBackend
  implements UkWasteMovementsSubmissionBackend
{
  constructor(
    protected client: DaprUkWasteMovementsClient,
    protected logger: Logger
  ) {}
  async getUkwmSubmission({ id }: SubmissionRef): Promise<UkwmDraftSubmission> {
    let response: GetDraftResponse;
    try {
      response = (await this.client.getDraft({
        id,
      })) as GetDraftResponse;
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value as UkwmDraftSubmission;
  }

  async getDrafts(request: UkwmGetDraftsRequest): Promise<UkwmGetDraftsResult> {
    let response: GetDraftsResponse;
    try {
      response = (await this.client.getDrafts(request)) as GetDraftsResponse;
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value as UkwmGetDraftsResult;
  }
}
