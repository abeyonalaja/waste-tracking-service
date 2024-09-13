export type Locale = 'en' | 'cy';

export type Context = 'csv' | 'api' | 'ui';

export interface ErrorMessage {
  locale: Locale;
  context?: Context;
}

export type ValidationFailureReason =
  | 'empty'
  | 'invalid'
  | 'charTooMany'
  | 'charTooFew'
  | 'tooMany';

export type ValidationResult<T> =
  | {
      valid: true;
      value: T;
    }
  | {
      valid: false;
      errors: ValidationFailureReason[];
    };

export interface DateData {
  day: string;
  month: string;
  year: string;
}
