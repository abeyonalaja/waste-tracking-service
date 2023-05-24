import { DaprClient, HttpMethod } from '@dapr/dapr';
import {
  CreateDraftRequest,
  CreateDraftResponse,
  GetDraftByIdRequest,
  GetDraftByIdResponse,
  GetDraftCustomerReferenceByIdRequest,
  GetDraftCustomerReferenceByIdResponse,
  GetDraftExporterDetailByIdRequest,
  GetDraftExporterDetailByIdResponse,
  GetDraftImporterDetailByIdRequest,
  GetDraftImporterDetailByIdResponse,
  GetDraftWasteDescriptionByIdRequest,
  GetDraftWasteDescriptionByIdResponse,
  GetDraftWasteQuantityByIdRequest,
  GetDraftWasteQuantityByIdResponse,
  GetDraftCollectionDateByIdResponse,
  GetDraftCollectionDateByIdRequest,
  GetDraftExitLocationByIdRequest,
  GetDraftExitLocationByIdResponse,
  GetDraftsRequest,
  GetDraftsResponse,
  SetDraftCustomerReferenceByIdRequest,
  SetDraftCustomerReferenceByIdResponse,
  SetDraftExporterDetailByIdRequest,
  SetDraftExporterDetailByIdResponse,
  SetDraftImporterDetailByIdRequest,
  SetDraftImporterDetailByIdResponse,
  SetDraftWasteDescriptionByIdRequest,
  SetDraftWasteDescriptionByIdResponse,
  SetDraftWasteQuantityByIdRequest,
  SetDraftWasteQuantityByIdResponse,
  SetDraftCollectionDateByIdRequest,
  SetDraftCollectionDateByIdResponse,
  ListDraftCarriersRequest,
  ListDraftCarriersResponse,
  CreateDraftCarriersRequest,
  CreateDraftCarriersResponse,
  GetDraftCarriersRequest,
  GetDraftCarriersResponse,
  SetDraftCarriersRequest,
  SetDraftCarriersResponse,
  DeleteDraftCarriersRequest,
  DeleteDraftCarriersResponse,
  SetDraftExitLocationByIdRequest,
  SetDraftExitLocationByIdResponse,
  createDraft,
  getDraftById,
  getDraftCustomerReferenceById,
  getDraftExporterDetailById,
  getDraftImporterDetailById,
  getDraftWasteDescriptionById,
  getDraftWasteQuantityById,
  getDraftCollectionDateById,
  getDraftExitLocationById,
  getDrafts,
  setDraftCustomerReferenceById,
  setDraftExporterDetailById,
  setDraftImporterDetailById,
  setDraftWasteDescriptionById,
  setDraftWasteQuantityById,
  setDraftCollectionDateById,
  listDraftCarriers,
  createDraftCarriers,
  getDraftCarriers,
  setDraftCarriers,
  deleteDraftCarriers,
  setDraftExitLocationById,
} from '@wts/api/annex-vii';

export class DaprAnnexViiClient {
  constructor(private daprClient: DaprClient, private annexViiAppId: string) {}

  async getDrafts(req: GetDraftsRequest): Promise<GetDraftsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getDrafts.name,
      HttpMethod.POST,
      req
    )) as GetDraftsResponse;
  }

  async getDraftById(req: GetDraftByIdRequest): Promise<GetDraftByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getDraftById.name,
      HttpMethod.POST,
      req
    )) as GetDraftByIdResponse;
  }

  async createDraft(req: CreateDraftRequest): Promise<CreateDraftResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      createDraft.name,
      HttpMethod.POST,
      req
    )) as CreateDraftResponse;
  }

  async getDraftCustomerReferenceById(
    req: GetDraftCustomerReferenceByIdRequest
  ): Promise<GetDraftCustomerReferenceByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getDraftCustomerReferenceById.name,
      HttpMethod.POST,
      req
    )) as GetDraftCustomerReferenceByIdResponse;
  }

  async setDraftCustomerReferenceById(
    req: SetDraftCustomerReferenceByIdRequest
  ): Promise<SetDraftCustomerReferenceByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setDraftCustomerReferenceById.name,
      HttpMethod.POST,
      req
    )) as SetDraftCustomerReferenceByIdResponse;
  }

  async getDraftWasteDescriptionById(
    req: GetDraftWasteDescriptionByIdRequest
  ): Promise<GetDraftWasteDescriptionByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getDraftWasteDescriptionById.name,
      HttpMethod.POST,
      req
    )) as GetDraftWasteDescriptionByIdResponse;
  }

  async setDraftWasteDescriptionById(
    req: SetDraftWasteDescriptionByIdRequest
  ): Promise<SetDraftWasteDescriptionByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setDraftWasteDescriptionById.name,
      HttpMethod.POST,
      req
    )) as SetDraftWasteDescriptionByIdResponse;
  }

  async getDraftWasteQuantityById(
    req: GetDraftWasteQuantityByIdRequest
  ): Promise<GetDraftWasteQuantityByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getDraftWasteQuantityById.name,
      HttpMethod.POST,
      req
    )) as GetDraftWasteQuantityByIdResponse;
  }

  async setDraftWasteQuantityById(
    req: SetDraftWasteQuantityByIdRequest
  ): Promise<SetDraftWasteQuantityByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setDraftWasteQuantityById.name,
      HttpMethod.POST,
      req
    )) as SetDraftWasteQuantityByIdResponse;
  }

  async getDraftExporterDetailById(
    req: GetDraftExporterDetailByIdRequest
  ): Promise<GetDraftExporterDetailByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getDraftExporterDetailById.name,
      HttpMethod.POST,
      req
    )) as GetDraftExporterDetailByIdResponse;
  }

  async setDraftExporterDetailById(
    req: SetDraftExporterDetailByIdRequest
  ): Promise<SetDraftExporterDetailByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setDraftExporterDetailById.name,
      HttpMethod.POST,
      req
    )) as SetDraftExporterDetailByIdResponse;
  }

  async getDraftImporterDetailById(
    req: GetDraftImporterDetailByIdRequest
  ): Promise<GetDraftImporterDetailByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getDraftImporterDetailById.name,
      HttpMethod.POST,
      req
    )) as GetDraftImporterDetailByIdResponse;
  }

  async setDraftImporterDetailById(
    req: SetDraftImporterDetailByIdRequest
  ): Promise<SetDraftImporterDetailByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setDraftImporterDetailById.name,
      HttpMethod.POST,
      req
    )) as SetDraftImporterDetailByIdResponse;
  }

  async getDraftCollectionDateById(
    req: GetDraftCollectionDateByIdRequest
  ): Promise<GetDraftCollectionDateByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getDraftCollectionDateById.name,
      HttpMethod.POST,
      req
    )) as GetDraftCollectionDateByIdResponse;
  }

  async setDraftCollectionDatelById(
    req: SetDraftCollectionDateByIdRequest
  ): Promise<SetDraftCollectionDateByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setDraftCollectionDateById.name,
      HttpMethod.POST,
      req
    )) as SetDraftCollectionDateByIdResponse;
  }

  async listDraftCarriers(
    req: ListDraftCarriersRequest
  ): Promise<ListDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      listDraftCarriers.name,
      HttpMethod.POST,
      req
    )) as ListDraftCarriersResponse;
  }

  async createDraftCarriers(
    req: CreateDraftCarriersRequest
  ): Promise<CreateDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      createDraftCarriers.name,
      HttpMethod.POST,
      req
    )) as CreateDraftCarriersResponse;
  }

  async getDraftCarriers(
    req: GetDraftCarriersRequest
  ): Promise<GetDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getDraftCarriers.name,
      HttpMethod.POST,
      req
    )) as GetDraftCarriersResponse;
  }

  async setDraftCarriers(
    req: SetDraftCarriersRequest
  ): Promise<SetDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setDraftCarriers.name,
      HttpMethod.POST,
      req
    )) as SetDraftCarriersResponse;
  }

  async deleteDraftCarriers(
    req: DeleteDraftCarriersRequest
  ): Promise<DeleteDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      deleteDraftCarriers.name,
      HttpMethod.POST,
      req
    )) as DeleteDraftCarriersResponse;
  }

  async getDraftExitLocationById(
    req: GetDraftExitLocationByIdRequest
  ): Promise<GetDraftExitLocationByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getDraftExitLocationById.name,
      HttpMethod.POST,
      req
    )) as GetDraftExitLocationByIdResponse;
  }

  async setDraftExitLocationById(
    req: SetDraftExitLocationByIdRequest
  ): Promise<SetDraftExitLocationByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setDraftExitLocationById.name,
      HttpMethod.POST,
      req
    )) as SetDraftExitLocationByIdResponse;
  }
}
