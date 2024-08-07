import * as codes from './error-codes';
import * as constraints from './constraints';
import { ValidationErrorMessages } from './dto';

export const validationErrorMessages: ValidationErrorMessages = {
  [codes.producerEmptyOrganisationName]: {
    en: {
      csv: 'Enter the producer organisation name',
      api: 'Enter the producer organisation name',
      ui: 'Enter the producer organisation name',
    },
    cy: {
      csv: 'Rhowch enw’r sefydliad cynhyrchu',
      api: 'Rhowch enw’r sefydliad cynhyrchu',
      ui: 'Rhowch enw’r sefydliad cynhyrchu',
    },
  },
  [codes.producerCharTooManyOrganisationName]: {
    en: {
      csv: `The producer organisation name must be less than ${constraints.FreeTextChar.max} characters`,
      api: `The producer organisation name must be less than ${constraints.FreeTextChar.max} characters`,
      ui: `The producer organisation name must be less than ${constraints.FreeTextChar.max} characters`,
    },
    cy: {
      csv: `Rhaid i enw’r sefydliad cynhyrchu fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i enw’r sefydliad cynhyrchu fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i enw’r sefydliad cynhyrchu fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.producerEmptyReference]: {
    en: {
      csv: 'Enter a unique reference',
      api: 'Enter a unique reference',
      ui: 'Enter a unique reference',
    },
    cy: {
      csv: 'Rhowch gyfeirnod unigryw',
      api: 'Rhowch gyfeirnod unigryw',
      ui: 'Rhowch gyfeirnod unigryw',
    },
  },
  [codes.producerCharTooManyReference]: {
    en: {
      csv: `The unique reference must be ${constraints.ReferenceChar.max} characters or less`,
      api: `The unique reference must be ${constraints.ReferenceChar.max} characters or less`,
      ui: `The unique reference must be ${constraints.ReferenceChar.max} characters or less`,
    },
    cy: {
      csv: `Rhaid i’r cyfeirnod unigryw fod yn ${constraints.ReferenceChar.max} nod neu lai`,
      api: `Rhaid i’r cyfeirnod unigryw fod yn ${constraints.ReferenceChar.max} nod neu lai`,
      ui: `Rhaid i’r cyfeirnod unigryw fod yn ${constraints.ReferenceChar.max} nod neu lai`,
    },
  },
  [codes.producerInvalidReference]: {
    en: {
      csv: 'The unique reference can only contain letters, numbers, hyphens, slashes, underscores and spaces',
      api: 'The unique reference can only contain letters, numbers, hyphens, slashes, underscores and spaces',
      ui: 'The unique reference can only contain letters, numbers, hyphens, slashes, underscores and spaces',
    },
    cy: {
      csv: 'Dim ond llythrennau, rhifau, cysylltnodau, sleisys, tanlinellu a bylchau y gall y cyfeirnod unigryw eu cynnwys',
      api: 'Dim ond llythrennau, rhifau, cysylltnodau, sleisys, tanlinellu a bylchau y gall y cyfeirnod unigryw eu cynnwys',
      ui: 'Dim ond llythrennau, rhifau, cysylltnodau, sleisys, tanlinellu a bylchau y gall y cyfeirnod unigryw eu cynnwys',
    },
  },
  [codes.producerEmptyContactFullName]: {
    en: {
      csv: `Enter the producer's contact person`,
      api: `Enter the producer's contact person`,
      ui: `Enter the producer's contact person`,
    },
    cy: {
      csv: 'Rhowch enw person cyswllt y cynhyrchydd',
      api: 'Rhowch enw person cyswllt y cynhyrchydd',
      ui: 'Rhowch enw person cyswllt y cynhyrchydd',
    },
  },
  [codes.producerCharTooManyContactFullName]: {
    en: {
      csv: `The producer's contact person must be less than ${constraints.FreeTextChar.max} characters`,
      api: `The producer's contact person must be less than ${constraints.FreeTextChar.max} characters`,
      ui: `The producer's contact person must be less than ${constraints.FreeTextChar.max} characters`,
    },
    cy: {
      csv: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.producerEmptyEmail]: {
    en: {
      csv: `The producer's contact person must be less than ${constraints.FreeTextChar.max} characters`,
      api: `The producer's contact person must be less than ${constraints.FreeTextChar.max} characters`,
      ui: `The producer's contact person must be less than ${constraints.FreeTextChar.max} characters`,
    },
    cy: {
      csv: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.producerCharTooManyEmail]: {
    en: {
      csv: `The producer's contact email address must be less than ${constraints.FreeTextChar.max} characters`,
      api: `The producer's contact email address must be less than ${constraints.FreeTextChar.max} characters`,
      ui: `The producer's contact email address must be less than ${constraints.FreeTextChar.max} characters`,
    },
    cy: {
      csv: `Rhaid i gyfeiriad e-bost cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i gyfeiriad e-bost cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i gyfeiriad e-bost cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.producerInvalidEmail]: {
    en: {
      csv: `Enter a real email address for the producer's contact`,
      api: `Enter a real email address for the producer's contact`,
      ui: `Enter a real email address for the producer's contact`,
    },
    cy: {
      csv: 'Rhowch gyfeiriad e-bost go iawn ar gyfer cyswllt y cynhyrchydd',
      api: 'Rhowch gyfeiriad e-bost go iawn ar gyfer cyswllt y cynhyrchydd',
      ui: 'Rhowch gyfeiriad e-bost go iawn ar gyfer cyswllt y cynhyrchydd',
    },
  },
  [codes.producerEmptyPhone]: {
    en: {
      csv: `Enter a producer's contact phone number`,
      api: `Enter a producer's contact phone number`,
      ui: `Enter a producer's contact phone number`,
    },
    cy: {
      csv: 'Rhowch rif ffôn cyswllt y cynhyrchydd',
      api: 'Rhowch rif ffôn cyswllt y cynhyrchydd',
      ui: 'Rhowch rif ffôn cyswllt y cynhyrchydd',
    },
  },
  [codes.producerInvalidPhone]: {
    en: {
      csv: `Enter a real phone number for the producer's contact`,
      api: `Enter a real phone number for the producer's contact`,
      ui: `Enter a real phone number for the producer's contact`,
    },
    cy: {
      csv: 'Rhowch rif ffôn go iawn ar gyfer cyswllt y cynhyrchydd',
      api: 'Rhowch rif ffôn go iawn ar gyfer cyswllt y cynhyrchydd',
      ui: 'Rhowch rif ffôn go iawn ar gyfer cyswllt y cynhyrchydd',
    },
  },
  [codes.producerInvalidFax]: {
    en: {
      csv: `Enter a real fax number for the producer's contact`,
      api: `Enter a real fax number for the producer's contact`,
      ui: `Enter a real fax number for the producer's contact`,
    },
    cy: {
      csv: 'Rhowch rif ffacs go iawn ar gyfer cyswllt y cynhyrchydd',
      api: 'Rhowch rif ffacs go iawn ar gyfer cyswllt y cynhyrchydd',
      ui: 'Rhowch rif ffacs go iawn ar gyfer cyswllt y cynhyrchydd',
    },
  },
  [codes.postcodeEmpty]: {
    en: {
      csv: 'Enter a postcode',
      api: 'Enter a postcode',
      ui: 'Enter a postcode',
    },
    cy: {
      csv: 'Rhowch god post',
      api: 'Rhowch god post',
      ui: 'Rhowch god post',
    },
  },
  [codes.postcodeInvalid]: {
    en: {
      csv: 'Enter a real postcode',
      api: 'Enter a real postcode',
      ui: 'Enter a real postcode',
    },
    cy: {
      csv: 'Rhowch god post go iawn',
      api: 'Rhowch god post go iawn',
      ui: 'Rhowch god post go iawn',
    },
  },
  [codes.producerEmptyAddressLine1]: {
    en: {
      csv: `Enter address line 1`,
      api: `Enter address line 1`,
      ui: `Enter address line 1`,
    },
    cy: {
      csv: `Rhowch llinell gyfeiriad 1`,
      api: `Rhowch llinell gyfeiriad 1`,
      ui: `Rhowch llinell gyfeiriad 1`,
    },
  },
  [codes.producerCharTooManyAddressLine1]: {
    en: {
      csv: `Address line 1 must be less than ${constraints.FreeTextChar.max} characters`,
      api: `Address line 1 must be less than ${constraints.FreeTextChar.max} characters`,
      ui: `Address line 1 must be less than ${constraints.FreeTextChar.max} characters`,
    },
    cy: {
      csv: `Rhaid i’r llinell gyfeiriad 1 fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i’r llinell gyfeiriad 1 fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i’r llinell gyfeiriad 1 fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.producerCharTooManyAddressLine2]: {
    en: {
      csv: `Address line 2 must be less than ${constraints.FreeTextChar.max} characters`,
      api: `Address line 2 must be less than ${constraints.FreeTextChar.max} characters`,
      ui: `Address line 2 must be less than ${constraints.FreeTextChar.max} characters`,
    },
    cy: {
      csv: `Rhaid i’r llinell gyfeiriad 2 fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i’r llinell gyfeiriad 2 fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i’r llinell gyfeiriad 2 fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.producerEmptyTownOrCity]: {
    en: {
      csv: `Enter a town or city`,
      api: `Enter a town or city`,
      ui: `Enter a town or city`,
    },
    cy: {
      csv: `Rhowch dref neu ddinas`,
      api: `Rhowch dref neu ddinas`,
      ui: `Rhowch dref neu ddinas`,
    },
  },
  [codes.producerCharTooManyTownOrCity]: {
    en: {
      csv: `Town or city must be less than ${constraints.FreeTextChar.max} characters`,
      api: `Town or city must be less than ${constraints.FreeTextChar.max} characters`,
      ui: `Town or city must be less than ${constraints.FreeTextChar.max} characters`,
    },
    cy: {
      csv: `Rhaid i dref neu ddinas y fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i dref neu ddinas y fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i dref neu ddinas y fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.producerEmptyCountry]: {
    en: {
      csv: `Enter a country`,
      api: `Enter a country`,
      ui: `Enter a country`,
    },
    cy: {
      csv: `Rhowch wlad`,
      api: `Rhowch wlad`,
      ui: `Rhowch wlad`,
    },
  },
  [codes.producerInvalidPostcode]: {
    en: {
      csv: `Enter a real postcode`,
      api: `Enter a real postcode`,
      ui: `Enter a real postcode`,
    },
    cy: {
      csv: `Rhowch god post go iawn`,
      api: `Rhowch god post go iawn`,
      ui: `Rhowch god post go iawn`,
    },
  },

  [codes.producerInvalidCountry]: {
    en: {
      csv: `Country must only be England, Wales, Scotland, or Northern Ireland`,
      api: `Country must only be England, Wales, Scotland, or Northern Ireland`,
      ui: `Country must only be England, Wales, Scotland, or Northern Ireland`,
    },
    cy: {
      csv: `Rhaid i’r wlad fod yn un o Loegr, Cymru, yr Alban, neu Gogledd Iwerddon`,
      api: `Rhaid i’r wlad fod yn un o Loegr, Cymru, yr Alban, neu Gogledd Iwerddon`,
      ui: `Rhaid i’r wlad fod yn un o Loegr, Cymru, yr Alban, neu Gogledd Iwerddon`,
    },
  },
  [codes.producerCharTooManyBuildingNameOrNumber]: {
    en: {
      csv: `Building name or number must be less than ${constraints.FreeTextChar.max} characters`,
      api: `Building name or number must be less than ${constraints.FreeTextChar.max} characters`,
      ui: `Building name or number must be less than ${constraints.FreeTextChar.max} characters`,
    },
    cy: {
      csv: `Rhaid i enw’r adeilad neu rif fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i enw’r adeilad neu rif fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i enw’r adeilad neu rif fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
};
