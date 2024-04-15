import * as constraints from './constraints';

const numeric = '0-9';
const alphabetic = 'a-zA-Z';
const alphaNumeric = `a-zA-Z${numeric}`;

export const postcodeRegex = new RegExp(
  `^[${alphabetic}]{1,2}\\d{1,2}[${alphabetic}]?\\s?\\d[${alphabetic}]{2}$`
);

export const emailRegex = new RegExp(
  `^[${alphaNumeric}._%+-]+@[${alphaNumeric}.-]+\\.[${alphabetic}]{2,}$`
);

export const phoneRegex = new RegExp(
  '^((\\+ 44|\\+ \\(44|\\+\\(44|\\+44|0044|00 44|00-44|00\\(44|00 \\(44)[1-9 \\-()][( -\\d)]{6,18}[\\d]|[0][(1-9][( -\\d)]{8,18}[\\d])$'
);

export const referenceRegex = new RegExp(
  `^[${alphaNumeric}]{${constraints.ReferenceChar.min},${constraints.ReferenceChar.max}}$`
);

export const producerSicCodeRegex = new RegExp(
  `^[${numeric}]{${constraints.ProducerSicCodeChar.max}}$`
);
