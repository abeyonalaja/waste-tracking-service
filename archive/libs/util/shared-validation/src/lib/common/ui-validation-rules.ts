import { ValidationResult } from '.';

export function validateAddressSelection(
  value?: string,
): ValidationResult<string> {
  if (!value) {
    return {
      valid: false,
      errors: ['empty'],
    };
  }

  return {
    valid: true,
    value: value,
  };
}
