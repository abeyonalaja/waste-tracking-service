import { Submission } from '../submission.dto';

export type Field =
  | 'WasteCollectionDetails'
  | 'Receiver'
  | 'WasteTransportation'
  | 'WasteTypeDetails'
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

export type FieldFormatError = {
  field: Field;
  message: string;
};

export type InvalidAttributeCombinationError = {
  fields: Field[];
  message: string;
};

export type Value = {
  producer: Submission['producer'];
  wasteTypeDetails: Submission['wasteTypeDetails'];
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
