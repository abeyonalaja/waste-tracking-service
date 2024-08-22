import * as codes from './error-codes';
import * as constraints from './constraints';
import { ValidationErrorMessages } from './dto';

export const validationErrorMessages: ValidationErrorMessages = {
  [codes.defaultErrorCode]: {
    en: {
      csv: 'Unknown Error',
      api: 'Unknown Error',
      ui: 'Unknown Error',
    },
    cy: {
      csv: 'Gwall Anhysbys',
      api: 'Gwall Anhysbys',
      ui: 'Gwall Anhysbys',
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
  [codes.producerEmptyOrganisationName]: {
    en: {
      csv: 'Enter an organisation name',
      api: 'Enter an organisation name',
      ui: 'Enter an organisation name',
    },
    cy: {
      csv: 'Rhowch enw’r sefydliad cynhyrchu',
      api: 'Rhowch enw’r sefydliad cynhyrchu',
      ui: 'Rhowch enw’r sefydliad cynhyrchu',
    },
  },
  [codes.producerCharTooManyOrganisationName]: {
    en: {
      csv: `The organisation name can only be ${constraints.FreeTextChar.max} characters or less`,
      api: `The organisation name can only be ${constraints.FreeTextChar.max} characters or less`,
      ui: `The organisation name can only be ${constraints.FreeTextChar.max} characters or less`,
    },
    cy: {
      csv: `Rhaid i enw’r sefydliad cynhyrchu fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i enw’r sefydliad cynhyrchu fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i enw’r sefydliad cynhyrchu fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.producerEmptyContactFullName]: {
    en: {
      csv: `Enter an organisation contact person`,
      api: `Enter an organisation contact person`,
      ui: `Enter an organisation contact person`,
    },
    cy: {
      csv: 'Rhowch enw person cyswllt y cynhyrchydd',
      api: 'Rhowch enw person cyswllt y cynhyrchydd',
      ui: 'Rhowch enw person cyswllt y cynhyrchydd',
    },
  },
  [codes.producerCharTooManyContactFullName]: {
    en: {
      csv: `The organisation contact person can only be ${constraints.FreeTextChar.max} characters or less`,
      api: `The organisation contact person can only be ${constraints.FreeTextChar.max} characters or less`,
      ui: `The organisation contact person can only be ${constraints.FreeTextChar.max} characters or less`,
    },
    cy: {
      csv: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.producerEmptyEmail]: {
    en: {
      csv: `Enter an email address`,
      api: `Enter an email addresss`,
      ui: `Enter an email address`,
    },
    cy: {
      csv: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.producerCharTooManyEmail]: {
    en: {
      csv: `The organisation contact email can only be ${constraints.FreeTextChar.max} characters or less`,
      api: `The organisation contact email can only be ${constraints.FreeTextChar.max} characters or less`,
      ui: `The organisation contact email can only be ${constraints.FreeTextChar.max} characters or less`,
    },
    cy: {
      csv: `Rhaid i gyfeiriad e-bost cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i gyfeiriad e-bost cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i gyfeiriad e-bost cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.producerInvalidEmail]: {
    en: {
      csv: `Enter an email address in the correct format, like name@example.com`,
      api: `Enter an email address in the correct format, like name@example.com`,
      ui: `Enter an email address in the correct format, like name@example.com`,
    },
    cy: {
      csv: 'Rhowch gyfeiriad e-bost go iawn ar gyfer cyswllt y cynhyrchydd',
      api: 'Rhowch gyfeiriad e-bost go iawn ar gyfer cyswllt y cynhyrchydd',
      ui: 'Rhowch gyfeiriad e-bost go iawn ar gyfer cyswllt y cynhyrchydd',
    },
  },
  [codes.producerEmptyPhone]: {
    en: {
      csv: `Enter a phone number`,
      api: `Enter a phone number`,
      ui: `Enter a phone number`,
    },
    cy: {
      csv: 'Rhowch rif ffôn cyswllt y cynhyrchydd',
      api: 'Rhowch rif ffôn cyswllt y cynhyrchydd',
      ui: 'Rhowch rif ffôn cyswllt y cynhyrchydd',
    },
  },
  [codes.producerInvalidPhone]: {
    en: {
      csv: `Enter a phone number only using numbers, spaces, dashes, pluses and brackets`,
      api: `Enter a phone number only using numbers, spaces, dashes, pluses and brackets`,
      ui: `Enter a phone number only using numbers, spaces, dashes, pluses and brackets`,
    },
    cy: {
      csv: 'Rhowch rif ffôn go iawn ar gyfer cyswllt y cynhyrchydd',
      api: 'Rhowch rif ffôn go iawn ar gyfer cyswllt y cynhyrchydd',
      ui: 'Rhowch rif ffôn go iawn ar gyfer cyswllt y cynhyrchydd',
    },
  },
  [codes.producerInvalidFax]: {
    en: {
      csv: `Enter a fax number only using numbers, spaces, dashes, pluses and brackets`,
      api: `Enter a fax number only using numbers, spaces, dashes, pluses and brackets`,
      ui: `Enter a fax number only using numbers, spaces, dashes, pluses and brackets`,
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
      csv: 'Enter a postcode',
      api: 'Enter a postcode',
      ui: 'Enter a postcode',
    },
    cy: {
      csv: 'Rhowch god post dilys',
      api: 'Rhowch god post dilys',
      ui: 'Rhowch god post dilys',
    },
  },
  [codes.addressSelectionEmpty]: {
    en: {
      csv: 'Select an address',
      api: 'Select an address',
      ui: 'Select an address',
    },
    cy: {
      csv: 'Dewiswch gyfeiriad',
      api: 'Dewiswch gyfeiriad',
      ui: 'Dewiswch gyfeiriad',
    },
  },
  [codes.emptyAddressLine1Base]: {
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
  [codes.charTooManyAddressLine1Base]: {
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
  [codes.charTooManyAddressLine2Base]: {
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
  [codes.emptyTownOrCityBase]: {
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
  [codes.charTooManyTownOrCityBase]: {
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
  [codes.emptyCountryBase]: {
    en: {
      csv: `Enter a country`,
      api: `Enter a country`,
      ui: `Select a country`,
    },
    cy: {
      csv: `Rhowch wlad`,
      api: `Rhowch wlad`,
      ui: `Rhowch wlad`,
    },
  },
  [codes.invalidPostcodeBase]: {
    en: {
      csv: `Enter a postcode`,
      api: `Enter a postcode`,
      ui: `Enter a postcode`,
    },
    cy: {
      csv: `Rhowch god post`,
      api: `Rhowch god post`,
      ui: `Rhowch god post`,
    },
  },
  [codes.charTooManyBuildingNameOrNumberBase]: {
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
  [codes.invalidCountryBase]: {
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

  [codes.producerInvalidSicCode]: {
    en: {
      csv: `Enter producer SIC code in the correct format`,
      api: `Enter producer SIC code in the correct format`,
      ui: `Enter producer SIC code in the correct format`,
    },
    cy: {
      csv: `Rhowch god SIC y cynhyrchydd yn y fformat cywir`,
      api: `Rhowch god SIC y cynhyrchydd yn y fformat cywir`,
      ui: `Rhowch god SIC y cynhyrchydd yn y fformat cywir`,
    },
  },

  [codes.producerTooManySicCodes]: {
    en: {
      csv: `You can only enter a maximum of ${constraints.SICCodesLength.max} SIC codes`,
      api: `You can only enter a maximum of ${constraints.SICCodesLength.max} SIC codes`,
      ui: `You can only enter a maximum of ${constraints.SICCodesLength.max} SIC codes`,
    },
    cy: {
      csv: `Dim ond uchafswm o ${constraints.SICCodesLength.max} cod SIC y gallwch eu nodi`,
      api: `Dim ond uchafswm o ${constraints.SICCodesLength.max} cod SIC y gallwch eu nodi`,
      ui: `Dim ond uchafswm o ${constraints.SICCodesLength.max} cod SIC y gallwch eu nodi`,
    },
  },

  [codes.producerDuplicateSicCode]: {
    en: {
      csv: `You have already entered this code`,
      api: `You have already entered this code`,
      ui: `You have already entered this code`,
    },
    cy: {
      csv: `Rydych eisoes wedi nodi’r cod hwn`,
      api: `Rydych eisoes wedi nodi’r cod hwn`,
      ui: `Rydych eisoes wedi nodi’r cod hwn`,
    },
  },

  [codes.producerEmptySicCode]: {
    en: {
      csv: `Enter a code`,
      api: `Enter a code`,
      ui: `Enter a code`,
    },
    cy: {
      csv: `Rhowch god i mewn`,
      api: `Rhowch god i mewn`,
      ui: `Rhowch god i mewn`,
    },
  },

  [codes.wasteCollectionMissingWasteSource]: {
    en: {
      csv: `Enter a waste source`,
      api: `Enter a waste source`,
      ui: `Enter a waste source`,
    },
    cy: {
      csv: `Rhowch ffynhonnell gwastraff`,
      api: `Rhowch ffynhonnell gwastraff`,
      ui: `Rhowch ffynhonnell gwastraff`,
    },
  },
  [codes.wasteCollectionInvalidWasteSource]: {
    en: {
      csv: `The waste source must only be Commercial,Industrial,Construction and demolition or Household`,
      api: `The waste source must only be Commercial,Industrial,Construction and demolition or Household`,
      ui: `The waste source must only be Commercial,Industrial,Construction and demolition or Household`,
    },
    cy: {
      csv: `Rhaid i’r ffynhonnell gwastraff fod yn Unigol, Diwydiannol, Adeiladu a dymchwel neu Aelwydydd yn unig`,
      api: `Rhaid i’r ffynhonnell gwastraff fod yn Unigol, Diwydiannol, Adeiladu a dymchwel neu Aelwydydd yn unig`,
      ui: `Rhaid i’r ffynhonnell gwastraff fod yn Unigol, Diwydiannol, Adeiladu a dymchwel neu Aelwydydd yn unig`,
    },
  },
  [codes.receiverEmptyOrganisationName]: {
    en: {
      csv: 'Enter an organisation name',
      api: 'Enter an organisation name',
      ui: 'Enter an organisation name',
    },
    cy: {
      csv: 'Rhowch enw’r sefydliad cynhyrchu',
      api: 'Rhowch enw’r sefydliad cynhyrchu',
      ui: 'Rhowch enw’r sefydliad cynhyrchu',
    },
  },
  [codes.receiverCharTooManyOrganisationName]: {
    en: {
      csv: `The organisation name can only be ${constraints.FreeTextChar.max} characters or less`,
      api: `The organisation name can only be ${constraints.FreeTextChar.max} characters or less`,
      ui: `The organisation name can only be ${constraints.FreeTextChar.max} characters or less`,
    },
    cy: {
      csv: `Rhaid i enw’r sefydliad cynhyrchu fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i enw’r sefydliad cynhyrchu fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i enw’r sefydliad cynhyrchu fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.receiverEmptyContactFullName]: {
    en: {
      csv: `Enter an organisation contact person`,
      api: `Enter an organisation contact person`,
      ui: `Enter an organisation contact person`,
    },
    cy: {
      csv: 'Rhowch enw person cyswllt y cynhyrchydd',
      api: 'Rhowch enw person cyswllt y cynhyrchydd',
      ui: 'Rhowch enw person cyswllt y cynhyrchydd',
    },
  },
  [codes.receiverCharTooManyContactFullName]: {
    en: {
      csv: `The organisation contact person can only be ${constraints.FreeTextChar.max} characters or less`,
      api: `The organisation contact person can only be ${constraints.FreeTextChar.max} characters or less`,
      ui: `The organisation contact person can only be ${constraints.FreeTextChar.max} characters or less`,
    },
    cy: {
      csv: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.receiverEmptyEmail]: {
    en: {
      csv: `Enter an email address`,
      api: `Enter an email addresss`,
      ui: `Enter an email address`,
    },
    cy: {
      csv: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.receiverCharTooManyEmail]: {
    en: {
      csv: `The organisation contact email can only be ${constraints.FreeTextChar.max} characters or less`,
      api: `The organisation contact email can only be ${constraints.FreeTextChar.max} characters or less`,
      ui: `The organisation contact email can only be ${constraints.FreeTextChar.max} characters or less`,
    },
    cy: {
      csv: `Rhaid i gyfeiriad e-bost cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i gyfeiriad e-bost cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i gyfeiriad e-bost cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.receiverInvalidEmail]: {
    en: {
      csv: `Enter an email address in the correct format, like name@example.com`,
      api: `Enter an email address in the correct format, like name@example.com`,
      ui: `Enter an email address in the correct format, like name@example.com`,
    },
    cy: {
      csv: 'Rhowch gyfeiriad e-bost go iawn ar gyfer cyswllt y cynhyrchydd',
      api: 'Rhowch gyfeiriad e-bost go iawn ar gyfer cyswllt y cynhyrchydd',
      ui: 'Rhowch gyfeiriad e-bost go iawn ar gyfer cyswllt y cynhyrchydd',
    },
  },
  [codes.receiverEmptyPhone]: {
    en: {
      csv: `Enter a phone number`,
      api: `Enter a phone number`,
      ui: `Enter a phone number`,
    },
    cy: {
      csv: 'Rhowch rif ffôn cyswllt y cynhyrchydd',
      api: 'Rhowch rif ffôn cyswllt y cynhyrchydd',
      ui: 'Rhowch rif ffôn cyswllt y cynhyrchydd',
    },
  },
  [codes.receiverInvalidPhone]: {
    en: {
      csv: `Enter a phone number only using numbers, spaces, dashes, pluses and brackets`,
      api: `Enter a phone number only using numbers, spaces, dashes, pluses and brackets`,
      ui: `Enter a phone number only using numbers, spaces, dashes, pluses and brackets`,
    },
    cy: {
      csv: 'Rhowch rif ffôn go iawn ar gyfer cyswllt y cynhyrchydd',
      api: 'Rhowch rif ffôn go iawn ar gyfer cyswllt y cynhyrchydd',
      ui: 'Rhowch rif ffôn go iawn ar gyfer cyswllt y cynhyrchydd',
    },
  },
  [codes.receiverInvalidFax]: {
    en: {
      csv: `Enter a fax number only using numbers, spaces, dashes, pluses and brackets`,
      api: `Enter a fax number only using numbers, spaces, dashes, pluses and brackets`,
      ui: `Enter a fax number only using numbers, spaces, dashes, pluses and brackets`,
    },
    cy: {
      csv: 'Rhowch rif ffacs go iawn ar gyfer cyswllt y cynhyrchydd',
      api: 'Rhowch rif ffacs go iawn ar gyfer cyswllt y cynhyrchydd',
      ui: 'Rhowch rif ffacs go iawn ar gyfer cyswllt y cynhyrchydd',
    },
  },
  [codes.emptyOrganisationNameBase]: {
    en: {
      csv: 'Enter an organisation name',
      api: 'Enter an organisation name',
      ui: 'Enter an organisation name',
    },
    cy: {
      csv: 'Rhowch enw’r sefydliad cynhyrchu',
      api: 'Rhowch enw’r sefydliad cynhyrchu',
      ui: 'Rhowch enw’r sefydliad cynhyrchu',
    },
  },
  [codes.charTooManyOrganisationNameBase]: {
    en: {
      csv: `The organisation name can only be ${constraints.FreeTextChar.max} characters or less`,
      api: `The organisation name can only be ${constraints.FreeTextChar.max} characters or less`,
      ui: `The organisation name can only be ${constraints.FreeTextChar.max} characters or less`,
    },
    cy: {
      csv: `Rhaid i enw’r sefydliad cynhyrchu fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i enw’r sefydliad cynhyrchu fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i enw’r sefydliad cynhyrchu fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.emptyContactFullNameBase]: {
    en: {
      csv: `Enter an organisation contact person`,
      api: `Enter an organisation contact person`,
      ui: `Enter an organisation contact person`,
    },
    cy: {
      csv: 'Rhowch enw person cyswllt y cynhyrchydd',
      api: 'Rhowch enw person cyswllt y cynhyrchydd',
      ui: 'Rhowch enw person cyswllt y cynhyrchydd',
    },
  },
  [codes.charTooManyContactFullNameBase]: {
    en: {
      csv: `The organisation contact person can only be ${constraints.FreeTextChar.max} characters or less`,
      api: `The organisation contact person can only be ${constraints.FreeTextChar.max} characters or less`,
      ui: `The organisation contact person can only be ${constraints.FreeTextChar.max} characters or less`,
    },
    cy: {
      csv: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.emptyEmailBase]: {
    en: {
      csv: `Enter an email address`,
      api: `Enter an email addresss`,
      ui: `Enter an email address`,
    },
    cy: {
      csv: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.charTooManyEmailBase]: {
    en: {
      csv: `The organisation contact email can only be ${constraints.FreeTextChar.max} characters or less`,
      api: `The organisation contact email can only be ${constraints.FreeTextChar.max} characters or less`,
      ui: `The organisation contact email can only be ${constraints.FreeTextChar.max} characters or less`,
    },
    cy: {
      csv: `Rhaid i gyfeiriad e-bost cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i gyfeiriad e-bost cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i gyfeiriad e-bost cyswllt y cynhyrchydd fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.invalidEmailBase]: {
    en: {
      csv: `Enter an email address in the correct format, like name@example.com`,
      api: `Enter an email address in the correct format, like name@example.com`,
      ui: `Enter an email address in the correct format, like name@example.com`,
    },
    cy: {
      csv: 'Rhowch gyfeiriad e-bost go iawn ar gyfer cyswllt y cynhyrchydd',
      api: 'Rhowch gyfeiriad e-bost go iawn ar gyfer cyswllt y cynhyrchydd',
      ui: 'Rhowch gyfeiriad e-bost go iawn ar gyfer cyswllt y cynhyrchydd',
    },
  },
  [codes.emptyPhoneBase]: {
    en: {
      csv: `Enter a phone number`,
      api: `Enter a phone number`,
      ui: `Enter a phone number`,
    },
    cy: {
      csv: 'Rhowch rif ffôn cyswllt y cynhyrchydd',
      api: 'Rhowch rif ffôn cyswllt y cynhyrchydd',
      ui: 'Rhowch rif ffôn cyswllt y cynhyrchydd',
    },
  },
  [codes.invalidPhoneBase]: {
    en: {
      csv: `Enter a phone number only using numbers, spaces, dashes, pluses and brackets`,
      api: `Enter a phone number only using numbers, spaces, dashes, pluses and brackets`,
      ui: `Enter a phone number only using numbers, spaces, dashes, pluses and brackets`,
    },
    cy: {
      csv: 'Rhowch rif ffôn go iawn ar gyfer cyswllt y cynhyrchydd',
      api: 'Rhowch rif ffôn go iawn ar gyfer cyswllt y cynhyrchydd',
      ui: 'Rhowch rif ffôn go iawn ar gyfer cyswllt y cynhyrchydd',
    },
  },
  [codes.invalidFaxBase]: {
    en: {
      csv: `Enter a fax number only using numbers, spaces, dashes, pluses and brackets`,
      api: `Enter a fax number only using numbers, spaces, dashes, pluses and brackets`,
      ui: `Enter a fax number only using numbers, spaces, dashes, pluses and brackets`,
    },
    cy: {
      csv: 'Rhowch rif ffacs go iawn ar gyfer cyswllt y cynhyrchydd',
      api: 'Rhowch rif ffacs go iawn ar gyfer cyswllt y cynhyrchydd',
      ui: 'Rhowch rif ffacs go iawn ar gyfer cyswllt y cynhyrchydd',
    },
  },
};
