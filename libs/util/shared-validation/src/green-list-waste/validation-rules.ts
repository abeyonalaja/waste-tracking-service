import { getErrorMessage } from './util';
import type { ErrorMessage, ValidationResult, FieldFormatError } from './dto';
import { CustomerReference, CustomerReferenceFlattened } from './model';
import { fieldErrorMessages } from './validation-error-messages';

export function validateCustomerReference(
  value: CustomerReference,
  message?: ErrorMessage,
): ValidationResult {
  const errorMessages = fieldErrorMessages;
  const trimmedReference = value.trim();

  if (!trimmedReference) {
    return {
      valid: false,
      errors: [
        {
          field: 'CustomerReference',
          message: message
            ? getErrorMessage(
                errorMessages,
                'reference',
                'invalid',
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

export function validateCustomerReferenceSection(
  value: CustomerReferenceFlattened,
  message?: ErrorMessage,
):
  | { valid: false; value: FieldFormatError }
  | { valid: true; value: CustomerReference } {
  const errorMessages = fieldErrorMessages;
  const trimmedReference = value.reference.trim();

  if (!trimmedReference) {
    return {
      valid: false,
      value: {
        field: 'CustomerReference',
        message: message
          ? getErrorMessage(
              errorMessages,
              'reference',
              'invalid',
              message.locale,
              message.context,
            )
          : undefined,
      },
    };
  }

  return { valid: true, value: trimmedReference };
}
