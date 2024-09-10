import {
  Context,
  Locale,
  ValidationResult as commonValidationResult,
  commonConstraints,
  commonErrorMessages,
  commonValidationRules,
} from '../common';
import {
  UkExitLocation,
  WasteCode,
  WasteCodeType,
  WasteDescription,
  Country,
  ImporterDetail,
  TransitCountry,
  Carrier,
  WasteQuantityData,
  WasteQuantity,
} from './model';
import * as constraints from './constraints';
import * as regex from './regex';
import * as errorMessages from './error-messages';
import {
  FieldFormatError,
  InvalidAttributeCombinationError,
  Section,
  ValidationResult,
} from './dto';
import {
  CarrierTransportDescriptionChar,
  UkExitLocationChar,
} from './constraints';

const carrierMeansOfTransport = [
  'Road',
  'Rail',
  'Sea',
  'Air',
  'InlandWaterways',
];

export function validateWasteCode(
  value: string,
  type: WasteDescription['wasteCode']['type'],
  wasteCodeList: WasteCodeType[],
  locale: Locale = 'en',
  context: Context = 'api',
): ValidationResult<WasteDescription['wasteCode']> {
  if (type !== 'NotApplicable') {
    let filteredWasteCodeList: WasteCode[];
    let reformattedValue = value.trim();
    if (context === 'csv') {
      reformattedValue = reformattedValue.replace(/\s/g, '').toUpperCase();
    } else {
      if (type !== 'AnnexIIIA') {
        reformattedValue = reformattedValue.toUpperCase();
      }
    }

    if (type === 'AnnexIIIA') {
      const codeArr = reformattedValue.split(';');
      if (codeArr.length > 1) {
        if (
          codeArr.some(
            (c) =>
              c.replace(/\s/g, '').length !== constraints.WasteCodeLength.max,
          )
        ) {
          return {
            valid: false,
            errors: {
              fieldFormatErrors: [
                {
                  field: 'WasteDescription',
                  message:
                    errorMessages.invalidWasteCode[type][locale][context],
                },
              ],
            },
          };
        }
        filteredWasteCodeList = wasteCodeList
          .filter((c) => c.type === type)[0]
          .values.filter((v) =>
            codeArr.every((c) => v.code.includes(c.replace(/\s/g, ''))),
          );
      } else {
        filteredWasteCodeList = wasteCodeList
          .filter((c) => c.type === type)[0]
          .values.filter((v) => v.code === reformattedValue);
      }
    } else {
      filteredWasteCodeList = wasteCodeList
        .filter((c) => c.type === type)[0]
        .values.filter((v) => v.code === reformattedValue);
    }

    if (filteredWasteCodeList.length !== 1) {
      return {
        valid: false,
        errors: {
          fieldFormatErrors: [
            {
              field: 'WasteDescription',
              message: errorMessages.invalidWasteCode[type][locale][context],
            },
          ],
        },
      };
    } else {
      return {
        valid: true,
        value: {
          type: type,
          code: filteredWasteCodeList[0].code,
        },
      };
    }
  }

  return {
    valid: true,
    value: { type: type },
  };
}

export function validateEwcCodes(
  values: string[],
  ewcCodeList: WasteCode[],
  locale: Locale = 'en',
  context: Context = 'api',
): ValidationResult<WasteDescription['ewcCodes']> {
  let ewcCodes: WasteDescription['ewcCodes'];
  if (values.length === 0) {
    return {
      valid: false,
      errors: {
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.emptyEwcCodes[locale][context],
          },
        ],
      },
    };
  } else {
    if (values.length > constraints.EWCCodesLength.max) {
      return {
        valid: false,
        errors: {
          fieldFormatErrors: [
            {
              field: 'WasteDescription',
              message:
                errorMessages.tooManyEwcCodes[locale][
                  context as Exclude<Context, 'ui'>
                ],
            },
          ],
        },
      };
    } else if (
      !values.every((val) =>
        ewcCodeList.map((v) => v.code).includes(val.replace(/\s/g, '')),
      )
    ) {
      return {
        valid: false,
        errors: {
          fieldFormatErrors: [
            {
              field: 'WasteDescription',
              message: errorMessages.invalidEwcCodes[locale][context],
            },
          ],
        },
      };
    } else {
      ewcCodes = values.map((c) => {
        return { code: c };
      });
    }
  }

  return {
    valid: true,
    value: ewcCodes,
  };
}

export function validateNationalCode(
  value?: string,
  locale: Locale = 'en',
  context: Context = 'api',
): ValidationResult<WasteDescription['nationalCode']> {
  let nationalCode: WasteDescription['nationalCode'] = {
    provided: 'No',
  };
  if (value) {
    if (!regex.nationalCodeRegex.test(value)) {
      return {
        valid: false,
        errors: {
          fieldFormatErrors: [
            {
              field: 'WasteDescription',
              message: errorMessages.invalidNationalCode[locale][context],
            },
          ],
        },
      };
    }

    nationalCode = { provided: 'Yes', value: value };
  }

  return {
    valid: true,
    value: nationalCode,
  };
}

export function validateWasteDecription(
  value?: string,
  locale: Locale = 'en',
  context: Context = 'api',
): ValidationResult<string> {
  if (!value) {
    return {
      valid: false,
      errors: {
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.emptyWasteDescription[locale][context],
          },
        ],
      },
    };
  }

  value = value.trim();
  if (value.length < constraints.WasteDescriptionChar.min) {
    return {
      valid: false,
      errors: {
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message:
              errorMessages.charTooFewWasteDescription[locale][
                context as Exclude<Context, 'ui'>
              ],
          },
        ],
      },
    };
  }

  if (value.length > constraints.WasteDescriptionChar.max) {
    return {
      valid: false,
      errors: {
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.charTooManyWasteDescription[locale][context],
          },
        ],
      },
    };
  }

  return {
    valid: true,
    value: value,
  };
}

export function validateCollectionDateType(
  value: string,
): commonValidationResult<'EstimateDate' | 'ActualDate'> {
  let collectionDateType = '';
  const quantityType = value.replace(/\s/g, '').toLowerCase();
  if (quantityType === 'actual') {
    collectionDateType = 'ActualDate';
  } else if (quantityType === 'estimate') {
    collectionDateType = 'EstimateDate';
  } else {
    return {
      valid: false,
      errors: ['invalid'],
    };
  }

  return {
    valid: true,
    value: collectionDateType as 'EstimateDate' | 'ActualDate',
  };
}

export function validateOrganisationName(
  organisationName: string | undefined,
  section: Section,
  locale: Locale = 'en',
  context: Context = 'api',
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
): ValidationResult<string> {
  const result =
    commonValidationRules.validateOrganisationName(organisationName);
  if (!result.valid) {
    const fieldFormatErrors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'empty':
          fieldFormatErrors.push({
            field: section,
            message: errorMessages.emptyOrganisationName(
              section,
              index,
              recoveryFacilityType,
            )[locale][context],
          });
          break;
        case 'charTooMany':
          fieldFormatErrors.push({
            field: section,
            message: errorMessages.charTooManyOrganisationName(
              section,
              index,
              recoveryFacilityType,
            )[locale][context],
          });
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: { fieldFormatErrors },
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

export function validateAddress(
  address: string | undefined,
  section: Exclude<Section, 'ExporterDetail' | 'CollectionDetail'>,
  locale: Locale = 'en',
  context: Context = 'api',
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
): ValidationResult<string> {
  const trimmedAddress = address?.trim();
  if (!trimmedAddress) {
    return {
      valid: false,
      errors: {
        fieldFormatErrors: [
          {
            field: section,
            message: errorMessages.emptyAddress(
              section,
              index,
              recoveryFacilityType,
            )[locale][context],
          },
        ],
      },
    };
  } else {
    if (trimmedAddress.length > commonConstraints.FreeTextChar.max) {
      return {
        valid: false,
        errors: {
          fieldFormatErrors: [
            {
              field: section,
              message: errorMessages.charTooManyAddress(
                section,
                index,
                recoveryFacilityType,
              )[locale][context],
            },
          ],
        },
      };
    }
  }

  return {
    valid: true,
    value: trimmedAddress,
  };
}

export function validateAddressLine1(
  addressLine1: string | undefined,
  section: Exclude<
    Section,
    'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
  >,
  locale: Locale = 'en',
  context: Context = 'api',
): ValidationResult<string> {
  const result = commonValidationRules.validateAddressLine1(addressLine1);
  if (!result.valid) {
    const fieldFormatErrors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'empty':
          fieldFormatErrors.push({
            field: section,
            message: errorMessages.emptyAddressLine1(section)[locale][context],
          });
          break;
        case 'charTooMany':
          fieldFormatErrors.push({
            field: section,
            message:
              errorMessages.charTooManyAddressLine1(section)[locale][context],
          });
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: { fieldFormatErrors },
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

export function validateAddressLine2(
  addressLine2: string | undefined,
  section: Exclude<
    Section,
    'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
  >,
  locale: Locale = 'en',
  context: Context = 'api',
): ValidationResult<string | undefined> {
  const result = commonValidationRules.validateAddressLine2(addressLine2);
  if (!result.valid) {
    const fieldFormatErrors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'charTooMany':
          fieldFormatErrors.push({
            field: section,
            message:
              errorMessages.charTooManyAddressLine2(section)[locale][context],
          });
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: { fieldFormatErrors },
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

export function validatePostcode(
  postcode: string | undefined,
  section: Exclude<
    Section,
    'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
  >,
  locale: Locale = 'en',
  context: Context = 'api',
): ValidationResult<string | undefined> {
  const result = commonValidationRules.validatePostcode(postcode);
  if (!result.valid) {
    const fieldFormatErrors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'invalid':
          fieldFormatErrors.push({
            field: section,
            message: errorMessages.invalidPostcode(section)[locale][context],
          });
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: { fieldFormatErrors },
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

export function validateTownOrCity(
  townOrCity: string | undefined,
  section: Exclude<
    Section,
    'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
  >,
  locale: Locale = 'en',
  context: Context = 'api',
): ValidationResult<string> {
  const result = commonValidationRules.validateTownOrCity(townOrCity);
  if (!result.valid) {
    const fieldFormatErrors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'empty':
          fieldFormatErrors.push({
            field: section,
            message: errorMessages.emptyTownOrCity(section)[locale][context],
          });
          break;
        case 'charTooMany':
          fieldFormatErrors.push({
            field: section,
            message:
              errorMessages.charTooManyTownOrCity(section)[locale][context],
          });
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: { fieldFormatErrors },
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

function validateCountryInternational(
  countryList: Country[],
  country?: string,
): commonValidationResult<string> {
  const trimmedCountry = country?.trim();
  if (!trimmedCountry) {
    return {
      valid: false,
      errors: ['empty'],
    };
  }

  const filteredCountryList = countryList.filter((c) =>
    c.name.toUpperCase().includes(trimmedCountry.toUpperCase()),
  );
  if (filteredCountryList.length !== 1) {
    return {
      valid: false,
      errors: ['invalid'],
    };
  } else {
    country = filteredCountryList[0].name;
  }

  return {
    valid: true,
    value: country,
  };
}

export function validateCountry(
  country: string | undefined,
  section: Section,
  locale: Locale = 'en',
  context: Context = 'api',
  countryList?: Country[],
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
): ValidationResult<string> {
  let result: commonValidationResult<string>;
  if (section === 'ExporterDetail' || section === 'CollectionDetail') {
    result = commonValidationRules.validateCountry(country);
  } else {
    result = validateCountryInternational(countryList as Country[], country);
  }

  if (!result.valid) {
    const fieldFormatErrors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'empty':
          fieldFormatErrors.push({
            field: section,
            message: errorMessages.emptyCountry(
              section,
              index,
              recoveryFacilityType,
            )[locale][context],
          });
          break;
        case 'invalid':
          fieldFormatErrors.push({
            field: section,
            message: errorMessages.invalidCountry(
              section,
              index,
              recoveryFacilityType,
            )[locale][context],
          });
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: { fieldFormatErrors },
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

export function validateFullName(
  fullName: string | undefined,
  section: Section,
  locale: Locale = 'en',
  context: Context = 'api',
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
): ValidationResult<string> {
  const result = commonValidationRules.validateFullName(fullName);
  if (!result.valid) {
    const fieldFormatErrors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'empty':
          fieldFormatErrors.push({
            field: section,
            message: errorMessages.emptyContactFullName(
              section,
              index,
              recoveryFacilityType,
            )[locale][context],
          });
          break;
        case 'charTooMany':
          fieldFormatErrors.push({
            field: section,
            message: errorMessages.charTooManyContactFullName(
              section,
              index,
              recoveryFacilityType,
            )[locale][context],
          });
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: { fieldFormatErrors },
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

export function validateEmailAddress(
  emailAddress: string | undefined,
  section: Section,
  locale: Locale = 'en',
  context: Context = 'api',
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
): ValidationResult<string> {
  const result = commonValidationRules.validateEmailAddress(emailAddress);
  if (!result.valid) {
    const fieldFormatErrors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'empty':
          fieldFormatErrors.push({
            field: section,
            message: errorMessages.emptyEmail(
              section,
              index,
              recoveryFacilityType,
            )[locale][context],
          });
          break;
        case 'charTooMany':
          fieldFormatErrors.push({
            field: section,
            message: errorMessages.charTooManyEmail(
              section,
              index,
              recoveryFacilityType,
            )[locale][context],
          });
          break;
        case 'invalid':
          fieldFormatErrors.push({
            field: section,
            message: errorMessages.invalidEmail(
              section,
              index,
              recoveryFacilityType,
            )[locale][context],
          });
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: { fieldFormatErrors },
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

function validatePhoneNumberInternational(
  phoneNumber?: string,
): commonValidationResult<string> {
  const trimmedPhoneNumber = phoneNumber?.trim();
  if (!trimmedPhoneNumber) {
    return {
      valid: false,
      errors: ['empty'],
    };
  }

  if (!regex.phoneInternationalRegex.test(trimmedPhoneNumber)) {
    return {
      valid: false,
      errors: ['invalid'],
    };
  }

  return {
    valid: true,
    value: trimmedPhoneNumber,
  };
}

export function validatePhoneNumber(
  phoneNumber: string | undefined,
  section: Section,
  locale: Locale = 'en',
  context: Context = 'api',
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
): ValidationResult<string> {
  let result: commonValidationResult<string>;
  if (section === 'ExporterDetail' || section === 'CollectionDetail') {
    result = commonValidationRules.validatePhoneNumber(phoneNumber);
  } else {
    result = validatePhoneNumberInternational(phoneNumber);
  }

  if (!result.valid) {
    const fieldFormatErrors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'empty':
          fieldFormatErrors.push({
            field: section,
            message: errorMessages.emptyPhone(
              section,
              index,
              recoveryFacilityType,
            )[locale][context],
          });
          break;
        case 'invalid':
          fieldFormatErrors.push({
            field: section,
            message: errorMessages.invalidPhone(
              section,
              index,
              recoveryFacilityType,
            )[locale][context],
          });
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: { fieldFormatErrors },
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

function validateFaxNumberInternational(
  faxNumber: string | undefined,
): commonValidationResult<string | undefined> {
  const trimmedFaxNumber = faxNumber?.trim();
  if (trimmedFaxNumber && !regex.faxInternationalRegex.test(trimmedFaxNumber)) {
    return {
      valid: false,
      errors: ['invalid'],
    };
  }

  return {
    valid: true,
    value: !trimmedFaxNumber ? undefined : trimmedFaxNumber,
  };
}

export function validateFaxNumber(
  faxNumber: string | undefined,
  section: Section,
  locale: Locale = 'en',
  context: Context = 'api',
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
): ValidationResult<string | undefined> {
  let result: commonValidationResult<string | undefined>;
  if (section === 'ExporterDetail' || section === 'CollectionDetail') {
    result = commonValidationRules.validateFaxNumber(faxNumber);
  } else {
    result = validateFaxNumberInternational(faxNumber);
  }

  if (!result.valid) {
    const fieldFormatErrors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'invalid':
          fieldFormatErrors.push({
            field: section,
            message: errorMessages.invalidFax(
              section,
              index,
              recoveryFacilityType,
            )[locale][context],
          });
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: { fieldFormatErrors },
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

export function validateCarrierMeansOfTransport(
  value: string,
  locale: Locale = 'en',
  context: Exclude<Context, 'ui' | 'api'> = 'csv',
  index?: number,
): ValidationResult<'Road' | 'Rail' | 'Sea' | 'Air' | 'InlandWaterways'> {
  if (!value || !value.trim()) {
    return {
      valid: false,
      errors: {
        fieldFormatErrors: [
          {
            field: 'Carriers',
            message: errorMessages.CarrierValidationErrorMessages(
              locale,
              context,
              index,
            ).emptyTransport,
          },
        ],
      },
    };
  } else {
    value =
      value !== 'InlandWaterways'
        ? commonValidationRules.titleCase(value).replace(/\s/g, '')
        : value;
    if (!carrierMeansOfTransport.includes(value)) {
      return {
        valid: false,
        errors: {
          fieldFormatErrors: [
            {
              field: 'Carriers',
              message: errorMessages.CarrierValidationErrorMessages(
                locale,
                context,
                index,
              ).emptyTransport,
            },
          ],
        },
      };
    }

    return {
      valid: true,
      value: value as 'Road' | 'Rail' | 'Sea' | 'Air' | 'InlandWaterways',
    };
  }
}

export function validateCarrierMeansOfTransportDetails(
  locale: Locale = 'en',
  context: Exclude<Context, 'ui'> = 'api',
  value?: string,
  index?: number,
): ValidationResult<string | undefined> {
  value = value?.trim();
  if (value && value.length > CarrierTransportDescriptionChar.max) {
    return {
      valid: false,
      errors: {
        fieldFormatErrors: [
          {
            field: 'Carriers',
            message: errorMessages.CarrierValidationErrorMessages(
              locale,
              context,
              index,
            ).charTooManyTransportDescription,
          },
        ],
      },
    };
  }

  return {
    valid: true,
    value: !value ? undefined : value,
  };
}

export function validateUkExitLocation(
  value?: string,
  locale: Locale = 'en',
  context: Context = 'api',
): ValidationResult<UkExitLocation> {
  value = value?.trim();
  let location: UkExitLocation = { provided: 'No' };

  if (value) {
    if (value.length > UkExitLocationChar.max) {
      return {
        valid: false,
        errors: {
          fieldFormatErrors: [
            {
              field: 'UkExitLocation',
              message: errorMessages.charTooManyUkExitLocation[locale][context],
            },
          ],
        },
      };
    }

    if (!regex.ukExitLocationRegex.test(value)) {
      return {
        valid: false,
        errors: {
          fieldFormatErrors: [
            {
              field: 'UkExitLocation',
              message: errorMessages.invalidUkExitLocation[locale][context],
            },
          ],
        },
      };
    }

    location = {
      provided: 'Yes',
      value: value,
    };
  }

  return {
    valid: true,
    value: location,
  };
}

export function validateTransitCountries(
  values: string[],
  countryList: Country[],
  locale: Locale = 'en',
  context: Context = 'api',
): ValidationResult<TransitCountry[]> {
  const countries: string[] = [];
  if (values.length > 0) {
    values = [...new Set(values.map((v) => v.toUpperCase().trim()))];
    for (let i = 0; i < values.length; i++) {
      const filteredCountryList = countryList.filter((v) =>
        v.name.toUpperCase().includes(values[i]),
      );
      if (filteredCountryList.length !== 1) {
        return {
          valid: false,
          errors: {
            fieldFormatErrors: [
              {
                field: 'TransitCountries',
                message: errorMessages.invalidTransitCountry[locale][context],
              },
            ],
          },
        };
      }
      countries.push(filteredCountryList[0].name);
    }
  }

  return { valid: true, value: countries };
}

export function validateImporterDetailAndTransitCountriesCross(
  importerDetail: ImporterDetail | Partial<ImporterDetail>,
  transitCountries: TransitCountry[],
  locale: Locale = 'en',
  context: Context = 'api',
): ValidationResult<undefined> {
  if (
    transitCountries.some(
      (c) => c && c === importerDetail.importerAddressDetails?.country,
    )
  ) {
    return {
      valid: false,
      errors: {
        invalidStructureErrors: [
          {
            fields: ['ImporterDetail', 'TransitCountries'],
            message:
              errorMessages.importerDetailInvalidCrossSectionTransitCountries[
                locale
              ][context],
          },
          {
            fields: ['ImporterDetail', 'TransitCountries'],
            message:
              errorMessages.transitCountriesInvalidCrossSectionImporterDetail[
                locale
              ][context],
          },
        ],
        fieldFormatErrors: [],
      },
    };
  }

  return { valid: true, value: undefined };
}

export function validateWasteCodeSubSectionAndCarriersCrossSection(
  wasteCodeSubSection: WasteDescription['wasteCode'],
  carrierTransportDetails: Carrier['transportDetails'][],
  locale: Locale = 'en',
  context: Exclude<Context, 'ui'> = 'api',
): ValidationResult<undefined> {
  if (
    wasteCodeSubSection.type === 'NotApplicable' &&
    carrierTransportDetails.length > 0
  ) {
    const errors: InvalidAttributeCombinationError[] = [];
    const meansOfTransportProvided = Object.values(
      carrierTransportDetails,
    ).some((el) => el?.type.trim() !== undefined && el?.type.trim() !== '');
    if (meansOfTransportProvided) {
      errors.push({
        fields: ['WasteDescription', 'Carriers'],
        message:
          errorMessages.invalidTransportCarriersCrossSection[locale][context],
      });
    }

    const meansOfTransportDescriptionProvided = Object.values(
      carrierTransportDetails,
    ).some(
      (el) =>
        el?.description?.trim() !== undefined && el?.description?.trim() !== '',
    );
    if (meansOfTransportDescriptionProvided) {
      errors.push({
        fields: ['WasteDescription', 'Carriers'],
        message:
          errorMessages.invalidTransportDescriptionCarriersCrossSection[locale][
            context
          ],
      });
    }

    if (errors.length > 0) {
      return {
        valid: false,
        errors: {
          invalidStructureErrors: errors,
          fieldFormatErrors: [],
        },
      };
    }
  }

  return { valid: true, value: undefined };
}

export function validateWasteQuantity(
  quantityType: 'Volume' | 'Weight',
  unit: 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre',
  value: string | number | undefined,
  locale: Locale = 'en',
  context: Context = 'api',
): ValidationResult<WasteQuantityData> {
  const safeValue = value?.toString() || '';
  if (!safeValue) {
    return {
      valid: false,
      errors: {
        fieldFormatErrors: [
          {
            field: 'WasteQuantity',
            message: errorMessages.emptyWasteQuantity[locale][context],
          },
        ],
      },
    };
  } else {
    if (!regex.wasteQuantityRegex.test(safeValue)) {
      return {
        valid: false,
        errors: {
          fieldFormatErrors: [
            {
              field: 'WasteQuantity',
              message: errorMessages.invalidWasteQuantity[locale][context],
            },
          ],
        },
      };
    } else {
      const parsedWasteQuantity = Number(parseFloat(safeValue).toFixed(2));

      if (unit === 'Kilogram') {
        if (
          !(
            parsedWasteQuantity >
              constraints.SmallWasteQuantityValue.greaterThan &&
            parsedWasteQuantity <=
              constraints.SmallWasteQuantityValue.lessThanOrEqual
          )
        ) {
          return {
            valid: false,
            errors: {
              fieldFormatErrors: [
                {
                  field: 'WasteQuantity',
                  message:
                    errorMessages.invalidSmallWasteQuantity[locale][context],
                },
              ],
            },
          };
        }
      } else if (
        !(
          parsedWasteQuantity >
            constraints.BulkWasteQuantityValue.greaterThan &&
          parsedWasteQuantity < constraints.BulkWasteQuantityValue.lessThan
        )
      ) {
        return {
          valid: false,
          errors: {
            fieldFormatErrors: [
              {
                field: 'WasteQuantity',
                message:
                  errorMessages.invalidBulkWasteQuantity[locale][context],
              },
            ],
          },
        };
      }

      return {
        valid: true,
        value: {
          quantityType: quantityType,
          unit: unit,
          value: parsedWasteQuantity,
        },
      };
    }
  }
}

export function validateWasteQuantityType(
  value: string,
): commonValidationResult<'EstimateData' | 'ActualData'> {
  let wasteQuantityType = '';
  const quantityType = value.replace(/\s/g, '').toLowerCase();
  if (quantityType === 'actual') {
    wasteQuantityType = 'ActualData';
  } else if (quantityType === 'estimate') {
    wasteQuantityType = 'EstimateData';
  } else {
    return {
      valid: false,
      errors: ['invalid'],
    };
  }

  return {
    valid: true,
    value: wasteQuantityType as 'EstimateData' | 'ActualData',
  };
}

export function validateWasteCodeSubSectionAndQuantityCrossSection(
  wasteCodeSubSection: WasteDescription['wasteCode'] | undefined,
  wasteQuantity:
    | WasteQuantity
    | {
        type?: 'NotApplicable' | 'EstimateData' | 'ActualData';
        estimateData?: WasteQuantity['estimateData'];
        actualData?: WasteQuantity['actualData'];
      }
    | undefined,
  locale: Locale = 'en',
  context: Context = 'api',
): ValidationResult<undefined> {
  if (
    wasteCodeSubSection?.type !== 'NotApplicable' &&
    (wasteQuantity?.actualData?.unit === 'Kilogram' ||
      wasteQuantity?.estimateData?.unit === 'Kilogram')
  ) {
    return {
      valid: false,
      errors: {
        invalidStructureErrors: [
          {
            fields: ['WasteDescription', 'WasteQuantity'],
            message: errorMessages.laboratoryWasteQuantity[locale][context],
          },
        ],
        fieldFormatErrors: [],
      },
    };
  }
  if (
    wasteCodeSubSection?.type === 'NotApplicable' &&
    (wasteQuantity?.type === 'EstimateData' ||
      wasteQuantity?.type === 'ActualData') &&
    (wasteQuantity?.estimateData?.unit === 'Cubic Metre' ||
      wasteQuantity?.actualData?.unit === 'Cubic Metre')
  ) {
    return {
      valid: false,
      errors: {
        invalidStructureErrors: [
          {
            fields: ['WasteDescription', 'WasteQuantity'],
            message: errorMessages.smallNonKgwasteQuantity[locale][context],
          },
        ],
        fieldFormatErrors: [],
      },
    };
  }
  if (
    wasteCodeSubSection?.type === 'NotApplicable' &&
    (wasteQuantity?.type === 'EstimateData' ||
      wasteQuantity?.type === 'ActualData') &&
    (wasteQuantity?.estimateData?.unit === 'Tonne' ||
      wasteQuantity?.actualData?.unit === 'Tonne')
  ) {
    return {
      valid: false,
      errors: {
        invalidStructureErrors: [
          {
            fields: ['WasteDescription', 'WasteQuantity'],
            message: errorMessages.smallNonKgwasteQuantity[locale][context],
          },
        ],
        fieldFormatErrors: [],
      },
    };
  }

  return { valid: true, value: undefined };
}

export function validateReference(
  reference: string | undefined,
  locale: Locale = 'en',
  context: Context = 'api',
): ValidationResult<string> {
  const result = commonValidationRules.validateReference(reference);
  if (!result.valid) {
    const errors: FieldFormatError[] = [];
    for (const error of result.errors) {
      switch (error) {
        case 'empty':
          errors.push({
            field: 'CustomerReference',
            message: commonErrorMessages.emptyReference[locale][context],
          });
          break;
        case 'charTooMany':
          errors.push({
            field: 'CustomerReference',
            message: commonErrorMessages.charTooManyReference[locale][context],
          });
          break;
        case 'invalid':
          errors.push({
            field: 'CustomerReference',
            message: commonErrorMessages.invalidReference[locale][context],
          });
          break;
        default:
          break;
      }
    }

    return {
      valid: false,
      errors: {
        fieldFormatErrors: errors,
      },
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}
