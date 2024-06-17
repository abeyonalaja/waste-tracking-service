import { v4 as uuidv4 } from 'uuid';
import {
  draft,
  submission,
  validation,
} from '@wts/api/green-list-waste-export';
import {
  DraftSubmission,
  SubmissionConfirmation,
  SubmissionDeclaration,
  Template,
} from '@wts/api/waste-tracking-gateway';
import { SubmissionWithAccount, TemplateWithAccount } from '../db';

export function setSubmissionConfirmation(
  submission: DraftSubmission,
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
        key === 'accountId' || (value.status && value.status === 'Complete'),
    )
  ) {
    return { status: 'NotStarted' };
  } else {
    return { status: 'CannotStart' };
  }
}

export function setSubmissionDeclaration(
  submission: DraftSubmission,
): SubmissionDeclaration {
  if (submission.submissionConfirmation.status === 'Complete') {
    return { status: 'NotStarted' };
  } else {
    return { status: 'CannotStart' };
  }
}

export function setWasteQuantityUnit(
  wasteQuantity: submission.WasteQuantity,
  submission: submission.Submission,
): void {
  if (submission.wasteDescription.wasteCode.type === 'NotApplicable') {
    if (wasteQuantity.type === 'ActualData') {
      if (wasteQuantity.actualData?.quantityType === 'Volume') {
        wasteQuantity.actualData.unit = 'Litre';
      } else if (wasteQuantity.actualData?.quantityType === 'Weight') {
        wasteQuantity.actualData.unit = 'Kilogram';
      }
    } else if (wasteQuantity.type === 'EstimateData') {
      if (wasteQuantity.estimateData?.quantityType === 'Volume') {
        wasteQuantity.estimateData.unit = 'Litre';
      } else if (wasteQuantity.estimateData?.quantityType === 'Weight') {
        wasteQuantity.estimateData.unit = 'Kilogram';
      }
    }
  } else {
    if (wasteQuantity.type === 'ActualData') {
      if (wasteQuantity.actualData?.quantityType === 'Volume') {
        wasteQuantity.actualData.unit = 'Cubic Metre';
      } else if (wasteQuantity.actualData?.quantityType === 'Weight') {
        wasteQuantity.actualData.unit = 'Tonne';
      }
    } else if (wasteQuantity.type === 'EstimateData') {
      if (wasteQuantity.estimateData?.quantityType === 'Volume') {
        wasteQuantity.estimateData.unit = 'Cubic Metre';
      } else if (wasteQuantity.estimateData?.quantityType === 'Weight') {
        wasteQuantity.estimateData.unit = 'Tonne';
      }
    }
  }
}

export function setDraftWasteQuantityUnit(
  wasteQuantity: draft.DraftWasteQuantity,
  submission: draft.DraftSubmission,
): void {
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

export function isCollectionDateValid(
  date: draft.DraftSubmission['collectionDate'],
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
  draft: draft.DraftSubmission,
): draft.DraftSubmission['submissionConfirmation'] {
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
  draft: draft.DraftSubmission,
): draft.DraftSubmission['submissionDeclaration'] {
  if (draft.submissionConfirmation.status === 'Complete') {
    return { status: 'NotStarted' };
  } else {
    return { status: 'CannotStart' };
  }
}

export function isSmallWaste(
  wasteDescription: draft.DraftWasteDescription,
): boolean {
  return (
    wasteDescription.status === 'Complete' &&
    wasteDescription.wasteCode.type === 'NotApplicable'
  );
}

export function copyCarriersNoTransport(
  sourceCarriers: draft.DraftCarriers,
  isSmallWaste: boolean,
): draft.DraftCarriers {
  let targetCarriers: draft.DraftCarriers = {
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
        values: carriers as draft.DraftCarrier[],
      };
    } else {
      targetCarriers = {
        status: status,
        transport: true,
        values: carriers as draft.DraftCarrierPartial[],
      };
    }
  }

  return targetCarriers;
}

export function copyRecoveryFacilities(
  sourceFacilities: draft.DraftRecoveryFacilityDetails,
): draft.DraftRecoveryFacilityDetails {
  let targetFacilities: draft.DraftRecoveryFacilityDetails = {
    status: 'NotStarted',
  };

  if (
    sourceFacilities.status === 'Started' ||
    sourceFacilities.status === 'Complete'
  ) {
    const facilities = sourceFacilities.values.map((r) => {
      return {
        id: uuidv4(),
        addressDetails: r.addressDetails,
        contactDetails: r.contactDetails,
        recoveryFacilityType: r.recoveryFacilityType,
      };
    });

    if (sourceFacilities.status === 'Complete') {
      targetFacilities = {
        status: sourceFacilities.status,
        values: facilities as draft.DraftRecoveryFacility[],
      };
    } else {
      targetFacilities = {
        status: sourceFacilities.status,
        values: facilities as draft.DraftRecoveryFacilityPartial[],
      };
    }
  } else {
    targetFacilities = {
      status: sourceFacilities.status,
    };
  }

  return targetFacilities;
}

export function setBaseWasteDescription(
  draftWasteDescription: draft.DraftWasteDescription,
  draftCarriers: draft.DraftCarriers,
  draftRecoveryFacilityDetail: draft.DraftRecoveryFacilityDetails,
  value: draft.DraftWasteDescription,
): {
  wasteDescription: draft.DraftWasteDescription;
  carriers: draft.DraftCarriers;
  recoveryFacilityDetail: draft.DraftRecoveryFacilityDetails;
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

export function createBaseCarriers(
  draftCarriers: draft.DraftCarriers,
  value: Omit<draft.DraftCarriers, 'transport' | 'values'>,
): { newCarrierId: string; carriers: draft.DraftCarriers } {
  const uuid = uuidv4();

  if (draftCarriers.status === 'NotStarted') {
    return {
      newCarrierId: uuid,
      carriers: {
        status: value.status as 'Started',
        transport: draftCarriers.transport,
        values: [{ id: uuid }],
      },
    };
  }

  const carriers: draft.DraftCarrierPartial[] = [];
  for (const c of draftCarriers.values) {
    carriers.push(c);
  }
  carriers.push({ id: uuid });

  return {
    newCarrierId: uuid,
    carriers: {
      status: value.status as 'Started',
      transport: draftCarriers.transport,
      values: carriers,
    },
  };
}

export function setBaseCarriers(
  carriers: draft.DraftCarriers,
  value: draft.DraftCarriers,
  carrier: draft.DraftCarrier | draft.DraftCarrierPartial,
  index: number,
): draft.DraftCarriers {
  if (
    carriers !== undefined &&
    carriers.status !== 'NotStarted' &&
    value.status !== 'NotStarted'
  ) {
    carriers.status = value.status;
    carriers.values[index] = carrier;
  }
  return carriers;
}

export function getCarrierTransport(
  wasteDescription: draft.DraftWasteDescription,
): boolean {
  return wasteDescription.status !== 'NotStarted' &&
    wasteDescription.wasteCode?.type === 'NotApplicable'
    ? false
    : true;
}

export function deleteBaseCarriers(
  carriers: draft.DraftCarriers,
  carrierId: string,
): draft.DraftCarriers {
  if (carriers.status !== 'NotStarted') {
    const index = carriers.values.findIndex((c) => {
      return c.id === carrierId;
    });
    carriers.values.splice(index, 1);

    if (carriers.values.length === 0) {
      carriers = {
        status: 'NotStarted',
        transport: carriers.transport,
      };
    }
  }
  return carriers;
}

export function createBaseRecoveryFacilityDetail(
  recoveryFacilityDetail: draft.DraftRecoveryFacilityDetails,
  value: Omit<draft.DraftRecoveryFacilityDetails, 'values'>,
): {
  newRecoveryFacilityDetailId: string;
  recoveryFacilityDetails: draft.DraftRecoveryFacilityDetails;
} {
  const uuid = uuidv4();
  if (
    recoveryFacilityDetail.status !== 'Started' &&
    recoveryFacilityDetail.status !== 'Complete'
  ) {
    return {
      newRecoveryFacilityDetailId: uuid,
      recoveryFacilityDetails: {
        status: value.status as 'Started',
        values: [{ id: uuid }],
      },
    };
  }

  const facilities: draft.DraftRecoveryFacilityPartial[] = [];
  for (const rf of recoveryFacilityDetail.values) {
    facilities.push(rf);
  }
  facilities.push({ id: uuid });

  return {
    newRecoveryFacilityDetailId: uuid,
    recoveryFacilityDetails: {
      status: value.status as 'Started',
      values: facilities,
    },
  };
}

export function setBaseRecoveryFacilityDetail(
  recoveryFacilityDetail: draft.DraftRecoveryFacilityDetails,
  rfdId: string,
  value: draft.DraftRecoveryFacilityDetails,
): draft.DraftRecoveryFacilityDetails {
  if (recoveryFacilityDetail !== undefined) {
    if (
      recoveryFacilityDetail.status === 'Started' ||
      recoveryFacilityDetail.status === 'Complete'
    ) {
      if (value.status !== 'Started' && value.status !== 'Complete') {
        recoveryFacilityDetail = value;
        return recoveryFacilityDetail;
      }

      const recoveryFacility = value.values.find((rf) => {
        return rf.id === rfdId;
      });

      const index = recoveryFacilityDetail.values.findIndex((rf) => {
        return rf.id === rfdId;
      });
      recoveryFacilityDetail.status = value.status;
      recoveryFacilityDetail.values[index] =
        recoveryFacility as draft.DraftRecoveryFacility;
    }
  }

  return recoveryFacilityDetail;
}

export function deleteBaseRecoveryFacilityDetail(
  recoveryFacilityDetail: draft.DraftRecoveryFacilityDetails,
  rfdId: string,
): draft.DraftRecoveryFacilityDetails {
  if (
    recoveryFacilityDetail.status === 'Started' ||
    recoveryFacilityDetail.status === 'Complete'
  ) {
    const index = recoveryFacilityDetail.values.findIndex((rf) => {
      return rf.id === rfdId;
    });

    if (index !== -1) {
      recoveryFacilityDetail.values.splice(index, 1);
      if (recoveryFacilityDetail.values.length === 0) {
        recoveryFacilityDetail = { status: 'NotStarted' };
      }
    }
  }

  return recoveryFacilityDetail;
}

export function isWasteCodeChangingBulkToSmall(
  currentWasteDescription: draft.DraftWasteDescription,
  newWasteDescription: draft.DraftWasteDescription,
): boolean {
  return (
    currentWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type !== 'NotApplicable' &&
    newWasteDescription.status !== 'NotStarted' &&
    newWasteDescription.wasteCode?.type === 'NotApplicable'
  );
}

export function isWasteCodeChangingSmallToBulk(
  currentWasteDescription: draft.DraftWasteDescription,
  newWasteDescription: draft.DraftWasteDescription,
): boolean {
  return (
    currentWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type === 'NotApplicable' &&
    newWasteDescription.status !== 'NotStarted' &&
    newWasteDescription.wasteCode?.type !== 'NotApplicable'
  );
}

export function isWasteCodeChangingBulkToBulkDifferentType(
  currentWasteDescription: draft.DraftWasteDescription,
  newWasteDescription: draft.DraftWasteDescription,
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
  currentWasteDescription: draft.DraftWasteDescription,
  newWasteDescription: draft.DraftWasteDescription,
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

export function isTemplateNameValid(name: string): boolean {
  let valid = true;
  if (
    !name ||
    name.length < validation.TemplateNameChar.min ||
    name.length > validation.TemplateNameChar.max ||
    !validation.templateNameRegex.test(name)
  ) {
    valid = false;
  }

  return valid;
}

export function getSubmissionData(
  accountId: string,
  data: draft.DraftSubmission,
): SubmissionWithAccount {
  if (
    data.wasteDescription.status === 'Complete' &&
    data.wasteQuantity.status === 'Complete' &&
    data.wasteQuantity.value.type !== 'NotApplicable' &&
    data.exporterDetail.status === 'Complete' &&
    data.importerDetail.status === 'Complete' &&
    data.collectionDate.status === 'Complete' &&
    data.carriers.status === 'Complete' &&
    data.collectionDetail.status === 'Complete' &&
    data.ukExitLocation.status === 'Complete' &&
    data.transitCountries.status === 'Complete' &&
    data.recoveryFacilityDetail.status === 'Complete' &&
    data.submissionDeclaration.status === 'Complete' &&
    (data.submissionState.status === 'SubmittedWithActuals' ||
      data.submissionState.status === 'SubmittedWithEstimates' ||
      data.submissionState.status === 'UpdatedWithActuals')
  ) {
    const submission: SubmissionWithAccount = {
      accountId: accountId,
      id: data.id,
      reference: data.reference,
      wasteDescription: {
        wasteCode: data.wasteDescription.wasteCode,
        ewcCodes: data.wasteDescription.ewcCodes,
        nationalCode: data.wasteDescription.nationalCode,
        description: data.wasteDescription.description,
      },
      wasteQuantity: data.wasteQuantity.value,
      exporterDetail: {
        exporterAddress: data.exporterDetail.exporterAddress,
        exporterContactDetails: data.exporterDetail.exporterContactDetails,
      },
      importerDetail: {
        importerAddressDetails: data.importerDetail.importerAddressDetails,
        importerContactDetails: data.importerDetail.importerContactDetails,
      },
      collectionDate: data.collectionDate.value,
      carriers: data.carriers.values.map((c) => {
        return {
          addressDetails: c.addressDetails,
          contactDetails: c.contactDetails,
          transportDetails: c.transportDetails,
        };
      }),
      collectionDetail: {
        address: data.collectionDetail.address,
        contactDetails: data.collectionDetail.contactDetails,
      },
      ukExitLocation: data.ukExitLocation.exitLocation,
      transitCountries: data.transitCountries.values,
      recoveryFacilityDetail: data.recoveryFacilityDetail.values.map((rf) => {
        return {
          addressDetails: rf.addressDetails,
          contactDetails: rf.contactDetails,
          recoveryFacilityType: rf.recoveryFacilityType,
        };
      }),
      submissionDeclaration: data.submissionDeclaration.values,
      submissionState: {
        status: data.submissionState.status,
        timestamp: data.submissionState.timestamp,
      },
    };
    return submission;
  } else {
    return null as unknown as SubmissionWithAccount;
  }
}

export function paginateArray<T>(
  array: T[],
  pageSize: number,
  pageNumber: number,
): T[] {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

export function doesTemplateAlreadyExist(
  values: TemplateWithAccount[],
  accountId: string,
  templateName: string,
): boolean {
  let exists = false;
  const templates: Template[] = values.filter(
    (template) => template.accountId === accountId,
  );

  templates.map((template) => {
    if (template.templateDetails.name === templateName) {
      exists = true;
      return;
    }
  });
  return exists;
}
