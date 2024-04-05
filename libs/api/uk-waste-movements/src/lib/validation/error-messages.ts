import { FreeTextChar, ReferenceChar } from './constraints';

export const ProducerValidationErrorMessages = {
  emptyOrganisationName: 'Enter the producer organisation name',
  charTooManyOrganisationName: `The producer organisation name must be less than ${FreeTextChar.max} characters`,
  emptyAddressLine1: 'Enter the producer address',
  charTooManyAddressLine1: `The producer address line 1 must be less than ${FreeTextChar.max} characters`,
  charTooManyAddressLine2: `The producer address line 2 must be less than ${FreeTextChar.max} characters`,
  emptyTownOrCity: 'Enter the producer town or city',
  charTooManyTownOrCity: `The producer town or city must be less than ${FreeTextChar.max} characters`,
  emptyCountry: 'Enter the producer country',
  invalidCountry:
    'The producer country must only be England, Wales, Scotland, or Northern Ireland',
  emptyPostcode: 'Enter the producer postcode',
  invalidPostcode: 'Enter the producer postcode in the correct format',
  emptyContactFullName: 'Enter full name of producer contact',
  charTooManyContactFullName: `The producer contact name must be less than ${FreeTextChar.max} characters`,
  emptyPhone: 'Enter producer contact phone number',
  invalidPhone: 'Enter producer contact phone number in correct format',
  emptyEmail: 'Enter producer contact email address',
  invalidEmail: 'Enter producer contact email address in correct format',
  charTooManyEmail: `The producer email address must be less than ${FreeTextChar.max} characters`,
  invalidSicCode: 'Enter producer SIC code in the correct format',
  emptyReference: 'Enter a unique reference',
  charTooFewReference: `Your unique reference must be more than ${ReferenceChar.min} character`,
  charTooManyReference: `The unique reference must be ${ReferenceChar.max} characters or less`,
  invalidReference:
    'The reference must only include letters a to z, and numbers',
};
