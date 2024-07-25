import { validationErrorMessages } from './validation-error-messages';

export function getErrorMessage(
  errorCode: number,
  locale: string,
  context?: 'csv' | 'api' | 'ui',
): string {
  const errorMessage = validationErrorMessages[errorCode]?.[locale];

  if (typeof errorMessage === 'string') {
    return errorMessage;
  }

  if (context && errorMessage[context]) {
    return errorMessage[context];
  }

  return 'Error message not found';
}
