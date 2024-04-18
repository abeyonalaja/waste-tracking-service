import { Submission } from '../submission.dto';

export type Field =
  | 'WasteCollectionDetails'
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
  | 'Producer Standard Industrial Classification (SIC) code'
  | 'Receiver authorization type'
  | 'Receiver environmental permit number'
  | 'Receiver organisation name'
  | 'Receiver address line 1'
  | 'Receiver address line 2'
  | 'Receiver town or city'
  | 'Receiver postcode'
  | 'Receiver country'
  | 'Receiver contact name'
  | 'Receiver contact phone number'
  | 'Receiver contact email address'
  | 'Number and type of transportation containers'
  | 'Special handling requirements details';

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
  receiver: Submission['receiver'];
  wasteTransportationDetails: Submission['wasteTransportationDetails'];
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
