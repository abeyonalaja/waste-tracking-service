import { DaprClient, HttpMethod } from '@dapr/dapr';
import {
  CreateMultipleDraftsRequest,
  CreateMultipleDraftsResponse,
  GetDraftRequest,
  GetDraftResponse,
  ValidateMultipleDraftsRequest,
  ValidateMultipleDraftsResponse,
  createMultipleDrafts,
  GetDraftsRequest,
  GetDraftsResponse,
  validateMultipleDrafts,
  getDrafts,
  getDraft,
  CreateDraftRequest,
  CreateDraftResponse,
  createDraft,
  SetDraftProducerAddressDetailsRequest,
  SetDraftProducerAddressDetailsResponse,
  setDraftProducerAddressDetails,
  GetDraftProducerAddressDetailsRequest,
  GetDraftProducerAddressDetailsResponse,
  getDraftProducerAddressDetails,
  SetDraftProducerContactDetailRequest,
  SetDraftProducerContactDetailResponse,
  setDraftProducerContactDetail,
  getDraftProducerContactDetail,
  GetDraftProducerContactDetailRequest,
  GetDraftProducerContactDetailResponse,
} from '@wts/api/uk-waste-movements';

export class DaprUkWasteMovementsClient {
  constructor(
    private daprClient: DaprClient,
    private ukWasteMovementsAppId: string,
  ) {}

  async validateSubmissions(
    req: ValidateMultipleDraftsRequest,
  ): Promise<ValidateMultipleDraftsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      validateMultipleDrafts.name,
      HttpMethod.POST,
      req,
    )) as ValidateMultipleDraftsResponse;
  }

  async createSubmissions(
    req: CreateMultipleDraftsRequest,
  ): Promise<CreateMultipleDraftsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      createMultipleDrafts.name,
      HttpMethod.POST,
      req,
    )) as CreateMultipleDraftsResponse;
  }

  async getDraft(req: GetDraftRequest): Promise<GetDraftResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      getDraft.name,
      HttpMethod.POST,
      req,
    )) as GetDraftResponse;
  }

  async getDrafts(req: GetDraftsRequest): Promise<GetDraftsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      getDrafts.name,
      HttpMethod.POST,
      req,
    )) as GetDraftsResponse;
  }

  async createDraft(req: CreateDraftRequest): Promise<CreateDraftResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      createDraft.name,
      HttpMethod.POST,
      req,
    )) as CreateDraftResponse;
  }

  async getDraftProducerAddressDetails(
    req: GetDraftProducerAddressDetailsRequest,
  ): Promise<GetDraftProducerAddressDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      getDraftProducerAddressDetails.name,
      HttpMethod.POST,
      req,
    )) as GetDraftProducerAddressDetailsResponse;
  }

  async setDraftProducerAddressDetails(
    req: SetDraftProducerAddressDetailsRequest,
  ): Promise<SetDraftProducerAddressDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      setDraftProducerAddressDetails.name,
      HttpMethod.POST,
      req,
    )) as SetDraftProducerAddressDetailsResponse;
  }

  async getDraftProducerContactDetail(
    req: GetDraftProducerContactDetailRequest,
  ): Promise<GetDraftProducerContactDetailResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      getDraftProducerContactDetail.name,
      HttpMethod.POST,
      req,
    )) as GetDraftProducerContactDetailResponse;
  }

  async setDraftProducerContactDetail(
    req: SetDraftProducerContactDetailRequest,
  ): Promise<SetDraftProducerContactDetailResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      setDraftProducerContactDetail.name,
      HttpMethod.POST,
      req,
    )) as SetDraftProducerContactDetailResponse;
  }
}
