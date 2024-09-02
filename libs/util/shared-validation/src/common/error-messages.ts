import { commonConstraints } from '.';

export const defaultErrorMessage = {
  en: 'Unknown Error',
  cy: 'Gwall Anhysbys',
};

export const emptyReference = {
  en: 'Enter a unique reference',
  cy: 'Rhowch gyfeirnod unigryw',
};

export const charTooManyReference = {
  en: `The unique reference must be ${commonConstraints.ReferenceChar.max} characters or less`,
  cy: `Rhaid i'r cyfeirnod unigryw fod yn ${commonConstraints.ReferenceChar.max} nod neu lai`,
};

export const invalidReference = {
  en: 'The unique reference can only contain letters, numbers, hyphens, slashes, underscores and spaces',
  cy: 'Dim ond llythrennau, rhifau, cysylltnodau, sleisys, tanlinellu a bylchau y gall y cyfeirnod unigryw eu cynnwys',
};

export const emptyOrganisationName = {
  en: 'Enter an organisation name',
  cy: `Rhowch enw'r sefydliad cynhyrchu`,
};

export const charTooManyOrganisationName = {
  en: `The organisation name can only be ${commonConstraints.FreeTextChar.max} characters or less`,
  cy: `Rhaid i enw'r sefydliad cynhyrchu fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
};

export const emptyContactFullName = {
  en: 'Enter an organisation contact person',
  cy: 'Rhowch enw person cyswllt y cynhyrchydd',
};

export const charTooManyContactFullName = {
  en: `The organisation contact person can only be ${commonConstraints.FreeTextChar.max} characters or less`,
  cy: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
};

export const emptyEmail = {
  en: 'Enter an email address',
  cy: 'Rhowch gyfeiriad e-bost',
};

export const charTooManyEmail = {
  en: `The organisation contact email can only be ${commonConstraints.FreeTextChar.max} characters or less`,
  cy: `Rhaid i gyfeiriad e-bost cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
};

export const invalidEmail = {
  en: 'Enter an email address in the correct format, like name@example.com',
  cy: 'Rhowch gyfeiriad e-bost yn y fformat cywir, fel name@example.com',
};

export const emptyPhone = {
  en: 'Enter a phone number',
  cy: 'Rhowch rif ffôn cyswllt y cynhyrchydd',
};

export const invalidPhone = {
  en: 'Enter a phone number only using numbers, spaces, dashes, pluses and brackets',
  cy: 'Rhowch rif ffôn gan ddefnyddio rhifau, bylchau, llinellau toriad, pwyntiau cadarnhaol a cromfachau yn unig',
};

export const invalidFax = {
  en: 'Enter a fax number only using numbers, spaces, dashes, pluses and brackets',
  cy: 'Rhowch rif ffacs gan ddefnyddio rhifau, bylchau, llinellau toriad, pwyntiau cadarnhaol a chromfachau yn unig',
};

export const emptyPostcode = {
  en: 'Enter a postcode',
  cy: 'Rhowch god post',
};

export const invalidPostcode = {
  en: 'Enter a valid postcode',
  cy: 'Rhowch god post',
};

export const emptyAddressSelection = {
  en: 'Select an address',
  cy: 'Dewiswch gyfeiriad',
};

export const emptyAddressLine1 = {
  en: 'Enter address line 1',
  cy: `Rhowch llinell gyfeiriad 1`,
};

export const charTooManyAddressLine1 = {
  en: `Address line 1 must be less than ${commonConstraints.FreeTextChar.max} characters`,
  cy: `Rhaid i'r llinell gyfeiriad 1 fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
};

export const charTooManyAddressLine2 = {
  en: `Address line 2 must be less than ${commonConstraints.FreeTextChar.max} characters`,
  cy: `Rhaid i'r llinell gyfeiriad 2 fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
};

export const emptyTownOrCity = {
  en: 'Enter a town or city',
  cy: 'Rhowch dref neu ddinas',
};

export const charTooManyTownOrCity = {
  en: `Town or city must be less than ${commonConstraints.FreeTextChar.max} characters`,
  cy: `Rhaid i dref neu ddinas y fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
};

export const emptyCountry = {
  en: 'Enter a country',
  cy: 'Rhowch wlad',
};

export const invalidCountry = {
  en: 'Country must only be England, Wales, Scotland, or Northern Ireland',
  cy: `Rhaid i'r wlad fod yn un o Loegr, Cymru, yr Alban, neu Gogledd Iwerddon`,
};

export const charTooManyBuildingNameOrNumber = {
  en: `Building name or number must be less than ${commonConstraints.FreeTextChar.max} characters`,
  cy: `Rhaid i enw'r adeilad neu rif fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
};

export const emptyCollectionDate = {
  en: {
    ui: 'Enter a real date',
    csv: 'Enter a real collection date',
    api: 'Enter a real collection date',
  },
  cy: {
    ui: 'Rhowch ddyddiad go iawn',
    csv: 'Rhowch ddyddiad casglu go iawn',
    api: 'Rhowch ddyddiad casglu go iawn',
  },
};

export const invalidCollectionDate = {
  en: {
    ui: 'Enter a date in the future',
    csv: 'Enter a collection date in the future',
    api: 'Enter a collection date in the future',
  },
  cy: {
    ui: 'Rhowch ddyddiad yn y dyfodol',
    csv: 'Nodwch ddyddiad casglu yn y dyfodol',
    api: 'Nodwch ddyddiad casglu yn y dyfodol',
  },
};
