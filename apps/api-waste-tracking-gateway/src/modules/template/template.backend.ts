import Boom from '@hapi/boom';
import { draft, template } from '@wts/api/green-list-waste-export';
import {
  Carriers,
  CollectionDetail,
  ExitLocation,
  ExporterDetail,
  ImporterDetail,
  RecoveryFacilityDetail,
  Template,
  TemplateSummaryPage,
  TransitCountries,
  WasteDescription,
} from '@wts/api/waste-tracking-gateway';
import { DaprAnnexViiClient } from '@wts/client/green-list-waste-export';
import { Logger } from 'winston';

export type SubmissionRef = {
  id: string;
  accountId: string;
};

export type TemplateRef = {
  id: string;
  accountId: string;
};

export type OrderRef = {
  order: 'ASC' | 'DESC';
};

export interface TemplateBackend {
  getTemplates(
    accountId: string,
    { order }: OrderRef,
    pageLimit?: number,
    token?: string
  ): Promise<TemplateSummaryPage>;
  getNumberOfTemplates(accountId: string): Promise<number>;
  getTemplate({ id }: TemplateRef): Promise<Template>;
  createTemplate(
    accountId: string,
    templateDetails: {
      name: string;
      description: string;
    }
  ): Promise<Template>;
  createTemplateFromSubmission(
    id: string,
    accountId: string,
    templateDetails: {
      name: string;
      description: string;
    }
  ): Promise<Template>;
  createTemplateFromTemplate(
    id: string,
    accountId: string,
    templateDetails: {
      name: string;
      description: string;
    }
  ): Promise<Template>;
  updateTemplate(
    id: string,
    accountId: string,
    templateDetails: {
      name: string;
      description: string;
    }
  ): Promise<Template>;
  deleteTemplate(ref: TemplateRef): Promise<void>;
  getWasteDescription(ref: SubmissionRef): Promise<WasteDescription>;
  setWasteDescription(
    { id }: SubmissionRef,
    value: WasteDescription
  ): Promise<void>;
  getExporterDetail(ref: SubmissionRef): Promise<ExporterDetail>;
  setExporterDetail(ref: SubmissionRef, value: ExporterDetail): Promise<void>;
  getImporterDetail(ref: SubmissionRef): Promise<ImporterDetail>;
  setImporterDetail(ref: SubmissionRef, value: ImporterDetail): Promise<void>;
  listCarriers(ref: SubmissionRef): Promise<Carriers>;
  getCarriers(ref: SubmissionRef, carrierId: string): Promise<Carriers>;
  createCarriers(
    ref: SubmissionRef,
    value: Omit<Carriers, 'transport' | 'values'>
  ): Promise<Carriers>;
  setCarriers(
    ref: SubmissionRef,
    carrerId: string,
    value: Carriers
  ): Promise<void>;
  deleteCarriers(ref: SubmissionRef, carrierId: string): Promise<void>;
  getCollectionDetail(ref: SubmissionRef): Promise<CollectionDetail>;
  setCollectionDetail(
    ref: SubmissionRef,
    value: CollectionDetail
  ): Promise<void>;
  getExitLocation(ref: SubmissionRef): Promise<ExitLocation>;
  setExitLocation(ref: SubmissionRef, value: ExitLocation): Promise<void>;
  getTransitCountries(ref: SubmissionRef): Promise<TransitCountries>;
  setTransitCountries(
    ref: SubmissionRef,
    value: TransitCountries
  ): Promise<void>;
  listRecoveryFacilityDetail(
    ref: SubmissionRef
  ): Promise<RecoveryFacilityDetail>;
  createRecoveryFacilityDetail(
    ref: SubmissionRef,
    value: Omit<RecoveryFacilityDetail, 'values'>
  ): Promise<RecoveryFacilityDetail>;
  getRecoveryFacilityDetail(
    ref: SubmissionRef,
    id: string
  ): Promise<RecoveryFacilityDetail>;
  setRecoveryFacilityDetail(
    ref: SubmissionRef,
    id: string,
    value: RecoveryFacilityDetail
  ): Promise<void>;
  deleteRecoveryFacilityDetail(ref: SubmissionRef, id: string): Promise<void>;
}

export class AnnexViiServiceTemplateBackend implements TemplateBackend {
  constructor(protected client: DaprAnnexViiClient, protected logger: Logger) {}

  async getTemplate({ id, accountId }: TemplateRef): Promise<Template> {
    let response: template.GetTemplateResponse;
    try {
      response = await this.client.getTemplate({ id, accountId });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async createTemplate(
    accountId: string,
    templateDetails: {
      name: string;
      description: string;
    }
  ): Promise<Template> {
    let response: template.CreateTemplateResponse;
    try {
      response = await this.client.createTemplate({
        accountId,
        templateDetails,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async createTemplateFromSubmission(
    id: string,
    accountId: string,
    templateDetails: {
      name: string;
      description: string;
    }
  ): Promise<Template> {
    let response: template.CreateTemplateResponse;
    try {
      response = await this.client.createTemplateFromSubmission({
        id,
        accountId,
        templateDetails,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async createTemplateFromTemplate(
    id: string,
    accountId: string,
    templateDetails: {
      name: string;
      description: string;
    }
  ): Promise<Template> {
    let response: template.CreateTemplateResponse;
    try {
      response = await this.client.createTemplateFromTemplate({
        id,
        accountId,
        templateDetails,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async updateTemplate(
    id: string,
    accountId: string,
    templateDetails: {
      name: string;
      description: string;
    }
  ): Promise<Template> {
    let response: template.UpdateTemplateResponse;
    try {
      response = await this.client.updateTemplate({
        id,
        accountId,
        templateDetails,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async getTemplates(
    accountId: string,
    { order }: OrderRef,
    pageLimit?: number,
    token?: string
  ): Promise<TemplateSummaryPage> {
    let response: template.GetTemplatesResponse;
    try {
      response = await this.client.getTemplates({
        accountId,
        order,
        pageLimit,
        token,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async getNumberOfTemplates(accountId: string): Promise<number> {
    let response: template.GetNumberOfTemplatesResponse;
    try {
      response = await this.client.getNumberOfTemplates({ accountId });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async deleteTemplate({ id, accountId }: TemplateRef): Promise<void> {
    let response: template.DeleteTemplateResponse;
    try {
      response = await this.client.deleteTemplate({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async getWasteDescription({
    id,
    accountId,
  }: SubmissionRef): Promise<WasteDescription> {
    let response: draft.GetDraftWasteDescriptionResponse;
    try {
      response = await this.client.getTemplateWasteDescription({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value as WasteDescription;
  }

  async setWasteDescription(
    { id, accountId }: SubmissionRef,
    value: WasteDescription
  ): Promise<void> {
    let response: draft.SetDraftWasteDescriptionResponse;
    try {
      response = await this.client.setTemplateWasteDescription({
        id,
        accountId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async getExporterDetail({
    id,
    accountId,
  }: SubmissionRef): Promise<ExporterDetail> {
    let response: draft.GetDraftExporterDetailResponse;
    try {
      response = await this.client.getTemplateExporterDetail({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async setExporterDetail(
    { id, accountId }: SubmissionRef,
    value: ExporterDetail
  ): Promise<void> {
    let response: draft.SetDraftExporterDetailResponse;
    try {
      response = await this.client.setTemplateExporterDetail({
        id,
        accountId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async getImporterDetail({
    id,
    accountId,
  }: SubmissionRef): Promise<ImporterDetail> {
    let response: draft.GetDraftImporterDetailResponse;
    try {
      response = await this.client.getTemplateImporterDetail({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async setImporterDetail(
    { id, accountId }: SubmissionRef,
    value: ImporterDetail
  ): Promise<void> {
    let response: draft.SetDraftImporterDetailResponse;
    try {
      response = await this.client.setTemplateImporterDetail({
        id,
        accountId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async listCarriers({ id, accountId }: SubmissionRef): Promise<Carriers> {
    let response: draft.ListDraftCarriersResponse;
    try {
      response = await this.client.listTemplateCarriers({ id, accountId });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async createCarriers(
    { id, accountId }: SubmissionRef,
    value: Omit<Carriers, 'transport' | 'values'>
  ): Promise<Carriers> {
    let response: draft.CreateDraftCarriersResponse;
    try {
      response = await this.client.createTemplateCarriers({
        id,
        accountId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async getCarriers(
    { id, accountId }: SubmissionRef,
    carrierId: string
  ): Promise<Carriers> {
    let response: draft.GetDraftCarriersResponse;
    try {
      response = await this.client.getTemplateCarriers({
        id,
        accountId,
        carrierId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async setCarriers(
    { id, accountId }: SubmissionRef,
    carrierId: string,
    value: Carriers
  ): Promise<void> {
    if (value.status !== 'NotStarted') {
      for (const c of value.values) {
        c.id = carrierId;
      }
    }

    let response: draft.SetDraftCarriersResponse;
    try {
      response = await this.client.setTemplateCarriers({
        id,
        accountId,
        carrierId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async deleteCarriers(
    { id, accountId }: SubmissionRef,
    carrierId: string
  ): Promise<void> {
    let response: draft.DeleteDraftCarriersResponse;
    try {
      response = await this.client.deleteTemplateCarriers({
        id,
        accountId,
        carrierId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async getCollectionDetail({
    id,
    accountId,
  }: SubmissionRef): Promise<CollectionDetail> {
    let response: draft.GetDraftCollectionDetailResponse;
    try {
      response = await this.client.getTemplateCollectionDetail({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async setCollectionDetail(
    { id, accountId }: SubmissionRef,
    value: CollectionDetail
  ): Promise<void> {
    let response: draft.SetDraftCollectionDetailResponse;
    try {
      response = await this.client.setTemplateCollectionDetail({
        id,
        accountId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async getExitLocation({
    id,
    accountId,
  }: SubmissionRef): Promise<ExitLocation> {
    let response: draft.GetDraftUkExitLocationResponse;
    try {
      response = await this.client.getTemplateUkExitLocation({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async setExitLocation(
    { id, accountId }: SubmissionRef,
    value: ExitLocation
  ): Promise<void> {
    let response: draft.SetDraftUkExitLocationResponse;
    try {
      response = await this.client.setTemplateUkExitLocation({
        id,
        accountId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async getTransitCountries({
    id,
    accountId,
  }: SubmissionRef): Promise<TransitCountries> {
    let response: draft.GetDraftTransitCountriesResponse;
    try {
      response = await this.client.getTemplateTransitCountries({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async setTransitCountries(
    { id, accountId }: SubmissionRef,
    value: TransitCountries
  ): Promise<void> {
    let response: draft.SetDraftTransitCountriesResponse;
    try {
      response = await this.client.setTemplateTransitCountries({
        id,
        accountId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async listRecoveryFacilityDetail({
    id,
    accountId,
  }: SubmissionRef): Promise<RecoveryFacilityDetail> {
    let response: draft.ListDraftRecoveryFacilityDetailsResponse;
    try {
      response = await this.client.listTemplateRecoveryFacilityDetails({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async createRecoveryFacilityDetail(
    { id, accountId }: SubmissionRef,
    value: Omit<RecoveryFacilityDetail, 'values'>
  ): Promise<RecoveryFacilityDetail> {
    let response: draft.CreateDraftRecoveryFacilityDetailsResponse;
    try {
      response = await this.client.createTemplateRecoveryFacilityDetails({
        id,
        accountId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async getRecoveryFacilityDetail(
    { id, accountId }: SubmissionRef,
    rfdId: string
  ): Promise<RecoveryFacilityDetail> {
    let response: draft.GetDraftRecoveryFacilityDetailsResponse;
    try {
      response = await this.client.getTemplateRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async setRecoveryFacilityDetail(
    { id, accountId }: SubmissionRef,
    rfdId: string,
    value: RecoveryFacilityDetail
  ): Promise<void> {
    if (value.status === 'Started' || value.status === 'Complete') {
      for (const c of value.values) {
        c.id = rfdId;
      }
    }

    let response: draft.SetDraftRecoveryFacilityDetailsResponse;
    try {
      response = await this.client.setTemplateRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async deleteRecoveryFacilityDetail(
    { id, accountId }: SubmissionRef,
    rfdId: string
  ): Promise<void> {
    let response: draft.DeleteDraftRecoveryFacilityDetailsResponse;
    try {
      response = await this.client.deleteTemplateRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }
}
