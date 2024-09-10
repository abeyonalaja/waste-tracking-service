const numeric = '0-9';
const alphabetic = 'a-zA-Z';
const alphaNumeric = `${alphabetic}${numeric}`;

export const templateNameRegex = new RegExp(`^[${alphaNumeric}\\-._'/() ]+$`);
