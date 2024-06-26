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
  DownloadBatchRequest,
  DownloadBatchResponse,
  downloadProducerCsv,
  getRow,
  GetRowRequest,
  GetRowResponse,
  getColumn,
  GetColumnRequest,
  GetColumnResponse,
  getBulkSubmissions,
  GetBulkSubmissionsRequest,
  GetBulkSubmissionsResponse,
} from '@wts/api/uk-waste-movements-bulk';

export class DaprUkWasteMovementsBulkClient {
  constructor(
    private daprClient: DaprClient,
    private ukWasteMovementsBulkAppId: string,
  ) {}

  async addContentToBatch(
    req: AddContentToBatchRequest,
  ): Promise<AddContentToBatchResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsBulkAppId,
      addContentToBatch.name,
      HttpMethod.POST,
      req,
    )) as AddContentToBatchResponse;
  }

  async getBatch(req: GetBatchRequest): Promise<GetBatchResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsBulkAppId,
      getBatch.name,
      HttpMethod.POST,
      req,
    )) as GetBatchResponse;
  }

  async finalizeBatch(
    req: FinalizeBatchRequest,
  ): Promise<FinalizeBatchResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsBulkAppId,
      finalizeBatch.name,
      HttpMethod.POST,
      req,
    )) as FinalizeBatchResponse;
  }

  async downloadProducerCsv(
    req: DownloadBatchRequest,
  ): Promise<DownloadBatchResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsBulkAppId,
      downloadProducerCsv.name,
      HttpMethod.POST,
      req,
    )) as DownloadBatchResponse;
  }

  async getRow(req: GetRowRequest): Promise<GetRowResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsBulkAppId,
      getRow.name,
      HttpMethod.POST,
      req,
    )) as GetRowResponse;
  }

  async getColumn(req: GetColumnRequest): Promise<GetColumnResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsBulkAppId,
      getColumn.name,
      HttpMethod.POST,
      req,
    )) as GetColumnResponse;
  }

  async getBulkSubmissions(
    req: GetBulkSubmissionsRequest,
  ): Promise<GetBulkSubmissionsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.ukWasteMovementsBulkAppId,
      getBulkSubmissions.name,
      HttpMethod.POST,
      req,
    )) as GetBulkSubmissionsResponse;
  }
}
