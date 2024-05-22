export interface WasteTypeErrorCode {
  emptyEwcCode: number;
  invalidEwcCode: number;
  emptyWasteDescription: number;
  charTooManyWasteDescription: number;
  emptyPhysicalForm: number;
  invalidPhysicalForm: number;
  emptyWasteQuantity: number;
  invalidWasteQuantity: number;
  valueTooSmallWasteQuantity: number;
  emptyWasteQuantityUnit: number;
  invalidWasteQuantityUnit: number;
  invalidWasteQuantityType: number;
  invalidHasHazardousProperties: number;
  emptyHazardousWasteCodes: number;
  invalidHazardousWasteCodes: number;
  invalidContainsPops: number;
  invalidPops: number;
  invalidPopConcentration: number;
  wrongAmountPopContentration: number;
  emptyPopConcentration: number;
  emptyPopConcentrationUnit: number;
  wrongAmountPopContentrationUnit: number;
  charTooManyPopConcentrationUnit: number;
  emptyChemicalAndBiologicalComponents: number;
  charTooManyChemicalAndBiologicalComponents: number;
  emptyChemicalAndBiologicalConcentrationUnit: number;
  wrongAmountChemicalAndBiologicalContentrationUnit: number;
  emptyChemicalAndBiologicalConcentration: number;
  wrongAmountChemicalAndBiologicalContentration: number;
  charTooManyChemicalAndBiologicalConcentrationUnit: number;
  invalidChemicalAndBiologicalConcentration: number;
  emptyPops: number;
}

export const wasteTypeEmptyEwcCode = 1;
export const wasteTypeInvalidEwcCode = 2;
export const wasteTypeEmptyWasteDescription = 3;
export const wasteTypeCharTooManyWasteDescription = 4;
export const wasteTypeEmptyPhysicalForm = 5;
export const wasteTypeInvalidPhysicalForm = 6;
export const wasteTypeEmptyWasteQuantity = 7;
export const wasteTypeInvalidWasteQuantity = 8;
export const wasteTypeValueTooSmallWasteQuantity = 9;
export const wasteTypeEmptyWasteQuantityUnit = 10;
export const wasteTypeInvalidWasteQuantityUnit = 11;
export const wasteTypeInvalidWasteQuantityType = 12;
export const wasteTypeInvalidHasHazardousProperties = 13;
export const wasteTypeEmptyHazardousWasteCodes = 14;
export const wasteTypeInvalidHazardousWasteCodes = 15;
export const wasteTypeInvalidContainsPops = 16;
export const wasteTypeInvalidPops = 17;
export const wasteTypeInvalidPopConcentration = 18;
export const wasteTypeWrongAmountPopContentration = 19;
export const wasteTypeEmptyPopConcentration = 20;
export const wasteTypeEmptyPopConcentrationUnit = 21;
export const wasteTypeWrongAmountPopContentrationUnit = 22;
export const wasteTypeCharTooManyPopConcentrationUnit = 23;
export const wasteTypeEmptyChemicalAndBiologicalComponents = 24;
export const wasteTypeCharTooManyChemicalAndBiologicalComponents = 25;
export const wasteTypeEmptyChemicalAndBiologicalConcentrationUnit = 26;
export const wasteTypeWrongAmountChemicalAndBiologicalContentrationUnit = 27;
export const wasteTypeEmptyChemicalAndBiologicalConcentration = 28;
export const wasteTypeWrongAmountChemicalAndBiologicalContentration = 29;
export const wasteTypeCharTooManyChemicalAndBiologicalConcentrationUnit = 30;
export const wasteTypeInvalidChemicalAndBiologicalConcentration = 31;
export const emptyPops = 32;

export const WasteTypeValidationErrorCode: (
  wasteTypeNumber: number
) => WasteTypeErrorCode = (wasteTypeNumber) => {
  return {
    emptyEwcCode: wasteTypeNumber * 1000 + wasteTypeEmptyEwcCode,
    invalidEwcCode: wasteTypeNumber * 1000 + wasteTypeInvalidEwcCode,
    emptyWasteDescription:
      wasteTypeNumber * 1000 + wasteTypeEmptyWasteDescription,
    charTooManyWasteDescription:
      wasteTypeNumber * 1000 + wasteTypeCharTooManyWasteDescription,
    emptyPhysicalForm: wasteTypeNumber * 1000 + wasteTypeEmptyPhysicalForm,
    invalidPhysicalForm: wasteTypeNumber * 1000 + wasteTypeInvalidPhysicalForm,
    emptyWasteQuantity: wasteTypeNumber * 1000 + wasteTypeEmptyWasteQuantity,
    invalidWasteQuantity:
      wasteTypeNumber * 1000 + wasteTypeInvalidWasteQuantity,
    valueTooSmallWasteQuantity:
      wasteTypeNumber * 1000 + wasteTypeValueTooSmallWasteQuantity,
    emptyWasteQuantityUnit:
      wasteTypeNumber * 1000 + wasteTypeEmptyWasteQuantityUnit,
    invalidWasteQuantityUnit:
      wasteTypeNumber * 1000 + wasteTypeInvalidWasteQuantityUnit,
    invalidWasteQuantityType:
      wasteTypeNumber * 1000 + wasteTypeInvalidWasteQuantityType,
    invalidHasHazardousProperties:
      wasteTypeNumber * 1000 + wasteTypeInvalidHasHazardousProperties,
    emptyHazardousWasteCodes:
      wasteTypeNumber * 1000 + wasteTypeEmptyHazardousWasteCodes,
    invalidHazardousWasteCodes:
      wasteTypeNumber * 1000 + wasteTypeInvalidHazardousWasteCodes,
    invalidContainsPops: wasteTypeNumber * 1000 + wasteTypeInvalidContainsPops,
    invalidPops: wasteTypeNumber * 1000 + wasteTypeInvalidPops,
    invalidPopConcentration:
      wasteTypeNumber * 1000 + wasteTypeInvalidPopConcentration,
    wrongAmountPopContentration:
      wasteTypeNumber * 1000 + wasteTypeWrongAmountPopContentration,
    emptyPopConcentration:
      wasteTypeNumber * 1000 + wasteTypeEmptyPopConcentration,
    emptyPopConcentrationUnit:
      wasteTypeNumber * 1000 + wasteTypeEmptyPopConcentrationUnit,
    wrongAmountPopContentrationUnit:
      wasteTypeNumber * 1000 + wasteTypeWrongAmountPopContentrationUnit,
    charTooManyPopConcentrationUnit:
      wasteTypeNumber * 1000 + wasteTypeCharTooManyPopConcentrationUnit,
    emptyChemicalAndBiologicalComponents:
      wasteTypeNumber * 1000 + wasteTypeEmptyChemicalAndBiologicalComponents,
    charTooManyChemicalAndBiologicalComponents:
      wasteTypeNumber * 1000 +
      wasteTypeCharTooManyChemicalAndBiologicalComponents,
    emptyChemicalAndBiologicalConcentrationUnit:
      wasteTypeNumber * 1000 +
      wasteTypeEmptyChemicalAndBiologicalConcentrationUnit,
    wrongAmountChemicalAndBiologicalContentrationUnit:
      wasteTypeNumber * 1000 +
      wasteTypeWrongAmountChemicalAndBiologicalContentrationUnit,
    emptyChemicalAndBiologicalConcentration:
      wasteTypeNumber * 1000 + wasteTypeEmptyChemicalAndBiologicalConcentration,
    wrongAmountChemicalAndBiologicalContentration:
      wasteTypeNumber * 1000 +
      wasteTypeWrongAmountChemicalAndBiologicalContentration,
    charTooManyChemicalAndBiologicalConcentrationUnit:
      wasteTypeNumber * 1000 +
      wasteTypeCharTooManyChemicalAndBiologicalConcentrationUnit,
    invalidChemicalAndBiologicalConcentration:
      wasteTypeNumber * 1000 +
      wasteTypeInvalidChemicalAndBiologicalConcentration,
    emptyPops: wasteTypeNumber * 1000 + emptyPops,
  };
};

export const producerEmptyOrganisationName = 11001;
export const producerCharTooManyOrganisationName = 11002;
export const producerEmptyAddressLine1 = 11003;
export const producerCharTooManyAddressLine1 = 11004;
export const producerCharTooManyAddressLine2 = 11005;
export const producerEmptyTownOrCity = 11006;
export const producerCharTooManyTownOrCity = 11007;
export const producerEmptyCountry = 11008;
export const producerInvalidCountry = 11009;
export const producerInvalidPostcode = 11010;
export const producerEmptyContactFullName = 11011;
export const producerCharTooManyContactFullName = 11012;
export const producerEmptyPhone = 11013;
export const producerInvalidPhone = 11014;
export const producerEmptyEmail = 11015;
export const producerInvalidEmail = 11016;
export const producerCharTooManyEmail = 11017;
export const producerInvalidSicCode = 11018;
export const producerEmptyReference = 11019;
export const producerCharTooFewReference = 11020;
export const producerCharTooManyReference = 11021;
export const producerInvalidReference = 11022;

export const wasteCollectionEmptyAddressLine1 = 12001;
export const wasteCollectionCharTooManyAddressLine1 = 12002;
export const wasteCollectionCharTooManyAddressLine2 = 12003;
export const wasteCollectionEmptyTownOrCity = 12004;
export const wasteCollectionCharTooManyTownOrCity = 12005;
export const wasteCollectionEmptyCountry = 12006;
export const wasteCollectionInvalidCountry = 12007;
export const wasteCollectionInvalidPostcode = 12008;
export const wasteCollectionMissingWasteSource = 12009;
export const wasteCollectionInvalidWasteSource = 12010;
export const wasteCollectionCharTooManyBrokerRegistrationNumber = 12011;
export const wasteCollectionCharTooManyCarrierRegistrationNumber = 12012;
export const wasteCollectionMissingWasteCollectionDate = 12015;
export const wasteCollectionInvalidFormatWasteCollectionDate = 12016;
export const wasteCollectionEmptyLocalAuthority = 12017;
export const wasteCollectionInvalidLocalAuthority = 12018;
export const wasteCollectionCharTooManyLocalAuthority = 12019;

export const receiverEmptyAuthorizationType = 13000;
export const receiverInvalidAuthorizationTypeLength = 13001;
export const receiverInvalidEnvironmentalPermitNumberLength = 13002;
export const receiverEmptyOrganisationName = 13003;
export const receiverCharTooManyOrganisationName = 13004;
export const receiverEmptyAddressLine1 = 13005;
export const receiverCharTooManyAddressLine1 = 13006;
export const receiverCharTooManyAddressLine2 = 13007;
export const receiverEmptyTownOrCity = 13008;
export const receiverCharTooManyTownOrCity = 13009;
export const receiverEmptyCountry = 13010;
export const receiverInvalidCountry = 13011;
export const receiverInvalidPostcode = 13012;
export const receiverEmptyContactFullName = 13013;
export const receiverCharTooManyContactFullName = 13014;
export const receiverEmptyPhone = 13015;
export const receiverInvalidPhone = 13016;
export const receiverEmptyEmail = 13017;
export const receiverInvalidEmail = 13018;
export const receiverCharTooManyEmail = 13019;
export const receiverInvalidReceiverAuthorizationType = 13020;
export const receiverInvalidReceiverEnvironmentalPermitNumber = 13021;

export const wasteTransportationEmptyNameAndTypeOfContainers = 14001;
export const wasteTransportationCharTooManyNameAndTypeOfContainers = 14002;
export const wasteTransportationCharTooManySpecialHandlingRequirements = 14003;

export const carrierEmptyOrganisationName = 15001;
export const carrierCharTooManyOrganisationName = 15002;
export const carrierEmptyAddressLine1 = 15003;
export const carrierCharTooManyAddressLine1 = 15004;
export const carrierCharTooManyAddressLine2 = 15005;
export const carrierEmptyTownOrCity = 15006;
export const carrierCharTooManyTownOrCity = 15007;
export const carrierEmptyCountry = 15008;
export const carrierInvalidCountry = 15009;
export const carrierInvalidPostcode = 15010;
export const carrierEmptyContactFullName = 15011;
export const carrierCharTooManyContactFullName = 15012;
export const carrierEmptyPhone = 15013;
export const carrierInvalidPhone = 15014;
export const carrierEmptyEmail = 15015;
export const carrierInvalidEmail = 15016;
export const carrierCharTooManyEmail = 15017;
