import { DaprClient, HttpMethod } from '@dapr/dapr';
import {
  addContentToBatch,
  AddContentToBatchRequest,
  AddContentToBatchResponse,
  getBatch,
  GetBatchRequest,
  GetBatchResponse,
  updateBatch,
  UpdateBatchRequest,
  UpdateBatchResponse,
} from '@wts/api/annex-vii-bulk';

export class DaprAnnexViiBulkClient {
  constructor(
    private daprClient: DaprClient,
    private annexViiBulkAppId: string
  ) {}

  async addContentToBatch(
    req: AddContentToBatchRequest
  ): Promise<AddContentToBatchResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiBulkAppId,
      addContentToBatch.name,
      HttpMethod.POST,
      req
    )) as AddContentToBatchResponse;
  }

  async getBatch(req: GetBatchRequest): Promise<GetBatchResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiBulkAppId,
      getBatch.name,
      HttpMethod.POST,
      req
    )) as GetBatchResponse;
  }

  async updateBatch(req: UpdateBatchRequest): Promise<UpdateBatchResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiBulkAppId,
      updateBatch.name,
      HttpMethod.POST,
      req
    )) as UpdateBatchResponse;
  }
}
