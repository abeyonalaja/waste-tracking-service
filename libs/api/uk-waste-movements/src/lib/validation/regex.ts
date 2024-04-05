import { ReferenceChar, ProducerSicCodeChar } from './constraints';

const numeric = '0-9';
const alphaNumeric = `a-zA-Z${numeric}`;
const alphabetic = 'a-zA-Z';

export const referenceRegex = new RegExp(
  `^[${alphaNumeric}]{${ReferenceChar.min},${ReferenceChar.max}}$`
);

export const postcodeRegex = new RegExp(`^[${alphaNumeric} ]{1,9}$`);

export const emailRegex = new RegExp(
  `^[${alphaNumeric}._%+-]+@[${alphaNumeric}.-]+\\.[${alphabetic}]{2,}$`
);

export const producerSicCodeRegex = new RegExp(
  `^[${numeric}]{${ProducerSicCodeChar.max}}$`
);

export const phoneRegex = new RegExp(
  '^((\\+ 44|\\+ \\(44|\\+\\(44|\\+44|0044|00 44|00-44|00\\(44|00 \\(44)[1-9 \\-()][( -\\d)]{6,18}[\\d]|[0][(1-9][( -\\d)]{8,18}[\\d])$'
);
