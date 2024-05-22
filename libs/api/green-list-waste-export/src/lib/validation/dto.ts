import { Submission } from '../submission/dto';

type Field =
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

export type Value = Omit<
  Submission,
  'id' | 'submissionDeclaration' | 'submissionState'
>;

export interface Error {
  index: number;
  fieldFormatErrors: FieldFormatError[];
  invalidStructureErrors: InvalidAttributeCombinationError[];
}

export type ValidationResult =
  | {
      valid: true;
      accountId: string;
      values: Value[];
    }
  | {
      valid: false;
      accountId: string;
      values: Error[];
    };
