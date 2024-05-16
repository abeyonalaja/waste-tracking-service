import { DaprClient, HttpMethod } from '@dapr/dapr';
import {
  CreateSubmissionsRequest,
  CreateSubmissionsResponse,
  GetDraftRequest,
  GetDraftResponse,
  ValidateSubmissionsRequest,
  ValidateSubmissionsResponse,
  createSubmissions,
  getDraft,
  validateSubmissions,
} from '@wts/api/uk-waste-movements';

export class DaprUkWasteMovementsClient {
  constructor(
    private daprClient: DaprClient,
    private ukWasteMovementsAppId: string
  ) {}

  async validateSubmissions(
    req: ValidateSubmissionsRequest
  ): Promise<ValidateSubmissionsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      validateSubmissions.name,
      HttpMethod.POST,
      req
    )) as ValidateSubmissionsResponse;
  }

  async createSubmissions(
    req: CreateSubmissionsRequest
  ): Promise<CreateSubmissionsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      createSubmissions.name,
      HttpMethod.POST,
      req
    )) as CreateSubmissionsResponse;
  }

  async getDraft(req: GetDraftRequest): Promise<GetDraftResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      getDraft.name,
      HttpMethod.POST,
      req
    )) as GetDraftResponse;
  }
}
