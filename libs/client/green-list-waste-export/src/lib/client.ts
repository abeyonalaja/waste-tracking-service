import { DaprClient, HttpMethod } from '@dapr/dapr';
import {
  common,
  draft,
  submission,
  template,
} from '@wts/api/green-list-waste-export';

export class DaprAnnexViiClient {
  constructor(
    private daprClient: DaprClient,
    private annexViiAppId: string,
  ) {}

  async createSubmissions(
    req: submission.CreateSubmissionsRequest,
  ): Promise<submission.CreateSubmissionsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      submission.createSubmissions.name,
      HttpMethod.POST,
      req,
    )) as submission.CreateSubmissionsResponse;
  }

  async getDrafts(
    req: common.GetRecordsRequest,
  ): Promise<draft.GetDraftsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.getDrafts.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftsResponse;
  }

  async getDraft(req: draft.GetDraftRequest): Promise<draft.GetDraftResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.getDraft.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftResponse;
  }

  async createDraft(
    req: draft.CreateDraftRequest,
  ): Promise<draft.CreateDraftResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.createDraft.name,
      HttpMethod.POST,
      req,
    )) as draft.CreateDraftResponse;
  }

  async createDraftFromTemplate(
    req: template.CreateDraftFromTemplateRequest,
  ): Promise<draft.CreateDraftResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.createDraftFromTemplate.name,
      HttpMethod.POST,
      req,
    )) as draft.CreateDraftResponse;
  }

  async deleteDraft(
    req: draft.DeleteDraftRequest,
  ): Promise<draft.DeleteDraftResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.deleteDraft.name,
      HttpMethod.POST,
      req,
    )) as draft.DeleteDraftResponse;
  }

  async cancelSubmission(
    req: submission.CancelSubmissionRequest,
  ): Promise<submission.CancelSubmissionResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      submission.cancelSubmission.name,
      HttpMethod.POST,
      req,
    )) as submission.CancelSubmissionResponse;
  }

  async getDraftCustomerReference(
    req: draft.GetDraftCustomerReferenceRequest,
  ): Promise<draft.GetDraftCustomerReferenceResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.getDraftCustomerReference.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftCustomerReferenceResponse;
  }

  async setDraftCustomerReference(
    req: draft.SetDraftCustomerReferenceRequest,
  ): Promise<draft.SetDraftCustomerReferenceResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.setDraftCustomerReference.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftCustomerReferenceResponse;
  }

  async getDraftWasteDescription(
    req: draft.GetDraftWasteDescriptionRequest,
  ): Promise<draft.GetDraftWasteDescriptionResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.getDraftWasteDescription.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftWasteDescriptionResponse;
  }

  async setDraftWasteDescription(
    req: draft.SetDraftWasteDescriptionRequest,
  ): Promise<draft.SetDraftWasteDescriptionResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.setDraftWasteDescription.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftWasteDescriptionResponse;
  }

  async getDraftWasteQuantity(
    req: draft.GetDraftWasteQuantityRequest,
  ): Promise<draft.GetDraftWasteQuantityResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.getDraftWasteQuantity.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftWasteQuantityResponse;
  }

  async setDraftWasteQuantity(
    req: draft.SetDraftWasteQuantityRequest,
  ): Promise<draft.SetDraftWasteQuantityResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.setDraftWasteQuantity.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftWasteQuantityResponse;
  }

  async getDraftExporterDetail(
    req: draft.GetDraftExporterDetailRequest,
  ): Promise<draft.GetDraftExporterDetailResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.getDraftExporterDetail.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftExporterDetailResponse;
  }

  async setDraftExporterDetail(
    req: draft.SetDraftExporterDetailRequest,
  ): Promise<draft.SetDraftExporterDetailResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.setDraftExporterDetail.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftExporterDetailResponse;
  }

  async getDraftImporterDetail(
    req: draft.GetDraftImporterDetailRequest,
  ): Promise<draft.GetDraftImporterDetailResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.getDraftImporterDetail.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftImporterDetailResponse;
  }

  async setDraftImporterDetail(
    req: draft.SetDraftImporterDetailRequest,
  ): Promise<draft.SetDraftImporterDetailResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.setDraftImporterDetail.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftImporterDetailResponse;
  }

  async getDraftCollectionDate(
    req: draft.GetDraftCollectionDateRequest,
  ): Promise<draft.GetDraftCollectionDateResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.getDraftCollectionDate.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftCollectionDateResponse;
  }

  async setDraftCollectionDate(
    req: draft.SetDraftCollectionDateRequest,
  ): Promise<draft.SetDraftCollectionDateResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.setDraftCollectionDate.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftCollectionDateResponse;
  }

  async listDraftCarriers(
    req: draft.ListDraftCarriersRequest,
  ): Promise<draft.ListDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.listDraftCarriers.name,
      HttpMethod.POST,
      req,
    )) as draft.ListDraftCarriersResponse;
  }

  async createDraftCarriers(
    req: draft.CreateDraftCarriersRequest,
  ): Promise<draft.CreateDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.createDraftCarriers.name,
      HttpMethod.POST,
      req,
    )) as draft.CreateDraftCarriersResponse;
  }

  async getDraftCarriers(
    req: draft.GetDraftCarriersRequest,
  ): Promise<draft.GetDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.getDraftCarriers.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftCarriersResponse;
  }

  async setDraftCarriers(
    req: draft.SetDraftCarriersRequest,
  ): Promise<draft.SetDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.setDraftCarriers.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftCarriersResponse;
  }

  async deleteDraftCarriers(
    req: draft.DeleteDraftCarriersRequest,
  ): Promise<draft.DeleteDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.deleteDraftCarriers.name,
      HttpMethod.POST,
      req,
    )) as draft.DeleteDraftCarriersResponse;
  }

  async getDraftCollectionDetail(
    req: draft.GetDraftCollectionDetailRequest,
  ): Promise<draft.GetDraftCollectionDetailResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.getDraftCollectionDetail.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftCollectionDetailResponse;
  }

  async setDraftCollectionDetail(
    req: draft.SetDraftCollectionDetailRequest,
  ): Promise<draft.SetDraftCollectionDetailResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.setDraftCollectionDetail.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftCollectionDetailResponse;
  }

  async getDraftUkExitLocation(
    req: draft.GetDraftUkExitLocationRequest,
  ): Promise<draft.GetDraftUkExitLocationResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.getDraftUkExitLocation.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftUkExitLocationResponse;
  }

  async setDraftUkExitLocation(
    req: draft.SetDraftUkExitLocationRequest,
  ): Promise<draft.SetDraftUkExitLocationResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.setDraftUkExitLocation.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftUkExitLocationResponse;
  }

  async getDraftTransitCountries(
    req: draft.GetDraftTransitCountriesRequest,
  ): Promise<draft.GetDraftTransitCountriesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.getDraftTransitCountries.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftTransitCountriesResponse;
  }

  async setDraftTransitCountries(
    req: draft.SetDraftTransitCountriesRequest,
  ): Promise<draft.SetDraftTransitCountriesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.setDraftTransitCountries.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftTransitCountriesResponse;
  }

  async listDraftRecoveryFacilityDetails(
    req: draft.ListDraftRecoveryFacilityDetailsRequest,
  ): Promise<draft.ListDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.listDraftRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req,
    )) as draft.ListDraftRecoveryFacilityDetailsResponse;
  }

  async createDraftRecoveryFacilityDetails(
    req: draft.CreateDraftRecoveryFacilityDetailsRequest,
  ): Promise<draft.CreateDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.createDraftRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req,
    )) as draft.CreateDraftRecoveryFacilityDetailsResponse;
  }

  async getDraftRecoveryFacilityDetails(
    req: draft.GetDraftRecoveryFacilityDetailsRequest,
  ): Promise<draft.GetDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.getDraftRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftRecoveryFacilityDetailsResponse;
  }

  async setDraftRecoveryFacilityDetails(
    req: draft.SetDraftRecoveryFacilityDetailsRequest,
  ): Promise<draft.SetDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.setDraftRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftRecoveryFacilityDetailsResponse;
  }

  async deleteDraftRecoveryFacilityDetails(
    req: draft.DeleteDraftRecoveryFacilityDetailsRequest,
  ): Promise<draft.DeleteDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.deleteDraftRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req,
    )) as draft.DeleteDraftRecoveryFacilityDetailsResponse;
  }

  async getDraftSubmissionConfirmation(
    req: draft.GetDraftSubmissionConfirmationRequest,
  ): Promise<draft.GetDraftSubmissionConfirmationResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.getDraftSubmissionConfirmation.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftSubmissionConfirmationResponse;
  }

  async setDraftSubmissionConfirmation(
    req: draft.SetDraftSubmissionConfirmationRequest,
  ): Promise<draft.SetDraftSubmissionConfirmationResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.setDraftSubmissionConfirmation.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftSubmissionConfirmationResponse;
  }

  async getDraftSubmissionDeclaration(
    req: draft.GetDraftSubmissionDeclarationRequest,
  ): Promise<draft.GetDraftSubmissionDeclarationResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.getDraftSubmissionDeclaration.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftSubmissionDeclarationResponse;
  }

  async setDraftSubmissionDeclaration(
    req: draft.SetDraftSubmissionDeclarationRequest,
  ): Promise<draft.SetDraftSubmissionDeclarationResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      draft.setDraftSubmissionDeclaration.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftSubmissionDeclarationResponse;
  }

  async getTemplates(
    req: template.GetTemplatesRequest,
  ): Promise<template.GetTemplatesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.getTemplates.name,
      HttpMethod.POST,
      req,
    )) as template.GetTemplatesResponse;
  }

  async getNumberOfTemplates(
    req: template.GetNumberOfTemplatesRequest,
  ): Promise<template.GetNumberOfTemplatesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.getNumberOfTemplates.name,
      HttpMethod.POST,
      req,
    )) as template.GetNumberOfTemplatesResponse;
  }

  async getTemplate(
    req: template.GetTemplateRequest,
  ): Promise<template.GetTemplateResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.getTemplate.name,
      HttpMethod.POST,
      req,
    )) as template.GetTemplateResponse;
  }

  async createTemplate(
    req: template.CreateTemplateRequest,
  ): Promise<template.CreateTemplateResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.createTemplate.name,
      HttpMethod.POST,
      req,
    )) as template.CreateTemplateResponse;
  }

  async createTemplateFromSubmission(
    req: template.CreateTemplateFromSubmissionRequest,
  ): Promise<template.CreateTemplateResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.createTemplateFromSubmission.name,
      HttpMethod.POST,
      req,
    )) as template.CreateTemplateResponse;
  }

  async createTemplateFromTemplate(
    req: template.CreateTemplateFromTemplateRequest,
  ): Promise<template.CreateTemplateResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.createTemplateFromTemplate.name,
      HttpMethod.POST,
      req,
    )) as template.CreateTemplateResponse;
  }

  async updateTemplate(
    req: template.UpdateTemplateRequest,
  ): Promise<template.UpdateTemplateResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.updateTemplate.name,
      HttpMethod.POST,
      req,
    )) as template.UpdateTemplateResponse;
  }

  async deleteTemplate(
    req: template.DeleteTemplateRequest,
  ): Promise<template.DeleteTemplateResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.deleteTemplate.name,
      HttpMethod.POST,
      req,
    )) as template.DeleteTemplateResponse;
  }

  async getTemplateWasteDescription(
    req: draft.GetDraftWasteDescriptionRequest,
  ): Promise<draft.GetDraftWasteDescriptionResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.getTemplateWasteDescription.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftWasteDescriptionResponse;
  }

  async setTemplateWasteDescription(
    req: draft.SetDraftWasteDescriptionRequest,
  ): Promise<draft.SetDraftWasteDescriptionResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.setTemplateWasteDescription.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftWasteDescriptionResponse;
  }

  async getTemplateExporterDetail(
    req: draft.GetDraftExporterDetailRequest,
  ): Promise<draft.GetDraftExporterDetailResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.getTemplateExporterDetail.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftExporterDetailResponse;
  }

  async setTemplateExporterDetail(
    req: draft.SetDraftExporterDetailRequest,
  ): Promise<draft.SetDraftExporterDetailResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.setTemplateExporterDetail.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftExporterDetailResponse;
  }

  async getTemplateImporterDetail(
    req: draft.GetDraftImporterDetailRequest,
  ): Promise<draft.GetDraftImporterDetailResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.getTemplateImporterDetail.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftImporterDetailResponse;
  }

  async setTemplateImporterDetail(
    req: draft.SetDraftImporterDetailRequest,
  ): Promise<draft.SetDraftImporterDetailResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.setTemplateImporterDetail.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftImporterDetailResponse;
  }

  async listTemplateCarriers(
    req: draft.ListDraftCarriersRequest,
  ): Promise<draft.ListDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.listTemplateCarriers.name,
      HttpMethod.POST,
      req,
    )) as draft.ListDraftCarriersResponse;
  }

  async createTemplateCarriers(
    req: draft.CreateDraftCarriersRequest,
  ): Promise<draft.CreateDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.createTemplateCarriers.name,
      HttpMethod.POST,
      req,
    )) as draft.CreateDraftCarriersResponse;
  }

  async getTemplateCarriers(
    req: draft.GetDraftCarriersRequest,
  ): Promise<draft.GetDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.getTemplateCarriers.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftCarriersResponse;
  }

  async setTemplateCarriers(
    req: draft.SetDraftCarriersRequest,
  ): Promise<draft.SetDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.setTemplateCarriers.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftCarriersResponse;
  }

  async deleteTemplateCarriers(
    req: draft.DeleteDraftCarriersRequest,
  ): Promise<draft.DeleteDraftCarriersResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.deleteTemplateCarriers.name,
      HttpMethod.POST,
      req,
    )) as draft.DeleteDraftCarriersResponse;
  }

  async getTemplateCollectionDetail(
    req: draft.GetDraftCollectionDetailRequest,
  ): Promise<draft.GetDraftCollectionDetailResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.getTemplateCollectionDetail.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftCollectionDetailResponse;
  }

  async setTemplateCollectionDetail(
    req: draft.SetDraftCollectionDetailRequest,
  ): Promise<draft.SetDraftCollectionDetailResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.setTemplateCollectionDetail.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftCollectionDetailResponse;
  }

  async getTemplateUkExitLocation(
    req: draft.GetDraftUkExitLocationRequest,
  ): Promise<draft.GetDraftUkExitLocationResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.getTemplateUkExitLocation.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftUkExitLocationResponse;
  }

  async setTemplateUkExitLocation(
    req: draft.SetDraftUkExitLocationRequest,
  ): Promise<draft.SetDraftUkExitLocationResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.setTemplateUkExitLocation.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftUkExitLocationResponse;
  }

  async getTemplateTransitCountries(
    req: draft.GetDraftTransitCountriesRequest,
  ): Promise<draft.GetDraftTransitCountriesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.getTemplateTransitCountries.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftTransitCountriesResponse;
  }

  async setTemplateTransitCountries(
    req: draft.SetDraftTransitCountriesRequest,
  ): Promise<draft.SetDraftTransitCountriesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.setTemplateTransitCountries.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftTransitCountriesResponse;
  }

  async listTemplateRecoveryFacilityDetails(
    req: draft.ListDraftRecoveryFacilityDetailsRequest,
  ): Promise<draft.ListDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.listTemplateRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req,
    )) as draft.ListDraftRecoveryFacilityDetailsResponse;
  }

  async createTemplateRecoveryFacilityDetails(
    req: draft.CreateDraftRecoveryFacilityDetailsRequest,
  ): Promise<draft.CreateDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.createTemplateRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req,
    )) as draft.CreateDraftRecoveryFacilityDetailsResponse;
  }

  async getTemplateRecoveryFacilityDetails(
    req: draft.GetDraftRecoveryFacilityDetailsRequest,
  ): Promise<draft.GetDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.getTemplateRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req,
    )) as draft.GetDraftRecoveryFacilityDetailsResponse;
  }

  async setTemplateRecoveryFacilityDetails(
    req: draft.SetDraftRecoveryFacilityDetailsRequest,
  ): Promise<draft.SetDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.setTemplateRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req,
    )) as draft.SetDraftRecoveryFacilityDetailsResponse;
  }

  async deleteTemplateRecoveryFacilityDetails(
    req: draft.DeleteDraftRecoveryFacilityDetailsRequest,
  ): Promise<draft.DeleteDraftRecoveryFacilityDetailsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      template.deleteTemplateRecoveryFacilityDetails.name,
      HttpMethod.POST,
      req,
    )) as draft.DeleteDraftRecoveryFacilityDetailsResponse;
  }

  async getNumberOfSubmissions(
    req: submission.GetNumberOfSubmissionsRequest,
  ): Promise<submission.GetNumberOfSubmissionsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      submission.getNumberOfSubmissions.name,
      HttpMethod.POST,
      req,
    )) as submission.GetNumberOfSubmissionsResponse;
  }

  async validateSubmissions(
    req: submission.ValidateSubmissionsRequest,
  ): Promise<submission.ValidateSubmissionsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      submission.validateSubmissions.name,
      HttpMethod.POST,
      req,
    )) as submission.ValidateSubmissionsResponse;
  }

  async getSubmissions(
    req: common.GetRecordsRequest,
  ): Promise<submission.GetSubmissionsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      submission.getSubmissions.name,
      HttpMethod.POST,
      req,
    )) as submission.GetSubmissionsResponse;
  }

  async getSubmission(
    req: submission.GetSubmissionRequest,
  ): Promise<submission.GetSubmissionResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      submission.getSubmission.name,
      HttpMethod.POST,
      req,
    )) as submission.GetSubmissionResponse;
  }

  async getWasteQuantity(
    req: submission.GetWasteQuantityRequest,
  ): Promise<submission.GetWasteQuantityResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      submission.getWasteQuantity.name,
      HttpMethod.POST,
      req,
    )) as submission.GetWasteQuantityResponse;
  }

  async setWasteQuantity(
    req: submission.SetWasteQuantityRequest,
  ): Promise<submission.SetWasteQuantityResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      submission.setWasteQuantity.name,
      HttpMethod.POST,
      req,
    )) as submission.SetWasteQuantityResponse;
  }

  async getCollectionDate(
    req: submission.GetCollectionDateRequest,
  ): Promise<submission.GetCollectionDateResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      submission.getCollectionDate.name,
      HttpMethod.POST,
      req,
    )) as submission.GetCollectionDateResponse;
  }

  async setCollectionDate(
    req: submission.SetCollectionDateRequest,
  ): Promise<submission.SetCollectionDateResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      submission.setCollectionDate.name,
      HttpMethod.POST,
      req,
    )) as submission.SetCollectionDateResponse;
  }

  async getBulkSubmissions(
    req: submission.GetBulkSubmissionsRequest,
  ): Promise<submission.GetBulkSubmissionsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.annexViiAppId,
      submission.getBulkSubmissions.name,
      HttpMethod.POST,
      req,
    )) as submission.GetBulkSubmissionsResponse;
  }
}
