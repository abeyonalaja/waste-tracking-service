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
}
