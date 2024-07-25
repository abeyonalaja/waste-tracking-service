import * as constraints from './constraints';

const numeric = '0-9';
const alphaNumeric = `a-zA-Z${numeric}`;

export const referenceRegex = new RegExp(
  `^[${alphaNumeric}]{${constraints.ReferenceChar.min},${constraints.ReferenceChar.max}}$`,
);
