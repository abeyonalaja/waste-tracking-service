import * as constraints from './constraints';

const numeric = '0-9';
const alphabetic = 'a-zA-Z';
const alphaNumeric = `a-zA-Z${numeric}`;

export const referenceRegex = new RegExp(
  `^[${alphaNumeric}\\-\\/\\\\_ ]{${constraints.ReferenceChar.min},${constraints.ReferenceChar.max}}$`,
);

export const postcodeRegex = new RegExp(
  `^[${alphabetic}]{1,2}\\d{1,2}[${alphabetic}]?\\s?\\d[${alphabetic}]{2}$`,
);
