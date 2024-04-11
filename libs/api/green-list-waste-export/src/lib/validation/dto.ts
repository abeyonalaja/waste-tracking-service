import { Submission } from '../submission.dto';

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

export type Value = {
  reference: Submission['reference'];
  wasteDescription: Submission['wasteDescription'];
  wasteQuantity: Submission['wasteQuantity'];
  exporterDetail: Submission['exporterDetail'];
  importerDetail: Submission['importerDetail'];
  collectionDate: Submission['collectionDate'];
  carriers: Submission['carriers'];
  collectionDetail: Submission['collectionDetail'];
  ukExitLocation: Submission['ukExitLocation'];
  transitCountries: Submission['transitCountries'];
};

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
