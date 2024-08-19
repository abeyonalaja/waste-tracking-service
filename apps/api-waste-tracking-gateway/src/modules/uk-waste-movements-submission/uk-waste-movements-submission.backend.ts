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
  UkwmCreateDraftSicCodeResponse,
  UkwmDraftSicCodes,
  UkwmGetDraftSicCodesResponse,
  UkwmDeleteDraftSicCodeResponse,
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
  GetDraftWasteCollectionAddressDetailsResponse,
  CreateDraftSicCodeResponse,
  GetDraftSicCodesResponse,
  GetDraftCarrierAddressDetailsResponse,
  GetDraftReceiverAddressDetailsResponse,
  DeleteDraftSicCodeResponse,
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

export interface CreateSicCodeRef {
  id: string;
  accountId: string;
  sicCode: string;
}

export interface DeleteSicCodeRef {
  id: string;
  accountId: string;
  code: string;
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
  setDraftWasteCollectionAddressDetails(
    ref: SubmissionRef,
    value: UkwmAddress,
    saveAsDraft: boolean,
  ): Promise<void>;
  getDraftWasteCollectionAddressDetails({
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
  createDraftSicCode(ref: CreateSicCodeRef): Promise<string>;
  getDraftSicCodes({
    id,
    accountId,
  }: SubmissionRef): Promise<UkwmDraftSicCodes>;
  setDraftCarrierAddressDetails(
    ref: SubmissionRef,
    value: UkwmAddress,
    saveAsDraft: boolean,
  ): Promise<void>;
  getDraftCarrierAddressDetails({
    id,
  }: SubmissionRef): Promise<UkwmDraftAddress | undefined>;
  setDraftReceiverAddressDetails(
    ref: SubmissionRef,
    value: UkwmAddress,
    saveAsDraft: boolean,
  ): Promise<void>;
  getDraftReceiverAddressDetails({
    id,
  }: SubmissionRef): Promise<UkwmDraftAddress | undefined>;
  deleteDraftSicCode({
    id,
    accountId,
    code,
  }: DeleteSicCodeRef): Promise<UkwmDeleteDraftSicCodeResponse>;
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

  async setDraftWasteCollectionAddressDetails(
    { id, accountId }: SubmissionRef,
    value: UkwmAddress,
    saveAsDraft: boolean,
  ): Promise<void> {
    let response: Response<void>;
    try {
      response = await this.client.setDraftWasteCollectionAddressDetails({
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

  async getDraftWasteCollectionAddressDetails({
    id,
    accountId,
  }: SubmissionRef): Promise<UkwmDraftAddress | undefined> {
    let response: GetDraftWasteCollectionAddressDetailsResponse;
    try {
      response = await this.client.getDraftWasteCollectionAddressDetails({
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

  async createDraftSicCode({
    id,
    accountId,
    sicCode,
  }: CreateSicCodeRef): Promise<string> {
    let response: CreateDraftSicCodeResponse;
    try {
      response = await this.client.createDraftSicCode({
        id,
        accountId,
        sicCode,
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

    return response.value as UkwmCreateDraftSicCodeResponse;
  }

  async getDraftSicCodes({
    id,
    accountId,
  }: SubmissionRef): Promise<UkwmDraftSicCodes> {
    let response: GetDraftSicCodesResponse;
    try {
      response = await this.client.getDraftSicCodes({
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

    return response.value as UkwmGetDraftSicCodesResponse;
  }

  async setDraftCarrierAddressDetails(
    { id, accountId }: SubmissionRef,
    value: UkwmAddress,
    saveAsDraft: boolean,
  ): Promise<void> {
    let response: Response<void>;
    try {
      response = await this.client.setDraftCarrierAddressDetails({
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

  async getDraftCarrierAddressDetails({
    id,
    accountId,
  }: SubmissionRef): Promise<UkwmDraftAddress | undefined> {
    let response: GetDraftCarrierAddressDetailsResponse;
    try {
      response = await this.client.getDraftCarrierAddressDetails({
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

  async setDraftReceiverAddressDetails(
    { id, accountId }: SubmissionRef,
    value: UkwmAddress,
    saveAsDraft: boolean,
  ): Promise<void> {
    let response: Response<void>;
    try {
      response = await this.client.setDraftReceiverAddressDetails({
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

  async getDraftReceiverAddressDetails({
    id,
    accountId,
  }: SubmissionRef): Promise<UkwmDraftAddress | undefined> {
    let response: GetDraftReceiverAddressDetailsResponse;
    try {
      response = await this.client.getDraftReceiverAddressDetails({
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

  async deleteDraftSicCode({
    id,
    accountId,
    code,
  }: DeleteSicCodeRef): Promise<UkwmDeleteDraftSicCodeResponse> {
    let response: DeleteDraftSicCodeResponse;
    try {
      response = await this.client.deleteDraftSicCode({
        id,
        accountId,
        code,
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

    return response.value as UkwmDeleteDraftSicCodeResponse;
  }
}
