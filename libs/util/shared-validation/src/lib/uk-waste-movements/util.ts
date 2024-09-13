import { errorMessages } from './error-messages';
import { Section, uiValidationResult } from './dto';
import { errorCodes } from '.';
import { Locale, Context } from '../common';

export function getErrorMessage(
  errorCode: number,
  locale: string,
  context?: 'csv' | 'api' | 'ui',
): string {
  const errorMessage = errorMessages[errorCode]?.[locale];

  if (typeof errorMessage === 'string') {
    return errorMessage;
  }

  if (context && errorMessage[context]) {
    return errorMessage[context];
  }

  return 'Error message not found';
}

export function uiSharedValidation<T>(
  value: T,
  validationRule: (
    value: T,
    section: Section,
    options: {
      locale: Locale;
      context: Context;
    },
  ) => uiValidationResult,
  href: string,
  section: Section,
  locale: Locale = 'en',
  context: Context = 'ui',
): uiValidationResult {
  const validatedResult = validationRule(value, section, { locale, context });

  if (validatedResult.valid) {
    return validatedResult;
  } else {
    return {
      ...validatedResult,
      href: href,
    };
  }
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

export function getSharedErrorCode(
  errorCode: number,
  context?: Section,
): number {
  if (!context) {
    return errorCode;
  } else if (context == 'Producer') {
    return errorCode + errorCodes.producerBase;
  } else if (context == 'Waste collection') {
    return errorCode + errorCodes.wasteCollectionBase;
  } else if (context == 'Carrier') {
    return errorCode + errorCodes.carrierBase;
  } else if (context == 'Receiver') {
    return errorCode + errorCodes.receiverBase;
  } else {
    return errorCodes.defaultErrorCode;
  }
}
