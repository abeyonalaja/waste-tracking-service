export type Locale = 'en' | 'cy';

export type Context = 'csv' | 'api' | 'ui';

export type Field =
  | 'CustomerReference'
  | 'WasteDescription'
  | 'WasteQuantity'
  | 'ExporterDetail'
  | 'ImporterDetail'
  | 'CollectionDate'
  | 'Carriers'
  | 'CollectionDetail'
  | 'UkExitLocation'
  | 'TransitCountries'
  | 'RecoveryFacilityDetail';

export interface FieldFormatError {
  field: Field;
  message?: string;
  args?: string[];
}

export interface ErrorMessage {
  locale: Locale;
  context?: Context;
}

export interface InvalidAttributeCombinationError {
  fields: Field[];
  message: string;
}

export interface Error {
  index: number;
  fieldFormatErrors: FieldFormatError[];
  invalidStructureErrors: InvalidAttributeCombinationError[];
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
  field: string;
  errors: {
    [name: string]: {
      [locale: string]: string | { csv: string; api: string; ui: string };
    };
  };
}
