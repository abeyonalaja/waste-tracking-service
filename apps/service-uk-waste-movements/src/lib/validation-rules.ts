import {
  validation,
  FieldFormatError,
  ReceiverDetailsFlattened,
  ReceiverDetails,
  ProducerDetailsFlattened,
  ProducerDetails,
} from '../model';

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

const fourNationsCountries = [
  'England',
  'Scotland',
  'Wales',
  'Northern Ireland',
];

export function validateProducerDetailsSection(
  value: ProducerDetailsFlattened
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: ProducerDetails } {
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

export function validateReceiverDetailsSection(
  value: ReceiverDetailsFlattened
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: ReceiverDetails } {
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
