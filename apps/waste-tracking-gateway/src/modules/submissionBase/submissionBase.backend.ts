import Boom from '@hapi/boom';
import {
  Template,
  GetDraftByIdResponse,
  GetTemplateByIdResponse,
  DraftWasteDescription,
  DraftExitLocation,
  DraftTransitCountries,
} from '@wts/api/annex-vii';
import * as dto from '@wts/api/waste-tracking-gateway';
import { DaprAnnexViiClient } from '@wts/client/annex-vii';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import { Submission } from '../submission/submission.backend';
import { TemplateRef } from '../template';

export type WasteDescription = dto.WasteDescription;
export type ExporterDetail = dto.ExporterDetail;
export type ImporterDetail = dto.ImporterDetail;
export type Carriers = dto.Carriers;
export type CarrierData = dto.CarrierData;
export type CollectionDetail = dto.CollectionDetail;
export type ExitLocation = dto.ExitLocation;
export type TransitCountries = dto.TransitCountries;
export type RecoveryFacilityDetail = dto.RecoveryFacilityDetail;
export type RecoveryFacilityData = dto.RecoveryFacilityData;

export type SubmissionRef = {
  id: string;
  accountId: string;
};

export type SubmissionBasePlusId = {
  submissionBase: dto.SubmissionBase;
  id: string;
};

export interface SubmissionBaseBackend {
  getSubmission(ref: SubmissionRef): Promise<Submission>;
  getTemplate({ id }: TemplateRef): Promise<Template>;
  getWasteDescription(ref: SubmissionRef): Promise<WasteDescription>;
  setWasteDescription(
    { id }: SubmissionRef,
    value: DraftWasteDescription
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
  getExitLocation(ref: SubmissionRef): Promise<DraftExitLocation>;
  setExitLocation(ref: SubmissionRef, value: DraftExitLocation): Promise<void>;
  getTransitCountries(ref: SubmissionRef): Promise<DraftTransitCountries>;
  setTransitCountries(
    ref: SubmissionRef,
    value: DraftTransitCountries
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

/**
 * This is a mock backend and should not be used in production.
 */
export abstract class InMemorySubmissionBaseBackend
  implements SubmissionBaseBackend
{
  constructor(
    protected submissions: Map<string, Submission>,
    protected templates: Map<string, Template>
  ) {}

  protected paginateArray<T>(
    array: T[],
    pageSize: number,
    pageNumber: number
  ): T[] {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

  getSubmissionMap(): Map<string, Submission> {
    return this.submissions;
  }

  getTemplateMap(): Map<string, Template> {
    return this.templates;
  }

  abstract getWasteDescription(ref: SubmissionRef): Promise<WasteDescription>;

  abstract setWasteDescription(
    { id }: SubmissionRef,
    value: DraftWasteDescription
  ): Promise<void>;

  abstract getExporterDetail(ref: SubmissionRef): Promise<dto.ExporterDetail>;

  abstract setExporterDetail(
    ref: SubmissionRef,
    value: dto.ExporterDetail
  ): Promise<void>;

  abstract getImporterDetail(ref: SubmissionRef): Promise<dto.ImporterDetail>;

  abstract setImporterDetail(
    ref: SubmissionRef,
    value: dto.ImporterDetail
  ): Promise<void>;

  abstract listCarriers(ref: SubmissionRef): Promise<dto.Carriers>;

  abstract getCarriers(
    ref: SubmissionRef,
    carrierId: string
  ): Promise<dto.Carriers>;

  abstract createCarriers(
    ref: SubmissionRef,
    value: Omit<dto.Carriers, 'transport' | 'values'>
  ): Promise<dto.Carriers>;

  abstract setCarriers(
    ref: SubmissionRef,
    carrerId: string,
    value: dto.Carriers
  ): Promise<void>;

  abstract deleteCarriers(ref: SubmissionRef, carrierId: string): Promise<void>;

  abstract getCollectionDetail(
    ref: SubmissionRef
  ): Promise<dto.CollectionDetail>;

  abstract setCollectionDetail(
    ref: SubmissionRef,
    value: dto.CollectionDetail
  ): Promise<void>;

  abstract getExitLocation(ref: SubmissionRef): Promise<DraftExitLocation>;

  abstract setExitLocation(
    ref: SubmissionRef,
    value: DraftExitLocation
  ): Promise<void>;

  abstract getTransitCountries(
    ref: SubmissionRef
  ): Promise<DraftTransitCountries>;

  abstract setTransitCountries(
    ref: SubmissionRef,
    value: DraftTransitCountries
  ): Promise<void>;

  abstract listRecoveryFacilityDetail(
    ref: SubmissionRef
  ): Promise<dto.RecoveryFacilityDetail>;

  abstract createRecoveryFacilityDetail(
    ref: SubmissionRef,
    value: Omit<dto.RecoveryFacilityDetail, 'values'>
  ): Promise<dto.RecoveryFacilityDetail>;

  abstract getRecoveryFacilityDetail(
    ref: SubmissionRef,
    id: string
  ): Promise<dto.RecoveryFacilityDetail>;

  abstract setRecoveryFacilityDetail(
    ref: SubmissionRef,
    id: string,
    value: dto.RecoveryFacilityDetail
  ): Promise<void>;

  abstract deleteRecoveryFacilityDetail(
    ref: SubmissionRef,
    id: string
  ): Promise<void>;

  protected isSmallWaste(wasteDescription: DraftWasteDescription): boolean {
    return (
      wasteDescription.status === 'Complete' &&
      wasteDescription.wasteCode.type === 'NotApplicable'
    );
  }

  protected isWasteCodeChangingBulkToSmall(
    currentWasteDescription: WasteDescription,
    newWasteDescription: DraftWasteDescription
  ): boolean {
    return (
      currentWasteDescription.status !== 'NotStarted' &&
      currentWasteDescription.wasteCode?.type !== 'NotApplicable' &&
      newWasteDescription.status !== 'NotStarted' &&
      newWasteDescription.wasteCode?.type === 'NotApplicable'
    );
  }

  protected isWasteCodeChangingSmallToBulk(
    currentWasteDescription: WasteDescription,
    newWasteDescription: DraftWasteDescription
  ): boolean {
    return (
      currentWasteDescription.status !== 'NotStarted' &&
      currentWasteDescription.wasteCode?.type === 'NotApplicable' &&
      newWasteDescription.status !== 'NotStarted' &&
      newWasteDescription.wasteCode?.type !== 'NotApplicable'
    );
  }

  protected isWasteCodeChangingBulkToBulkDifferentType(
    currentWasteDescription: WasteDescription,
    newWasteDescription: DraftWasteDescription
  ): boolean {
    return (
      currentWasteDescription.status !== 'NotStarted' &&
      currentWasteDescription.wasteCode?.type !== 'NotApplicable' &&
      newWasteDescription.status !== 'NotStarted' &&
      newWasteDescription.wasteCode?.type !== 'NotApplicable' &&
      currentWasteDescription.wasteCode?.type !==
        newWasteDescription.wasteCode?.type
    );
  }

  protected isWasteCodeChangingBulkToBulkSameType(
    currentWasteDescription: WasteDescription,
    newWasteDescription: DraftWasteDescription
  ): boolean {
    return (
      currentWasteDescription.status !== 'NotStarted' &&
      currentWasteDescription.wasteCode?.type !== 'NotApplicable' &&
      newWasteDescription.status !== 'NotStarted' &&
      currentWasteDescription.wasteCode?.type ===
        newWasteDescription.wasteCode?.type &&
      currentWasteDescription.wasteCode?.code !==
        newWasteDescription.wasteCode?.code
    );
  }

  protected copyCarriersNoTransport(
    sourceCarriers: dto.Carriers,
    isSmallWaste: boolean
  ): dto.Carriers {
    let targetCarriers: dto.Carriers = {
      status: 'NotStarted',
      transport: true,
    };

    if (sourceCarriers.status !== 'NotStarted') {
      const carriers: dto.Carrier[] = [];
      for (const c of sourceCarriers.values) {
        const carrier: dto.Carrier = {
          id: uuidv4(),
          addressDetails: c.addressDetails,
          contactDetails: c.contactDetails,
        };
        carriers.push(carrier);
      }
      targetCarriers = {
        status: isSmallWaste ? sourceCarriers.status : 'Started',
        transport: true,
        values: carriers,
      };
    }

    return targetCarriers;
  }

  protected copyRecoveryFacilities(
    sourceFacilities: dto.RecoveryFacilityDetail
  ): dto.RecoveryFacilityDetail {
    let targetFacilities: dto.RecoveryFacilityDetail = { status: 'NotStarted' };

    if (
      sourceFacilities.status === 'Started' ||
      sourceFacilities.status === 'Complete'
    ) {
      const facilities: dto.RecoveryFacility[] = [];
      for (const r of sourceFacilities.values) {
        const facility: dto.RecoveryFacility = {
          id: uuidv4(),
          addressDetails: r.addressDetails,
          contactDetails: r.contactDetails,
          recoveryFacilityType: r.recoveryFacilityType,
        };
        facilities.push(facility);
      }
      targetFacilities = {
        status: sourceFacilities.status,
        values: facilities,
      };
    } else {
      targetFacilities = {
        status: sourceFacilities.status,
      };
    }

    return targetFacilities;
  }

  getSubmission({ id, accountId }: SubmissionRef): Promise<Submission> {
    const value = this.submissions.get(JSON.stringify({ id, accountId }));
    if (
      value === undefined ||
      value.submissionState.status === 'Cancelled' ||
      value.submissionState.status === 'Deleted'
    ) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(value);
  }

  getTemplate({ id, accountId }: TemplateRef): Promise<Template> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(template);
  }

  protected setBaseWasteDescription(
    submissionBase: dto.SubmissionBase,
    value: DraftWasteDescription
  ): dto.SubmissionBase {
    let recoveryFacilityDetail: dto.Submission['recoveryFacilityDetail'] =
      submissionBase.recoveryFacilityDetail.status === 'CannotStart' &&
      value.status !== 'NotStarted' &&
      value.wasteCode !== undefined
        ? { status: 'NotStarted' }
        : submissionBase.recoveryFacilityDetail;

    let carriers: dto.Submission['carriers'] = submissionBase.carriers;

    if (
      submissionBase.wasteDescription.status === 'NotStarted' &&
      value.status !== 'NotStarted' &&
      value.wasteCode?.type === 'NotApplicable'
    ) {
      carriers.transport = false;
    }

    if (
      this.isWasteCodeChangingBulkToSmall(
        submissionBase.wasteDescription,
        value
      )
    ) {
      if (value.status === 'Started') {
        value.ewcCodes = undefined;
        value.nationalCode = undefined;
        value.description = undefined;
      }

      carriers = { status: 'NotStarted', transport: false };

      recoveryFacilityDetail = { status: 'NotStarted' };
    }

    if (
      this.isWasteCodeChangingSmallToBulk(
        submissionBase.wasteDescription,
        value
      )
    ) {
      if (value.status === 'Started') {
        value.ewcCodes = undefined;
        value.nationalCode = undefined;
        value.description = undefined;
      }

      carriers = { status: 'NotStarted', transport: true };

      recoveryFacilityDetail = { status: 'NotStarted' };
    }

    if (
      this.isWasteCodeChangingBulkToBulkDifferentType(
        submissionBase.wasteDescription,
        value
      )
    ) {
      if (value.status === 'Started') {
        value.ewcCodes = undefined;
        value.nationalCode = undefined;
        value.description = undefined;
      }

      carriers = { status: 'NotStarted', transport: true };

      recoveryFacilityDetail = { status: 'NotStarted' };
    }

    if (
      this.isWasteCodeChangingBulkToBulkSameType(
        submissionBase.wasteDescription,
        value
      )
    ) {
      if (value.status === 'Started') {
        value.ewcCodes = undefined;
        value.nationalCode = undefined;
        value.description = undefined;
      }

      if (submissionBase.carriers.status !== 'NotStarted') {
        carriers = {
          status: 'Started',
          transport: true,
          values: submissionBase.carriers.values,
        };
      }

      if (
        submissionBase.recoveryFacilityDetail.status === 'Started' ||
        submissionBase.recoveryFacilityDetail.status === 'Complete'
      ) {
        recoveryFacilityDetail = {
          status: 'Started',
          values: submissionBase.recoveryFacilityDetail.values,
        };
      }
    }

    submissionBase.wasteDescription = value as WasteDescription;
    submissionBase.carriers = carriers;
    submissionBase.recoveryFacilityDetail = recoveryFacilityDetail;

    return submissionBase;
  }

  protected setBaseExporterDetail(
    submissionBase: dto.SubmissionBase,
    value: ExporterDetail
  ): dto.SubmissionBase {
    submissionBase.exporterDetail = value;

    return submissionBase;
  }

  protected setBaseImporterDetail(
    submissionBase: dto.SubmissionBase,
    value: ImporterDetail
  ): dto.SubmissionBase {
    submissionBase.importerDetail = value;

    return submissionBase;
  }

  protected createBaseCarriers(
    submissionBase: dto.SubmissionBase,
    value: Omit<Carriers, 'transport' | 'values'>
  ): SubmissionBasePlusId {
    const submissionBasePlusId = {
      submissionBase: submissionBase,
      id: uuidv4(),
    };
    const transport: Carriers['transport'] =
      submissionBase.wasteDescription.status !== 'NotStarted' &&
      submissionBase.wasteDescription.wasteCode?.type === 'NotApplicable'
        ? false
        : true;

    if (submissionBase.carriers.status === 'NotStarted') {
      submissionBasePlusId.submissionBase.carriers = {
        status: value.status,
        transport: transport,
        values: [{ id: submissionBasePlusId.id }],
      };

      return submissionBasePlusId;
    }

    const carriers: dto.Carrier[] = [];
    for (const c of submissionBase.carriers.values) {
      carriers.push(c);
    }
    carriers.push({ id: submissionBasePlusId.id });
    submissionBasePlusId.submissionBase.carriers = {
      status: value.status,
      transport: transport,
      values: carriers,
    };

    return submissionBasePlusId;
  }

  setBaseNoCarriers(
    submissionBase: dto.SubmissionBase,
    carrierId: string,
    value: Carriers
  ): dto.SubmissionBase {
    if (value.status === 'NotStarted') {
      submissionBase.carriers = value;

      return submissionBase;
    }

    return submissionBase;
  }

  setBaseCarriers(
    submissionBase: dto.SubmissionBase,
    carrierId: string,
    value: Carriers,
    carrier: dto.Carrier,
    index: number
  ): dto.SubmissionBase {
    if (
      submissionBase !== undefined &&
      submissionBase.carriers.status !== 'NotStarted' &&
      value.status !== 'NotStarted'
    ) {
      submissionBase.carriers.status = value.status;
      submissionBase.carriers.values[index] = carrier as dto.Carrier;
    }
    return submissionBase;
  }

  deleteBaseCarriers(
    submissionBase: dto.SubmissionBase,
    carrierId: string
  ): dto.SubmissionBase {
    if (submissionBase.carriers.status !== 'NotStarted') {
      const index = submissionBase.carriers.values.findIndex((c) => {
        return c.id === carrierId;
      });

      submissionBase.carriers.values.splice(index, 1);
      if (submissionBase.carriers.values.length === 0) {
        const transport: Carriers['transport'] =
          submissionBase.wasteDescription.status !== 'NotStarted' &&
          submissionBase.wasteDescription.wasteCode?.type === 'NotApplicable'
            ? false
            : true;

        submissionBase.carriers = {
          status: 'NotStarted',
          transport: transport,
        };
      }
    }

    return submissionBase;
  }

  setBaseCollectionDetail(
    submissionBase: dto.SubmissionBase,
    value: CollectionDetail
  ): dto.SubmissionBase {
    submissionBase.collectionDetail = value;

    return submissionBase;
  }

  setBaseExitLocation(
    submissionBase: dto.SubmissionBase,
    value: ExitLocation
  ): dto.SubmissionBase {
    submissionBase.ukExitLocation = value;

    return submissionBase;
  }

  setBaseTransitCountries(
    submissionBase: dto.SubmissionBase,
    value: TransitCountries
  ): dto.SubmissionBase {
    submissionBase.transitCountries = value;

    return submissionBase;
  }

  createBaseRecoveryFacilityDetail(
    submissionBase: dto.SubmissionBase,
    value: Omit<RecoveryFacilityDetail, 'values'>
  ): SubmissionBasePlusId {
    const submissionBasePlusId = {
      submissionBase: submissionBase,
      id: uuidv4(),
    };
    if (
      submissionBase.recoveryFacilityDetail.status !== 'Started' &&
      submissionBase.recoveryFacilityDetail.status !== 'Complete'
    ) {
      submissionBasePlusId.submissionBase.recoveryFacilityDetail = {
        status: value.status,
        values: [{ id: submissionBasePlusId.id }],
      };

      return submissionBasePlusId;
    }

    const facilities: dto.RecoveryFacility[] = [];
    for (const rf of submissionBase.recoveryFacilityDetail.values) {
      facilities.push(rf);
    }
    facilities.push({ id: submissionBasePlusId.id });
    submissionBasePlusId.submissionBase.recoveryFacilityDetail = {
      status: value.status,
      values: facilities,
    };

    return submissionBasePlusId;
  }

  setBaseRecoveryFacilityDetail(
    submissionBase: dto.SubmissionBase,
    rfdId: string,
    value: RecoveryFacilityDetail
  ): dto.SubmissionBase {
    if (submissionBase !== undefined) {
      if (
        submissionBase.recoveryFacilityDetail.status === 'Started' ||
        submissionBase.recoveryFacilityDetail.status === 'Complete'
      ) {
        if (value.status !== 'Started' && value.status !== 'Complete') {
          submissionBase.recoveryFacilityDetail = value;
          return submissionBase;
        }

        const recoveryFacility = value.values.find((rf) => {
          return rf.id === rfdId;
        });

        const index = submissionBase.recoveryFacilityDetail.values.findIndex(
          (rf) => {
            return rf.id === rfdId;
          }
        );
        submissionBase.recoveryFacilityDetail.status = value.status;
        submissionBase.recoveryFacilityDetail.values[index] =
          recoveryFacility as dto.RecoveryFacility;
      }
    }

    return submissionBase;
  }

  deleteBaseRecoveryFacilityDetail(
    submissionBase: dto.SubmissionBase,
    rfdId: string
  ): dto.SubmissionBase {
    if (
      submissionBase.recoveryFacilityDetail.status === 'Started' ||
      submissionBase.recoveryFacilityDetail.status === 'Complete'
    ) {
      const index = submissionBase.recoveryFacilityDetail.values.findIndex(
        (rf) => {
          return rf.id === rfdId;
        }
      );

      if (index !== -1) {
        submissionBase.recoveryFacilityDetail.values.splice(index, 1);
        if (submissionBase.recoveryFacilityDetail.values.length === 0) {
          submissionBase.recoveryFacilityDetail = { status: 'NotStarted' };
        }
      }
    }

    return submissionBase;
  }
}

export abstract class AnnexViiServiceSubmissionBaseBackend {
  constructor(protected client: DaprAnnexViiClient, protected logger: Logger) {}

  async getSubmission({ id, accountId }: SubmissionRef): Promise<Submission> {
    let response: GetDraftByIdResponse;
    try {
      response = await this.client.getDraftById({ id, accountId });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value as Submission;
  }

  async getTemplate({ id, accountId }: TemplateRef): Promise<Template> {
    let response: GetTemplateByIdResponse;
    try {
      response = await this.client.getTemplateById({ id, accountId });
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

  abstract getWasteDescription({
    id,
    accountId,
  }: SubmissionRef): Promise<WasteDescription>;

  abstract setWasteDescription(
    { id, accountId }: SubmissionRef,
    value: DraftWasteDescription
  ): Promise<void>;

  abstract getExporterDetail({
    id,
    accountId,
  }: SubmissionRef): Promise<ExporterDetail>;

  abstract setExporterDetail(
    { id, accountId }: SubmissionRef,
    value: ExporterDetail
  ): Promise<void>;

  abstract getImporterDetail({
    id,
    accountId,
  }: SubmissionRef): Promise<ImporterDetail>;

  abstract setImporterDetail(
    { id, accountId }: SubmissionRef,
    value: ImporterDetail
  ): Promise<void>;

  abstract listCarriers({ id, accountId }: SubmissionRef): Promise<Carriers>;

  abstract createCarriers(
    { id, accountId }: SubmissionRef,
    value: Omit<Carriers, 'transport' | 'values'>
  ): Promise<Carriers>;

  abstract getCarriers(
    { id, accountId }: SubmissionRef,
    carrierId: string
  ): Promise<Carriers>;

  abstract setCarriers(
    { id, accountId }: SubmissionRef,
    carrierId: string,
    value: Carriers
  ): Promise<void>;

  abstract deleteCarriers(
    { id, accountId }: SubmissionRef,
    carrierId: string
  ): Promise<void>;

  abstract getCollectionDetail({
    id,
    accountId,
  }: SubmissionRef): Promise<CollectionDetail>;

  abstract setCollectionDetail(
    { id, accountId }: SubmissionRef,
    value: CollectionDetail
  ): Promise<void>;

  abstract getExitLocation({
    id,
    accountId,
  }: SubmissionRef): Promise<DraftExitLocation>;

  abstract setExitLocation(
    { id, accountId }: SubmissionRef,
    value: DraftExitLocation
  ): Promise<void>;

  abstract getTransitCountries({
    id,
    accountId,
  }: SubmissionRef): Promise<DraftTransitCountries>;

  abstract setTransitCountries(
    { id, accountId }: SubmissionRef,
    value: DraftTransitCountries
  ): Promise<void>;

  abstract listRecoveryFacilityDetail({
    id,
    accountId,
  }: SubmissionRef): Promise<RecoveryFacilityDetail>;

  abstract createRecoveryFacilityDetail(
    { id, accountId }: SubmissionRef,
    value: Omit<RecoveryFacilityDetail, 'values'>
  ): Promise<RecoveryFacilityDetail>;

  abstract getRecoveryFacilityDetail(
    { id, accountId }: SubmissionRef,
    rfdId: string
  ): Promise<RecoveryFacilityDetail>;

  abstract setRecoveryFacilityDetail(
    { id, accountId }: SubmissionRef,
    rfdId: string,
    value: RecoveryFacilityDetail
  ): Promise<void>;

  abstract deleteRecoveryFacilityDetail(
    { id, accountId }: SubmissionRef,
    rfdId: string
  ): Promise<void>;
}
