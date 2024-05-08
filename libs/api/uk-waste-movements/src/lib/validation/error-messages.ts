import * as constraints from './constraints';

export const ProducerValidationErrorMessages = {
  emptyOrganisationName: 'Enter the producer organisation name',
  charTooManyOrganisationName: `The producer organisation name must be less than ${constraints.FreeTextChar.max} characters`,
  emptyAddressLine1: 'Enter the producer address',
  charTooManyAddressLine1: `The producer address line 1 must be less than ${constraints.FreeTextChar.max} characters`,
  charTooManyAddressLine2: `The producer address line 2 must be less than ${constraints.FreeTextChar.max} characters`,
  emptyTownOrCity: 'Enter the producer town or city',
  charTooManyTownOrCity: `The producer town or city must be less than ${constraints.FreeTextChar.max} characters`,
  emptyCountry: 'Enter the producer country',
  invalidCountry:
    'The producer country must only be England, Wales, Scotland, or Northern Ireland',
  invalidPostcode: 'Enter the producer postcode in the correct format',
  emptyContactFullName: 'Enter full name of producer contact',
  charTooManyContactFullName: `The producer contact name must be less than ${constraints.FreeTextChar.max} characters`,
  emptyPhone: 'Enter producer contact phone number',
  invalidPhone: 'Enter producer contact phone number in correct format',
  emptyEmail: 'Enter producer contact email address',
  invalidEmail: 'Enter producer contact email address in correct format',
  charTooManyEmail: `The producer email address must be less than ${constraints.FreeTextChar.max} characters`,
  invalidSicCode: 'Enter producer SIC code in the correct format',
  emptyReference: 'Enter a unique reference',
  charTooFewReference: `Your unique reference must be more than ${constraints.ReferenceChar.min} character`,
  charTooManyReference: `The unique reference must be ${constraints.ReferenceChar.max} characters or less`,
  invalidReference:
    'The reference must only include letters a to z, and numbers',
};

export const WasteCollectionErrorMessages = {
  emptyAddressLine1: 'Enter the waste collection address',
  charTooManyAddressLine1: `The waste collection address line 1 must be fewer than ${constraints.FreeTextChar.max} characters`,
  charTooManyAddressLine2: `The waste collection address line 2 must be fewer than ${constraints.FreeTextChar.max} characters`,
  emptyTownOrCity: 'Enter the waste collection town or city',
  charTooManyTownOrCity: `The waste collection town or city must be fewer than ${constraints.FreeTextChar.max} characters`,
  emptyCountry: 'Enter the waste collection country',
  invalidCountry:
    'The waste collection country must only be England, Wales, Scotland or Northern Ireland',
  invalidPostcode: 'Enter the waste collection postcode in the correct format',
  missingWasteSource: 'Enter a waste source',
  invalidWasteSource:
    'The waste source must only be Household, Local Authority, Construction, Demolition, Commercial or Industrial',
  charTooManyBrokerRegistrationNumber: `The broker registration number must be fewer than ${constraints.WasteCollectionChar.max} characters`,
  charTooManyCarrierRegistrationNumber: `The carrier registration number must be fewer than ${constraints.WasteCollectionChar.max} characters`,
  emptyModeOfTransport: 'Enter the mode of transport',
  invalidModeOfWasteTransport:
    'The mode of transport must only be Road, Rail, Air, Sea or Inland Waterway',
  missingWasteCollectionDate: 'Enter the expected Waste Collection Date',
  invalidFormatWasteCollectionDate:
    'Enter the expected waste collection date in the correct format',
};

export const ReceiverValidationErrorMessages = {
  emptyAuthorizationType: 'Enter the receiver authorization type',
  invalidAuthorizationTypeLength: `The receiver authorisation details must be less than ${constraints.FreeTextChar.max} characters`,
  invalidEnvironmentalPermitNumberLength: `The receiver permit number must be less than ${constraints.ReceiverEnvironmentalPermitNumberChar.max} characters`,
  emptyOrganisationName: 'Enter the receiver organisation name',
  charTooManyOrganisationName: `The receiver organisation name must be less than ${constraints.FreeTextChar.max} characters`,
  emptyAddressLine1: 'Enter the receiver address',
  charTooManyAddressLine1: `The receiver address line 1 must be less than ${constraints.FreeTextChar.max} characters`,
  charTooManyAddressLine2: `The receiver address line 2 must be less than ${constraints.FreeTextChar.max} characters`,
  emptyTownOrCity: 'Enter the receiver town or city',
  charTooManyTownOrCity: `The receiver town or city must be less than ${constraints.FreeTextChar.max} characters`,
  emptyCountry: 'Enter the receiver country',
  invalidCountry:
    'The receiver country must only be England, Wales, Scotland, or Northern Ireland',
  invalidPostcode: 'Enter the receiver postcode in the correct format',
  emptyContactFullName: 'Enter full name of receiver contact',
  charTooManyContactFullName: `The receiver contact name must be less than ${constraints.FreeTextChar.max} characters`,
  emptyPhone: 'Enter receiver contact phone number',
  invalidPhone: 'Enter receiver contact phone number in correct format',
  emptyEmail: 'Enter receiver contact email address',
  invalidEmail: 'Enter receiver contact email address in correct format',
  charTooManyEmail: `The receiver email address must be less than ${constraints.FreeTextChar.max} characters`,
  invalidReceiverAuthorizationType: 'Enter the receiver authorization type',
  invalidReceiverEnvironmentalPermitNumber:
    'Enter the receiver environmental permit number',
};

export const WasteTransportationValidationErrorMessages = {
  emptyNameAndTypeOfContainers: `Enter the number and type of containers`,
  charTooManyNameAndTypeOfContainers: `Number and type of transportation details must be less than ${constraints.FreeTextChar.max} characters`,
  charTooManySpecialHandlingRequirements: `The special handling requirements must be less than ${constraints.FreeTextChar.max} characters`,
};

export type WasteTypeErrorMessage = {
  emptyEwcCode: string;
  invalidEwcCode: string;
  emptyWasteDescription: string;
  charTooManyWasteDescription: string;
  emptyPhysicalForm: string;
  invalidPhysicalForm: string;
  emptyWasteQuantity: string;
  invalidWasteQuantity: string;
  valueTooSmallWasteQuantity: string;
  emptyWasteQuantityUnit: string;
  invalidWasteQuantityUnit: string;
  invalidWasteQuantityType: string;
  invalidHasHazardousProperties: string;
  emptyHazardousWasteCodes: string;
  invalidHazardousWasteCodes: (invalidHazardousCodes: string[]) => string;
  invalidContainsPops: string;
  invalidPops: (invalidPops: string[]) => string;
  invalidPopConcentration: string;
  wrongAmountPopContentration: string;
  emptyPopConcentration: string;
  emptyPopConcentrationUnit: string;
  wrongAmountPopContentrationUnit: string;
  charTooManyPopConcentrationUnit: string;
  emptyChemicalAndBiologicalComponents: string;
  charTooManyChemicalAndBiologicalComponents: string;
  emptyChemicalAndBiologicalConcentrationUnit: string;
  wrongAmountChemicalAndBiologicalContentrationUnit: string;
  emptyChemicalAndBiologicalConcentration: string;
  wrongAmountChemicalAndBiologicalContentration: string;
  charTooManyChemicalAndBiologicalConcentrationUnit: string;
  invalidChemicalAndBiologicalConcentration: string;
};

export const WasteTypeValidationErrorMessages: (
  wasteTypeNumber: number
) => WasteTypeErrorMessage = (wasteTypeNumber) => {
  let wasteTypeOrdinal = '';
  switch (wasteTypeNumber) {
    case 1:
      wasteTypeOrdinal = 'first';
      break;
    case 2:
      wasteTypeOrdinal = 'second';
      break;
    case 3:
      wasteTypeOrdinal = 'third';
      break;
    case 4:
      wasteTypeOrdinal = 'fourth';
      break;
    case 5:
      wasteTypeOrdinal = 'fifth';
      break;
    case 6:
      wasteTypeOrdinal = 'sixth';
      break;
    case 7:
      wasteTypeOrdinal = 'seventh';
      break;
    case 8:
      wasteTypeOrdinal = 'eighth';
      break;
    case 9:
      wasteTypeOrdinal = 'ninth';
      break;
    case 10:
      wasteTypeOrdinal = 'tenth';
      break;
    default:
      wasteTypeOrdinal = 'first';
      break;
  }

  return {
    emptyEwcCode: 'Enter an EWC code',
    invalidEwcCode: `Enter the ${wasteTypeOrdinal} EWC code in correct format`,
    emptyWasteDescription: `Enter the waste description for the ${wasteTypeOrdinal} EWC code`,
    charTooManyWasteDescription: `Waste description for the ${wasteTypeOrdinal} EWC code must be less than ${constraints.WasteDescriptionChar.max} characters`,
    emptyPhysicalForm: `Enter the physical form of the ${wasteTypeOrdinal} waste`,
    invalidPhysicalForm: `The ${wasteTypeOrdinal} physical form of waste can only be gas, liquid, solid, powder, sludge, or mixed`,
    emptyWasteQuantity: `Enter quantity of waste for the ${wasteTypeOrdinal} EWC code`,
    invalidWasteQuantity: `The ${wasteTypeOrdinal} waste quantity can only be entered using numbers and decimal points`,
    valueTooSmallWasteQuantity: `The ${wasteTypeOrdinal} waste quantity must be greater than ${constraints.WasteQuantityValue.greaterThan}`,
    emptyWasteQuantityUnit: `Enter the waste quantity unit for the ${wasteTypeOrdinal} EWC code`,
    invalidWasteQuantityUnit: `The ${wasteTypeOrdinal} quantity of units can only be tonnes, kilograms, litres, or cubic metres`,
    invalidWasteQuantityType: `Enter either 'estimate' or 'actual' for the ${wasteTypeOrdinal} waste type`,
    invalidHasHazardousProperties: `Enter Y or N if the ${wasteTypeOrdinal} waste has hazardous properties`,
    emptyHazardousWasteCodes: `Enter all hazardous codes for ${wasteTypeOrdinal} waste type`,
    invalidHazardousWasteCodes: (invalidHazardousCodes: string[]) =>
      invalidHazardousCodes.length === 1
        ? `${invalidHazardousCodes[0]} is an invalid hazardous code for the ${wasteTypeOrdinal} waste type`
        : invalidHazardousCodes.join('; ') +
          ` are invalid hazardous codes for the ${wasteTypeOrdinal} waste type`,
    invalidContainsPops: `Enter Y or N if the waste contains POPs`,
    invalidPops: (invalidPops: string[]) =>
      invalidPops.length === 1
        ? `${invalidPops[0]} is an invalid persistent organic pollutant (POP) for the ${wasteTypeOrdinal} waste type`
        : invalidPops.join('; ') +
          ` are invalid persistent organic pollutants (POPs) for the ${wasteTypeOrdinal} waste type`,
    invalidPopConcentration: `The ${wasteTypeOrdinal} POPs concentration can only be entered using numbers and decimal points`,
    wrongAmountPopContentration: `The amount of POPs concentration values for the ${wasteTypeOrdinal} waste type must be the same as the amount of POPs entered`,
    emptyPopConcentration: `Enter the ${wasteTypeOrdinal} POPs concentration value`,
    emptyPopConcentrationUnit: `Enter the ${wasteTypeOrdinal} POPs concentration unit of measure`,
    wrongAmountPopContentrationUnit: `The amount of POPs concentration units for the ${wasteTypeOrdinal} waste type must be the same as the amount of POPs entered`,
    charTooManyPopConcentrationUnit: `The POPs concentration units of measure for the ${wasteTypeOrdinal} waste type must be less than ${constraints.PopConcentrationUnitChar.max} characters each`,
    emptyChemicalAndBiologicalComponents: `Enter the chemical and biological components of the ${wasteTypeOrdinal} waste`,
    charTooManyChemicalAndBiologicalComponents: `The chemical and biological components of the ${wasteTypeOrdinal} waste must be less than ${constraints.FreeTextChar.max} characters`,
    emptyChemicalAndBiologicalConcentration: `Enter the ${wasteTypeOrdinal} chemical or biological concentration value`,
    wrongAmountChemicalAndBiologicalContentration: `The amount of chemical or biological concentration values for the ${wasteTypeOrdinal} waste type must be the same as the amount of components`,
    invalidChemicalAndBiologicalConcentration: `The chemical or biological concentration for the ${wasteTypeOrdinal} waste type can only be entered using numbers and decimal points`,
    emptyChemicalAndBiologicalConcentrationUnit: `Enter the ${wasteTypeOrdinal} chemical or biological concentration unit of measure`,
    wrongAmountChemicalAndBiologicalContentrationUnit: `The amount of chemical or biological concentration units for the ${wasteTypeOrdinal} waste type must be the same as the amount of components`,
    charTooManyChemicalAndBiologicalConcentrationUnit: `The chemical or biological concentration units of measure for the ${wasteTypeOrdinal} waste type must be less than ${constraints.ChemicalAndBiologicalConcentrationUnitChar.max} characters each`,
  };
};
