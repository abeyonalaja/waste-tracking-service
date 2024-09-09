import {
  Context,
  Locale,
  ValidationResult as commonValidationResult,
} from '../common';
import {
  UkExitLocation,
  WasteCode,
  WasteCodeType,
  WasteDescription,
  Country,
  ImporterDetail,
  TransitCountry,
} from './model';
import * as constraints from './constraints';
import * as regex from './regex';
import * as errorMessages from './error-messages';
import { ValidationResult } from './dto';
import { UkExitLocationChar } from './constraints';

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
            error: {
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
        error: {
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
      error: {
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
        error: {
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
        error: {
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
        error: {
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
      error: {
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
      error: {
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
      error: {
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
        error: {
          fieldFormatErrors: [
            {
              field: 'UkExitLocation',
              message:
                errorMessages.charTooManyUkExitLocation[locale][
                  context as Exclude<Context, 'ui'>
                ],
            },
          ],
        },
      };
    }

    if (!regex.ukExitLocationRegex.test(value)) {
      return {
        valid: false,
        error: {
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
  countryList: Country[],
  value?: string,
  locale: Locale = 'en',
  context: Context = 'api',
): ValidationResult<TransitCountry[]> {
  const countries: string[] = [];
  value = value?.trim();
  if (value) {
    const countryArr = [...new Set(value.trim().toUpperCase().split(';'))];

    for (let i = 0; i < countryArr.length; i++) {
      const filteredCountryList = countryList.filter((v) =>
        v.name.toUpperCase().includes(countryArr[i].trim()),
      );
      if (filteredCountryList.length !== 1) {
        return {
          valid: false,
          error: {
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
  context: Context = 'csv',
): ValidationResult<undefined> {
  if (
    transitCountries.some(
      (c) => c && c === importerDetail.importerAddressDetails?.country,
    )
  ) {
    return {
      valid: false,
      error: {
        invalidStructureErrors: [
          {
            fields: ['ImporterDetail', 'TransitCountries'],
            message:
              errorMessages.importerDetailsInvalidCrossSectionTransitCountry[
                locale
              ][context],
          },
          {
            fields: ['ImporterDetail', 'TransitCountries'],
            message:
              errorMessages.transitCountriesInvalidCrossSectionTransitCountry[
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
