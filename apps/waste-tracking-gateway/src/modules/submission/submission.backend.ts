import Boom from '@hapi/boom';
import {
  CreateDraftResponse,
  DeleteDraftResponse,
  GetDraftByIdResponse,
  GetDraftsResponse,
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
  GetDraftSubmissionConfirmationByIdResponse,
  SetDraftSubmissionConfirmationByIdResponse,
  GetDraftSubmissionDeclarationByIdResponse,
  SetDraftSubmissionDeclarationByIdResponse,
} from '@wts/api/annex-vii';
import * as dto from '@wts/api/waste-tracking-gateway';
import { DaprAnnexViiClient } from '@wts/client/annex-vii';
import { differenceInBusinessDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';

export type Submission = dto.Submission;
export type SubmissionSummary = dto.SubmissionSummary;
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
export type SubmissionConfirmation = dto.SubmissionConfirmation;
export type SubmissionDeclaration = dto.SubmissionDeclaration;

function setSubmissionConfirmation(
  submission: Submission
): SubmissionConfirmation {
  const {
    id,
    reference,
    submissionConfirmation,
    submissionDeclaration,
    submissionState,
    ...filteredValues
  } = submission;

  if (
    Object.values(filteredValues).every((value) => value.status === 'Complete')
  ) {
    return { status: 'NotStarted' };
  } else {
    return { status: 'CannotStart' };
  }
}

function setSubmissionDeclaration(
  submission: Submission
): SubmissionDeclaration {
  if (submission.submissionConfirmation.status === 'Complete') {
    return { status: 'NotStarted' };
  } else {
    return { status: 'CannotStart' };
  }
}

function isCollectionDateValid(date: CollectionDate) {
  if (date.status !== 'NotStarted') {
    const {
      day: dayStr,
      month: monthStr,
      year: yearStr,
    } = date.value[
      date.value.type === 'ActualDate' ? 'actualDate' : 'estimateDate'
    ];
    const [day, month, year] = [
      parseInt(dayStr as string),
      parseInt(monthStr as string) - 1,
      parseInt(yearStr as string),
    ];

    if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
      return false;
    }

    if (differenceInBusinessDays(new Date(year, month, day), new Date()) < 3) {
      return false;
    }
  }
  return true;
}

export type SubmissionRef = {
  id: string;
  accountId: string;
};

export type ActionRef = {
  action: 'CANCEL' | 'DELETE';
};

export interface SubmissionBackend {
  createSubmission(
    accountId: string,
    reference: CustomerReference
  ): Promise<Submission>;
  getSubmission(ref: SubmissionRef): Promise<Submission>;
  deleteSubmission(ref: SubmissionRef, action: ActionRef): Promise<void>;
  getSubmissions(accountId: string): Promise<ReadonlyArray<SubmissionSummary>>;
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
  getSubmissionConfirmation(
    ref: SubmissionRef
  ): Promise<SubmissionConfirmation>;
  setSubmissionConfirmation(
    ref: SubmissionRef,
    value: SubmissionConfirmation
  ): Promise<void>;
  getSubmissionDeclaration(ref: SubmissionRef): Promise<SubmissionDeclaration>;
  setSubmissionDeclaration(
    ref: SubmissionRef,
    value: Omit<SubmissionDeclaration, 'values'>
  ): Promise<void>;
}

function isWasteCodeChangingBulkToSmall(
  currentWasteDescription: WasteDescription,
  newWasteDescription: WasteDescription
): boolean {
  return (
    currentWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type !== 'NotApplicable' &&
    newWasteDescription.status !== 'NotStarted' &&
    newWasteDescription.wasteCode?.type === 'NotApplicable'
  );
}

function isWasteCodeChangingSmallToBulk(
  currentWasteDescription: WasteDescription,
  newWasteDescription: WasteDescription
): boolean {
  return (
    currentWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type === 'NotApplicable' &&
    newWasteDescription.status !== 'NotStarted' &&
    newWasteDescription.wasteCode?.type !== 'NotApplicable'
  );
}

function isWasteCodeChangingBulkToBulkDifferentType(
  currentWasteDescription: WasteDescription,
  newWasteDescription: WasteDescription
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

function isWasteCodeChangingBulkToBulkSameType(
  currentWasteDescription: WasteDescription,
  newWasteDescription: WasteDescription
): boolean {
  return (
    currentWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type !== 'NotApplicable' &&
    newWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type ===
      newWasteDescription.wasteCode?.type &&
    currentWasteDescription.wasteCode?.value !==
      newWasteDescription.wasteCode?.value
  );
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
    if (reference && reference.length > 20) {
      return Promise.reject(
        Boom.badRequest('Supplied reference cannot exceed 20 characters')
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
      submissionConfirmation: { status: 'CannotStart' },
      submissionDeclaration: { status: 'CannotStart' },
      submissionState: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    };

    this.submissions.set(id, value);
    return Promise.resolve(value);
  }

  getSubmission({ id }: SubmissionRef): Promise<Submission> {
    const value = this.submissions.get(id);
    if (
      value === undefined ||
      value.submissionState.status === 'Cancelled' ||
      value.submissionState.status === 'Deleted'
    ) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(value);
  }

  deleteSubmission(
    { id }: SubmissionRef,
    { action }: ActionRef
  ): Promise<void> {
    const value = this.submissions.get(id);
    if (value === undefined) {
      return Promise.reject(Boom.notFound());
    }

    const timestamp = new Date();
    value.submissionState =
      action === 'CANCEL'
        ? { status: 'Cancelled', timestamp: timestamp }
        : { status: 'Deleted', timestamp: timestamp };

    this.submissions.set(id, value);
    return Promise.resolve();
  }

  getSubmissions(_: string): Promise<ReadonlyArray<SubmissionSummary>> {
    const values: Submission[] = [...this.submissions.values()];
    const value: ReadonlyArray<SubmissionSummary> = values
      .map((s) => {
        return {
          id: s.id,
          reference: s.reference,
          wasteDescription: s.wasteDescription,
          wasteQuantity: { status: s.wasteQuantity.status },
          exporterDetail: { status: s.exporterDetail.status },
          importerDetail: { status: s.exporterDetail.status },
          collectionDate: s.collectionDate,
          carriers: { status: s.carriers.status },
          collectionDetail: { status: s.collectionDetail.status },
          ukExitLocation: { status: s.ukExitLocation.status },
          transitCountries: { status: s.transitCountries.status },
          recoveryFacilityDetail: { status: s.recoveryFacilityDetail.status },
          submissionConfirmation: { status: s.submissionConfirmation.status },
          submissionDeclaration: s.submissionDeclaration,
          submissionState: s.submissionState,
        };
      })
      .filter((i) => !i.submissionState.status.includes('Cancelled'))
      .filter((i) => !i.submissionState.status.includes('Deleted'));

    if (!Array.isArray(value) || value.length == 0) {
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

    if (value && value.length > 20) {
      return Promise.reject(
        Boom.badRequest('Supplied reference cannot exceed 20 characters')
      );
    }

    submission.reference = value;

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

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

    let recoveryFacilityDetail: Submission['recoveryFacilityDetail'] =
      submission.recoveryFacilityDetail.status === 'CannotStart' &&
      value.status !== 'NotStarted' &&
      value.wasteCode !== undefined
        ? { status: 'NotStarted' }
        : submission.recoveryFacilityDetail;

    let carriers: Submission['carriers'] = submission.carriers;

    if (
      submission.wasteDescription.status === 'NotStarted' &&
      value.status !== 'NotStarted' &&
      value.wasteCode?.type === 'NotApplicable'
    ) {
      carriers.transport = false;
    }

    if (isWasteCodeChangingBulkToSmall(submission.wasteDescription, value)) {
      if (value.status === 'Started') {
        value.ewcCodes = undefined;
        value.nationalCode = undefined;
        value.description = undefined;
      }

      wasteQuantity = { status: 'NotStarted' };

      carriers = { status: 'NotStarted', transport: false };

      recoveryFacilityDetail = { status: 'NotStarted' };
    }

    if (isWasteCodeChangingSmallToBulk(submission.wasteDescription, value)) {
      if (value.status === 'Started') {
        value.ewcCodes = undefined;
        value.nationalCode = undefined;
        value.description = undefined;
      }

      wasteQuantity = { status: 'NotStarted' };

      carriers = { status: 'NotStarted', transport: true };

      recoveryFacilityDetail = { status: 'NotStarted' };
    }

    if (
      isWasteCodeChangingBulkToBulkDifferentType(
        submission.wasteDescription,
        value
      )
    ) {
      if (value.status === 'Started') {
        value.ewcCodes = undefined;
        value.nationalCode = undefined;
        value.description = undefined;
      }

      wasteQuantity = { status: 'NotStarted' };

      carriers = { status: 'NotStarted', transport: true };

      recoveryFacilityDetail = { status: 'NotStarted' };
    }

    if (
      isWasteCodeChangingBulkToBulkSameType(submission.wasteDescription, value)
    ) {
      if (value.status === 'Started') {
        value.ewcCodes = undefined;
        value.nationalCode = undefined;
        value.description = undefined;
      }

      if (
        submission.wasteQuantity.status !== 'CannotStart' &&
        submission.wasteQuantity.status !== 'NotStarted'
      ) {
        wasteQuantity = {
          status: 'Started',
          value: submission.wasteQuantity.value,
        };
      }

      if (submission.carriers.status !== 'NotStarted') {
        carriers = {
          status: 'Started',
          transport: true,
          values: submission.carriers.values,
        };
      }

      if (
        submission.recoveryFacilityDetail.status === 'Started' ||
        submission.recoveryFacilityDetail.status === 'Complete'
      ) {
        recoveryFacilityDetail = {
          status: 'Started',
          values: submission.recoveryFacilityDetail.values,
        };
      }
    }

    submission.wasteDescription = value;
    submission.wasteQuantity = wasteQuantity;
    submission.carriers = carriers;
    submission.recoveryFacilityDetail = recoveryFacilityDetail;

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

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

    let wasteQuantity = value;
    if (
      value.status !== 'CannotStart' &&
      value.status !== 'NotStarted' &&
      value.value &&
      value.value.type &&
      value.value.type !== 'NotApplicable' &&
      submission.wasteQuantity.status !== 'CannotStart' &&
      submission.wasteQuantity.status !== 'NotStarted' &&
      submission.wasteQuantity.value &&
      submission.wasteQuantity.value.type &&
      submission.wasteQuantity.value.type !== 'NotApplicable'
    ) {
      if (
        value.value.type === 'ActualData' &&
        submission.wasteQuantity.value.estimateData
      ) {
        wasteQuantity = {
          status: value.status,
          value: {
            type: value.value.type,
            actualData: value.value.actualData ?? {},
            estimateData: submission.wasteQuantity.value.estimateData,
          },
        };
      }

      if (
        value.value.type === 'EstimateData' &&
        submission.wasteQuantity.value.actualData
      ) {
        wasteQuantity = {
          status: value.status,
          value: {
            type: value.value.type,
            actualData: submission.wasteQuantity.value.actualData,
            estimateData: value.value.estimateData ?? {},
          },
        };
      }
    }

    submission.wasteQuantity = wasteQuantity;

    if (submission.submissionConfirmation.status !== 'Complete') {
      submission.submissionConfirmation = setSubmissionConfirmation(submission);
    }

    if (submission.submissionDeclaration.status !== 'Complete') {
      submission.submissionDeclaration = setSubmissionDeclaration(submission);
    }

    submission.submissionState =
      submission.collectionDate.status === 'Complete' &&
      submission.collectionDate.value.type === 'ActualDate' &&
      submission.submissionState.status === 'SubmittedWithEstimates' &&
      value.status === 'Complete' &&
      value.value.type === 'ActualData'
        ? { status: 'UpdatedWithActuals', timestamp: new Date() }
        : submission.submissionState;

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

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

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

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

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

    let collectionDate = value;
    if (
      value.status !== 'NotStarted' &&
      submission.collectionDate.status !== 'NotStarted'
    ) {
      if (value.value.type === 'ActualDate') {
        collectionDate = {
          status: value.status,
          value: {
            type: value.value.type,
            actualDate: value.value.actualDate,
            estimateDate: submission.collectionDate.value.estimateDate,
          },
        };
      } else {
        collectionDate = {
          status: value.status,
          value: {
            type: value.value.type,
            actualDate: submission.collectionDate.value.actualDate,
            estimateDate: value.value.estimateDate,
          },
        };
      }
    }

    submission.collectionDate = collectionDate;

    if (submission.submissionConfirmation.status !== 'Complete') {
      submission.submissionConfirmation = setSubmissionConfirmation(submission);
    }

    if (submission.submissionDeclaration.status !== 'Complete') {
      submission.submissionDeclaration = setSubmissionDeclaration(submission);
    }

    submission.submissionState =
      submission.wasteQuantity.status === 'Complete' &&
      submission.wasteQuantity.value.type === 'ActualData' &&
      submission.submissionState.status === 'SubmittedWithEstimates' &&
      value.status === 'Complete' &&
      value.value.type === 'ActualDate'
        ? { status: 'UpdatedWithActuals', timestamp: new Date() }
        : submission.submissionState;

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

      submission.submissionConfirmation = setSubmissionConfirmation(submission);
      submission.submissionDeclaration = setSubmissionDeclaration(submission);

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

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

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

      submission.submissionConfirmation = setSubmissionConfirmation(submission);
      submission.submissionDeclaration = setSubmissionDeclaration(submission);

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

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

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

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

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

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

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

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

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

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

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

      submission.submissionConfirmation = setSubmissionConfirmation(submission);
      submission.submissionDeclaration = setSubmissionDeclaration(submission);

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

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

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

      submission.submissionConfirmation = setSubmissionConfirmation(submission);
      submission.submissionDeclaration = setSubmissionDeclaration(submission);

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

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

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

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

    this.submissions.set(id, submission);
    return Promise.resolve();
  }

  getSubmissionConfirmation({
    id,
  }: SubmissionRef): Promise<SubmissionConfirmation> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.submissionConfirmation);
  }

  setSubmissionConfirmation(
    { id }: SubmissionRef,
    value: SubmissionConfirmation
  ): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (submission.submissionConfirmation.status === 'CannotStart') {
      return Promise.reject(Boom.badRequest());
    }

    if (!isCollectionDateValid(submission.collectionDate)) {
      submission.collectionDate = { status: 'NotStarted' };
      submission.submissionConfirmation = setSubmissionConfirmation(submission);

      this.submissions.set(id, submission);
      return Promise.reject(Boom.badRequest('Invalid collection date'));
    }

    submission.submissionConfirmation = value;
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

    this.submissions.set(id, submission);
    return Promise.resolve();
  }

  getSubmissionDeclaration({
    id,
  }: SubmissionRef): Promise<SubmissionDeclaration> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.submissionDeclaration);
  }

  setSubmissionDeclaration(
    { id }: SubmissionRef,
    value: Omit<SubmissionDeclaration, 'values'>
  ): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (submission.submissionDeclaration.status === 'CannotStart') {
      return Promise.reject(Boom.badRequest());
    }

    if (!isCollectionDateValid(submission.collectionDate)) {
      submission.collectionDate = { status: 'NotStarted' };

      submission.submissionConfirmation = setSubmissionConfirmation(submission);
      submission.submissionDeclaration = setSubmissionDeclaration(submission);

      this.submissions.set(id, submission);
      return Promise.reject(Boom.badRequest('Invalid collection date'));
    }

    if (
      value.status === 'Complete' &&
      submission.submissionDeclaration.status === 'NotStarted'
    ) {
      const timeStamp = new Date();
      const transactionId =
        timeStamp.getFullYear().toString().substring(2) +
        (timeStamp.getMonth() + 1).toString().padStart(2, '0') +
        '_' +
        id.substring(0, 8).toUpperCase();
      submission.submissionDeclaration = {
        status: value.status,
        values: {
          declarationTimestamp: timeStamp,
          transactionId: transactionId,
        },
      };

      const timestamp = new Date();
      submission.submissionState =
        submission.collectionDate.status === 'Complete' &&
        submission.wasteQuantity.status === 'Complete' &&
        submission.collectionDate.value.type === 'ActualDate' &&
        submission.wasteQuantity.value.type === 'ActualData'
          ? { status: 'SubmittedWithActuals', timestamp: timestamp }
          : { status: 'SubmittedWithEstimates', timestamp: timestamp };

      this.submissions.set(id, submission);
    }

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

  async deleteSubmission(
    { id, accountId }: SubmissionRef,
    { action }: ActionRef
  ): Promise<void> {
    let response: DeleteDraftResponse;
    try {
      response = await this.client.deleteDraft({
        id,
        accountId,
        action,
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
    accountId: string
  ): Promise<ReadonlyArray<SubmissionSummary>> {
    let response: GetDraftsResponse;
    try {
      response = await this.client.getDrafts({ accountId });
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

  async getSubmissionConfirmation({
    id,
    accountId,
  }: SubmissionRef): Promise<SubmissionConfirmation> {
    let response: GetDraftSubmissionConfirmationByIdResponse;
    try {
      response = await this.client.getDraftSubmissionConfirmationById({
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
    value: SubmissionConfirmation
  ): Promise<void> {
    let response: SetDraftSubmissionConfirmationByIdResponse;
    try {
      response = await this.client.setDraftSubmissionConfirmationById({
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
    let response: GetDraftSubmissionDeclarationByIdResponse;
    try {
      response = await this.client.getDraftSubmissionDeclarationById({
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
    value: Omit<SubmissionDeclaration, 'values'>
  ): Promise<void> {
    let response: SetDraftSubmissionDeclarationByIdResponse;
    try {
      response = await this.client.setDraftSubmissionDeclarationById({
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
}
