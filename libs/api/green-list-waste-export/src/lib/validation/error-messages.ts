import { FreeTextChar } from './constraints';

export const WasteQuantityValidationErrorMessages = {
  tooMany:
    'Only enter one of the following; waste quantity in tonnes, kilograms, or cubic metres',
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
