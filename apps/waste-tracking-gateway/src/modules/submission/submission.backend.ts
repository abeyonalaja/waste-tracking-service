import Boom from '@hapi/boom';
import {
  CancelDraftByIdResponse,
  CreateDraftCarriersResponse,
  CreateDraftRecoveryFacilityDetailsResponse,
  CreateDraftResponse,
  DeleteDraftCarriersResponse,
  DeleteDraftRecoveryFacilityDetailsResponse,
  DeleteDraftResponse,
  DraftSubmission,
  DraftWasteDescription,
  GetDraftCarriersResponse,
  GetDraftCollectionDateByIdResponse,
  GetDraftCollectionDetailResponse,
  GetDraftCustomerReferenceByIdResponse,
  GetDraftExitLocationByIdResponse,
  GetDraftExporterDetailByIdResponse,
  GetDraftImporterDetailByIdResponse,
  GetDraftRecoveryFacilityDetailsResponse,
  GetDraftSubmissionConfirmationByIdResponse,
  GetDraftSubmissionDeclarationByIdResponse,
  GetDraftTransitCountriesResponse,
  GetDraftWasteDescriptionByIdResponse,
  GetDraftWasteQuantityByIdResponse,
  GetDraftsResponse,
  GetNumberOfSubmissionsResponse,
  ListDraftCarriersResponse,
  ListDraftRecoveryFacilityDetailsResponse,
  SetDraftCarriersResponse,
  SetDraftCollectionDateByIdResponse,
  SetDraftCollectionDetailResponse,
  SetDraftCustomerReferenceByIdResponse,
  SetDraftExitLocationByIdResponse,
  SetDraftExporterDetailByIdResponse,
  SetDraftImporterDetailByIdResponse,
  SetDraftRecoveryFacilityDetailsResponse,
  SetDraftSubmissionConfirmationByIdResponse,
  SetDraftSubmissionDeclarationByIdResponse,
  SetDraftTransitCountriesResponse,
  SetDraftWasteDescriptionByIdResponse,
  SetDraftWasteQuantityByIdResponse,
  Template,
} from '@wts/api/annex-vii';
import * as dto from '@wts/api/waste-tracking-gateway';

import { v4 as uuidv4 } from 'uuid';
import {
  AnnexViiServiceSubmissionBaseBackend,
  InMemorySubmissionBaseBackend,
  SubmissionBaseBackend,
  SubmissionBasePlusId,
} from '../submissionBase/submissionBase.backend';
import { TemplateRef } from '../template';

export type Submission = dto.Submission;
export type SubmissionSummary = dto.SubmissionSummary;
export type SubmissionSummaryPage = dto.SubmissionSummaryPage;
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
export type SubmissionState = dto.SubmissionState;
export type SubmissionCancellationType = dto.SubmissionCancellationType;
export type NumberOfSubmissions = dto.NumberOfSubmissions;

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
  }
  return true;
}

function setWasteQuantityUnit(
  wasteQuantity: WasteQuantity,
  submission: dto.Submission
) {
  if (
    submission.wasteDescription.status !== 'NotStarted' &&
    wasteQuantity.status !== 'CannotStart' &&
    wasteQuantity.status !== 'NotStarted'
  ) {
    if (submission.wasteDescription.wasteCode?.type === 'NotApplicable') {
      if (wasteQuantity.value?.type === 'ActualData') {
        if (wasteQuantity.value?.actualData?.quantityType === 'Volume') {
          wasteQuantity.value.actualData.unit = 'Litre';
        } else if (wasteQuantity.value?.actualData?.quantityType === 'Weight') {
          wasteQuantity.value.actualData.unit = 'Kilogram';
        }
      } else if (wasteQuantity.value?.type === 'EstimateData') {
        if (wasteQuantity.value?.estimateData?.quantityType === 'Volume') {
          wasteQuantity.value.estimateData.unit = 'Litre';
        } else if (
          wasteQuantity.value?.estimateData?.quantityType === 'Weight'
        ) {
          wasteQuantity.value.estimateData.unit = 'Kilogram';
        }
      }
    } else {
      if (wasteQuantity.value?.type === 'ActualData') {
        if (wasteQuantity.value?.actualData?.quantityType === 'Volume') {
          wasteQuantity.value.actualData.unit = 'Cubic Metre';
        } else if (wasteQuantity.value?.actualData?.quantityType === 'Weight') {
          wasteQuantity.value.actualData.unit = 'Tonne';
        }
      } else if (wasteQuantity.value?.type === 'EstimateData') {
        if (wasteQuantity.value?.estimateData?.quantityType === 'Volume') {
          wasteQuantity.value.estimateData.unit = 'Cubic Metre';
        } else if (
          wasteQuantity.value?.estimateData?.quantityType === 'Weight'
        ) {
          wasteQuantity.value.estimateData.unit = 'Tonne';
        }
      }
    }
  }
}

export type SubmissionRef = {
  id: string;
  accountId: string;
};

export type OrderRef = {
  order: 'ASC' | 'DESC';
};

export interface SubmissionBackend extends SubmissionBaseBackend {
  createSubmission(
    accountId: string,
    reference: CustomerReference
  ): Promise<Submission>;
  createSubmissionFromTemplate(
    id: string,
    accountId: string,
    reference: CustomerReference
  ): Promise<DraftSubmission>;
  deleteSubmission(ref: SubmissionRef): Promise<void>;
  cancelSubmission(
    ref: SubmissionRef,
    cancellationType: dto.SubmissionCancellationType
  ): Promise<void>;
  getSubmissions(
    accountId: string,
    order: OrderRef,
    pageLimit?: number,
    state?: SubmissionState['status'][],
    token?: string
  ): Promise<SubmissionSummaryPage>;
  getCustomerReference(ref: SubmissionRef): Promise<CustomerReference>;
  setCustomerReference(
    ref: SubmissionRef,
    value: CustomerReference
  ): Promise<void>;
  getWasteQuantity(ref: SubmissionRef): Promise<WasteQuantity>;
  setWasteQuantity(ref: SubmissionRef, value: WasteQuantity): Promise<void>;
  getCollectionDate(ref: SubmissionRef): Promise<CollectionDate>;
  setCollectionDate(ref: SubmissionRef, value: CollectionDate): Promise<void>;
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
  getNumberOfSubmissions(accountId: string): Promise<NumberOfSubmissions>;
}

/**
 * This is a mock backend and should not be used in production.
 */
export class InMemorySubmissionBackend
  extends InMemorySubmissionBaseBackend
  implements SubmissionBackend
{
  constructor(
    protected submissions: Map<string, Submission>,
    protected templates: Map<string, Template>
  ) {
    super(submissions, templates);
  }

  createSubmission(
    accountId: string,
    reference: CustomerReference
  ): Promise<Submission> {
    if (reference.length > 20) {
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

    this.submissions.set(JSON.stringify({ id, accountId }), value);
    return Promise.resolve(value);
  }

  async createSubmissionFromTemplate(
    id: string,
    accountId: string,
    reference: CustomerReference
  ): Promise<DraftSubmission> {
    if (reference.length > 20) {
      return Promise.reject(
        Boom.badRequest('Supplied reference cannot exceed 20 characters')
      );
    }

    const template = await this.getTemplate({ id, accountId } as TemplateRef);
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    id = uuidv4();

    const value: DraftSubmission = {
      id,
      reference,
      wasteDescription: template.wasteDescription,
      wasteQuantity:
        template.wasteDescription.status === 'NotStarted'
          ? { status: 'CannotStart' }
          : { status: 'NotStarted' },
      exporterDetail: template.exporterDetail,
      importerDetail: template.importerDetail,
      collectionDate: { status: 'NotStarted' },
      carriers: this.copyCarriersNoTransport(
        template.carriers,
        this.isSmallWaste(template.wasteDescription)
      ),
      collectionDetail: template.collectionDetail,
      ukExitLocation: template.ukExitLocation,
      transitCountries: template.transitCountries,
      recoveryFacilityDetail: this.copyRecoveryFacilities(
        template.recoveryFacilityDetail
      ),
      submissionConfirmation: { status: 'CannotStart' },
      submissionDeclaration: { status: 'CannotStart' },
      submissionState: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    };

    this.submissions.set(
      JSON.stringify({ id, accountId }),
      value as Submission
    );
    return Promise.resolve(value);
  }

  deleteSubmission({ id, accountId }: SubmissionRef): Promise<void> {
    const value = this.submissions.get(JSON.stringify({ id, accountId }));
    if (value === undefined) {
      return Promise.reject(Boom.notFound());
    }

    value.submissionState = { status: 'Deleted', timestamp: new Date() };

    this.submissions.set(JSON.stringify({ id, accountId }), value);
    return Promise.resolve();
  }

  cancelSubmission(
    { id, accountId }: SubmissionRef,
    cancellationType: dto.SubmissionCancellationType
  ): Promise<void> {
    const value = this.submissions.get(JSON.stringify({ id, accountId }));
    if (value === undefined) {
      return Promise.reject(Boom.notFound());
    }

    value.submissionState = {
      status: 'Cancelled',
      timestamp: new Date(),
      cancellationType: cancellationType,
    };

    this.submissions.set(JSON.stringify({ id, accountId }), value);
    return Promise.resolve();
  }

  getSubmissions(
    accountId: string,
    { order }: OrderRef,
    pageLimit = 15,
    state?: SubmissionState['status'][],
    token?: string
  ): Promise<SubmissionSummaryPage> {
    const rawKeys: string[] = [...this.submissions.keys()].filter(
      (i) => (JSON.parse(i) as SubmissionRef).accountId === accountId
    );
    const rawValues: Submission[] = [];
    rawKeys.forEach((ref) =>
      rawValues.push(this.submissions.get(ref) as Submission)
    );
    let values: ReadonlyArray<SubmissionSummary> = rawValues
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
      .sort((x, y) => {
        return x.submissionState.timestamp > y.submissionState.timestamp
          ? 1
          : -1;
      });

    if (order === 'DESC') {
      values = rawValues
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
        .sort((x, y) => {
          return x.submissionState.timestamp > y.submissionState.timestamp
            ? 1
            : -1;
        })
        .reverse();
    }

    if (state) {
      values = values.filter((i) =>
        state.some((val) => i.submissionState.status.includes(val))
      );
    }

    if (!Array.isArray(values) || values.length === 0) {
      return Promise.reject(Boom.notFound());
    }

    let hasMoreResults = true;
    let totalSubmissions = 0;
    let totalPages = 0;
    let currentPage = 0;
    let pageNumber = 0;
    let contToken = '';
    const metadataArray: dto.SubmissionPageMetadata[] = [];
    let pageValues: ReadonlyArray<SubmissionSummary> = [];

    while (hasMoreResults) {
      totalPages += 1;
      pageNumber += 1;

      const paginatedValues = this.paginateArray(values, pageLimit, pageNumber);

      if ((!token && pageNumber === 1) || token === contToken) {
        pageValues = paginatedValues;
        currentPage = pageNumber;
      }

      const nextPaginatedValues = this.paginateArray(
        values,
        pageLimit,
        pageNumber + 1
      );

      hasMoreResults = nextPaginatedValues.length === 0 ? false : true;
      totalSubmissions += paginatedValues.length;
      contToken = nextPaginatedValues.length === 0 ? '' : pageNumber.toString();

      const pageMetadata: dto.SubmissionPageMetadata = {
        pageNumber: pageNumber,
        token: nextPaginatedValues.length === 0 ? '' : pageNumber.toString(),
      };
      metadataArray.push(pageMetadata);

      if (!hasMoreResults && token === '') {
        break;
      }
    }

    return Promise.resolve({
      totalSubmissions: totalSubmissions,
      totalPages: totalPages,
      currentPage: currentPage,
      pages: metadataArray,
      values: pageValues,
    });
  }

  getCustomerReference({
    id,
    accountId,
  }: SubmissionRef): Promise<CustomerReference> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.reference);
  }

  setCustomerReference(
    { id, accountId }: SubmissionRef,
    reference: CustomerReference
  ): Promise<void> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (reference.length > 20) {
      return Promise.reject(
        Boom.badRequest('Supplied reference cannot exceed 20 characters')
      );
    }

    submission.reference = reference;

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

    this.submissions.set(JSON.stringify({ id, accountId }), submission);
    return Promise.resolve();
  }

  getWasteDescription({
    id,
    accountId,
  }: SubmissionRef): Promise<WasteDescription> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.wasteDescription);
  }

  setWasteDescription(
    { id, accountId }: SubmissionRef,
    value: DraftWasteDescription
  ): Promise<void> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    let wasteQuantity: dto.Submission['wasteQuantity'] =
      submission.wasteQuantity;

    if (
      wasteQuantity.status === 'CannotStart' &&
      (value.status === 'Started' || value.status === 'Complete')
    ) {
      wasteQuantity = { status: 'NotStarted' };
    }

    if (
      this.isWasteCodeChangingBulkToSmall(submission.wasteDescription, value)
    ) {
      wasteQuantity = { status: 'NotStarted' };
    }

    if (
      this.isWasteCodeChangingSmallToBulk(submission.wasteDescription, value)
    ) {
      wasteQuantity = { status: 'NotStarted' };
    }

    if (
      this.isWasteCodeChangingBulkToBulkDifferentType(
        submission.wasteDescription,
        value
      )
    ) {
      wasteQuantity = { status: 'NotStarted' };
    }

    if (
      this.isWasteCodeChangingBulkToBulkSameType(
        submission.wasteDescription,
        value
      )
    ) {
      if (
        submission.wasteQuantity.status !== 'CannotStart' &&
        submission.wasteQuantity.status !== 'NotStarted'
      ) {
        wasteQuantity = {
          status: 'Started',
          value: submission.wasteQuantity.value,
        };
      }
    }

    const submissionBase = this.setBaseWasteDescription(
      submission as dto.SubmissionBase,
      value
    );
    submission.wasteDescription = submissionBase.wasteDescription;
    submission.carriers = submissionBase.carriers;
    submission.recoveryFacilityDetail = submissionBase.recoveryFacilityDetail;

    submission.wasteQuantity = wasteQuantity;
    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

    this.submissions.set(JSON.stringify({ id, accountId }), submission);

    return Promise.resolve();
  }

  getWasteQuantity({ id, accountId }: SubmissionRef): Promise<WasteQuantity> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.wasteQuantity);
  }

  setWasteQuantity(
    { id, accountId }: SubmissionRef,
    value: WasteQuantity
  ): Promise<void> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }
    setWasteQuantityUnit(value, submission);

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

    submission.wasteQuantity = wasteQuantity as WasteQuantity;

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

    this.submissions.set(JSON.stringify({ id, accountId }), submission);
    return Promise.resolve();
  }

  getExporterDetail({ id, accountId }: SubmissionRef): Promise<ExporterDetail> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.exporterDetail);
  }

  setExporterDetail(
    { id, accountId }: SubmissionRef,
    value: ExporterDetail
  ): Promise<void> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    submission.exporterDetail = this.setBaseExporterDetail(
      submission as dto.SubmissionBase,
      value
    ).exporterDetail;

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

    this.submissions.set(JSON.stringify({ id, accountId }), submission);

    return Promise.resolve();
  }

  getImporterDetail({ id, accountId }: SubmissionRef): Promise<ImporterDetail> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.importerDetail);
  }

  setImporterDetail(
    { id, accountId }: SubmissionRef,
    value: ImporterDetail
  ): Promise<void> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    submission.importerDetail = this.setBaseImporterDetail(
      submission as dto.SubmissionBase,
      value
    ).importerDetail;

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

    this.submissions.set(JSON.stringify({ id, accountId }), submission);

    return Promise.resolve();
  }

  getCollectionDate({ id, accountId }: SubmissionRef): Promise<CollectionDate> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.collectionDate);
  }

  setCollectionDate(
    { id, accountId }: SubmissionRef,
    value: CollectionDate
  ): Promise<void> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
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

    this.submissions.set(JSON.stringify({ id, accountId }), submission);
    return Promise.resolve();
  }

  listCarriers({ id, accountId }: SubmissionRef): Promise<Carriers> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.carriers);
  }

  createCarriers(
    { id, accountId }: SubmissionRef,
    value: Omit<Carriers, 'transport' | 'values'>
  ): Promise<Carriers> {
    if (value.status !== 'Started') {
      return Promise.reject(
        Boom.badRequest(
          `"Status cannot be ${value.status} on carrier detail creation"`
        )
      );
    }

    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (submission.carriers.status !== 'NotStarted') {
      if (submission.carriers.values.length === 5) {
        return Promise.reject(
          Boom.badRequest('Cannot add more than 5 carriers')
        );
      }
    }

    const submissionBasePlusId: SubmissionBasePlusId = this.createBaseCarriers(
      submission as dto.SubmissionBase,
      value
    );

    submission.carriers = submissionBasePlusId.submissionBase.carriers;

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

    this.submissions.set(JSON.stringify({ id, accountId }), submission);

    return Promise.resolve({
      status: value.status,
      transport: submission.carriers.transport,
      values: [{ id: submissionBasePlusId.id }],
    });
  }

  getCarriers(
    { id, accountId }: SubmissionRef,
    carrierId: string
  ): Promise<Carriers> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
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
    { id, accountId }: SubmissionRef,
    carrierId: string,
    value: Carriers
  ): Promise<void> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (submission.carriers.status === 'NotStarted') {
      return Promise.reject(Boom.notFound());
    }

    if (value.status === 'NotStarted') {
      submission.carriers = this.setBaseNoCarriers(
        submission as dto.SubmissionBase,
        carrierId,
        value
      ).carriers;
    } else {
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
      submission.carriers = this.setBaseCarriers(
        submission as dto.SubmissionBase,
        carrierId,
        value,
        carrier,
        index
      ).carriers;
    }

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

    this.submissions.set(JSON.stringify({ id, accountId }), submission);

    return Promise.resolve();
  }

  deleteCarriers(
    { id, accountId }: SubmissionRef,
    carrierId: string
  ): Promise<void> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
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

    submission.carriers = this.deleteBaseCarriers(
      submission as dto.SubmissionBase,
      carrierId
    ).carriers;

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

    this.submissions.set(JSON.stringify({ id, accountId }), submission);

    return Promise.resolve();
  }

  getCollectionDetail({
    id,
    accountId,
  }: SubmissionRef): Promise<CollectionDetail> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.collectionDetail);
  }

  setCollectionDetail(
    { id, accountId }: SubmissionRef,
    value: CollectionDetail
  ): Promise<void> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    submission.collectionDetail = this.setBaseCollectionDetail(
      submission as dto.SubmissionBase,
      value
    ).collectionDetail;

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

    this.submissions.set(JSON.stringify({ id, accountId }), submission);

    return Promise.resolve();
  }

  getExitLocation({ id, accountId }: SubmissionRef): Promise<ExitLocation> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.ukExitLocation);
  }

  setExitLocation(
    { id, accountId }: SubmissionRef,
    value: ExitLocation
  ): Promise<void> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    submission.ukExitLocation = this.setBaseExitLocation(
      submission as dto.SubmissionBase,
      value as ExitLocation
    ).ukExitLocation;

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

    this.submissions.set(JSON.stringify({ id, accountId }), submission);

    return Promise.resolve();
  }

  getTransitCountries({
    id,
    accountId,
  }: SubmissionRef): Promise<TransitCountries> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.transitCountries as TransitCountries);
  }

  setTransitCountries(
    { id, accountId }: SubmissionRef,
    value: TransitCountries
  ): Promise<void> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    submission.transitCountries = this.setBaseTransitCountries(
      submission as dto.SubmissionBase,
      value as TransitCountries
    ).transitCountries;

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

    this.submissions.set(JSON.stringify({ id, accountId }), submission);

    return Promise.resolve();
  }

  listRecoveryFacilityDetail({
    id,
    accountId,
  }: SubmissionRef): Promise<RecoveryFacilityDetail> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.recoveryFacilityDetail);
  }

  createRecoveryFacilityDetail(
    { id, accountId }: SubmissionRef,
    value: Omit<RecoveryFacilityDetail, 'values'>
  ): Promise<RecoveryFacilityDetail> {
    if (value.status !== 'Started') {
      return Promise.reject(
        Boom.badRequest(
          `"Status cannot be ${value.status} on recovery facility detail creation"`
        )
      );
    }

    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (
      submission.recoveryFacilityDetail.status === 'Started' ||
      submission.recoveryFacilityDetail.status === 'Complete'
    ) {
      if (submission.recoveryFacilityDetail.values.length === 6) {
        return Promise.reject(
          Boom.badRequest(
            'Cannot add more than 6 facilities(1 InterimSite and 5 RecoveryFacilities)'
          )
        );
      }
    }

    const submissionBasePlusId: SubmissionBasePlusId =
      this.createBaseRecoveryFacilityDetail(
        submission as dto.SubmissionBase,
        value
      );

    submission.recoveryFacilityDetail =
      submissionBasePlusId.submissionBase.recoveryFacilityDetail;

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

    this.submissions.set(JSON.stringify({ id, accountId }), submission);

    return Promise.resolve({
      status: value.status,
      values: [{ id: submissionBasePlusId.id }],
    });
  }

  getRecoveryFacilityDetail(
    { id, accountId }: SubmissionRef,
    rfdId: string
  ): Promise<RecoveryFacilityDetail> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
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
    { id, accountId }: SubmissionRef,
    rfdId: string,
    value: RecoveryFacilityDetail
  ): Promise<void> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (
      submission.recoveryFacilityDetail.status !== 'Started' &&
      submission.recoveryFacilityDetail.status !== 'Complete'
    ) {
      return Promise.reject(Boom.notFound());
    }

    if (value.status === 'Started' || value.status === 'Complete') {
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
    }

    submission.recoveryFacilityDetail = this.setBaseRecoveryFacilityDetail(
      submission as dto.SubmissionBase,
      rfdId,
      value
    ).recoveryFacilityDetail;

    if (
      submission.recoveryFacilityDetail.status !== 'Started' &&
      submission.recoveryFacilityDetail.status !== 'Complete'
    ) {
      return Promise.reject(Boom.notFound());
    }

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

    this.submissions.set(JSON.stringify({ id, accountId }), submission);

    return Promise.resolve();
  }

  deleteRecoveryFacilityDetail(
    { id, accountId }: SubmissionRef,
    rfdId: string
  ): Promise<void> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
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

    submission.recoveryFacilityDetail = this.deleteBaseRecoveryFacilityDetail(
      submission as dto.SubmissionBase,
      rfdId
    ).recoveryFacilityDetail;

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

    this.submissions.set(JSON.stringify({ id, accountId }), submission);

    return Promise.resolve();
  }

  getSubmissionConfirmation({
    id,
    accountId,
  }: SubmissionRef): Promise<SubmissionConfirmation> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.submissionConfirmation);
  }

  setSubmissionConfirmation(
    { id, accountId }: SubmissionRef,
    value: SubmissionConfirmation
  ): Promise<void> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (submission.submissionConfirmation.status === 'CannotStart') {
      return Promise.reject(Boom.badRequest());
    }

    if (!isCollectionDateValid(submission.collectionDate)) {
      submission.collectionDate = { status: 'NotStarted' };
      submission.submissionConfirmation = setSubmissionConfirmation(submission);

      this.submissions.set(JSON.stringify({ id, accountId }), submission);
      return Promise.reject(Boom.badRequest('Invalid collection date'));
    }

    submission.submissionConfirmation = value;
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

    this.submissions.set(JSON.stringify({ id, accountId }), submission);
    return Promise.resolve();
  }

  getSubmissionDeclaration({
    id,
    accountId,
  }: SubmissionRef): Promise<SubmissionDeclaration> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.submissionDeclaration);
  }

  setSubmissionDeclaration(
    { id, accountId }: SubmissionRef,
    value: Omit<SubmissionDeclaration, 'values'>
  ): Promise<void> {
    const submission = this.submissions.get(JSON.stringify({ id, accountId }));
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

      this.submissions.set(JSON.stringify({ id, accountId }), submission);
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

      this.submissions.set(JSON.stringify({ id, accountId }), submission);
    }

    return Promise.resolve();
  }

  async getNumberOfSubmissions(
    accountId: string
  ): Promise<NumberOfSubmissions> {
    const numberOfSubmissions: NumberOfSubmissions = {
      completedWithActuals: 0,
      incomplete: 0,
      completedWithEstimates: 0,
    };

    numberOfSubmissions.incomplete = [...this.submissions.keys()].filter(
      (i) =>
        (JSON.parse(i) as SubmissionRef).accountId === accountId &&
        (JSON.parse(i) as Submission).submissionState.status === 'InProgress'
    ).length;

    numberOfSubmissions.completedWithEstimates = [
      ...this.submissions.keys(),
    ].filter(
      (i) =>
        (JSON.parse(i) as SubmissionRef).accountId === accountId &&
        (JSON.parse(i) as Submission).submissionState.status ===
          'SubmittedWithEstimates'
    ).length;

    const submittedStates = [
      'UpdatedWithActuals',
      'SubmittedWithEstimates',
      'SubmittedWithActuals',
    ];

    numberOfSubmissions.completedWithActuals = [
      ...this.submissions.keys(),
    ].filter(
      (i) =>
        (JSON.parse(i) as SubmissionRef).accountId === accountId &&
        submittedStates.includes(
          (JSON.parse(i) as Submission).submissionState.status
        )
    ).length;

    return Promise.resolve(numberOfSubmissions);
  }
}

export class AnnexViiServiceSubmissionBackend
  extends AnnexViiServiceSubmissionBaseBackend
  implements SubmissionBackend
{
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

    return response.value as Submission;
  }

  async createSubmissionFromTemplate(
    id: string,
    accountId: string,
    reference: CustomerReference
  ): Promise<DraftSubmission> {
    let response: CreateDraftResponse;
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
    let response: DeleteDraftResponse;
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
    cancellationType: dto.SubmissionCancellationType
  ): Promise<void> {
    let response: CancelDraftByIdResponse;
    try {
      response = await this.client.cancelDraft({
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
    state?: SubmissionState['status'][],
    token?: string
  ): Promise<SubmissionSummaryPage> {
    let response: GetDraftsResponse;
    try {
      response = await this.client.getDrafts({
        accountId,
        order,
        pageLimit,
        state,
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
    reference: CustomerReference
  ): Promise<void> {
    let response: SetDraftCustomerReferenceByIdResponse;
    try {
      response = await this.client.setDraftCustomerReferenceById({
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

    return response.value as WasteDescription;
  }

  async setWasteDescription(
    { id, accountId }: SubmissionRef,
    value: DraftWasteDescription
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

    return response.value as WasteQuantity;
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

  async getNumberOfSubmissions(
    accountId: string
  ): Promise<NumberOfSubmissions> {
    let response: GetNumberOfSubmissionsResponse;
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
