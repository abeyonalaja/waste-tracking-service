import * as constraints from './constraints';

const numeric = '0-9';
const alphabetic = 'a-zA-Z';
const alphaNumeric = `${alphabetic}${numeric}`;

export const ukExitLocationRegex = new RegExp(
  `^[${alphaNumeric}\\-.,']{${constraints.UkExitLocationChar.min},${constraints.UkExitLocationChar.max}}$`,
);
