import { SimpleDraft } from '../draft.dto';

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
  | 'Persistant organic pollutants (POPs) Concentration Values'
  | 'Persistant organic pollutants (POPs) Concentration Units'
  | 'Chemical and biological components of the waste'
  | 'Chemical and biological concentration values'
  | 'Chemical and biological concentration units of measure'
  | 'Local authority'
  | 'Carrier organisation name'
  | 'Carrier address line 1'
  | 'Carrier address line 2'
  | 'Carrier town or city'
  | 'Carrier country'
  | 'Carrier postcode'
  | 'Carrier contact name'
  | 'Carrier contact email address'
  | 'Carrier contact phone number';

export type ErrorCodeData =
  | {
      type: 'message';
      message: string;
      field: Field;
    }
  | {
      type: 'builder';
      builder: (args: string[]) => string;
      field: Field;
    };

export interface FieldFormatError {
  field: Field;
  code: number;
  args?: string[];
}

export interface InvalidAttributeCombinationError {
  fields: Field[];
  code: number;
}

export type Value = Omit<SimpleDraft, 'id' | 'declaration' | 'state'>;

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
