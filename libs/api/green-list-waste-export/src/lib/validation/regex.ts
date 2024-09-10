import { ReferenceChar, DecimalPlacesChar } from './constraints';

const numeric = '0-9';
const alphabetic = 'a-zA-Z';
const alphaNumeric = `${alphabetic}${numeric}`;

export const referenceRegex = new RegExp(
  `^[${alphaNumeric}]{${ReferenceChar.min},${ReferenceChar.max}}$`,
);

export const wasteQuantityRegex = new RegExp(
  `^[${numeric}]*(\\.[${numeric}]{${DecimalPlacesChar.min},${DecimalPlacesChar.max}})?$`,
);

export const templateNameRegex = new RegExp(`^[${alphaNumeric}\\-._'/() ]+$`);
