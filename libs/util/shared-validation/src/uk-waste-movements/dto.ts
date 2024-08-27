export type Locale = 'en' | 'cy';

export type Context = 'csv' | 'api' | 'ui';

export type Section = 'Producer' | 'Waste collection' | 'Carrier' | 'Receiver';

export type Field =
  | 'Reference'
  | 'Producer organisation name'
  | 'Producer building name or number'
  | 'Producer address line 1'
  | 'Producer address line 2'
  | 'Producer town or city'
  | 'Producer country'
  | 'Producer postcode'
  | 'Producer contact name'
  | 'Producer contact email address'
  | 'Producer contact phone number'
  | 'Producer fax number'
  | 'Producer standard industrial classification (SIC) code'
  | 'Waste collection details waste source'
  | 'Waste collection building name or number'
  | 'Waste collection address line 1'
  | 'Waste collection address line 2'
  | 'Waste collection town or city'
  | 'Waste collection country'
  | 'Waste collection postcode'
  | 'Carrier building name or number'
  | 'Carrier address line 1'
  | 'Carrier address line 2'
  | 'Carrier town or city'
  | 'Carrier country'
  | 'Carrier postcode'
  | 'Receiver building name or number'
  | 'Receiver address line 1'
  | 'Receiver address line 2'
  | 'Receiver town or city'
  | 'Receiver country'
  | 'Receiver postcode'
  | 'Carrier postcode'
  | 'Receiver organisation name'
  | 'Receiver contact name'
  | 'Receiver contact email address'
  | 'Receiver contact phone number'
  | 'Receiver fax number';

export type UIField = 'Postcode' | 'AddressSelection';

export interface ErrorMessage {
  locale: Locale;
  context?: Context;
}

export interface FieldFormatError {
  field: Field | UIField;
  code: number;
  message?: string;
  args?: string[];
}

export type ValidationResult<T> =
  | {
      valid: true;
      accountId?: string;
      value: T;
    }
  | {
      valid: false;
      accountId?: string;
      errors: FieldFormatError[];
    };

export type uiValidationResult = ValidationResult<string | undefined> & {
  href?: string;
};

export interface ValidationErrorMessages {
  [code: number]: {
    [locale: string]: string | { csv: string; api: string; ui: string };
  };
}
