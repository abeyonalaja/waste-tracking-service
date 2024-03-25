import { DaprClient, HttpMethod } from '@dapr/dapr';
import { PingRequest, PingResponse, ping } from '@wts/api/uk-waste-movements';

export class DaprUkWasteMovementsClient {
  constructor(
    private daprClient: DaprClient,
    private ukWasteMovementsAppId: string
  ) {}

  async ping(req: PingRequest): Promise<PingResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsAppId,
      ping.name,
      HttpMethod.POST,
      req
    )) as PingResponse;
  }
}
