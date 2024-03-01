import { DaprClient, HttpMethod } from '@dapr/dapr';
import {
  CreateDraftRequest,
  CreateDraftResponse,
  DeleteDraftRequest,
  DeleteDraftResponse,
  CancelDraftByIdRequest,
  CancelDraftByIdResponse,
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
  cancelDraft,
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
  GetTemplatesRequest,
  GetTemplatesResponse,
  GetTemplateByIdRequest,
  GetTemplateByIdResponse,
  CreateTemplateRequest,
  CreateTemplateFromSubmissionRequest,
  CreateTemplateFromTemplateRequest,
  CreateTemplateResponse,
  DeleteTemplateRequest,
  DeleteTemplateResponse,
  getTemplates,
  getTemplateById,
  createTemplate,
  deleteTemplate,
  CreateDraftFromTemplateRequest,
  createDraftFromTemplate,
  UpdateTemplateRequest,
  UpdateTemplateResponse,
  createTemplateFromSubmission,
  createTemplateFromTemplate,
  updateTemplate,
  getTemplateWasteDescriptionById,
  createTemplateCarriers,
  createTemplateRecoveryFacilityDetails,
  deleteTemplateCarriers,
  deleteTemplateRecoveryFacilityDetails,
  getTemplateCarriers,
  getTemplateCollectionDetail,
  getTemplateExitLocationById,
  getTemplateExporterDetailById,
  getTemplateImporterDetailById,
  getTemplateRecoveryFacilityDetails,
  getTemplateTransitCountries,
  listTemplateCarriers,
  listTemplateRecoveryFacilityDetails,
  setTemplateCarriers,
  setTemplateCollectionDetail,
  setTemplateExitLocationById,
  setTemplateExporterDetailById,
  setTemplateImporterDetailById,
  setTemplateRecoveryFacilityDetails,
  setTemplateTransitCountries,
  setTemplateWasteDescriptionById,
  GetNumberOfTemplatesRequest,
  GetNumberOfTemplatesResponse,
  GetNumberOfSubmissionsRequest,
  GetNumberOfSubmissionsResponse,
  ValidateSubmissionsRequest,
  ValidateSubmissionsResponse,
  validateSubmissions,
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

  async createDraftFromTemplate(
    req: CreateDraftFromTemplateRequest
  ): Promise<CreateDraftResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      createDraftFromTemplate.name,
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

  async cancelDraft(
    req: CancelDraftByIdRequest
  ): Promise<CancelDraftByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      cancelDraft.name,
      HttpMethod.POST,
      req
    )) as CancelDraftByIdResponse;
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

  async getTemplates(req: GetTemplatesRequest): Promise<GetTemplatesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getTemplates.name,
      HttpMethod.POST,
      req
    )) as GetTemplatesResponse;
  }

  async getNumberOfTemplates(
    req: GetNumberOfTemplatesRequest
  ): Promise<GetNumberOfTemplatesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      this.getNumberOfTemplates.name,
      HttpMethod.POST,
      req
    )) as GetNumberOfTemplatesResponse;
  }

  async getTemplateById(
    req: GetTemplateByIdRequest
  ): Promise<GetTemplateByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getTemplateById.name,
      HttpMethod.POST,
      req
    )) as GetTemplateByIdResponse;
  }

  async createTemplate(
    req: CreateTemplateRequest
  ): Promise<CreateTemplateResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      createTemplate.name,
      HttpMethod.POST,
      req
    )) as CreateTemplateResponse;
  }

  async createTemplateFromSubmission(
    req: CreateTemplateFromSubmissionRequest
  ): Promise<CreateTemplateResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      createTemplateFromSubmission.name,
      HttpMethod.POST,
      req
    )) as CreateTemplateResponse;
  }

  async createTemplateFromTemplate(
    req: CreateTemplateFromTemplateRequest
  ): Promise<CreateTemplateResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      createTemplateFromTemplate.name,
      HttpMethod.POST,
      req
    )) as CreateTemplateResponse;
  }

  async updateTemplate(
    req: UpdateTemplateRequest
  ): Promise<UpdateTemplateResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      updateTemplate.name,
      HttpMethod.POST,
      req
    )) as UpdateTemplateResponse;
  }

  async deleteTemplate(
    req: DeleteTemplateRequest
  ): Promise<DeleteTemplateResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      deleteTemplate.name,
      HttpMethod.POST,
      req
    )) as DeleteTemplateResponse;
  }

  async getTemplateWasteDescriptionById(
    req: GetDraftWasteDescriptionByIdRequest
  ): Promise<GetDraftWasteDescriptionByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getTemplateWasteDescriptionById.name,
      HttpMethod.POST,
      req
    )) as GetDraftWasteDescriptionByIdResponse;
  }

  async setTemplateWasteDescriptionById(
    req: SetDraftWasteDescriptionByIdRequest
  ): Promise<SetDraftWasteDescriptionByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setTemplateWasteDescriptionById.name,
      HttpMethod.POST,
      req
    )) as SetDraftWasteDescriptionByIdResponse;
  }

  async getTemplateExporterDetailById(
    req: GetDraftExporterDetailByIdRequest
  ): Promise<GetDraftExporterDetailByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getTemplateExporterDetailById.name,
      HttpMethod.POST,
      req
    )) as GetDraftExporterDetailByIdResponse;
  }

  async setTemplateExporterDetailById(
    req: SetDraftExporterDetailByIdRequest
  ): Promise<SetDraftExporterDetailByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setTemplateExporterDetailById.name,
      HttpMethod.POST,
      req
    )) as SetDraftExporterDetailByIdResponse;
  }

  async getTemplateImporterDetailById(
    req: GetDraftImporterDetailByIdRequest
  ): Promise<GetDraftImporterDetailByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getTemplateImporterDetailById.name,
      HttpMethod.POST,
      req
    )) as GetDraftImporterDetailByIdResponse;
  }

  async setTemplateImporterDetailById(
    req: SetDraftImporterDetailByIdRequest
  ): Promise<SetDraftImporterDetailByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setTemplateImporterDetailById.name,
      HttpMethod.POST,
      req
    )) as SetDraftImporterDetailByIdResponse;
  }

  async listTemplateCarriers(
    req: ListDraftCarriersRequest
  ): Promise<ListDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      listTemplateCarriers.name,
      HttpMethod.POST,
      req
    )) as ListDraftCarriersResponse;
  }

  async createTemplateCarriers(
    req: CreateDraftCarriersRequest
  ): Promise<CreateDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      createTemplateCarriers.name,
      HttpMethod.POST,
      req
    )) as CreateDraftCarriersResponse;
  }

  async getTemplateCarriers(
    req: GetDraftCarriersRequest
  ): Promise<GetDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getTemplateCarriers.name,
      HttpMethod.POST,
      req
    )) as GetDraftCarriersResponse;
  }

  async setTemplateCarriers(
    req: SetDraftCarriersRequest
  ): Promise<SetDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setTemplateCarriers.name,
      HttpMethod.POST,
      req
    )) as SetDraftCarriersResponse;
  }

  async deleteTemplateCarriers(
    req: DeleteDraftCarriersRequest
  ): Promise<DeleteDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      deleteTemplateCarriers.name,
      HttpMethod.POST,
      req
    )) as DeleteDraftCarriersResponse;
  }

  async getTemplateCollectionDetail(
    req: GetDraftCollectionDetailRequest
  ): Promise<GetDraftCollectionDetailResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getTemplateCollectionDetail.name,
      HttpMethod.POST,
      req
    )) as GetDraftCollectionDetailResponse;
  }

  async setTemplateCollectionDetail(
    req: SetDraftCollectionDetailRequest
  ): Promise<SetDraftCollectionDetailResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setTemplateCollectionDetail.name,
      HttpMethod.POST,
      req
    )) as SetDraftCollectionDetailResponse;
  }

  async getTemplateExitLocationById(
    req: GetDraftExitLocationByIdRequest
  ): Promise<GetDraftExitLocationByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getTemplateExitLocationById.name,
      HttpMethod.POST,
      req
    )) as GetDraftExitLocationByIdResponse;
  }

  async setTemplateExitLocationById(
    req: SetDraftExitLocationByIdRequest
  ): Promise<SetDraftExitLocationByIdResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setTemplateExitLocationById.name,
      HttpMethod.POST,
      req
    )) as SetDraftExitLocationByIdResponse;
  }

  async getTemplateTransitCountries(
    req: GetDraftTransitCountriesRequest
  ): Promise<GetDraftTransitCountriesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getTemplateTransitCountries.name,
      HttpMethod.POST,
      req
    )) as GetDraftTransitCountriesResponse;
  }

  async setTemplateTransitCountries(
    req: SetDraftTransitCountriesRequest
  ): Promise<SetDraftTransitCountriesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setTemplateTransitCountries.name,
      HttpMethod.POST,
      req
    )) as SetDraftTransitCountriesResponse;
  }

  async listTemplateRecoveryFacilityDetails(
    req: ListDraftRecoveryFacilityDetailsRequest
  ): Promise<ListDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      listTemplateRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req
    )) as ListDraftRecoveryFacilityDetailsResponse;
  }

  async createTemplateRecoveryFacilityDetails(
    req: CreateDraftRecoveryFacilityDetailsRequest
  ): Promise<CreateDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      createTemplateRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req
    )) as CreateDraftRecoveryFacilityDetailsResponse;
  }

  async getTemplateRecoveryFacilityDetails(
    req: GetDraftRecoveryFacilityDetailsRequest
  ): Promise<GetDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      getTemplateRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req
    )) as GetDraftRecoveryFacilityDetailsResponse;
  }

  async setTemplateRecoveryFacilityDetails(
    req: SetDraftRecoveryFacilityDetailsRequest
  ): Promise<SetDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      setTemplateRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req
    )) as SetDraftRecoveryFacilityDetailsResponse;
  }

  async deleteTemplateRecoveryFacilityDetails(
    req: DeleteDraftRecoveryFacilityDetailsRequest
  ): Promise<DeleteDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      deleteTemplateRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req
    )) as DeleteDraftRecoveryFacilityDetailsResponse;
  }

  async getNumberOfSubmissions(
    req: GetNumberOfSubmissionsRequest
  ): Promise<GetNumberOfSubmissionsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      this.getNumberOfSubmissions.name,
      HttpMethod.POST,
      req
    )) as GetNumberOfSubmissionsResponse;
  }

  async validateSubmissions(
    req: ValidateSubmissionsRequest
  ): Promise<ValidateSubmissionsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      validateSubmissions.name,
      HttpMethod.POST,
      req
    )) as ValidateSubmissionsResponse;
  }
}
