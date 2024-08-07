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
      context: Context;
    },
  ) => uiValidationResult,
  href: string,
  locale: Locale = 'en',
  context: Context = 'ui',
): uiValidationResult {
  const validatedResult = validationRule(value, { locale, context });

  if (validatedResult.valid) {
    return validatedResult;
  } else {
    return {
      ...validatedResult,
      href: href,
    };
  }
}
