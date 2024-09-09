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

export interface Error {
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
      error: Error;
    };

export type uiValidationResult = ValidationResult<string | undefined> & {
  href?: string;
};
