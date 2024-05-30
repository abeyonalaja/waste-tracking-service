import { DaprClient, HttpMethod } from '@dapr/dapr';
import {
  GetAddressByPostcodeRequest,
  GetAddressByPostcodeResponse,
  getAddressByPostcode,
} from '@wts/api/address';

export class DaprAddressClient {
  constructor(
    private daprClient: DaprClient,
    private addressAppId: string,
  ) {}

  async getAddressByPostcode(
    req: GetAddressByPostcodeRequest,
  ): Promise<GetAddressByPostcodeResponse> {
    return (await this.daprClient.invoker.invoke(
      this.addressAppId,
      getAddressByPostcode.name,
      HttpMethod.POST,
      req,
    )) as GetAddressByPostcodeResponse;
  }
}
