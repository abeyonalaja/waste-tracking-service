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
    return {
      valid: false,
      errors: [
        {
          field: 'Producer organisation name',
          code: errorCodes.producerCharTooManyOrganisationName,
          message: message
            ? getErrorMessage(
                errorCodes.producerCharTooManyOrganisationName,
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
    value: trimmedOrganisationName,
  };
}

export function validateProducerReference(
  reference?: string,
  message?: ErrorMessage,
): ValidationResult<string> {
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
    return {
      valid: false,
      errors: [
        {
          field: 'Reference',
          code: errorCodes.producerCharTooManyReference,
          message: message
            ? getErrorMessage(
                errorCodes.producerCharTooManyReference,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  if (!regex.referenceRegex.test(trimmedReference)) {
    return {
      valid: false,
      errors: [
        {
          field: 'Reference',
          code: errorCodes.producerInvalidReference,
          message: message
            ? getErrorMessage(
                errorCodes.producerInvalidReference,
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
  const trimmedBuildingNameOrNumber = buildingNameOrNumber?.trim();

  if (
    trimmedBuildingNameOrNumber &&
    trimmedBuildingNameOrNumber.length > constraints.FreeTextChar.max
  ) {
    return {
      valid: false,
      errors: [
        {
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
        },
      ],
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
    return {
      valid: false,
      errors: [
        {
          field: (section + ' address line 1') as Field,
          code: getSharedErrorCode(
            errorCodes.charTooManyAddressLine1Base,
            section,
          ),
          message: message
            ? getErrorMessage(
                errorCodes.charTooManyAddressLine1Base,
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
    value: trimmedAddressLine1,
  };
}

export function validateAddressLine2(
  addressLine2: string,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const trimmedAddressLine2 = addressLine2?.trim();

  if (
    trimmedAddressLine2 &&
    trimmedAddressLine2.length > constraints.FreeTextChar.max
  ) {
    return {
      valid: false,
      errors: [
        {
          field: (section + ' address line 2') as Field,
          code: getSharedErrorCode(
            errorCodes.charTooManyAddressLine2Base,
            section,
          ),
          message: message
            ? getErrorMessage(
                errorCodes.charTooManyAddressLine2Base,
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
    value: trimmedAddressLine2,
  };
}

export function validatePostcode(
  postcode: string,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const trimmedPostcode = postcode?.trim();

  if (trimmedPostcode.length > constraints.PostcodeChar.max) {
    return {
      valid: false,
      errors: [
        {
          field: (section + ' postcode') as Field,
          code: getSharedErrorCode(errorCodes.invalidPostcodeBase, section),
          message: message
            ? getErrorMessage(
                errorCodes.invalidPostcodeBase,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  if (!regex.postcodeRegex.test(trimmedPostcode)) {
    return {
      valid: false,
      errors: [
        {
          field: (section + ' postcode') as Field,
          code: getSharedErrorCode(errorCodes.invalidPostcodeBase, section),
          message: message
            ? getErrorMessage(
                errorCodes.invalidPostcodeBase,
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
    value: trimmedPostcode,
  };
}

export function validateTownCity(
  townCity: string,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
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
    return {
      valid: false,
      errors: [
        {
          field: (section + ' town or city') as Field,
          code: getSharedErrorCode(
            errorCodes.charTooManyTownOrCityBase,
            section,
          ),
          message: message
            ? getErrorMessage(
                errorCodes.charTooManyTownOrCityBase,
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
    value: trimmedTownCity,
  };
}

export function validateCountry(
  country: string,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
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
    return {
      valid: false,
      errors: [
        {
          field: (section + ' country') as Field,
          code: getSharedErrorCode(errorCodes.invalidCountryBase, section),
          message: message
            ? getErrorMessage(
                errorCodes.invalidCountryBase,
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
      errors.push(...buildingNameOrNumber.errors);
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
    errors.push(...addressLine1.errors);
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
      errors.push(...addressLine2.errors);
    }
  }

  const townCity = validateTownCity(value.townCity, section, message);
  if (townCity.valid) {
    addressToReturn.townCity = townCity.value;
  } else {
    errors.push(...townCity.errors);
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
      errors.push(...postcode.errors);
    }
  }

  const country = validateCountry(value.country, section, message);
  if (country.valid) {
    addressToReturn.country = country.value;
  } else {
    errors.push(...country.errors);
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
      errors.push(...producerBuildingNameOrNumber.errors);
    }
  }

  if (value.addressLine1?.trim()) {
    const producerAddressLine1: ValidationResult<
      ProducerDetail['address']['addressLine1']
    > = validateAddressLine1(value.addressLine1, section, message);
    if (producerAddressLine1.valid) {
      fieldsToReturn.addressLine1 = producerAddressLine1.value;
    } else {
      errors.push(...producerAddressLine1.errors);
    }
  }

  if (value.addressLine2?.trim()) {
    const producerAddressLine2: ValidationResult<
      ProducerDetail['address']['addressLine2']
    > = validateAddressLine2(value.addressLine2, section, message);
    if (producerAddressLine2.valid) {
      fieldsToReturn.addressLine2 = producerAddressLine2.value;
    } else {
      errors.push(...producerAddressLine2.errors);
    }
  }

  if (value.townCity?.trim()) {
    const producerTownCity: ValidationResult<
      ProducerDetail['address']['townCity']
    > = validateTownCity(value.townCity, section, message);
    if (producerTownCity.valid) {
      fieldsToReturn.townCity = producerTownCity.value;
    } else {
      errors.push(...producerTownCity.errors);
    }
  }

  if (value.country?.trim()) {
    const producerCountry: ValidationResult<
      ProducerDetail['address']['country']
    > = validateCountry(value.country, section, message);
    if (producerCountry.valid) {
      fieldsToReturn.country = producerCountry.value;
    } else {
      errors.push(...producerCountry.errors);
    }
  }

  if (value.postcode?.trim()) {
    const producerPostcode: ValidationResult<
      ProducerDetail['address']['postcode']
    > = validatePostcode(value.postcode, section, message);
    if (producerPostcode.valid) {
      fieldsToReturn.postcode = producerPostcode.value;
    } else {
      errors.push(...producerPostcode.errors);
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

export function validateOrganisationName(
  contactOrganisationName: string | undefined,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const trimmedContactOrganisationName = contactOrganisationName?.trim();
  if (!trimmedContactOrganisationName) {
    return {
      valid: false,
      errors: [
        {
          field: (section + ' organisation name') as Field,
          code: getSharedErrorCode(
            errorCodes.emptyOrganisationNameBase,
            section,
          ),
          message: message
            ? getErrorMessage(
                errorCodes.emptyOrganisationNameBase,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  if (trimmedContactOrganisationName.length > constraints.FreeTextChar.max) {
    return {
      valid: false,
      errors: [
        {
          field: (section + ' organisation name') as Field,
          code: getSharedErrorCode(
            errorCodes.charTooManyOrganisationNameBase,
            section,
          ),
          message: message
            ? getErrorMessage(
                errorCodes.charTooManyOrganisationNameBase,
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
    value: trimmedContactOrganisationName,
  };
}

export function validateFullName(
  contactPerson: string | undefined,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const trimmedContactPerson = contactPerson?.trim();
  if (!trimmedContactPerson) {
    return {
      valid: false,
      errors: [
        {
          field: (section + ' contact name') as Field,
          code: getSharedErrorCode(
            errorCodes.emptyContactFullNameBase,
            section,
          ),
          message: message
            ? getErrorMessage(
                errorCodes.emptyContactFullNameBase,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  if (trimmedContactPerson.length > constraints.FreeTextChar.max) {
    return {
      valid: false,
      errors: [
        {
          field: (section + ' contact name') as Field,
          code: getSharedErrorCode(
            errorCodes.charTooManyContactFullNameBase,
            section,
          ),
          message: message
            ? getErrorMessage(
                errorCodes.charTooManyContactFullNameBase,
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
    value: trimmedContactPerson,
  };
}

export function validateEmail(
  contactEmail: string | undefined,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const trimmedContactEmail = contactEmail?.trim();

  if (!trimmedContactEmail) {
    return {
      valid: false,
      errors: [
        {
          field: (section + ' contact email address') as Field,
          code: getSharedErrorCode(errorCodes.emptyEmailBase, section),
          message: message
            ? getErrorMessage(
                errorCodes.emptyEmailBase,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  if (trimmedContactEmail.length > constraints.FreeTextChar.max) {
    return {
      valid: false,
      errors: [
        {
          field: (section + ' contact email address') as Field,
          code: getSharedErrorCode(errorCodes.charTooManyEmailBase, section),
          message: message
            ? getErrorMessage(
                errorCodes.charTooManyEmailBase,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  if (!regex.emailRegex.test(trimmedContactEmail)) {
    return {
      valid: false,
      errors: [
        {
          field: (section + ' contact email address') as Field,
          code: getSharedErrorCode(errorCodes.invalidEmailBase, section),
          message: message
            ? getErrorMessage(
                errorCodes.invalidEmailBase,
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
    value: trimmedContactEmail,
  };
}

export function validatePhone(
  phoneNumber: string | undefined,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const trimmedPhoneNumber = phoneNumber?.trim();

  if (!trimmedPhoneNumber) {
    return {
      valid: false,
      errors: [
        {
          field: (section + ' contact phone number') as Field,
          code: getSharedErrorCode(errorCodes.emptyPhoneBase, section),
          message: message
            ? getErrorMessage(
                errorCodes.emptyPhoneBase,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  if (!regex.phoneRegex.test(trimmedPhoneNumber)) {
    return {
      valid: false,
      errors: [
        {
          field: (section + ' contact phone number') as Field,
          code: getSharedErrorCode(errorCodes.invalidPhoneBase, section),
          message: message
            ? getErrorMessage(
                errorCodes.invalidPhoneBase,
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
    value: trimmedPhoneNumber,
  };
}

export function validateFax(
  faxNumber: string | undefined,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const trimmedFaxNumber = faxNumber?.trim();

  if (trimmedFaxNumber && !regex.faxRegex.test(trimmedFaxNumber)) {
    return {
      valid: false,
      errors: [
        {
          field: (section + ' fax number') as Field,
          code: getSharedErrorCode(errorCodes.invalidFaxBase, section),
          message: message
            ? getErrorMessage(
                errorCodes.invalidFaxBase,
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

export function validateContact(
  value: Contact,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<Contact> {
  const errors: FieldFormatError[] = [];
  const contactToReturn: Contact = {
    organisationName: '',
    name: '',
    email: '',
    phone: '',
  };

  const organisationName = validateOrganisationName(
    value.organisationName,
    section,
    message,
  );
  if (organisationName.valid) {
    contactToReturn.organisationName = organisationName.value;
  } else {
    errors.push(...organisationName.errors);
  }

  const name = validateFullName(value.name, section, message);
  if (name.valid) {
    contactToReturn.name = name.value;
  } else {
    errors.push(...name.errors);
  }

  const email = validateEmail(value.email, section, message);
  if (email.valid) {
    contactToReturn.email = email.value;
  } else {
    errors.push(...email.errors);
  }

  const phone = validatePhone(value.phone, section, message);
  if (phone.valid) {
    contactToReturn.phone = phone.value;
  } else {
    errors.push(...phone.errors);
  }

  if (value.fax?.trim()) {
    const fax: ValidationResult<Contact['fax']> = validateFax(
      value.fax.trim() as string,
      section as Section,
      message,
    );

    if (fax.valid) {
      contactToReturn.fax = fax.value;
    } else {
      errors.push(...fax.errors);
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
    value: contactToReturn,
  };
}

export function validatePartialContact(
  value: Partial<Contact>,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<Partial<Contact>> {
  const errors: FieldFormatError[] = [];
  const fieldsToReturn: Partial<Contact> = {};

  if (value.organisationName?.trim()) {
    const organisationName: ValidationResult<Contact['organisationName']> =
      validateOrganisationName(
        value.organisationName.trim() as string,
        section as Section,
        message,
      );

    if (organisationName.valid) {
      fieldsToReturn.organisationName = organisationName.value;
    } else {
      errors.push(...organisationName.errors);
    }
  }

  if (value.name?.trim()) {
    const name: ValidationResult<Contact['name']> = validateFullName(
      value.name.trim() as string,
      section as Section,
      message,
    );

    if (name.valid) {
      fieldsToReturn.name = name.value;
    } else {
      errors.push(...name.errors);
    }
  }

  if (value.email?.trim()) {
    const email: ValidationResult<Contact['email']> = validateEmail(
      value.email.trim() as string,
      section as Section,
      message,
    );

    if (email.valid) {
      fieldsToReturn.email = email.value;
    } else {
      errors.push(...email.errors);
    }
  }

  if (value.phone?.trim()) {
    const phone: ValidationResult<Contact['phone']> = validatePhone(
      value.phone.trim() as string,
      section as Section,
      message,
    );

    if (phone.valid) {
      fieldsToReturn.phone = phone.value;
    } else {
      errors.push(...phone.errors);
    }
  }

  if (value.fax?.trim()) {
    const fax: ValidationResult<Contact['fax']> = validateFax(
      value.fax.trim() as string,
      section as Section,
      message,
    );

    if (fax.valid) {
      fieldsToReturn.fax = fax.value;
    } else {
      errors.push(...fax.errors);
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
          field: 'Waste collection details waste source',
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
          field: 'Waste collection details waste source',
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
          field: 'Producer standard industrial classification (SIC) code',
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
          field: 'Producer standard industrial classification (SIC) code',
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
          field: 'Producer standard industrial classification (SIC) code',
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
          field: 'Producer standard industrial classification (SIC) code',
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
