import * as constraints from './constraints';
import { ErrorCodeData } from './dto';
import * as codes from './error-codes';

const ProducerValidationErrorData: { [key: number]: ErrorCodeData } = {
  [codes.producerEmptyOrganisationName]: {
    type: 'message',
    message: 'Enter the producer organisation name',
    field: 'Producer organisation name',
  },
  [codes.producerCharTooManyOrganisationName]: {
    type: 'message',
    message: `The producer organisation name must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Producer organisation name',
  },
  [codes.producerEmptyAddressLine1]: {
    type: 'message',
    message: 'Enter the producer address',
    field: 'Producer address line 1',
  },
  [codes.producerCharTooManyAddressLine1]: {
    type: 'message',
    message: `The producer address line 1 must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Producer address line 1',
  },
  [codes.producerCharTooManyAddressLine2]: {
    type: 'message',
    message: `The producer address line 2 must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Producer address line 2',
  },
  [codes.producerEmptyTownOrCity]: {
    type: 'message',
    message: 'Enter the producer town or city',
    field: 'Producer town or city',
  },
  [codes.producerCharTooManyTownOrCity]: {
    type: 'message',
    message: `The producer town or city must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Producer town or city',
  },
  [codes.producerEmptyCountry]: {
    type: 'message',
    message: 'Enter the producer country',
    field: 'Producer country',
  },
  [codes.producerInvalidCountry]: {
    type: 'message',
    message:
      'The producer country must only be England, Wales, Scotland, or Northern Ireland',
    field: 'Producer country',
  },
  [codes.producerInvalidPostcode]: {
    type: 'message',
    message: 'Enter the producer postcode in the correct format',
    field: 'Producer postcode',
  },
  [codes.producerEmptyContactFullName]: {
    type: 'message',
    message: 'Enter full name of producer contact',
    field: 'Producer contact name',
  },
  [codes.producerCharTooManyContactFullName]: {
    type: 'message',
    message: `The producer contact name must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Producer contact name',
  },
  [codes.producerEmptyPhone]: {
    type: 'message',
    message: 'Enter producer contact phone number',
    field: 'Producer contact phone number',
  },
  [codes.producerInvalidPhone]: {
    type: 'message',
    message: 'Enter producer contact phone number in correct format',
    field: 'Producer contact phone number',
  },
  [codes.producerEmptyEmail]: {
    type: 'message',
    message: 'Enter producer contact email address',
    field: 'Producer contact email address',
  },
  [codes.producerInvalidEmail]: {
    type: 'message',
    message: 'Enter producer contact email address in correct format',
    field: 'Producer contact email address',
  },
  [codes.producerCharTooManyEmail]: {
    type: 'message',
    message: `The producer email address must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Producer contact email address',
  },
  [codes.producerInvalidSicCode]: {
    type: 'message',
    message: 'Enter producer SIC code in the correct format',
    field: 'Producer Standard Industrial Classification (SIC) code',
  },
  [codes.producerEmptyReference]: {
    type: 'message',
    message: 'Enter a unique reference',
    field: 'Reference',
  },
  [codes.producerCharTooFewReference]: {
    type: 'message',
    message: `Your unique reference must be more than ${constraints.ReferenceChar.min} character`,
    field: 'Reference',
  },
  [codes.producerCharTooManyReference]: {
    type: 'message',
    message: `The unique reference must be ${constraints.ReferenceChar.max} characters or less`,
    field: 'Reference',
  },
  [codes.producerInvalidReference]: {
    type: 'message',
    message: 'The reference must only include letters a to z, and numbers',
    field: 'Reference',
  },
};

const CarrierValidationErrorData: { [key: number]: ErrorCodeData } = {
  [codes.carrierEmptyOrganisationName]: {
    type: 'message',
    message: 'Enter the carrier organisation name',
    field: 'Carrier organisation name',
  },
  [codes.carrierCharTooManyOrganisationName]: {
    type: 'message',
    message: `The carrier organisation name must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Carrier organisation name',
  },
  [codes.carrierEmptyAddressLine1]: {
    type: 'message',
    message: 'Enter the carrier address',
    field: 'Carrier address line 1',
  },
  [codes.carrierCharTooManyAddressLine1]: {
    type: 'message',
    message: `The carrier address line 1 must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Carrier address line 1',
  },
  [codes.carrierCharTooManyAddressLine2]: {
    type: 'message',
    message: `The carrier address line 2 must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Carrier address line 2',
  },
  [codes.carrierEmptyTownOrCity]: {
    type: 'message',
    message: 'Enter the carrier town or city',
    field: 'Carrier town or city',
  },
  [codes.carrierCharTooManyTownOrCity]: {
    type: 'message',
    message: `The carrier town or city must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Carrier town or city',
  },
  [codes.carrierEmptyCountry]: {
    type: 'message',
    message: 'Enter the carrier country',
    field: 'Carrier country',
  },
  [codes.carrierInvalidCountry]: {
    type: 'message',
    message:
      'The carrier country must only be England, Wales, Scotland, or Northern Ireland',
    field: 'Carrier country',
  },
  [codes.carrierInvalidPostcode]: {
    type: 'message',
    message: 'Enter the carrier postcode in the correct format',
    field: 'Carrier postcode',
  },
  [codes.carrierEmptyContactFullName]: {
    type: 'message',
    message: 'Enter full name of carrier contact',
    field: 'Carrier contact name',
  },
  [codes.carrierCharTooManyContactFullName]: {
    type: 'message',
    message: `The carrier contact name must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Carrier contact name',
  },
  [codes.carrierEmptyPhone]: {
    type: 'message',
    message: 'Enter carrier contact phone number',
    field: 'Carrier contact phone number',
  },
  [codes.carrierInvalidPhone]: {
    type: 'message',
    message: 'Enter carrier contact phone number in correct format',
    field: 'Carrier contact phone number',
  },
  [codes.carrierEmptyEmail]: {
    type: 'message',
    message: 'Enter carrier contact email address',
    field: 'Carrier contact email address',
  },
  [codes.carrierInvalidEmail]: {
    type: 'message',
    message: 'Enter carrier contact email address in correct format',
    field: 'Carrier contact email address',
  },
  [codes.carrierCharTooManyEmail]: {
    type: 'message',
    message: `The carrier email address must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Carrier contact email address',
  },
};

const WasteCollectionValidationErrorData: {
  [key: number]: ErrorCodeData;
} = {
  [codes.wasteCollectionEmptyAddressLine1]: {
    type: 'message',
    message: 'Enter the waste collection address',
    field: 'Waste Collection Details Address Line 1',
  },
  [codes.wasteCollectionCharTooManyAddressLine1]: {
    type: 'message',
    message: `The waste collection address line 1 must be fewer than ${constraints.FreeTextChar.max} characters`,
    field: 'Waste Collection Details Address Line 1',
  },
  [codes.wasteCollectionCharTooManyAddressLine2]: {
    type: 'message',
    message: `The waste collection address line 2 must be fewer than ${constraints.FreeTextChar.max} characters`,
    field: 'Waste Collection Details Address Line 2',
  },
  [codes.wasteCollectionEmptyTownOrCity]: {
    type: 'message',
    message: 'Enter the waste collection town or city',
    field: 'Waste Collection Details Town or City',
  },
  [codes.wasteCollectionCharTooManyTownOrCity]: {
    type: 'message',
    message: `The waste collection town or city must be fewer than ${constraints.FreeTextChar.max} characters`,
    field: 'Waste Collection Details Town or City',
  },
  [codes.wasteCollectionEmptyCountry]: {
    type: 'message',
    message: 'Enter the waste collection country',
    field: 'Waste Collection Details Country',
  },
  [codes.wasteCollectionInvalidCountry]: {
    type: 'message',
    message:
      'The waste collection country must only be England, Wales, Scotland or Northern Ireland',
    field: 'Waste Collection Details Country',
  },
  [codes.wasteCollectionInvalidPostcode]: {
    type: 'message',
    message: 'Enter the waste collection postcode in the correct format',
    field: 'Waste Collection Details Postcode',
  },
  [codes.wasteCollectionMissingWasteSource]: {
    type: 'message',
    message: 'Enter a waste source',
    field: 'Waste Collection Details Waste Source',
  },
  [codes.wasteCollectionInvalidWasteSource]: {
    type: 'message',
    message: 'The waste source must only be Household or Commercial',
    field: 'Waste Collection Details Waste Source',
  },
  [codes.wasteCollectionCharTooManyBrokerRegistrationNumber]: {
    type: 'message',
    message: `The broker registration number must be fewer than ${constraints.WasteCollectionChar.max} characters`,
    field: 'Waste Collection Details Broker Registration Number',
  },
  [codes.wasteCollectionCharTooManyCarrierRegistrationNumber]: {
    type: 'message',
    message: `The carrier registration number must be fewer than ${constraints.WasteCollectionChar.max} characters`,
    field: 'Waste Collection Details Carrier Registration Number',
  },
  [codes.wasteCollectionMissingWasteCollectionDate]: {
    type: 'message',
    message: 'Enter the expected Waste Collection Date',
    field: 'Waste Collection Details Expected Waste Collection Date',
  },
  [codes.wasteCollectionInvalidFormatWasteCollectionDate]: {
    type: 'message',
    message: 'Enter the expected waste collection date in the correct format',
    field: 'Waste Collection Details Expected Waste Collection Date',
  },
  [codes.wasteCollectionEmptyLocalAuthority]: {
    type: 'message',
    message: 'Enter the local authority where the waste was collected',
    field: 'Local authority',
  },
  [codes.wasteCollectionInvalidLocalAuthority]: {
    type: 'message',
    message: 'Enter the local authority in the correct format',
    field: 'Local authority',
  },
  [codes.wasteCollectionCharTooManyLocalAuthority]: {
    type: 'message',
    message: `The local authority must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Local authority',
  },
};

const ReceiverValidationErrorData: { [key: number]: ErrorCodeData } = {
  [codes.receiverEmptyAuthorizationType]: {
    type: 'message',
    message: 'Enter the receiver authorization type',
    field: 'Receiver authorization type',
  },
  [codes.receiverInvalidAuthorizationTypeLength]: {
    type: 'message',
    message: `The receiver authorisation details must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Receiver authorization type',
  },
  [codes.receiverInvalidEnvironmentalPermitNumberLength]: {
    type: 'message',
    message: `The receiver permit number must be less than ${constraints.ReceiverEnvironmentalPermitNumberChar.max} characters`,
    field: 'Receiver environmental permit number',
  },
  [codes.receiverEmptyOrganisationName]: {
    type: 'message',
    message: 'Enter the receiver organisation name',
    field: 'Receiver organisation name',
  },
  [codes.receiverCharTooManyOrganisationName]: {
    type: 'message',
    message: `The receiver organisation name must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Receiver organisation name',
  },
  [codes.receiverEmptyAddressLine1]: {
    type: 'message',
    message: 'Enter the receiver address',
    field: 'Receiver address line 1',
  },
  [codes.receiverCharTooManyAddressLine1]: {
    type: 'message',
    message: `The receiver address line 1 must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Receiver address line 1',
  },
  [codes.receiverCharTooManyAddressLine2]: {
    type: 'message',
    message: `The receiver address line 2 must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Receiver address line 2',
  },
  [codes.receiverEmptyTownOrCity]: {
    type: 'message',
    message: 'Enter the receiver town or city',
    field: 'Receiver town or city',
  },
  [codes.receiverCharTooManyTownOrCity]: {
    type: 'message',
    message: `The receiver town or city must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Receiver town or city',
  },
  [codes.receiverEmptyCountry]: {
    type: 'message',
    message: 'Enter the receiver country',
    field: 'Receiver country',
  },
  [codes.receiverInvalidCountry]: {
    type: 'message',
    message:
      'The receiver country must only be England, Wales, Scotland, or Northern Ireland',
    field: 'Receiver country',
  },
  [codes.receiverInvalidPostcode]: {
    type: 'message',
    message: 'Enter the receiver postcode in the correct format',
    field: 'Receiver postcode',
  },
  [codes.receiverEmptyContactFullName]: {
    type: 'message',
    message: 'Enter full name of receiver contact',
    field: 'Receiver contact name',
  },
  [codes.receiverCharTooManyContactFullName]: {
    type: 'message',
    message: `The receiver contact name must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Receiver contact name',
  },
  [codes.receiverEmptyPhone]: {
    type: 'message',
    message: 'Enter receiver contact phone number',
    field: 'Receiver contact phone number',
  },
  [codes.receiverInvalidPhone]: {
    type: 'message',
    message: 'Enter receiver contact phone number in correct format',
    field: 'Receiver contact phone number',
  },
  [codes.receiverEmptyEmail]: {
    type: 'message',
    message: 'Enter receiver contact email address',
    field: 'Receiver contact email address',
  },
  [codes.receiverInvalidEmail]: {
    type: 'message',
    message: 'Enter receiver contact email address in correct format',
    field: 'Receiver contact email address',
  },
  [codes.receiverCharTooManyEmail]: {
    type: 'message',
    message: `The receiver email address must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Receiver contact email address',
  },
  [codes.receiverInvalidReceiverAuthorizationType]: {
    type: 'message',
    message: 'Enter the receiver authorization type',
    field: 'Receiver authorization type',
  },
  [codes.receiverInvalidReceiverEnvironmentalPermitNumber]: {
    type: 'message',
    message: 'Enter the receiver environmental permit number',
    field: 'Receiver environmental permit number',
  },
};

const WasteTransportationValidationErrorData: {
  [key: number]: ErrorCodeData;
} = {
  [codes.wasteTransportationEmptyNameAndTypeOfContainers]: {
    type: 'message',
    message: `Enter the number and type of containers`,
    field: 'Number and type of transportation containers',
  },
  [codes.wasteTransportationCharTooManyNameAndTypeOfContainers]: {
    type: 'message',
    message: `Number and type of transportation details must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Number and type of transportation containers',
  },
  [codes.wasteTransportationCharTooManySpecialHandlingRequirements]: {
    type: 'message',
    message: `The special handling requirements must be less than ${constraints.FreeTextChar.max} characters`,
    field: 'Special handling requirements details',
  },
};

const WasteTypeValidationErrorMessages: (wasteTypeNumber: number) => {
  [key: number]: ErrorCodeData;
} = (wasteTypeNumber) => {
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
      wasteTypeNumber = 1;
      wasteTypeOrdinal = 'first';
      break;
  }

  const codesForNumber = codes.WasteTypeValidationErrorCode(wasteTypeNumber);

  return {
    [codesForNumber.emptyEwcCode]: {
      type: 'message',
      message: 'Enter an EWC code',
      field: 'EWC Code',
    },
    [codesForNumber.invalidEwcCode]: {
      type: 'message',
      message: `Enter the ${wasteTypeOrdinal} EWC code in correct format`,
      field: 'EWC Code',
    },
    [codesForNumber.emptyWasteDescription]: {
      type: 'message',
      message: `Enter the waste description for the ${wasteTypeOrdinal} EWC code`,
      field: 'Waste Description',
    },
    [codesForNumber.charTooManyWasteDescription]: {
      type: 'message',
      message: `Waste description for the ${wasteTypeOrdinal} EWC code must be less than ${constraints.WasteDescriptionChar.max} characters`,
      field: 'Waste Description',
    },
    [codesForNumber.emptyPhysicalForm]: {
      type: 'message',
      message: `Enter the physical form of the ${wasteTypeOrdinal} waste`,
      field: 'Physical Form',
    },
    [codesForNumber.invalidPhysicalForm]: {
      type: 'message',
      message: `The ${wasteTypeOrdinal} physical form of waste can only be gas, liquid, solid, powder, sludge, or mixed`,
      field: 'Physical Form',
    },
    [codesForNumber.emptyWasteQuantity]: {
      type: 'message',
      message: `Enter quantity of waste for the ${wasteTypeOrdinal} EWC code`,
      field: 'Waste Quantity',
    },
    [codesForNumber.invalidWasteQuantity]: {
      type: 'message',
      message: `The ${wasteTypeOrdinal} waste quantity can only be entered using numbers and decimal points`,
      field: 'Waste Quantity',
    },
    [codesForNumber.valueTooSmallWasteQuantity]: {
      type: 'message',
      message: `The ${wasteTypeOrdinal} waste quantity must be greater than ${constraints.WasteQuantityValue.greaterThan}`,
      field: 'Waste Quantity',
    },
    [codesForNumber.emptyWasteQuantityUnit]: {
      type: 'message',
      message: `Enter the waste quantity unit for the ${wasteTypeOrdinal} EWC code`,
      field: 'Waste Quantity Units',
    },
    [codesForNumber.invalidWasteQuantityUnit]: {
      type: 'message',
      message: `The ${wasteTypeOrdinal} quantity of units can only be tonnes, kilograms, litres, or cubic metres`,
      field: 'Waste Quantity Units',
    },
    [codesForNumber.invalidWasteQuantityType]: {
      type: 'message',
      message: `Enter either 'estimate' or 'actual' for the ${wasteTypeOrdinal} waste type`,
      field: 'Quantity of waste (actual or estimate)',
    },
    [codesForNumber.invalidHasHazardousProperties]: {
      type: 'message',
      message: `Enter Y or N if the ${wasteTypeOrdinal} waste has hazardous properties`,
      field: 'Waste Has Hazardous Properties',
    },
    [codesForNumber.emptyHazardousWasteCodes]: {
      type: 'message',
      message: `Enter all hazardous codes for ${wasteTypeOrdinal} waste type`,
      field: 'Hazardous Waste Codes',
    },
    [codesForNumber.invalidContainsPops]: {
      type: 'message',
      message: `Enter Y or N if the waste contains POPs`,
      field: 'Waste Contains POPs',
    },
    [codesForNumber.invalidHazardousWasteCodes]: {
      type: 'builder',
      field: 'Hazardous Waste Codes',
      builder: (invalidHazardousCodes: string[]) =>
        invalidHazardousCodes.length === 1
          ? `${invalidHazardousCodes[0]} is an invalid hazardous code for the ${wasteTypeOrdinal} waste type`
          : invalidHazardousCodes.join('; ') +
            ` are invalid hazardous codes for the ${wasteTypeOrdinal} waste type`,
    },
    [codesForNumber.invalidPops]: {
      type: 'builder',
      field: 'Persistant organic pollutants (POPs)',
      builder: (invalidPops: string[]) =>
        invalidPops.length === 1
          ? `${invalidPops[0]} is an invalid persistent organic pollutant (POP) for the ${wasteTypeOrdinal} waste type`
          : invalidPops.join('; ') +
            ` are invalid persistent organic pollutants (POPs) for the ${wasteTypeOrdinal} waste type`,
    },
    [codesForNumber.invalidPopConcentration]: {
      type: 'message',
      message: `The ${wasteTypeOrdinal} POPs concentration can only be entered using numbers and decimal points`,
      field: 'Persistant organic pollutants (POPs) Concentration Values',
    },
    [codesForNumber.wrongAmountPopContentration]: {
      type: 'message',
      message: `The amount of POPs concentration values for the ${wasteTypeOrdinal} waste type must be the same as the amount of POPs entered`,
      field: 'Persistant organic pollutants (POPs) Concentration Values',
    },
    [codesForNumber.emptyPopConcentration]: {
      type: 'message',
      message: `Enter the ${wasteTypeOrdinal} POPs concentration value`,
      field: 'Persistant organic pollutants (POPs) Concentration Values',
    },
    [codesForNumber.emptyPopConcentrationUnit]: {
      type: 'message',
      message: `Enter the ${wasteTypeOrdinal} POPs concentration unit of measure`,
      field: 'Persistant organic pollutants (POPs) Concentration Units',
    },
    [codesForNumber.wrongAmountPopContentrationUnit]: {
      type: 'message',
      message: `The amount of POPs concentration units for the ${wasteTypeOrdinal} waste type must be the same as the amount of POPs entered`,
      field: 'Persistant organic pollutants (POPs) Concentration Units',
    },
    [codesForNumber.charTooManyPopConcentrationUnit]: {
      type: 'message',
      message: `The POPs concentration units of measure for the ${wasteTypeOrdinal} waste type must be less than ${constraints.PopConcentrationUnitChar.max} characters each`,
      field: 'Persistant organic pollutants (POPs) Concentration Units',
    },
    [codesForNumber.emptyChemicalAndBiologicalComponents]: {
      type: 'message',
      message: `Enter the chemical and biological components of the ${wasteTypeOrdinal} waste`,
      field: 'Chemical and biological components of the waste',
    },
    [codesForNumber.charTooManyChemicalAndBiologicalComponents]: {
      type: 'message',
      message: `The chemical and biological components of the ${wasteTypeOrdinal} waste must be less than ${constraints.FreeTextChar.max} characters`,
      field: 'Chemical and biological components of the waste',
    },
    [codesForNumber.emptyChemicalAndBiologicalConcentration]: {
      type: 'message',
      message: `Enter the ${wasteTypeOrdinal} chemical or biological concentration value`,
      field: 'Chemical and biological concentration values',
    },
    [codesForNumber.wrongAmountChemicalAndBiologicalContentration]: {
      type: 'message',
      message: `The amount of chemical or biological concentration values for the ${wasteTypeOrdinal} waste type must be the same as the amount of components`,
      field: 'Chemical and biological concentration values',
    },
    [codesForNumber.invalidChemicalAndBiologicalConcentration]: {
      type: 'message',
      message: `The chemical or biological concentration for the ${wasteTypeOrdinal} waste type can only be entered using numbers and decimal points`,
      field: 'Chemical and biological concentration values',
    },
    [codesForNumber.emptyChemicalAndBiologicalConcentrationUnit]: {
      type: 'message',
      message: `Enter the ${wasteTypeOrdinal} chemical or biological concentration unit of measure`,
      field: 'Chemical and biological concentration units of measure',
    },
    [codesForNumber.wrongAmountChemicalAndBiologicalContentrationUnit]: {
      type: 'message',
      message: `The amount of chemical or biological concentration units for the ${wasteTypeOrdinal} waste type must be the same as the amount of components`,
      field: 'Chemical and biological concentration units of measure',
    },
    [codesForNumber.charTooManyChemicalAndBiologicalConcentrationUnit]: {
      type: 'message',
      message: `The chemical or biological concentration units of measure for the ${wasteTypeOrdinal} waste type must be less than ${constraints.ChemicalAndBiologicalConcentrationUnitChar.max} characters each`,
      field: 'Chemical and biological concentration units of measure',
    },
    [codesForNumber.emptyPops]: {
      type: 'message',
      message: `Enter POPs details for ${wasteTypeOrdinal} waste type`,
      field: 'Persistant organic pollutants (POPs)',
    },
  };
};

export const UkwmErrorData = {
  ...ProducerValidationErrorData,
  ...WasteCollectionValidationErrorData,
  ...CarrierValidationErrorData,
  ...WasteTransportationValidationErrorData,
  ...ReceiverValidationErrorData,
  ...WasteTypeValidationErrorMessages(1),
  ...WasteTypeValidationErrorMessages(2),
  ...WasteTypeValidationErrorMessages(3),
  ...WasteTypeValidationErrorMessages(4),
  ...WasteTypeValidationErrorMessages(5),
  ...WasteTypeValidationErrorMessages(6),
  ...WasteTypeValidationErrorMessages(7),
  ...WasteTypeValidationErrorMessages(8),
  ...WasteTypeValidationErrorMessages(9),
  ...WasteTypeValidationErrorMessages(10),
};
