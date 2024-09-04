import Boom from '@hapi/boom';
import { draft, submission } from '@wts/api/green-list-waste-export';
import {
  Carriers,
  CollectionDate,
  CollectionDetail,
  CustomerReference,
  ExitLocation,
  ExporterDetail,
  ImporterDetail,
  NumberOfSubmissions,
  RecoveryFacilityDetail,
  CancellationType,
  SubmissionConfirmation,
  SubmissionDeclaration,
  DraftSubmissionState,
  SubmissionSummaryPage,
  TransitCountries,
  WasteDescription,
  WasteQuantity,
  DraftSubmission,
  Submission,
  WasteQuantityData,
  CollectionDateData,
} from '@wts/api/waste-tracking-gateway';
import { DaprAnnexViiClient } from '@wts/client/green-list-waste-export';
import { Logger } from 'winston';

export interface SubmissionRef {
  id: string;
  accountId: string;
}

export type SubmissionTypeRef = SubmissionRef & {
  submitted: boolean;
};

export interface TemplateRef {
  id: string;
  accountId: string;
}

export interface OrderRef {
  order: 'ASC' | 'DESC';
}

export interface SubmissionBackend {
  getSubmission(ref: SubmissionTypeRef): Promise<DraftSubmission | Submission>;
  getWasteDescription(ref: SubmissionRef): Promise<WasteDescription>;
  setWasteDescription(
    { id }: SubmissionRef,
    value: WasteDescription,
  ): Promise<void>;
  getExporterDetail(ref: SubmissionRef): Promise<ExporterDetail>;
  setExporterDetail(ref: SubmissionRef, value: ExporterDetail): Promise<void>;
  getImporterDetail(ref: SubmissionRef): Promise<ImporterDetail>;
  setImporterDetail(ref: SubmissionRef, value: ImporterDetail): Promise<void>;
  listCarriers(ref: SubmissionRef): Promise<Carriers>;
  getCarriers(ref: SubmissionRef, carrierId: string): Promise<Carriers>;
  createCarriers(
    ref: SubmissionRef,
    value: Omit<Carriers, 'transport' | 'values'>,
  ): Promise<Carriers>;
  setCarriers(
    ref: SubmissionRef,
    carrerId: string,
    value: Carriers,
  ): Promise<void>;
  deleteCarriers(ref: SubmissionRef, carrierId: string): Promise<void>;
  getCollectionDetail(ref: SubmissionRef): Promise<CollectionDetail>;
  setCollectionDetail(
    ref: SubmissionRef,
    value: CollectionDetail,
  ): Promise<void>;
  getExitLocation(ref: SubmissionRef): Promise<ExitLocation>;
  setExitLocation(ref: SubmissionRef, value: ExitLocation): Promise<void>;
  getTransitCountries(ref: SubmissionRef): Promise<TransitCountries>;
  setTransitCountries(
    ref: SubmissionRef,
    value: TransitCountries,
  ): Promise<void>;
  listRecoveryFacilityDetail(
    ref: SubmissionRef,
  ): Promise<RecoveryFacilityDetail>;
  createRecoveryFacilityDetail(
    ref: SubmissionRef,
    value: Omit<RecoveryFacilityDetail, 'values'>,
  ): Promise<RecoveryFacilityDetail>;
  getRecoveryFacilityDetail(
    ref: SubmissionRef,
    id: string,
  ): Promise<RecoveryFacilityDetail>;
  setRecoveryFacilityDetail(
    ref: SubmissionRef,
    id: string,
    value: RecoveryFacilityDetail,
  ): Promise<void>;
  deleteRecoveryFacilityDetail(ref: SubmissionRef, id: string): Promise<void>;
  createSubmission(
    accountId: string,
    reference: CustomerReference,
  ): Promise<DraftSubmission>;
  createSubmissionFromTemplate(
    id: string,
    accountId: string,
    reference: CustomerReference,
  ): Promise<DraftSubmission>;
  deleteSubmission(ref: SubmissionRef): Promise<void>;
  cancelSubmission(
    ref: SubmissionRef,
    cancellationType: CancellationType,
  ): Promise<void>;
  getSubmissions(
    accountId: string,
    order: OrderRef,
    pageLimit?: number,
    state?: DraftSubmissionState['status'][],
    token?: string,
  ): Promise<SubmissionSummaryPage>;
  getCustomerReference(ref: SubmissionRef): Promise<CustomerReference>;
  setCustomerReference(
    ref: SubmissionRef,
    value: CustomerReference,
  ): Promise<void>;
  getWasteQuantity(
    ref: SubmissionTypeRef,
  ): Promise<WasteQuantity | WasteQuantityData>;
  setWasteQuantity(
    ref: SubmissionTypeRef,
    value: WasteQuantity | WasteQuantityData,
  ): Promise<void>;
  getCollectionDate(
    ref: SubmissionTypeRef,
  ): Promise<CollectionDate | CollectionDateData>;
  setCollectionDate(
    ref: SubmissionTypeRef,
    value: CollectionDate | CollectionDateData,
  ): Promise<void>;
  getSubmissionConfirmation(
    ref: SubmissionRef,
  ): Promise<SubmissionConfirmation>;
  setSubmissionConfirmation(
    ref: SubmissionRef,
    value: SubmissionConfirmation,
  ): Promise<void>;
  getSubmissionDeclaration(ref: SubmissionRef): Promise<SubmissionDeclaration>;
  setSubmissionDeclaration(
    ref: SubmissionRef,
    value: Omit<SubmissionDeclaration, 'values'>,
  ): Promise<void>;
  getNumberOfSubmissions(accountId: string): Promise<NumberOfSubmissions>;
}

export class AnnexViiServiceSubmissionBackend implements SubmissionBackend {
  constructor(
    protected client: DaprAnnexViiClient,
    protected logger: Logger,
  ) {}

  async getSubmission({
    id,
    accountId,
    submitted,
  }: SubmissionTypeRef): Promise<DraftSubmission | Submission> {
    let response: draft.GetDraftResponse | submission.GetSubmissionResponse;
    try {
      if (!submitted) {
        response = (await this.client.getDraft({
          id,
          accountId,
        })) as draft.GetDraftResponse;
      } else {
        response = (await this.client.getSubmission({
          id,
          accountId,
        })) as submission.GetSubmissionResponse;
      }
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return !submitted
      ? (response.value as DraftSubmission)
      : (response.value as unknown as Submission);
  }

  async createSubmission(
    accountId: string,
    reference: CustomerReference,
  ): Promise<DraftSubmission> {
    let response: draft.CreateDraftResponse;
    try {
      response = await this.client.createDraft({ accountId, reference });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value as DraftSubmission;
  }

  async createSubmissionFromTemplate(
    id: string,
    accountId: string,
    reference: CustomerReference,
  ): Promise<draft.DraftSubmission> {
    let response: draft.CreateDraftResponse;
    try {
      response = await this.client.createDraftFromTemplate({
        id,
        accountId,
        reference,
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

  async deleteSubmission({ id, accountId }: SubmissionRef): Promise<void> {
    let response: draft.DeleteDraftResponse;
    try {
      response = await this.client.deleteDraft({
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

  async cancelSubmission(
    { id, accountId }: SubmissionRef,
    cancellationType: CancellationType,
  ): Promise<void> {
    let response: submission.CancelSubmissionResponse;
    try {
      response = await this.client.cancelSubmission({
        id,
        accountId,
        cancellationType,
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

  async getSubmissions(
    accountId: string,
    { order }: OrderRef,
    pageLimit?: number,
    state?: DraftSubmissionState['status'][],
    token?: string,
  ): Promise<SubmissionSummaryPage> {
    let response: draft.GetDraftsResponse | submission.GetSubmissionsResponse;
    try {
      if (
        state?.includes('SubmittedWithEstimates') ||
        state?.includes('SubmittedWithActuals') ||
        state?.includes('UpdatedWithActuals') ||
        state?.includes('Cancelled')
      ) {
        response = (await this.client.getSubmissions({
          accountId,
          order,
          pageLimit,
          state,
          token,
        })) as submission.GetSubmissionsResponse;
      } else {
        response = (await this.client.getDrafts({
          accountId,
          order,
          pageLimit,
          state,
          token,
        })) as draft.GetDraftsResponse;
      }
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

  async getCustomerReference({
    id,
    accountId,
  }: SubmissionRef): Promise<CustomerReference> {
    let response: draft.GetDraftCustomerReferenceResponse;
    try {
      response = await this.client.getDraftCustomerReference({
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

  async setCustomerReference(
    { id, accountId }: SubmissionRef,
    reference: CustomerReference,
  ): Promise<void> {
    let response: draft.SetDraftCustomerReferenceResponse;
    try {
      response = await this.client.setDraftCustomerReference({
        id,
        accountId,
        reference,
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
      response = await this.client.getDraftWasteDescription({
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
    value: WasteDescription,
  ): Promise<void> {
    let response: draft.SetDraftWasteDescriptionResponse;
    try {
      response = await this.client.setDraftWasteDescription({
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
        data: response.error.data,
      });
    }
  }

  async getWasteQuantity({
    id,
    accountId,
    submitted,
  }: SubmissionTypeRef): Promise<WasteQuantity | WasteQuantityData> {
    let response:
      | draft.GetDraftWasteQuantityResponse
      | submission.GetWasteQuantityResponse;
    try {
      if (!submitted) {
        response = (await this.client.getDraftWasteQuantity({
          id,
          accountId,
        })) as draft.GetDraftWasteQuantityResponse;
      } else {
        response = (await this.client.getWasteQuantity({
          id,
          accountId,
        })) as submission.GetWasteQuantityResponse;
      }
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return !submitted
      ? (response.value as WasteQuantity)
      : (response.value as WasteQuantityData);
  }

  async setWasteQuantity(
    { id, accountId, submitted }: SubmissionTypeRef,
    value: WasteQuantity | WasteQuantityData,
  ): Promise<void> {
    let response:
      | draft.SetDraftWasteQuantityResponse
      | submission.SetWasteQuantityResponse;
    try {
      if (!submitted) {
        response = await this.client.setDraftWasteQuantity({
          id,
          accountId,
          value: value as WasteQuantity,
        });
      } else {
        response = await this.client.setWasteQuantity({
          id,
          accountId,
          value: value as WasteQuantityData,
        });
      }
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
      response = await this.client.getDraftExporterDetail({
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
    value: ExporterDetail,
  ): Promise<void> {
    let response: draft.SetDraftExporterDetailResponse;
    try {
      response = await this.client.setDraftExporterDetail({
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
      response = await this.client.getDraftImporterDetail({
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
    value: ImporterDetail,
  ): Promise<void> {
    let response: draft.SetDraftImporterDetailResponse;
    try {
      response = await this.client.setDraftImporterDetail({
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

  async getCollectionDate({
    id,
    accountId,
    submitted,
  }: SubmissionTypeRef): Promise<CollectionDate | CollectionDateData> {
    let response:
      | draft.GetDraftCollectionDateResponse
      | submission.GetCollectionDateResponse;
    try {
      if (!submitted) {
        response = (await this.client.getDraftCollectionDate({
          id,
          accountId,
        })) as draft.GetDraftCollectionDateResponse;
      } else {
        response = (await this.client.getCollectionDate({
          id,
          accountId,
        })) as submission.GetCollectionDateResponse;
      }
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return !submitted
      ? (response.value as CollectionDate)
      : (response.value as CollectionDateData);
  }

  async setCollectionDate(
    { id, accountId, submitted }: SubmissionTypeRef,
    value: CollectionDate | CollectionDateData,
  ): Promise<void> {
    let response:
      | draft.SetDraftCollectionDateResponse
      | submission.SetCollectionDateResponse;
    try {
      if (!submitted) {
        response = await this.client.setDraftCollectionDate({
          id,
          accountId,
          value: value as CollectionDate,
        });
      } else {
        response = await this.client.setCollectionDate({
          id,
          accountId,
          value: value as CollectionDateData,
        });
      }
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
        data: response.error.data,
      });
    }
  }

  async listCarriers({ id, accountId }: SubmissionRef): Promise<Carriers> {
    let response: draft.ListDraftCarriersResponse;
    try {
      response = await this.client.listDraftCarriers({ id, accountId });
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
    value: Omit<Carriers, 'transport' | 'values'>,
  ): Promise<Carriers> {
    let response: draft.CreateDraftCarriersResponse;
    try {
      response = await this.client.createDraftCarriers({
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
    carrierId: string,
  ): Promise<Carriers> {
    let response: draft.GetDraftCarriersResponse;
    try {
      response = await this.client.getDraftCarriers({
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
    value: Carriers,
  ): Promise<void> {
    if (value.status !== 'NotStarted') {
      for (const c of value.values) {
        c.id = carrierId;
      }
    }

    let response: draft.SetDraftCarriersResponse;
    try {
      response = await this.client.setDraftCarriers({
        id,
        accountId,
        carrierId,
        value: value as draft.DraftCarriers,
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
    carrierId: string,
  ): Promise<void> {
    let response: draft.DeleteDraftCarriersResponse;
    try {
      response = await this.client.deleteDraftCarriers({
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
      response = await this.client.getDraftCollectionDetail({
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
    value: CollectionDetail,
  ): Promise<void> {
    let response: draft.SetDraftCollectionDetailResponse;
    try {
      response = await this.client.setDraftCollectionDetail({
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
      response = await this.client.getDraftUkExitLocation({
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
    value: ExitLocation,
  ): Promise<void> {
    let response: draft.SetDraftUkExitLocationResponse;
    try {
      response = await this.client.setDraftUkExitLocation({
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
        data: response.error.data,
      });
    }
  }

  async getTransitCountries({
    id,
    accountId,
  }: SubmissionRef): Promise<TransitCountries> {
    let response: draft.GetDraftTransitCountriesResponse;
    try {
      response = await this.client.getDraftTransitCountries({
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
    value: TransitCountries,
  ): Promise<void> {
    let response: draft.SetDraftTransitCountriesResponse;
    try {
      response = await this.client.setDraftTransitCountries({
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
      response = await this.client.listDraftRecoveryFacilityDetails({
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
    value: Omit<RecoveryFacilityDetail, 'values'>,
  ): Promise<RecoveryFacilityDetail> {
    let response: draft.CreateDraftRecoveryFacilityDetailsResponse;
    try {
      response = await this.client.createDraftRecoveryFacilityDetails({
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
    rfdId: string,
  ): Promise<RecoveryFacilityDetail> {
    let response: draft.GetDraftRecoveryFacilityDetailsResponse;
    try {
      response = await this.client.getDraftRecoveryFacilityDetails({
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
    value: RecoveryFacilityDetail,
  ): Promise<void> {
    if (value.status === 'Started' || value.status === 'Complete') {
      for (const c of value.values) {
        c.id = rfdId;
      }
    }

    let response: draft.SetDraftRecoveryFacilityDetailsResponse;
    try {
      response = await this.client.setDraftRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
        value: value as draft.DraftRecoveryFacilityDetails,
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
    rfdId: string,
  ): Promise<void> {
    let response: draft.DeleteDraftRecoveryFacilityDetailsResponse;
    try {
      response = await this.client.deleteDraftRecoveryFacilityDetails({
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

  async getSubmissionConfirmation({
    id,
    accountId,
  }: SubmissionRef): Promise<SubmissionConfirmation> {
    let response: draft.GetDraftSubmissionConfirmationResponse;
    try {
      response = await this.client.getDraftSubmissionConfirmation({
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

  async setSubmissionConfirmation(
    { id, accountId }: SubmissionRef,
    value: SubmissionConfirmation,
  ): Promise<void> {
    let response: draft.SetDraftSubmissionConfirmationResponse;
    try {
      response = await this.client.setDraftSubmissionConfirmation({
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

  async getSubmissionDeclaration({
    id,
    accountId,
  }: SubmissionRef): Promise<SubmissionDeclaration> {
    let response: draft.GetDraftSubmissionDeclarationResponse;
    try {
      response = await this.client.getDraftSubmissionDeclaration({
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

  async setSubmissionDeclaration(
    { id, accountId }: SubmissionRef,
    value: Omit<SubmissionDeclaration, 'values'>,
  ): Promise<void> {
    let response: draft.SetDraftSubmissionDeclarationResponse;
    try {
      response = await this.client.setDraftSubmissionDeclaration({
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

  async getNumberOfSubmissions(
    accountId: string,
  ): Promise<NumberOfSubmissions> {
    let response: submission.GetNumberOfSubmissionsResponse;
    try {
      response = await this.client.getNumberOfSubmissions({ accountId });
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
}
