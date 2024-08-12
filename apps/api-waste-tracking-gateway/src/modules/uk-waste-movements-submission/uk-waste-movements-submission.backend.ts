import {
  UkwmGetDraftsRequest,
  UkwmDraft,
  UkwmGetDraftsResult,
  UkwmCreateDraftResponse,
  UkwmDraftAddress,
  UkwmAddress,
  UkwmDraftContact,
  UkwmGetDraftProducerContactDetailResponse,
  UkwmContact,
  UkwmDraftWasteSource,
  UkwmGetDraftWasteSourceResponse,
} from '@wts/api/waste-tracking-gateway';
import { Logger } from 'winston';
import Boom from '@hapi/boom';
import {
  GetDraftResponse,
  GetDraftsResponse,
  CreateDraftResponse,
  GetDraftProducerAddressDetailsResponse,
  GetDraftProducerContactDetailResponse,
  SetDraftProducerContactDetailResponse,
  SetDraftWasteSourceResponse,
  GetDraftWasteSourceResponse,
} from '@wts/api/uk-waste-movements';
import { DaprUkWasteMovementsClient } from '@wts/client/uk-waste-movements';
import { Response } from '@wts/util/invocation';

export interface UkwmDraftRef {
  id: string;
  accountId: string;
}

export interface SubmissionRef {
  id: string;
  accountId: string;
}

export interface CreateDraftRef {
  reference: string;
  accountId: string;
}

export interface SetWasteSourceRef {
  id: string;
  accountId: string;
  wasteSource: string;
}

export interface UkWasteMovementsSubmissionBackend {
  getDraft(ref: SubmissionRef): Promise<UkwmDraft>;
  getDrafts(request: UkwmGetDraftsRequest): Promise<UkwmGetDraftsResult>;
  createDraft(request: CreateDraftRef): Promise<UkwmCreateDraftResponse>;
  setDraftProducerAddressDetails(
    ref: SubmissionRef,
    value: UkwmAddress,
    saveAsDraft: boolean,
  ): Promise<void>;
  getDraftProducerAddressDetails({
    id,
  }: SubmissionRef): Promise<UkwmDraftAddress | undefined>;
  setDraftProducerContactDetail(
    ref: UkwmDraftRef,
    value: UkwmContact,
    saveAsDraft: boolean,
  ): Promise<void>;
  getDraftProducerContactDetail({
    id,
  }: SubmissionRef): Promise<UkwmDraftContact | undefined>;
  getDraftWasteSource({
    id,
    accountId,
  }: SubmissionRef): Promise<UkwmDraftWasteSource>;
  setDraftWasteSource(ref: SetWasteSourceRef): Promise<void>;
}

export class ServiceUkWasteMovementsSubmissionBackend
  implements UkWasteMovementsSubmissionBackend
{
  constructor(
    protected client: DaprUkWasteMovementsClient,
    protected logger: Logger,
  ) {}
  async getDraft({ id, accountId }: SubmissionRef): Promise<UkwmDraft> {
    let response: GetDraftResponse;
    try {
      response = (await this.client.getDraft({
        id,
        accountId,
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

  async setDraftProducerAddressDetails(
    { id, accountId }: SubmissionRef,
    value: UkwmAddress,
    saveAsDraft: boolean,
  ): Promise<void> {
    let response: Response<void>;
    try {
      response = await this.client.setDraftProducerAddressDetails({
        id,
        accountId,
        value,
        saveAsDraft,
      });
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
  }

  async getDraftProducerAddressDetails({
    id,
    accountId,
  }: SubmissionRef): Promise<UkwmDraftAddress | undefined> {
    let response: GetDraftProducerAddressDetailsResponse;
    try {
      response = await this.client.getDraftProducerAddressDetails({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }
    if (response) {
      if (!response.success) {
        throw new Boom.Boom(response.error.message, {
          statusCode: response.error.statusCode,
        });
      }
      return response.value;
    } else {
      return response;
    }
  }

  async getDraftProducerContactDetail({
    id,
    accountId,
  }: UkwmDraftRef): Promise<UkwmDraftContact | undefined> {
    let response: GetDraftProducerContactDetailResponse;
    try {
      response = await this.client.getDraftProducerContactDetail({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }
    if (response) {
      if (!response.success) {
        throw new Boom.Boom(response.error.message, {
          statusCode: response.error.statusCode,
        });
      }
      return response.value as UkwmGetDraftProducerContactDetailResponse;
    }
  }

  async setDraftProducerContactDetail(
    { id, accountId }: UkwmDraftRef,
    value: UkwmContact,
    saveAsDraft: boolean,
  ): Promise<void> {
    let response: SetDraftProducerContactDetailResponse;
    try {
      response = await this.client.setDraftProducerContactDetail({
        id,
        accountId,
        value,
        saveAsDraft,
      });
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
  }

  async getDraftWasteSource({
    id,
    accountId,
  }: SubmissionRef): Promise<UkwmDraftWasteSource> {
    let response: GetDraftWasteSourceResponse;
    try {
      response = await this.client.getDraftWasteSource({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value as UkwmGetDraftWasteSourceResponse;
  }

  async setDraftWasteSource({
    id,
    accountId,
    wasteSource,
  }: SetWasteSourceRef): Promise<void> {
    let response: SetDraftWasteSourceResponse;
    try {
      response = await this.client.setDraftWasteSource({
        id,
        accountId,
        wasteSource,
      });
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
  }
}
