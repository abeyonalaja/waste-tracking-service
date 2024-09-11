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
