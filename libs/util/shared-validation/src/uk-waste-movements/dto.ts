export type Locale = 'en' | 'cy';

export type Context = 'csv' | 'api' | 'ui';

export type Field =
  | 'Reference'
  | 'Producer organisation name'
  | 'Producer address line 1'
  | 'Producer address line 2'
  | 'Producer town or city'
  | 'Producer country'
  | 'Producer postcode'
  | 'Producer contact name'
  | 'Producer contact email address'
  | 'Producer contact phone number'
  | 'Producer Standard Industrial Classification (SIC) code';

export interface ErrorMessage {
  locale: Locale;
  context?: Context;
}

export interface FieldFormatError {
  field: Field;
  code: number;
  message?: string;
  args?: string[];
}

export type ValidationResult =
  | {
      valid: true;
      accountId?: string;
      value: string;
    }
  | {
      valid: false;
      accountId?: string;
      errors: FieldFormatError[];
    };

export interface ValidationErrorMessages {
  [code: number]: {
    [locale: string]: string | { csv: string; api: string; ui: string };
  };
}
