import {
  ReferenceChar,
  NationalCodeChar,
  DecimalPlacesChar,
} from './constraints';

const numeric = '0-9';
const alphabetic = 'a-zA-Z';
const alphaNumeric = `${alphabetic}${numeric}`;

export const referenceRegex = new RegExp(
  `^[${alphaNumeric}]{${ReferenceChar.min},${ReferenceChar.max}}$`
);

export const nationalCodeRegex = new RegExp(
  `^[${alphaNumeric}\\\\\\- ]{${NationalCodeChar.min},${NationalCodeChar.max}}$`
);

export const wasteQuantityRegex = new RegExp(
  `^[${numeric}]*(\\.[${numeric}]{${DecimalPlacesChar.min},${DecimalPlacesChar.max}})?$`
);

export const postcodeRegex = new RegExp(
  `^[${alphabetic}]{1,2}\\d{1,2}[${alphabetic}]?\\s?\\d[${alphabetic}]{2}$`
);

export const emailRegex = new RegExp(
  `^[${alphaNumeric}._%+-]+@[${alphaNumeric}.-]+\\.[${alphabetic}]{2,}$`
);

export const phoneRegex = new RegExp(
  '^((\\+ 44|\\+ \\(44|\\+\\(44|\\+44|0044|00 44|00-44|00\\(44|00 \\(44)[1-9 \\-()][( -\\d)]{6,18}[\\d]|[0][(1-9][( -\\d)]{8,18}[\\d])$'
);

export const phoneInternationalRegex = new RegExp(
  '^((\\+[ (1-9]|00[ -(1-9])[ -\\d()]{6,18}[\\d]|[0][ -\\d()]{8,18}[\\d])$'
);

export const faxRegex = new RegExp(
  '^((\\+ 44|\\+ \\(44|\\+\\(44|\\+44|0044|00 44|00-44|00\\(44|00 \\(44)[1-9 \\-()][( -\\d)]{6,18}[\\d]|[0][(1-9][( -\\d)]{8,18}[\\d])$'
);

export const faxInternationalRegex = new RegExp(
  '^((\\+[ (1-9]|00[ -(1-9])[ -\\d()]{6,18}[\\d]|[0][ -\\d()]{8,18}[\\d])$'
);
