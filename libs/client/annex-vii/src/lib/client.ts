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
  GetDraftWasteDescriptionByIdRequest,
  GetDraftWasteDescriptionByIdResponse,
  GetDraftWasteQuantityByIdRequest,
  GetDraftWasteQuantityByIdResponse,
  GetDraftsRequest,
  GetDraftsResponse,
  SetDraftCustomerReferenceByIdRequest,
  SetDraftCustomerReferenceByIdResponse,
  SetDraftExporterDetailByIdRequest,
  SetDraftExporterDetailByIdResponse,
  SetDraftWasteDescriptionByIdRequest,
  SetDraftWasteDescriptionByIdResponse,
  SetDraftWasteQuantityByIdRequest,
  SetDraftWasteQuantityByIdResponse,
  createDraft,
  getDraftById,
  getDraftCustomerReferenceById,
  getDraftExporterDetailById,
  getDraftWasteDescriptionById,
  getDraftWasteQuantityById,
  getDrafts,
  setDraftCustomerReferenceById,
  setDraftExporterDetailById,
  setDraftWasteDescriptionById,
  setDraftWasteQuantityById,
} from '@wts/api/annex-vii';

export class DaprAnnexViiClient {
  constructor(
    private daprClient: DaprClient,
    private annexViiAppId: string = 'annex-vii'
  ) {}

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
    )) as SetDraftWasteQuantityByIdResponse;
  }
}
