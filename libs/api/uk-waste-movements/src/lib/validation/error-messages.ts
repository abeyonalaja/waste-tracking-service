import {
  FreeTextChar,
  ReferenceChar,
  ReceiverEnvironmentalPermitNumberChar,
  WasteTransportationDetailsChar,
  WasteCollectionChar,
} from './constraints';

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

export const WasteCollectionDetailsErrorMessages = {
  emptyAddressLine1: 'Enter the waste collection address',
  charTooManyAddressLine1: `The waste collection address line 1 must be fewer than ${FreeTextChar.max} characters`,
  charTooManyAddressLine2: `The waste collection address line 2 must be fewer than ${FreeTextChar.max} characters`,
  emptyTownOrCity: 'Enter the waste collection town or city',
  charTooManyTownOrCity: `The waste collection town or city must be fewer than ${FreeTextChar.max} characters`,
  emptyCountry: 'Enter the waste collection country',
  invalidCountry:
    'The waste collection country must only be England, Wales, Scotland or Northern Ireland',
  invalidPostcode: 'Enter the waste collection postcode in the correct format',
  missingWasteSource: 'Enter a waste source',
  invalidWasteSource:
    'The waste source must only be Household, Local Authority, Construction, Demolition, Commercial or Industrial',
  charTooManyBrokerRegistrationNumber: `The broker registration number must be fewer than ${WasteCollectionChar.max} characters`,
  charTooManyCarrierRegistrationNumber: `The carrier registration number must be fewer than ${WasteCollectionChar.max} characters`,
  emptyModeOfTransport: 'Enter the mode of transport',
  invalidModeOfWasteTransport:
    'The mode of transport must only be Road, Rail, Air, Sea or Inland Waterway',
  missingWasteCollectionDate: 'Enter the expected Waste Collection Date',
  invalidFormatWasteCollectionDate:
    'Enter the expected waste collection date in the correct format',
};

export const ReceiverValidationErrorMessages = {
  emptyAuthorizationType: 'Enter the receiver authorization type',
  invalidAuthorizationTypeLength: `The receiver authorisation details must be less than ${FreeTextChar.max} characters`,
  invalidEnvironmentalPermitNumberLength: `The receiver permit number must be less than ${ReceiverEnvironmentalPermitNumberChar.max} characters`,
  emptyOrganisationName: 'Enter the receiver organisation name',
  charTooManyOrganisationName: `The receiver organisation name must be less than ${FreeTextChar.max} characters`,
  emptyAddressLine1: 'Enter the receiver address',
  charTooManyAddressLine1: `The receiver address line 1 must be less than ${FreeTextChar.max} characters`,
  charTooManyAddressLine2: `The receiver address line 2 must be less than ${FreeTextChar.max} characters`,
  emptyTownOrCity: 'Enter the receiver town or city',
  charTooManyTownOrCity: `The receiver town or city must be less than ${FreeTextChar.max} characters`,
  emptyCountry: 'Enter the receiver country',
  invalidCountry:
    'The receiver country must only be England, Wales, Scotland, or Northern Ireland',
  invalidPostcode: 'Enter the receiver postcode in the correct format',
  emptyContactFullName: 'Enter full name of receiver contact',
  charTooManyContactFullName: `The receiver contact name must be less than ${FreeTextChar.max} characters`,
  emptyPhone: 'Enter receiver contact phone number',
  invalidPhone: 'Enter receiver contact phone number in correct format',
  emptyEmail: 'Enter receiver contact email address',
  invalidEmail: 'Enter receiver contact email address in correct format',
  charTooManyEmail: `The receiver email address must be less than ${FreeTextChar.max} characters`,
  invalidReceiverAuthorizationType: 'Enter the receiver authorization type',
  invalidReceiverEnvironmentalPermitNumber:
    'Enter the receiver environmental permit number',
};

export const WasteTransportationValidationErrorMessages = {
  emptyNameAndTypeOfContainers: `Enter the number and type of containers`,
  charTooManyNameAndTypeOfContainers: `Number and type of transportation details must be less than ${WasteTransportationDetailsChar.max} characters`,
  charTooManySpecialHandlingRequirements: `The special handling requirements must be less than ${WasteTransportationDetailsChar.max} characters`,
};
