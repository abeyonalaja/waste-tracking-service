import { v4 as uuidv4 } from 'uuid';
import {
  DraftCarrier,
  DraftCarriers,
  DraftSubmission,
  DraftWasteDescription,
  DraftCarrierPartial,
  DraftRecoveryFacilityDetails,
} from '../model';

export function isCollectionDateValid(
  date: DraftSubmission['collectionDate'],
): boolean {
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

export function setSubmissionConfirmationStatus(
  draft: DraftSubmission,
): DraftSubmission['submissionConfirmation'] {
  const {
    id,
    reference,
    submissionConfirmation,
    submissionDeclaration,
    submissionState,
    ...filteredValues
  } = draft;

  if (
    Object.values(filteredValues).every((value) => value.status === 'Complete')
  ) {
    return { status: 'NotStarted' };
  } else {
    return { status: 'CannotStart' };
  }
}

export function setSubmissionDeclarationStatus(
  draft: DraftSubmission,
): DraftSubmission['submissionDeclaration'] {
  if (draft.submissionConfirmation.status === 'Complete') {
    return { status: 'NotStarted' };
  } else {
    return { status: 'CannotStart' };
  }
}

export function copyCarriersNoTransport(
  sourceCarriers: DraftCarriers,
  isSmallWaste: boolean,
): DraftCarriers {
  let targetCarriers: DraftCarriers = {
    status: 'NotStarted',
    transport: true,
  };

  if (sourceCarriers.status !== 'NotStarted') {
    const carriers = sourceCarriers.values.map((c) => {
      return {
        id: uuidv4(),
        addressDetails: c.addressDetails,
        contactDetails: c.contactDetails,
      };
    });

    const status = isSmallWaste ? sourceCarriers.status : 'Started';
    if (status === 'Complete') {
      targetCarriers = {
        status: status,
        transport: true,
        values: carriers as DraftCarrier[],
      };
    } else {
      targetCarriers = {
        status: status,
        transport: true,
        values: carriers as DraftCarrierPartial[],
      };
    }
  }

  return targetCarriers;
}

export function setBaseWasteDescription(
  draftWasteDescription: DraftWasteDescription,
  draftCarriers: DraftCarriers,
  draftRecoveryFacilityDetail: DraftRecoveryFacilityDetails,
  value: DraftWasteDescription,
): {
  wasteDescription: DraftWasteDescription;
  carriers: DraftCarriers;
  recoveryFacilityDetail: DraftRecoveryFacilityDetails;
} {
  let recoveryFacilityDetail: DraftSubmission['recoveryFacilityDetail'] =
    draftRecoveryFacilityDetail.status === 'CannotStart' &&
    value.status !== 'NotStarted' &&
    value.wasteCode !== undefined
      ? { status: 'NotStarted' }
      : draftRecoveryFacilityDetail;

  let carriers: DraftSubmission['carriers'] = draftCarriers;

  if (
    draftWasteDescription.status === 'NotStarted' &&
    value.status !== 'NotStarted' &&
    value.wasteCode?.type === 'NotApplicable'
  ) {
    carriers.transport = false;
  }

  if (isWasteCodeChangingBulkToSmall(draftWasteDescription, value)) {
    if (value.status === 'Started') {
      value.ewcCodes = undefined;
      value.nationalCode = undefined;
      value.description = undefined;
    }

    carriers = { status: 'NotStarted', transport: false };

    recoveryFacilityDetail = { status: 'NotStarted' };
  }

  if (isWasteCodeChangingSmallToBulk(draftWasteDescription, value)) {
    if (value.status === 'Started') {
      value.ewcCodes = undefined;
      value.nationalCode = undefined;
      value.description = undefined;
    }

    carriers = { status: 'NotStarted', transport: true };

    recoveryFacilityDetail = { status: 'NotStarted' };
  }

  if (
    isWasteCodeChangingBulkToBulkDifferentType(draftWasteDescription, value)
  ) {
    if (value.status === 'Started') {
      value.ewcCodes = undefined;
      value.nationalCode = undefined;
      value.description = undefined;
    }

    carriers = { status: 'NotStarted', transport: true };

    recoveryFacilityDetail = { status: 'NotStarted' };
  }

  if (isWasteCodeChangingBulkToBulkSameType(draftWasteDescription, value)) {
    if (value.status === 'Started') {
      value.ewcCodes = undefined;
      value.nationalCode = undefined;
      value.description = undefined;
    }

    if (draftCarriers.status !== 'NotStarted') {
      carriers = {
        status: 'Started',
        transport: true,
        values: draftCarriers.values,
      };
    }

    if (
      draftRecoveryFacilityDetail.status === 'Started' ||
      draftRecoveryFacilityDetail.status === 'Complete'
    ) {
      recoveryFacilityDetail = {
        status: 'Started',
        values: draftRecoveryFacilityDetail.values,
      };
    }
  }

  draftWasteDescription = value;
  draftCarriers = carriers;
  draftRecoveryFacilityDetail = recoveryFacilityDetail;

  return {
    wasteDescription: draftWasteDescription,
    carriers: draftCarriers,
    recoveryFacilityDetail: draftRecoveryFacilityDetail,
  };
}

export function isWasteCodeChangingBulkToSmall(
  currentWasteDescription: DraftWasteDescription,
  newWasteDescription: DraftWasteDescription,
): boolean {
  return (
    currentWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type !== 'NotApplicable' &&
    newWasteDescription.status !== 'NotStarted' &&
    newWasteDescription.wasteCode?.type === 'NotApplicable'
  );
}

export function isWasteCodeChangingSmallToBulk(
  currentWasteDescription: DraftWasteDescription,
  newWasteDescription: DraftWasteDescription,
): boolean {
  return (
    currentWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type === 'NotApplicable' &&
    newWasteDescription.status !== 'NotStarted' &&
    newWasteDescription.wasteCode?.type !== 'NotApplicable'
  );
}

export function isWasteCodeChangingBulkToBulkDifferentType(
  currentWasteDescription: DraftWasteDescription,
  newWasteDescription: DraftWasteDescription,
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

export function isWasteCodeChangingBulkToBulkSameType(
  currentWasteDescription: DraftWasteDescription,
  newWasteDescription: DraftWasteDescription,
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
