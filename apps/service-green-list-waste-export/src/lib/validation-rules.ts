import { WasteCodeType, WasteCode, Country } from '@wts/api/reference-data';
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
          message: validation.LaboratoryValidationErrorMessages.invalid,
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

  if (!value.exporterContactFullname || !value.exporterContactFullname.trim()) {
    errors.push({
      field: 'ExporterDetail',
      message:
        validation.ExporterDetailValidationErrorMessages.emptyContactFullName,
    });
  } else {
    if (value.exporterContactFullname.length > validation.FreeTextChar.max) {
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
    if (!validation.emailRegex.test(value.exporterEmailAddress)) {
      errors.push({
        field: 'ExporterDetail',
        message: validation.ExporterDetailValidationErrorMessages.invalidEmail,
      });
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
        fullName: value.exporterContactFullname,
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

  // TODO: country should not be the same as transit country
  // Cannot be done until transit country section is done

  if (!value.importerContactFullname || !value.importerContactFullname.trim()) {
    errors.push({
      field: 'ImporterDetail',
      message:
        validation.ImporterDetailValidationErrorMessages.emptyContactFullName,
    });
  } else {
    if (value.importerContactFullname.length > validation.FreeTextChar.max) {
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
    if (!validation.emailRegex.test(value.importerEmailAddress)) {
      errors.push({
        field: 'ImporterDetail',
        message: validation.ImporterDetailValidationErrorMessages.invalidEmail,
      });
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
        fullName: value.importerContactFullname,
        emailAddress: value.importerEmailAddress,
        phoneNumber: reformattedImporterContactPhoneNumber,
        faxNumber: !reformattedImporterFaxNumber
          ? undefined
          : reformattedImporterFaxNumber,
      },
    },
  };
}
