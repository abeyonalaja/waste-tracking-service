import { v4 as uuidv4 } from 'uuid';
import {
  DraftCarrier,
  DraftCarriers,
  DraftSubmission,
  DraftWasteDescription,
  DraftWasteQuantity,
  DraftRecoveryFacility,
  Submission,
  validation,
  DraftCarrierPartial,
  DraftRecoveryFacilityDetails,
  DraftRecoveryFacilityPartial,
  WasteQuantity,
} from '../model';
export function setWasteQuantityUnit(
  wasteQuantity: WasteQuantity,
  submission: Submission,
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
  wasteQuantity: DraftWasteQuantity,
  submission: DraftSubmission,
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

export function isSmallWaste(wasteDescription: DraftWasteDescription): boolean {
  return (
    wasteDescription.status === 'Complete' &&
    wasteDescription.wasteCode.type === 'NotApplicable'
  );
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

export function copyRecoveryFacilities(
  sourceFacilities: DraftRecoveryFacilityDetails,
): DraftRecoveryFacilityDetails {
  let targetFacilities: DraftRecoveryFacilityDetails = {
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
        values: facilities as DraftRecoveryFacility[],
      };
    } else {
      targetFacilities = {
        status: sourceFacilities.status,
        values: facilities as DraftRecoveryFacilityPartial[],
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

export function createBaseCarriers(
  carrier: DraftCarriers,
  value: Omit<DraftCarriers, 'transport' | 'values'>,
): DraftCarriers {
  const uuid = uuidv4();

  if (carrier.status === 'NotStarted') {
    carrier = {
      status: value.status as 'Started',
      transport: carrier.transport,
      values: [{ id: uuid }],
    };

    return carrier;
  }

  const carriers: DraftCarrierPartial[] = [];
  for (const c of carrier.values) {
    carriers.push(c);
  }
  carriers.push({ id: uuid });
  carrier = {
    status: value.status as 'Started',
    transport: carrier.transport,
    values: carriers,
  };

  return carrier;
}

export function setBaseCarriers(
  carriers: DraftCarriers,
  value: DraftCarriers,
  carrier: DraftCarrier | DraftCarrierPartial,
  index: number,
): DraftCarriers {
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

export function updateCarrierTransport(
  wasteDescription: DraftWasteDescription,
  carriers: DraftCarriers,
): DraftCarriers {
  if (carriers.status !== 'NotStarted') {
    if (carriers.values.length === 0) {
      const transport: DraftCarriers['transport'] =
        wasteDescription.status !== 'NotStarted' &&
        wasteDescription.wasteCode?.type === 'NotApplicable'
          ? false
          : true;

      return {
        status: 'NotStarted',
        transport: transport,
      };
    }
  }
  return carriers;
}

export function deleteBaseCarriers(
  carriers: DraftCarriers,
  carrierId: string,
): DraftCarriers {
  if (carriers.status !== 'NotStarted') {
    const index = carriers.values.findIndex((c) => {
      return c.id === carrierId;
    });
    carriers.values.splice(index, 1);
  }
  return carriers;
}

export function createBaseRecoveryFacilityDetail(
  recoveryFacilityDetail: DraftRecoveryFacilityDetails,
  value: Omit<DraftRecoveryFacilityDetails, 'values'>,
): DraftRecoveryFacilityDetails {
  if (
    recoveryFacilityDetail.status !== 'Started' &&
    recoveryFacilityDetail.status !== 'Complete'
  ) {
    recoveryFacilityDetail = {
      status: value.status as 'Started',
      values: [{ id: uuidv4() }],
    };
    return recoveryFacilityDetail;
  }

  const facilities: DraftRecoveryFacilityPartial[] = [];
  for (const rf of recoveryFacilityDetail.values) {
    facilities.push(rf);
  }
  facilities.push({ id: recoveryFacilityDetail.values[0].id });
  recoveryFacilityDetail = {
    status: value.status as 'Started',
    values: facilities,
  };

  return recoveryFacilityDetail;
}

export function setBaseRecoveryFacilityDetail(
  recoveryFacilityDetail: DraftRecoveryFacilityDetails,
  rfdId: string,
  value: DraftRecoveryFacilityDetails,
): DraftRecoveryFacilityDetails {
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
        recoveryFacility as DraftRecoveryFacility;
    }
  }

  return recoveryFacilityDetail;
}

export function deleteBaseRecoveryFacilityDetail(
  recoveryFacilityDetails: DraftRecoveryFacilityDetails,
  rfdId: string,
): DraftRecoveryFacilityDetails {
  if (
    recoveryFacilityDetails.status === 'Started' ||
    recoveryFacilityDetails.status === 'Complete'
  ) {
    const index = recoveryFacilityDetails.values.findIndex((rf) => {
      return rf.id === rfdId;
    });

    if (index !== -1) {
      recoveryFacilityDetails.values.splice(index, 1);
      if (recoveryFacilityDetails.values.length === 0) {
        recoveryFacilityDetails = { status: 'NotStarted' };
      }
    }
  }

  return recoveryFacilityDetails;
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
      newWasteDescription.wasteCode?.type
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

export function getSubmissionData(data: DraftSubmission): Submission {
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
    const submission: Submission = {
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
    return null as unknown as Submission;
  }
}
