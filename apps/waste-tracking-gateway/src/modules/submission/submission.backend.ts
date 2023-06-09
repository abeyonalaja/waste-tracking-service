import Boom from '@hapi/boom';
import {
  CreateDraftResponse,
  GetDraftByIdResponse,
  GetDraftCollectionDateByIdResponse,
  GetDraftCustomerReferenceByIdResponse,
  GetDraftExporterDetailByIdResponse,
  GetDraftImporterDetailByIdResponse,
  GetDraftWasteDescriptionByIdResponse,
  GetDraftWasteQuantityByIdResponse,
  SetDraftCollectionDateByIdResponse,
  SetDraftCustomerReferenceByIdResponse,
  SetDraftExporterDetailByIdResponse,
  SetDraftImporterDetailByIdResponse,
  SetDraftWasteDescriptionByIdResponse,
  SetDraftWasteQuantityByIdResponse,
  ListDraftCarriersResponse,
  CreateDraftCarriersResponse,
  GetDraftCarriersResponse,
  SetDraftCarriersResponse,
  DeleteDraftCarriersResponse,
  GetDraftExitLocationByIdResponse,
  SetDraftExitLocationByIdResponse,
  GetDraftTransitCountriesResponse,
  SetDraftTransitCountriesResponse,
  GetDraftCollectionDetailResponse,
  SetDraftCollectionDetailResponse,
  ListDraftRecoveryFacilityDetailsResponse,
  CreateDraftRecoveryFacilityDetailsResponse,
  GetDraftRecoveryFacilityDetailsResponse,
  SetDraftRecoveryFacilityDetailsResponse,
  DeleteDraftRecoveryFacilityDetailsResponse,
} from '@wts/api/annex-vii';
import * as dto from '@wts/api/waste-tracking-gateway';
import { DaprAnnexViiClient } from '@wts/client/annex-vii';
import { differenceInBusinessDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';

export type Submission = dto.Submission;
export type CustomerReference = dto.CustomerReference;
export type WasteDescription = dto.WasteDescription;
export type WasteQuantity = dto.WasteQuantity;
export type ExporterDetail = dto.ExporterDetail;
export type ImporterDetail = dto.ImporterDetail;
export type CollectionDate = dto.CollectionDate;
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

export interface SubmissionBackend {
  createSubmission(
    accountId: string,
    reference: CustomerReference
  ): Promise<Submission>;
  getSubmission(ref: SubmissionRef): Promise<Submission>;
  getCustomerReference(ref: SubmissionRef): Promise<CustomerReference>;
  setCustomerReference(
    ref: SubmissionRef,
    value: CustomerReference
  ): Promise<void>;
  getWasteDescription(ref: SubmissionRef): Promise<WasteDescription>;
  setWasteDescription(
    ref: SubmissionRef,
    value: WasteDescription
  ): Promise<void>;
  getWasteQuantity(ref: SubmissionRef): Promise<WasteQuantity>;
  setWasteQuantity(ref: SubmissionRef, value: WasteQuantity): Promise<void>;
  getExporterDetail(ref: SubmissionRef): Promise<ExporterDetail>;
  setExporterDetail(ref: SubmissionRef, value: ExporterDetail): Promise<void>;
  getImporterDetail(ref: SubmissionRef): Promise<ImporterDetail>;
  setImporterDetail(ref: SubmissionRef, value: ImporterDetail): Promise<void>;
  getCollectionDate(ref: SubmissionRef): Promise<CollectionDate>;
  setCollectionDate(ref: SubmissionRef, value: CollectionDate): Promise<void>;
  listCarriers(ref: SubmissionRef): Promise<Carriers>;
  createCarriers(
    ref: SubmissionRef,
    value: Omit<Carriers, 'transport' | 'values'>
  ): Promise<Carriers>;
  getCarriers(ref: SubmissionRef, carrierId: string): Promise<Carriers>;
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

/**
 * This is a mock backend and should not be used in production.
 */
export class InMemorySubmissionBackend implements SubmissionBackend {
  readonly submissions = new Map<string, Submission>();

  createSubmission(
    _: string,
    reference: CustomerReference
  ): Promise<Submission> {
    if (reference && reference.length > 50) {
      return Promise.reject(
        Boom.badRequest('Supplied reference cannot exceed 50 characters')
      );
    }

    const id = uuidv4();
    const value: Submission = {
      id,
      reference,
      wasteDescription: { status: 'NotStarted' },
      wasteQuantity: { status: 'CannotStart' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      collectionDate: { status: 'NotStarted' },
      carriers: {
        status: 'NotStarted',
        transport: true,
      },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: { status: 'CannotStart' },
    };

    this.submissions.set(id, value);
    return Promise.resolve(value);
  }

  getSubmission({ id }: SubmissionRef): Promise<Submission> {
    const value = this.submissions.get(id);
    if (value === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(value);
  }

  getCustomerReference({ id }: SubmissionRef): Promise<CustomerReference> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.reference);
  }

  setCustomerReference(
    { id }: SubmissionRef,
    value: CustomerReference
  ): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (value && value.length > 50) {
      return Promise.reject(
        Boom.badRequest('Supplied reference cannot exceed 50 characters')
      );
    }

    submission.reference = value;
    this.submissions.set(id, submission);
    return Promise.resolve();
  }

  getWasteDescription({ id }: SubmissionRef): Promise<WasteDescription> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.wasteDescription);
  }

  setWasteDescription(
    { id }: SubmissionRef,
    value: WasteDescription
  ): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    let wasteQuantity: Submission['wasteQuantity'] = submission.wasteQuantity;

    if (
      wasteQuantity.status === 'CannotStart' &&
      (value.status === 'Started' || value.status === 'Complete')
    ) {
      wasteQuantity = { status: 'NotStarted' };
    }

    let carriers: Submission['carriers'] = submission.carriers;

    if (
      submission.wasteDescription.status === 'NotStarted' &&
      value.status !== 'NotStarted' &&
      value.wasteCode?.type === 'NotApplicable'
    ) {
      carriers.transport = false;
    }

    if (
      submission.wasteDescription.status !== 'NotStarted' &&
      submission.wasteDescription.wasteCode?.type !== 'NotApplicable' &&
      value.status !== 'NotStarted' &&
      value.wasteCode?.type === 'NotApplicable'
    ) {
      wasteQuantity = { status: 'NotStarted' };

      if (submission.carriers.status !== 'NotStarted') {
        const updatedCarriers: dto.Carrier[] = [];
        for (const c of submission.carriers.values) {
          const carrier: dto.Carrier = {
            id: c.id,
            addressDetails: c.addressDetails,
            contactDetails: c.contactDetails,
          };
          updatedCarriers.push(carrier);
        }
        carriers = {
          status: 'Started',
          transport: false,
          values: updatedCarriers,
        };
      }

      carriers.transport = false;
    }

    if (
      submission.wasteDescription.status !== 'NotStarted' &&
      submission.wasteDescription.wasteCode?.type === 'NotApplicable' &&
      value.status !== 'NotStarted' &&
      value.wasteCode?.type !== 'NotApplicable'
    ) {
      wasteQuantity = { status: 'NotStarted' };

      if (submission.carriers.status !== 'NotStarted') {
        carriers = {
          status: 'Started',
          transport: true,
          values: submission.carriers.values,
        };
      }

      carriers.transport = true;
    }

    const recoveryFacilityDetail: Submission['recoveryFacilityDetail'] =
      submission.recoveryFacilityDetail.status === 'CannotStart' &&
      value.status !== 'NotStarted' &&
      value.wasteCode !== undefined
        ? { status: 'NotStarted' }
        : submission.recoveryFacilityDetail;

    submission.wasteDescription = value;
    submission.wasteQuantity = wasteQuantity;
    submission.carriers = carriers;
    submission.recoveryFacilityDetail = recoveryFacilityDetail;

    this.submissions.set(id, submission);
    return Promise.resolve();
  }

  getWasteQuantity({ id }: SubmissionRef): Promise<WasteQuantity> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.wasteQuantity);
  }

  setWasteQuantity({ id }: SubmissionRef, value: WasteQuantity): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    submission.wasteQuantity = value;
    this.submissions.set(id, submission);
    return Promise.resolve();
  }

  getExporterDetail({ id }: SubmissionRef): Promise<ExporterDetail> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.exporterDetail);
  }

  setExporterDetail(
    { id }: SubmissionRef,
    value: ExporterDetail
  ): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    submission.exporterDetail = value;
    this.submissions.set(id, submission);
    return Promise.resolve();
  }

  getImporterDetail({ id }: SubmissionRef): Promise<ImporterDetail> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.importerDetail);
  }

  setImporterDetail(
    { id }: SubmissionRef,
    value: ImporterDetail
  ): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    submission.importerDetail = value;
    this.submissions.set(id, submission);
    return Promise.resolve();
  }

  getCollectionDate({ id }: SubmissionRef): Promise<CollectionDate> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.collectionDate);
  }

  setCollectionDate(
    { id }: SubmissionRef,
    value: CollectionDate
  ): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (value.status !== 'NotStarted') {
      const { day: dayStr, month: monthStr, year: yearStr } = value.value;

      const [day, month, year] = [
        parseInt(dayStr),
        parseInt(monthStr) - 1,
        parseInt(yearStr),
      ];

      if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
        return Promise.reject(Boom.badRequest());
      }

      if (
        differenceInBusinessDays(new Date(year, month, day), new Date()) < 3
      ) {
        return Promise.reject(Boom.badRequest());
      }
    }

    submission.collectionDate = value;
    this.submissions.set(id, submission);
    return Promise.resolve();
  }

  listCarriers({ id }: SubmissionRef): Promise<Carriers> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.carriers);
  }

  createCarriers(
    { id }: SubmissionRef,
    value: Omit<Carriers, 'transport' | 'values'>
  ): Promise<Carriers> {
    if (value.status !== 'Started') {
      return Promise.reject(
        Boom.badRequest(
          `"Status cannot be ${value.status} on carrier detail creation"`
        )
      );
    }

    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    const transport: Carriers['transport'] =
      submission.wasteDescription.status !== 'NotStarted' &&
      submission.wasteDescription.wasteCode?.type === 'NotApplicable'
        ? false
        : true;

    const carrier = { id: uuidv4() };
    if (submission.carriers.status === 'NotStarted') {
      submission.carriers = {
        status: value.status,
        transport: transport,
        values: [carrier],
      };

      this.submissions.set(id, submission);
      return Promise.resolve(submission.carriers);
    }

    if (submission.carriers.values.length === 5) {
      return Promise.reject(Boom.badRequest('Cannot add more than 5 carriers'));
    }

    const carriers: dto.Carrier[] = [];
    for (const c of submission.carriers.values) {
      carriers.push(c);
    }
    carriers.push(carrier);
    submission.carriers = {
      status: value.status,
      transport: transport,
      values: carriers,
    };

    this.submissions.set(id, submission);
    return Promise.resolve({
      status: value.status,
      transport: transport,
      values: [carrier],
    });
  }

  getCarriers({ id }: SubmissionRef, carrierId: string): Promise<Carriers> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (submission.carriers.status === 'NotStarted') {
      return Promise.reject(Boom.notFound());
    }

    const carrier = submission.carriers.values.find((c) => {
      return c.id === carrierId;
    });

    if (carrier === undefined) {
      return Promise.reject(Boom.notFound());
    }

    const value: dto.Carriers = {
      status: submission.carriers.status,
      transport: submission.carriers.transport,
      values: [carrier],
    };

    return Promise.resolve(value);
  }

  setCarriers(
    { id }: SubmissionRef,
    carrierId: string,
    value: Carriers
  ): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (submission.carriers.status === 'NotStarted') {
      return Promise.reject(Boom.notFound());
    }

    if (value.status === 'NotStarted') {
      submission.carriers = value;
      this.submissions.set(id, submission);
      return Promise.resolve();
    }

    const carrier = value.values.find((c) => {
      return c.id === carrierId;
    });
    if (carrier === undefined) {
      return Promise.reject(Boom.badRequest());
    }

    const index = submission.carriers.values.findIndex((c) => {
      return c.id === carrierId;
    });
    if (index === -1) {
      return Promise.reject(Boom.notFound());
    }

    submission.carriers.status = value.status;
    submission.carriers.values[index] = carrier as dto.Carrier;

    this.submissions.set(id, submission);
    return Promise.resolve();
  }

  deleteCarriers({ id }: SubmissionRef, carrierId: string): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (submission.carriers.status === 'NotStarted') {
      return Promise.reject(Boom.notFound());
    }

    const index = submission.carriers.values.findIndex((c) => {
      return c.id === carrierId;
    });

    if (index === -1) {
      return Promise.reject(Boom.notFound());
    }

    submission.carriers.values.splice(index, 1);
    if (submission.carriers.values.length === 0) {
      const transport: Carriers['transport'] =
        submission.wasteDescription.status !== 'NotStarted' &&
        submission.wasteDescription.wasteCode?.type === 'NotApplicable'
          ? false
          : true;

      submission.carriers = {
        status: 'NotStarted',
        transport: transport,
      };
    }

    this.submissions.set(id, submission);
    return Promise.resolve();
  }

  getCollectionDetail({ id }: SubmissionRef): Promise<CollectionDetail> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.collectionDetail);
  }

  setCollectionDetail(
    { id }: SubmissionRef,
    value: CollectionDetail
  ): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    submission.collectionDetail = value;
    this.submissions.set(id, submission);
    return Promise.resolve();
  }

  getExitLocation({ id }: SubmissionRef): Promise<ExitLocation> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.ukExitLocation);
  }

  setExitLocation({ id }: SubmissionRef, value: ExitLocation): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    submission.ukExitLocation = value;
    this.submissions.set(id, submission);
    return Promise.resolve();
  }

  getTransitCountries({ id }: SubmissionRef): Promise<TransitCountries> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.transitCountries);
  }

  setTransitCountries(
    { id }: SubmissionRef,
    value: TransitCountries
  ): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    submission.transitCountries = value;
    this.submissions.set(id, submission);
    return Promise.resolve();
  }

  listRecoveryFacilityDetail({
    id,
  }: SubmissionRef): Promise<RecoveryFacilityDetail> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.recoveryFacilityDetail);
  }

  createRecoveryFacilityDetail(
    { id }: SubmissionRef,
    value: Omit<RecoveryFacilityDetail, 'values'>
  ): Promise<RecoveryFacilityDetail> {
    if (value.status !== 'Started') {
      return Promise.reject(
        Boom.badRequest(
          `"Status cannot be ${value.status} on recovery facility detail creation"`
        )
      );
    }
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    const newRecoveryFacilities = { id: uuidv4() };
    if (
      submission.recoveryFacilityDetail.status !== 'Started' &&
      submission.recoveryFacilityDetail.status !== 'Complete'
    ) {
      submission.recoveryFacilityDetail = {
        status: value.status,
        values: [newRecoveryFacilities],
      };

      this.submissions.set(id, submission);
      return Promise.resolve(submission.recoveryFacilityDetail);
    }

    if (submission.recoveryFacilityDetail.values.length === 3) {
      return Promise.reject(
        Boom.badRequest(
          'Cannot add more than 3 facilities(1 InterimSite and 2 RecoveryFacilities)'
        )
      );
    }

    const facilities: dto.RecoveryFacility[] = [];
    for (const rf of submission.recoveryFacilityDetail.values) {
      facilities.push(rf);
    }
    facilities.push(newRecoveryFacilities);
    submission.recoveryFacilityDetail = {
      status: value.status,
      values: facilities,
    };

    this.submissions.set(id, submission);

    return Promise.resolve({
      status: value.status,
      values: [newRecoveryFacilities],
    });
  }

  getRecoveryFacilityDetail(
    { id }: SubmissionRef,
    rfdId: string
  ): Promise<RecoveryFacilityDetail> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (
      submission.recoveryFacilityDetail.status !== 'Started' &&
      submission.recoveryFacilityDetail.status !== 'Complete'
    ) {
      return Promise.reject(Boom.notFound());
    }

    const recoveryFacility = submission.recoveryFacilityDetail.values.find(
      (rf) => {
        return rf.id === rfdId;
      }
    );

    if (recoveryFacility === undefined) {
      return Promise.reject(Boom.notFound());
    }

    const value: dto.RecoveryFacilityDetail = {
      status: submission.recoveryFacilityDetail.status,
      values: [recoveryFacility],
    };
    return Promise.resolve(value);
  }

  setRecoveryFacilityDetail(
    { id }: SubmissionRef,
    rfdId: string,
    value: RecoveryFacilityDetail
  ): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (
      submission.recoveryFacilityDetail.status !== 'Started' &&
      submission.recoveryFacilityDetail.status !== 'Complete'
    ) {
      return Promise.reject(Boom.notFound());
    }

    if (value.status !== 'Started' && value.status !== 'Complete') {
      submission.recoveryFacilityDetail = value;
      this.submissions.set(id, submission);
      return Promise.resolve();
    }
    const recoveryFacility = value.values.find((rf) => {
      return rf.id === rfdId;
    });

    if (recoveryFacility === undefined) {
      return Promise.reject(Boom.badRequest());
    }
    const index = submission.recoveryFacilityDetail.values.findIndex((rf) => {
      return rf.id === rfdId;
    });
    if (index === -1) {
      return Promise.reject(Boom.notFound());
    }

    submission.recoveryFacilityDetail.status = value.status;
    submission.recoveryFacilityDetail.values[index] =
      recoveryFacility as dto.RecoveryFacility;

    this.submissions.set(id, submission);
    return Promise.resolve();
  }

  deleteRecoveryFacilityDetail(
    { id }: SubmissionRef,
    rfdId: string
  ): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (
      submission.recoveryFacilityDetail.status !== 'Started' &&
      submission.recoveryFacilityDetail.status !== 'Complete'
    ) {
      return Promise.reject(Boom.notFound());
    }

    const index = submission.recoveryFacilityDetail.values.findIndex((rf) => {
      return rf.id === rfdId;
    });

    if (index === -1) {
      return Promise.reject(Boom.notFound());
    }

    submission.recoveryFacilityDetail.values.splice(index, 1);
    if (submission.recoveryFacilityDetail.values.length === 0) {
      submission.recoveryFacilityDetail = { status: 'NotStarted' };
    }

    this.submissions.set(id, submission);
    return Promise.resolve();
  }
}

export class AnnexViiServiceBackend implements SubmissionBackend {
  constructor(private client: DaprAnnexViiClient, private logger: Logger) {}

  async createSubmission(
    accountId: string,
    reference: CustomerReference
  ): Promise<Submission> {
    let response: CreateDraftResponse;
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

    return response.value;
  }

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

    return response.value;
  }

  async getCustomerReference({
    id,
    accountId,
  }: SubmissionRef): Promise<CustomerReference> {
    let response: GetDraftCustomerReferenceByIdResponse;
    try {
      response = await this.client.getDraftCustomerReferenceById({
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
    value: CustomerReference
  ): Promise<void> {
    let response: SetDraftCustomerReferenceByIdResponse;
    try {
      response = await this.client.setDraftCustomerReferenceById({
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

  async getWasteDescription({
    id,
    accountId,
  }: SubmissionRef): Promise<WasteDescription> {
    let response: GetDraftWasteDescriptionByIdResponse;
    try {
      response = await this.client.getDraftWasteDescriptionById({
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

  async setWasteDescription(
    { id, accountId }: SubmissionRef,
    value: WasteDescription
  ): Promise<void> {
    let response: SetDraftWasteDescriptionByIdResponse;
    try {
      response = await this.client.setDraftWasteDescriptionById({
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

  async getWasteQuantity({
    id,
    accountId,
  }: SubmissionRef): Promise<WasteQuantity> {
    let response: GetDraftWasteQuantityByIdResponse;
    try {
      response = await this.client.getDraftWasteQuantityById({ id, accountId });
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

  async setWasteQuantity(
    { id, accountId }: SubmissionRef,
    value: WasteQuantity
  ): Promise<void> {
    let response: SetDraftWasteQuantityByIdResponse;
    try {
      response = await this.client.setDraftWasteQuantityById({
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
    let response: GetDraftExporterDetailByIdResponse;
    try {
      response = await this.client.getDraftExporterDetailById({
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
    let response: SetDraftExporterDetailByIdResponse;
    try {
      response = await this.client.setDraftExporterDetailById({
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
    let response: GetDraftImporterDetailByIdResponse;
    try {
      response = await this.client.getDraftImporterDetailById({
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
    let response: SetDraftImporterDetailByIdResponse;
    try {
      response = await this.client.setDraftImporterDetailById({
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
  }: SubmissionRef): Promise<CollectionDate> {
    let response: GetDraftCollectionDateByIdResponse;
    try {
      response = await this.client.getDraftCollectionDateById({
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

  async setCollectionDate(
    { id, accountId }: SubmissionRef,
    value: CollectionDate
  ): Promise<void> {
    let response: SetDraftCollectionDateByIdResponse;
    try {
      response = await this.client.setDraftCollectionDatelById({
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
    let response: ListDraftCarriersResponse;
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
    value: Omit<Carriers, 'transport' | 'values'>
  ): Promise<Carriers> {
    let response: CreateDraftCarriersResponse;
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
    carrierId: string
  ): Promise<Carriers> {
    let response: GetDraftCarriersResponse;
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
    value: Carriers
  ): Promise<void> {
    if (value.status !== 'NotStarted') {
      for (const c of value.values) {
        c.id = carrierId;
      }
    }

    let response: SetDraftCarriersResponse;
    try {
      response = await this.client.setDraftCarriers({
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
    let response: DeleteDraftCarriersResponse;
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
    let response: GetDraftCollectionDetailResponse;
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
    value: CollectionDetail
  ): Promise<void> {
    let response: SetDraftCollectionDetailResponse;
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
    let response: GetDraftExitLocationByIdResponse;
    try {
      response = await this.client.getDraftExitLocationById({
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
    let response: SetDraftExitLocationByIdResponse;
    try {
      response = await this.client.setDraftExitLocationById({
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
    let response: GetDraftTransitCountriesResponse;
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
    value: TransitCountries
  ): Promise<void> {
    let response: SetDraftTransitCountriesResponse;
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
    let response: ListDraftRecoveryFacilityDetailsResponse;
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
    value: Omit<RecoveryFacilityDetail, 'values'>
  ): Promise<RecoveryFacilityDetail> {
    let response: CreateDraftRecoveryFacilityDetailsResponse;
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
    rfdId: string
  ): Promise<RecoveryFacilityDetail> {
    let response: GetDraftRecoveryFacilityDetailsResponse;
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
    value: RecoveryFacilityDetail
  ): Promise<void> {
    if (value.status === 'Started' || value.status === 'Complete') {
      for (const c of value.values) {
        c.id = rfdId;
      }
    }

    let response: SetDraftRecoveryFacilityDetailsResponse;
    try {
      response = await this.client.setDraftRecoveryFacilityDetails({
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
    let response: DeleteDraftRecoveryFacilityDetailsResponse;
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
}
