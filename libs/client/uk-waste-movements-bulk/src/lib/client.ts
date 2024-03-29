import { DaprClient, HttpMethod } from '@dapr/dapr';
import {
  addContentToBatch,
  AddContentToBatchRequest,
  AddContentToBatchResponse,
  FinalizeBatchRequest,
  FinalizeBatchResponse,
  GetBatchRequest,
  GetBatchResponse,
  getBatch,
  finalizeBatch,
} from '@wts/api/uk-waste-movements-bulk';

export class DaprUkWasteMovementsBulkClient {
  constructor(
    private daprClient: DaprClient,
    private ukWasteMovementsBulkAppId: string
  ) {}

  async addContentToBatch(
    req: AddContentToBatchRequest
  ): Promise<AddContentToBatchResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsBulkAppId,
      addContentToBatch.name,
      HttpMethod.POST,
      req
    )) as AddContentToBatchResponse;
  }

  async getBatch(req: GetBatchRequest): Promise<GetBatchResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsBulkAppId,
      getBatch.name,
      HttpMethod.POST,
      req
    )) as GetBatchResponse;
  }

  async finalizeBatch(
    req: FinalizeBatchRequest
  ): Promise<FinalizeBatchResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsBulkAppId,
      finalizeBatch.name,
      HttpMethod.POST,
      req
    )) as FinalizeBatchResponse;
  }
}
