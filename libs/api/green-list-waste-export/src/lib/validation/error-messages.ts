import { FreeTextChar } from './constraints';

export const WasteQuantityValidationErrorMessages = {
  tooMany:
    'Only enter one of the following; waste quantity in tonnes, kilograms, or cubic metres',
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
  emptyContactFullName: 'Enter full name of importer contact',
  charTooManyContactFullName: `The importer contact full name must be less than ${FreeTextChar.max} characters`,
  emptyPhone: 'Enter importer contact phone number',
  invalidPhone: 'Enter a real phone number for the importer',
  invalidFax: 'Enter a real fax number for the importer',
  emptyEmail: 'Enter importer email address',
  invalidEmail: 'Enter a real email address for the importer',
  charTooManyEmail: `The importer email address must be less than ${FreeTextChar.max} characters`,
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
