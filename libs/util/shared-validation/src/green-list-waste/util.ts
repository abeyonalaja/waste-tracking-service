import { ValidationErrorMessages } from './dto';

export function getErrorMessage(
  errorMessages: ValidationErrorMessages[],
  field: string,
  error: string,
  locale: string,
  context?: 'csv' | 'api' | 'ui',
): string {
  const message = errorMessages.filter(
    (errorObject) => errorObject.field === field,
  )[0].errors;

  const e = message[error][locale];

  if (typeof e === 'string') {
    return e;
  }

  if (context && e[context]) {
    return e[context];
  }

  return 'Error message not found';
}
