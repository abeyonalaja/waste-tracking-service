import * as regex from './regex';
import * as constraints from './constraints';
import * as errorCodes from './error-codes';
import { getErrorMessage } from './util';
import type { ErrorMessage, ValidationResult, FieldFormatError } from './dto';
import { Contact, ProducerDetail } from './model';

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

export function validatePostcode(
  value: string,
  message?: ErrorMessage,
): ValidationResult<string> {
  const errors: FieldFormatError[] = [];

  if (!value) {
    return {
      valid: false,
      errors: [
        {
          field: 'Producer postcode',
          code: errorCodes.postcodeEmpty,
          message: message
            ? getErrorMessage(
                errorCodes.postcodeEmpty,
                message.locale,
                message.context,
              )
            : undefined,
        },
      ],
    };
  }

  const postcodeRegex = new RegExp(constraints.PostcodeRegex.pattern);

  if (!postcodeRegex.test(value)) {
    errors.push({
      field: 'Producer postcode',
      code: errorCodes.postcodeInvalid,
      message: message
        ? getErrorMessage(
            errorCodes.postcodeInvalid,
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
    value: value,
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

export function validateProducerBuildingNameOrNumber(
  buildingNameOrNumber: string,
  message?: ErrorMessage,
): ValidationResult<string> {
  const errors: FieldFormatError[] = [];

  const trimmedBuildingNameOrNumber = buildingNameOrNumber?.trim();

  if (
    trimmedBuildingNameOrNumber &&
    trimmedBuildingNameOrNumber.length > constraints.FreeTextChar.max
  ) {
    errors.push({
      field: 'Producer building name or number',
      code: errorCodes.producerCharTooManyBuildingNameOrNumber,
      message: message
        ? getErrorMessage(
            errorCodes.producerCharTooManyBuildingNameOrNumber,
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

export function validateProducerAddressLine1(
  addressLine1?: string,
  message?: ErrorMessage,
): ValidationResult<string> {
  const errors: FieldFormatError[] = [];

  const trimmedAddressLine1 = addressLine1?.trim();

  if (!trimmedAddressLine1) {
    return {
      valid: false,
      errors: [
        {
          field: 'Producer address line 1',
          code: errorCodes.producerEmptyAddressLine1,
          message: message
            ? getErrorMessage(
                errorCodes.producerEmptyAddressLine1,
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
      field: 'Producer address line 1',
      code: errorCodes.producerCharTooManyAddressLine1,
      message: message
        ? getErrorMessage(
            errorCodes.producerCharTooManyAddressLine1,
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

export function validateProducerAddressLine2(
  addressLine2: string,
  message?: ErrorMessage,
): ValidationResult<string> {
  const errors: FieldFormatError[] = [];

  const trimmedAddressLine2 = addressLine2?.trim();

  if (
    trimmedAddressLine2 &&
    trimmedAddressLine2.length > constraints.FreeTextChar.max
  ) {
    errors.push({
      field: 'Producer address line 2',
      code: errorCodes.producerCharTooManyAddressLine2,
      message: message
        ? getErrorMessage(
            errorCodes.producerCharTooManyAddressLine2,
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

export function validateProducerPostcode(
  postcode: string,
  message?: ErrorMessage,
): ValidationResult<string> {
  const errors: FieldFormatError[] = [];

  const trimmedPostcode = postcode?.trim();

  if (trimmedPostcode.length > constraints.PostcodeChar.max) {
    errors.push({
      field: 'Producer postcode',
      code: errorCodes.producerInvalidPostcode,
      message: message
        ? getErrorMessage(
            errorCodes.producerInvalidPostcode,
            message.locale,
            message.context,
          )
        : undefined,
    });
  }

  if (!regex.postcodeRegex.test(trimmedPostcode)) {
    errors.push({
      field: 'Producer postcode',
      code: errorCodes.producerInvalidPostcode,
      message: message
        ? getErrorMessage(
            errorCodes.producerInvalidPostcode,
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

export function validateProducerTownCity(
  townCity: string,
  message?: ErrorMessage,
): ValidationResult<string> {
  const errors: FieldFormatError[] = [];

  const trimmedTownCity = townCity?.trim();

  if (!trimmedTownCity) {
    return {
      valid: false,
      errors: [
        {
          field: 'Producer town or city',
          code: errorCodes.producerEmptyTownOrCity,
          message: message
            ? getErrorMessage(
                errorCodes.producerEmptyTownOrCity,
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
      field: 'Producer town or city',
      code: errorCodes.producerCharTooManyTownOrCity,
      message: message
        ? getErrorMessage(
            errorCodes.producerCharTooManyTownOrCity,
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

export function validateProducerCountry(
  country: string,
  message?: ErrorMessage,
): ValidationResult<string> {
  const errors: FieldFormatError[] = [];

  const trimmedCountry = country?.trim();

  if (!trimmedCountry) {
    return {
      valid: false,
      errors: [
        {
          field: 'Producer country',
          code: errorCodes.producerEmptyCountry,
          message: message
            ? getErrorMessage(
                errorCodes.producerEmptyCountry,
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
      field: 'Producer country',
      code: errorCodes.producerInvalidCountry,
      message: message
        ? getErrorMessage(
            errorCodes.producerInvalidCountry,
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

export function validateProducerAddressDetails(
  value: ProducerDetail['address'],
  message?: ErrorMessage,
): ValidationResult<ProducerDetail['address']> {
  const errors: FieldFormatError[] = [];
  const addressToReturn: ProducerDetail['address'] = {
    addressLine1: '',
    townCity: '',
    postcode: '',
    country: '',
  };

  if (value.buildingNameOrNumber && value.buildingNameOrNumber.trim() !== '') {
    const producerBuildingNameOrNumber: ValidationResult<
      ProducerDetail['address']['buildingNameOrNumber']
    > = validateProducerBuildingNameOrNumber(
      value.buildingNameOrNumber.trim() as string,
      message,
    );

    if (producerBuildingNameOrNumber.valid) {
      addressToReturn.buildingNameOrNumber = producerBuildingNameOrNumber.value;
    } else {
      producerBuildingNameOrNumber.errors?.forEach((error) =>
        errors.push(error),
      );
    }
  }

  const producerAddressLine1 = validateProducerAddressLine1(
    value.addressLine1,
    message,
  );
  if (producerAddressLine1.valid) {
    addressToReturn.addressLine1 = producerAddressLine1.value;
  } else {
    producerAddressLine1.errors?.forEach((error) => errors.push(error));
  }

  if (value.addressLine2 && value.addressLine2?.trim() !== '') {
    const producerAddressLine2: ValidationResult<
      ProducerDetail['address']['addressLine2']
    > = validateProducerAddressLine2(
      value.addressLine2.trim() as string,
      message,
    );

    if (producerAddressLine2.valid) {
      addressToReturn.addressLine2 = producerAddressLine2.value;
    } else {
      producerAddressLine2.errors?.forEach((error) => errors.push(error));
    }
  }

  const producerTownCity = validateProducerTownCity(value.townCity, message);
  if (producerTownCity.valid) {
    addressToReturn.townCity = producerTownCity.value;
  } else {
    producerTownCity.errors?.forEach((error) => errors.push(error));
  }

  if (value.postcode && value.postcode?.trim() !== '') {
    const producerPostcode: ValidationResult<
      ProducerDetail['address']['postcode']
    > = validateProducerPostcode(value.postcode.trim() as string, message);

    if (producerPostcode.valid) {
      addressToReturn.postcode = producerPostcode.value;
    } else {
      producerPostcode.errors?.forEach((error) => errors.push(error));
    }
  }

  const producerCountry = validateProducerCountry(value.country, message);
  if (producerCountry.valid) {
    addressToReturn.country = producerCountry.value;
  } else {
    producerCountry.errors?.forEach((error) => errors.push(error));
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

export function validatePartialProducerAddressDetails(
  value: Partial<ProducerDetail['address']>,
  message?: ErrorMessage,
): ValidationResult<Partial<ProducerDetail['address']>> {
  const errors: FieldFormatError[] = [];
  const fieldsToReturn: Partial<ProducerDetail['address']> = {};

  if (value.buildingNameOrNumber?.trim()) {
    const producerBuildingNameOrNumber: ValidationResult<
      ProducerDetail['address']['buildingNameOrNumber']
    > = validateProducerBuildingNameOrNumber(
      value.buildingNameOrNumber,
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
    > = validateProducerAddressLine1(value.addressLine1, message);
    if (producerAddressLine1.valid) {
      fieldsToReturn.addressLine1 = producerAddressLine1.value;
    } else {
      producerAddressLine1.errors?.forEach((error) => errors.push(error));
    }
  }

  if (value.addressLine2?.trim()) {
    const producerAddressLine2: ValidationResult<
      ProducerDetail['address']['addressLine2']
    > = validateProducerAddressLine2(value.addressLine2, message);
    if (producerAddressLine2.valid) {
      fieldsToReturn.addressLine2 = producerAddressLine2.value;
    } else {
      producerAddressLine2.errors?.forEach((error) => errors.push(error));
    }
  }

  if (value.townCity?.trim()) {
    const producerTownCity: ValidationResult<
      ProducerDetail['address']['townCity']
    > = validateProducerTownCity(value.townCity, message);
    if (producerTownCity.valid) {
      fieldsToReturn.townCity = producerTownCity.value;
    } else {
      producerTownCity.errors?.forEach((error) => errors.push(error));
    }
  }

  if (value.country?.trim()) {
    const producerCountry: ValidationResult<
      ProducerDetail['address']['country']
    > = validateProducerCountry(value.country, message);
    if (producerCountry.valid) {
      fieldsToReturn.country = producerCountry.value;
    } else {
      producerCountry.errors?.forEach((error) => errors.push(error));
    }
  }

  if (value.postcode?.trim()) {
    const producerPostcode: ValidationResult<
      ProducerDetail['address']['postcode']
    > = validateProducerPostcode(value.postcode, message);
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

  if (
    value.address.buildingNameOrNumber !== undefined &&
    value.address.buildingNameOrNumber?.trim() !== ''
  ) {
    const producerBuildingNameOrNumber: ValidationResult<
      ProducerDetail['address']['buildingNameOrNumber']
    > = validateProducerBuildingNameOrNumber(
      value.address.buildingNameOrNumber as string,
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

  const producerAddressLine1 = validateProducerAddressLine1(
    value.address.addressLine1,
    message,
  );
  if (producerAddressLine1.valid) {
    detailsToReturn.address.addressLine1 = producerAddressLine1.value;
  } else {
    producerAddressLine1.errors?.forEach((error) => errors.push(error));
  }

  if (
    value.address.addressLine2 !== null &&
    value.address.addressLine2?.trim() !== ''
  ) {
    const producerAddressLine2: ValidationResult<
      ProducerDetail['address']['addressLine2']
    > = validateProducerAddressLine2(
      value.address.addressLine2 as string,
      message,
    );

    if (producerAddressLine2.valid) {
      detailsToReturn.address.addressLine2 = producerAddressLine2.value;
    } else {
      producerAddressLine2.errors?.forEach((error) => errors.push(error));
    }
  }

  const producerTownCity = validateProducerTownCity(
    value.address.townCity,
    message,
  );
  if (producerTownCity.valid) {
    detailsToReturn.address.townCity = producerTownCity.value;
  } else {
    producerTownCity.errors?.forEach((error) => errors.push(error));
  }

  if (
    value.address.townCity !== null &&
    value.address.townCity?.trim() !== ''
  ) {
    const producerPostcode: ValidationResult<
      ProducerDetail['address']['postcode']
    > = validateProducerPostcode(value.address.postcode as string, message);

    if (producerPostcode.valid) {
      detailsToReturn.address.postcode = producerPostcode.value;
    } else {
      producerPostcode.errors?.forEach((error) => errors.push(error));
    }
  }

  const producerCountry = validateProducerCountry(
    value.address.country,
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

  if (value.contact.fax !== null && value.contact.fax?.trim() !== '') {
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
