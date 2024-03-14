import { db } from '../../db';
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
  Submission,
  SubmissionConfirmation,
  SubmissionDeclaration,
  SubmissionState,
  SubmissionSummary,
  SubmissionSummaryPage,
  TransitCountries,
  WasteDescription,
  WasteQuantity,
} from '@wts/api/waste-tracking-gateway';
import {
  DraftSubmission,
  DraftWasteDescription,
  Template,
} from '@wts/api/annex-vii';
import { v4 as uuidv4 } from 'uuid';
import * as dto from '@wts/api/waste-tracking-gateway';
import { BadRequestError, NotFoundError } from '../../libs/errors';

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

export type OrderRef = {
  order: 'ASC' | 'DESC';
};

function paginateArray<T>(
  array: T[],
  pageSize: number,
  pageNumber: number
): T[] {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

export type SubmissionBasePlusId = {
  submissionBase: dto.SubmissionBase;
  id: string;
};

export type SubmissionRef = {
  id: string;
  accountId: string;
};

export type TemplateRef = {
  id: string;
  accountId: string;
};

export async function getSubmissions(
  accountId: string,
  { order }: OrderRef,
  pageLimit = 15,
  state?: SubmissionState['status'][],
  token?: string
): Promise<SubmissionSummaryPage> {
  const rawValues: Submission[] = db.submissions.filter(
    (s) => s.accountId === accountId
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
      return x.submissionState.timestamp > y.submissionState.timestamp ? 1 : -1;
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
    return Promise.reject(new NotFoundError('Not found.'));
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

    const paginatedValues = paginateArray(values, pageLimit, pageNumber);

    if ((!token && pageNumber === 1) || token === contToken) {
      pageValues = paginatedValues;
      currentPage = pageNumber;
    }

    const nextPaginatedValues = paginateArray(
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

export async function getSubmission({
  id,
  accountId,
}: SubmissionRef): Promise<Submission> {
  const value = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  ) as Submission;

  if (
    value === undefined ||
    value.submissionState.status === 'Cancelled' ||
    value.submissionState.status === 'Deleted'
  ) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }
  const submission: Submission = {
    id: value.id,
    reference: value.reference,
    wasteQuantity: value.wasteQuantity,
    collectionDate: value.collectionDate,
    submissionConfirmation: value.submissionConfirmation,
    submissionDeclaration: value.submissionDeclaration,
    submissionState: value.submissionState,
    wasteDescription: value.wasteDescription,
    exporterDetail: value.exporterDetail,
    importerDetail: value.importerDetail,
    carriers: value.carriers,
    collectionDetail: value.collectionDetail,
    ukExitLocation: value.ukExitLocation,
    transitCountries: value.transitCountries,
    recoveryFacilityDetail: value.recoveryFacilityDetail,
  };

  return Promise.resolve(submission);
}
export async function createSubmission(
  accountId: string,
  reference: CustomerReference
): Promise<Submission> {
  if (reference.length > 20) {
    return Promise.reject(
      new BadRequestError('Supplied reference cannot exceed 20 characters')
    );
  }

  const id = uuidv4();
  // Create the new submission object
  const value: Submission & { accountId: string } = {
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

  // Add the new submission to the database

  db.submissions.push(value);

  // Return the new submission
  return Promise.resolve(value);
}

export async function createSubmissionFromTemplate(
  id: string,
  accountId: string,
  reference: CustomerReference
): Promise<DraftSubmission> {
  if (reference.length > 20) {
    return Promise.reject(
      new BadRequestError('Supplied reference cannot exceed 20 characters')
    );
  }

  const template = await getTemplate({ id, accountId } as TemplateRef);
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found'));
  }

  id = uuidv4();

  const value: Submission & { accountId: string } = {
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
      isSmallWaste(template.wasteDescription)
    ),
    collectionDetail: template.collectionDetail,
    ukExitLocation: template.ukExitLocation,
    transitCountries: template.transitCountries,
    recoveryFacilityDetail: copyRecoveryFacilities(
      template.recoveryFacilityDetail
    ),
    submissionConfirmation: { status: 'CannotStart' },
    submissionDeclaration: { status: 'CannotStart' },
    submissionState: {
      status: 'InProgress',
      timestamp: new Date(),
    },
    accountId: accountId,
  };

  db.submissions.push(value);

  return Promise.resolve(value);
}

export async function deleteSubmission({
  id,
  accountId,
}: SubmissionRef): Promise<void> {
  const value = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (value === undefined) {
    return Promise.reject(new NotFoundError('Submission not found'));
  }
  value.submissionState = { status: 'Deleted', timestamp: new Date() };
  db.submissions.push(value);
  return Promise.resolve();
}

export async function cancelSubmission(
  { id, accountId }: SubmissionRef,
  cancellationType: dto.SubmissionCancellationType
): Promise<void> {
  const value = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
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
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.wasteDescription);
}

export async function setWasteDescription(
  { id, accountId }: SubmissionRef,
  value: DraftWasteDescription
): Promise<void> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  let wasteQuantity: dto.Submission['wasteQuantity'] = submission.wasteQuantity;

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
      value
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
    submission as dto.SubmissionBase,
    value
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
}: SubmissionRef): Promise<WasteQuantity> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.wasteQuantity);
}

export async function setWasteQuantity(
  { id, accountId }: SubmissionRef,
  value: WasteQuantity
): Promise<void> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
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

  return Promise.resolve();
}

export async function getCustomerReference({
  id,
  accountId,
}: SubmissionRef): Promise<CustomerReference> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.reference);
}

export async function setCustomerReference(
  { id, accountId }: SubmissionRef,
  reference: CustomerReference
): Promise<void> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  if (reference.length > 20) {
    return Promise.reject(
      new BadRequestError('Supplied reference cannot exceed 20 characters')
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
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }
  return Promise.resolve(submission.exporterDetail);
}

export async function setExporterDetail(
  { id, accountId }: SubmissionRef,
  value: ExporterDetail
): Promise<void> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  submission.exporterDetail = setBaseExporterDetail(
    submission as dto.SubmissionBase,
    value
  ).exporterDetail;

  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve();
}

export async function getImporterDetail({
  id,
  accountId,
}: SubmissionRef): Promise<ImporterDetail> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );

  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.importerDetail);
}

export async function setImporterDetail(
  { id, accountId }: SubmissionRef,
  value: ImporterDetail
): Promise<void> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  submission.importerDetail = setBaseImporterDetail(
    submission as dto.SubmissionBase,
    value
  ).importerDetail;

  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve();
}

export async function getCollectionDate({
  id,
  accountId,
}: SubmissionRef): Promise<CollectionDate> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.collectionDate);
}

export async function setCollectionDate(
  { id, accountId }: SubmissionRef,
  value: CollectionDate
): Promise<void> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
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

  return Promise.resolve();
}

export async function listCarriers({
  id,
  accountId,
}: SubmissionRef): Promise<Carriers> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.carriers);
}

export async function createCarriers(
  { id, accountId }: SubmissionRef,
  value: Omit<Carriers, 'transport' | 'values'>
): Promise<Carriers> {
  if (value.status !== 'Started') {
    return Promise.reject(
      new BadRequestError(
        `"Status cannot be ${value.status} on carrier detail creation"`
      )
    );
  }

  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new Error('Submission not found.'));
  }

  if (submission.carriers.status !== 'NotStarted') {
    if (submission.carriers.values.length === 5) {
      return Promise.reject(
        new BadRequestError('Cannot add more than 5 carriers')
      );
    }
  }

  const submissionBasePlusId: SubmissionBasePlusId = createBaseCarriers(
    submission as dto.SubmissionBase,
    value
  );

  submission.carriers = submissionBasePlusId.submissionBase.carriers;

  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve({
    status: value.status,
    transport: submission.carriers.transport,
    values: [{ id: submissionBasePlusId.id }],
  });
}

export async function getCarriers(
  { id, accountId }: SubmissionRef,
  carrierId: string
): Promise<Carriers> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
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

  const value: dto.Carriers = {
    status: submission.carriers.status,
    transport: submission.carriers.transport,
    values: [carrier],
  };

  return Promise.resolve(value);
}

export async function setCarriers(
  { id, accountId }: SubmissionRef,
  carrierId: string,
  value: Carriers
): Promise<void> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  if (submission.carriers.status === 'NotStarted') {
    return Promise.reject(new BadRequestError('Carriers NotStarted.'));
  }

  if (value.status === 'NotStarted') {
    submission.carriers = setBaseNoCarriers(
      submission as dto.SubmissionBase,
      carrierId,
      value
    ).carriers;
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
      submission as dto.SubmissionBase,
      carrierId,
      value,
      carrier,
      index
    ).carriers;
  }

  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve();
}

export async function deleteCarriers(
  { id, accountId }: SubmissionRef,
  carrierId: string
): Promise<void> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
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

  submission.carriers = deleteBaseCarriers(
    submission as dto.SubmissionBase,
    carrierId
  ).carriers;

  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve();
}

export async function getCollectionDetail({
  id,
  accountId,
}: SubmissionRef): Promise<CollectionDetail> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );

  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.collectionDetail);
}

export async function setCollectionDetail(
  { id, accountId }: SubmissionRef,
  value: CollectionDetail
): Promise<void> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  submission.collectionDetail = setBaseCollectionDetail(
    submission as dto.SubmissionBase,
    value
  ).collectionDetail;

  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve();
}

export async function getExitLocation({
  id,
  accountId,
}: SubmissionRef): Promise<ExitLocation> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.ukExitLocation);
}

export async function setExitLocation(
  { id, accountId }: SubmissionRef,
  value: ExitLocation
): Promise<void> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  submission.ukExitLocation = setBaseExitLocation(
    submission as dto.SubmissionBase,
    value
  ).ukExitLocation;

  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve();
}

export async function getTransitCountries({
  id,
  accountId,
}: SubmissionRef): Promise<TransitCountries> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.transitCountries);
}

export async function setTransitCountries(
  { id, accountId }: SubmissionRef,
  value: TransitCountries
): Promise<void> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  submission.transitCountries = setBaseTransitCountries(
    submission as dto.SubmissionBase,
    value
  ).transitCountries;

  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve();
}

export async function listRecoveryFacilityDetail({
  id,
  accountId,
}: SubmissionRef): Promise<RecoveryFacilityDetail> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.recoveryFacilityDetail);
}

export async function createRecoveryFacilityDetail(
  { id, accountId }: SubmissionRef,
  value: Omit<RecoveryFacilityDetail, 'values'>
): Promise<RecoveryFacilityDetail> {
  if (value.status !== 'Started') {
    return Promise.reject(
      new BadRequestError(
        `"Status cannot be ${value.status} on recovery facility detail creation"`
      )
    );
  }

  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  if (
    submission.recoveryFacilityDetail.status === 'Started' ||
    submission.recoveryFacilityDetail.status === 'Complete'
  ) {
    if (submission.recoveryFacilityDetail.values.length === 6) {
      return Promise.reject(
        new BadRequestError(
          'Cannot add more than 6 facilities(1 InterimSite and 5 RecoveryFacilities)'
        )
      );
    }
  }

  const submissionBasePlusId: SubmissionBasePlusId =
    createBaseRecoveryFacilityDetail(submission as dto.SubmissionBase, value);

  submission.recoveryFacilityDetail =
    submissionBasePlusId.submissionBase.recoveryFacilityDetail;

  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve({
    status: value.status,
    values: [{ id: submissionBasePlusId.id }],
  });
}

export async function getRecoveryFacilityDetail(
  { id, accountId }: SubmissionRef,
  rfdId: string
): Promise<RecoveryFacilityDetail> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
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
    }
  );

  if (recoveryFacility === undefined) {
    return Promise.reject(new NotFoundError('RecoveyFacility not found.'));
  }

  const value: dto.RecoveryFacilityDetail = {
    status: submission.recoveryFacilityDetail.status,
    values: [recoveryFacility],
  };
  return Promise.resolve(value);
}

export async function setRecoveryFacilityDetail(
  { id, accountId }: SubmissionRef,
  rfdId: string,
  value: RecoveryFacilityDetail
): Promise<void> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
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
    submission as dto.SubmissionBase,
    rfdId,
    value
  ).recoveryFacilityDetail;

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
  rfdId: string
): Promise<void> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
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
    submission as dto.SubmissionBase,
    rfdId
  ).recoveryFacilityDetail;

  submission.submissionConfirmation = setSubmissionConfirmation(submission);
  submission.submissionDeclaration = setSubmissionDeclaration(submission);

  return Promise.resolve();
}

export async function getSubmissionConfirmation({
  id,
  accountId,
}: SubmissionRef): Promise<SubmissionConfirmation> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.submissionConfirmation);
}

export async function updateSubmissionConfirmation(
  { id, accountId }: SubmissionRef,
  value: SubmissionConfirmation
): Promise<void> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  if (submission.submissionConfirmation.status === 'CannotStart') {
    return Promise.reject(
      new BadRequestError('SubmissionConfirmation CannotStart.')
    );
  }

  if (!isCollectionDateValid(submission.collectionDate)) {
    submission.collectionDate = { status: 'NotStarted' };
    submission.submissionConfirmation = setSubmissionConfirmation(submission);

    db.submissions.push(submission);
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
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(submission.submissionDeclaration);
}

export async function updateSubmissionDeclaration(
  { id, accountId }: SubmissionRef,
  value: Omit<SubmissionDeclaration, 'values'>
): Promise<void> {
  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  );
  if (submission === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  if (submission.submissionDeclaration.status === 'CannotStart') {
    return Promise.reject(
      new BadRequestError('SubmissionDeclaration CannotStart')
    );
  }

  if (!isCollectionDateValid(submission.collectionDate)) {
    submission.collectionDate = { status: 'NotStarted' };

    submission.submissionConfirmation = setSubmissionConfirmation(submission);
    submission.submissionDeclaration = setSubmissionDeclaration(submission);

    db.submissions.push(submission);
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
  }

  return Promise.resolve();
}

export async function getNumberOfSubmissions(
  accountId: string
): Promise<NumberOfSubmissions> {
  const numberOfSubmissions: NumberOfSubmissions = {
    completedWithActuals: 0,
    incomplete: 0,
    completedWithEstimates: 0,
  };
  numberOfSubmissions.incomplete = db.submissions.filter(
    (submission) =>
      submission.accountId === accountId &&
      submission.submissionState.status === 'InProgress'
  ).length;

  numberOfSubmissions.completedWithEstimates = db.submissions.filter(
    (submission) =>
      submission.accountId === accountId &&
      submission.submissionState.status === 'SubmittedWithEstimates'
  ).length;

  const submittedStates = [
    'UpdatedWithActuals',
    'SubmittedWithEstimates',
    'SubmittedWithActuals',
  ];

  numberOfSubmissions.completedWithActuals = db.submissions.filter(
    (submission) =>
      submission.accountId === accountId &&
      submittedStates.includes(submission.submissionState.status)
  ).length;
  return Promise.resolve(numberOfSubmissions);
}

function getTemplate({ id, accountId }: TemplateRef): Promise<Template> {
  const value = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
  ) as Template;
  if (value === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }
  const template: Template = {
    templateDetails: value.templateDetails,
    id: value.id,
    wasteDescription: value.wasteDescription,
    exporterDetail: value.exporterDetail,
    importerDetail: value.importerDetail,
    carriers: value.carriers,
    collectionDetail: value.collectionDetail,
    ukExitLocation: value.ukExitLocation,
    transitCountries: value.transitCountries,
    recoveryFacilityDetail: value.recoveryFacilityDetail,
  };
  return Promise.resolve(template);
}

function copyCarriersNoTransport(
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

function isSmallWaste(wasteDescription: DraftWasteDescription): boolean {
  return (
    wasteDescription.status === 'Complete' &&
    wasteDescription.wasteCode.type === 'NotApplicable'
  );
}

function copyRecoveryFacilities(
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

function isWasteCodeChangingBulkToSmall(
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

function isWasteCodeChangingSmallToBulk(
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

function isWasteCodeChangingBulkToBulkDifferentType(
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

function isWasteCodeChangingBulkToBulkSameType(
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

function setBaseWasteDescription(
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

  if (isWasteCodeChangingBulkToSmall(submissionBase.wasteDescription, value)) {
    if (value.status === 'Started') {
      value.ewcCodes = undefined;
      value.nationalCode = undefined;
      value.description = undefined;
    }

    carriers = { status: 'NotStarted', transport: false };

    recoveryFacilityDetail = { status: 'NotStarted' };
  }

  if (isWasteCodeChangingSmallToBulk(submissionBase.wasteDescription, value)) {
    if (value.status === 'Started') {
      value.ewcCodes = undefined;
      value.nationalCode = undefined;
      value.description = undefined;
    }

    carriers = { status: 'NotStarted', transport: true };

    recoveryFacilityDetail = { status: 'NotStarted' };
  }

  if (
    isWasteCodeChangingBulkToBulkDifferentType(
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
    isWasteCodeChangingBulkToBulkSameType(
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
    Object.entries(filteredValues).every(
      ([key, value]) =>
        key === 'accountId' || (value.status && value.status === 'Complete')
    )
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

function setBaseExporterDetail(
  submissionBase: dto.SubmissionBase,
  value: ExporterDetail
): dto.SubmissionBase {
  submissionBase.exporterDetail = value;

  return submissionBase;
}

function setBaseImporterDetail(
  submissionBase: dto.SubmissionBase,
  value: ImporterDetail
): dto.SubmissionBase {
  submissionBase.importerDetail = value;

  return submissionBase;
}

function createBaseCarriers(
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

function setBaseNoCarriers(
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

function setBaseCarriers(
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

function deleteBaseCarriers(
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

function setBaseCollectionDetail(
  submissionBase: dto.SubmissionBase,
  value: CollectionDetail
): dto.SubmissionBase {
  submissionBase.collectionDetail = value;

  return submissionBase;
}

function setBaseExitLocation(
  submissionBase: dto.SubmissionBase,
  value: ExitLocation
): dto.SubmissionBase {
  submissionBase.ukExitLocation = value;

  return submissionBase;
}

function setBaseTransitCountries(
  submissionBase: dto.SubmissionBase,
  value: TransitCountries
): dto.SubmissionBase {
  submissionBase.transitCountries = value;

  return submissionBase;
}

function createBaseRecoveryFacilityDetail(
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
function setBaseRecoveryFacilityDetail(
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

function deleteBaseRecoveryFacilityDetail(
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
