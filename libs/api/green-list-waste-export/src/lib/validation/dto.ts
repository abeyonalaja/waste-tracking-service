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

export type FieldFormatError = {
  field: Field;
  message: string;
};

export type InvalidAttributeCombinationError = {
  fields: Field[];
  message: string;
};

export type Value = Omit<
  Submission,
  'id' | 'submissionDeclaration' | 'submissionState'
>;

export type Error = {
  index: number;
  fieldFormatErrors: FieldFormatError[];
  invalidStructureErrors: InvalidAttributeCombinationError[];
};

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
