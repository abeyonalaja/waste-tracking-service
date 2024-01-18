import { DaprClient, HttpMethod } from '@dapr/dapr';
import {
  addBatchContent,
  AddBatchContentRequest,
  AddBatchContentResponse,
  getBatchContent,
  GetBatchContentRequest,
  GetBatchContentResponse,
} from '@wts/api/annex-vii-bulk';

export class DaprAnnexViiBulkClient {
  constructor(
    private daprClient: DaprClient,
    private annexViiBulkAppId: string
  ) {}

  async addBatchContent(
    req: AddBatchContentRequest
  ): Promise<AddBatchContentResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiBulkAppId,
      addBatchContent.name,
      HttpMethod.POST,
      req
    )) as AddBatchContentResponse;
  }

  async getBatchContent(
    req: GetBatchContentRequest
  ): Promise<GetBatchContentResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiBulkAppId,
      getBatchContent.name,
      HttpMethod.POST,
      req
    )) as GetBatchContentResponse;
  }
}
