import { validationErrorMessages } from './validation-error-messages';
import { Locale, Context, uiValidationResult } from './dto';

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

export function uiValidation<T>(
  value: T,
  validationRule: (
    value: T,
    options: {
      locale: Locale;
      context?: Context;
    },
  ) => uiValidationResult,
  href: string,
  locale: Locale,
  context?: Context,
): uiValidationResult {
  let validatedResult;
  if (context) {
    validatedResult = validationRule(value, { locale, context });
  } else {
    validatedResult = validationRule(value, { locale });
  }

  if (validatedResult.valid) {
    return validatedResult;
  } else {
    return {
      ...validatedResult,
      href: href,
    };
  }
}
