import { LocalAuthority, Pop, WasteCode } from '@wts/api/reference-data';
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
  WasteTypeErrorCode,
  CarrierDetail,
  CarrierDetailFlattened,
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

const wasteSources = ['Household', 'Commercial'];

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
      code: validation.errorCodes.producerEmptyReference,
    });
  } else if (trimmedReference.length > validation.ReferenceChar.max) {
    errors.push({
      field: 'Reference',
      code: validation.errorCodes.producerCharTooManyReference,
    });
  } else if (!validation.referenceRegex.test(trimmedReference)) {
    errors.push({
      field: 'Reference',
      code: validation.errorCodes.producerInvalidReference,
    });
  }

  if (!value.producerOrganisationName?.trim()) {
    errors.push({
      field: 'Producer organisation name',
      code: validation.errorCodes.producerEmptyOrganisationName,
    });
  } else if (
    value.producerOrganisationName.length > validation.FreeTextChar.max
  ) {
    errors.push({
      field: 'Producer organisation name',
      code: validation.errorCodes.producerCharTooManyOrganisationName,
    });
  }

  if (!value.producerAddressLine1?.trim()) {
    errors.push({
      field: 'Producer address line 1',
      code: validation.errorCodes.producerEmptyAddressLine1,
    });
  } else if (value.producerAddressLine1.length > validation.FreeTextChar.max) {
    errors.push({
      field: 'Producer address line 1',
      code: validation.errorCodes.producerCharTooManyAddressLine1,
    });
  }

  if (
    value.producerAddressLine2 &&
    value.producerAddressLine2.length > validation.FreeTextChar.max
  ) {
    errors.push({
      field: 'Producer address line 2',
      code: validation.errorCodes.producerCharTooManyAddressLine2,
    });
  }

  if (!value.producerTownCity?.trim()) {
    errors.push({
      field: 'Producer town or city',
      code: validation.errorCodes.producerEmptyTownOrCity,
    });
  } else {
    if (value.producerTownCity.length > validation.FreeTextChar.max) {
      errors.push({
        field: 'Producer town or city',
        code: validation.errorCodes.producerCharTooManyTownOrCity,
      });
    }
  }

  if (!value.producerCountry?.trim()) {
    errors.push({
      field: 'Producer country',
      code: validation.errorCodes.producerEmptyCountry,
    });
  } else {
    value.producerCountry = titleCase(value.producerCountry);
    if (!fourNationsCountries.includes(value.producerCountry)) {
      errors.push({
        field: 'Producer country',
        code: validation.errorCodes.producerInvalidCountry,
      });
    }
  }

  if (
    value.producerPostcode?.trim() &&
    !validation.postcodeRegex.test(value.producerPostcode)
  ) {
    errors.push({
      field: 'Producer postcode',
      code: validation.errorCodes.producerInvalidPostcode,
    });
  }

  if (!value.producerContactName?.trim()) {
    errors.push({
      field: 'Producer contact name',
      code: validation.errorCodes.producerEmptyContactFullName,
    });
  } else if (value.producerContactName.length > validation.FreeTextChar.max) {
    errors.push({
      field: 'Producer contact name',
      code: validation.errorCodes.producerCharTooManyContactFullName,
    });
  }

  const reformattedReceiverContactPhoneNumber = value.producerContactPhone
    ?.replace(/'/g, '')
    ?.trim();
  if (!reformattedReceiverContactPhoneNumber) {
    errors.push({
      field: 'Producer contact phone number',
      code: validation.errorCodes.producerEmptyPhone,
    });
  } else if (
    !validation.phoneRegex.test(reformattedReceiverContactPhoneNumber)
  ) {
    errors.push({
      field: 'Producer contact phone number',
      code: validation.errorCodes.producerInvalidPhone,
    });
  }

  if (!value.producerContactEmail?.trim()) {
    errors.push({
      field: 'Producer contact email address',
      code: validation.errorCodes.producerEmptyEmail,
    });
  } else if (!validation.emailRegex.test(value.producerContactEmail)) {
    errors.push({
      field: 'Producer contact email address',
      code: validation.errorCodes.producerInvalidEmail,
    });
  } else if (value.producerContactEmail.length > validation.FreeTextChar.max) {
    errors.push({
      field: 'Producer contact email address',
      code: validation.errorCodes.producerCharTooManyEmail,
    });
  }

  if (
    value.producerSicCode &&
    !validation.producerSicCodeRegex.test(value.producerSicCode)
  ) {
    errors.push({
      field: 'Producer Standard Industrial Classification (SIC) code',
      code: validation.errorCodes.producerInvalidSicCode,
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
export function validateCarrierDetailSection(
  value: CarrierDetailFlattened
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: CarrierDetail } {
  const errors: FieldFormatError[] = [];

  if (
    value.carrierOrganisationName?.trim() ||
    value.carrierAddressLine1?.trim() ||
    value.carrierAddressLine2?.trim() ||
    value.carrierTownCity?.trim() ||
    value.carrierCountry?.trim() ||
    value.carrierPostcode?.trim() ||
    value.carrierContactName?.trim() ||
    value.carrierContactEmail?.trim() ||
    value.carrierContactPhone?.trim()
  ) {
    if (!value.carrierOrganisationName?.trim()) {
      errors.push({
        field: 'Carrier organisation name',
        code: validation.errorCodes.carrierEmptyOrganisationName,
      });
    } else if (
      value.carrierOrganisationName.length > validation.FreeTextChar.max
    ) {
      errors.push({
        field: 'Carrier organisation name',
        code: validation.errorCodes.carrierCharTooManyOrganisationName,
      });
    }

    if (!value.carrierAddressLine1?.trim()) {
      errors.push({
        field: 'Carrier address line 1',
        code: validation.errorCodes.carrierEmptyAddressLine1,
      });
    } else if (value.carrierAddressLine1.length > validation.FreeTextChar.max) {
      errors.push({
        field: 'Carrier address line 1',
        code: validation.errorCodes.carrierCharTooManyAddressLine1,
      });
    }

    if (
      value.carrierAddressLine2 &&
      value.carrierAddressLine2.length > validation.FreeTextChar.max
    ) {
      errors.push({
        field: 'Carrier address line 2',
        code: validation.errorCodes.carrierCharTooManyAddressLine2,
      });
    }

    if (!value.carrierTownCity?.trim()) {
      errors.push({
        field: 'Carrier town or city',
        code: validation.errorCodes.carrierEmptyTownOrCity,
      });
    } else {
      if (value.carrierTownCity.length > validation.FreeTextChar.max) {
        errors.push({
          field: 'Carrier town or city',
          code: validation.errorCodes.carrierCharTooManyTownOrCity,
        });
      }
    }

    if (!value.carrierCountry?.trim()) {
      errors.push({
        field: 'Carrier country',
        code: validation.errorCodes.carrierEmptyCountry,
      });
    } else {
      value.carrierCountry = titleCase(value.carrierCountry);
      if (!fourNationsCountries.includes(value.carrierCountry)) {
        errors.push({
          field: 'Carrier country',
          code: validation.errorCodes.carrierInvalidCountry,
        });
      }
    }

    if (
      value.carrierPostcode?.trim() &&
      !validation.postcodeRegex.test(value.carrierPostcode)
    ) {
      errors.push({
        field: 'Carrier postcode',
        code: validation.errorCodes.carrierInvalidPostcode,
      });
    }

    if (!value.carrierContactName?.trim()) {
      errors.push({
        field: 'Carrier contact name',
        code: validation.errorCodes.carrierEmptyContactFullName,
      });
    } else if (value.carrierContactName.length > validation.FreeTextChar.max) {
      errors.push({
        field: 'Carrier contact name',
        code: validation.errorCodes.carrierCharTooManyContactFullName,
      });
    }

    const reformattedCarrierContactPhoneNumber = value.carrierContactPhone
      ?.replace(/'/g, '')
      ?.trim();
    if (!reformattedCarrierContactPhoneNumber) {
      errors.push({
        field: 'Carrier contact phone number',
        code: validation.errorCodes.carrierEmptyPhone,
      });
    } else if (
      !validation.phoneRegex.test(reformattedCarrierContactPhoneNumber)
    ) {
      errors.push({
        field: 'Carrier contact phone number',
        code: validation.errorCodes.carrierInvalidPhone,
      });
    }

    if (!value.carrierContactEmail?.trim()) {
      errors.push({
        field: 'Carrier contact email address',
        code: validation.errorCodes.carrierEmptyEmail,
      });
    } else if (!validation.emailRegex.test(value.carrierContactEmail)) {
      errors.push({
        field: 'Carrier contact email address',
        code: validation.errorCodes.carrierInvalidEmail,
      });
    } else if (value.carrierContactEmail.length > validation.FreeTextChar.max) {
      errors.push({
        field: 'Carrier contact email address',
        code: validation.errorCodes.carrierCharTooManyEmail,
      });
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
      address: {
        addressLine1: value.carrierAddressLine1 || '',
        addressLine2: value.carrierAddressLine2,
        townCity: value.carrierTownCity || '',
        country: value.carrierCountry || '',
        postcode: value.carrierPostcode,
      },
      contact: {
        email: value.carrierContactEmail || '',
        name: value.carrierContactName || '',
        phone: value.carrierContactPhone || '',
        organisationName: value.carrierOrganisationName || '',
      },
    },
  };
}

export function validateWasteCollectionDetailSection(
  value: WasteCollectionDetailFlattened,
  localAuthorities: LocalAuthority[]
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
        code: validation.errorCodes.wasteCollectionEmptyAddressLine1,
      });
    } else {
      if (
        value.wasteCollectionAddressLine1 &&
        value.wasteCollectionAddressLine1.length > validation.FreeTextChar.max
      ) {
        errors.push({
          field: 'Waste Collection Details Address Line 1',
          code: validation.errorCodes.wasteCollectionCharTooManyAddressLine1,
        });
      }
    }

    if (
      value.wasteCollectionAddressLine2 &&
      value.wasteCollectionAddressLine2.length > validation.FreeTextChar.max
    ) {
      errors.push({
        field: 'Waste Collection Details Address Line 2',
        code: validation.errorCodes.wasteCollectionCharTooManyAddressLine2,
      });
    }

    if (!value.wasteCollectionTownCity?.trim()) {
      errors.push({
        field: 'Waste Collection Details Town or City',
        code: validation.errorCodes.wasteCollectionEmptyTownOrCity,
      });
    } else {
      if (
        value.wasteCollectionTownCity &&
        value.wasteCollectionTownCity.length > validation.FreeTextChar.max
      ) {
        errors.push({
          field: 'Waste Collection Details Town or City',
          code: validation.errorCodes.wasteCollectionCharTooManyTownOrCity,
        });
      }
    }
    if (!value.wasteCollectionCountry?.trim()) {
      errors.push({
        field: 'Waste Collection Details Country',
        code: validation.errorCodes.wasteCollectionEmptyCountry,
      });
    } else {
      value.wasteCollectionCountry = titleCase(value.wasteCollectionCountry);
      if (!fourNationsCountries.includes(value.wasteCollectionCountry)) {
        errors.push({
          field: 'Waste Collection Details Country',
          code: validation.errorCodes.wasteCollectionInvalidCountry,
        });
      }
    }

    if (
      value.wasteCollectionPostcode &&
      !validation.postcodeRegex.test(value.wasteCollectionPostcode)
    ) {
      errors.push({
        field: 'Waste Collection Details Postcode',
        code: validation.errorCodes.wasteCollectionInvalidPostcode,
      });
    }
  }

  if (!value.wasteCollectionWasteSource?.trim()) {
    errors.push({
      field: 'Waste Collection Details Waste Source',
      code: validation.errorCodes.wasteCollectionMissingWasteSource,
    });
  } else {
    value.wasteCollectionWasteSource = titleCaseSpacesRemoved(
      value.wasteCollectionWasteSource
    );
    if (!wasteSources.includes(value.wasteCollectionWasteSource)) {
      errors.push({
        field: 'Waste Collection Details Waste Source',
        code: validation.errorCodes.wasteCollectionInvalidWasteSource,
      });
    }
  }

  if (!value.wasteCollectionLocalAuthority?.trim()) {
    errors.push({
      field: 'Local authority',
      code: validation.errorCodes.wasteCollectionEmptyLocalAuthority,
    });
  } else if (
    value.wasteCollectionLocalAuthority.trim().length >
    validation.FreeTextChar.max
  ) {
    errors.push({
      field: 'Local authority',
      code: validation.errorCodes.wasteCollectionCharTooManyLocalAuthority,
    });
  } else if (
    !localAuthorities.some(
      (la) =>
        la.name.en.toLowerCase() ===
        value.wasteCollectionLocalAuthority.trim().toLowerCase()
    )
  ) {
    errors.push({
      field: 'Local authority',
      code: validation.errorCodes.wasteCollectionInvalidLocalAuthority,
    });
  }

  if (
    value.wasteCollectionBrokerRegistrationNumber &&
    value.wasteCollectionBrokerRegistrationNumber.length >
      validation.WasteCollectionChar.max
  ) {
    errors.push({
      field: 'Waste Collection Details Broker Registration Number',
      code: validation.errorCodes
        .wasteCollectionCharTooManyBrokerRegistrationNumber,
    });
  }

  if (
    value.wasteCollectionCarrierRegistrationNumber &&
    value.wasteCollectionCarrierRegistrationNumber.length >
      validation.WasteCollectionChar.max
  ) {
    errors.push({
      field: 'Waste Collection Details Carrier Registration Number',
      code: validation.errorCodes
        .wasteCollectionCharTooManyCarrierRegistrationNumber,
    });
  }

  if (!value.wasteCollectionExpectedWasteCollectionDate) {
    errors.push({
      field: 'Waste Collection Details Expected Waste Collection Date',
      code: validation.errorCodes.wasteCollectionMissingWasteCollectionDate,
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
        code: validation.errorCodes
          .wasteCollectionInvalidFormatWasteCollectionDate,
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
      expectedWasteCollectionDate: {
        day: dateParts[0],
        month: dateParts[1],
        year: dateParts[2],
      },
      localAuthority: value.wasteCollectionLocalAuthority,
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
      code: validation.errorCodes.receiverEmptyAuthorizationType,
    });
  } else if (
    value.receiverAuthorizationType.length > validation.FreeTextChar.max
  ) {
    errors.push({
      field: 'Receiver authorization type',
      code: validation.errorCodes.receiverInvalidAuthorizationTypeLength,
    });
  }

  if (
    value.receiverEnvironmentalPermitNumber?.trim() &&
    value.receiverEnvironmentalPermitNumber.length >
      validation.ReceiverEnvironmentalPermitNumberChar.max
  ) {
    errors.push({
      field: 'Receiver environmental permit number',
      code: validation.errorCodes
        .receiverInvalidEnvironmentalPermitNumberLength,
    });
  }

  if (!value.receiverOrganisationName?.trim()) {
    errors.push({
      field: 'Receiver organisation name',
      code: validation.errorCodes.receiverEmptyOrganisationName,
    });
  } else if (
    value.receiverOrganisationName.length > validation.FreeTextChar.max
  ) {
    errors.push({
      field: 'Receiver organisation name',
      code: validation.errorCodes.receiverCharTooManyOrganisationName,
    });
  }

  if (!value.receiverAddressLine1?.trim()) {
    errors.push({
      field: 'Receiver address line 1',
      code: validation.errorCodes.receiverEmptyAddressLine1,
    });
  } else if (value.receiverAddressLine1.length > validation.FreeTextChar.max) {
    errors.push({
      field: 'Receiver address line 1',
      code: validation.errorCodes.receiverCharTooManyAddressLine1,
    });
  }

  if (
    value.receiverAddressLine2 &&
    value.receiverAddressLine2.length > validation.FreeTextChar.max
  ) {
    errors.push({
      field: 'Receiver address line 2',
      code: validation.errorCodes.receiverCharTooManyAddressLine2,
    });
  }

  if (!value.receiverTownCity?.trim()) {
    errors.push({
      field: 'Receiver town or city',
      code: validation.errorCodes.receiverEmptyTownOrCity,
    });
  } else {
    if (value.receiverTownCity.length > validation.FreeTextChar.max) {
      errors.push({
        field: 'Receiver town or city',
        code: validation.errorCodes.receiverCharTooManyTownOrCity,
      });
    }
  }

  if (!value.receiverCountry?.trim()) {
    errors.push({
      field: 'Receiver country',
      code: validation.errorCodes.receiverEmptyCountry,
    });
  } else {
    value.receiverCountry = titleCase(value.receiverCountry);
    if (!fourNationsCountries.includes(value.receiverCountry)) {
      errors.push({
        field: 'Receiver country',
        code: validation.errorCodes.receiverInvalidCountry,
      });
    }
  }

  if (
    value.receiverPostcode?.trim() &&
    !validation.postcodeRegex.test(value.receiverPostcode)
  ) {
    errors.push({
      field: 'Receiver postcode',
      code: validation.errorCodes.receiverInvalidPostcode,
    });
  }

  if (!value.receiverContactName?.trim()) {
    errors.push({
      field: 'Receiver contact name',
      code: validation.errorCodes.receiverEmptyContactFullName,
    });
  } else if (value.receiverContactName.length > validation.FreeTextChar.max) {
    errors.push({
      field: 'Receiver contact name',
      code: validation.errorCodes.receiverCharTooManyContactFullName,
    });
  }

  const reformattedReceiverContactPhoneNumber =
    value.receiverContactPhone.replace(/'/g, '');
  if (!reformattedReceiverContactPhoneNumber) {
    errors.push({
      field: 'Receiver contact phone number',
      code: validation.errorCodes.receiverEmptyPhone,
    });
  } else if (
    !validation.phoneRegex.test(reformattedReceiverContactPhoneNumber)
  ) {
    errors.push({
      field: 'Receiver contact phone number',
      code: validation.errorCodes.receiverInvalidPhone,
    });
  }

  if (!value.receiverContactEmail) {
    errors.push({
      field: 'Receiver contact email address',
      code: validation.errorCodes.receiverEmptyEmail,
    });
  } else if (!validation.emailRegex.test(value.receiverContactEmail)) {
    errors.push({
      field: 'Receiver contact email address',
      code: validation.errorCodes.receiverInvalidEmail,
    });
  } else if (value.receiverContactEmail.length > validation.FreeTextChar.max) {
    errors.push({
      field: 'Receiver contact email address',
      code: validation.errorCodes.receiverCharTooManyEmail,
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
      code: validation.errorCodes
        .wasteTransportationEmptyNameAndTypeOfContainers,
    });
  } else if (
    value.wasteTransportationNumberAndTypeOfContainers?.trim() &&
    value.wasteTransportationNumberAndTypeOfContainers.length >
      validation.FreeTextChar.max
  ) {
    errors.push({
      field: 'Number and type of transportation containers',
      code: validation.errorCodes
        .wasteTransportationCharTooManyNameAndTypeOfContainers,
    });
  }

  if (
    value.wasteTransportationSpecialHandlingRequirements?.trim() &&
    value.wasteTransportationSpecialHandlingRequirements.length >
      validation.FreeTextChar.max
  ) {
    errors.push({
      field: 'Special handling requirements details',
      code: validation.errorCodes
        .wasteTransportationCharTooManySpecialHandlingRequirements,
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

    const errorCodes = validation.errorCodes.WasteTypeValidationErrorCode(
      index + 1
    );
    const entryValidationResult = validateWasteTypeEntry(
      wasteType,
      errorCodes,
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
  errorCode: WasteTypeErrorCode,
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
      code: errorCode.emptyEwcCode,
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
      code: errorCode.invalidEwcCode,
    });
  }

  if (!wasteType.wasteTypeWasteDescription?.trim()) {
    errors.push({
      field: 'Waste Description',
      code: errorCode.emptyWasteDescription,
    });
  } else if (
    wasteType.wasteTypeWasteDescription?.trim() &&
    wasteType.wasteTypeWasteDescription.length >
      validation.WasteDescriptionChar.max
  ) {
    errors.push({
      field: 'Waste Description',
      code: errorCode.charTooManyWasteDescription,
    });
  }

  if (!wasteType.wasteTypePhysicalForm?.trim()) {
    errors.push({
      field: 'Physical Form',
      code: errorCode.emptyPhysicalForm,
    });
  } else {
    wasteType.wasteTypePhysicalForm = titleCase(
      wasteType.wasteTypePhysicalForm
    );
    if (!wastePhysicalForms.includes(wasteType.wasteTypePhysicalForm)) {
      errors.push({
        field: 'Physical Form',
        code: errorCode.invalidPhysicalForm,
      });
    }
  }

  let wasteQuantity = 0;

  if (!wasteType.wasteTypeWasteQuantity?.trim()) {
    errors.push({
      field: 'Waste Quantity',
      code: errorCode.emptyWasteQuantity,
    });
  } else {
    if (!validation.deicmalNumberRegex.test(wasteType.wasteTypeWasteQuantity)) {
      errors.push({
        field: 'Waste Quantity',
        code: errorCode.invalidWasteQuantity,
      });
    } else {
      wasteQuantity = Number(
        parseFloat(wasteType.wasteTypeWasteQuantity).toFixed(2)
      );

      if (!(wasteQuantity > validation.WasteQuantityValue.greaterThan)) {
        errors.push({
          field: 'Waste Quantity',
          code: errorCode.valueTooSmallWasteQuantity,
        });
      }
    }
  }

  if (!wasteType.wasteTypeWasteQuantityUnit?.trim()) {
    errors.push({
      field: 'Waste Quantity Units',
      code: errorCode.emptyWasteQuantityUnit,
    });
  } else {
    wasteType.wasteTypeWasteQuantityUnit =
      wasteQuantitiesMap[titleCase(wasteType.wasteTypeWasteQuantityUnit)];
    if (!wasteType.wasteTypeWasteQuantityUnit) {
      errors.push({
        field: 'Waste Quantity Units',
        code: errorCode.invalidWasteQuantityUnit,
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
      code: errorCode.invalidWasteQuantityType,
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
      code: errorCode.emptyChemicalAndBiologicalComponents,
    });
  } else if (
    chemicalAndBiologicalComponents.length &&
    wasteType.wasteTypeChemicalAndBiologicalComponentsString!.length >
      validation.FreeTextChar.max
  ) {
    errors.push({
      field: 'Chemical and biological components of the waste',
      code: errorCode.charTooManyChemicalAndBiologicalComponents,
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
      code: errorCode.emptyChemicalAndBiologicalConcentration,
    });
  } else if (chemicalAndBiologicalConcentrationStrings?.length) {
    if (
      chemicalAndBiologicalConcentrationStrings.length !==
      chemicalAndBiologicalComponents.length
    ) {
      errors.push({
        field: 'Chemical and biological concentration values',
        code: errorCode.wrongAmountChemicalAndBiologicalContentration,
      });
    } else {
      for (const concentration of chemicalAndBiologicalConcentrationStrings) {
        if (!validation.deicmalNumberRegex.test(concentration)) {
          errors.push({
            field: 'Chemical and biological concentration values',
            code: errorCode.invalidChemicalAndBiologicalConcentration,
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
      code: errorCode.emptyChemicalAndBiologicalConcentrationUnit,
    });
  } else if (chemicalAndBiologicalConcentrationUnits?.length) {
    if (
      chemicalAndBiologicalConcentrationUnits.length !==
      chemicalAndBiologicalComponents.length
    ) {
      errors.push({
        field: 'Chemical and biological concentration units of measure',
        code: errorCode.wrongAmountChemicalAndBiologicalContentrationUnit,
      });
    } else {
      for (const unit of chemicalAndBiologicalConcentrationUnits) {
        if (
          unit.length >
          validation.ChemicalAndBiologicalConcentrationUnitChar.max
        ) {
          errors.push({
            field: 'Chemical and biological concentration units of measure',
            code: errorCode.charTooManyChemicalAndBiologicalConcentrationUnit,
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
      code: errorCode.invalidHasHazardousProperties,
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
      code: errorCode.emptyHazardousWasteCodes,
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
        code: errorCode.invalidHazardousWasteCodes,
        args: invalidHazardousCodes,
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
      code: errorCode.invalidContainsPops,
    });
  }

  wasteType.wasteTypePopsString = wasteType.wasteTypePopsString?.trim();

  let pops: string[] = [];

  if (containsPops && !wasteType.wasteTypePopsString) {
    errors.push({
      field: 'Persistant organic pollutants (POPs)',
      code: errorCode.emptyPops,
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
        code: errorCode.invalidPops,
        args: invalidPops,
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

  if (!popConcentrationStrings?.length && containsPops) {
    errors.push({
      field: 'Persistant organic pollutants (POPs) Concentration Values',
      code: errorCode.emptyPopConcentration,
    });
  } else if (popConcentrationStrings?.length) {
    if (popConcentrationStrings.length !== pops.length) {
      errors.push({
        field: 'Persistant organic pollutants (POPs) Concentration Values',
        code: errorCode.wrongAmountPopContentration,
      });
    } else {
      for (const concentration of popConcentrationStrings) {
        if (!validation.deicmalNumberRegex.test(concentration)) {
          errors.push({
            field: 'Persistant organic pollutants (POPs) Concentration Values',
            code: errorCode.invalidPopConcentration,
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

  if (!popConcentrationUnits?.length && containsPops) {
    errors.push({
      field: 'Persistant organic pollutants (POPs) Concentration Units',
      code: errorCode.emptyPopConcentrationUnit,
    });
  } else if (popConcentrationUnits?.length) {
    if (popConcentrationUnits.length !== pops.length) {
      errors.push({
        field: 'Persistant organic pollutants (POPs) Concentration Units',
        code: errorCode.wrongAmountPopContentrationUnit,
      });
    } else {
      for (const unit of popConcentrationUnits) {
        if (unit.length > validation.PopConcentrationUnitChar.max) {
          errors.push({
            field: 'Persistant organic pollutants (POPs) Concentration Units',
            code: errorCode.charTooManyPopConcentrationUnit,
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
