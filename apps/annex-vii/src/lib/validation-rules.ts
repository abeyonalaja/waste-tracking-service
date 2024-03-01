import { WasteCodeType, WasteCode } from '@wts/api/reference-data';
import {
  validation,
  FieldFormatError,
  CustomerReference,
  WasteDescriptionFlattened,
  WasteDescription,
  WasteCodeComponent,
  EwcCodeComponent,
  NationalCodeComponent,
  CustomerReferenceFlattened,
  WasteQuantityFlattened,
  WasteQuantity,
  InvalidAttributeCombinationError,
} from '../model';

export function validateCustomerReferenceSection(
  value: CustomerReferenceFlattened
):
  | { valid: false; value: FieldFormatError }
  | { valid: true; value: CustomerReference } {
  const trimmedReference = value.reference.trim();
  if (!trimmedReference) {
    return {
      valid: false,
      value: {
        field: 'CustomerReference',
        message: validation.ReferenceValidationErrorMessages.empty,
      },
    };
  }

  if (trimmedReference.length === validation.ReferenceChar.min) {
    return {
      valid: false,
      value: {
        field: 'CustomerReference',
        message: validation.ReferenceValidationErrorMessages.charTooFew,
      },
    };
  }

  if (trimmedReference.length > validation.ReferenceChar.max) {
    return {
      valid: false,
      value: {
        field: 'CustomerReference',
        message: validation.ReferenceValidationErrorMessages.charTooMany,
      },
    };
  }

  if (!validation.referenceRegex.test(trimmedReference)) {
    return {
      valid: false,
      value: {
        field: 'CustomerReference',
        message: validation.ReferenceValidationErrorMessages.invalid,
      },
    };
  }
  return { valid: true, value: trimmedReference };
}

export function validateWasteDescriptionSection(
  value: WasteDescriptionFlattened,
  wasteCodeList: WasteCodeType[],
  ewcCodeList: WasteCode[]
):
  | { valid: false; value: FieldFormatError }
  | { valid: true; value: WasteDescription } {
  if (
    !value.baselAnnexIXCode &&
    !value.oecdCode &&
    !value.annexIIIACode &&
    !value.annexIIIBCode &&
    !value.laboratory
  ) {
    return {
      valid: false,
      value: {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.empty,
      },
    };
  }

  if (
    (value.baselAnnexIXCode && value.oecdCode) ||
    (value.baselAnnexIXCode && value.annexIIIACode) ||
    (value.baselAnnexIXCode && value.annexIIIBCode) ||
    (value.oecdCode && value.annexIIIACode) ||
    (value.oecdCode && value.annexIIIBCode) ||
    (value.annexIIIACode && value.annexIIIBCode)
  ) {
    return {
      valid: false,
      value: {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.tooMany,
      },
    };
  }

  if (
    value.laboratory &&
    (value.baselAnnexIXCode ||
      value.oecdCode ||
      value.annexIIIACode ||
      value.annexIIIBCode)
  ) {
    return {
      valid: false,
      value: {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.laboratory,
      },
    };
  }

  let wasteCode: WasteCodeComponent = { type: 'NotApplicable' };
  if (value.baselAnnexIXCode) {
    const filteredWasteCodeList = wasteCodeList
      .filter((c) => c.type === 'BaselAnnexIX')[0]
      .values.filter(
        (v) =>
          v.code === value.baselAnnexIXCode.replace(/\s/g, '').toUpperCase()
      );
    if (filteredWasteCodeList.length !== 1) {
      return {
        valid: false,
        value: {
          field: 'WasteDescription',
          message: validation.BaselAnnexIXCodeValidationErrorMessages.invalid,
        },
      };
    } else {
      wasteCode = {
        type: 'BaselAnnexIX',
        code: filteredWasteCodeList[0].code,
      };
    }
  }

  if (value.oecdCode) {
    const filteredWasteCodeList = wasteCodeList
      .filter((c) => c.type === 'OECD')[0]
      .values.filter(
        (v) => v.code === value.oecdCode.replace(/\s/g, '').toUpperCase()
      );
    if (filteredWasteCodeList.length !== 1) {
      return {
        valid: false,
        value: {
          field: 'WasteDescription',
          message: validation.OECDCodeValidationErrorMessages.invalid,
        },
      };
    } else {
      wasteCode = {
        type: 'OECD',
        code: filteredWasteCodeList[0].code,
      };
    }
  }

  if (value.annexIIIACode) {
    const codeArr = value.annexIIIACode
      .replace(/\s/g, '')
      .toUpperCase()
      .split(';');
    const filteredWasteCodeList = wasteCodeList
      .filter((c) => c.type === 'AnnexIIIA')[0]
      .values.filter((v) => codeArr.every((c) => v.code.includes(c)));
    if (filteredWasteCodeList.length !== 1) {
      return {
        valid: false,
        value: {
          field: 'WasteDescription',
          message: validation.AnnexIIIACodeValidationErrorMessages.invalid,
        },
      };
    } else {
      wasteCode = {
        type: 'AnnexIIIA',
        code: filteredWasteCodeList[0].code,
      };
    }
  }

  if (value.annexIIIBCode) {
    const filteredWasteCodeList = wasteCodeList
      .filter((c) => c.type === 'AnnexIIIB')[0]
      .values.filter(
        (v) => v.code === value.annexIIIBCode.replace(/\s/g, '').toUpperCase()
      );
    if (filteredWasteCodeList.length !== 1) {
      return {
        valid: false,
        value: {
          field: 'WasteDescription',
          message: validation.AnnexIIIBCodeValidationErrorMessages.invalid,
        },
      };
    } else {
      wasteCode = {
        type: 'AnnexIIIB',
        code: filteredWasteCodeList[0].code,
      };
    }
  }

  if (value.laboratory) {
    const laboratory = value.laboratory.replace(/\s/g, '').toLowerCase();
    if (laboratory !== 'yes') {
      return {
        valid: false,
        value: {
          field: 'WasteDescription',
          message: validation.LaboratoryValidationErrorMessages.invalid,
        },
      };
    } else {
      wasteCode = {
        type: 'NotApplicable',
      };
    }
  }

  if (!value.ewcCodes) {
    return {
      valid: false,
      value: {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.empty,
      },
    };
  }

  const ewcCodeArr = value.ewcCodes.replace(/\s/g, '').split(';');
  if (ewcCodeArr.length > validation.EWCCodesLength.max) {
    return {
      valid: false,
      value: {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.tooMany,
      },
    };
  }

  if (
    !ewcCodeArr.every((val) => ewcCodeList.map((v) => v.code).includes(val))
  ) {
    return {
      valid: false,
      value: {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.invalid,
      },
    };
  }

  const ewcCodes: EwcCodeComponent = ewcCodeArr.map((c) => {
    return { code: c };
  });

  let nationalCode: NationalCodeComponent = { provided: 'No' };
  if (value.nationalCode) {
    if (!validation.nationalCodeRegex.test(value.nationalCode)) {
      return {
        valid: false,
        value: {
          field: 'WasteDescription',
          message: validation.NationalCodeValidationErrorMessages.invalid,
        },
      };
    }
    nationalCode = { provided: 'Yes', value: value.nationalCode };
  }

  if (!value.wasteDescription) {
    return {
      valid: false,
      value: {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.empty,
      },
    };
  }

  const trimmedWasteDescription = value.wasteDescription.trim();
  if (trimmedWasteDescription.length < validation.WasteDescriptionChar.min) {
    return {
      valid: false,
      value: {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooFew,
      },
    };
  }

  if (trimmedWasteDescription.length > validation.WasteDescriptionChar.max) {
    return {
      valid: false,
      value: {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooMany,
      },
    };
  }

  return {
    valid: true,
    value: {
      wasteCode: wasteCode,
      ewcCodes: ewcCodes,
      nationalCode: nationalCode,
      description: trimmedWasteDescription,
    },
  };
}

export function validateWasteQuantitySection(
  value: WasteQuantityFlattened
):
  | { valid: false; value: FieldFormatError }
  | { valid: true; value: WasteQuantity } {
  if (
    !value.wasteQuantityTonnes &&
    !value.wasteQuantityCubicMetres &&
    !value.wasteQuantityKilograms
  ) {
    return {
      valid: false,
      value: {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.empty,
      },
    };
  }

  if (
    (value.wasteQuantityTonnes && value.wasteQuantityCubicMetres) ||
    (value.wasteQuantityTonnes && value.wasteQuantityKilograms) ||
    (value.wasteQuantityCubicMetres && value.wasteQuantityKilograms)
  ) {
    return {
      valid: false,
      value: {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.tooMany,
      },
    };
  }

  let wasteQuantityType = '';
  const quantityType = value.estimatedOrActualWasteQuantity
    .replace(/\s/g, '')
    .toLowerCase();
  if (quantityType === 'actual') {
    wasteQuantityType = 'ActualData';
  } else if (quantityType === 'estimate') {
    wasteQuantityType = 'EstimateData';
  } else {
    return {
      valid: false,
      value: {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.missingType,
      },
    };
  }

  let quantity = {};
  if (value.wasteQuantityTonnes) {
    if (!validation.wasteQuantityRegex.test(value.wasteQuantityTonnes)) {
      return {
        valid: false,
        value: {
          field: 'WasteQuantity',
          message: validation.WasteQuantityValidationErrorMessages.invalid,
        },
      };
    }

    const wasteQuantityTonnes = parseFloat(value.wasteQuantityTonnes);
    if (
      !(
        wasteQuantityTonnes > validation.BulkWasteQuantityValue.greaterThan &&
        wasteQuantityTonnes < validation.BulkWasteQuantityValue.lessThan
      )
    ) {
      return {
        valid: false,
        value: {
          field: 'WasteQuantity',
          message: validation.BulkWasteQuantityValidationErrorMessages.invalid,
        },
      };
    }

    quantity = {
      quantityType: 'Weight',
      unit: 'Tonne',
      value: wasteQuantityTonnes,
    };
  }

  if (value.wasteQuantityCubicMetres) {
    if (!validation.wasteQuantityRegex.test(value.wasteQuantityCubicMetres)) {
      return {
        valid: false,
        value: {
          field: 'WasteQuantity',
          message: validation.WasteQuantityValidationErrorMessages.invalid,
        },
      };
    }

    const wasteQuantityCubicMetres = parseFloat(value.wasteQuantityCubicMetres);
    if (
      !(
        wasteQuantityCubicMetres >
          validation.BulkWasteQuantityValue.greaterThan &&
        wasteQuantityCubicMetres < validation.BulkWasteQuantityValue.lessThan
      )
    ) {
      return {
        valid: false,
        value: {
          field: 'WasteQuantity',
          message: validation.BulkWasteQuantityValidationErrorMessages.invalid,
        },
      };
    }

    quantity = {
      quantityType: 'Volume',
      unit: 'Cubic Metre',
      value: wasteQuantityCubicMetres,
    };
  }

  if (value.wasteQuantityKilograms) {
    if (!validation.wasteQuantityRegex.test(value.wasteQuantityKilograms)) {
      return {
        valid: false,
        value: {
          field: 'WasteQuantity',
          message: validation.WasteQuantityValidationErrorMessages.invalid,
        },
      };
    }

    const wasteQuantityKilograms = parseFloat(value.wasteQuantityKilograms);
    if (
      !(
        wasteQuantityKilograms >
          validation.SmallWasteQuantityValue.greaterThan &&
        wasteQuantityKilograms <=
          validation.SmallWasteQuantityValue.lessThanOrEqual
      )
    ) {
      return {
        valid: false,
        value: {
          field: 'WasteQuantity',
          message: validation.SmallWasteQuantityValidationErrorMessages.invalid,
        },
      };
    }

    quantity = {
      quantityType: 'Weight',
      unit: 'Kilogram',
      value: wasteQuantityKilograms,
    };
  }

  return {
    valid: true,
    value: {
      type: wasteQuantityType as 'EstimateData' | 'ActualData',
      estimateData: wasteQuantityType === 'EstimateData' ? quantity : {},
      actualData: wasteQuantityType === 'ActualData' ? quantity : {},
    },
  };
}

export function validateWasteDescriptionAndQuantityCrossSection(
  wasteDescription: WasteDescription,
  wasteQuantity: WasteQuantity
): { valid: false; value: InvalidAttributeCombinationError } | { valid: true } {
  if (
    wasteDescription.wasteCode.type !== 'NotApplicable' &&
    wasteQuantity.type !== 'NotApplicable' &&
    (wasteQuantity.actualData.unit === 'Kilogram' ||
      wasteQuantity.estimateData.unit === 'Kilogram')
  ) {
    return {
      valid: false,
      value: {
        fields: ['WasteDescription', 'WasteQuantity'],
        message: validation.WasteQuantityValidationErrorMessages.laboratory,
      },
    };
  }
  return { valid: true };
}
