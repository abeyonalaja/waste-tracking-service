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
  SetDraftWasteSourceRequest,
  SetDraftWasteSourceResponse,
  GetDraftWasteSourceRequest,
  GetDraftWasteSourceResponse,
  getDraftWasteSource,
  GetDraftWasteCollectionAddressDetailsRequest,
  GetDraftWasteCollectionAddressDetailsResponse,
  SetDraftWasteCollectionAddressDetailsRequest,
  SetDraftWasteCollectionAddressDetailsResponse,
  getDraftWasteCollectionAddressDetails,
  setDraftWasteCollectionAddressDetails,
  CreateDraftSicCodeRequest,
  CreateDraftSicCodeResponse,
  createDraftSicCode,
  GetDraftSicCodesRequest,
  GetDraftSicCodesResponse,
  getDraftSicCodes,
  GetDraftCarrierAddressDetailsRequest,
  GetDraftCarrierAddressDetailsResponse,
  SetDraftCarrierAddressDetailsRequest,
  SetDraftCarrierAddressDetailsResponse,
  getDraftCarrierAddressDetails,
  setDraftCarrierAddressDetails,
  GetDraftReceiverAddressDetailsRequest,
  GetDraftReceiverAddressDetailsResponse,
  SetDraftReceiverAddressDetailsRequest,
  SetDraftReceiverAddressDetailsResponse,
  getDraftReceiverAddressDetails,
  setDraftReceiverAddressDetails,
  DeleteDraftSicCodeRequest,
  DeleteDraftSicCodeResponse,
  deleteDraftSicCode,
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

  async getDraftWasteSource(
    req: GetDraftWasteSourceRequest,
  ): Promise<GetDraftWasteSourceResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      getDraftWasteSource.name,
      HttpMethod.POST,
      req,
    )) as GetDraftWasteSourceResponse;
  }

  async setDraftWasteSource(
    req: SetDraftWasteSourceRequest,
  ): Promise<SetDraftWasteSourceResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      this.setDraftWasteSource.name,
      HttpMethod.POST,
      req,
    )) as SetDraftWasteSourceResponse;
  }

  async getDraftWasteCollectionAddressDetails(
    req: GetDraftWasteCollectionAddressDetailsRequest,
  ): Promise<GetDraftWasteCollectionAddressDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      getDraftWasteCollectionAddressDetails.name,
      HttpMethod.POST,
      req,
    )) as GetDraftWasteCollectionAddressDetailsResponse;
  }

  async setDraftWasteCollectionAddressDetails(
    req: SetDraftWasteCollectionAddressDetailsRequest,
  ): Promise<SetDraftWasteCollectionAddressDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      setDraftWasteCollectionAddressDetails.name,
      HttpMethod.POST,
      req,
    )) as SetDraftWasteCollectionAddressDetailsResponse;
  }

  async createDraftSicCode(
    req: CreateDraftSicCodeRequest,
  ): Promise<CreateDraftSicCodeResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      createDraftSicCode.name,
      HttpMethod.POST,
      req,
    )) as CreateDraftSicCodeResponse;
  }

  async getDraftSicCodes(
    req: GetDraftSicCodesRequest,
  ): Promise<GetDraftSicCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      getDraftSicCodes.name,
      HttpMethod.POST,
      req,
    )) as GetDraftSicCodesResponse;
  }

  async getDraftCarrierAddressDetails(
    req: GetDraftCarrierAddressDetailsRequest,
  ): Promise<GetDraftCarrierAddressDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      getDraftCarrierAddressDetails.name,
      HttpMethod.POST,
      req,
    )) as GetDraftCarrierAddressDetailsResponse;
  }

  async setDraftCarrierAddressDetails(
    req: SetDraftCarrierAddressDetailsRequest,
  ): Promise<SetDraftCarrierAddressDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      setDraftCarrierAddressDetails.name,
      HttpMethod.POST,
      req,
    )) as SetDraftCarrierAddressDetailsResponse;
  }

  async getDraftReceiverAddressDetails(
    req: GetDraftReceiverAddressDetailsRequest,
  ): Promise<GetDraftReceiverAddressDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      getDraftReceiverAddressDetails.name,
      HttpMethod.POST,
      req,
    )) as GetDraftReceiverAddressDetailsResponse;
  }

  async setDraftReceiverAddressDetails(
    req: SetDraftReceiverAddressDetailsRequest,
  ): Promise<SetDraftReceiverAddressDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      setDraftReceiverAddressDetails.name,
      HttpMethod.POST,
      req,
    )) as SetDraftReceiverAddressDetailsResponse;
  }

  async deleteDraftSicCode(
    req: DeleteDraftSicCodeRequest,
  ): Promise<DeleteDraftSicCodeResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      deleteDraftSicCode.name,
      HttpMethod.POST,
      req,
    )) as DeleteDraftSicCodeResponse;
  }
}
