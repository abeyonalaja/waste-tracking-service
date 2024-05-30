import { v4 as uuidv4 } from 'uuid';
import {
  DraftCarrier,
  DraftCarriers,
  DraftCollectionDetail,
  DraftUkExitLocation,
  DraftExporterDetail,
  DraftImporterDetail,
  DraftSubmission,
  DraftTransitCountries,
  DraftWasteDescription,
  DraftWasteQuantity,
  DraftRecoveryFacility,
  Submission,
  SubmissionBase,
  validation,
  DraftCarrierPartial,
  DraftRecoveryFacilityDetails,
  DraftRecoveryFacilityPartial,
  WasteQuantity,
} from '../model';

export interface SubmissionBasePlusId {
  submissionBase: SubmissionBase;
  id: string;
}

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
  submissionBase: SubmissionBase,
  value: DraftWasteDescription,
): SubmissionBase {
  let recoveryFacilityDetail: SubmissionBase['recoveryFacilityDetail'] =
    submissionBase.recoveryFacilityDetail.status === 'CannotStart' &&
    value.status !== 'NotStarted' &&
    value.wasteCode !== undefined
      ? { status: 'NotStarted' }
      : submissionBase.recoveryFacilityDetail;

  let carriers: SubmissionBase['carriers'] = submissionBase.carriers;

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
      value,
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
      value,
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

  submissionBase.wasteDescription = value;
  submissionBase.carriers = carriers;
  submissionBase.recoveryFacilityDetail = recoveryFacilityDetail;

  return submissionBase;
}

export function setBaseExporterDetail(
  submissionBase: SubmissionBase,
  value: DraftExporterDetail,
): SubmissionBase {
  submissionBase.exporterDetail = value;

  return submissionBase;
}

export function setBaseImporterDetail(
  submissionBase: SubmissionBase,
  value: DraftImporterDetail,
): SubmissionBase {
  submissionBase.importerDetail = value;

  return submissionBase;
}

export function createBaseCarriers(
  submissionBase: SubmissionBase,
  value: Omit<DraftCarriers, 'transport' | 'values'>,
): SubmissionBasePlusId {
  const submissionBasePlusId = {
    submissionBase: submissionBase,
    id: uuidv4(),
  };
  const transport: DraftCarriers['transport'] =
    submissionBase.wasteDescription.status !== 'NotStarted' &&
    submissionBase.wasteDescription.wasteCode?.type === 'NotApplicable'
      ? false
      : true;

  if (submissionBase.carriers.status === 'NotStarted') {
    submissionBasePlusId.submissionBase.carriers = {
      status: value.status as 'Started',
      transport: transport,
      values: [{ id: submissionBasePlusId.id }],
    };

    return submissionBasePlusId;
  }

  const carriers: DraftCarrierPartial[] = [];
  for (const c of submissionBase.carriers.values) {
    carriers.push(c);
  }
  carriers.push({ id: submissionBasePlusId.id });
  submissionBasePlusId.submissionBase.carriers = {
    status: value.status as 'Started',
    transport: transport,
    values: carriers,
  };

  return submissionBasePlusId;
}

export function setBaseNoCarriers(
  submissionBase: SubmissionBase,
  carrierId: string,
  value: DraftCarriers,
): SubmissionBase {
  if (value.status === 'NotStarted') {
    submissionBase.carriers = value;

    return submissionBase;
  }

  return submissionBase;
}

export function setBaseCarriers(
  submissionBase: SubmissionBase,
  carrierId: string,
  value: DraftCarriers,
  carrier: DraftCarrier | DraftCarrierPartial,
  index: number,
): SubmissionBase {
  if (
    submissionBase !== undefined &&
    submissionBase.carriers.status !== 'NotStarted' &&
    value.status !== 'NotStarted'
  ) {
    submissionBase.carriers.status = value.status;
    submissionBase.carriers.values[index] = carrier;
  }
  return submissionBase;
}

export function deleteBaseCarriers(
  submissionBase: SubmissionBase,
  carrierId: string,
): SubmissionBase {
  if (submissionBase.carriers.status !== 'NotStarted') {
    const index = submissionBase.carriers.values.findIndex((c) => {
      return c.id === carrierId;
    });

    submissionBase.carriers.values.splice(index, 1);
    if (submissionBase.carriers.values.length === 0) {
      const transport: DraftCarriers['transport'] =
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

export function setBaseCollectionDetail(
  submissionBase: SubmissionBase,
  value: DraftCollectionDetail,
): SubmissionBase {
  submissionBase.collectionDetail = value;

  return submissionBase;
}

export function setBaseExitLocation(
  submissionBase: SubmissionBase,
  value: DraftUkExitLocation,
): SubmissionBase {
  submissionBase.ukExitLocation = value;

  return submissionBase;
}

export function setBaseTransitCountries(
  submissionBase: SubmissionBase,
  value: DraftTransitCountries,
): SubmissionBase {
  submissionBase.transitCountries = value;

  return submissionBase;
}

export function createBaseRecoveryFacilityDetail(
  submissionBase: SubmissionBase,
  value: Omit<DraftRecoveryFacilityDetails, 'values'>,
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
      status: value.status as 'Started',
      values: [{ id: submissionBasePlusId.id }],
    };

    return submissionBasePlusId;
  }

  const facilities: DraftRecoveryFacilityPartial[] = [];
  for (const rf of submissionBase.recoveryFacilityDetail.values) {
    facilities.push(rf);
  }
  facilities.push({ id: submissionBasePlusId.id });
  submissionBasePlusId.submissionBase.recoveryFacilityDetail = {
    status: value.status as 'Started',
    values: facilities,
  };

  return submissionBasePlusId;
}

export function setBaseRecoveryFacilityDetail(
  submissionBase: SubmissionBase,
  rfdId: string,
  value: DraftRecoveryFacilityDetails,
): SubmissionBase {
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
        },
      );
      submissionBase.recoveryFacilityDetail.status = value.status;
      submissionBase.recoveryFacilityDetail.values[index] =
        recoveryFacility as DraftRecoveryFacility;
    }
  }

  return submissionBase;
}

export function deleteBaseRecoveryFacilityDetail(
  submissionBase: SubmissionBase,
  rfdId: string,
): SubmissionBase {
  if (
    submissionBase.recoveryFacilityDetail.status === 'Started' ||
    submissionBase.recoveryFacilityDetail.status === 'Complete'
  ) {
    const index = submissionBase.recoveryFacilityDetail.values.findIndex(
      (rf) => {
        return rf.id === rfdId;
      },
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
