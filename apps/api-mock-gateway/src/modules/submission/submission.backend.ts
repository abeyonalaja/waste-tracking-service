import { db } from '../../db';
import {
  CancellationType,
  Carrier,
  CarrierPartial,
  Carriers,
  CollectionDate,
  CollectionDetail,
  CustomerReference,
  ExitLocation,
  ExporterDetail,
  ImporterDetail,
  NumberOfSubmissions,
  PageMetadata,
  RecoveryFacility,
  RecoveryFacilityDetail,
  RecoveryFacilityPartial,
  DraftSubmission,
  SubmissionConfirmation,
  SubmissionDeclaration,
  DraftSubmissionState,
  SubmissionSummary,
  SubmissionSummaryPage,
  TransitCountries,
  WasteDescription,
  WasteQuantity,
  Submission,
  WasteQuantityData,
  CollectionDateData,
} from '@wts/api/waste-tracking-gateway';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError, NotFoundError } from '../../lib/errors';
import {
  copyCarriersNoTransport,
  isSmallWaste,
  copyRecoveryFacilities,
  isWasteCodeChangingBulkToSmall,
  isWasteCodeChangingSmallToBulk,
  isWasteCodeChangingBulkToBulkDifferentType,
  isWasteCodeChangingBulkToBulkSameType,
  setBaseWasteDescription,
  createBaseCarriers,
  setBaseCarriers,
  deleteBaseCarriers,
  createBaseRecoveryFacilityDetail,
  setBaseRecoveryFacilityDetail,
  deleteBaseRecoveryFacilityDetail,
  isCollectionDateValid,
  paginateArray,
  setDraftWasteQuantityUnit,
  setSubmissionConfirmation,
  setSubmissionDeclaration,
  setWasteQuantityUnit,
  getSubmissionData,
  getCarrierTransport,
} from '../../lib/util';
import { validation } from '@wts/api/green-list-waste-export';

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

export async function getSubmissions(
  accountId: string,
  { order }: OrderRef,
  pageLimit = 15,
  state?: DraftSubmissionState['status'][],
  token?: string,
): Promise<SubmissionSummaryPage> {
  let rawValues: DraftSubmission[] | Submission[];

  if (
    state?.includes('SubmittedWithActuals') ||
    state?.includes('UpdatedWithActuals')
  ) {
    rawValues = db.submissions.filter(
      (s) => s.accountId === accountId,
    ) as Submission[];

    rawValues.sort((a, b) => {
      const dateA = new Date(
        `${a.collectionDate.actualDate.year}-${a.collectionDate.actualDate.month?.padStart(2, '0')}-${a.collectionDate.actualDate.day?.padStart(2, '0')}`,
      );
      const dateB = new Date(
        `${b.collectionDate.actualDate.year}-${b.collectionDate.actualDate.month?.padStart(2, '0')}-${b.collectionDate.actualDate.day?.padStart(2, '0')}`,
      );

      return dateB.getTime() - dateA.getTime();
    });
  } else if (
    state?.includes('SubmittedWithEstimates') ||
    state?.includes('Cancelled')
  ) {
    rawValues = db.submissions.filter(
      (s) => s.accountId === accountId,
    ) as Submission[];
  } else {
    rawValues = db.drafts.filter(
      (s) => s.accountId === accountId,
    ) as DraftSubmission[];
  }

  let values: ReadonlyArray<SubmissionSummary> = rawValues
    .map((s) => {
      return {
        id: s.id,
        reference: s.reference,
        wasteDescription: s.wasteDescription,
        collectionDate: s.collectionDate,
        submissionDeclaration: s.submissionDeclaration,
        submissionState: s.submissionState,
      };
    })
    .sort((x, y) => {
      return x.submissionState.timestamp > y.submissionState.timestamp ? 1 : -1;
    });

  if (order === 'DESC') {
    values = rawValues
      .map((s) => {
        return {
          id: s.id,
          reference: s.reference,
          wasteDescription: s.wasteDescription,
          collectionDate: s.collectionDate,
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
      state.some((val) => i.submissionState.status.includes(val)),
    );
  }

  if (!Array.isArray(values) || values.length === 0) {
    return Promise.reject(new NotFoundError('Not found.'));
  }

  let hasMoreResults = true;
  let totalSubmissions = 0;
  let totalPages = 0;
  let currentPage = 0;
  let pageNumber = 0;
  let contToken = '';
  const metadataArray: PageMetadata[] = [];
  let pageValues: ReadonlyArray<SubmissionSummary> = [];

  while (hasMoreResults) {
    totalPages += 1;
    pageNumber += 1;

    const paginatedValues = paginateArray(values, pageLimit, pageNumber);

    if ((!token && pageNumber === 1) || token === contToken) {
      pageValues = paginatedValues;
      currentPage = pageNumber;
    }

    const nextPaginatedValues = paginateArray(
      values,
      pageLimit,
      pageNumber + 1,
    );

    hasMoreResults = nextPaginatedValues.length === 0 ? false : true;
    totalSubmissions += paginatedValues.length;
    contToken = nextPaginatedValues.length === 0 ? '' : pageNumber.toString();

    const pageMetadata: PageMetadata = {
      pageNumber: pageNumber,
      token: nextPaginatedValues.length === 0 ? '' : pageNumber.toString(),
    };
    metadataArray.push(pageMetadata);

    if (!hasMoreResults && token === '') {
      break;
    }
  }

  return Promise.resolve({
    totalRecords: totalSubmissions,
    totalPages: totalPages,
    currentPage: currentPage,
    pages: metadataArray,
    values: pageValues,
  });
}

export async function getSubmission({
  id,
  accountId,
  submitted,
}: SubmissionTypeRef): Promise<DraftSubmission | Submission> {
  const value = !submitted
    ? (db.drafts.find(
        (s) => s.id == id && s.accountId == accountId,
      ) as DraftSubmission)
    : (db.submissions.find(
        (s) => s.id == id && s.accountId == accountId,
      ) as Submission);

  if (
    value === undefined ||
    value.submissionState.status === 'Cancelled' ||
    value.submissionState.status === 'Deleted'
  ) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  if (!submitted) {
    const v = value as DraftSubmission;
    const submission: DraftSubmission = {
      id: v.id,
      reference: v.reference,
      wasteQuantity: v.wasteQuantity,
      collectionDate: v.collectionDate,
      submissionConfirmation: v.submissionConfirmation,
      submissionDeclaration: v.submissionDeclaration,
      submissionState: v.submissionState,
      wasteDescription: v.wasteDescription,
      exporterDetail: v.exporterDetail,
      importerDetail: v.importerDetail,
      carriers: v.carriers,
      collectionDetail: v.collectionDetail,
      ukExitLocation: v.ukExitLocation,
      transitCountries: v.transitCountries,
      recoveryFacilityDetail: v.recoveryFacilityDetail,
    } as DraftSubmission;
    return Promise.resolve(submission);
  } else {
    const v = value as Submission;
    const submission = {
      id: v.id,
      reference: v.reference,
      wasteQuantity: v.wasteQuantity,
      collectionDate: v.collectionDate,
      submissionDeclaration: v.submissionDeclaration,
      submissionState: v.submissionState,
      wasteDescription: v.wasteDescription,
      exporterDetail: v.exporterDetail,
      importerDetail: v.importerDetail,
      carriers: v.carriers,
      collectionDetail: v.collectionDetail,
      ukExitLocation: v.ukExitLocation,
      transitCountries: v.transitCountries,
      recoveryFacilityDetail: v.recoveryFacilityDetail,
    } as Submission;

    return Promise.resolve(submission);
  }
}

export async function createSubmission(
  accountId: string,
  reference: CustomerReference,
): Promise<DraftSubmission> {
  if (reference.length > validation.ReferenceChar.max) {
    return Promise.reject(
      new BadRequestError(
        `Supplied reference cannot exceed ${validation.ReferenceChar.max} characters`,
      ),
    );
  }

  const id = uuidv4();
  const value: DraftSubmission & { accountId: string } = {
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
    accountId: accountId,
  };

  db.drafts.push(value);

  return Promise.resolve(value);
}

export async function createSubmissionFromTemplate(
  id: string,
  accountId: string,
  reference: CustomerReference,
): Promise<DraftSubmission> {
  if (reference.length > validation.ReferenceChar.max) {
    return Promise.reject(
      new BadRequestError(
        `Supplied reference cannot exceed ${validation.ReferenceChar.max} characters`,
      ),
    );
  }

  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found'));
  }

  id = uuidv4();

  const value: DraftSubmission & { accountId: string } = {
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
    carriers: copyCarriersNoTransport(
      template.carriers,
      isSmallWaste(template.wasteDescription),
    ),
    collectionDetail: template.collectionDetail,
    ukExitLocation: template.ukExitLocation,
    transitCountries: template.transitCountries,
    recoveryFacilityDetail: copyRecoveryFacilities(
      template.recoveryFacilityDetail,
    ),
    submissionConfirmation: { status: 'CannotStart' },
    submissionDeclaration: { status: 'CannotStart' },
    submissionState: {
      status: 'InProgress',
      timestamp: new Date(),
    },
    accountId: accountId,
  };

  db.drafts.push(value);

  return Promise.resolve(value);
}

export async function deleteSubmission({
  id,
  accountId,
}: SubmissionRef): Promise<void> {
  const value = db.drafts.find((s) => s.id == id && s.accountId == accountId);
  if (value === undefined) {
    return Promise.reject(new NotFoundError('Submission not found'));
  }
  value.submissionState = { status: 'Deleted', timestamp: new Date() };
  db.drafts.push(value);
  return Promise.resolve();
}

export async function cancelSubmission(
  { id, accountId }: SubmissionRef,
  cancellationType: CancellationType,
): Promise<void> {
  const value = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (value === undefined) {
    return Promise.reject(new NotFoundError('Submission not found'));
  }

  value.submissionState = {
    status: 'Cancelled',
    timestamp: new Date(),
    cancellationType: cancellationType,
  };

  return Promise.resolve();
}

export async function getWasteDescription({
  id,
  accountId,
}: SubmissionRef): Promise<WasteDescription> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.wasteDescription);
}

export async function setWasteDescription(
  { id, accountId }: SubmissionRef,
  value: WasteDescription,
): Promise<void> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  let wasteQuantity: DraftSubmission['wasteQuantity'] =
    submission.wasteQuantity;

  if (
    wasteQuantity.status === 'CannotStart' &&
    (value.status === 'Started' || value.status === 'Complete')
  ) {
    wasteQuantity = { status: 'NotStarted' };
  }

  if (isWasteCodeChangingBulkToSmall(submission.wasteDescription, value)) {
    wasteQuantity = { status: 'NotStarted' };
  }

  if (isWasteCodeChangingSmallToBulk(submission.wasteDescription, value)) {
    wasteQuantity = { status: 'NotStarted' };
  }

  if (
    isWasteCodeChangingBulkToBulkDifferentType(
      submission.wasteDescription,
      value,
    )
  ) {
    wasteQuantity = { status: 'NotStarted' };
  }

  if (
    isWasteCodeChangingBulkToBulkSameType(submission.wasteDescription, value)
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

  const submissionBase = setBaseWasteDescription(
    submission.wasteDescription,
    submission.carriers,
    submission.recoveryFacilityDetail,
    value,
  );
  submission.wasteDescription = submissionBase.wasteDescription;
  submission.carriers = submissionBase.carriers;
  submission.recoveryFacilityDetail = submissionBase.recoveryFacilityDetail;

  submission.wasteQuantity = wasteQuantity;
  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);
  return Promise.resolve();
}

export async function getWasteQuantity({
  id,
  accountId,
  submitted,
}: SubmissionTypeRef): Promise<WasteQuantity | WasteQuantityData> {
  const submission = !submitted
    ? db.drafts.find((s) => s.id == id && s.accountId == accountId)
    : db.submissions.find((s) => s.id == id && s.accountId == accountId);
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.wasteQuantity);
}

export async function setWasteQuantity(
  { id, accountId, submitted }: SubmissionTypeRef,
  value: WasteQuantity | WasteQuantityData,
): Promise<void> {
  if (!submitted) {
    const submission = db.drafts.find(
      (s) => s.id == id && s.accountId == accountId,
    ) as DraftSubmission;
    if (submission === undefined) {
      return Promise.reject(new NotFoundError('Submission not found.'));
    }

    const v = value as WasteQuantity;
    setDraftWasteQuantityUnit(v, submission);
    let wasteQuantity = v;
    if (
      v.status !== 'CannotStart' &&
      v.status !== 'NotStarted' &&
      v.value &&
      v.value.type &&
      v.value.type !== 'NotApplicable' &&
      submission.wasteQuantity.status !== 'CannotStart' &&
      submission.wasteQuantity.status !== 'NotStarted' &&
      submission.wasteQuantity.value &&
      submission.wasteQuantity.value.type &&
      submission.wasteQuantity.value.type !== 'NotApplicable'
    ) {
      if (
        v.value.type === 'ActualData' &&
        submission.wasteQuantity.value.estimateData
      ) {
        wasteQuantity = {
          status: v.status,
          value: {
            type: v.value.type,
            actualData: v.value.actualData ?? {},
            estimateData: submission.wasteQuantity.value.estimateData,
          },
        };
      }

      if (
        v.value.type === 'EstimateData' &&
        submission.wasteQuantity.value.actualData
      ) {
        wasteQuantity = {
          status: v.status,
          value: {
            type: v.value.type,
            actualData: submission.wasteQuantity.value.actualData,
            estimateData: v.value.estimateData ?? {},
          },
        };
      }
    }

    submission.wasteQuantity = wasteQuantity;

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);
  } else {
    const submission = db.submissions.find(
      (s) => s.id == id && s.accountId == accountId,
    ) as Submission;
    if (submission === undefined) {
      return Promise.reject(new NotFoundError('Submission not found.'));
    }

    const v = value as WasteQuantityData;
    setWasteQuantityUnit(v, submission);
    submission.wasteQuantity = v;

    submission.submissionState =
      submission.collectionDate.type === 'ActualDate' &&
      submission.submissionState.status === 'SubmittedWithEstimates' &&
      v.type === 'ActualData'
        ? { status: 'UpdatedWithActuals', timestamp: new Date() }
        : submission.submissionState;
  }

  return Promise.resolve();
}

export async function getCustomerReference({
  id,
  accountId,
}: SubmissionRef): Promise<CustomerReference> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.reference);
}

export async function setCustomerReference(
  { id, accountId }: SubmissionRef,
  reference: CustomerReference,
): Promise<void> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  if (reference.length > validation.ReferenceChar.max) {
    return Promise.reject(
      new BadRequestError(
        `Supplied reference cannot exceed ${validation.ReferenceChar.max} characters`,
      ),
    );
  }

  submission.reference = reference;

  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve();
}

export async function getExporterDetail({
  id,
  accountId,
}: SubmissionRef): Promise<ExporterDetail> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }
  return Promise.resolve(submission.exporterDetail);
}

export async function setExporterDetail(
  { id, accountId }: SubmissionRef,
  value: ExporterDetail,
): Promise<void> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  submission.exporterDetail = value;

  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve();
}

export async function getImporterDetail({
  id,
  accountId,
}: SubmissionRef): Promise<ImporterDetail> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );

  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.importerDetail);
}

export async function setImporterDetail(
  { id, accountId }: SubmissionRef,
  value: ImporterDetail,
): Promise<void> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  submission.importerDetail = value;

  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve();
}

export async function getCollectionDate({
  id,
  accountId,
  submitted,
}: SubmissionTypeRef): Promise<CollectionDate | CollectionDateData> {
  const submission = !submitted
    ? db.drafts.find((s) => s.id == id && s.accountId == accountId)
    : db.submissions.find((s) => s.id == id && s.accountId == accountId);
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.collectionDate);
}

export async function setCollectionDate(
  { id, accountId, submitted }: SubmissionTypeRef,
  value: CollectionDate | CollectionDateData,
): Promise<void> {
  if (!submitted) {
    const submission = db.drafts.find(
      (s) => s.id == id && s.accountId == accountId,
    ) as DraftSubmission;
    if (submission === undefined) {
      return Promise.reject(new NotFoundError('Submission not found.'));
    }

    const v = value as CollectionDate;
    let collectionDate = v;
    if (
      v.status !== 'NotStarted' &&
      submission.collectionDate.status !== 'NotStarted'
    ) {
      if (v.value.type === 'ActualDate') {
        collectionDate = {
          status: v.status,
          value: {
            type: v.value.type,
            actualDate: v.value.actualDate,
            estimateDate: submission.collectionDate.value.estimateDate,
          },
        };
      } else {
        collectionDate = {
          status: v.status,
          value: {
            type: v.value.type,
            actualDate: submission.collectionDate.value.actualDate,
            estimateDate: v.value.estimateDate,
          },
        };
      }
    }

    submission.collectionDate = collectionDate;

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);
  } else {
    const submission = db.submissions.find(
      (s) => s.id == id && s.accountId == accountId,
    ) as Submission;
    if (submission === undefined) {
      return Promise.reject(new NotFoundError('Submission not found.'));
    }

    const v = value as CollectionDateData;
    let collectionDate = v;
    if (v.type === 'ActualDate') {
      collectionDate = {
        type: v.type,
        actualDate: {
          day: v.actualDate.day,
          month: v.actualDate.month,
          year: v.actualDate.year,
        },
        estimateDate: submission.collectionDate.estimateDate,
      };
    } else {
      collectionDate = {
        type: v.type,
        estimateDate: {
          day: v.estimateDate.day,
          month: v.estimateDate.month,
          year: v.estimateDate.year,
        },
        actualDate: submission.collectionDate.actualDate,
      };
    }

    submission.collectionDate = collectionDate;

    submission.submissionState =
      submission.wasteQuantity.type === 'ActualData' &&
      submission.submissionState.status === 'SubmittedWithEstimates' &&
      v.type === 'ActualDate'
        ? { status: 'UpdatedWithActuals', timestamp: new Date() }
        : submission.submissionState;
  }

  return Promise.resolve();
}

export async function listCarriers({
  id,
  accountId,
}: SubmissionRef): Promise<Carriers> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.carriers);
}

export async function createCarriers(
  { id, accountId }: SubmissionRef,
  value: Omit<Carriers, 'transport' | 'values'>,
): Promise<Carriers> {
  if (value.status !== 'Started') {
    return Promise.reject(
      new BadRequestError(
        `"Status cannot be ${value.status} on carrier detail creation"`,
      ),
    );
  }

  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new Error('Submission not found.'));
  }

  if (submission.carriers.status !== 'NotStarted') {
    if (submission.carriers.values.length === validation.CarrierLength.max) {
      return Promise.reject(
        new BadRequestError(
          `Cannot add more than ${validation.CarrierLength.max} carriers`,
        ),
      );
    }
  }

  submission.carriers.transport = getCarrierTransport(
    submission.wasteDescription,
  );
  const { newCarrierId, carriers } = createBaseCarriers(
    submission.carriers,
    value,
  );
  submission.carriers = carriers;

  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  if (submission.carriers.status !== 'NotStarted') {
    return Promise.resolve({
      status: value.status,
      transport: submission.carriers.transport,
      values: [{ id: newCarrierId }],
    });
  } else {
    return Promise.reject(new BadRequestError('Incorrect carrier status.'));
  }
}

export async function getCarriers(
  { id, accountId }: SubmissionRef,
  carrierId: string,
): Promise<Carriers> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  if (submission.carriers.status === 'NotStarted') {
    return Promise.reject(new BadRequestError('Carriers NotStarted.'));
  }

  const carrier = submission.carriers.values.find((c) => {
    return c.id === carrierId;
  });

  if (carrier === undefined) {
    return Promise.reject(new NotFoundError('Carrier not found.'));
  }

  const value: Carriers =
    submission.carriers.status !== 'Complete'
      ? {
          status: submission.carriers.status,
          transport: submission.carriers.transport,
          values: [carrier as CarrierPartial],
        }
      : {
          status: submission.carriers.status,
          transport: submission.carriers.transport,
          values: [carrier as Carrier],
        };

  return Promise.resolve(value);
}

export async function setCarriers(
  { id, accountId }: SubmissionRef,
  carrierId: string,
  value: Carriers,
): Promise<void> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  if (submission.carriers.status === 'NotStarted') {
    return Promise.reject(new BadRequestError('Carriers NotStarted.'));
  }

  if (value.status === 'NotStarted') {
    submission.carriers = value;
  } else {
    const carrier = value.values.find((c) => {
      return c.id === carrierId;
    });
    if (carrier === undefined) {
      return Promise.reject(new NotFoundError('Carrier not found.'));
    }

    const index = submission.carriers.values.findIndex((c) => {
      return c.id === carrierId;
    });
    if (index === -1) {
      return Promise.reject('Index not found.');
    }
    submission.carriers = setBaseCarriers(
      submission.carriers,
      value,
      carrier,
      index,
    );
  }

  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve();
}

export async function deleteCarriers(
  { id, accountId }: SubmissionRef,
  carrierId: string,
): Promise<void> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  if (submission.carriers.status === 'NotStarted') {
    return Promise.reject(new BadRequestError('Carriers NotStarted.'));
  }

  const index = submission.carriers.values.findIndex((c) => {
    return c.id === carrierId;
  });

  if (index === -1) {
    return Promise.reject(new NotFoundError('Index not found.'));
  }

  submission.carriers.transport = getCarrierTransport(
    submission.wasteDescription,
  );
  submission.carriers = deleteBaseCarriers(submission.carriers, carrierId);

  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve();
}

export async function getCollectionDetail({
  id,
  accountId,
}: SubmissionRef): Promise<CollectionDetail> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );

  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.collectionDetail);
}

export async function setCollectionDetail(
  { id, accountId }: SubmissionRef,
  value: CollectionDetail,
): Promise<void> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  submission.collectionDetail = value;
  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve();
}

export async function getExitLocation({
  id,
  accountId,
}: SubmissionRef): Promise<ExitLocation> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.ukExitLocation);
}

export async function setExitLocation(
  { id, accountId }: SubmissionRef,
  value: ExitLocation,
): Promise<void> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  submission.ukExitLocation = value;
  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve();
}

export async function getTransitCountries({
  id,
  accountId,
}: SubmissionRef): Promise<TransitCountries> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.transitCountries);
}

export async function setTransitCountries(
  { id, accountId }: SubmissionRef,
  value: TransitCountries,
): Promise<void> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  submission.transitCountries = value;
  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve();
}

export async function listRecoveryFacilityDetail({
  id,
  accountId,
}: SubmissionRef): Promise<RecoveryFacilityDetail> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.recoveryFacilityDetail);
}

export async function createRecoveryFacilityDetail(
  { id, accountId }: SubmissionRef,
  value: Omit<RecoveryFacilityDetail, 'values'>,
): Promise<RecoveryFacilityDetail> {
  if (value.status !== 'Started') {
    return Promise.reject(
      new BadRequestError(
        `"Status cannot be ${value.status} on recovery facility detail creation"`,
      ),
    );
  }

  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  if (
    submission.recoveryFacilityDetail.status === 'Started' ||
    submission.recoveryFacilityDetail.status === 'Complete'
  ) {
    const maxFacilities =
      validation.InterimSiteLength.max + validation.RecoveryFacilityLength.max;
    if (submission.recoveryFacilityDetail.values.length === maxFacilities) {
      return Promise.reject(
        new BadRequestError(
          `Cannot add more than ${maxFacilities} recovery facilities (Maximum: ${validation.InterimSiteLength.max} InterimSite & ${validation.RecoveryFacilityLength.max} Recovery Facilities)`,
        ),
      );
    }
  }

  const { newRecoveryFacilityDetailId, recoveryFacilityDetails } =
    createBaseRecoveryFacilityDetail(submission.recoveryFacilityDetail, value);
  submission.recoveryFacilityDetail = recoveryFacilityDetails;

  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  if (submission.recoveryFacilityDetail.status === 'Started') {
    return Promise.resolve({
      status: value.status,
      values: [{ id: newRecoveryFacilityDetailId }],
    });
  } else {
    return Promise.reject(
      new BadRequestError('Incorrect recovery facility status.'),
    );
  }
}

export async function getRecoveryFacilityDetail(
  { id, accountId }: SubmissionRef,
  rfdId: string,
): Promise<RecoveryFacilityDetail> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  if (
    submission.recoveryFacilityDetail.status !== 'Started' &&
    submission.recoveryFacilityDetail.status !== 'Complete'
  ) {
    return Promise.reject(new NotFoundError('Not found.'));
  }

  const recoveryFacility = submission.recoveryFacilityDetail.values.find(
    (rf) => {
      return rf.id === rfdId;
    },
  );

  if (recoveryFacility === undefined) {
    return Promise.reject(new NotFoundError('RecoveyFacility not found.'));
  }

  const value: RecoveryFacilityDetail =
    submission.recoveryFacilityDetail.status !== 'Complete'
      ? {
          status: submission.carriers.status as 'Started',
          values: [recoveryFacility as RecoveryFacilityPartial],
        }
      : {
          status: submission.carriers.status,
          values: [recoveryFacility as RecoveryFacility],
        };
  return Promise.resolve(value);
}

export async function setRecoveryFacilityDetail(
  { id, accountId }: SubmissionRef,
  rfdId: string,
  value: RecoveryFacilityDetail,
): Promise<void> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  if (
    submission.recoveryFacilityDetail.status !== 'Started' &&
    submission.recoveryFacilityDetail.status !== 'Complete'
  ) {
    return Promise.reject(new NotFoundError('Not found.'));
  }

  if (value.status === 'Started' || value.status === 'Complete') {
    const recoveryFacility = value.values.find((rf) => {
      return rf.id === rfdId;
    });

    if (recoveryFacility === undefined) {
      return Promise.reject(new NotFoundError('RecoveryFacility not found.'));
    }
    const index = submission.recoveryFacilityDetail.values.findIndex((rf) => {
      return rf.id === rfdId;
    });
    if (index === -1) {
      return Promise.reject(new Error('Not found.'));
    }
  }

  submission.recoveryFacilityDetail = setBaseRecoveryFacilityDetail(
    submission.recoveryFacilityDetail,
    rfdId,
    value,
  );

  if (
    submission.recoveryFacilityDetail.status !== 'Started' &&
    submission.recoveryFacilityDetail.status !== 'Complete'
  ) {
    return Promise.reject(new NotFoundError('Not found.'));
  }

  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve();
}

export async function deleteRecoveryFacilityDetail(
  { id, accountId }: SubmissionRef,
  rfdId: string,
): Promise<void> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }
  if (
    submission.recoveryFacilityDetail.status !== 'Started' &&
    submission.recoveryFacilityDetail.status !== 'Complete'
  ) {
    return Promise.reject(new NotFoundError('Not found.'));
  }

  const index = submission.recoveryFacilityDetail.values.findIndex((rf) => {
    return rf.id === rfdId;
  });

  if (index === -1) {
    return Promise.reject(new NotFoundError('Not found.'));
  }

  submission.recoveryFacilityDetail = deleteBaseRecoveryFacilityDetail(
    submission.recoveryFacilityDetail,
    rfdId,
  );

  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve();
}

export async function getSubmissionConfirmation({
  id,
  accountId,
}: SubmissionRef): Promise<SubmissionConfirmation> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.submissionConfirmation);
}

export async function updateSubmissionConfirmation(
  { id, accountId }: SubmissionRef,
  value: SubmissionConfirmation,
): Promise<void> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  if (submission.submissionConfirmation.status === 'CannotStart') {
    return Promise.reject(
      new BadRequestError('SubmissionConfirmation CannotStart.'),
    );
  }

  if (!isCollectionDateValid(submission.collectionDate)) {
    submission.collectionDate = { status: 'NotStarted' };
    submission.submissionConfirmation = setSubmissionConfirmation(submission);

    db.drafts.push(submission);
    return Promise.reject(new Error('Invalid collection date'));
  }

  submission.submissionConfirmation = value;
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve();
}

export async function getSubmissionDeclaration({
  id,
  accountId,
}: SubmissionRef): Promise<SubmissionDeclaration> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.submissionDeclaration);
}

export async function updateSubmissionDeclaration(
  { id, accountId }: SubmissionRef,
  value: Omit<SubmissionDeclaration, 'values'>,
): Promise<void> {
  const submission = db.drafts.find(
    (s) => s.id == id && s.accountId == accountId,
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  if (submission.submissionDeclaration.status === 'CannotStart') {
    return Promise.reject(
      new BadRequestError('SubmissionDeclaration CannotStart'),
    );
  }

  if (!isCollectionDateValid(submission.collectionDate)) {
    submission.collectionDate = { status: 'NotStarted' };

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

    db.drafts.push(submission);
    return Promise.reject(new BadRequestError('Invalid collection date'));
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

    db.submissions.push(getSubmissionData(accountId, submission));

    const index = db.drafts.findIndex((d) => {
      return d.id === submission.id;
    });

    db.drafts.splice(index, 1);
  }

  return Promise.resolve();
}

export async function getNumberOfSubmissions(
  accountId: string,
): Promise<NumberOfSubmissions> {
  const numberOfSubmissions: NumberOfSubmissions = {
    completedWithActuals: 0,
    incomplete: 0,
    completedWithEstimates: 0,
  };
  numberOfSubmissions.incomplete = db.drafts.filter(
    (submission) =>
      submission.accountId === accountId &&
      submission.submissionState.status === 'InProgress',
  ).length;

  numberOfSubmissions.completedWithEstimates = db.submissions.filter(
    (submission) =>
      submission.accountId === accountId &&
      submission.submissionState.status === 'SubmittedWithEstimates',
  ).length;

  numberOfSubmissions.completedWithActuals = db.submissions.filter(
    (submission) =>
      submission.accountId === accountId &&
      submission.submissionState.status !== 'SubmittedWithEstimates',
  ).length;
  return Promise.resolve(numberOfSubmissions);
}
