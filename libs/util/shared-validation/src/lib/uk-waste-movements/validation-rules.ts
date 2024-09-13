import * as commonValidationRules from '../common/validation-rules';
import * as constraints from './constraints';
import * as errorCodes from './error-codes';
import { getErrorMessage, getSharedErrorCode } from './util';
import type { ValidationResult, FieldFormatError, Section, Field } from './dto';
import { Contact, Address, SICCode } from './model';
import { ErrorMessage } from '../common';

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

export function validateReference(
  reference: string | undefined,
  message?: ErrorMessage,
): ValidationResult<string> {
  const result = commonValidationRules.validateReference(reference);
  if (!result.valid) {
    const field: Field = 'Reference';
    const errors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'empty':
          errors.push({
            field: field,
            code: errorCodes.producerEmptyReference,
            message: message
              ? getErrorMessage(
                  errorCodes.producerEmptyReference,
                  message.locale,
                  message.context,
                )
              : undefined,
          });
          break;
        case 'charTooMany':
          errors.push({
            field: field,
            code: errorCodes.producerCharTooManyReference,
            message: message
              ? getErrorMessage(
                  errorCodes.producerCharTooManyReference,
                  message.locale,
                  message.context,
                )
              : undefined,
          });
          break;
        case 'invalid':
          errors.push({
            field: field,
            code: errorCodes.producerInvalidReference,
            message: message
              ? getErrorMessage(
                  errorCodes.producerInvalidReference,
                  message.locale,
                  message.context,
                )
              : undefined,
          });
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: result.value,
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
  buildingNameOrNumber: string | undefined,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string | undefined> {
  const result =
    commonValidationRules.validateBuildingNameOrNumber(buildingNameOrNumber);
  if (!result.valid) {
    const errors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'charTooMany':
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
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

export function validateAddressLine1(
  addressLine1: string | undefined,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const result = commonValidationRules.validateAddressLine1(addressLine1);
  if (!result.valid) {
    const errors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'empty':
          errors.push({
            field: (section + ' address line 1') as Field,
            code: getSharedErrorCode(errorCodes.emptyAddressLine1Base, section),
            message: message
              ? getErrorMessage(
                  errorCodes.emptyAddressLine1Base,
                  message.locale,
                  message.context,
                )
              : undefined,
          });
          break;
        case 'charTooMany':
          errors.push({
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
          });
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

export function validateAddressLine2(
  addressLine2: string | undefined,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string | undefined> {
  const result = commonValidationRules.validateAddressLine2(addressLine2);
  if (!result.valid) {
    const errors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'charTooMany':
          errors.push({
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
          });
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

export function validatePostcode(
  postcode: string | undefined,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string | undefined> {
  const result = commonValidationRules.validatePostcode(postcode);
  if (!result.valid) {
    const errors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'invalid':
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
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: errors,
    };
  }

  if (!result.value && message?.context === 'ui') {
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
    value: result.value,
  };
}

export function validateTownOrCity(
  townCity: string | undefined,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const result = commonValidationRules.validateTownOrCity(townCity);
  if (!result.valid) {
    const errors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'empty':
          errors.push({
            field: (section + ' town or city') as Field,
            code: getSharedErrorCode(errorCodes.emptyTownOrCityBase, section),
            message: message
              ? getErrorMessage(
                  errorCodes.emptyTownOrCityBase,
                  message.locale,
                  message.context,
                )
              : undefined,
          });
          break;
        case 'charTooMany':
          errors.push({
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
          });
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

export function validateCountry(
  country: string | undefined,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const result = commonValidationRules.validateCountry(country);
  if (!result.valid) {
    const errors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'empty':
          errors.push({
            field: (section + ' country') as Field,
            code: getSharedErrorCode(errorCodes.emptyCountryBase, section),
            message: message
              ? getErrorMessage(
                  errorCodes.emptyCountryBase,
                  message.locale,
                  message.context,
                )
              : undefined,
          });
          break;
        case 'invalid':
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
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

export function validateAddressDetails(
  value: Address | Partial<Address>,
  section: Section,
  saveAsDraft: boolean,
  message?: ErrorMessage,
): ValidationResult<Address | Partial<Address>> {
  if (!saveAsDraft) {
    const errors: FieldFormatError[] = [];
    const address: Address = {
      addressLine1: '',
      townCity: '',
      postcode: '',
      country: '',
    };

    const buildingNameOrNumber = validateBuildingNameOrNumber(
      value.buildingNameOrNumber,
      section,
      message,
    );
    if (buildingNameOrNumber.valid) {
      address.buildingNameOrNumber = buildingNameOrNumber.value ?? undefined;
    } else {
      errors.push(...buildingNameOrNumber.errors);
    }

    const addressLine1 = validateAddressLine1(
      value.addressLine1,
      section,
      message,
    );
    if (addressLine1.valid) {
      address.addressLine1 = addressLine1.value;
    } else {
      errors.push(...addressLine1.errors);
    }

    const addressLine2 = validateAddressLine2(
      value.addressLine2,
      section,
      message,
    );
    if (addressLine2.valid) {
      address.addressLine2 = addressLine2.value ?? undefined;
    } else {
      errors.push(...addressLine2.errors);
    }

    const townCity = validateTownOrCity(value.townCity, section, message);
    if (townCity.valid) {
      address.townCity = townCity.value;
    } else {
      errors.push(...townCity.errors);
    }

    const postcode = validatePostcode(value.postcode, section, message);
    if (postcode.valid) {
      address.postcode = postcode.value ?? undefined;
    } else {
      errors.push(...postcode.errors);
    }

    const country = validateCountry(value.country, section, message);
    if (country.valid) {
      address.country = country.value;
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
      value: address,
    };
  } else {
    const errors: FieldFormatError[] = [];
    const address: Partial<Address> = {};

    if (value.buildingNameOrNumber) {
      const buildingNameOrNumber = validateBuildingNameOrNumber(
        value.buildingNameOrNumber,
        section,
        message,
      );
      if (buildingNameOrNumber.valid) {
        address.buildingNameOrNumber = buildingNameOrNumber.value ?? undefined;
      } else {
        errors.push(...buildingNameOrNumber.errors);
      }
    }

    if (value.addressLine1) {
      const addressLine1 = validateAddressLine1(
        value.addressLine1,
        section,
        message,
      );
      if (addressLine1.valid) {
        address.addressLine1 = addressLine1.value;
      } else {
        errors.push(...addressLine1.errors);
      }
    }

    if (value.addressLine2) {
      const addressLine2 = validateAddressLine2(
        value.addressLine2,
        section,
        message,
      );
      if (addressLine2.valid) {
        address.addressLine2 = addressLine2.value ?? undefined;
      } else {
        errors.push(...addressLine2.errors);
      }
    }

    if (value.townCity) {
      const townCity = validateTownOrCity(value.townCity, section, message);
      if (townCity.valid) {
        address.townCity = townCity.value;
      } else {
        errors.push(...townCity.errors);
      }
    }

    if (value.postcode) {
      const postcode = validatePostcode(value.postcode, section, message);
      if (postcode.valid) {
        address.postcode = postcode.value ?? undefined;
      } else {
        errors.push(...postcode.errors);
      }
    }

    if (value.country) {
      const country = validateCountry(value.country, section, message);
      if (country.valid) {
        address.country = country.value;
      } else {
        errors.push(...country.errors);
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
      value: address,
    };
  }
}

export function validateOrganisationName(
  organisationName: string | undefined,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const result =
    commonValidationRules.validateOrganisationName(organisationName);
  if (!result.valid) {
    const errors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'empty':
          errors.push({
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
          });
          break;
        case 'charTooMany':
          errors.push({
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
          });
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

export function validateFullName(
  fullName: string | undefined,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const result = commonValidationRules.validateFullName(fullName);
  if (!result.valid) {
    const errors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'empty':
          errors.push({
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
          });
          break;
        case 'charTooMany':
          errors.push({
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
          });
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

export function validateEmailAddress(
  emailAddress: string | undefined,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const result = commonValidationRules.validateEmailAddress(emailAddress);
  if (!result.valid) {
    const errors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'empty':
          errors.push({
            field: (section + ' contact email address') as Field,
            code: getSharedErrorCode(errorCodes.emptyEmailBase, section),
            message: message
              ? getErrorMessage(
                  errorCodes.emptyEmailBase,
                  message.locale,
                  message.context,
                )
              : undefined,
          });
          break;
        case 'charTooMany':
          errors.push({
            field: (section + ' contact email address') as Field,
            code: getSharedErrorCode(errorCodes.charTooManyEmailBase, section),
            message: message
              ? getErrorMessage(
                  errorCodes.charTooManyEmailBase,
                  message.locale,
                  message.context,
                )
              : undefined,
          });
          break;
        case 'invalid':
          errors.push({
            field: (section + ' contact email address') as Field,
            code: getSharedErrorCode(errorCodes.invalidEmailBase, section),
            message: message
              ? getErrorMessage(
                  errorCodes.invalidEmailBase,
                  message.locale,
                  message.context,
                )
              : undefined,
          });
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

export function validatePhoneNumber(
  phoneNumber: string | undefined,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string> {
  const result = commonValidationRules.validatePhoneNumber(phoneNumber);
  if (!result.valid) {
    const errors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'empty':
          errors.push({
            field: (section + ' contact phone number') as Field,
            code: getSharedErrorCode(errorCodes.emptyPhoneBase, section),
            message: message
              ? getErrorMessage(
                  errorCodes.emptyPhoneBase,
                  message.locale,
                  message.context,
                )
              : undefined,
          });
          break;
        case 'invalid':
          errors.push({
            field: (section + ' contact phone number') as Field,
            code: getSharedErrorCode(errorCodes.invalidPhoneBase, section),
            message: message
              ? getErrorMessage(
                  errorCodes.invalidPhoneBase,
                  message.locale,
                  message.context,
                )
              : undefined,
          });
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

export function validateFaxNumber(
  faxNumber: string | undefined,
  section: Section,
  message?: ErrorMessage,
): ValidationResult<string | undefined> {
  const result = commonValidationRules.validateFaxNumber(faxNumber);
  if (!result.valid) {
    const errors: FieldFormatError[] = [];
    result.errors.forEach((e) => {
      switch (e) {
        case 'invalid':
          errors.push({
            field: (section + ' fax number') as Field,
            code: getSharedErrorCode(errorCodes.invalidFaxBase, section),
            message: message
              ? getErrorMessage(
                  errorCodes.invalidFaxBase,
                  message.locale,
                  message.context,
                )
              : undefined,
          });
          break;
        default:
          break;
      }
    });

    return {
      valid: false,
      errors: errors,
    };
  }

  return {
    valid: true,
    value: result.value,
  };
}

export function validateContactDetails(
  value: Contact | Partial<Contact>,
  section: Section,
  saveAsDraft: boolean,
  message?: ErrorMessage,
): ValidationResult<Contact | Partial<Contact>> {
  if (!saveAsDraft) {
    const errors: FieldFormatError[] = [];
    const contact: Contact = {
      organisationName: '',
      fullName: '',
      emailAddress: '',
      phoneNumber: '',
    };

    const organisationName = validateOrganisationName(
      value.organisationName,
      section,
      message,
    );
    if (organisationName.valid) {
      contact.organisationName = organisationName.value;
    } else {
      errors.push(...organisationName.errors);
    }

    const fullName = validateFullName(value.fullName, section, message);
    if (fullName.valid) {
      contact.fullName = fullName.value;
    } else {
      errors.push(...fullName.errors);
    }

    const emailAddress = validateEmailAddress(
      value.emailAddress,
      section,
      message,
    );
    if (emailAddress.valid) {
      contact.emailAddress = emailAddress.value;
    } else {
      errors.push(...emailAddress.errors);
    }

    const phoneNumber = validatePhoneNumber(
      value.phoneNumber,
      section,
      message,
    );
    if (phoneNumber.valid) {
      contact.phoneNumber = phoneNumber.value;
    } else {
      errors.push(...phoneNumber.errors);
    }

    const faxNumber = validateFaxNumber(value.faxNumber, section, message);
    if (faxNumber.valid) {
      contact.faxNumber = faxNumber.value ?? undefined;
    } else {
      errors.push(...faxNumber.errors);
    }

    if (errors.length > 0) {
      return {
        valid: false,
        errors: errors,
      };
    }

    return {
      valid: true,
      value: contact,
    };
  } else {
    const errors: FieldFormatError[] = [];
    const contact: Partial<Contact> = {};

    if (value.organisationName) {
      const organisationName = validateOrganisationName(
        value.organisationName,
        section,
        message,
      );
      if (organisationName.valid) {
        contact.organisationName = organisationName.value;
      } else {
        errors.push(...organisationName.errors);
      }
    }

    if (value.fullName) {
      const fullName = validateFullName(value.fullName, section, message);
      if (fullName.valid) {
        contact.fullName = fullName.value;
      } else {
        errors.push(...fullName.errors);
      }
    }

    if (value.emailAddress) {
      const emailAddress = validateEmailAddress(
        value.emailAddress,
        section,
        message,
      );
      if (emailAddress.valid) {
        contact.emailAddress = emailAddress.value;
      } else {
        errors.push(...emailAddress.errors);
      }
    }

    if (value.phoneNumber) {
      const phoneNumber = validatePhoneNumber(
        value.phoneNumber,
        section,
        message,
      );
      if (phoneNumber.valid) {
        contact.phoneNumber = phoneNumber.value;
      } else {
        errors.push(...phoneNumber.errors);
      }
    }

    if (value.faxNumber) {
      const faxNumber = validateFaxNumber(value.faxNumber, section, message);
      if (faxNumber.valid) {
        contact.faxNumber = faxNumber.value ?? undefined;
      } else {
        errors.push(...faxNumber.errors);
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
      value: contact,
    };
  }
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
