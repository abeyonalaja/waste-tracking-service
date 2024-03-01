import {
  ReferenceChar,
  NationalCodeChar,
  DecimalPlacesChar,
} from './constraints';

const numeric = '0-9';
const alphaNumeric = `a-zA-Z${numeric}`;

export const referenceRegex = new RegExp(
  `^[${alphaNumeric}]{${ReferenceChar.min},${ReferenceChar.max}}$`
);

export const nationalCodeRegex = new RegExp(
  `^[${alphaNumeric}\\\\\\- ]{${NationalCodeChar.min},${NationalCodeChar.max}}$`
);

export const wasteQuantityRegex = new RegExp(
  `^[${numeric}]*(\\.[${numeric}]{${DecimalPlacesChar.min},${DecimalPlacesChar.max}})?$`
);
