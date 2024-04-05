import { DaprClient, HttpMethod } from '@dapr/dapr';
import {
  ValidateSubmissionsRequest,
  ValidateSubmissionsResponse,
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
}
