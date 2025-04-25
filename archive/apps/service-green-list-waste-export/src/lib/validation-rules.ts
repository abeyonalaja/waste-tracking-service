import {
  WasteCodeType,
  WasteCode,
  Country,
  RecoveryCode,
} from '@wts/api/reference-data';
import {
  FieldFormatError,
  CustomerReference,
  WasteDescriptionFlattened,
  WasteDescription,
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
  CollectionDetail,
  CollectionDetailFlattened,
  RecoveryFacilityDetailFlattened,
  WasteDescriptionSubSectionFlattened,
  WasteCodeSubSectionFlattened,
  Carrier,
  RecoveryFacilityDetail,
  ExitLocationFlattened,
  UkExitLocation,
  TransitCountriesFlattened,
  TransitCountries,
  WasteQuantityData,
} from '../model';

import {
  common as commonValidation,
  glwe as glweValidation,
} from '@wts/util/shared-validation';

const locale = 'en';
const context = 'csv';

export function validateCustomerReferenceSection(
  value: CustomerReferenceFlattened,
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: CustomerReference } {
  const validationResult = glweValidation.validationRules.validateReference(
    value.reference,
  );

  if (!validationResult.valid) {
    return {
      valid: false,
      value: validationResult.errors.fieldFormatErrors,
    };
  }

  return {
    valid: true,
    value: validationResult.value,
  };
}

export function validateWasteCodeSubSection(
  value: WasteCodeSubSectionFlattened,
  wasteCodeList: WasteCodeType[],
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: WasteDescription['wasteCode'] } {
  let wasteCode: WasteDescription['wasteCode'] = { type: 'NotApplicable' };
  if (
    !value.baselAnnexIXCode &&
    !value.oecdCode &&
    !value.annexIIIACode &&
    !value.annexIIIBCode &&
    !value.laboratory
  ) {
    return {
      valid: false,
      value: [
        {
          field: 'WasteDescription',
          message:
            glweValidation.errorMessages.emptyWasteCodeType[locale][context],
        },
      ],
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
      value: [
        {
          field: 'WasteDescription',
          message:
            glweValidation.errorMessages.tooManyWasteCodeType[locale][context],
        },
      ],
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
      value: [
        {
          field: 'WasteDescription',
          message: glweValidation.errorMessages.laboratoryType[locale][context],
        },
      ],
    };
  }

  if (value.baselAnnexIXCode) {
    const wasteCodeValidationResult =
      glweValidation.validationRules.validateWasteCode(
        value.baselAnnexIXCode,
        'BaselAnnexIX',
        wasteCodeList,
        locale,
        context,
      );

    if (!wasteCodeValidationResult.valid) {
      return {
        valid: false,
        value: wasteCodeValidationResult.errors.fieldFormatErrors,
      };
    } else {
      wasteCode = wasteCodeValidationResult.value;
    }
  }

  if (value.oecdCode) {
    const wasteCodeValidationResult =
      glweValidation.validationRules.validateWasteCode(
        value.oecdCode,
        'OECD',
        wasteCodeList,
        locale,
        context,
      );

    if (!wasteCodeValidationResult.valid) {
      return {
        valid: false,
        value: wasteCodeValidationResult.errors.fieldFormatErrors,
      };
    } else {
      wasteCode = wasteCodeValidationResult.value;
    }
  }

  if (value.annexIIIACode) {
    const wasteCodeValidationResult =
      glweValidation.validationRules.validateWasteCode(
        value.annexIIIACode,
        'AnnexIIIA',
        wasteCodeList,
        locale,
        context,
      );

    if (!wasteCodeValidationResult.valid) {
      return {
        valid: false,
        value: wasteCodeValidationResult.errors.fieldFormatErrors,
      };
    } else {
      wasteCode = wasteCodeValidationResult.value;
    }
  }

  if (value.annexIIIBCode) {
    const wasteCodeValidationResult =
      glweValidation.validationRules.validateWasteCode(
        value.annexIIIBCode,
        'AnnexIIIB',
        wasteCodeList,
        locale,
        context,
      );

    if (!wasteCodeValidationResult.valid) {
      return {
        valid: false,
        value: wasteCodeValidationResult.errors.fieldFormatErrors,
      };
    } else {
      wasteCode = wasteCodeValidationResult.value;
    }
  }

  if (value.laboratory) {
    const laboratory = value.laboratory.replace(/\s/g, '').toLowerCase();
    if (laboratory !== 'yes') {
      return {
        valid: false,
        value: [
          {
            field: 'WasteDescription',
            message:
              glweValidation.errorMessages.invalidUnlistedWasteType[locale][
                context
              ],
          },
        ],
      };
    } else {
      wasteCode = {
        type: 'NotApplicable',
      };
    }
  }

  return {
    valid: true,
    value: wasteCode,
  };
}

export function validateWasteDescriptionSubSection(
  value: WasteDescriptionSubSectionFlattened,
  ewcCodeList: WasteCode[],
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: Omit<WasteDescription, 'wasteCode'> } {
  const errors: FieldFormatError[] = [];
  let ewcCodes: EwcCodeComponent = [];
  if (!value.ewcCodes) {
    errors.push({
      field: 'WasteDescription',
      message: glweValidation.errorMessages.emptyEwcCodes[locale][context],
    });
  } else {
    const ewcCodesValidationResult =
      glweValidation.validationRules.validateEwcCodes(
        value.ewcCodes.replace(/'/g, '').replace(/\s/g, '').split(';'),
        ewcCodeList,
        locale,
        context,
      );

    if (!ewcCodesValidationResult.valid) {
      errors.push(...ewcCodesValidationResult.errors.fieldFormatErrors);
    } else {
      ewcCodes = ewcCodesValidationResult.value;
    }
  }

  let nationalCode: NationalCodeComponent = { provided: 'No' };
  const nationalCodeValidationResult =
    glweValidation.validationRules.validateNationalCode(
      value.nationalCode,
      locale,
      context,
    );
  if (!nationalCodeValidationResult.valid) {
    errors.push(...nationalCodeValidationResult.errors.fieldFormatErrors);
  } else {
    nationalCode = nationalCodeValidationResult.value;
  }

  const descriptionValidationResult =
    glweValidation.validationRules.validateWasteDecription(
      value.wasteDescription,
      locale,
      context,
    );
  if (!descriptionValidationResult.valid) {
    errors.push(...descriptionValidationResult.errors.fieldFormatErrors);
  } else {
    value.wasteDescription = descriptionValidationResult.value;
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
        ewcCodes: ewcCodes,
        nationalCode: nationalCode,
        description: value.wasteDescription,
      },
    };
  }
}

export function validateWasteDescriptionSection(
  value: WasteDescriptionFlattened,
  wasteCodeList: WasteCodeType[],
  ewcCodeList: WasteCode[],
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: WasteDescription } {
  const errors: FieldFormatError[] = [];

  const wasteCodeSubSection = validateWasteCodeSubSection(
    {
      baselAnnexIXCode: value.baselAnnexIXCode,
      oecdCode: value.oecdCode,
      annexIIIACode: value.annexIIIACode,
      annexIIIBCode: value.annexIIIBCode,
      laboratory: value.laboratory,
    },
    wasteCodeList,
  );

  if (!wasteCodeSubSection.valid) {
    errors.push(...wasteCodeSubSection.value);
  }

  const wasteDescriptionSubSection = validateWasteDescriptionSubSection(
    {
      ewcCodes: value.ewcCodes,
      nationalCode: value.nationalCode,
      wasteDescription: value.wasteDescription,
    },
    ewcCodeList,
  );

  if (!wasteDescriptionSubSection.valid) {
    errors.push(...wasteDescriptionSubSection.value);
  }

  if (wasteCodeSubSection.valid && wasteDescriptionSubSection.valid) {
    return {
      valid: true,
      value: {
        wasteCode: wasteCodeSubSection.value,
        ewcCodes: wasteDescriptionSubSection.value.ewcCodes,
        nationalCode: wasteDescriptionSubSection.value.nationalCode,
        description: wasteDescriptionSubSection.value.description,
      },
    };
  }

  return {
    valid: false,
    value: errors,
  };
}

export function validateWasteQuantitySection(
  value: WasteQuantityFlattened,
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: WasteQuantity } {
  const errors: FieldFormatError[] = [];
  if (
    (value.wasteQuantityTonnes && value.wasteQuantityCubicMetres) ||
    (value.wasteQuantityTonnes && value.wasteQuantityKilograms) ||
    (value.wasteQuantityCubicMetres && value.wasteQuantityKilograms)
  ) {
    errors.push({
      field: 'WasteQuantity',
      message:
        glweValidation.errorMessages.tooManyWasteQuantity[locale][context],
    });
  }

  const quantityType =
    value.wasteQuantityKilograms || value.wasteQuantityTonnes
      ? 'Weight'
      : 'Volume';

  const unit = value.wasteQuantityKilograms
    ? 'Kilogram'
    : value.wasteQuantityTonnes
      ? 'Tonne'
      : 'Cubic Metre';

  let quantity: WasteQuantityData = {
    quantityType: quantityType,
    unit: unit,
    value: 0,
  };

  if (errors.length === 0) {
    const wasteQuantityValidationResult =
      glweValidation.validationRules.validateWasteQuantity(
        quantityType,
        unit,
        value.wasteQuantityKilograms ||
          value.wasteQuantityTonnes ||
          value.wasteQuantityCubicMetres,
        'en',
        'csv',
      );

    if (!wasteQuantityValidationResult.valid) {
      errors.push(...wasteQuantityValidationResult.errors.fieldFormatErrors);
    } else {
      quantity = wasteQuantityValidationResult.value;
    }
  }

  const wasteQuantityTypeValidationResult =
    glweValidation.validationRules.validateWasteQuantityType(
      value.estimatedOrActualWasteQuantity,
    );
  let wasteQuantityType: 'EstimateData' | 'ActualData' = 'EstimateData';

  if (!wasteQuantityTypeValidationResult.valid) {
    errors.push(...wasteQuantityTypeValidationResult.errors.fieldFormatErrors);
  } else {
    wasteQuantityType = wasteQuantityTypeValidationResult.value;
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
        type: wasteQuantityType,
        estimateData: wasteQuantityType === 'EstimateData' ? quantity : {},
        actualData: wasteQuantityType === 'ActualData' ? quantity : {},
      },
    };
  }
}

export function validateWasteCodeSubSectionAndQuantityCrossSection(
  wasteCodeSubSection: WasteDescription['wasteCode'],
  wasteQuantity: WasteQuantity,
):
  | { valid: false; value: InvalidAttributeCombinationError[] }
  | { valid: true } {
  const validationResult =
    glweValidation.validationRules.validateWasteCodeSubSectionAndQuantityCrossSection(
      wasteCodeSubSection,
      wasteQuantity,
      'en',
      'csv',
    );

  if (!validationResult.valid) {
    return {
      valid: false,
      value: validationResult.errors.invalidStructureErrors ?? [],
    };
  }

  return { valid: true };
}

export function validateExporterDetailSection(
  value: ExporterDetailFlattened,
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: ExporterDetail } {
  const errors: FieldFormatError[] = [];

  const addressLine1 = glweValidation.validationRules.validateAddressLine1(
    value.exporterAddressLine1,
    'ExporterDetail',
    locale,
    context,
  );
  if (!addressLine1.valid) {
    errors.push(...addressLine1.errors.fieldFormatErrors);
  } else {
    value.exporterAddressLine1 = addressLine1.value;
  }

  const addressLine2 = glweValidation.validationRules.validateAddressLine2(
    value.exporterAddressLine2,
    'ExporterDetail',
    locale,
    context,
  );
  if (!addressLine2.valid) {
    errors.push(...addressLine2.errors.fieldFormatErrors);
  } else {
    value.exporterAddressLine2 = addressLine2.value ?? '';
  }

  const townOrCity = glweValidation.validationRules.validateTownOrCity(
    value.exporterTownOrCity,
    'ExporterDetail',
    locale,
    context,
  );
  if (!townOrCity.valid) {
    errors.push(...townOrCity.errors.fieldFormatErrors);
  } else {
    value.exporterTownOrCity = townOrCity.value;
  }
  const postcode = glweValidation.validationRules.validatePostcode(
    value.exporterPostcode,
    'ExporterDetail',
    locale,
    context,
  );
  if (!postcode.valid) {
    errors.push(...postcode.errors.fieldFormatErrors);
  } else {
    value.exporterPostcode = postcode.value ?? '';
  }

  const country = glweValidation.validationRules.validateCountry(
    value.exporterCountry,
    'ExporterDetail',
    locale,
    context,
  );
  if (!country.valid) {
    errors.push(...country.errors.fieldFormatErrors);
  } else {
    value.exporterCountry = country.value;
  }

  const organisationName =
    glweValidation.validationRules.validateOrganisationName(
      value.exporterOrganisationName,
      'ExporterDetail',
      locale,
      context,
    );
  if (!organisationName.valid) {
    errors.push(...organisationName.errors.fieldFormatErrors);
  } else {
    value.exporterOrganisationName = organisationName.value;
  }

  const fullName = glweValidation.validationRules.validateFullName(
    value.exporterContactFullName,
    'ExporterDetail',
    locale,
    context,
  );
  if (!fullName.valid) {
    errors.push(...fullName.errors.fieldFormatErrors);
  } else {
    value.exporterContactFullName = fullName.value;
  }

  const emailAddress = glweValidation.validationRules.validateEmailAddress(
    value.exporterEmailAddress,
    'ExporterDetail',
    locale,
    context,
  );
  if (!emailAddress.valid) {
    errors.push(...emailAddress.errors.fieldFormatErrors);
  } else {
    value.exporterEmailAddress = emailAddress.value;
  }
  const phoneNumber = glweValidation.validationRules.validatePhoneNumber(
    value.exporterContactPhoneNumber.replace(/'/g, ''),
    'ExporterDetail',
    locale,
    context,
  );
  if (!phoneNumber.valid) {
    errors.push(...phoneNumber.errors.fieldFormatErrors);
  } else {
    value.exporterContactPhoneNumber = phoneNumber.value;
  }

  const faxNumber = glweValidation.validationRules.validateFaxNumber(
    value.exporterFaxNumber.replace(/'/g, ''),
    'ExporterDetail',
    locale,
    context,
  );
  if (!faxNumber.valid) {
    errors.push(...faxNumber.errors.fieldFormatErrors);
  } else {
    value.exporterFaxNumber = faxNumber.value ?? '';
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
        phoneNumber: value.exporterContactPhoneNumber,
        faxNumber: !value.exporterFaxNumber
          ? undefined
          : value.exporterFaxNumber,
      },
    },
  };
}

export function validateImporterDetailSection(
  value: ImporterDetailFlattened,
  countryList: Country[],
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: ImporterDetail } {
  const section = 'ImporterDetail';
  const errors: FieldFormatError[] = [];
  const organisationNameValidationResult =
    glweValidation.validationRules.validateOrganisationName(
      value.importerOrganisationName,
      section,
      locale,
      context,
    );

  if (!organisationNameValidationResult.valid) {
    errors.push(...organisationNameValidationResult.errors.fieldFormatErrors);
  } else {
    value.importerOrganisationName = organisationNameValidationResult.value;
  }

  const addressValidationResult =
    glweValidation.validationRules.validateAddress(
      value.importerAddress,
      section,
      locale,
      context,
    );

  if (!addressValidationResult.valid) {
    errors.push(...addressValidationResult.errors.fieldFormatErrors);
  } else {
    value.importerAddress = addressValidationResult.value;
  }

  const countryValidationResult =
    glweValidation.validationRules.validateCountry(
      value.importerCountry,
      section,
      locale,
      context,
      countryList,
    );

  if (!countryValidationResult.valid) {
    errors.push(...countryValidationResult.errors.fieldFormatErrors);
  } else {
    value.importerCountry = countryValidationResult.value;
  }

  const contactFullNameValidationResult =
    glweValidation.validationRules.validateFullName(
      value.importerContactFullName,
      section,
      locale,
      context,
    );

  if (!contactFullNameValidationResult.valid) {
    errors.push(...contactFullNameValidationResult.errors.fieldFormatErrors);
  } else {
    value.importerContactFullName = contactFullNameValidationResult.value;
  }

  const phoneValidationResult =
    glweValidation.validationRules.validatePhoneNumber(
      value.importerContactPhoneNumber.replace(/'/g, ''),
      section,
      locale,
      context,
    );

  if (!phoneValidationResult.valid) {
    errors.push(...phoneValidationResult.errors.fieldFormatErrors);
  } else {
    value.importerContactPhoneNumber = phoneValidationResult.value;
  }

  const faxValidationResult = glweValidation.validationRules.validateFaxNumber(
    value.importerFaxNumber.replace(/'/g, ''),
    section,
    locale,
    context,
  );

  if (!faxValidationResult.valid) {
    errors.push(...faxValidationResult.errors.fieldFormatErrors);
  } else {
    value.importerFaxNumber = faxValidationResult.value ?? '';
  }

  const emailValidationResult =
    glweValidation.validationRules.validateEmailAddress(
      value.importerEmailAddress,
      section,
      locale,
      context,
    );

  if (!emailValidationResult.valid) {
    errors.push(...emailValidationResult.errors.fieldFormatErrors);
  } else {
    value.importerEmailAddress = emailValidationResult.value;
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
        phoneNumber: value.importerContactPhoneNumber,
        faxNumber: !value.importerFaxNumber
          ? undefined
          : value.importerFaxNumber,
      },
    },
  };
}

export function validateCollectionDateSection(
  value: CollectionDateFlattened,
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: CollectionDate } {
  const errors: FieldFormatError[] = [];

  let dateArr: string[] = [];
  let date: commonValidation.DateData = {
    day: '',
    month: '',
    year: '',
  };
  if (!value.wasteCollectionDate) {
    errors.push({
      field: 'CollectionDate',
      message: commonValidation.commonErrorMessages.emptyCollectionDate.en.csv,
    });
  } else {
    dateArr = value.wasteCollectionDate.replace(/-/g, '/').split('/');

    const collectionDateValidationResult =
      glweValidation.validationRules.validateCollectionDate(
        dateArr[0],
        dateArr[1],
        dateArr[2],
        locale,
        context,
      );

    if (!collectionDateValidationResult.valid) {
      errors.push(...collectionDateValidationResult.errors.fieldFormatErrors);
    } else {
      date = collectionDateValidationResult.value;
    }
  }

  const collectionDateTypeValidationResult =
    glweValidation.validationRules.validateCollectionDateType(
      value.estimatedOrActualCollectionDate,
    );

  let collectionDateType: 'EstimateDate' | 'ActualDate' = 'EstimateDate';
  if (!collectionDateTypeValidationResult.valid) {
    errors.push(...collectionDateTypeValidationResult.errors.fieldFormatErrors);
  } else {
    collectionDateType = collectionDateTypeValidationResult.value;
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
      type: collectionDateType,
      estimateDate: collectionDateType === 'EstimateDate' ? date : {},
      actualDate: collectionDateType === 'ActualDate' ? date : {},
    },
  };
}

export function validateCarriersSection(
  value: CarriersFlattened,
  transport: boolean,
  countryIncludingUkList: Country[],
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: Carrier[] } {
  const section = 'Carriers';
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
  const carriers: Carrier[] = [];
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

    const organisationNameValidationResult =
      glweValidation.validationRules.validateOrganisationName(
        c.carrierOrganisationName,
        section,
        locale,
        context,
        index,
      );

    if (!organisationNameValidationResult.valid) {
      errorCount +=
        organisationNameValidationResult.errors.fieldFormatErrors.length;
      errors.push(...organisationNameValidationResult.errors.fieldFormatErrors);
    } else {
      c.carrierOrganisationName = organisationNameValidationResult.value;
    }

    const addressValidationResult =
      glweValidation.validationRules.validateAddress(
        c.carrierAddress,
        section,
        locale,
        context,
        index,
      );

    if (!addressValidationResult.valid) {
      errorCount += addressValidationResult.errors.fieldFormatErrors.length;
      errors.push(...addressValidationResult.errors.fieldFormatErrors);
    } else {
      c.carrierAddress = addressValidationResult.value;
    }

    const countryValidationResult =
      glweValidation.validationRules.validateCountry(
        c.carrierCountry,
        section,
        locale,
        context,
        countryIncludingUkList,
        index,
      );

    if (!countryValidationResult.valid) {
      errorCount += countryValidationResult.errors.fieldFormatErrors.length;
      errors.push(...countryValidationResult.errors.fieldFormatErrors);
    } else {
      c.carrierCountry = countryValidationResult.value;
    }

    const contactFullNameValidationResult =
      glweValidation.validationRules.validateFullName(
        c.carrierContactFullName,
        section,
        locale,
        context,
        index,
      );

    if (!contactFullNameValidationResult.valid) {
      errorCount +=
        contactFullNameValidationResult.errors.fieldFormatErrors.length;
      errors.push(...contactFullNameValidationResult.errors.fieldFormatErrors);
    } else {
      c.carrierContactFullName = contactFullNameValidationResult.value;
    }

    const phoneValidationResult =
      glweValidation.validationRules.validatePhoneNumber(
        c.carrierContactPhoneNumber.replace(/'/g, ''),
        section,
        locale,
        context,
        index,
      );

    if (!phoneValidationResult.valid) {
      errorCount += phoneValidationResult.errors.fieldFormatErrors.length;
      errors.push(...phoneValidationResult.errors.fieldFormatErrors);
    } else {
      c.carrierContactPhoneNumber = phoneValidationResult.value;
    }

    const faxValidationResult =
      glweValidation.validationRules.validateFaxNumber(
        c.carrierFaxNumber.replace(/'/g, ''),
        section,
        locale,
        context,
        index,
      );

    if (!faxValidationResult.valid) {
      errorCount += faxValidationResult.errors.fieldFormatErrors.length;
      errors.push(...faxValidationResult.errors.fieldFormatErrors);
    } else {
      c.carrierFaxNumber = faxValidationResult.value ?? '';
    }

    const emailValidationResult =
      glweValidation.validationRules.validateEmailAddress(
        c.carrierEmailAddress,
        section,
        locale,
        context,
        index,
      );

    if (!emailValidationResult.valid) {
      errorCount += emailValidationResult.errors.fieldFormatErrors.length;
      errors.push(...emailValidationResult.errors.fieldFormatErrors);
    } else {
      c.carrierEmailAddress = emailValidationResult.value;
    }

    if (transport) {
      const meansOfTransportValidationResult =
        glweValidation.validationRules.validateCarrierMeansOfTransport(
          c.carrierMeansOfTransport,
          locale,
          context,
          index,
        );

      if (!meansOfTransportValidationResult.valid) {
        errorCount +=
          meansOfTransportValidationResult.errors.fieldFormatErrors.length;
        errors.push(
          ...meansOfTransportValidationResult.errors.fieldFormatErrors,
        );
      } else {
        c.carrierMeansOfTransport = meansOfTransportValidationResult.value;
      }

      const meansOfTransportDetailsValidationResult =
        glweValidation.validationRules.validateCarrierMeansOfTransportDetails(
          locale,
          context,
          c.carrierMeansOfTransportDetails,
          index,
        );

      if (!meansOfTransportDetailsValidationResult.valid) {
        errorCount +=
          meansOfTransportDetailsValidationResult.errors.fieldFormatErrors
            .length;
        errors.push(
          ...meansOfTransportDetailsValidationResult.errors.fieldFormatErrors,
        );
      } else {
        c.carrierMeansOfTransportDetails =
          meansOfTransportDetailsValidationResult.value ?? '';
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
          phoneNumber: c.carrierContactPhoneNumber,
          faxNumber: !c.carrierFaxNumber ? undefined : c.carrierFaxNumber,
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

export function validateWasteCodeSubSectionAndCarriersCrossSection(
  wasteCodeSubSection: WasteDescription['wasteCode'],
  carriers: CarriersFlattened,
):
  | { valid: false; value: InvalidAttributeCombinationError[] }
  | { valid: true } {
  const transportValidationResult =
    glweValidation.validationRules.validateWasteCodeSubSectionAndCarriersCrossSection(
      wasteCodeSubSection,
      [
        {
          type: carriers.firstCarrierMeansOfTransport as
            | 'Road'
            | 'Air'
            | 'Sea'
            | 'Rail'
            | 'InlandWaterways',
          description: carriers.firstCarrierMeansOfTransportDetails,
        },
        {
          type: carriers.secondCarrierMeansOfTransport as
            | 'Road'
            | 'Air'
            | 'Sea'
            | 'Rail'
            | 'InlandWaterways',
          description: carriers.secondCarrierMeansOfTransportDetails,
        },
        {
          type: carriers.thirdCarrierMeansOfTransport as
            | 'Road'
            | 'Air'
            | 'Sea'
            | 'Rail'
            | 'InlandWaterways',
          description: carriers.thirdCarrierMeansOfTransportDetails,
        },
        {
          type: carriers.fourthCarrierMeansOfTransport as
            | 'Road'
            | 'Air'
            | 'Sea'
            | 'Rail'
            | 'InlandWaterways',
          description: carriers.fourthCarrierMeansOfTransportDetails,
        },
        {
          type: carriers.fifthCarrierMeansOfTransport as
            | 'Road'
            | 'Air'
            | 'Sea'
            | 'Rail'
            | 'InlandWaterways',
          description: carriers.fifthCarrierMeansOfTransportDetails,
        },
      ],
    );

  if (
    !transportValidationResult.valid &&
    transportValidationResult.errors.invalidStructureErrors
  ) {
    return {
      valid: false,
      value: transportValidationResult.errors.invalidStructureErrors,
    };
  }

  return {
    valid: true,
  };
}

export function validateCollectionDetailSection(
  value: CollectionDetailFlattened,
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: CollectionDetail } {
  const errors: FieldFormatError[] = [];

  const organisationNameValidationResult =
    glweValidation.validationRules.validateOrganisationName(
      value.wasteCollectionOrganisationName,
      'CollectionDetail',
      locale,
      context,
    );

  if (!organisationNameValidationResult.valid) {
    errors.push(...organisationNameValidationResult.errors.fieldFormatErrors);
  } else {
    value.wasteCollectionOrganisationName =
      organisationNameValidationResult.value;
  }

  const addressLine1ValidationResult =
    glweValidation.validationRules.validateAddressLine1(
      value.wasteCollectionAddressLine1,
      'CollectionDetail',
      locale,
      context,
    );

  if (!addressLine1ValidationResult.valid) {
    errors.push(...addressLine1ValidationResult.errors.fieldFormatErrors);
  } else {
    value.wasteCollectionAddressLine1 = addressLine1ValidationResult.value;
  }

  const addressLine2ValidationResult =
    glweValidation.validationRules.validateAddressLine2(
      value.wasteCollectionAddressLine2,
      'CollectionDetail',
      locale,
      context,
    );

  if (!addressLine2ValidationResult.valid) {
    errors.push(...addressLine2ValidationResult.errors.fieldFormatErrors);
  } else {
    value.wasteCollectionAddressLine2 =
      addressLine2ValidationResult.value ?? '';
  }

  const townOrCityValidationResult =
    glweValidation.validationRules.validateTownOrCity(
      value.wasteCollectionTownOrCity,
      'CollectionDetail',
      locale,
      context,
    );

  if (!townOrCityValidationResult.valid) {
    errors.push(...townOrCityValidationResult.errors.fieldFormatErrors);
  } else {
    value.wasteCollectionTownOrCity = townOrCityValidationResult.value;
  }

  const countryValidationResult =
    glweValidation.validationRules.validateCountry(
      value.wasteCollectionCountry,
      'CollectionDetail',
      locale,
      context,
    );

  if (!countryValidationResult.valid) {
    errors.push(...countryValidationResult.errors.fieldFormatErrors);
  } else {
    value.wasteCollectionCountry = countryValidationResult.value;
  }

  const postcodeValidationResult =
    glweValidation.validationRules.validatePostcode(
      value.wasteCollectionPostcode,
      'CollectionDetail',
      locale,
      context,
    );

  if (!postcodeValidationResult.valid) {
    errors.push(...postcodeValidationResult.errors.fieldFormatErrors);
  } else {
    value.wasteCollectionPostcode = postcodeValidationResult.value ?? '';
  }

  const fullNameValidationResult =
    glweValidation.validationRules.validateFullName(
      value.wasteCollectionContactFullName,
      'CollectionDetail',
      locale,
      context,
    );

  if (!fullNameValidationResult.valid) {
    errors.push(...fullNameValidationResult.errors.fieldFormatErrors);
  } else {
    value.wasteCollectionContactFullName = fullNameValidationResult.value;
  }

  const phoneNumberValidationResult =
    glweValidation.validationRules.validatePhoneNumber(
      value.wasteCollectionContactPhoneNumber.replace(/'/g, ''),
      'CollectionDetail',
      locale,
      context,
    );

  if (!phoneNumberValidationResult.valid) {
    errors.push(...phoneNumberValidationResult.errors.fieldFormatErrors);
  } else {
    value.wasteCollectionContactPhoneNumber = phoneNumberValidationResult.value;
  }

  const faxNumberValidationResult =
    glweValidation.validationRules.validateFaxNumber(
      value.wasteCollectionFaxNumber.replace(/'/g, ''),
      'CollectionDetail',
      locale,
      context,
    );

  if (!faxNumberValidationResult.valid) {
    errors.push(...faxNumberValidationResult.errors.fieldFormatErrors);
  } else {
    value.wasteCollectionFaxNumber = faxNumberValidationResult.value ?? '';
  }

  const emailAddressValidationResult =
    glweValidation.validationRules.validateEmailAddress(
      value.wasteCollectionEmailAddress,
      'CollectionDetail',
      locale,
      context,
    );

  if (!emailAddressValidationResult.valid) {
    errors.push(...emailAddressValidationResult.errors.fieldFormatErrors);
  } else {
    value.wasteCollectionEmailAddress = emailAddressValidationResult.value;
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
        phoneNumber: value.wasteCollectionContactPhoneNumber,
        faxNumber: !value.wasteCollectionFaxNumber
          ? undefined
          : value.wasteCollectionFaxNumber,
      },
    },
  };
}

export function validateUkExitLocationSection(
  value: ExitLocationFlattened,
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: UkExitLocation } {
  const ukExitLocationValidationResult =
    glweValidation.validationRules.validateUkExitLocation(
      value.whereWasteLeavesUk,
      locale,
      context,
    );

  if (!ukExitLocationValidationResult.valid) {
    return {
      valid: false,
      value: ukExitLocationValidationResult.errors.fieldFormatErrors,
    };
  }

  return {
    valid: true,
    value: ukExitLocationValidationResult.value,
  };
}

export function validateTransitCountriesSection(
  value: TransitCountriesFlattened,
  countryList: Country[],
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: TransitCountries } {
  const transitCountriesValidationResult =
    glweValidation.validationRules.validateTransitCountries(
      value.transitCountries && value.transitCountries.trim()
        ? [...new Set(value.transitCountries.trim().toUpperCase().split(';'))]
        : [],
      countryList,
      locale,
      context,
    );

  if (!transitCountriesValidationResult.valid) {
    return {
      valid: false,
      value: transitCountriesValidationResult.errors.fieldFormatErrors,
    };
  }

  return {
    valid: true,
    value: transitCountriesValidationResult.value,
  };
}

export function validateImporterDetailAndTransitCountriesCrossSection(
  importerDetail: ImporterDetail,
  transitCountries: TransitCountries,
):
  | { valid: false; value: InvalidAttributeCombinationError[] }
  | { valid: true } {
  const transitCountriesCrossValidationResult =
    glweValidation.validationRules.validateImporterDetailAndTransitCountriesCross(
      importerDetail,
      transitCountries,
      locale,
      context,
    );

  if (
    !transitCountriesCrossValidationResult.valid &&
    transitCountriesCrossValidationResult.errors.invalidStructureErrors
  ) {
    return {
      valid: false,
      value:
        transitCountriesCrossValidationResult.errors.invalidStructureErrors,
    };
  }

  return {
    valid: true,
  };
}

interface RecoveryFacilityEntry {
  organisationName: string;
  address: string;
  country: string;
  contactFullName: string;
  contactPhoneNumber: string;
  faxNumber: string;
  emailAddress: string;
  code: string;
}

function validateRecoveryFacilityEntry(
  values: RecoveryFacilityEntry[],
  type: RecoveryFacilityDetail['recoveryFacilityType']['type'],
  countryList: Country[],
  recoveryCodeList: RecoveryCode[],
  disposalCodeList: WasteCode[],
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: RecoveryFacilityDetail[] } {
  const section = 'RecoveryFacilityDetail';
  const errors: FieldFormatError[] = [];
  const recoveryFacilities: RecoveryFacilityDetail[] = [];
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

    const organisationNameValidationResult =
      glweValidation.validationRules.validateOrganisationName(
        v.organisationName,
        section,
        locale,
        context,
        index,
        type,
      );

    if (!organisationNameValidationResult.valid) {
      errorCount +=
        organisationNameValidationResult.errors.fieldFormatErrors.length;
      errors.push(...organisationNameValidationResult.errors.fieldFormatErrors);
    } else {
      v.organisationName = organisationNameValidationResult.value;
    }

    const addressValidationResult =
      glweValidation.validationRules.validateAddress(
        v.address,
        section,
        locale,
        context,
        index,
        type,
      );

    if (!addressValidationResult.valid) {
      errorCount += addressValidationResult.errors.fieldFormatErrors.length;
      errors.push(...addressValidationResult.errors.fieldFormatErrors);
    } else {
      v.address = addressValidationResult.value;
    }

    const countryValidationResult =
      glweValidation.validationRules.validateCountry(
        v.country,
        section,
        locale,
        context,
        countryList,
        index,
        type,
      );

    if (!countryValidationResult.valid) {
      errorCount += countryValidationResult.errors.fieldFormatErrors.length;
      errors.push(...countryValidationResult.errors.fieldFormatErrors);
    } else {
      v.country = countryValidationResult.value;
    }

    const contactFullNameValidationResult =
      glweValidation.validationRules.validateFullName(
        v.contactFullName,
        section,
        locale,
        context,
        index,
        type,
      );

    if (!contactFullNameValidationResult.valid) {
      errorCount +=
        contactFullNameValidationResult.errors.fieldFormatErrors.length;
      errors.push(...contactFullNameValidationResult.errors.fieldFormatErrors);
    } else {
      v.contactFullName = contactFullNameValidationResult.value;
    }

    const phoneValidationResult =
      glweValidation.validationRules.validatePhoneNumber(
        v.contactPhoneNumber.replace(/'/g, ''),
        section,
        locale,
        context,
        index,
        type,
      );

    if (!phoneValidationResult.valid) {
      errorCount += phoneValidationResult.errors.fieldFormatErrors.length;
      errors.push(...phoneValidationResult.errors.fieldFormatErrors);
    } else {
      v.contactPhoneNumber = phoneValidationResult.value;
    }

    const faxValidationResult =
      glweValidation.validationRules.validateFaxNumber(
        v.faxNumber.replace(/'/g, ''),
        section,
        locale,
        context,
        index,
        type,
      );

    if (!faxValidationResult.valid) {
      errorCount += faxValidationResult.errors.fieldFormatErrors.length;
      errors.push(...faxValidationResult.errors.fieldFormatErrors);
    } else {
      v.faxNumber = faxValidationResult.value ?? '';
    }

    const emailValidationResult =
      glweValidation.validationRules.validateEmailAddress(
        v.emailAddress,
        section,
        locale,
        context,
        index,
        type,
      );

    if (!emailValidationResult.valid) {
      errorCount += emailValidationResult.errors.fieldFormatErrors.length;
      errors.push(...emailValidationResult.errors.fieldFormatErrors);
    } else {
      v.emailAddress = emailValidationResult.value;
    }

    const codeValidationResult =
      glweValidation.validationRules.validateDisposalOrRecoveryCode(
        v.code,
        type === 'Laboratory'
          ? {
              type: type,
              codeList: disposalCodeList,
            }
          : {
              type: type,
              codeList: recoveryCodeList,
            },
        locale,
        context,
      );

    if (!codeValidationResult.valid) {
      errorCount += codeValidationResult.errors.fieldFormatErrors.length;
      errors.push(...codeValidationResult.errors.fieldFormatErrors);
    } else {
      v.code = codeValidationResult.value;
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
  disposalCodeList: WasteCode[],
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: RecoveryFacilityDetail[] } {
  let errors: FieldFormatError[] = [];
  let recoveryFacilityEntries: RecoveryFacilityDetail[] = [];

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
      disposalCodeList,
    );

    if (!laboratory.valid) {
      errors = errors.concat(laboratory.value);
    } else {
      recoveryFacilityEntries = recoveryFacilityEntries.concat(
        laboratory.value,
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
      disposalCodeList,
    );

    if (!interimSite.valid) {
      errors = errors.concat(interimSite.value);
    } else {
      recoveryFacilityEntries = recoveryFacilityEntries.concat(
        interimSite.value,
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
    disposalCodeList,
  );

  if (!recoveryFacilities.valid) {
    errors = errors.concat(recoveryFacilities.value);
  } else {
    recoveryFacilityEntries = recoveryFacilityEntries.concat(
      recoveryFacilities.value,
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

export function validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
  wasteCodeSubSection: WasteDescription['wasteCode'],
  recoveryFacilityDetail: RecoveryFacilityDetailFlattened,
):
  | { valid: false; value: InvalidAttributeCombinationError[] }
  | { valid: true } {
  const recoveryFacilityTypes: RecoveryFacilityDetail['recoveryFacilityType']['type'][] =
    [];
  if (wasteCodeSubSection.type === 'NotApplicable') {
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
      recoveryFacilityTypes.push('InterimSite');
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
      recoveryFacilityTypes.push('RecoveryFacility');
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
      recoveryFacilityTypes.push('Laboratory');
    }

    const recoveryFacilityTypesValidationResult =
      glweValidation.validationRules.validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
        wasteCodeSubSection,
        recoveryFacilityTypes,
      );

    if (
      !recoveryFacilityTypesValidationResult.valid &&
      recoveryFacilityTypesValidationResult.errors.invalidStructureErrors
    ) {
      return {
        valid: false,
        value:
          recoveryFacilityTypesValidationResult.errors.invalidStructureErrors,
      };
    }
  }

  return {
    valid: true,
  };
}
