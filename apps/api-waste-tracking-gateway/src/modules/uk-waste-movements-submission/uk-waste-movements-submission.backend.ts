import {
  UkwmGetDraftsRequest,
  UkwmDraft,
  UkwmGetDraftsResult,
  UkwmCreateDraftResponse,
} from '@wts/api/waste-tracking-gateway';
import { Logger } from 'winston';
import Boom from '@hapi/boom';
import {
  GetDraftResponse,
  GetDraftsResponse,
  CreateDraftResponse,
} from '@wts/api/uk-waste-movements';
import { DaprUkWasteMovementsClient } from '@wts/client/uk-waste-movements';

export interface SubmissionRef {
  id: string;
}

export interface CreateDraftRef {
  reference: string;
  accountId: string;
}

export interface UkWasteMovementsSubmissionBackend {
  getUkwmSubmission(ref: SubmissionRef): Promise<UkwmDraft>;
  getDrafts(request: UkwmGetDraftsRequest): Promise<UkwmGetDraftsResult>;
  createDraft(request: CreateDraftRef): Promise<UkwmCreateDraftResponse>;
}

export class ServiceUkWasteMovementsSubmissionBackend
  implements UkWasteMovementsSubmissionBackend
{
  constructor(
    protected client: DaprUkWasteMovementsClient,
    protected logger: Logger,
  ) {}
  async getUkwmSubmission({ id }: SubmissionRef): Promise<UkwmDraft> {
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

    return response.value as UkwmDraft;
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

  async createDraft(request: CreateDraftRef): Promise<UkwmCreateDraftResponse> {
    let response: CreateDraftResponse;
    try {
      response = (await this.client.createDraft(
        request,
      )) as CreateDraftResponse;
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
        data: response.error.data,
      });
    }

    return response.value as UkwmCreateDraftResponse;
  }
}
