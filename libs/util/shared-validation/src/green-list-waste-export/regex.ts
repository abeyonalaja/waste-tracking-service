import { NationalCodeChar, UkExitLocationChar } from './constraints';
import { commonRegex } from '../common';

export const nationalCodeRegex = new RegExp(
  `^[${commonRegex.alphaNumeric}\\\\\\- ]{${NationalCodeChar.min},${NationalCodeChar.max}}$`,
);

export const ukExitLocationRegex = new RegExp(
  `^[${commonRegex.alphaNumeric}\\-.,']{${UkExitLocationChar.min},${UkExitLocationChar.max}}$`,
);
