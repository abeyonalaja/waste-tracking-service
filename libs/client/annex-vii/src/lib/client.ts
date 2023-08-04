import { DaprClient, HttpMethod } from '@dapr/dapr';
import {
  CreateDraftRequest,
  CreateDraftResponse,
  DeleteDraftRequest,
  DeleteDraftResponse,
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
  ListDraftRecoveryFacilityDetailsRequest,
  ListDraftRecoveryFacilityDetailsResponse,
  CreateDraftRecoveryFacilityDetailsRequest,
  CreateDraftRecoveryFacilityDetailsResponse,
  GetDraftRecoveryFacilityDetailsRequest,
  GetDraftRecoveryFacilityDetailsResponse,
  SetDraftRecoveryFacilityDetailsRequest,
  SetDraftRecoveryFacilityDetailsResponse,
  DeleteDraftRecoveryFacilityDetailsRequest,
  DeleteDraftRecoveryFacilityDetailsResponse,
  GetDraftSubmissionConfirmationByIdRequest,
  GetDraftSubmissionConfirmationByIdResponse,
  SetDraftSubmissionConfirmationByIdRequest,
  SetDraftSubmissionConfirmationByIdResponse,
  GetDraftSubmissionDeclarationByIdRequest,
  GetDraftSubmissionDeclarationByIdResponse,
  SetDraftSubmissionDeclarationByIdRequest,
  SetDraftSubmissionDeclarationByIdResponse,
  createDraft,
  deleteDraft,
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
  GetDraftTransitCountriesRequest,
  GetDraftTransitCountriesResponse,
  SetDraftTransitCountriesRequest,
  SetDraftTransitCountriesResponse,
  getDraftTransitCountries,
  setDraftTransitCountries,
  GetDraftCollectionDetailRequest,
  GetDraftCollectionDetailResponse,
  SetDraftCollectionDetailRequest,
  SetDraftCollectionDetailResponse,
  getDraftCollectionDetail,
  setDraftCollectionDetail,
  listDraftRecoveryFacilityDetails,
  createDraftRecoveryFacilityDetails,
  getDraftRecoveryFacilityDetails,
  setDraftRecoveryFacilityDetails,
  deleteDraftRecoveryFacilityDetails,
  getDraftSubmissionConfirmationById,
  setDraftSubmissionConfirmationById,
  getDraftSubmissionDeclarationById,
  setDraftSubmissionDeclarationById,
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

  async deleteDraft(req: DeleteDraftRequest): Promise<DeleteDraftResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      deleteDraft.name,
      HttpMethod.POST,
      req
    )) as DeleteDraftResponse;
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

  async getDraftCollectionDetail(
    req: GetDraftCollectionDetailRequest
  ): Promise<GetDraftCollectionDetailResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getDraftCollectionDetail.name,
      HttpMethod.POST,
      req
    )) as GetDraftCollectionDetailResponse;
  }

  async setDraftCollectionDetail(
    req: SetDraftCollectionDetailRequest
  ): Promise<SetDraftCollectionDetailResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setDraftCollectionDetail.name,
      HttpMethod.POST,
      req
    )) as SetDraftCollectionDetailResponse;
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

  async getDraftTransitCountries(
    req: GetDraftTransitCountriesRequest
  ): Promise<GetDraftTransitCountriesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getDraftTransitCountries.name,
      HttpMethod.POST,
      req
    )) as GetDraftTransitCountriesResponse;
  }

  async setDraftTransitCountries(
    req: SetDraftTransitCountriesRequest
  ): Promise<SetDraftTransitCountriesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setDraftTransitCountries.name,
      HttpMethod.POST,
      req
    )) as SetDraftTransitCountriesResponse;
  }

  async listDraftRecoveryFacilityDetails(
    req: ListDraftRecoveryFacilityDetailsRequest
  ): Promise<ListDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      listDraftRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req
    )) as ListDraftRecoveryFacilityDetailsResponse;
  }

  async createDraftRecoveryFacilityDetails(
    req: CreateDraftRecoveryFacilityDetailsRequest
  ): Promise<CreateDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      createDraftRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req
    )) as CreateDraftRecoveryFacilityDetailsResponse;
  }

  async getDraftRecoveryFacilityDetails(
    req: GetDraftRecoveryFacilityDetailsRequest
  ): Promise<GetDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getDraftRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req
    )) as GetDraftRecoveryFacilityDetailsResponse;
  }

  async setDraftRecoveryFacilityDetails(
    req: SetDraftRecoveryFacilityDetailsRequest
  ): Promise<SetDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setDraftRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req
    )) as SetDraftRecoveryFacilityDetailsResponse;
  }

  async deleteDraftRecoveryFacilityDetails(
    req: DeleteDraftRecoveryFacilityDetailsRequest
  ): Promise<DeleteDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      deleteDraftRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req
    )) as DeleteDraftRecoveryFacilityDetailsResponse;
  }

  async getDraftSubmissionConfirmationById(
    req: GetDraftSubmissionConfirmationByIdRequest
  ): Promise<GetDraftSubmissionConfirmationByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getDraftSubmissionConfirmationById.name,
      HttpMethod.POST,
      req
    )) as GetDraftSubmissionConfirmationByIdResponse;
  }

  async setDraftSubmissionConfirmationById(
    req: SetDraftSubmissionConfirmationByIdRequest
  ): Promise<SetDraftSubmissionConfirmationByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setDraftSubmissionConfirmationById.name,
      HttpMethod.POST,
      req
    )) as SetDraftSubmissionConfirmationByIdResponse;
  }

  async getDraftSubmissionDeclarationById(
    req: GetDraftSubmissionDeclarationByIdRequest
  ): Promise<GetDraftSubmissionDeclarationByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getDraftSubmissionDeclarationById.name,
      HttpMethod.POST,
      req
    )) as GetDraftSubmissionDeclarationByIdResponse;
  }

  async setDraftSubmissionDeclarationById(
    req: SetDraftSubmissionDeclarationByIdRequest
  ): Promise<SetDraftSubmissionDeclarationByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setDraftSubmissionDeclarationById.name,
      HttpMethod.POST,
      req
    )) as SetDraftSubmissionDeclarationByIdResponse;
  }
}
