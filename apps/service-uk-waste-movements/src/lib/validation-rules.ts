import { Pop, WasteCode } from '@wts/api/reference-data';
import {
  validation,
  FieldFormatError,
  ReceiverDetailFlattened,
  ReceiverDetail,
  ProducerDetailFlattened,
  ProducerDetail,
  WasteTransportationDetailFlattened,
  WasteTransportationDetail,
  WasteCollectionDetailFlattened,
  WasteCollectionDetail,
  WasteTypeDetail,
  WasteTypeDetailFlattened,
  QuantityUnit,
  WasteQuantityType,
  PhysicalForm,
  WasteTypeErrorMessage,
} from '../model';

import { parse, isValid } from 'date-fns';
import enGB from 'date-fns/locale/en-GB';

function titleCase(str: string) {
  return str
    .trim()
    .toLowerCase()
    .split(' ')
    .map(function (s) {
      return s.replace(s[0], s[0].toUpperCase());
    })
    .join(' ');
}

function titleCaseSpacesRemoved(str: string) {
  return str
    .trim()
    .toLowerCase()
    .split(' ')
    .map(function (s) {
      return s.replace(s[0], s[0].toUpperCase());
    })
    .join(' ')
    .replace(/\s/g, '');
}

const fourNationsCountries = [
  'England',
  'Scotland',
  'Wales',
  'Northern Ireland',
];

const wasteSources = [
  'Household',
  'LocalAuthority',
  'Construction',
  'Demolition',
  'Commercial',
  'Industrial',
];

const wastePhysicalForms = [
  'Gas',
  'Liquid',
  'Solid',
  'Sludge',
  'Powder',
  'Mixed',
];

const wasteQuantitiesMap: { [key: string]: QuantityUnit } = {
  Tonne: 'Tonne',
  Tonnes: 'Tonne',
  'Cubic Metre': 'Cubic Metre',
  'Cubic Metres': 'Cubic Metre',
  Kilogram: 'Kilogram',
  Kilograms: 'Kilogram',
  Litre: 'Litre',
  Litres: 'Litre',
};

const modeOfWasteTransport = ['Road', 'Rail', 'Sea', 'Air', 'InlandWaterways'];

export function validateProducerDetailSection(
  value: ProducerDetailFlattened
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: ProducerDetail } {
  const errors: FieldFormatError[] = [];

  const trimmedReference = value.customerReference?.trim();
  if (!trimmedReference) {
    errors.push({
      field: 'Reference',
      message: validation.ProducerValidationErrorMessages.emptyReference,
    });
  } else if (trimmedReference.length > validation.ReferenceChar.max) {
    errors.push({
      field: 'Reference',
      message: validation.ProducerValidationErrorMessages.charTooManyReference,
    });
  } else if (!validation.referenceRegex.test(trimmedReference)) {
    errors.push({
      field: 'Reference',
      message: validation.ProducerValidationErrorMessages.invalidReference,
    });
  }

  if (!value.producerOrganisationName?.trim()) {
    errors.push({
      field: 'Producer organisation name',
      message: validation.ProducerValidationErrorMessages.emptyOrganisationName,
    });
  } else if (
    value.producerOrganisationName.length > validation.FreeTextChar.max
  ) {
    errors.push({
      field: 'Producer organisation name',
      message:
        validation.ProducerValidationErrorMessages.charTooManyOrganisationName,
    });
  }

  if (!value.producerAddressLine1?.trim()) {
    errors.push({
      field: 'Producer address line 1',
      message: validation.ProducerValidationErrorMessages.emptyAddressLine1,
    });
  } else if (value.producerAddressLine1.length > validation.FreeTextChar.max) {
    errors.push({
      field: 'Producer address line 1',
      message:
        validation.ProducerValidationErrorMessages.charTooManyAddressLine1,
    });
  }

  if (
    value.producerAddressLine2 &&
    value.producerAddressLine2.length > validation.FreeTextChar.max
  ) {
    errors.push({
      field: 'Producer address line 2',
      message:
        validation.ProducerValidationErrorMessages.charTooManyAddressLine2,
    });
  }

  if (!value.producerTownCity?.trim()) {
    errors.push({
      field: 'Producer town or city',
      message: validation.ProducerValidationErrorMessages.emptyTownOrCity,
    });
  } else {
    if (value.producerTownCity.length > validation.FreeTextChar.max) {
      errors.push({
        field: 'Producer town or city',
        message:
          validation.ProducerValidationErrorMessages.charTooManyTownOrCity,
      });
    }
  }

  if (!value.producerCountry?.trim()) {
    errors.push({
      field: 'Producer country',
      message: validation.ProducerValidationErrorMessages.emptyCountry,
    });
  } else {
    value.producerCountry = titleCase(value.producerCountry);
    if (!fourNationsCountries.includes(value.producerCountry)) {
      errors.push({
        field: 'Producer country',
        message: validation.ProducerValidationErrorMessages.invalidCountry,
      });
    }
  }

  if (
    value.producerPostcode?.trim() &&
    !validation.postcodeRegex.test(value.producerPostcode)
  ) {
    errors.push({
      field: 'Producer postcode',
      message: validation.ProducerValidationErrorMessages.invalidPostcode,
    });
  }

  if (!value.producerContactName?.trim()) {
    errors.push({
      field: 'Producer contact name',
      message: validation.ProducerValidationErrorMessages.emptyContactFullName,
    });
  } else if (value.producerContactName.length > validation.FreeTextChar.max) {
    errors.push({
      field: 'Producer contact name',
      message:
        validation.ProducerValidationErrorMessages.charTooManyContactFullName,
    });
  }

  const reformattedReceiverContactPhoneNumber = value.producerContactPhone
    ?.replace(/'/g, '')
    ?.trim();
  if (!reformattedReceiverContactPhoneNumber) {
    errors.push({
      field: 'Producer contact phone number',
      message: validation.ProducerValidationErrorMessages.emptyPhone,
    });
  } else if (
    !validation.phoneRegex.test(reformattedReceiverContactPhoneNumber)
  ) {
    errors.push({
      field: 'Producer contact phone number',
      message: validation.ProducerValidationErrorMessages.invalidPhone,
    });
  }

  if (!value.producerContactEmail?.trim()) {
    errors.push({
      field: 'Producer contact email address',
      message: validation.ProducerValidationErrorMessages.emptyEmail,
    });
  } else if (!validation.emailRegex.test(value.producerContactEmail)) {
    errors.push({
      field: 'Producer contact email address',
      message: validation.ProducerValidationErrorMessages.invalidEmail,
    });
  } else if (value.producerContactEmail.length > validation.FreeTextChar.max) {
    errors.push({
      field: 'Producer contact email address',
      message: validation.ProducerValidationErrorMessages.charTooManyEmail,
    });
  }

  if (
    value.producerSicCode &&
    !validation.producerSicCodeRegex.test(value.producerSicCode)
  ) {
    errors.push({
      field: 'Producer Standard Industrial Classification (SIC) code',
      message: validation.ProducerValidationErrorMessages.invalidSicCode,
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      value: errors,
    };
  }

  return {
    valid: true,
    value: {
      reference: trimmedReference,
      sicCode: value.producerSicCode,
      address: {
        addressLine1: value.producerAddressLine1,
        addressLine2: value.producerAddressLine2
          ? value.producerAddressLine2
          : undefined,
        country: value.producerCountry,
        postcode: value.producerPostcode,
        townCity: value.producerTownCity,
      },
      contact: {
        email: value.producerContactEmail,
        name: value.producerContactName,
        organisationName: value.producerOrganisationName,
        phone: reformattedReceiverContactPhoneNumber,
      },
    },
  };
}

export function validateWasteCollectionDetailSection(
  value: WasteCollectionDetailFlattened
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: WasteCollectionDetail } {
  const errors: FieldFormatError[] = [];

  if (
    value.wasteCollectionAddressLine1?.trim() ||
    value.wasteCollectionAddressLine2?.trim() ||
    value.wasteCollectionTownCity?.trim() ||
    value.wasteCollectionCountry?.trim() ||
    value.wasteCollectionPostcode?.trim()
  ) {
    if (!value.wasteCollectionAddressLine1?.trim()) {
      errors.push({
        field: 'Waste Collection Details Address Line 1',
        message: validation.WasteCollectionErrorMessages.emptyAddressLine1,
      });
    } else {
      if (
        value.wasteCollectionAddressLine1 &&
        value.wasteCollectionAddressLine1.length > validation.FreeTextChar.max
      ) {
        errors.push({
          field: 'Waste Collection Details Address Line 1',
          message:
            validation.WasteCollectionErrorMessages.charTooManyAddressLine1,
        });
      }
    }

    if (
      value.wasteCollectionAddressLine2 &&
      value.wasteCollectionAddressLine2.length > validation.FreeTextChar.max
    ) {
      errors.push({
        field: 'Waste Collection Details Address Line 2',
        message:
          validation.WasteCollectionErrorMessages.charTooManyAddressLine2,
      });
    }

    if (!value.wasteCollectionTownCity?.trim()) {
      errors.push({
        field: 'Waste Collection Details Town or City',
        message: validation.WasteCollectionErrorMessages.emptyTownOrCity,
      });
    } else {
      if (
        value.wasteCollectionTownCity &&
        value.wasteCollectionTownCity.length > validation.FreeTextChar.max
      ) {
        errors.push({
          field: 'Waste Collection Details Town or City',
          message:
            validation.WasteCollectionErrorMessages.charTooManyTownOrCity,
        });
      }
    }
    if (!value.wasteCollectionCountry?.trim()) {
      errors.push({
        field: 'Waste Collection Details Country',
        message: validation.WasteCollectionErrorMessages.emptyCountry,
      });
    } else {
      value.wasteCollectionCountry = titleCase(value.wasteCollectionCountry);
      if (!fourNationsCountries.includes(value.wasteCollectionCountry)) {
        errors.push({
          field: 'Waste Collection Details Country',
          message: validation.WasteCollectionErrorMessages.invalidCountry,
        });
      }
    }

    if (
      value.wasteCollectionPostcode &&
      !validation.postcodeRegex.test(value.wasteCollectionPostcode)
    ) {
      errors.push({
        field: 'Waste Collection Details Postcode',
        message: validation.WasteCollectionErrorMessages.invalidPostcode,
      });
    }
  }

  if (!value.wasteCollectionWasteSource?.trim()) {
    errors.push({
      field: 'Waste Collection Details Waste Source',
      message: validation.WasteCollectionErrorMessages.missingWasteSource,
    });
  } else {
    value.wasteCollectionWasteSource = titleCaseSpacesRemoved(
      value.wasteCollectionWasteSource
    );
    if (!wasteSources.includes(value.wasteCollectionWasteSource)) {
      errors.push({
        field: 'Waste Collection Details Waste Source',
        message: validation.WasteCollectionErrorMessages.invalidWasteSource,
      });
    }
  }

  if (
    value.wasteCollectionBrokerRegistrationNumber &&
    value.wasteCollectionBrokerRegistrationNumber.length >
      validation.WasteCollectionChar.max
  ) {
    errors.push({
      field: 'Waste Collection Details Broker Registration Number',
      message:
        validation.WasteCollectionErrorMessages
          .charTooManyBrokerRegistrationNumber,
    });
  }

  if (
    value.wasteCollectionCarrierRegistrationNumber &&
    value.wasteCollectionCarrierRegistrationNumber.length >
      validation.WasteCollectionChar.max
  ) {
    errors.push({
      field: 'Waste Collection Details Carrier Registration Number',
      message:
        validation.WasteCollectionErrorMessages
          .charTooManyCarrierRegistrationNumber,
    });
  }

  if (!value.wasteCollectionModeOfWasteTransport?.trim()) {
    errors.push({
      field: 'Waste Collection Details Mode of Waste Transport',
      message: validation.WasteCollectionErrorMessages.emptyModeOfTransport,
    });
  } else {
    value.wasteCollectionModeOfWasteTransport = titleCaseSpacesRemoved(
      value.wasteCollectionModeOfWasteTransport
    );
    if (
      !modeOfWasteTransport.includes(value.wasteCollectionModeOfWasteTransport)
    ) {
      errors.push({
        field: 'Waste Collection Details Mode of Waste Transport',
        message:
          validation.WasteCollectionErrorMessages.invalidModeOfWasteTransport,
      });
    }
  }

  if (!value.wasteCollectionExpectedWasteCollectionDate) {
    errors.push({
      field: 'Waste Collection Details Expected Waste Collection Date',
      message:
        validation.WasteCollectionErrorMessages.missingWasteCollectionDate,
    });
  } else {
    const parsedDate = parse(
      value.wasteCollectionExpectedWasteCollectionDate,
      'P',
      new Date(),
      { locale: enGB }
    );
    const isValidDate = isValid(parsedDate);
    if (value.wasteCollectionExpectedWasteCollectionDate && !isValidDate) {
      errors.push({
        field: 'Waste Collection Details Expected Waste Collection Date',
        message:
          validation.WasteCollectionErrorMessages
            .invalidFormatWasteCollectionDate,
      });
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      value: errors,
    };
  }

  const dateParts = value.wasteCollectionExpectedWasteCollectionDate.split('/');
  return {
    valid: true,
    value: {
      wasteSource: value.wasteCollectionWasteSource,
      brokerRegistrationNumber: !value.wasteCollectionBrokerRegistrationNumber
        ? undefined
        : value.wasteCollectionBrokerRegistrationNumber,
      carrierRegistrationNumber: value.wasteCollectionCarrierRegistrationNumber,
      modeOfWasteTransport: value.wasteCollectionModeOfWasteTransport,
      expectedWasteCollectionDate: {
        day: dateParts[0],
        month: dateParts[1],
        year: dateParts[2],
      },
      address: {
        addressLine1: value.wasteCollectionAddressLine1,
        addressLine2: value.wasteCollectionAddressLine2,
        townCity: value.wasteCollectionTownCity,
        postcode: value.wasteCollectionPostcode,
        country: value.wasteCollectionCountry,
      },
    },
  };
}

export function validateReceiverDetailSection(
  value: ReceiverDetailFlattened
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: ReceiverDetail } {
  const errors: FieldFormatError[] = [];

  if (!value.receiverAuthorizationType?.trim()) {
    errors.push({
      field: 'Receiver authorization type',
      message:
        validation.ReceiverValidationErrorMessages.emptyAuthorizationType,
    });
  } else if (
    value.receiverAuthorizationType.length > validation.FreeTextChar.max
  ) {
    errors.push({
      field: 'Receiver authorization type',
      message:
        validation.ReceiverValidationErrorMessages
          .invalidAuthorizationTypeLength,
    });
  }

  if (
    value.receiverEnvironmentalPermitNumber?.trim() &&
    value.receiverEnvironmentalPermitNumber.length >
      validation.ReceiverEnvironmentalPermitNumberChar.max
  ) {
    errors.push({
      field: 'Receiver environmental permit number',
      message:
        validation.ReceiverValidationErrorMessages
          .invalidEnvironmentalPermitNumberLength,
    });
  }

  if (!value.receiverOrganisationName?.trim()) {
    errors.push({
      field: 'Receiver organisation name',
      message: validation.ReceiverValidationErrorMessages.emptyOrganisationName,
    });
  } else if (
    value.receiverOrganisationName.length > validation.FreeTextChar.max
  ) {
    errors.push({
      field: 'Receiver organisation name',
      message:
        validation.ReceiverValidationErrorMessages.charTooManyOrganisationName,
    });
  }

  if (!value.receiverAddressLine1?.trim()) {
    errors.push({
      field: 'Receiver address line 1',
      message: validation.ReceiverValidationErrorMessages.emptyAddressLine1,
    });
  } else if (value.receiverAddressLine1.length > validation.FreeTextChar.max) {
    errors.push({
      field: 'Receiver address line 1',
      message:
        validation.ReceiverValidationErrorMessages.charTooManyAddressLine1,
    });
  }

  if (
    value.receiverAddressLine2 &&
    value.receiverAddressLine2.length > validation.FreeTextChar.max
  ) {
    errors.push({
      field: 'Receiver address line 2',
      message:
        validation.ReceiverValidationErrorMessages.charTooManyAddressLine2,
    });
  }

  if (!value.receiverTownCity?.trim()) {
    errors.push({
      field: 'Receiver town or city',
      message: validation.ReceiverValidationErrorMessages.emptyTownOrCity,
    });
  } else {
    if (value.receiverTownCity.length > validation.FreeTextChar.max) {
      errors.push({
        field: 'Receiver town or city',
        message:
          validation.ReceiverValidationErrorMessages.charTooManyTownOrCity,
      });
    }
  }

  if (!value.receiverCountry?.trim()) {
    errors.push({
      field: 'Receiver country',
      message: validation.ReceiverValidationErrorMessages.emptyCountry,
    });
  } else {
    value.receiverCountry = titleCase(value.receiverCountry);
    if (!fourNationsCountries.includes(value.receiverCountry)) {
      errors.push({
        field: 'Receiver country',
        message: validation.ReceiverValidationErrorMessages.invalidCountry,
      });
    }
  }

  if (
    value.receiverPostcode?.trim() &&
    !validation.postcodeRegex.test(value.receiverPostcode)
  ) {
    errors.push({
      field: 'Receiver postcode',
      message: validation.ReceiverValidationErrorMessages.invalidPostcode,
    });
  }

  if (!value.receiverContactName?.trim()) {
    errors.push({
      field: 'Receiver contact name',
      message: validation.ReceiverValidationErrorMessages.emptyContactFullName,
    });
  } else if (value.receiverContactName.length > validation.FreeTextChar.max) {
    errors.push({
      field: 'Receiver contact name',
      message:
        validation.ReceiverValidationErrorMessages.charTooManyContactFullName,
    });
  }

  const reformattedReceiverContactPhoneNumber =
    value.receiverContactPhone.replace(/'/g, '');
  if (!reformattedReceiverContactPhoneNumber) {
    errors.push({
      field: 'Receiver contact phone number',
      message: validation.ReceiverValidationErrorMessages.emptyPhone,
    });
  } else if (
    !validation.phoneRegex.test(reformattedReceiverContactPhoneNumber)
  ) {
    errors.push({
      field: 'Receiver contact phone number',
      message: validation.ReceiverValidationErrorMessages.invalidPhone,
    });
  }

  if (!value.receiverContactEmail) {
    errors.push({
      field: 'Receiver contact email address',
      message: validation.ReceiverValidationErrorMessages.emptyEmail,
    });
  } else if (!validation.emailRegex.test(value.receiverContactEmail)) {
    errors.push({
      field: 'Receiver contact email address',
      message: validation.ReceiverValidationErrorMessages.invalidEmail,
    });
  } else if (value.receiverContactEmail.length > validation.FreeTextChar.max) {
    errors.push({
      field: 'Receiver contact email address',
      message: validation.ReceiverValidationErrorMessages.charTooManyEmail,
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      value: errors,
    };
  }

  return {
    valid: true,
    value: {
      authorizationType: value.receiverAuthorizationType,
      environmentalPermitNumber: value.receiverEnvironmentalPermitNumber,
      address: {
        addressLine1: value.receiverAddressLine1,
        addressLine2: value.receiverAddressLine2
          ? value.receiverAddressLine2
          : undefined,
        country: value.receiverCountry,
        postcode: value.receiverPostcode,
        townCity: value.receiverTownCity,
      },
      contact: {
        email: value.receiverContactEmail,
        name: value.receiverContactName,
        organisationName: value.receiverOrganisationName,
        phone: reformattedReceiverContactPhoneNumber,
      },
    },
  };
}

export function validateWasteTransportationDetailSection(
  value: WasteTransportationDetailFlattened
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: WasteTransportationDetail } {
  const errors: FieldFormatError[] = [];

  if (!value.wasteTransportationNumberAndTypeOfContainers?.trim()) {
    errors.push({
      field: 'Number and type of transportation containers',
      message:
        validation.WasteTransportationValidationErrorMessages
          .emptyNameAndTypeOfContainers,
    });
  } else if (
    value.wasteTransportationNumberAndTypeOfContainers?.trim() &&
    value.wasteTransportationNumberAndTypeOfContainers.length >
      validation.FreeTextChar.max
  ) {
    errors.push({
      field: 'Number and type of transportation containers',
      message:
        validation.WasteTransportationValidationErrorMessages
          .charTooManyNameAndTypeOfContainers,
    });
  }

  if (
    value.wasteTransportationSpecialHandlingRequirements?.trim() &&
    value.wasteTransportationSpecialHandlingRequirements.length >
      validation.FreeTextChar.max
  ) {
    errors.push({
      field: 'Special handling requirements details',
      message:
        validation.WasteTransportationValidationErrorMessages
          .charTooManySpecialHandlingRequirements,
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      value: errors,
    };
  }

  return {
    valid: true,
    value: {
      numberAndTypeOfContainers:
        value.wasteTransportationNumberAndTypeOfContainers,
      specialHandlingRequirements:
        value.wasteTransportationSpecialHandlingRequirements,
    },
  };
}

type WasteTypeEntry = {
  wasteTypeEwcCode?: string;
  wasteTypeWasteDescription?: string;
  wasteTypePhysicalForm?: string;
  wasteTypeWasteQuantity?: string;
  wasteTypeWasteQuantityUnit?: string;
  wasteTypeWasteQuantityType?: string;
  wasteTypeHasHazardousProperties?: string;
  wasteTypeHazardousWasteCodesString?: string;
  wasteTypeContainsPops?: string;
  wasteTypePopsString?: string;
  wasteTypePopsConcentrationsString?: string;
  wasteTypePopsConcentrationUnitsString?: string;
  wasteTypeChemicalAndBiologicalComponentsString?: string;
  wasteTypeChemicalAndBiologicalComponentsConcentrationsString?: string;
  wasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString?: string;
};

export function validateWasteTypeDetailSection(
  value: WasteTypeDetailFlattened,
  hazardousCodesRefData: WasteCode[],
  popsRefData: Pop[],
  ewcCodes: WasteCode[]
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: WasteTypeDetail[] } {
  const wasteTypesArr: WasteTypeEntry[] = [
    {
      wasteTypeEwcCode: value.firstWasteTypeEwcCode,
      wasteTypeWasteDescription: value.firstWasteTypeWasteDescription,
      wasteTypePhysicalForm: value.firstWasteTypePhysicalForm,
      wasteTypeWasteQuantity: value.firstWasteTypeWasteQuantity,
      wasteTypeWasteQuantityUnit: value.firstWasteTypeWasteQuantityUnit,
      wasteTypeWasteQuantityType: value.firstWasteTypeWasteQuantityType,
      wasteTypeHasHazardousProperties:
        value.firstWasteTypeHasHazardousProperties,
      wasteTypeHazardousWasteCodesString:
        value.firstWasteTypeHazardousWasteCodesString,
      wasteTypeContainsPops: value.firstWasteTypeContainsPops,
      wasteTypePopsString: value.firstWasteTypePopsString,
      wasteTypePopsConcentrationsString:
        value.firstWasteTypePopsConcentrationsString,
      wasteTypePopsConcentrationUnitsString:
        value.firstWasteTypePopsConcentrationUnitsString,
      wasteTypeChemicalAndBiologicalComponentsString:
        value.firstWasteTypeChemicalAndBiologicalComponentsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationsString:
        value.firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
        value.firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
    },
    {
      wasteTypeEwcCode: value.secondWasteTypeEwcCode,
      wasteTypeWasteDescription: value.secondWasteTypeWasteDescription,
      wasteTypePhysicalForm: value.secondWasteTypePhysicalForm,
      wasteTypeWasteQuantity: value.secondWasteTypeWasteQuantity,
      wasteTypeWasteQuantityUnit: value.secondWasteTypeWasteQuantityUnit,
      wasteTypeWasteQuantityType: value.secondWasteTypeWasteQuantityType,
      wasteTypeHasHazardousProperties:
        value.secondWasteTypeHasHazardousProperties,
      wasteTypeHazardousWasteCodesString:
        value.secondWasteTypeHazardousWasteCodesString,
      wasteTypeContainsPops: value.secondWasteTypeContainsPops,
      wasteTypePopsString: value.secondWasteTypePopsString,
      wasteTypePopsConcentrationsString:
        value.secondWasteTypePopsConcentrationsString,
      wasteTypePopsConcentrationUnitsString:
        value.secondWasteTypePopsConcentrationUnitsString,
      wasteTypeChemicalAndBiologicalComponentsString:
        value.secondWasteTypeChemicalAndBiologicalComponentsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationsString:
        value.secondWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
        value.secondWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
    },
    {
      wasteTypeEwcCode: value.thirdWasteTypeEwcCode,
      wasteTypeWasteDescription: value.thirdWasteTypeWasteDescription,
      wasteTypePhysicalForm: value.thirdWasteTypePhysicalForm,
      wasteTypeWasteQuantity: value.thirdWasteTypeWasteQuantity,
      wasteTypeWasteQuantityUnit: value.thirdWasteTypeWasteQuantityUnit,
      wasteTypeWasteQuantityType: value.thirdWasteTypeWasteQuantityType,
      wasteTypeHasHazardousProperties:
        value.thirdWasteTypeHasHazardousProperties,
      wasteTypeHazardousWasteCodesString:
        value.thirdWasteTypeHazardousWasteCodesString,
      wasteTypeContainsPops: value.thirdWasteTypeContainsPops,
      wasteTypePopsString: value.thirdWasteTypePopsString,
      wasteTypePopsConcentrationsString:
        value.thirdWasteTypePopsConcentrationsString,
      wasteTypePopsConcentrationUnitsString:
        value.thirdWasteTypePopsConcentrationUnitsString,
      wasteTypeChemicalAndBiologicalComponentsString:
        value.thirdWasteTypeChemicalAndBiologicalComponentsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationsString:
        value.thirdWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
        value.thirdWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
    },
    {
      wasteTypeEwcCode: value.fourthWasteTypeEwcCode,
      wasteTypeWasteDescription: value.fourthWasteTypeWasteDescription,
      wasteTypePhysicalForm: value.fourthWasteTypePhysicalForm,
      wasteTypeWasteQuantity: value.fourthWasteTypeWasteQuantity,
      wasteTypeWasteQuantityUnit: value.fourthWasteTypeWasteQuantityUnit,
      wasteTypeWasteQuantityType: value.fourthWasteTypeWasteQuantityType,
      wasteTypeHasHazardousProperties:
        value.fourthWasteTypeHasHazardousProperties,
      wasteTypeHazardousWasteCodesString:
        value.fourthWasteTypeHazardousWasteCodesString,
      wasteTypeContainsPops: value.fourthWasteTypeContainsPops,
      wasteTypePopsString: value.fourthWasteTypePopsString,
      wasteTypePopsConcentrationsString:
        value.fourthWasteTypePopsConcentrationsString,
      wasteTypePopsConcentrationUnitsString:
        value.fourthWasteTypePopsConcentrationUnitsString,
      wasteTypeChemicalAndBiologicalComponentsString:
        value.fourthWasteTypeChemicalAndBiologicalComponentsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationsString:
        value.fourthWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
        value.fourthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
    },
    {
      wasteTypeEwcCode: value.fifthWasteTypeEwcCode,
      wasteTypeWasteDescription: value.fifthWasteTypeWasteDescription,
      wasteTypePhysicalForm: value.fifthWasteTypePhysicalForm,
      wasteTypeWasteQuantity: value.fifthWasteTypeWasteQuantity,
      wasteTypeWasteQuantityUnit: value.fifthWasteTypeWasteQuantityUnit,
      wasteTypeWasteQuantityType: value.fifthWasteTypeWasteQuantityType,
      wasteTypeHasHazardousProperties:
        value.fifthWasteTypeHasHazardousProperties,
      wasteTypeHazardousWasteCodesString:
        value.fifthWasteTypeHazardousWasteCodesString,
      wasteTypeContainsPops: value.fifthWasteTypeContainsPops,
      wasteTypePopsString: value.fifthWasteTypePopsString,
      wasteTypePopsConcentrationsString:
        value.fifthWasteTypePopsConcentrationsString,
      wasteTypePopsConcentrationUnitsString:
        value.fifthWasteTypePopsConcentrationUnitsString,
      wasteTypeChemicalAndBiologicalComponentsString:
        value.fifthWasteTypeChemicalAndBiologicalComponentsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationsString:
        value.fifthWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
        value.fifthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
    },
    {
      wasteTypeEwcCode: value.sixthWasteTypeEwcCode,
      wasteTypeWasteDescription: value.sixthWasteTypeWasteDescription,
      wasteTypePhysicalForm: value.sixthWasteTypePhysicalForm,
      wasteTypeWasteQuantity: value.sixthWasteTypeWasteQuantity,
      wasteTypeWasteQuantityUnit: value.sixthWasteTypeWasteQuantityUnit,
      wasteTypeWasteQuantityType: value.sixthWasteTypeWasteQuantityType,
      wasteTypeHasHazardousProperties:
        value.sixthWasteTypeHasHazardousProperties,
      wasteTypeHazardousWasteCodesString:
        value.sixthWasteTypeHazardousWasteCodesString,
      wasteTypeContainsPops: value.sixthWasteTypeContainsPops,
      wasteTypePopsString: value.sixthWasteTypePopsString,
      wasteTypePopsConcentrationsString:
        value.sixthWasteTypePopsConcentrationsString,
      wasteTypePopsConcentrationUnitsString:
        value.sixthWasteTypePopsConcentrationUnitsString,
      wasteTypeChemicalAndBiologicalComponentsString:
        value.sixthWasteTypeChemicalAndBiologicalComponentsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationsString:
        value.sixthWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
        value.sixthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
    },
    {
      wasteTypeEwcCode: value.seventhWasteTypeEwcCode,
      wasteTypeWasteDescription: value.seventhWasteTypeWasteDescription,
      wasteTypePhysicalForm: value.seventhWasteTypePhysicalForm,
      wasteTypeWasteQuantity: value.seventhWasteTypeWasteQuantity,
      wasteTypeWasteQuantityUnit: value.seventhWasteTypeWasteQuantityUnit,
      wasteTypeWasteQuantityType: value.seventhWasteTypeWasteQuantityType,
      wasteTypeHasHazardousProperties:
        value.seventhWasteTypeHasHazardousProperties,
      wasteTypeHazardousWasteCodesString:
        value.seventhWasteTypeHazardousWasteCodesString,
      wasteTypeContainsPops: value.seventhWasteTypeContainsPops,
      wasteTypePopsString: value.seventhWasteTypePopsString,
      wasteTypePopsConcentrationsString:
        value.seventhWasteTypePopsConcentrationsString,
      wasteTypePopsConcentrationUnitsString:
        value.seventhWasteTypePopsConcentrationUnitsString,
      wasteTypeChemicalAndBiologicalComponentsString:
        value.seventhWasteTypeChemicalAndBiologicalComponentsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationsString:
        value.seventhWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
        value.seventhWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
    },
    {
      wasteTypeEwcCode: value.eighthWasteTypeEwcCode,
      wasteTypeWasteDescription: value.eighthWasteTypeWasteDescription,
      wasteTypePhysicalForm: value.eighthWasteTypePhysicalForm,
      wasteTypeWasteQuantity: value.eighthWasteTypeWasteQuantity,
      wasteTypeWasteQuantityType: value.eighthWasteTypeWasteQuantityType,
      wasteTypeWasteQuantityUnit: value.eighthWasteTypeWasteQuantityUnit,
      wasteTypeHasHazardousProperties:
        value.eighthWasteTypeHasHazardousProperties,
      wasteTypeHazardousWasteCodesString:
        value.eighthWasteTypeHazardousWasteCodesString,
      wasteTypeContainsPops: value.eighthWasteTypeContainsPops,
      wasteTypePopsString: value.eighthWasteTypePopsString,
      wasteTypePopsConcentrationsString:
        value.eighthWasteTypePopsConcentrationsString,
      wasteTypePopsConcentrationUnitsString:
        value.eighthWasteTypePopsConcentrationUnitsString,
      wasteTypeChemicalAndBiologicalComponentsString:
        value.eighthWasteTypeChemicalAndBiologicalComponentsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationsString:
        value.eighthWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
        value.eighthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
    },
    {
      wasteTypeEwcCode: value.ninthWasteTypeEwcCode,
      wasteTypeWasteDescription: value.ninthWasteTypeWasteDescription,
      wasteTypePhysicalForm: value.ninthWasteTypePhysicalForm,
      wasteTypeWasteQuantity: value.ninthWasteTypeWasteQuantity,
      wasteTypeWasteQuantityUnit: value.ninthWasteTypeWasteQuantityUnit,
      wasteTypeWasteQuantityType: value.ninthWasteTypeWasteQuantityType,
      wasteTypeHasHazardousProperties:
        value.ninthWasteTypeHasHazardousProperties,
      wasteTypeHazardousWasteCodesString:
        value.ninthWasteTypeHazardousWasteCodesString,
      wasteTypeContainsPops: value.ninthWasteTypeContainsPops,
      wasteTypePopsString: value.ninthWasteTypePopsString,
      wasteTypePopsConcentrationsString:
        value.ninthWasteTypePopsConcentrationsString,
      wasteTypePopsConcentrationUnitsString:
        value.ninthWasteTypePopsConcentrationUnitsString,
      wasteTypeChemicalAndBiologicalComponentsString:
        value.ninthWasteTypeChemicalAndBiologicalComponentsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationsString:
        value.ninthWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
        value.ninthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
    },
    {
      wasteTypeEwcCode: value.tenthWasteTypeEwcCode,
      wasteTypeWasteDescription: value.tenthWasteTypeWasteDescription,
      wasteTypePhysicalForm: value.tenthWasteTypePhysicalForm,
      wasteTypeWasteQuantity: value.tenthWasteTypeWasteQuantity,
      wasteTypeWasteQuantityUnit: value.tenthWasteTypeWasteQuantityUnit,
      wasteTypeWasteQuantityType: value.tenthWasteTypeWasteQuantityType,
      wasteTypeHasHazardousProperties:
        value.tenthWasteTypeHasHazardousProperties,
      wasteTypeHazardousWasteCodesString:
        value.tenthWasteTypeHazardousWasteCodesString,
      wasteTypeContainsPops: value.tenthWasteTypeContainsPops,
      wasteTypePopsString: value.tenthWasteTypePopsString,
      wasteTypePopsConcentrationsString:
        value.tenthWasteTypePopsConcentrationsString,
      wasteTypePopsConcentrationUnitsString:
        value.tenthWasteTypePopsConcentrationUnitsString,
      wasteTypeChemicalAndBiologicalComponentsString:
        value.tenthWasteTypeChemicalAndBiologicalComponentsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationsString:
        value.tenthWasteTypeChemicalAndBiologicalComponentsConcentrationsString,
      wasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
        value.tenthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString,
    },
  ];

  const wasteTypes: WasteTypeDetail[] = [];
  const errors: FieldFormatError[] = [];

  wasteTypesArr.forEach((wasteType, index) => {
    if (index > 0 && !wasteType.wasteTypeEwcCode) {
      return;
    }

    const errorMessage = validation.WasteTypeValidationErrorMessages(index + 1);
    const entryValidationResult = validateWasteTypeEntry(
      wasteType,
      errorMessage,
      hazardousCodesRefData,
      popsRefData,
      ewcCodes
    );

    if (!entryValidationResult.valid) {
      errors.push(...entryValidationResult.value);
    } else {
      wasteTypes.push(entryValidationResult.value);
    }
  });

  if (errors.length > 0) {
    return {
      valid: false,
      value: errors,
    };
  }

  return {
    valid: true,
    value: wasteTypes,
  };
}

function validateWasteTypeEntry(
  wasteType: WasteTypeEntry,
  errorMessage: WasteTypeErrorMessage,
  hazardousCodesRefData: WasteCode[],
  popsRefData: Pop[],
  ewcCodes: WasteCode[]
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: WasteTypeDetail } {
  const errors: FieldFormatError[] = [];
  wasteType.wasteTypeEwcCode = wasteType.wasteTypeEwcCode
    ?.trim()
    ?.replace(/'/g, '')
    ?.replace(/\s/g, '')
    ?.replace(/\*/g, '');

  if (!wasteType.wasteTypeEwcCode) {
    errors.push({
      field: 'EWC Code',
      message: errorMessage.emptyEwcCode,
    });
  } else if (
    !ewcCodes.some(
      (ewc) =>
        ewc.code === wasteType.wasteTypeEwcCode ||
        ewc.code === wasteType.wasteTypeEwcCode + '*'
    )
  ) {
    errors.push({
      field: 'EWC Code',
      message: errorMessage.invalidEwcCode,
    });
  }

  if (!wasteType.wasteTypeWasteDescription?.trim()) {
    errors.push({
      field: 'Waste Description',
      message: errorMessage.emptyWasteDescription,
    });
  } else if (
    wasteType.wasteTypeWasteDescription?.trim() &&
    wasteType.wasteTypeWasteDescription.length >
      validation.WasteDescriptionChar.max
  ) {
    errors.push({
      field: 'Waste Description',
      message: errorMessage.charTooManyWasteDescription,
    });
  }

  if (!wasteType.wasteTypePhysicalForm?.trim()) {
    errors.push({
      field: 'Physical Form',
      message: errorMessage.emptyPhysicalForm,
    });
  } else {
    wasteType.wasteTypePhysicalForm = titleCase(
      wasteType.wasteTypePhysicalForm
    );
    if (!wastePhysicalForms.includes(wasteType.wasteTypePhysicalForm)) {
      errors.push({
        field: 'Physical Form',
        message: errorMessage.invalidPhysicalForm,
      });
    }
  }

  let wasteQuantity = 0;

  if (!wasteType.wasteTypeWasteQuantity?.trim()) {
    errors.push({
      field: 'Waste Quantity',
      message: errorMessage.emptyWasteQuantity,
    });
  } else {
    if (!validation.deicmalNumberRegex.test(wasteType.wasteTypeWasteQuantity)) {
      errors.push({
        field: 'Waste Quantity',
        message: errorMessage.invalidWasteQuantity,
      });
    } else {
      wasteQuantity = Number(
        parseFloat(wasteType.wasteTypeWasteQuantity).toFixed(2)
      );

      if (!(wasteQuantity > validation.WasteQuantityValue.greaterThan)) {
        errors.push({
          field: 'Waste Quantity',
          message: errorMessage.valueTooSmallWasteQuantity,
        });
      }
    }
  }

  if (!wasteType.wasteTypeWasteQuantityUnit?.trim()) {
    errors.push({
      field: 'Waste Quantity Units',
      message: errorMessage.emptyWasteQuantityUnit,
    });
  } else {
    wasteType.wasteTypeWasteQuantityUnit =
      wasteQuantitiesMap[titleCase(wasteType.wasteTypeWasteQuantityUnit)];
    if (!wasteType.wasteTypeWasteQuantityUnit) {
      errors.push({
        field: 'Waste Quantity Units',
        message: errorMessage.invalidWasteQuantityUnit,
      });
    }
  }

  let wasteQuantityType = '';
  const quantityType = wasteType.wasteTypeWasteQuantityType
    ?.replace(/\s/g, '')
    ?.toLowerCase();

  if (quantityType === 'actual') {
    wasteQuantityType = 'ActualData';
  } else if (quantityType === 'estimate') {
    wasteQuantityType = 'EstimateData';
  } else {
    errors.push({
      field: 'Quantity of waste (actual or estimate)',
      message: errorMessage.invalidWasteQuantityType,
    });
  }

  const chemicalAndBiologicalComponents =
    wasteType.wasteTypeChemicalAndBiologicalComponentsString
      ?.split(';')
      ?.map((str) => str.trim())
      ?.filter((str) => str) || [];

  if (!chemicalAndBiologicalComponents?.length) {
    errors.push({
      field: 'Chemical and biological components of the waste',
      message: errorMessage.emptyChemicalAndBiologicalComponents,
    });
  } else if (
    chemicalAndBiologicalComponents.length &&
    wasteType.wasteTypeChemicalAndBiologicalComponentsString!.length >
      validation.FreeTextChar.max
  ) {
    errors.push({
      field: 'Chemical and biological components of the waste',
      message: errorMessage.charTooManyChemicalAndBiologicalComponents,
    });
  }

  const chemicalAndBiologicalConcentrationStrings =
    wasteType.wasteTypeChemicalAndBiologicalComponentsConcentrationsString
      ?.trim()
      ?.replace(/\s/g, '')
      ?.split(';')
      ?.map((str) => str.trim())
      ?.filter((str) => str);

  const chemicalAndBiologicalConcentrations: number[] = [];

  if (!chemicalAndBiologicalConcentrationStrings?.length) {
    errors.push({
      field: 'Chemical and biological concentration values',
      message: errorMessage.emptyChemicalAndBiologicalConcentration,
    });
  } else if (chemicalAndBiologicalConcentrationStrings?.length) {
    if (
      chemicalAndBiologicalConcentrationStrings.length !==
      chemicalAndBiologicalComponents.length
    ) {
      errors.push({
        field: 'Chemical and biological concentration values',
        message: errorMessage.wrongAmountChemicalAndBiologicalContentration,
      });
    } else {
      for (const concentration of chemicalAndBiologicalConcentrationStrings) {
        if (!validation.deicmalNumberRegex.test(concentration)) {
          errors.push({
            field: 'Chemical and biological concentration values',
            message: errorMessage.invalidChemicalAndBiologicalConcentration,
          });
          break;
        }

        chemicalAndBiologicalConcentrations.push(
          Number(parseFloat(concentration).toFixed(2))
        );
      }
    }
  }

  const chemicalAndBiologicalConcentrationUnits =
    wasteType.wasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString
      ?.trim()
      ?.replace(/\s/g, '')
      ?.split(';')
      ?.map((str) => str.trim())
      ?.filter((str) => str);

  if (!chemicalAndBiologicalConcentrationUnits?.length) {
    errors.push({
      field: 'Chemical and biological concentration units of measure',
      message: errorMessage.emptyChemicalAndBiologicalConcentrationUnit,
    });
  } else if (chemicalAndBiologicalConcentrationUnits?.length) {
    if (
      chemicalAndBiologicalConcentrationUnits.length !==
      chemicalAndBiologicalComponents.length
    ) {
      errors.push({
        field: 'Chemical and biological concentration units of measure',
        message: errorMessage.wrongAmountChemicalAndBiologicalContentrationUnit,
      });
    } else {
      for (const unit of chemicalAndBiologicalConcentrationUnits) {
        if (
          unit.length >
          validation.ChemicalAndBiologicalConcentrationUnitChar.max
        ) {
          errors.push({
            field: 'Chemical and biological concentration units of measure',
            message:
              errorMessage.charTooManyChemicalAndBiologicalConcentrationUnit,
          });
          break;
        }
      }
    }
  }

  let hasHazardousProperties = false;
  const hasHazardousPropertiesString = wasteType.wasteTypeHasHazardousProperties
    ?.trim()
    ?.toLowerCase();

  if (hasHazardousPropertiesString === 'y') {
    hasHazardousProperties = true;
  } else if (hasHazardousPropertiesString === 'n') {
    hasHazardousProperties = false;
  } else {
    errors.push({
      field: 'Waste Has Hazardous Properties',
      message: errorMessage.invalidHasHazardousProperties,
    });
  }

  wasteType.wasteTypeHazardousWasteCodesString =
    wasteType.wasteTypeHazardousWasteCodesString?.trim()?.replace(/\s/g, '');

  const hazardousCodesInput: string[] = [
    ...new Set(
      wasteType.wasteTypeHazardousWasteCodesString
        ?.split(';')
        ?.filter((str) => str)
    ),
  ];

  const hazardousCodes = hazardousCodesRefData.filter((hazCode) =>
    hazardousCodesInput.some(
      (code) => code.toLowerCase() === hazCode.code.toLowerCase()
    )
  );

  if (hasHazardousProperties && !hazardousCodesInput.length) {
    errors.push({
      field: 'Hazardous Waste Codes',
      message: errorMessage.emptyHazardousWasteCodes,
    });
  } else if (
    hazardousCodesInput.length &&
    hazardousCodesInput.length !== hazardousCodes.length
  ) {
    const invalidHazardousCodes = hazardousCodesInput.filter(
      (code) =>
        !hazardousCodesRefData.some(
          (hazardousCode) =>
            hazardousCode.code.toLowerCase() === code.toLowerCase()
        )
    );

    if (invalidHazardousCodes.length > 0) {
      errors.push({
        field: 'Hazardous Waste Codes',
        message: errorMessage.invalidHazardousWasteCodes(invalidHazardousCodes),
      });
    }
  }

  let containsPops = false;
  const containsPopsString = wasteType.wasteTypeContainsPops
    ?.trim()
    ?.toLowerCase();

  if (containsPopsString === 'y') {
    containsPops = true;
  } else if (containsPopsString === 'n') {
    containsPops = false;
  } else {
    errors.push({
      field: 'Waste Contains POPs',
      message: errorMessage.invalidContainsPops,
    });
  }

  wasteType.wasteTypePopsString = wasteType.wasteTypePopsString?.trim();

  let pops: string[] = [];

  if (containsPops && !wasteType.wasteTypePopsString) {
    errors.push({
      field: 'Persistant organic pollutants (POPs)',
      message: errorMessage.emptyHazardousWasteCodes,
    });
  } else if (wasteType.wasteTypePopsString) {
    pops = [
      ...new Set(
        wasteType.wasteTypePopsString
          .split(';')
          .map((str) => str.trim())
          .filter((str) => str)
      ),
    ];
    const invalidPops = pops.filter(
      (pop) =>
        !popsRefData.some((p) => p.name.en.toLowerCase() === pop.toLowerCase())
    );

    if (invalidPops.length > 0) {
      errors.push({
        field: 'Persistant organic pollutants (POPs)',
        message: errorMessage.invalidPops(invalidPops),
      });
    }
  }

  const popConcentrationStrings = wasteType.wasteTypePopsConcentrationsString
    ?.trim()
    ?.replace(/\s/g, '')
    ?.split(';')
    ?.map((str) => str.trim())
    ?.filter((str) => str);

  const popConcentrations: number[] = [];

  if (!popConcentrationStrings?.length && pops.length > 0) {
    errors.push({
      field: 'Persistant organic pollutants (POPs) Concentrations',
      message: errorMessage.emptyPopConcentration,
    });
  } else if (popConcentrationStrings?.length) {
    if (popConcentrationStrings.length !== pops.length) {
      errors.push({
        field: 'Persistant organic pollutants (POPs) Concentrations',
        message: errorMessage.wrongAmountPopContentration,
      });
    } else {
      for (const concentration of popConcentrationStrings) {
        if (!validation.deicmalNumberRegex.test(concentration)) {
          errors.push({
            field: 'Persistant organic pollutants (POPs) Concentrations',
            message: errorMessage.invalidPopConcentration,
          });
          break;
        }

        popConcentrations.push(Number(parseFloat(concentration).toFixed(2)));
      }
    }
  }

  const popConcentrationUnits = wasteType.wasteTypePopsConcentrationUnitsString
    ?.trim()
    ?.replace(/\s/g, '')
    ?.split(';')
    ?.map((str) => str.trim())
    ?.filter((str) => str);

  if (!popConcentrationUnits?.length && pops.length > 0) {
    errors.push({
      field: 'Persistant organic pollutants (POPs) Concentration Units',
      message: errorMessage.emptyPopConcentrationUnit,
    });
  } else if (popConcentrationUnits?.length) {
    if (popConcentrationUnits.length !== pops.length) {
      errors.push({
        field: 'Persistant organic pollutants (POPs) Concentration Units',
        message: errorMessage.wrongAmountPopContentrationUnit,
      });
    } else {
      for (const unit of popConcentrationUnits) {
        if (unit.length > validation.PopConcentrationUnitChar.max) {
          errors.push({
            field: 'Persistant organic pollutants (POPs) Concentrations',
            message: errorMessage.charTooManyPopConcentrationUnit,
          });
          break;
        }
      }
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      value: errors,
    };
  }

  return {
    valid: true,
    value: {
      ewcCode: wasteType.wasteTypeEwcCode!,
      containsPops: containsPops,
      hasHazardousProperties: hasHazardousProperties,
      physicalForm: wasteType.wasteTypePhysicalForm as PhysicalForm,
      quantityUnit: wasteType.wasteTypeWasteQuantityUnit as QuantityUnit,
      wasteDescription: wasteType.wasteTypeWasteDescription!,
      wasteQuantity: wasteQuantity,
      wasteQuantityType: wasteQuantityType as WasteQuantityType,
      chemicalAndBiologicalComponents: chemicalAndBiologicalComponents.map(
        (chemicalAndBiologicalComponent, index) => ({
          name: chemicalAndBiologicalComponent,
          concentration: chemicalAndBiologicalConcentrations[index],
          concentrationUnit: chemicalAndBiologicalConcentrationUnits![index],
        })
      ),
      hazardousWasteCodes: hazardousCodes.map((hazCode) => ({
        code: hazCode.code,
        name: hazCode.value.description.en,
      })),
      pops: pops.map((pop, index) => ({
        name: pop,
        concentration: popConcentrations[index],
        concentrationUnit: popConcentrationUnits![index],
      })),
    },
  };
}
