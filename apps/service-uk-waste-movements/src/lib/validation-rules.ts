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

const wasteSource = [
  'Household',
  'LocalAuthority',
  'Construction',
  'Demolition',
  'Commercial',
  'Industrial',
];

const modeOfWasteTransport = ['Road', 'Rail', 'Sea', 'Air', 'InlandWaterways'];

export function validateProducerDetailSection(
  value: ProducerDetailFlattened
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: ProducerDetail } {
  const errors: FieldFormatError[] = [];

  const trimmedReference = value.reference?.trim();
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

  const reformattedReceiverContactPhoneNumber = value.producerPhone
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

  if (!value.producerEmail?.trim()) {
    errors.push({
      field: 'Producer contact email address',
      message: validation.ProducerValidationErrorMessages.emptyEmail,
    });
  } else if (!validation.emailRegex.test(value.producerEmail)) {
    errors.push({
      field: 'Producer contact email address',
      message: validation.ProducerValidationErrorMessages.invalidEmail,
    });
  } else if (value.producerEmail.length > validation.FreeTextChar.max) {
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
        email: value.producerEmail,
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
        message:
          validation.WasteCollectionDetailsErrorMessages.emptyAddressLine1,
      });
    } else {
      if (
        value.wasteCollectionAddressLine1 &&
        value.wasteCollectionAddressLine1.length > validation.FreeTextChar.max
      ) {
        errors.push({
          field: 'Waste Collection Details Address Line 1',
          message:
            validation.WasteCollectionDetailsErrorMessages
              .charTooManyAddressLine1,
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
          validation.WasteCollectionDetailsErrorMessages
            .charTooManyAddressLine2,
      });
    }

    if (!value.wasteCollectionTownCity?.trim()) {
      errors.push({
        field: 'Waste Collection Details Town or City',
        message: validation.WasteCollectionDetailsErrorMessages.emptyTownOrCity,
      });
    } else {
      if (
        value.wasteCollectionTownCity &&
        value.wasteCollectionTownCity.length > validation.FreeTextChar.max
      ) {
        errors.push({
          field: 'Waste Collection Details Town or City',
          message:
            validation.WasteCollectionDetailsErrorMessages
              .charTooManyTownOrCity,
        });
      }
    }
    if (!value.wasteCollectionCountry?.trim()) {
      errors.push({
        field: 'Waste Collection Details Country',
        message: validation.WasteCollectionDetailsErrorMessages.emptyCountry,
      });
    } else {
      value.wasteCollectionCountry = titleCase(value.wasteCollectionCountry);
      if (!fourNationsCountries.includes(value.wasteCollectionCountry)) {
        errors.push({
          field: 'Waste Collection Details Country',
          message:
            validation.WasteCollectionDetailsErrorMessages.invalidCountry,
        });
      }
    }

    if (
      value.wasteCollectionPostcode &&
      !validation.postcodeRegex.test(value.wasteCollectionPostcode)
    ) {
      errors.push({
        field: 'Waste Collection Details Postcode',
        message: validation.WasteCollectionDetailsErrorMessages.invalidPostcode,
      });
    }
  }

  if (!value.wasteSource?.trim()) {
    errors.push({
      field: 'Waste Collection Details Waste Source',
      message:
        validation.WasteCollectionDetailsErrorMessages.missingWasteSource,
    });
  } else {
    value.wasteSource = titleCaseSpacesRemoved(value.wasteSource);
    if (!wasteSource.includes(value.wasteSource)) {
      errors.push({
        field: 'Waste Collection Details Waste Source',
        message:
          validation.WasteCollectionDetailsErrorMessages.invalidWasteSource,
      });
    }
  }

  if (
    value.brokerRegNumber &&
    value.brokerRegNumber.length > validation.WasteCollectionChar.max
  ) {
    errors.push({
      field: 'Waste Collection Details Broker Registration Number',
      message:
        validation.WasteCollectionDetailsErrorMessages
          .charTooManyBrokerRegistrationNumber,
    });
  }

  if (
    value.carrierRegNumber &&
    value.carrierRegNumber.length > validation.WasteCollectionChar.max
  ) {
    errors.push({
      field: 'Waste Collection Details Carrier Registration Number',
      message:
        validation.WasteCollectionDetailsErrorMessages
          .charTooManyCarrierRegistrationNumber,
    });
  }

  if (!value.modeOfWasteTransport?.trim()) {
    errors.push({
      field: 'Waste Collection Details Mode of Waste Transport',
      message:
        validation.WasteCollectionDetailsErrorMessages.emptyModeOfTransport,
    });
  } else {
    value.modeOfWasteTransport = titleCaseSpacesRemoved(
      value.modeOfWasteTransport
    );
    if (!modeOfWasteTransport.includes(value.modeOfWasteTransport)) {
      errors.push({
        field: 'Waste Collection Details Mode of Waste Transport',
        message:
          validation.WasteCollectionDetailsErrorMessages
            .invalidModeOfWasteTransport,
      });
    }
  }

  if (!value.expectedWasteCollectionDate) {
    errors.push({
      field: 'Waste Collection Details Expected Waste Collection Date',
      message:
        validation.WasteCollectionDetailsErrorMessages
          .missingWasteCollectionDate,
    });
  } else {
    const parsedDate = parse(
      value.expectedWasteCollectionDate,
      'P',
      new Date(),
      { locale: enGB }
    );
    const isValidDate = isValid(parsedDate);
    if (value.expectedWasteCollectionDate && !isValidDate) {
      errors.push({
        field: 'Waste Collection Details Expected Waste Collection Date',
        message:
          validation.WasteCollectionDetailsErrorMessages
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

  const dateParts = value.expectedWasteCollectionDate.split('/');
  return {
    valid: true,
    value: {
      wasteSource: value.wasteSource,
      brokerRegistrationNumber: !value.brokerRegNumber
        ? undefined
        : value.brokerRegNumber,
      carrierRegistrationNumber: value.carrierRegNumber,
      modeOfWasteTransport: value.modeOfWasteTransport,
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
      validation.WasteTransportationDetailsChar.max
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
      validation.WasteTransportationDetailsChar.max
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
