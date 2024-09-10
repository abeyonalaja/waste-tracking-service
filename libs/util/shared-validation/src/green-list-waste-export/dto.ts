export type Section =
  | 'ExporterDetail'
  | 'ImporterDetail'
  | 'Carriers'
  | 'CollectionDetail'
  | 'RecoveryFacilityDetail';

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
  message: string;
}

export interface InvalidAttributeCombinationError {
  fields: Field[];
  message: string;
}

export interface Errors {
  fieldFormatErrors: FieldFormatError[];
  invalidStructureErrors?: InvalidAttributeCombinationError[];
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
      errors: Errors;
    };

export type uiValidationResult = ValidationResult<string | undefined> & {
  href?: string;
};
