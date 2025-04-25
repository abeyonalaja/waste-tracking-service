import { ukwm as ukwmValidation } from '@wts/util/shared-validation';

export interface FormErrors {
  [key: string]: {
    valid: false;
    accountId?: string;
    errors: ukwmValidation.FieldFormatError[];
    href?: string;
  };
}

export type ErrorSummaryErrors = {
  text: string;
  href: string;
}[];
