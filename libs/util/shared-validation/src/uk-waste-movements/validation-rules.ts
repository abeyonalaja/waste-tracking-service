import * as regex from './regex';
import * as constraints from './constraints';
import * as errorCodes from './error-codes';
import { getErrorMessage } from './util';
import type { ErrorMessage, ValidationResult, FieldFormatError } from './dto';
import { ProducerDetail, ProducerDetailFlattened } from './model';

export * from './validation-rules';

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

  let producerBuildingNameOrNumber: ValidationResult<
    ProducerDetail['address']['buildingNameOrNumber']
  > = {
    valid: false,
    errors: [],
  };

  if (value.buildingNameOrNumber?.trim()) {
    producerBuildingNameOrNumber = validateProducerBuildingNameOrNumber(
      value.buildingNameOrNumber,
      message,
    );
  }

  const producerAddressLine1 = validateProducerAddressLine1(
    value.addressLine1,
    message,
  );

  let producerAddressLine2: ValidationResult<
    ProducerDetail['address']['addressLine2']
  > = {
    valid: false,
    errors: [],
  };

  if (value.addressLine2?.trim()) {
    producerAddressLine2 = validateProducerAddressLine2(
      value.addressLine2,
      message,
    );
  }

  const producerTownCity = validateProducerTownCity(value.townCity, message);

  let producerPostcode: ValidationResult<
    ProducerDetail['address']['postcode']
  > = {
    valid: false,
    errors: [],
  };

  if (value.postcode?.trim()) {
    producerPostcode = validateProducerPostcode(value.postcode, message);
  }

  const producerCountry = validateProducerCountry(value.country, message);

  if (
    producerBuildingNameOrNumber.valid &&
    producerAddressLine1.valid &&
    producerAddressLine2.valid &&
    producerTownCity.valid &&
    producerPostcode.valid &&
    producerCountry.valid
  ) {
    return {
      valid: true,
      value: {
        buildingNameOrNumber: producerBuildingNameOrNumber.value,
        addressLine1: producerAddressLine1.value,
        addressLine2: producerAddressLine2.value,
        townCity: producerTownCity.value,
        postcode: producerPostcode.value,
        country: producerCountry.value,
      },
    };
  }

  return {
    valid: false,
    errors: errors,
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
  value: ProducerDetailFlattened,
  message?: ErrorMessage,
):
  | { valid: false; value: FieldFormatError[] }
  | { valid: true; value: ProducerDetail } {
  const errors: FieldFormatError[] = [];

  const producerOrganisationName = validateProducerOrganisationName(
    value.producerOrganisationName,
    message,
  );
  const producerReference = validateProducerReference(
    value.customerReference,
    message,
  );

  let producerBuildingNameOrNumber:
    | { valid: false; errors: FieldFormatError[] }
    | {
        valid: true;
        value: ProducerDetail['address']['buildingNameOrNumber'];
      } = {
    valid: false,
    errors: [],
  };

  if (value.producerBuildingNameOrNumber?.trim()) {
    producerBuildingNameOrNumber = validateProducerBuildingNameOrNumber(
      value.producerBuildingNameOrNumber,
      message,
    );
  }

  const producerAddressLine1 = validateProducerAddressLine1(
    value.producerAddressLine1,
    message,
  );

  let producerAddressLine2:
    | { valid: false; errors: FieldFormatError[] }
    | { valid: true; value: ProducerDetail['address']['addressLine2'] } = {
    valid: false,
    errors: [],
  };

  if (value.producerAddressLine2?.trim()) {
    producerAddressLine2 = validateProducerAddressLine2(
      value.producerAddressLine1,
      message,
    );
  }

  const producerTownCity = validateProducerTownCity(
    value.producerTownCity,
    message,
  );

  let producerPostcode:
    | { valid: false; errors: FieldFormatError[] }
    | { valid: true; value: ProducerDetail['address']['postcode'] } = {
    valid: false,
    errors: [],
  };

  if (value.producerPostcode?.trim()) {
    producerPostcode = validateProducerPostcode(value.producerCountry, message);
  }

  const producerCountry = validateProducerCountry(
    value.producerCountry,
    message,
  );

  if (
    producerOrganisationName.valid &&
    producerReference.valid &&
    producerBuildingNameOrNumber.valid &&
    producerAddressLine1.valid &&
    producerAddressLine2.valid &&
    producerTownCity.valid &&
    producerPostcode.valid &&
    producerCountry.valid
  ) {
    return {
      valid: true,
      value: {
        reference: producerReference.value,
        sicCode: '',
        contact: {
          organisationName: producerOrganisationName.value,
          name: '',
          email: '',
          phone: '',
        },
        address: {
          buildingNameOrNumber: producerBuildingNameOrNumber.value,
          addressLine1: producerAddressLine1.value,
          addressLine2: producerAddressLine2.value,
          townCity: producerTownCity.value,
          postcode: producerPostcode.value,
          country: producerCountry.value,
        },
      },
    };
  }

  if (!producerOrganisationName.valid) {
    producerOrganisationName.errors?.forEach((error) => errors.push(error));
  }

  if (!producerReference.valid) {
    producerReference.errors?.forEach((error) => errors.push(error));
  }

  return {
    valid: false,
    value: errors,
  };
}
