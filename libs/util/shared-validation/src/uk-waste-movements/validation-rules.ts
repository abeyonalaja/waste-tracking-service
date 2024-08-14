import * as regex from './regex';
import * as constraints from './constraints';
import * as errorCodes from './error-codes';
import { getErrorMessage, getSharedErrorCode } from './util';
import type {
  ErrorMessage,
  ValidationResult,
  FieldFormatError,
  Section,
  Field,
} from './dto';
import { Contact, ProducerDetail, Address, SICCode } from './model';

export * from './validation-rules';

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

const wasteSources = [
  'Commercial',
  'Industrial',
  'ConstructionAndDemolition',
  'Household',
];

const fourNationsCountries = [
  'England',
  'Scotland',
  'Wales',
  'Northern Ireland',
];

export function validateProducerOrganisationName(
  organsationName?: string,
  message?: ErrorMessage,
): ValidationResult<string> {
  const errors: FieldFormatError[] = [];

  const trimmedOrganisationName = organsationName?.trim();

  if (!trimmedOrganisationName) {
    return {
      valid: false,
      errors: [
        {
          field: 'Producer organisation name',
          code: errorCodes.producerEmptyOrganisationName,
          message: message
            ? getErrorMessage(
                errorCodes.producerEmptyOrganisationName,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  if (trimmedOrganisationName.length > constraints.FreeTextChar.max) {
    errors.push({
      field: 'Producer organisation name',
      code: errorCodes.producerCharTooManyOrganisationName,
      message: message
        ? getErrorMessage(
            errorCodes.producerCharTooManyOrganisationName,
            message.locale,
            message.context,
          )
        : undefined,
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: trimmedOrganisationName,
  };
}

export function validateProducerReference(
  reference?: string,
  message?: ErrorMessage,
): ValidationResult<string> {
  const errors: FieldFormatError[] = [];

  const trimmedReference = reference?.trim();

  if (!trimmedReference) {
    return {
      valid: false,
      errors: [
        {
          field: 'Reference',
          code: errorCodes.producerEmptyReference,
          message: message
            ? getErrorMessage(
                errorCodes.producerEmptyReference,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  if (trimmedReference.length > constraints.ReferenceChar.max) {
    errors.push({
      field: 'Reference',
      code: errorCodes.producerCharTooManyReference,
      message: message
        ? getErrorMessage(
            errorCodes.producerCharTooManyReference,
            message.locale,
            message.context,
          )
        : undefined,
    });
  }

  if (!regex.referenceRegex.test(trimmedReference)) {
    errors.push({
      field: 'Reference',
      code: errorCodes.producerInvalidReference,
      message: message
        ? getErrorMessage(
            errorCodes.producerInvalidReference,
            message.locale,
            message.context,
          )
        : undefined,
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: trimmedReference,
  };
}

export function validateAddressSelection(
  value: string | undefined,
  message?: ErrorMessage,
): ValidationResult<string> {
  if (!value) {
    return {
      valid: false,
      errors: [
        {
          field: 'AddressSelection',
          code: errorCodes.addressSelectionEmpty,
          message: message
            ? getErrorMessage(
                errorCodes.addressSelectionEmpty,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }
  return {
    valid: true,
    value: value,
  };
}

export function validateBuildingNameOrNumber(
  buildingNameOrNumber: string,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const errors: FieldFormatError[] = [];

  const trimmedBuildingNameOrNumber = buildingNameOrNumber?.trim();

  if (
    trimmedBuildingNameOrNumber &&
    trimmedBuildingNameOrNumber.length > constraints.FreeTextChar.max
  ) {
    errors.push({
      field: (section + ' building name or number') as Field,
      code: getSharedErrorCode(
        errorCodes.charTooManyBuildingNameOrNumberBase,
        section,
      ),
      message: message
        ? getErrorMessage(
            errorCodes.charTooManyBuildingNameOrNumberBase,
            message.locale,
            message.context,
          )
        : undefined,
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: trimmedBuildingNameOrNumber,
  };
}

export function validateAddressLine1(
  addressLine1: string,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const errors: FieldFormatError[] = [];

  const trimmedAddressLine1 = addressLine1?.trim();

  if (!trimmedAddressLine1) {
    return {
      valid: false,
      errors: [
        {
          field: (section + ' address line 1') as Field,
          code: getSharedErrorCode(errorCodes.emptyAddressLine1Base, section),
          message: message
            ? getErrorMessage(
                errorCodes.emptyAddressLine1Base,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  if (trimmedAddressLine1.length > constraints.FreeTextChar.max) {
    errors.push({
      field: (section + ' address line 1') as Field,
      code: getSharedErrorCode(errorCodes.charTooManyAddressLine1Base, section),
      message: message
        ? getErrorMessage(
            errorCodes.charTooManyAddressLine1Base,
            message.locale,
            message.context,
          )
        : undefined,
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: trimmedAddressLine1,
  };
}

export function validateAddressLine2(
  addressLine2: string,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const errors: FieldFormatError[] = [];

  const trimmedAddressLine2 = addressLine2?.trim();

  if (
    trimmedAddressLine2 &&
    trimmedAddressLine2.length > constraints.FreeTextChar.max
  ) {
    errors.push({
      field: (section + ' address line 2') as Field,
      code: getSharedErrorCode(errorCodes.charTooManyAddressLine2Base, section),
      message: message
        ? getErrorMessage(
            errorCodes.charTooManyAddressLine2Base,
            message.locale,
            message.context,
          )
        : undefined,
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: trimmedAddressLine2,
  };
}

export function validatePostcode(
  postcode: string,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const errors: FieldFormatError[] = [];

  const trimmedPostcode = postcode?.trim();

  if (trimmedPostcode.length > constraints.PostcodeChar.max) {
    errors.push({
      field: (section + ' postcode') as Field,
      code: getSharedErrorCode(errorCodes.invalidPostcodeBase, section),
      message: message
        ? getErrorMessage(
            errorCodes.invalidPostcodeBase,
            message.locale,
            message.context,
          )
        : undefined,
    });
  }

  if (!regex.postcodeRegex.test(trimmedPostcode)) {
    errors.push({
      field: (section + ' postcode') as Field,
      code: getSharedErrorCode(errorCodes.invalidPostcodeBase, section),
      message: message
        ? getErrorMessage(
            errorCodes.invalidPostcodeBase,
            message.locale,
            message.context,
          )
        : undefined,
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: trimmedPostcode,
  };
}

export function validateTownCity(
  townCity: string,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const errors: FieldFormatError[] = [];

  const trimmedTownCity = townCity?.trim();

  if (!trimmedTownCity) {
    return {
      valid: false,
      errors: [
        {
          field: (section + ' town or city') as Field,
          code: getSharedErrorCode(errorCodes.emptyTownOrCityBase, section),
          message: message
            ? getErrorMessage(
                errorCodes.emptyTownOrCityBase,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  if (trimmedTownCity.length > constraints.FreeTextChar.max) {
    errors.push({
      field: (section + ' town or city') as Field,
      code: getSharedErrorCode(errorCodes.charTooManyTownOrCityBase, section),
      message: message
        ? getErrorMessage(
            errorCodes.charTooManyTownOrCityBase,
            message.locale,
            message.context,
          )
        : undefined,
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: trimmedTownCity,
  };
}

export function validateCountry(
  country: string,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const errors: FieldFormatError[] = [];

  const trimmedCountry = country?.trim();

  if (!trimmedCountry) {
    return {
      valid: false,
      errors: [
        {
          field: (section + ' country') as Field,
          code: getSharedErrorCode(errorCodes.emptyCountryBase, section),
          message: message
            ? getErrorMessage(
                errorCodes.emptyCountryBase,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  if (!fourNationsCountries.includes(trimmedCountry)) {
    errors.push({
      field: (section + ' country') as Field,
      code: getSharedErrorCode(errorCodes.invalidCountryBase, section),
      message: message
        ? getErrorMessage(
            errorCodes.invalidCountryBase,
            message.locale,
            message.context,
          )
        : undefined,
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: trimmedCountry,
  };
}

export function validateAddressDetails(
  value: Address,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<Address> {
  const errors: FieldFormatError[] = [];
  const addressToReturn: Address = {
    addressLine1: '',
    townCity: '',
    postcode: '',
    country: '',
  };

  if (value.buildingNameOrNumber?.trim()) {
    const buildingNameOrNumber: ValidationResult<
      Address['buildingNameOrNumber']
    > = validateBuildingNameOrNumber(
      value.buildingNameOrNumber.trim() as string,
      section as Section,
      message,
    );

    if (buildingNameOrNumber.valid) {
      addressToReturn.buildingNameOrNumber = buildingNameOrNumber.value;
    } else {
      buildingNameOrNumber.errors?.forEach((error) => errors.push(error));
    }
  }

  const addressLine1 = validateAddressLine1(
    value.addressLine1,
    section,
    message,
  );
  if (addressLine1.valid) {
    addressToReturn.addressLine1 = addressLine1.value;
  } else {
    addressLine1.errors?.forEach((error) => errors.push(error));
  }

  if (value.addressLine2?.trim()) {
    const addressLine2: ValidationResult<Address['addressLine2']> =
      validateAddressLine2(
        value.addressLine2.trim() as string,
        section,
        message,
      );

    if (addressLine2.valid) {
      addressToReturn.addressLine2 = addressLine2.value;
    } else {
      addressLine2.errors?.forEach((error) => errors.push(error));
    }
  }

  const townCity = validateTownCity(value.townCity, section, message);
  if (townCity.valid) {
    addressToReturn.townCity = townCity.value;
  } else {
    townCity.errors?.forEach((error) => errors.push(error));
  }

  if (value.postcode?.trim()) {
    const postcode: ValidationResult<Address['postcode']> = validatePostcode(
      value.postcode.trim() as string,
      section,
      message,
    );

    if (postcode.valid) {
      addressToReturn.postcode = postcode.value;
    } else {
      postcode.errors?.forEach((error) => errors.push(error));
    }
  }

  const country = validateCountry(value.country, section, message);
  if (country.valid) {
    addressToReturn.country = country.value;
  } else {
    country.errors?.forEach((error) => errors.push(error));
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: addressToReturn,
  };
}

export function validatePartialAddressDetails(
  value: Partial<ProducerDetail['address']>,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<Partial<ProducerDetail['address']>> {
  const errors: FieldFormatError[] = [];
  const fieldsToReturn: Partial<ProducerDetail['address']> = {};

  if (value.buildingNameOrNumber?.trim()) {
    const producerBuildingNameOrNumber: ValidationResult<
      ProducerDetail['address']['buildingNameOrNumber']
    > = validateBuildingNameOrNumber(
      value.buildingNameOrNumber,
      section,
      message,
    );

    if (producerBuildingNameOrNumber.valid) {
      fieldsToReturn.buildingNameOrNumber = producerBuildingNameOrNumber.value;
    } else {
      producerBuildingNameOrNumber.errors?.forEach((error) =>
        errors.push(error),
      );
    }
  }

  if (value.addressLine1?.trim()) {
    const producerAddressLine1: ValidationResult<
      ProducerDetail['address']['addressLine1']
    > = validateAddressLine1(value.addressLine1, section, message);
    if (producerAddressLine1.valid) {
      fieldsToReturn.addressLine1 = producerAddressLine1.value;
    } else {
      producerAddressLine1.errors?.forEach((error) => errors.push(error));
    }
  }

  if (value.addressLine2?.trim()) {
    const producerAddressLine2: ValidationResult<
      ProducerDetail['address']['addressLine2']
    > = validateAddressLine2(value.addressLine2, section, message);
    if (producerAddressLine2.valid) {
      fieldsToReturn.addressLine2 = producerAddressLine2.value;
    } else {
      producerAddressLine2.errors?.forEach((error) => errors.push(error));
    }
  }

  if (value.townCity?.trim()) {
    const producerTownCity: ValidationResult<
      ProducerDetail['address']['townCity']
    > = validateTownCity(value.townCity, section, message);
    if (producerTownCity.valid) {
      fieldsToReturn.townCity = producerTownCity.value;
    } else {
      producerTownCity.errors?.forEach((error) => errors.push(error));
    }
  }

  if (value.country?.trim()) {
    const producerCountry: ValidationResult<
      ProducerDetail['address']['country']
    > = validateCountry(value.country, section, message);
    if (producerCountry.valid) {
      fieldsToReturn.country = producerCountry.value;
    } else {
      producerCountry.errors?.forEach((error) => errors.push(error));
    }
  }

  if (value.postcode?.trim()) {
    const producerPostcode: ValidationResult<
      ProducerDetail['address']['postcode']
    > = validatePostcode(value.postcode, section, message);
    if (producerPostcode.valid) {
      fieldsToReturn.postcode = producerPostcode.value;
    } else {
      producerPostcode.errors?.forEach((error) => errors.push(error));
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: fieldsToReturn,
  };
}

export function validateProducerDetailSection(
  value: ProducerDetail,
  message?: ErrorMessage,
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: ProducerDetail } {
  const errors: FieldFormatError[] = [];
  const detailsToReturn: ProducerDetail = {
    reference: '',
    sicCode: '',
    contact: {
      organisationName: '',
      name: '',
      email: '',
      phone: '',
    },
    address: {
      addressLine1: '',
      townCity: '',
      postcode: '',
      country: '',
    },
  };

  const producerOrganisationName = validateProducerOrganisationName(
    value.contact.organisationName,
    message,
  );

  if (producerOrganisationName.valid) {
    detailsToReturn.contact.organisationName = producerOrganisationName.value;
  } else {
    producerOrganisationName.errors?.forEach((error) => errors.push(error));
  }

  const producerReference = validateProducerReference(value.reference, message);

  if (producerReference.valid) {
    detailsToReturn.reference = producerReference.value;
  } else {
    producerReference.errors?.forEach((error) => errors.push(error));
  }

  if (value.address.buildingNameOrNumber?.trim()) {
    const producerBuildingNameOrNumber: ValidationResult<
      ProducerDetail['address']['buildingNameOrNumber']
    > = validateBuildingNameOrNumber(
      value.address.buildingNameOrNumber as string,
      'Producer',
      message,
    );

    if (producerBuildingNameOrNumber.valid) {
      detailsToReturn.address.buildingNameOrNumber =
        producerBuildingNameOrNumber.value;
    } else {
      producerBuildingNameOrNumber.errors?.forEach((error) =>
        errors.push(error),
      );
    }
  }

  const producerAddressLine1 = validateAddressLine1(
    value.address.addressLine1,
    'Producer',
    message,
  );
  if (producerAddressLine1.valid) {
    detailsToReturn.address.addressLine1 = producerAddressLine1.value;
  } else {
    producerAddressLine1.errors?.forEach((error) => errors.push(error));
  }

  if (value.address.addressLine2?.trim()) {
    const producerAddressLine2: ValidationResult<
      ProducerDetail['address']['addressLine2']
    > = validateAddressLine2(
      value.address.addressLine2 as string,
      'Producer',
      message,
    );

    if (producerAddressLine2.valid) {
      detailsToReturn.address.addressLine2 = producerAddressLine2.value;
    } else {
      producerAddressLine2.errors?.forEach((error) => errors.push(error));
    }
  }

  const producerTownCity = validateTownCity(
    value.address.townCity,
    'Producer',
    message,
  );
  if (producerTownCity.valid) {
    detailsToReturn.address.townCity = producerTownCity.value;
  } else {
    producerTownCity.errors?.forEach((error) => errors.push(error));
  }

  if (value.address.townCity?.trim()) {
    const producerPostcode: ValidationResult<
      ProducerDetail['address']['postcode']
    > = validatePostcode(value.address.postcode as string, 'Producer', message);

    if (producerPostcode.valid) {
      detailsToReturn.address.postcode = producerPostcode.value;
    } else {
      producerPostcode.errors?.forEach((error) => errors.push(error));
    }
  }

  const producerCountry = validateCountry(
    value.address.country,
    'Producer',
    message,
  );
  if (producerCountry.valid) {
    detailsToReturn.address.country = producerCountry.value;
  } else {
    producerCountry.errors?.forEach((error) => errors.push(error));
  }

  const producerContactName = validateProducerContactPerson(
    value.contact.name,
    message,
  );
  if (producerContactName.valid) {
    detailsToReturn.contact.name = producerContactName.value;
  } else {
    producerContactName.errors?.forEach((error) => errors.push(error));
  }

  const producerContactEmail = validateProducerContactEmail(
    value.contact.email,
    message,
  );
  if (producerContactEmail.valid) {
    detailsToReturn.contact.email = producerContactEmail.value;
  } else {
    producerContactEmail.errors?.forEach((error) => errors.push(error));
  }

  const producerContactPhone = validateProducerContactPhone(
    value.contact.phone,
    message,
  );

  if (producerContactPhone.valid) {
    detailsToReturn.contact.phone = producerContactPhone.value;
  } else {
    producerContactPhone.errors?.forEach((error) => errors.push(error));
  }

  if (value.contact.fax?.trim()) {
    const producerContactFax: ValidationResult<
      ProducerDetail['contact']['fax']
    > = validateProducerContactFax(value.contact.fax as string, message);

    if (producerContactFax.valid) {
      detailsToReturn.contact.fax = producerContactFax.value;
    } else {
      producerContactFax.errors?.forEach((error) => errors.push(error));
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
    value: detailsToReturn,
  };
}

export function validateProducerContactOrganisationName(
  contactOrganisationName?: string,
  message?: ErrorMessage,
): ValidationResult<string> {
  const errors: FieldFormatError[] = [];

  const trimmedContactOrganisationName = contactOrganisationName?.trim();
  if (!trimmedContactOrganisationName) {
    return {
      valid: false,
      errors: [
        {
          field: 'Producer organisation name',
          code: errorCodes.producerEmptyOrganisationName,
          message: message
            ? getErrorMessage(
                errorCodes.producerEmptyOrganisationName,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  if (trimmedContactOrganisationName.length > constraints.FreeTextChar.max) {
    errors.push({
      field: 'Producer organisation name',
      code: errorCodes.producerCharTooManyOrganisationName,
      message: message
        ? getErrorMessage(
            errorCodes.producerCharTooManyOrganisationName,
            message.locale,
            message.context,
          )
        : undefined,
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: trimmedContactOrganisationName,
  };
}

export function validateProducerContactPerson(
  contactPerson?: string,
  message?: ErrorMessage,
): ValidationResult<string> {
  const errors: FieldFormatError[] = [];

  const trimmedContactPerson = contactPerson?.trim();
  if (!trimmedContactPerson) {
    return {
      valid: false,
      errors: [
        {
          field: 'Producer contact name',
          code: errorCodes.producerEmptyContactFullName,
          message: message
            ? getErrorMessage(
                errorCodes.producerEmptyContactFullName,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  if (trimmedContactPerson.length > constraints.FreeTextChar.max) {
    errors.push({
      field: 'Producer contact name',
      code: errorCodes.producerCharTooManyContactFullName,
      message: message
        ? getErrorMessage(
            errorCodes.producerCharTooManyContactFullName,
            message.locale,
            message.context,
          )
        : undefined,
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: trimmedContactPerson,
  };
}

export function validateProducerContactEmail(
  contactEmail?: string,
  message?: ErrorMessage,
): ValidationResult<string> {
  const errors: FieldFormatError[] = [];

  const trimmedContactEmail = contactEmail?.trim();

  if (!trimmedContactEmail) {
    return {
      valid: false,
      errors: [
        {
          field: 'Producer contact email address',
          code: errorCodes.producerEmptyEmail,
          message: message
            ? getErrorMessage(
                errorCodes.producerEmptyEmail,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  if (trimmedContactEmail.length > constraints.FreeTextChar.max) {
    errors.push({
      field: 'Producer contact email address',
      code: errorCodes.producerCharTooManyEmail,
      message: message
        ? getErrorMessage(
            errorCodes.producerCharTooManyEmail,
            message.locale,
            message.context,
          )
        : undefined,
    });
  }

  if (!regex.emailRegex.test(trimmedContactEmail)) {
    errors.push({
      field: 'Producer contact email address',
      code: errorCodes.producerInvalidEmail,
      message: message
        ? getErrorMessage(
            errorCodes.producerInvalidEmail,
            message.locale,
            message.context,
          )
        : undefined,
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: trimmedContactEmail,
  };
}

export function validateProducerContactPhone(
  phoneNumber?: string,
  message?: ErrorMessage,
): ValidationResult<string> {
  const errors: FieldFormatError[] = [];
  const trimmedPhoneNumber = phoneNumber?.trim();

  if (!trimmedPhoneNumber) {
    return {
      valid: false,
      errors: [
        {
          field: 'Producer contact phone number',
          code: errorCodes.producerEmptyPhone,
          message: message
            ? getErrorMessage(
                errorCodes.producerEmptyPhone,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  if (!regex.phoneRegex.test(trimmedPhoneNumber)) {
    errors.push({
      field: 'Producer contact phone number',
      code: errorCodes.producerInvalidPhone,
      message: message
        ? getErrorMessage(
            errorCodes.producerInvalidPhone,
            message.locale,
            message.context,
          )
        : undefined,
    });
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: trimmedPhoneNumber,
  };
}

export function validateProducerContactFax(
  faxNumber?: string,
  message?: ErrorMessage,
): ValidationResult<string> {
  const trimmedFaxNumber = faxNumber?.trim();

  if (trimmedFaxNumber && !regex.faxRegex.test(trimmedFaxNumber)) {
    return {
      valid: false,
      errors: [
        {
          field: 'Producer fax number',
          code: errorCodes.producerInvalidFax,
          message: message
            ? getErrorMessage(
                errorCodes.producerInvalidFax,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  return {
    valid: true,
    value: trimmedFaxNumber || '',
  };
}

export function validateProducerContactDetailSection(
  value: Contact,
  message?: ErrorMessage,
): ValidationResult<Contact> {
  const errors: FieldFormatError[] = [];

  const producerContactOrganisationName =
    validateProducerContactOrganisationName(value.organisationName, message);

  const producerContactPerson = validateProducerContactPerson(
    value.name,
    message,
  );

  const producerContactEmail = validateProducerContactEmail(
    value.email,
    message,
  );

  const producerContactPhone = validateProducerContactPhone(
    value.phone,
    message,
  );

  const producerContactFax = validateProducerContactFax(value.fax, message);

  if (
    producerContactOrganisationName.valid &&
    producerContactPerson.valid &&
    producerContactEmail.valid &&
    producerContactPhone.valid &&
    producerContactFax.valid
  ) {
    return {
      valid: true,
      value: {
        organisationName: producerContactOrganisationName.value,
        name: producerContactPerson.value,
        email: producerContactEmail.value,
        phone: producerContactPhone.value,
        fax: producerContactFax.value,
      },
    };
  }

  if (!producerContactOrganisationName.valid) {
    errors.push(...(producerContactOrganisationName.errors || []));
  }

  if (!producerContactPerson.valid) {
    errors.push(...(producerContactPerson.errors || []));
  }

  if (!producerContactEmail.valid) {
    errors.push(...(producerContactEmail.errors || []));
  }

  if (!producerContactPhone.valid) {
    errors.push(...(producerContactPhone.errors || []));
  }

  if (!producerContactFax.valid) {
    errors.push(...(producerContactFax.errors || []));
  }

  return {
    valid: false,
    errors: errors,
  };
}

export function validatePartialProducerContactDetailSection(
  value: Partial<Contact>,
  message?: ErrorMessage,
): ValidationResult<Partial<Contact>> {
  const errors: FieldFormatError[] = [];

  const validatedFields: Partial<Contact> = {};

  if (value.organisationName) {
    const producerContactOrganisationName =
      validateProducerContactOrganisationName(value.organisationName, message);
    if (producerContactOrganisationName.valid) {
      validatedFields.organisationName = producerContactOrganisationName.value;
    } else {
      errors.push(...(producerContactOrganisationName.errors || []));
    }
  }

  if (value.name) {
    const producerContactPerson = validateProducerContactPerson(
      value.name,
      message,
    );
    if (producerContactPerson.valid) {
      validatedFields.name = producerContactPerson.value;
    } else {
      errors.push(...(producerContactPerson.errors || []));
    }
  }

  if (value.email) {
    const producerContactEmail = validateProducerContactEmail(
      value.email,
      message,
    );
    if (producerContactEmail.valid) {
      validatedFields.email = producerContactEmail.value;
    } else {
      errors.push(...(producerContactEmail.errors || []));
    }
  }

  if (value.phone) {
    const producerContactPhone = validateProducerContactPhone(
      value.phone,
      message,
    );
    if (producerContactPhone.valid) {
      validatedFields.phone = producerContactPhone.value;
    } else {
      errors.push(...(producerContactPhone.errors || []));
    }
  }

  if (value.fax) {
    const producerContactFax = validateProducerContactFax(value.fax, message);
    if (producerContactFax.valid) {
      validatedFields.fax = producerContactFax.value;
    } else {
      errors.push(...(producerContactFax.errors || []));
    }
  }

  if (errors.length === 0) {
    return {
      valid: true,
      value: validatedFields,
    };
  }

  return {
    valid: false,
    errors: errors,
  };
}

export function validateWasteSourceSection(
  value: string,
  message?: ErrorMessage,
): ValidationResult<string> {
  const trimmedWasteSource = value.trim();
  if (!trimmedWasteSource) {
    return {
      valid: false,
      errors: [
        {
          field: 'Waste Collection Details Waste Source',
          code: errorCodes.wasteCollectionMissingWasteSource,
          message: message
            ? getErrorMessage(
                errorCodes.wasteCollectionMissingWasteSource,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  value = titleCaseSpacesRemoved(value);

  if (!wasteSources.includes(value)) {
    return {
      valid: false,
      errors: [
        {
          field: 'Waste Collection Details Waste Source',
          code: errorCodes.wasteCollectionInvalidWasteSource,
          message: message
            ? getErrorMessage(
                errorCodes.wasteCollectionInvalidWasteSource,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  return {
    valid: true,
    value: trimmedWasteSource,
  };
}

export function validateSicCodesSection(
  value: string,
  draftSicCodesList: string[],
  sicCodesList: SICCode[],
  message?: ErrorMessage,
): ValidationResult<string> {
  const trimmedSicCode = value.trim();

  if (!trimmedSicCode) {
    return {
      valid: false,
      errors: [
        {
          field: 'Producer Standard Industrial Classification (SIC) code',
          code: errorCodes.producerEmptySicCode,
          message: message
            ? getErrorMessage(
                errorCodes.producerEmptySicCode,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  if (draftSicCodesList.length >= constraints.SICCodesLength.max) {
    return {
      valid: false,
      errors: [
        {
          field: 'Producer Standard Industrial Classification (SIC) code',
          code: errorCodes.producerTooManySicCodes,
          message: message
            ? getErrorMessage(
                errorCodes.producerTooManySicCodes,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  if (!sicCodesList.some((sicCode) => sicCode.code === trimmedSicCode)) {
    return {
      valid: false,
      errors: [
        {
          field: 'Producer Standard Industrial Classification (SIC) code',
          code: errorCodes.producerInvalidSicCode,
          message: message
            ? getErrorMessage(
                errorCodes.producerInvalidSicCode,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  if (draftSicCodesList.includes(trimmedSicCode)) {
    return {
      valid: false,
      errors: [
        {
          field: 'Producer Standard Industrial Classification (SIC) code',
          code: errorCodes.producerDuplicateSicCode,
          message: message
            ? getErrorMessage(
                errorCodes.producerDuplicateSicCode,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  return {
    valid: true,
    value: trimmedSicCode,
  };
}
