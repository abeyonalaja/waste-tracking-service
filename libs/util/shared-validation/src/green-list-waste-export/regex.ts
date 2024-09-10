import { NationalCodeChar, UkExitLocationChar } from './constraints';
import { commonRegex, commonConstraints } from '../common';

export const nationalCodeRegex = new RegExp(
  `^[${commonRegex.alphaNumeric}\\\\\\- ]{${NationalCodeChar.min},${NationalCodeChar.max}}$`,
);

export const phoneInternationalRegex = new RegExp(
  '^((\\+[ (1-9]|00[ -(1-9])[ -\\d()]{6,18}[\\d]|[0][ -\\d()]{8,18}[\\d])$',
);

export const faxInternationalRegex = phoneInternationalRegex;

export const ukExitLocationRegex = new RegExp(
  `^[${commonRegex.alphaNumeric}\\-.,']{${UkExitLocationChar.min},${UkExitLocationChar.max}}$`,
);

export const wasteQuantityRegex = new RegExp(
  `^[${commonRegex.numeric}]*(\\.[${commonRegex.numeric}]{${commonConstraints.DecimalPlacesChar.min},${commonConstraints.DecimalPlacesChar.max}})?$`,
);
