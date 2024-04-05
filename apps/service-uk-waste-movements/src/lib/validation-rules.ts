import {
  validation,
  FieldFormatError,
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

  if (!value.producerPostcode?.trim()) {
    errors.push({
      field: 'Producer postcode',
      message: validation.ProducerValidationErrorMessages.emptyPostcode,
    });
  } else if (!validation.postcodeRegex.test(value.producerPostcode)) {
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
