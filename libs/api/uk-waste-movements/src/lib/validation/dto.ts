import { Submission } from '../submission.dto';

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
  | 'Special handling requirements details'
  | 'Waste Collection Details Address Line 1'
  | 'Waste Collection Details Address Line 2'
  | 'Waste Collection Details Town or City'
  | 'Waste Collection Details Country'
  | 'Waste Collection Details Postcode'
  | 'Waste Collection Details Waste Source'
  | 'Waste Collection Details Broker Registration Number'
  | 'Waste Collection Details Carrier Registration Number'
  | 'Waste Collection Details Mode of Waste Transport'
  | 'Waste Collection Details Expected Waste Collection Date'
  | 'EWC Code'
  | 'Waste Description'
  | 'Physical Form'
  | 'Waste Quantity'
  | 'Waste Quantity Units'
  | 'Quantity of waste (actual or estimate)'
  | 'Waste Has Hazardous Properties'
  | 'Hazardous Waste Codes'
  | 'Waste Contains POPs'
  | 'Persistant organic pollutants (POPs)'
  | 'Persistant organic pollutants (POPs) Concentrations'
  | 'Persistant organic pollutants (POPs) Concentration Units'
  | 'Chemical and biological components of the waste'
  | 'Chemical and biological concentration values'
  | 'Chemical and biological concentration units of measure';

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
  'id' | 'submissionConfirmation' | 'transactionId' | 'submissionState'
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
