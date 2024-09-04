import {
  ReferenceChar,
  BulkWasteQuantityValue,
  SmallWasteQuantityValue,
  FreeTextChar,
  CarrierTransportDescriptionChar,
} from './constraints';

export const ReferenceValidationErrorMessages = {
  empty: 'Enter a unique reference',
  charTooFew: `Your unique reference must be more than ${ReferenceChar.min} character`,
  charTooMany: `The unique reference must be ${ReferenceChar.max} characters or less`,
  invalid: 'The reference must only include letters a to z, and numbers',
};

export const BulkWasteQuantityValidationErrorMessages = {
  invalid: `The waste quantity must be between ${BulkWasteQuantityValue.greaterThan} and ${BulkWasteQuantityValue.lessThan}`,
};

export const SmallWasteQuantityValidationErrorMessages = {
  invalid: `Enter a weight ${SmallWasteQuantityValue.lessThanOrEqual}kg or under`,
};

export const WasteQuantityValidationErrorMessages = {
  empty: 'Enter quantity of waste',
  invalid: 'Enter the weight using only numbers and a full stop',
  tooMany:
    'Only enter one of the following; waste quantity in tonnes, kilograms, or cubic metres',
  missingType: "Enter either 'estimate' or 'actual' waste quantity",
  laboratory:
    'Only enter the weight as kilograms if you are sending unlisted waste to a laboratory',
  smallNonKg: 'Unlisted weight can only be measured in kilograms',
};

export const ExporterDetailValidationErrorMessages = {
  emptyOrganisationName: 'Enter the exporter organisation name',
  charTooManyOrganisationName: `The exporter organisation name must be less than ${FreeTextChar.max} characters`,
  emptyAddressLine1: 'Enter the exporter address',
  charTooManyAddressLine1: `The exporter address line 1 must be less than ${FreeTextChar.max} characters`,
  charTooManyAddressLine2: `The exporter address line 2 must be less than ${FreeTextChar.max} characters`,
  emptyTownOrCity: 'Enter the exporter town or city',
  charTooManyTownOrCity: `The exporter town or city must be less than ${FreeTextChar.max} characters`,
  emptyCountry: 'Enter the exporter country',
  invalidCountry:
    'The exporter country must only be England, Wales, Scotland or Northern Ireland',
  invalidPostcode: 'Enter the exporter postcode in the correct format',
  emptyContactFullName: 'Enter full name of exporter contact',
  charTooManyContactFullName: `The exporter contact full name must be less than ${FreeTextChar.max} characters`,
  emptyPhone: 'Enter exporter contact phone number',
  invalidPhone: 'Enter a real phone number for the exporter',
  invalidFax: 'Enter a real fax number for the exporter',
  emptyEmail: 'Enter exporter email address',
  invalidEmail: 'Enter a real email address for the exporter',
  charTooManyEmail: `The exporter email address must be less than ${FreeTextChar.max} characters`,
};

export const ImporterDetailValidationErrorMessages = {
  emptyOrganisationName: 'Enter the importer organisation name',
  charTooManyOrganisationName: `The importer organisation name must be less than ${FreeTextChar.max} characters`,
  emptyAddress: 'Enter the importer address',
  charTooManyAddress: `The importer address must be less than ${FreeTextChar.max} characters`,
  emptyCountry: 'Enter the importer country',
  invalidCountry: 'Enter the importer country in full',
  invalidCrossSectionCountry:
    'The importer country cannot be the same as a transit country',
  emptyContactFullName: 'Enter full name of importer contact',
  charTooManyContactFullName: `The importer contact full name must be less than ${FreeTextChar.max} characters`,
  emptyPhone: 'Enter importer contact phone number',
  invalidPhone: 'Enter a real phone number for the importer',
  invalidFax: 'Enter a real fax number for the importer',
  emptyEmail: 'Enter importer email address',
  invalidEmail: 'Enter a real email address for the importer',
  charTooManyEmail: `The importer email address must be less than ${FreeTextChar.max} characters`,
};

interface CarrierErrorMessages {
  emptyOrganisationName: string;
  charTooManyOrganisationName: string;
  emptyAddress: string;
  charTooManyAddress: string;
  emptyCountry: string;
  invalidCountry: string;
  emptyContactFullName: string;
  charTooManyContactFullName: string;
  emptyPhone: string;
  invalidPhone: string;
  invalidFax: string;
  emptyEmail: string;
  charTooManyEmail: string;
  invalidEmail: string;
  emptyTransport: string;
  charTooManyTransportDescription: string;
}

export const CarrierValidationErrorMessages: (
  carrierNumber: number,
) => CarrierErrorMessages = (carrierNumber) => {
  let carrierStr = '';
  switch (carrierNumber) {
    case 1:
      carrierStr = 'first';
      break;
    case 2:
      carrierStr = 'second';
      break;
    case 3:
      carrierStr = 'third';
      break;
    case 4:
      carrierStr = 'fourth';
      break;
    case 5:
      carrierStr = 'fifth';
      break;
    default:
      carrierStr = 'first';
      break;
  }

  return {
    emptyOrganisationName: `Enter the ${carrierStr} carrier organisation name`,
    charTooManyOrganisationName: `The ${carrierStr} carrier organisation name must be less than ${FreeTextChar.max} characters`,
    emptyAddress: `Enter the ${carrierStr} carrier address`,
    charTooManyAddress: `The ${carrierStr} carrier address must be less than ${FreeTextChar.max} characters`,
    emptyCountry: `Enter the ${carrierStr} carrier country`,
    invalidCountry: `Enter the ${carrierStr} carrier country in full`,
    emptyContactFullName: `Enter full name of ${carrierStr} carrier contact`,
    charTooManyContactFullName: `The ${carrierStr} carrier contact full name must be less than ${FreeTextChar.max} characters`,
    emptyPhone: `Enter ${carrierStr} carrier contact phone number`,
    invalidPhone: `Enter a real phone number for the ${carrierStr} carrier`,
    invalidFax: `Enter a real fax number for the ${carrierStr} carrier`,
    emptyEmail: `Enter ${carrierStr} carrier email address`,
    invalidEmail: `Enter a real email address for the ${carrierStr} carrier`,
    charTooManyEmail: `The ${carrierStr} carrier email address must be less than ${FreeTextChar.max} characters`,
    emptyTransport: `Enter ${carrierStr} carrier means of transport`,
    charTooManyTransportDescription: `The ${carrierStr} carrier transport details must be less than ${CarrierTransportDescriptionChar.max} characters`,
  };
};

export const CarriersCrossSectionValidationErrorMessages = {
  invalidTransport:
    'Do not enter any carrier means of transport if you are exporting unlisted waste',
  invalidTransportDescription:
    'Do not enter any carrier means of transport details if you are exporting unlisted waste',
};

export const CollectionDetailValidationErrorMessages = {
  emptyOrganisationName: 'Enter the waste collection organisation name',
  charTooManyOrganisationName: `The waste collection organisation name must be less than ${FreeTextChar.max} characters`,
  emptyAddressLine1: 'Enter the waste collection address',
  charTooManyAddressLine1: `The waste collection address line 1 must be less than ${FreeTextChar.max} characters`,
  charTooManyAddressLine2: `The waste collection address line 2 must be less than ${FreeTextChar.max} characters`,
  emptyTownOrCity: 'Enter the waste collection town or city',
  charTooManyTownOrCity: `The waste collection town or city must be less than ${FreeTextChar.max} characters`,
  emptyCountry: 'Enter the waste collection country',
  invalidCountry:
    'The waste collection country must only be England, Wales, Scotland or Northern Ireland',
  invalidPostcode: 'Enter the waste collection postcode in the correct format',
  emptyContactFullName: 'Enter full name of waste collection contact',
  charTooManyContactFullName: `The waste collection contact full name must be less than ${FreeTextChar.max} characters`,
  emptyPhone: 'Enter waste collection contact phone number',
  invalidPhone: 'Enter a real phone number for the waste collection',
  invalidFax: 'Enter a real fax number for the waste collection',
  emptyEmail: 'Enter waste collection email address',
  invalidEmail: 'Enter a real email address for the waste collection',
  charTooManyEmail: `The waste collection email address must be less than ${FreeTextChar.max} characters`,
};

export const TransitCountriesValidationErrorMessages = {
  invalid: 'Enter transit country in full',
  invalidCrossSection:
    'The transit country cannot be the same as the importer country',
};

interface RecoveryFacilityErrorMessages {
  emptyOrganisationName: string;
  charTooManyOrganisationName: string;
  emptyAddress: string;
  charTooManyAddress: string;
  emptyCountry: string;
  invalidCountry: string;
  emptyContactFullName: string;
  charTooManyContactFullName: string;
  emptyPhone: string;
  invalidPhone: string;
  invalidFax: string;
  emptyEmail: string;
  charTooManyEmail: string;
  invalidEmail: string;
  emptyCode: string;
  invalidCode: string;
}

export const RecoveryFacilityDetailValidationErrorMessages: (
  recoveryFacilityType: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
  recoveryFacilityNumber?: number,
) => RecoveryFacilityErrorMessages = (
  recoveryFacilityType,
  recoveryFacilityNumber,
) => {
  let typeStr = '';
  let codeStr = '';
  if (recoveryFacilityType === 'Laboratory') {
    typeStr = 'laboratory';
    codeStr = 'disposal';
  } else if (recoveryFacilityType === 'InterimSite') {
    typeStr = 'interim site';
    codeStr = 'recovery';
  } else {
    typeStr = 'recovery facility';
    codeStr = 'recovery';
    switch (recoveryFacilityNumber) {
      case 1:
        typeStr = `first ${typeStr}`;
        break;
      case 2:
        typeStr = `second ${typeStr}`;
        break;
      case 3:
        typeStr = `third ${typeStr}`;
        break;
      case 4:
        typeStr = `fourth ${typeStr}`;
        break;
      case 5:
        typeStr = `fifth ${typeStr}`;
        break;
      default:
        typeStr = `first ${typeStr}`;
        break;
    }
  }

  return {
    emptyOrganisationName: `Enter the ${typeStr} organisation name`,
    charTooManyOrganisationName: `The ${typeStr} organisation name must be less than ${FreeTextChar.max} characters`,
    emptyAddress: `Enter the ${typeStr} address`,
    charTooManyAddress: `The ${typeStr} address must be less than ${FreeTextChar.max} characters`,
    emptyCountry: `Enter the ${typeStr} country`,
    invalidCountry: `Enter the ${typeStr} country in full`,
    emptyContactFullName: `Enter full name of ${typeStr} contact`,
    charTooManyContactFullName: `The ${typeStr} contact full name must be less than ${FreeTextChar.max} characters`,
    emptyPhone: `Enter ${typeStr} contact phone number`,
    invalidPhone: `Enter a real phone number for the ${typeStr}`,
    invalidFax: `Enter a real fax number for the ${typeStr}`,
    emptyEmail: `Enter ${typeStr} email address`,
    invalidEmail: `Enter a real email address for the ${typeStr}`,
    charTooManyEmail: `The ${typeStr} email address must be less than ${FreeTextChar.max} characters`,
    emptyCode: `Enter a ${codeStr} code for the ${typeStr}`,
    invalidCode: `Enter ${typeStr} ${codeStr} code in correct format`,
  };
};

export const RecoveryFacilityDetailCrossSectionValidationErrorMessages = {
  invalidLaboratory:
    'Do not enter any laboratory details if you are exporting bulk waste',
  invalidInterimSite:
    'Do not enter any interim site details if you are exporting unlisted waste',
  invalidRecoveryFacility:
    'Do not enter any recovery facility details if you are exporting unlisted waste',
};
