import { isPast, isValid } from 'date-fns';
import {
  WasteCodeType,
  WasteCode,
  Country,
  RecoveryCode,
} from '@wts/api/reference-data';
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
  ExporterDetailFlattened,
  ExporterDetail,
  ImporterDetailFlattened,
  ImporterDetail,
  CollectionDateFlattened,
  CollectionDate,
  CarriersFlattened,
  CarrierData,
  CollectionDetail,
  CollectionDetailFlattened,
  ExitLocationFlattened,
  ExitLocation,
  TransitCountries,
  TransitCountriesFlattened,
  RecoveryFacilityData,
  RecoveryFacilityDetailFlattened,
} from '../model';

function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map(function (s) {
      return s.replace(s[0], s[0].toUpperCase());
    })
    .join(' ');
}

const fourNationsCountries = [
  'England',
  'Scotland',
  'Wales',
  'Northern Ireland',
];

const carrierMeansOfTransport = [
  'Road',
  'Rail',
  'Sea',
  'Air',
  'InlandWaterways',
];

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
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: WasteDescription } {
  const errors: FieldFormatError[] = [];
  let wasteCode: WasteCodeComponent = { type: 'NotApplicable' };
  if (
    !value.baselAnnexIXCode &&
    !value.oecdCode &&
    !value.annexIIIACode &&
    !value.annexIIIBCode &&
    !value.laboratory
  ) {
    errors.push({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.empty,
    });
  } else if (
    (value.baselAnnexIXCode && value.oecdCode) ||
    (value.baselAnnexIXCode && value.annexIIIACode) ||
    (value.baselAnnexIXCode && value.annexIIIBCode) ||
    (value.oecdCode && value.annexIIIACode) ||
    (value.oecdCode && value.annexIIIBCode) ||
    (value.annexIIIACode && value.annexIIIBCode)
  ) {
    errors.push({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.tooMany,
    });
  } else if (
    value.laboratory &&
    (value.baselAnnexIXCode ||
      value.oecdCode ||
      value.annexIIIACode ||
      value.annexIIIBCode)
  ) {
    errors.push({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.laboratory,
    });
  } else {
    if (value.baselAnnexIXCode) {
      const filteredWasteCodeList = wasteCodeList
        .filter((c) => c.type === 'BaselAnnexIX')[0]
        .values.filter(
          (v) =>
            v.code === value.baselAnnexIXCode.replace(/\s/g, '').toUpperCase()
        );
      if (filteredWasteCodeList.length !== 1) {
        errors.push({
          field: 'WasteDescription',
          message: validation.BaselAnnexIXCodeValidationErrorMessages.invalid,
        });
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
        errors.push({
          field: 'WasteDescription',
          message: validation.OECDCodeValidationErrorMessages.invalid,
        });
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
        errors.push({
          field: 'WasteDescription',
          message: validation.AnnexIIIACodeValidationErrorMessages.invalid,
        });
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
        errors.push({
          field: 'WasteDescription',
          message: validation.AnnexIIIBCodeValidationErrorMessages.invalid,
        });
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
        errors.push({
          field: 'WasteDescription',
          message: validation.UnlistedValidationErrorMessages.invalid,
        });
      } else {
        wasteCode = {
          type: 'NotApplicable',
        };
      }
    }
  }

  let ewcCodes: EwcCodeComponent = [];
  if (!value.ewcCodes) {
    errors.push({
      field: 'WasteDescription',
      message: validation.EWCCodeErrorMessages.empty,
    });
  } else {
    const ewcCodeArr = value.ewcCodes
      .replace(/'/g, '')
      .replace(/\s/g, '')
      .split(';');
    if (ewcCodeArr.length > validation.EWCCodesLength.max) {
      errors.push({
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.tooMany,
      });
    } else if (
      !ewcCodeArr.every((val) => ewcCodeList.map((v) => v.code).includes(val))
    ) {
      errors.push({
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.invalid,
      });
    } else {
      ewcCodes = ewcCodeArr.map((c) => {
        return { code: c };
      });
    }
  }

  let nationalCode: NationalCodeComponent = { provided: 'No' };
  if (value.nationalCode) {
    if (!validation.nationalCodeRegex.test(value.nationalCode)) {
      errors.push({
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      });
    }
    nationalCode = { provided: 'Yes', value: value.nationalCode };
  }
  if (!value.wasteDescription) {
    errors.push({
      field: 'WasteDescription',
      message: validation.WasteDescriptionValidationErrorMessages.empty,
    });
  } else {
    value.wasteDescription = value.wasteDescription.trim();
    if (value.wasteDescription.length < validation.WasteDescriptionChar.min) {
      errors.push({
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooFew,
      });
    }

    if (value.wasteDescription.length > validation.WasteDescriptionChar.max) {
      errors.push({
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooMany,
      });
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      value: errors,
    };
  } else {
    return {
      valid: true,
      value: {
        wasteCode: wasteCode,
        ewcCodes: ewcCodes,
        nationalCode: nationalCode,
        description: value.wasteDescription,
      },
    };
  }
}

export function validateWasteQuantitySection(
  value: WasteQuantityFlattened
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: WasteQuantity } {
  const errors: FieldFormatError[] = [];
  let quantity = {};
  if (
    !value.wasteQuantityTonnes &&
    !value.wasteQuantityCubicMetres &&
    !value.wasteQuantityKilograms
  ) {
    errors.push({
      field: 'WasteQuantity',
      message: validation.WasteQuantityValidationErrorMessages.empty,
    });
  } else if (
    (value.wasteQuantityTonnes && value.wasteQuantityCubicMetres) ||
    (value.wasteQuantityTonnes && value.wasteQuantityKilograms) ||
    (value.wasteQuantityCubicMetres && value.wasteQuantityKilograms)
  ) {
    errors.push({
      field: 'WasteQuantity',
      message: validation.WasteQuantityValidationErrorMessages.tooMany,
    });
  } else {
    if (value.wasteQuantityTonnes) {
      if (!validation.wasteQuantityRegex.test(value.wasteQuantityTonnes)) {
        errors.push({
          field: 'WasteQuantity',
          message: validation.WasteQuantityValidationErrorMessages.invalid,
        });
      } else {
        const wasteQuantityTonnes = Number(
          parseFloat(value.wasteQuantityTonnes).toFixed(2)
        );
        if (
          !(
            wasteQuantityTonnes >
              validation.BulkWasteQuantityValue.greaterThan &&
            wasteQuantityTonnes < validation.BulkWasteQuantityValue.lessThan
          )
        ) {
          errors.push({
            field: 'WasteQuantity',
            message:
              validation.BulkWasteQuantityValidationErrorMessages.invalid,
          });
        }

        quantity = {
          quantityType: 'Weight',
          unit: 'Tonne',
          value: wasteQuantityTonnes,
        };
      }
    }

    if (value.wasteQuantityCubicMetres) {
      if (!validation.wasteQuantityRegex.test(value.wasteQuantityCubicMetres)) {
        errors.push({
          field: 'WasteQuantity',
          message: validation.WasteQuantityValidationErrorMessages.invalid,
        });
      } else {
        const wasteQuantityCubicMetres = Number(
          parseFloat(value.wasteQuantityCubicMetres).toFixed(2)
        );
        if (
          !(
            wasteQuantityCubicMetres >
              validation.BulkWasteQuantityValue.greaterThan &&
            wasteQuantityCubicMetres <
              validation.BulkWasteQuantityValue.lessThan
          )
        ) {
          errors.push({
            field: 'WasteQuantity',
            message:
              validation.BulkWasteQuantityValidationErrorMessages.invalid,
          });
        }

        quantity = {
          quantityType: 'Volume',
          unit: 'Cubic Metre',
          value: wasteQuantityCubicMetres,
        };
      }
    }

    if (value.wasteQuantityKilograms) {
      if (!validation.wasteQuantityRegex.test(value.wasteQuantityKilograms)) {
        errors.push({
          field: 'WasteQuantity',
          message: validation.WasteQuantityValidationErrorMessages.invalid,
        });
      } else {
        const wasteQuantityKilograms = Number(
          parseFloat(value.wasteQuantityKilograms).toFixed(2)
        );
        if (
          !(
            wasteQuantityKilograms >
              validation.SmallWasteQuantityValue.greaterThan &&
            wasteQuantityKilograms <=
              validation.SmallWasteQuantityValue.lessThanOrEqual
          )
        ) {
          errors.push({
            field: 'WasteQuantity',
            message:
              validation.SmallWasteQuantityValidationErrorMessages.invalid,
          });
        }

        quantity = {
          quantityType: 'Weight',
          unit: 'Kilogram',
          value: wasteQuantityKilograms,
        };
      }
    }
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
    errors.push({
      field: 'WasteQuantity',
      message: validation.WasteQuantityValidationErrorMessages.missingType,
    });
  }
  if (errors.length > 0) {
    return {
      valid: false,
      value: errors,
    };
  } else {
    return {
      valid: true,
      value: {
        type: wasteQuantityType as 'EstimateData' | 'ActualData',
        estimateData: wasteQuantityType === 'EstimateData' ? quantity : {},
        actualData: wasteQuantityType === 'ActualData' ? quantity : {},
      },
    };
  }
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
  if (
    wasteDescription.wasteCode.type === 'NotApplicable' &&
    (wasteQuantity.type === 'EstimateData' ||
      wasteQuantity.type === 'ActualData') &&
    (wasteQuantity.estimateData?.unit === 'Cubic Metre' ||
      wasteQuantity.actualData?.unit === 'Cubic Metre')
  ) {
    return {
      valid: false,
      value: {
        fields: ['WasteDescription', 'WasteQuantity'],
        message: validation.WasteQuantityValidationErrorMessages.smallNonKg,
      },
    };
  }
  if (
    wasteDescription.wasteCode.type === 'NotApplicable' &&
    (wasteQuantity.type === 'EstimateData' ||
      wasteQuantity.type === 'ActualData') &&
    (wasteQuantity.estimateData?.unit === 'Tonne' ||
      wasteQuantity.actualData?.unit === 'Tonne')
  ) {
    return {
      valid: false,
      value: {
        fields: ['WasteDescription', 'WasteQuantity'],
        message: validation.WasteQuantityValidationErrorMessages.smallNonKg,
      },
    };
  }
  return { valid: true };
}

export function validateExporterDetailSection(
  value: ExporterDetailFlattened
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: ExporterDetail } {
  const errors: FieldFormatError[] = [];
  if (
    !value.exporterOrganisationName ||
    !value.exporterOrganisationName.trim()
  ) {
    errors.push({
      field: 'ExporterDetail',
      message:
        validation.ExporterDetailValidationErrorMessages.emptyOrganisationName,
    });
  } else {
    if (value.exporterOrganisationName.length > validation.FreeTextChar.max) {
      errors.push({
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages
            .charTooManyOrganisationName,
      });
    }
  }

  if (!value.exporterAddressLine1 || !value.exporterAddressLine1.trim()) {
    errors.push({
      field: 'ExporterDetail',
      message:
        validation.ExporterDetailValidationErrorMessages.emptyAddressLine1,
    });
  } else {
    if (value.exporterAddressLine1.length > validation.FreeTextChar.max) {
      errors.push({
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages
            .charTooManyAddressLine1,
      });
    }
  }

  if (value.exporterAddressLine2.length > validation.FreeTextChar.max) {
    errors.push({
      field: 'ExporterDetail',
      message:
        validation.ExporterDetailValidationErrorMessages
          .charTooManyAddressLine2,
    });
  }

  if (!value.exporterTownOrCity || !value.exporterTownOrCity.trim()) {
    errors.push({
      field: 'ExporterDetail',
      message: validation.ExporterDetailValidationErrorMessages.emptyTownOrCity,
    });
  } else {
    if (value.exporterTownOrCity.length > validation.FreeTextChar.max) {
      errors.push({
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages
            .charTooManyTownOrCity,
      });
    }
  }

  if (!value.exporterCountry || !value.exporterCountry.trim()) {
    errors.push({
      field: 'ExporterDetail',
      message: validation.ExporterDetailValidationErrorMessages.emptyCountry,
    });
  } else {
    value.exporterCountry = titleCase(value.exporterCountry);
    if (!fourNationsCountries.includes(value.exporterCountry)) {
      errors.push({
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages.invalidCountry,
      });
    }
  }

  if (
    value.exporterPostcode &&
    !validation.postcodeRegex.test(value.exporterPostcode)
  ) {
    errors.push({
      field: 'ExporterDetail',
      message: validation.ExporterDetailValidationErrorMessages.invalidPostcode,
    });
  }

  if (!value.exporterContactFullName || !value.exporterContactFullName.trim()) {
    errors.push({
      field: 'ExporterDetail',
      message:
        validation.ExporterDetailValidationErrorMessages.emptyContactFullName,
    });
  } else {
    if (value.exporterContactFullName.length > validation.FreeTextChar.max) {
      errors.push({
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages
            .charTooManyContactFullName,
      });
    }
  }

  const reformattedExporterContactPhoneNumber =
    value.exporterContactPhoneNumber.replace(/'/g, '');
  if (!reformattedExporterContactPhoneNumber) {
    errors.push({
      field: 'ExporterDetail',
      message: validation.ExporterDetailValidationErrorMessages.emptyPhone,
    });
  } else {
    if (!validation.phoneRegex.test(reformattedExporterContactPhoneNumber)) {
      errors.push({
        field: 'ExporterDetail',
        message: validation.ExporterDetailValidationErrorMessages.invalidPhone,
      });
    }
  }

  const reformattedExporterFaxNumber = value.exporterFaxNumber.replace(
    /'/g,
    ''
  );
  if (
    reformattedExporterFaxNumber &&
    !validation.faxRegex.test(reformattedExporterFaxNumber)
  ) {
    errors.push({
      field: 'ExporterDetail',
      message: validation.ExporterDetailValidationErrorMessages.invalidFax,
    });
  }

  if (!value.exporterEmailAddress) {
    errors.push({
      field: 'ExporterDetail',
      message: validation.ExporterDetailValidationErrorMessages.emptyEmail,
    });
  } else {
    if (value.exporterEmailAddress.length > validation.FreeTextChar.max) {
      errors.push({
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages.charTooManyEmail,
      });
    } else {
      if (!validation.emailRegex.test(value.exporterEmailAddress)) {
        errors.push({
          field: 'ExporterDetail',
          message:
            validation.ExporterDetailValidationErrorMessages.invalidEmail,
        });
      }
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      value: errors,
    };
  }

  return {
    valid: true,
    value: {
      exporterAddress: {
        addressLine1: value.exporterAddressLine1,
        addressLine2: !value.exporterAddressLine2
          ? undefined
          : value.exporterAddressLine2,
        townCity: value.exporterTownOrCity,
        postcode: !value.exporterPostcode ? undefined : value.exporterPostcode,
        country: value.exporterCountry,
      },
      exporterContactDetails: {
        organisationName: value.exporterOrganisationName,
        fullName: value.exporterContactFullName,
        emailAddress: value.exporterEmailAddress,
        phoneNumber: reformattedExporterContactPhoneNumber,
        faxNumber: !reformattedExporterFaxNumber
          ? undefined
          : reformattedExporterFaxNumber,
      },
    },
  };
}

export function validateImporterDetailSection(
  value: ImporterDetailFlattened,
  countryList: Country[]
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: ImporterDetail } {
  const errors: FieldFormatError[] = [];
  if (
    !value.importerOrganisationName ||
    !value.importerOrganisationName.trim()
  ) {
    errors.push({
      field: 'ImporterDetail',
      message:
        validation.ImporterDetailValidationErrorMessages.emptyOrganisationName,
    });
  } else {
    if (value.importerOrganisationName.length > validation.FreeTextChar.max) {
      errors.push({
        field: 'ImporterDetail',
        message:
          validation.ImporterDetailValidationErrorMessages
            .charTooManyOrganisationName,
      });
    }
  }

  if (!value.importerAddress || !value.importerAddress.trim()) {
    errors.push({
      field: 'ImporterDetail',
      message: validation.ImporterDetailValidationErrorMessages.emptyAddress,
    });
  } else {
    if (value.importerAddress.length > validation.FreeTextChar.max) {
      errors.push({
        field: 'ImporterDetail',
        message:
          validation.ImporterDetailValidationErrorMessages.charTooManyAddress,
      });
    }
  }

  if (!value.importerCountry) {
    errors.push({
      field: 'ImporterDetail',
      message: validation.ImporterDetailValidationErrorMessages.emptyCountry,
    });
  } else {
    const filteredCountryList = countryList.filter((c) =>
      c.name.toUpperCase().includes(value.importerCountry.toUpperCase())
    );
    if (filteredCountryList.length !== 1) {
      errors.push({
        field: 'ImporterDetail',
        message:
          validation.ImporterDetailValidationErrorMessages.invalidCountry,
      });
    } else {
      value.importerCountry = filteredCountryList[0].name;
    }
  }

  if (!value.importerContactFullName || !value.importerContactFullName.trim()) {
    errors.push({
      field: 'ImporterDetail',
      message:
        validation.ImporterDetailValidationErrorMessages.emptyContactFullName,
    });
  } else {
    if (value.importerContactFullName.length > validation.FreeTextChar.max) {
      errors.push({
        field: 'ImporterDetail',
        message:
          validation.ImporterDetailValidationErrorMessages
            .charTooManyContactFullName,
      });
    }
  }

  const reformattedImporterContactPhoneNumber =
    value.importerContactPhoneNumber.replace(/'/g, '');
  if (!reformattedImporterContactPhoneNumber) {
    errors.push({
      field: 'ImporterDetail',
      message: validation.ImporterDetailValidationErrorMessages.emptyPhone,
    });
  } else {
    if (
      !validation.phoneInternationalRegex.test(
        reformattedImporterContactPhoneNumber
      )
    ) {
      errors.push({
        field: 'ImporterDetail',
        message: validation.ImporterDetailValidationErrorMessages.invalidPhone,
      });
    }
  }

  const reformattedImporterFaxNumber = value.importerFaxNumber.replace(
    /'/g,
    ''
  );
  if (
    reformattedImporterFaxNumber &&
    !validation.faxInternationalRegex.test(reformattedImporterFaxNumber)
  ) {
    errors.push({
      field: 'ImporterDetail',
      message: validation.ImporterDetailValidationErrorMessages.invalidFax,
    });
  }

  if (!value.importerEmailAddress) {
    errors.push({
      field: 'ImporterDetail',
      message: validation.ImporterDetailValidationErrorMessages.emptyEmail,
    });
  } else {
    if (value.importerEmailAddress.length > validation.FreeTextChar.max) {
      errors.push({
        field: 'ImporterDetail',
        message:
          validation.ImporterDetailValidationErrorMessages.charTooManyEmail,
      });
    } else {
      if (!validation.emailRegex.test(value.importerEmailAddress)) {
        errors.push({
          field: 'ImporterDetail',
          message:
            validation.ImporterDetailValidationErrorMessages.invalidEmail,
        });
      }
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      value: errors,
    };
  }

  return {
    valid: true,
    value: {
      importerAddressDetails: {
        organisationName: value.importerOrganisationName,
        address: value.importerAddress,
        country: value.importerCountry,
      },
      importerContactDetails: {
        fullName: value.importerContactFullName,
        emailAddress: value.importerEmailAddress,
        phoneNumber: reformattedImporterContactPhoneNumber,
        faxNumber: !reformattedImporterFaxNumber
          ? undefined
          : reformattedImporterFaxNumber,
      },
    },
  };
}

export function validateCollectionDateSection(
  value: CollectionDateFlattened
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: CollectionDate } {
  const errors: FieldFormatError[] = [];

  let dateArr: string[] = [];
  if (!value.wasteCollectionDate) {
    errors.push({
      field: 'CollectionDate',
      message: validation.CollectionDateValidationErrorMessages.empty,
    });
  } else {
    dateArr = value.wasteCollectionDate.replace(/-/g, '/').split('/');
    const collectionDate = new Date(
      Number(dateArr[2]),
      Number(dateArr[1]) - 1,
      Number(dateArr[0])
    );
    if (!isValid(new Date(collectionDate))) {
      errors.push({
        field: 'CollectionDate',
        message: validation.CollectionDateValidationErrorMessages.empty,
      });
    } else {
      if (isPast(collectionDate)) {
        errors.push({
          field: 'CollectionDate',
          message: validation.CollectionDateValidationErrorMessages.invalid,
        });
      }
    }
  }

  let collectionDateType = '';
  const quantityType = value.estimatedOrActualCollectionDate
    .replace(/\s/g, '')
    .toLowerCase();
  if (quantityType === 'actual') {
    collectionDateType = 'ActualDate';
  } else if (quantityType === 'estimate') {
    collectionDateType = 'EstimateDate';
  } else {
    errors.push({
      field: 'CollectionDate',
      message: validation.CollectionDateValidationErrorMessages.missingType,
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      value: errors,
    };
  }

  const date = {
    day: dateArr[0],
    month: dateArr[1],
    year: dateArr[2],
  };
  return {
    valid: true,
    value: {
      type: collectionDateType as 'EstimateDate' | 'ActualDate',
      estimateDate: collectionDateType === 'EstimateDate' ? date : {},
      actualDate: collectionDateType === 'ActualDate' ? date : {},
    },
  };
}

export function validateCarriersSection(
  value: CarriersFlattened,
  transport: boolean,
  countryIncludingUkList: Country[]
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: CarrierData[] } {
  const carriersArr = [
    {
      carrierOrganisationName: value.firstCarrierOrganisationName,
      carrierAddress: value.firstCarrierAddress,
      carrierCountry: value.firstCarrierCountry,
      carrierContactFullName: value.firstCarrierContactFullName,
      carrierContactPhoneNumber: value.firstCarrierContactPhoneNumber,
      carrierFaxNumber: value.firstCarrierFaxNumber,
      carrierEmailAddress: value.firstCarrierEmailAddress,
      carrierMeansOfTransport: value.firstCarrierMeansOfTransport,
      carrierMeansOfTransportDetails: value.firstCarrierMeansOfTransportDetails,
    },
    {
      carrierOrganisationName: value.secondCarrierOrganisationName,
      carrierAddress: value.secondCarrierAddress,
      carrierCountry: value.secondCarrierCountry,
      carrierContactFullName: value.secondCarrierContactFullName,
      carrierContactPhoneNumber: value.secondCarrierContactPhoneNumber,
      carrierFaxNumber: value.secondCarrierFaxNumber,
      carrierEmailAddress: value.secondCarrierEmailAddress,
      carrierMeansOfTransport: value.secondCarrierMeansOfTransport,
      carrierMeansOfTransportDetails:
        value.secondCarrierMeansOfTransportDetails,
    },
    {
      carrierOrganisationName: value.thirdCarrierOrganisationName,
      carrierAddress: value.thirdCarrierAddress,
      carrierCountry: value.thirdCarrierCountry,
      carrierContactFullName: value.thirdCarrierContactFullName,
      carrierContactPhoneNumber: value.thirdCarrierContactPhoneNumber,
      carrierFaxNumber: value.thirdCarrierFaxNumber,
      carrierEmailAddress: value.thirdCarrierEmailAddress,
      carrierMeansOfTransport: value.thirdCarrierMeansOfTransport,
      carrierMeansOfTransportDetails: value.thirdCarrierMeansOfTransportDetails,
    },
    {
      carrierOrganisationName: value.fourthCarrierOrganisationName,
      carrierAddress: value.fourthCarrierAddress,
      carrierCountry: value.fourthCarrierCountry,
      carrierContactFullName: value.fourthCarrierContactFullName,
      carrierContactPhoneNumber: value.fourthCarrierContactPhoneNumber,
      carrierFaxNumber: value.fourthCarrierFaxNumber,
      carrierEmailAddress: value.fourthCarrierEmailAddress,
      carrierMeansOfTransport: value.fourthCarrierMeansOfTransport,
      carrierMeansOfTransportDetails:
        value.fourthCarrierMeansOfTransportDetails,
    },
    {
      carrierOrganisationName: value.fifthCarrierOrganisationName,
      carrierAddress: value.fifthCarrierAddress,
      carrierCountry: value.fifthCarrierCountry,
      carrierContactFullName: value.fifthCarrierContactFullName,
      carrierContactPhoneNumber: value.fifthCarrierContactPhoneNumber,
      carrierFaxNumber: value.fifthCarrierFaxNumber,
      carrierEmailAddress: value.fifthCarrierEmailAddress,
      carrierMeansOfTransport: value.fifthCarrierMeansOfTransport,
      carrierMeansOfTransportDetails: value.fifthCarrierMeansOfTransportDetails,
    },
  ];

  let index = 0;
  const errors: FieldFormatError[] = [];
  const carriers: CarrierData[] = [];
  carriersArr.forEach((c) => {
    index += 1;

    if (
      index > 1 &&
      !c.carrierOrganisationName &&
      !c.carrierAddress &&
      !c.carrierCountry &&
      !c.carrierContactFullName &&
      !c.carrierContactPhoneNumber &&
      !c.carrierFaxNumber &&
      !c.carrierEmailAddress &&
      !c.carrierMeansOfTransport &&
      !c.carrierMeansOfTransportDetails
    ) {
      return;
    }

    let errorCount = 0;
    const errorMessages = validation.CarrierValidationErrorMessages(index);

    if (!c.carrierOrganisationName || !c.carrierOrganisationName.trim()) {
      errorCount += 1;
      errors.push({
        field: 'Carriers',
        message: errorMessages.emptyOrganisationName,
      });
    } else {
      if (c.carrierOrganisationName.length > validation.FreeTextChar.max) {
        errorCount += 1;
        errors.push({
          field: 'Carriers',
          message: errorMessages.charTooManyOrganisationName,
        });
      }
    }

    if (!c.carrierAddress || !c.carrierAddress.trim()) {
      errorCount += 1;
      errors.push({
        field: 'Carriers',
        message: errorMessages.emptyAddress,
      });
    } else {
      if (c.carrierAddress.length > validation.FreeTextChar.max) {
        errorCount += 1;
        errors.push({
          field: 'Carriers',
          message: errorMessages.charTooManyAddress,
        });
      }
    }

    if (!c.carrierCountry) {
      errorCount += 1;
      errors.push({
        field: 'Carriers',
        message: errorMessages.emptyCountry,
      });
    } else {
      const filteredCountryList = countryIncludingUkList.filter((country) =>
        country.name.toUpperCase().includes(c.carrierCountry.toUpperCase())
      );
      if (filteredCountryList.length !== 1) {
        errorCount += 1;
        errors.push({
          field: 'Carriers',
          message: errorMessages.invalidCountry,
        });
      } else {
        c.carrierCountry = filteredCountryList[0].name;
      }
    }

    if (!c.carrierContactFullName || !c.carrierContactFullName.trim()) {
      errorCount += 1;
      errors.push({
        field: 'Carriers',
        message: errorMessages.emptyContactFullName,
      });
    } else {
      if (c.carrierContactFullName.length > validation.FreeTextChar.max) {
        errorCount += 1;
        errors.push({
          field: 'Carriers',
          message: errorMessages.charTooManyContactFullName,
        });
      }
    }

    const reformattedCarrierContactPhoneNumber =
      c.carrierContactPhoneNumber.replace(/'/g, '');
    if (!reformattedCarrierContactPhoneNumber) {
      errorCount += 1;
      errors.push({
        field: 'Carriers',
        message: errorMessages.emptyPhone,
      });
    } else {
      if (
        !validation.phoneInternationalRegex.test(
          reformattedCarrierContactPhoneNumber
        )
      ) {
        errorCount += 1;
        errors.push({
          field: 'Carriers',
          message: errorMessages.invalidPhone,
        });
      }
    }

    const reformattedCarrierFaxNumber = c.carrierFaxNumber.replace(/'/g, '');
    if (
      reformattedCarrierFaxNumber &&
      !validation.faxInternationalRegex.test(reformattedCarrierFaxNumber)
    ) {
      errorCount += 1;
      errors.push({
        field: 'Carriers',
        message: errorMessages.invalidFax,
      });
    }

    if (!c.carrierEmailAddress) {
      errorCount += 1;
      errors.push({
        field: 'Carriers',
        message: errorMessages.emptyEmail,
      });
    } else {
      if (c.carrierEmailAddress.length > validation.FreeTextChar.max) {
        errorCount += 1;
        errors.push({
          field: 'Carriers',
          message: errorMessages.charTooManyEmail,
        });
      } else {
        if (!validation.emailRegex.test(c.carrierEmailAddress)) {
          errorCount += 1;
          errors.push({
            field: 'Carriers',
            message: errorMessages.invalidEmail,
          });
        }
      }
    }

    if (transport) {
      if (!c.carrierMeansOfTransport || !c.carrierMeansOfTransport.trim()) {
        errorCount += 1;
        errors.push({
          field: 'Carriers',
          message: errorMessages.emptyTransport,
        });
      } else {
        c.carrierMeansOfTransport = titleCase(
          c.carrierMeansOfTransport
        ).replace(/\s/g, '');
        if (!carrierMeansOfTransport.includes(c.carrierMeansOfTransport)) {
          errorCount += 1;
          errors.push({
            field: 'Carriers',
            message: errorMessages.emptyTransport,
          });
        }
      }

      if (
        c.carrierMeansOfTransportDetails &&
        c.carrierMeansOfTransportDetails.length >
          validation.CarrierTransportDescriptionChar.max
      ) {
        errorCount += 1;
        errors.push({
          field: 'Carriers',
          message: errorMessages.charTooManyTransportDescription,
        });
      }
    }

    if (errorCount === 0) {
      carriers.push({
        addressDetails: {
          organisationName: c.carrierOrganisationName,
          address: c.carrierAddress,
          country: c.carrierCountry,
        },
        contactDetails: {
          fullName: c.carrierContactFullName,
          emailAddress: c.carrierEmailAddress,
          phoneNumber: reformattedCarrierContactPhoneNumber,
          faxNumber: !reformattedCarrierFaxNumber
            ? undefined
            : reformattedCarrierFaxNumber,
        },
        transportDetails: !transport
          ? undefined
          : {
              type: c.carrierMeansOfTransport as
                | 'Road'
                | 'Rail'
                | 'Sea'
                | 'Air'
                | 'InlandWaterways',
              description: !c.carrierMeansOfTransportDetails
                ? undefined
                : c.carrierMeansOfTransportDetails,
            },
      });
    }
  });

  if (errors.length > 0) {
    return {
      valid: false,
      value: errors,
    };
  }

  return {
    valid: true,
    value: carriers,
  };
}

export function validateWasteDescriptionAndCarriersCrossSection(
  wasteDescription: WasteDescription,
  carriers: CarriersFlattened
):
  | { valid: false; value: InvalidAttributeCombinationError[] }
  | { valid: true } {
  if (wasteDescription.wasteCode.type === 'NotApplicable') {
    const errors: InvalidAttributeCombinationError[] = [];
    if (
      carriers.firstCarrierMeansOfTransport?.trim() ||
      carriers.secondCarrierMeansOfTransport?.trim() ||
      carriers.thirdCarrierMeansOfTransport?.trim() ||
      carriers.fourthCarrierMeansOfTransport?.trim() ||
      carriers.fifthCarrierMeansOfTransport?.trim()
    ) {
      errors.push({
        fields: ['WasteDescription', 'Carriers'],
        message:
          validation.CarriersCrossSectionValidationErrorMessages
            .invalidTransport,
      });
    }

    if (
      carriers.firstCarrierMeansOfTransportDetails?.trim() ||
      carriers.secondCarrierMeansOfTransportDetails?.trim() ||
      carriers.thirdCarrierMeansOfTransportDetails?.trim() ||
      carriers.fourthCarrierMeansOfTransportDetails?.trim() ||
      carriers.fifthCarrierMeansOfTransportDetails?.trim()
    ) {
      errors.push({
        fields: ['WasteDescription', 'Carriers'],
        message:
          validation.CarriersCrossSectionValidationErrorMessages
            .invalidTransportDescription,
      });
    }

    if (errors.length > 0) {
      return {
        valid: false,
        value: errors,
      };
    }
  }

  return {
    valid: true,
  };
}

export function validateCollectionDetailSection(
  value: CollectionDetailFlattened
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: CollectionDetail } {
  const errors: FieldFormatError[] = [];
  if (
    !value.wasteCollectionOrganisationName ||
    !value.wasteCollectionOrganisationName.trim()
  ) {
    errors.push({
      field: 'CollectionDetail',
      message:
        validation.CollectionDetailValidationErrorMessages
          .emptyOrganisationName,
    });
  } else {
    if (
      value.wasteCollectionOrganisationName.length > validation.FreeTextChar.max
    ) {
      errors.push({
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages
            .charTooManyOrganisationName,
      });
    }
  }

  if (
    !value.wasteCollectionAddressLine1 ||
    !value.wasteCollectionAddressLine1.trim()
  ) {
    errors.push({
      field: 'CollectionDetail',
      message:
        validation.CollectionDetailValidationErrorMessages.emptyAddressLine1,
    });
  } else {
    if (
      value.wasteCollectionAddressLine1.length > validation.FreeTextChar.max
    ) {
      errors.push({
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages
            .charTooManyAddressLine1,
      });
    }
  }

  if (value.wasteCollectionAddressLine2.length > validation.FreeTextChar.max) {
    errors.push({
      field: 'CollectionDetail',
      message:
        validation.CollectionDetailValidationErrorMessages
          .charTooManyAddressLine2,
    });
  }

  if (
    !value.wasteCollectionTownOrCity ||
    !value.wasteCollectionTownOrCity.trim()
  ) {
    errors.push({
      field: 'CollectionDetail',
      message:
        validation.CollectionDetailValidationErrorMessages.emptyTownOrCity,
    });
  } else {
    if (value.wasteCollectionTownOrCity.length > validation.FreeTextChar.max) {
      errors.push({
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages
            .charTooManyTownOrCity,
      });
    }
  }

  if (!value.wasteCollectionCountry || !value.wasteCollectionCountry.trim()) {
    errors.push({
      field: 'CollectionDetail',
      message: validation.CollectionDetailValidationErrorMessages.emptyCountry,
    });
  } else {
    value.wasteCollectionCountry = titleCase(value.wasteCollectionCountry);
    if (!fourNationsCountries.includes(value.wasteCollectionCountry)) {
      errors.push({
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages.invalidCountry,
      });
    }
  }

  if (
    value.wasteCollectionPostcode &&
    !validation.postcodeRegex.test(value.wasteCollectionPostcode)
  ) {
    errors.push({
      field: 'CollectionDetail',
      message:
        validation.CollectionDetailValidationErrorMessages.invalidPostcode,
    });
  }

  if (
    !value.wasteCollectionContactFullName ||
    !value.wasteCollectionContactFullName.trim()
  ) {
    errors.push({
      field: 'CollectionDetail',
      message:
        validation.CollectionDetailValidationErrorMessages.emptyContactFullName,
    });
  } else {
    if (
      value.wasteCollectionContactFullName.length > validation.FreeTextChar.max
    ) {
      errors.push({
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages
            .charTooManyContactFullName,
      });
    }
  }

  const reformattedwasteCollectionContactPhoneNumber =
    value.wasteCollectionContactPhoneNumber.replace(/'/g, '');
  if (!reformattedwasteCollectionContactPhoneNumber) {
    errors.push({
      field: 'CollectionDetail',
      message: validation.CollectionDetailValidationErrorMessages.emptyPhone,
    });
  } else {
    if (
      !validation.phoneRegex.test(reformattedwasteCollectionContactPhoneNumber)
    ) {
      errors.push({
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages.invalidPhone,
      });
    }
  }

  const reformattedwasteCollectionFaxNumber =
    value.wasteCollectionFaxNumber.replace(/'/g, '');
  if (
    reformattedwasteCollectionFaxNumber &&
    !validation.faxRegex.test(reformattedwasteCollectionFaxNumber)
  ) {
    errors.push({
      field: 'CollectionDetail',
      message: validation.CollectionDetailValidationErrorMessages.invalidFax,
    });
  }

  if (!value.wasteCollectionEmailAddress) {
    errors.push({
      field: 'CollectionDetail',
      message: validation.CollectionDetailValidationErrorMessages.emptyEmail,
    });
  } else {
    if (
      value.wasteCollectionEmailAddress.length > validation.FreeTextChar.max
    ) {
      errors.push({
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages.charTooManyEmail,
      });
    } else {
      if (!validation.emailRegex.test(value.wasteCollectionEmailAddress)) {
        errors.push({
          field: 'CollectionDetail',
          message:
            validation.CollectionDetailValidationErrorMessages.invalidEmail,
        });
      }
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      value: errors,
    };
  }

  return {
    valid: true,
    value: {
      address: {
        addressLine1: value.wasteCollectionAddressLine1,
        addressLine2: !value.wasteCollectionAddressLine2
          ? undefined
          : value.wasteCollectionAddressLine2,
        townCity: value.wasteCollectionTownOrCity,
        postcode: !value.wasteCollectionPostcode
          ? undefined
          : value.wasteCollectionPostcode,
        country: value.wasteCollectionCountry,
      },
      contactDetails: {
        organisationName: value.wasteCollectionOrganisationName,
        fullName: value.wasteCollectionContactFullName,
        emailAddress: value.wasteCollectionEmailAddress,
        phoneNumber: reformattedwasteCollectionContactPhoneNumber,
        faxNumber: !reformattedwasteCollectionFaxNumber
          ? undefined
          : reformattedwasteCollectionFaxNumber,
      },
    },
  };
}

export function validateUkExitLocationSection(
  value: ExitLocationFlattened
):
  | { valid: false; value: FieldFormatError }
  | { valid: true; value: ExitLocation } {
  value.whereWasteLeavesUk = value.whereWasteLeavesUk.trim();
  let location: ExitLocation = { provided: 'No' };

  if (value.whereWasteLeavesUk) {
    if (value.whereWasteLeavesUk.length > validation.UkExitLocationChar.max) {
      return {
        valid: false,
        value: {
          field: 'UkExitLocation',
          message: validation.UkExitLocationValidationErrorMessages.charTooMany,
        },
      };
    }

    if (!validation.ukExitLocationRegex.test(value.whereWasteLeavesUk)) {
      return {
        valid: false,
        value: {
          field: 'UkExitLocation',
          message: validation.UkExitLocationValidationErrorMessages.invalid,
        },
      };
    }

    location = {
      provided: 'Yes',
      value: value.whereWasteLeavesUk,
    };
  }

  return { valid: true, value: location };
}

export function validateTransitCountriesSection(
  value: TransitCountriesFlattened,
  countryList: Country[]
):
  | { valid: false; value: FieldFormatError }
  | { valid: true; value: TransitCountries } {
  let countries: string[] = [];
  if (value.transitCountries && value.transitCountries.trim()) {
    const countryArr = [
      ...new Set(value.transitCountries.trim().toUpperCase().split(';')),
    ];
    const filteredCountryList = countryList.filter((v) =>
      countryArr.find((c) => v.name.toUpperCase().includes(c.trim()))
    );
    if (filteredCountryList.length !== countryArr.length) {
      return {
        valid: false,
        value: {
          field: 'TransitCountries',
          message: validation.TransitCountriesValidationErrorMessages.invalid,
        },
      };
    }

    countries = filteredCountryList.map((s) => s.name);
  }

  return { valid: true, value: countries };
}

export function validateImporterDetailAndTransitCountriesCrossSection(
  importerDetail: ImporterDetail,
  transitCountries: TransitCountries
):
  | { valid: false; value: InvalidAttributeCombinationError[] }
  | { valid: true } {
  if (
    transitCountries.some(
      (c) => c === importerDetail.importerAddressDetails.country
    )
  ) {
    return {
      valid: false,
      value: [
        {
          fields: ['ImporterDetail', 'TransitCountries'],
          message:
            validation.ImporterDetailValidationErrorMessages
              .invalidCrossSectionCountry,
        },
        {
          fields: ['ImporterDetail', 'TransitCountries'],
          message:
            validation.TransitCountriesValidationErrorMessages
              .invalidCrossSection,
        },
      ],
    };
  }
  return { valid: true };
}

type RecoveryFacilityEntry = {
  organisationName: string;
  address: string;
  country: string;
  contactFullName: string;
  contactPhoneNumber: string;
  faxNumber: string;
  emailAddress: string;
  code: string;
};

function validateRecoveryFacilityEntry(
  values: RecoveryFacilityEntry[],
  type: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
  countryList: Country[],
  recoveryCodeList: RecoveryCode[],
  disposalCodeList: WasteCode[]
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: RecoveryFacilityData[] } {
  const errors: FieldFormatError[] = [];
  const recoveryFacilities: RecoveryFacilityData[] = [];
  let index = 0;
  values.forEach((v) => {
    index += 1;

    if (
      index > 1 &&
      !v.organisationName &&
      !v.address &&
      !v.country &&
      !v.contactFullName &&
      !v.contactPhoneNumber &&
      !v.faxNumber &&
      !v.emailAddress &&
      !v.code
    ) {
      return;
    }

    let errorCount = 0;
    const errorMessages =
      validation.RecoveryFacilityDetailValidationErrorMessages(type, index);

    if (!v.organisationName || !v.organisationName.trim()) {
      errorCount += 1;
      errors.push({
        field: 'RecoveryFacilityDetail',
        message: errorMessages.emptyOrganisationName,
      });
    } else {
      if (v.organisationName.length > validation.FreeTextChar.max) {
        errorCount += 1;
        errors.push({
          field: 'RecoveryFacilityDetail',
          message: errorMessages.charTooManyOrganisationName,
        });
      }
    }

    if (!v.address || !v.address.trim()) {
      errorCount += 1;
      errors.push({
        field: 'RecoveryFacilityDetail',
        message: errorMessages.emptyAddress,
      });
    } else {
      if (v.address.length > validation.FreeTextChar.max) {
        errorCount += 1;
        errors.push({
          field: 'RecoveryFacilityDetail',
          message: errorMessages.charTooManyAddress,
        });
      }
    }

    if (!v.country) {
      errorCount += 1;
      errors.push({
        field: 'RecoveryFacilityDetail',
        message: errorMessages.emptyCountry,
      });
    } else {
      const filteredCountryList = countryList.filter((country) =>
        country.name.toUpperCase().includes(v.country.toUpperCase())
      );
      if (filteredCountryList.length !== 1) {
        errorCount += 1;
        errors.push({
          field: 'RecoveryFacilityDetail',
          message: errorMessages.invalidCountry,
        });
      } else {
        v.country = filteredCountryList[0].name;
      }
    }

    if (!v.contactFullName || !v.contactFullName.trim()) {
      errorCount += 1;
      errors.push({
        field: 'RecoveryFacilityDetail',
        message: errorMessages.emptyContactFullName,
      });
    } else {
      if (v.contactFullName.length > validation.FreeTextChar.max) {
        errorCount += 1;
        errors.push({
          field: 'RecoveryFacilityDetail',
          message: errorMessages.charTooManyContactFullName,
        });
      }
    }

    v.contactPhoneNumber = v.contactPhoneNumber.replace(/'/g, '');
    if (!v.contactPhoneNumber) {
      errorCount += 1;
      errors.push({
        field: 'RecoveryFacilityDetail',
        message: errorMessages.emptyPhone,
      });
    } else {
      if (!validation.phoneInternationalRegex.test(v.contactPhoneNumber)) {
        errorCount += 1;
        errors.push({
          field: 'RecoveryFacilityDetail',
          message: errorMessages.invalidPhone,
        });
      }
    }

    v.faxNumber = v.faxNumber.replace(/'/g, '');
    if (v.faxNumber && !validation.faxInternationalRegex.test(v.faxNumber)) {
      errorCount += 1;
      errors.push({
        field: 'RecoveryFacilityDetail',
        message: errorMessages.invalidFax,
      });
    }

    if (!v.emailAddress) {
      errorCount += 1;
      errors.push({
        field: 'RecoveryFacilityDetail',
        message: errorMessages.emptyEmail,
      });
    } else {
      if (v.emailAddress.length > validation.FreeTextChar.max) {
        errorCount += 1;
        errors.push({
          field: 'RecoveryFacilityDetail',
          message: errorMessages.charTooManyEmail,
        });
      } else {
        if (!validation.emailRegex.test(v.emailAddress)) {
          errorCount += 1;
          errors.push({
            field: 'RecoveryFacilityDetail',
            message: errorMessages.invalidEmail,
          });
        }
      }
    }

    if (!v.code) {
      errorCount += 1;
      errors.push({
        field: 'RecoveryFacilityDetail',
        message: errorMessages.emptyCode,
      });
    } else {
      const filteredCodeList =
        type === 'Laboratory'
          ? disposalCodeList.filter(
              (c) => c.code.toUpperCase() === v.code.toUpperCase()
            )
          : type === 'InterimSite'
          ? recoveryCodeList.filter(
              (c) =>
                c.value.interim && c.code.toUpperCase() === v.code.toUpperCase()
            )
          : recoveryCodeList.filter(
              (c) => c.code.toUpperCase() === v.code.toUpperCase()
            );
      if (filteredCodeList.length !== 1) {
        errorCount += 1;
        errors.push({
          field: 'RecoveryFacilityDetail',
          message: errorMessages.invalidCode,
        });
      } else {
        v.code = filteredCodeList[0].code;
      }
    }

    if (errorCount === 0) {
      recoveryFacilities.push({
        addressDetails: {
          name: v.organisationName,
          address: v.address,
          country: v.country,
        },
        contactDetails: {
          fullName: v.contactFullName,
          emailAddress: v.emailAddress,
          phoneNumber: v.contactPhoneNumber,
          faxNumber: !v.faxNumber ? undefined : v.faxNumber,
        },
        recoveryFacilityType:
          type === 'Laboratory'
            ? {
                type: type,
                disposalCode: v.code,
              }
            : {
                type: type,
                recoveryCode: v.code,
              },
      });
    }
  });

  if (errors.length > 0) {
    return {
      valid: false,
      value: errors,
    };
  }

  return {
    valid: true,
    value: recoveryFacilities,
  };
}

export function validateRecoveryFacilityDetailSection(
  value: RecoveryFacilityDetailFlattened,
  smallWaste: boolean,
  countryList: Country[],
  recoveryCodeList: RecoveryCode[],
  disposalCodeList: WasteCode[]
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: RecoveryFacilityData[] } {
  let errors: FieldFormatError[] = [];
  let recoveryFacilityEntries: RecoveryFacilityData[] = [];

  if (smallWaste) {
    const laboratory = validateRecoveryFacilityEntry(
      [
        {
          organisationName: value.laboratoryOrganisationName,
          address: value.laboratoryAddress,
          country: value.laboratoryCountry,
          contactFullName: value.laboratoryContactFullName,
          contactPhoneNumber: value.laboratoryContactPhoneNumber,
          faxNumber: value.laboratoryFaxNumber,
          emailAddress: value.laboratoryEmailAddress,
          code: value.laboratoryDisposalCode,
        },
      ],
      'Laboratory',
      countryList,
      recoveryCodeList,
      disposalCodeList
    );

    if (!laboratory.valid) {
      errors = errors.concat(laboratory.value);
    } else {
      recoveryFacilityEntries = recoveryFacilityEntries.concat(
        laboratory.value
      );
    }

    if (errors.length > 0) {
      return {
        valid: false,
        value: errors,
      };
    }

    return {
      valid: true,
      value: recoveryFacilityEntries,
    };
  }

  if (
    value.interimSiteOrganisationName ||
    value.interimSiteAddress ||
    value.interimSiteCountry ||
    value.interimSiteContactFullName ||
    value.interimSiteContactPhoneNumber ||
    value.interimSiteFaxNumber ||
    value.interimSiteEmailAddress ||
    value.interimSiteRecoveryCode
  ) {
    const interimSite = validateRecoveryFacilityEntry(
      [
        {
          organisationName: value.interimSiteOrganisationName,
          address: value.interimSiteAddress,
          country: value.interimSiteCountry,
          contactFullName: value.interimSiteContactFullName,
          contactPhoneNumber: value.interimSiteContactPhoneNumber,
          faxNumber: value.interimSiteFaxNumber,
          emailAddress: value.interimSiteEmailAddress,
          code: value.interimSiteRecoveryCode,
        },
      ],
      'InterimSite',
      countryList,
      recoveryCodeList,
      disposalCodeList
    );

    if (!interimSite.valid) {
      errors = errors.concat(interimSite.value);
    } else {
      recoveryFacilityEntries = recoveryFacilityEntries.concat(
        interimSite.value
      );
    }
  }

  const recoveryFacilitiesArr = [
    {
      organisationName: value.firstRecoveryFacilityOrganisationName,
      address: value.firstRecoveryFacilityAddress,
      country: value.firstRecoveryFacilityCountry,
      contactFullName: value.firstRecoveryFacilityContactFullName,
      contactPhoneNumber: value.firstRecoveryFacilityContactPhoneNumber,
      faxNumber: value.firstRecoveryFacilityFaxNumber,
      emailAddress: value.firstRecoveryFacilityEmailAddress,
      code: value.firstRecoveryFacilityRecoveryCode,
    },
    {
      organisationName: value.secondRecoveryFacilityOrganisationName,
      address: value.secondRecoveryFacilityAddress,
      country: value.secondRecoveryFacilityCountry,
      contactFullName: value.secondRecoveryFacilityContactFullName,
      contactPhoneNumber: value.secondRecoveryFacilityContactPhoneNumber,
      faxNumber: value.secondRecoveryFacilityFaxNumber,
      emailAddress: value.secondRecoveryFacilityEmailAddress,
      code: value.secondRecoveryFacilityRecoveryCode,
    },
    {
      organisationName: value.thirdRecoveryFacilityOrganisationName,
      address: value.thirdRecoveryFacilityAddress,
      country: value.thirdRecoveryFacilityCountry,
      contactFullName: value.thirdRecoveryFacilityContactFullName,
      contactPhoneNumber: value.thirdRecoveryFacilityContactPhoneNumber,
      faxNumber: value.thirdRecoveryFacilityFaxNumber,
      emailAddress: value.thirdRecoveryFacilityEmailAddress,
      code: value.thirdRecoveryFacilityRecoveryCode,
    },
    {
      organisationName: value.fourthRecoveryFacilityOrganisationName,
      address: value.fourthRecoveryFacilityAddress,
      country: value.fourthRecoveryFacilityCountry,
      contactFullName: value.fourthRecoveryFacilityContactFullName,
      contactPhoneNumber: value.fourthRecoveryFacilityContactPhoneNumber,
      faxNumber: value.fourthRecoveryFacilityFaxNumber,
      emailAddress: value.fourthRecoveryFacilityEmailAddress,
      code: value.fourthRecoveryFacilityRecoveryCode,
    },
    {
      organisationName: value.fifthRecoveryFacilityOrganisationName,
      address: value.fifthRecoveryFacilityAddress,
      country: value.fifthRecoveryFacilityCountry,
      contactFullName: value.fifthRecoveryFacilityContactFullName,
      contactPhoneNumber: value.fifthRecoveryFacilityContactPhoneNumber,
      faxNumber: value.fifthRecoveryFacilityFaxNumber,
      emailAddress: value.fifthRecoveryFacilityEmailAddress,
      code: value.fifthRecoveryFacilityRecoveryCode,
    },
  ];
  const recoveryFacilities = validateRecoveryFacilityEntry(
    recoveryFacilitiesArr,
    'RecoveryFacility',
    countryList,
    recoveryCodeList,
    disposalCodeList
  );

  if (!recoveryFacilities.valid) {
    errors = errors.concat(recoveryFacilities.value);
  } else {
    recoveryFacilityEntries = recoveryFacilityEntries.concat(
      recoveryFacilities.value
    );
  }

  if (errors.length > 0) {
    return {
      valid: false,
      value: errors,
    };
  }

  return {
    valid: true,
    value: recoveryFacilityEntries,
  };
}

export function validateWasteDescriptionAndRecoveryFacilityDetailCrossSection(
  wasteDescription: WasteDescription,
  recoveryFacilityDetail: RecoveryFacilityDetailFlattened
):
  | { valid: false; value: InvalidAttributeCombinationError[] }
  | { valid: true } {
  if (wasteDescription.wasteCode.type === 'NotApplicable') {
    const errors: InvalidAttributeCombinationError[] = [];
    if (
      recoveryFacilityDetail.interimSiteOrganisationName ||
      recoveryFacilityDetail.interimSiteAddress ||
      recoveryFacilityDetail.interimSiteCountry ||
      recoveryFacilityDetail.interimSiteContactFullName ||
      recoveryFacilityDetail.interimSiteContactPhoneNumber ||
      recoveryFacilityDetail.interimSiteFaxNumber ||
      recoveryFacilityDetail.interimSiteEmailAddress ||
      recoveryFacilityDetail.interimSiteRecoveryCode
    ) {
      errors.push({
        fields: ['WasteDescription', 'RecoveryFacilityDetail'],
        message:
          validation.RecoveryFacilityDetailCrossSectionValidationErrorMessages
            .invalidInterimSite,
      });
    }

    if (
      recoveryFacilityDetail.firstRecoveryFacilityOrganisationName ||
      recoveryFacilityDetail.firstRecoveryFacilityAddress ||
      recoveryFacilityDetail.firstRecoveryFacilityCountry ||
      recoveryFacilityDetail.firstRecoveryFacilityContactFullName ||
      recoveryFacilityDetail.firstRecoveryFacilityContactPhoneNumber ||
      recoveryFacilityDetail.firstRecoveryFacilityFaxNumber ||
      recoveryFacilityDetail.firstRecoveryFacilityEmailAddress ||
      recoveryFacilityDetail.firstRecoveryFacilityRecoveryCode ||
      recoveryFacilityDetail.secondRecoveryFacilityOrganisationName ||
      recoveryFacilityDetail.secondRecoveryFacilityAddress ||
      recoveryFacilityDetail.secondRecoveryFacilityCountry ||
      recoveryFacilityDetail.secondRecoveryFacilityContactFullName ||
      recoveryFacilityDetail.secondRecoveryFacilityContactPhoneNumber ||
      recoveryFacilityDetail.secondRecoveryFacilityFaxNumber ||
      recoveryFacilityDetail.secondRecoveryFacilityEmailAddress ||
      recoveryFacilityDetail.secondRecoveryFacilityRecoveryCode ||
      recoveryFacilityDetail.thirdRecoveryFacilityOrganisationName ||
      recoveryFacilityDetail.thirdRecoveryFacilityAddress ||
      recoveryFacilityDetail.thirdRecoveryFacilityCountry ||
      recoveryFacilityDetail.thirdRecoveryFacilityContactFullName ||
      recoveryFacilityDetail.thirdRecoveryFacilityContactPhoneNumber ||
      recoveryFacilityDetail.thirdRecoveryFacilityFaxNumber ||
      recoveryFacilityDetail.thirdRecoveryFacilityEmailAddress ||
      recoveryFacilityDetail.thirdRecoveryFacilityRecoveryCode ||
      recoveryFacilityDetail.fourthRecoveryFacilityOrganisationName ||
      recoveryFacilityDetail.fourthRecoveryFacilityAddress ||
      recoveryFacilityDetail.fourthRecoveryFacilityCountry ||
      recoveryFacilityDetail.fourthRecoveryFacilityContactFullName ||
      recoveryFacilityDetail.fourthRecoveryFacilityContactPhoneNumber ||
      recoveryFacilityDetail.fourthRecoveryFacilityFaxNumber ||
      recoveryFacilityDetail.fourthRecoveryFacilityEmailAddress ||
      recoveryFacilityDetail.fourthRecoveryFacilityRecoveryCode ||
      recoveryFacilityDetail.fifthRecoveryFacilityOrganisationName ||
      recoveryFacilityDetail.fifthRecoveryFacilityAddress ||
      recoveryFacilityDetail.fifthRecoveryFacilityCountry ||
      recoveryFacilityDetail.fifthRecoveryFacilityContactFullName ||
      recoveryFacilityDetail.fifthRecoveryFacilityContactPhoneNumber ||
      recoveryFacilityDetail.fifthRecoveryFacilityFaxNumber ||
      recoveryFacilityDetail.fifthRecoveryFacilityEmailAddress ||
      recoveryFacilityDetail.fifthRecoveryFacilityRecoveryCode
    ) {
      errors.push({
        fields: ['WasteDescription', 'RecoveryFacilityDetail'],
        message:
          validation.RecoveryFacilityDetailCrossSectionValidationErrorMessages
            .invalidRecoveryFacility,
      });
    }

    if (errors.length > 0) {
      return {
        valid: false,
        value: errors,
      };
    }
  } else {
    if (
      recoveryFacilityDetail.laboratoryOrganisationName ||
      recoveryFacilityDetail.laboratoryAddress ||
      recoveryFacilityDetail.laboratoryCountry ||
      recoveryFacilityDetail.laboratoryContactFullName ||
      recoveryFacilityDetail.laboratoryContactPhoneNumber ||
      recoveryFacilityDetail.laboratoryFaxNumber ||
      recoveryFacilityDetail.laboratoryEmailAddress ||
      recoveryFacilityDetail.laboratoryDisposalCode
    ) {
      return {
        valid: false,
        value: [
          {
            fields: ['WasteDescription', 'RecoveryFacilityDetail'],
            message:
              validation
                .RecoveryFacilityDetailCrossSectionValidationErrorMessages
                .invalidLaboratory,
          },
        ],
      };
    }
  }

  return {
    valid: true,
  };
}
