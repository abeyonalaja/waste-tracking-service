import * as regex from './regex';
import * as constraints from './constraints';
import * as errorCodes from './error-codes';
import { getErrorMessage } from './util';
import type { ErrorMessage, ValidationResult, FieldFormatError } from './dto';
import { ProducerDetail, ProducerDetailFlattened } from './model';

export * from './validation-rules';

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
          field: 'Postcode',
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
      field: 'Postcode',
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

  if (producerOrganisationName.valid && producerReference.valid) {
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
          addressLine1: '',
          addressLine2: '',
          townCity: '',
          postcode: '',
          country: '',
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
