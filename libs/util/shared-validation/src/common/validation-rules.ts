import { commonConstraints, commonRegex, ValidationResult } from '.';

export function titleCase(str: string): string {
  return str
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

export function validateReference(
  reference?: string,
): ValidationResult<string> {
  const trimmedReference = reference?.trim();
  if (!trimmedReference) {
    return {
      valid: false,
      errors: ['empty'],
    };
  }

  if (trimmedReference.length > commonConstraints.ReferenceChar.max) {
    return {
      valid: false,
      errors: ['charTooMany'],
    };
  }

  if (!commonRegex.referenceRegex.test(trimmedReference)) {
    return {
      valid: false,
      errors: ['invalid'],
    };
  }

  return {
    valid: true,
    value: trimmedReference,
  };
}

export function validateBuildingNameOrNumber(
  buildingNameOrNumber?: string,
): ValidationResult<string | undefined> {
  const trimmedBuildingNameOrNumber = buildingNameOrNumber?.trim();
  if (
    trimmedBuildingNameOrNumber &&
    trimmedBuildingNameOrNumber.length > commonConstraints.FreeTextChar.max
  ) {
    return {
      valid: false,
      errors: ['charTooMany'],
    };
  }

  return {
    valid: true,
    value: !trimmedBuildingNameOrNumber
      ? undefined
      : trimmedBuildingNameOrNumber,
  };
}

export function validateAddressLine1(
  addressLine1?: string,
): ValidationResult<string> {
  const trimmedAddressLine1 = addressLine1?.trim();
  if (!trimmedAddressLine1) {
    return {
      valid: false,
      errors: ['empty'],
    };
  }

  if (trimmedAddressLine1.length > commonConstraints.FreeTextChar.max) {
    return {
      valid: false,
      errors: ['charTooMany'],
    };
  }

  return {
    valid: true,
    value: trimmedAddressLine1,
  };
}

export function validateAddressLine2(
  addressLine2?: string,
): ValidationResult<string | undefined> {
  const trimmedAddressLine2 = addressLine2?.trim();
  if (
    trimmedAddressLine2 &&
    trimmedAddressLine2.length > commonConstraints.FreeTextChar.max
  ) {
    return {
      valid: false,
      errors: ['charTooMany'],
    };
  }

  return {
    valid: true,
    value: !trimmedAddressLine2 ? undefined : trimmedAddressLine2,
  };
}

export function validatePostcode(
  postcode?: string,
): ValidationResult<string | undefined> {
  const trimmedPostcode = postcode?.trim();
  if (!trimmedPostcode) {
    return {
      valid: false,
      errors: ['empty'],
    };
  }
  if (trimmedPostcode && !commonRegex.postcodeRegex.test(trimmedPostcode)) {
    return {
      valid: false,
      errors: ['invalid'],
    };
  }

  return {
    valid: true,
    value: !trimmedPostcode ? undefined : trimmedPostcode,
  };
}

export function validateTownCity(townCity?: string): ValidationResult<string> {
  const trimmedTownCity = townCity?.trim();
  if (!trimmedTownCity) {
    return {
      valid: false,
      errors: ['empty'],
    };
  }

  if (trimmedTownCity.length > commonConstraints.FreeTextChar.max) {
    return {
      valid: false,
      errors: ['charTooMany'],
    };
  }

  return {
    valid: true,
    value: trimmedTownCity,
  };
}

export function validateCountry(country?: string): ValidationResult<string> {
  let trimmedCountry = country?.trim();
  if (!trimmedCountry) {
    return {
      valid: false,
      errors: ['empty'],
    };
  }

  trimmedCountry = titleCase(trimmedCountry);
  if (!fourNationsCountries.includes(trimmedCountry)) {
    return {
      valid: false,
      errors: ['invalid'],
    };
  }

  return {
    valid: true,
    value: trimmedCountry,
  };
}

export function validateOrganisationName(
  organsationName?: string,
): ValidationResult<string> {
  const trimmedOrganisationName = organsationName?.trim();
  if (!trimmedOrganisationName) {
    return {
      valid: false,
      errors: ['empty'],
    };
  }

  if (trimmedOrganisationName.length > commonConstraints.FreeTextChar.max) {
    return {
      valid: false,
      errors: ['charTooMany'],
    };
  }

  return {
    valid: true,
    value: trimmedOrganisationName,
  };
}

export function validateFullName(
  contactFullName?: string,
): ValidationResult<string> {
  const trimmedContactFullName = contactFullName?.trim();
  if (!trimmedContactFullName) {
    return {
      valid: false,
      errors: ['empty'],
    };
  }

  if (trimmedContactFullName.length > commonConstraints.FreeTextChar.max) {
    return {
      valid: false,
      errors: ['charTooMany'],
    };
  }

  return {
    valid: true,
    value: trimmedContactFullName,
  };
}

export function validateEmailAddress(
  emailAddress?: string,
): ValidationResult<string> {
  const trimmedEmailAddress = emailAddress?.trim();
  if (!trimmedEmailAddress) {
    return {
      valid: false,
      errors: ['empty'],
    };
  }

  if (trimmedEmailAddress.length > commonConstraints.FreeTextChar.max) {
    return {
      valid: false,
      errors: ['charTooMany'],
    };
  }

  if (!commonRegex.emailRegex.test(trimmedEmailAddress)) {
    return {
      valid: false,
      errors: ['invalid'],
    };
  }

  return {
    valid: true,
    value: trimmedEmailAddress,
  };
}

// for csv .replace(/'/g, '')
export function validatePhoneNumber(
  phoneNumber?: string,
): ValidationResult<string> {
  const trimmedPhoneNumber = phoneNumber?.trim();
  if (!trimmedPhoneNumber) {
    return {
      valid: false,
      errors: ['empty'],
    };
  }

  if (!commonRegex.phoneRegex.test(trimmedPhoneNumber)) {
    return {
      valid: false,
      errors: ['invalid'],
    };
  }

  return {
    valid: true,
    value: trimmedPhoneNumber,
  };
}

// for csv .replace(/'/g, '')
export function validateFaxNumber(
  faxNumber?: string,
): ValidationResult<string | undefined> {
  const trimmedFaxNumber = faxNumber?.trim();
  if (trimmedFaxNumber && !commonRegex.faxRegex.test(trimmedFaxNumber)) {
    return {
      valid: false,
      errors: ['invalid'],
    };
  }

  return {
    valid: true,
    value: !trimmedFaxNumber ? undefined : trimmedFaxNumber,
  };
}
