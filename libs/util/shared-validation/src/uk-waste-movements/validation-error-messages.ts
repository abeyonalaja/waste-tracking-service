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
    en: `Producer organisation name must be less than ${constraints.FreeTextChar.max} characters`,
    cy: `Rhaid i enw’r sefydliad cynhyrchu fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
  },
  [codes.producerEmptyReference]: {
    en: 'Enter a unique reference',
    cy: 'Rhowch gyfeirnod unigryw',
  },
  [codes.producerCharTooManyReference]: {
    en: `The unique reference must be ${constraints.ReferenceChar.max} characters or less`,
    cy: `Rhaid i’r cyfeirnod unigryw fod yn llai na ${constraints.ReferenceChar.max} o gymeriadau`,
  },
  [codes.producerInvalidReference]: {
    en: 'The unique reference can only contain letters, numbers, hyphens, slashes, underscores and spaces',
    cy: "Rhaid i'r cyfeirnod gynnwys llythrennau a i z yn unig, a rhifau",
  },
  [codes.postcodeEmpty]: {
    en: 'Enter a postcode',
    cy: 'Rhowch god post',
  },
  [codes.postcodeInvalid]: {
    en: 'Enter a real postcode',
    cy: 'Rhowch god post go iawn',
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
