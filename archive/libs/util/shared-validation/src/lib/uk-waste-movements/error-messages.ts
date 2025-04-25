import * as codes from './error-codes';
import * as constraints from './constraints';
import { ValidationErrorMessages } from './dto';
import { commonErrorMessages, commonConstraints } from '../common';

export const errorMessages: ValidationErrorMessages = {
  [codes.defaultErrorCode]: {
    en: {
      csv: commonErrorMessages.defaultErrorMessage.en,
      api: commonErrorMessages.defaultErrorMessage.en,
      ui: commonErrorMessages.defaultErrorMessage.en,
    },
    cy: {
      csv: commonErrorMessages.defaultErrorMessage.cy,
      api: commonErrorMessages.defaultErrorMessage.cy,
      ui: commonErrorMessages.defaultErrorMessage.cy,
    },
  },
  [codes.producerEmptyReference]: {
    en: {
      csv: commonErrorMessages.emptyReference.en.csv,
      api: commonErrorMessages.emptyReference.en.api,
      ui: commonErrorMessages.emptyReference.en.ui,
    },
    cy: {
      csv: commonErrorMessages.emptyReference.cy.csv,
      api: commonErrorMessages.emptyReference.cy.api,
      ui: commonErrorMessages.emptyReference.cy.ui,
    },
  },
  [codes.producerCharTooManyReference]: {
    en: {
      csv: commonErrorMessages.charTooManyReference.en.csv,
      api: commonErrorMessages.charTooManyReference.en.api,
      ui: commonErrorMessages.charTooManyReference.en.ui,
    },
    cy: {
      csv: commonErrorMessages.charTooManyReference.cy.csv,
      api: commonErrorMessages.charTooManyReference.cy.api,
      ui: commonErrorMessages.charTooManyReference.cy.ui,
    },
  },
  [codes.producerInvalidReference]: {
    en: {
      csv: commonErrorMessages.invalidReference.en.csv,
      api: commonErrorMessages.invalidReference.en.api,
      ui: commonErrorMessages.invalidReference.en.ui,
    },
    cy: {
      csv: commonErrorMessages.invalidReference.cy.csv,
      api: commonErrorMessages.invalidReference.cy.api,
      ui: commonErrorMessages.invalidReference.cy.ui,
    },
  },
  [codes.producerEmptyOrganisationName]: {
    en: {
      csv: commonErrorMessages.emptyOrganisationName.en,
      api: commonErrorMessages.emptyOrganisationName.en,
      ui: commonErrorMessages.emptyOrganisationName.en,
    },
    cy: {
      csv: commonErrorMessages.emptyOrganisationName.cy,
      api: commonErrorMessages.emptyOrganisationName.cy,
      ui: commonErrorMessages.emptyOrganisationName.cy,
    },
  },
  [codes.producerCharTooManyOrganisationName]: {
    en: {
      csv: commonErrorMessages.charTooManyOrganisationName.en,
      api: commonErrorMessages.charTooManyOrganisationName.en,
      ui: commonErrorMessages.charTooManyOrganisationName.en,
    },
    cy: {
      csv: commonErrorMessages.charTooManyOrganisationName.cy,
      api: commonErrorMessages.charTooManyOrganisationName.cy,
      ui: commonErrorMessages.charTooManyOrganisationName.cy,
    },
  },
  [codes.producerEmptyContactFullName]: {
    en: {
      csv: commonErrorMessages.emptyContactFullName.en,
      api: commonErrorMessages.emptyContactFullName.en,
      ui: commonErrorMessages.emptyContactFullName.en,
    },
    cy: {
      csv: commonErrorMessages.emptyContactFullName.cy,
      api: commonErrorMessages.emptyContactFullName.cy,
      ui: commonErrorMessages.emptyContactFullName.cy,
    },
  },
  [codes.producerCharTooManyContactFullName]: {
    en: {
      csv: commonErrorMessages.charTooManyContactFullName.en,
      api: commonErrorMessages.charTooManyContactFullName.en,
      ui: commonErrorMessages.charTooManyContactFullName.en,
    },
    cy: {
      csv: commonErrorMessages.charTooManyContactFullName.cy,
      api: commonErrorMessages.charTooManyContactFullName.cy,
      ui: commonErrorMessages.charTooManyContactFullName.cy,
    },
  },
  [codes.producerEmptyEmail]: {
    en: {
      csv: commonErrorMessages.emptyEmail.en,
      api: commonErrorMessages.emptyEmail.en,
      ui: commonErrorMessages.emptyEmail.en,
    },
    cy: {
      csv: commonErrorMessages.emptyEmail.cy,
      api: commonErrorMessages.emptyEmail.cy,
      ui: commonErrorMessages.emptyEmail.cy,
    },
  },
  [codes.producerCharTooManyEmail]: {
    en: {
      csv: commonErrorMessages.charTooManyEmail.en,
      api: commonErrorMessages.charTooManyEmail.en,
      ui: commonErrorMessages.charTooManyEmail.en,
    },
    cy: {
      csv: commonErrorMessages.charTooManyEmail.cy,
      api: commonErrorMessages.charTooManyEmail.cy,
      ui: commonErrorMessages.charTooManyEmail.cy,
    },
  },
  [codes.producerInvalidEmail]: {
    en: {
      csv: commonErrorMessages.invalidEmail.en,
      api: commonErrorMessages.invalidEmail.en,
      ui: commonErrorMessages.invalidEmail.en,
    },
    cy: {
      csv: commonErrorMessages.invalidEmail.cy,
      api: commonErrorMessages.invalidEmail.cy,
      ui: commonErrorMessages.invalidEmail.cy,
    },
  },
  [codes.producerEmptyPhone]: {
    en: {
      csv: commonErrorMessages.emptyPhone.en,
      api: commonErrorMessages.emptyPhone.en,
      ui: commonErrorMessages.emptyPhone.en,
    },
    cy: {
      csv: commonErrorMessages.emptyPhone.cy,
      api: commonErrorMessages.emptyPhone.cy,
      ui: commonErrorMessages.emptyPhone.cy,
    },
  },
  [codes.producerInvalidPhone]: {
    en: {
      csv: commonErrorMessages.invalidPhone.en,
      api: commonErrorMessages.invalidPhone.en,
      ui: commonErrorMessages.invalidPhone.en,
    },
    cy: {
      csv: commonErrorMessages.invalidPhone.cy,
      api: commonErrorMessages.invalidPhone.cy,
      ui: commonErrorMessages.invalidPhone.cy,
    },
  },
  [codes.producerInvalidFax]: {
    en: {
      csv: commonErrorMessages.invalidFax.en,
      api: commonErrorMessages.invalidFax.en,
      ui: commonErrorMessages.invalidFax.en,
    },
    cy: {
      csv: commonErrorMessages.invalidFax.cy,
      api: commonErrorMessages.invalidFax.cy,
      ui: commonErrorMessages.invalidFax.cy,
    },
  },
  [codes.postcodeEmpty]: {
    en: {
      csv: commonErrorMessages.emptyPostcode.en,
      api: commonErrorMessages.emptyPostcode.en,
      ui: commonErrorMessages.emptyPostcode.en,
    },
    cy: {
      csv: commonErrorMessages.emptyPostcode.cy,
      api: commonErrorMessages.emptyPostcode.cy,
      ui: commonErrorMessages.emptyPostcode.cy,
    },
  },
  [codes.emptyPostcodeBase]: {
    en: {
      csv: commonErrorMessages.emptyPostcode.en,
      api: commonErrorMessages.emptyPostcode.en,
      ui: commonErrorMessages.emptyPostcode.en,
    },
    cy: {
      csv: commonErrorMessages.emptyPostcode.cy,
      api: commonErrorMessages.emptyPostcode.cy,
      ui: commonErrorMessages.emptyPostcode.cy,
    },
  },
  [codes.postcodeInvalid]: {
    en: {
      csv: commonErrorMessages.invalidPostcode.en,
      api: commonErrorMessages.invalidPostcode.en,
      ui: commonErrorMessages.invalidPostcode.en,
    },
    cy: {
      csv: commonErrorMessages.invalidPostcode.cy,
      api: commonErrorMessages.invalidPostcode.cy,
      ui: commonErrorMessages.invalidPostcode.cy,
    },
  },
  [codes.addressSelectionEmpty]: {
    en: {
      csv: commonErrorMessages.emptyAddressSelection.en,
      api: commonErrorMessages.emptyAddressSelection.en,
      ui: commonErrorMessages.emptyAddressSelection.en,
    },
    cy: {
      csv: commonErrorMessages.emptyAddressSelection.cy,
      api: commonErrorMessages.emptyAddressSelection.cy,
      ui: commonErrorMessages.emptyAddressSelection.cy,
    },
  },
  [codes.emptyAddressLine1Base]: {
    en: {
      csv: commonErrorMessages.emptyAddressLine1.en,
      api: commonErrorMessages.emptyAddressLine1.en,
      ui: commonErrorMessages.emptyAddressLine1.en,
    },
    cy: {
      csv: commonErrorMessages.emptyAddressLine1.cy,
      api: commonErrorMessages.emptyAddressLine1.cy,
      ui: commonErrorMessages.emptyAddressLine1.cy,
    },
  },
  [codes.charTooManyAddressLine1Base]: {
    en: {
      csv: commonErrorMessages.charTooManyAddressLine1.en,
      api: commonErrorMessages.charTooManyAddressLine1.en,
      ui: commonErrorMessages.charTooManyAddressLine1.en,
    },
    cy: {
      csv: commonErrorMessages.charTooManyAddressLine1.cy,
      api: commonErrorMessages.charTooManyAddressLine1.cy,
      ui: commonErrorMessages.charTooManyAddressLine1.cy,
    },
  },
  [codes.charTooManyAddressLine2Base]: {
    en: {
      csv: commonErrorMessages.charTooManyAddressLine2.en,
      api: commonErrorMessages.charTooManyAddressLine2.en,
      ui: commonErrorMessages.charTooManyAddressLine2.en,
    },
    cy: {
      csv: commonErrorMessages.charTooManyAddressLine2.cy,
      api: commonErrorMessages.charTooManyAddressLine2.cy,
      ui: commonErrorMessages.charTooManyAddressLine2.cy,
    },
  },
  [codes.emptyTownOrCityBase]: {
    en: {
      csv: commonErrorMessages.emptyTownOrCity.en,
      api: commonErrorMessages.emptyTownOrCity.en,
      ui: commonErrorMessages.emptyTownOrCity.en,
    },
    cy: {
      csv: commonErrorMessages.emptyTownOrCity.cy,
      api: commonErrorMessages.emptyTownOrCity.cy,
      ui: commonErrorMessages.emptyTownOrCity.cy,
    },
  },
  [codes.charTooManyTownOrCityBase]: {
    en: {
      csv: commonErrorMessages.charTooManyTownOrCity.en,
      api: commonErrorMessages.charTooManyTownOrCity.en,
      ui: commonErrorMessages.charTooManyTownOrCity.en,
    },
    cy: {
      csv: commonErrorMessages.emptyTownOrCity.cy,
      api: commonErrorMessages.emptyTownOrCity.cy,
      ui: commonErrorMessages.emptyTownOrCity.cy,
    },
  },
  [codes.emptyCountryBase]: {
    en: {
      csv: commonErrorMessages.emptyCountry.en,
      api: commonErrorMessages.emptyCountry.en,
      ui: 'Select a country',
    },
    cy: {
      csv: commonErrorMessages.emptyCountry.cy,
      api: commonErrorMessages.emptyCountry.cy,
      ui: 'Dewiswch wlad',
    },
  },
  [codes.invalidCountryBase]: {
    en: {
      csv: commonErrorMessages.invalidCountry.en,
      api: commonErrorMessages.invalidCountry.en,
      ui: commonErrorMessages.invalidCountry.en,
    },
    cy: {
      csv: commonErrorMessages.invalidCountry.cy,
      api: commonErrorMessages.invalidCountry.cy,
      ui: commonErrorMessages.invalidCountry.cy,
    },
  },
  [codes.invalidPostcodeBase]: {
    en: {
      csv: commonErrorMessages.invalidPostcode.en,
      api: commonErrorMessages.invalidPostcode.en,
      ui: commonErrorMessages.invalidPostcode.en,
    },
    cy: {
      csv: commonErrorMessages.invalidPostcode.cy,
      api: commonErrorMessages.invalidPostcode.cy,
      ui: commonErrorMessages.invalidPostcode.cy,
    },
  },
  [codes.charTooManyBuildingNameOrNumberBase]: {
    en: {
      csv: commonErrorMessages.charTooManyBuildingNameOrNumber.en,
      api: commonErrorMessages.charTooManyBuildingNameOrNumber.en,
      ui: commonErrorMessages.charTooManyBuildingNameOrNumber.en,
    },
    cy: {
      csv: commonErrorMessages.charTooManyBuildingNameOrNumber.cy,
      api: commonErrorMessages.charTooManyBuildingNameOrNumber.cy,
      ui: commonErrorMessages.charTooManyBuildingNameOrNumber.cy,
    },
  },
  [codes.producerInvalidSicCode]: {
    en: {
      csv: 'Enter producer SIC code in the correct format',
      api: 'Enter producer SIC code in the correct format',
      ui: 'Enter producer SIC code in the correct format',
    },
    cy: {
      csv: 'Rhowch god SIC y cynhyrchydd yn y fformat cywir',
      api: 'Rhowch god SIC y cynhyrchydd yn y fformat cywir',
      ui: 'Rhowch god SIC y cynhyrchydd yn y fformat cywir',
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
      csv: 'You have already entered this code',
      api: 'You have already entered this code',
      ui: 'You have already entered this code',
    },
    cy: {
      csv: `Rydych eisoes wedi nodi'r cod hwn`,
      api: `Rydych eisoes wedi nodi'r cod hwn`,
      ui: `Rydych eisoes wedi nodi'r cod hwn`,
    },
  },
  [codes.producerEmptySicCode]: {
    en: {
      csv: 'Enter a code',
      api: 'Enter a code',
      ui: 'Enter a code',
    },
    cy: {
      csv: 'Rhowch god i mewn',
      api: 'Rhowch god i mewn',
      ui: 'Rhowch god i mewn',
    },
  },
  [codes.wasteCollectionMissingWasteSource]: {
    en: {
      csv: 'Enter a waste source',
      api: 'Enter a waste source',
      ui: 'Enter a waste source',
    },
    cy: {
      csv: 'Rhowch ffynhonnell gwastraff',
      api: 'Rhowch ffynhonnell gwastraff',
      ui: 'Rhowch ffynhonnell gwastraff',
    },
  },
  [codes.wasteCollectionInvalidWasteSource]: {
    en: {
      csv: 'The waste source must only be Commercial, Industrial, Construction and demolition or Household',
      api: 'The waste source must only be Commercial, Industrial, Construction and demolition or Household',
      ui: 'The waste source must only be Commercial, Industrial, Construction and demolition or Household',
    },
    cy: {
      csv: `Rhaid i'r ffynhonnell gwastraff fod yn Unigol, Diwydiannol, Adeiladu a dymchwel neu Aelwydydd yn unig`,
      api: `Rhaid i'r ffynhonnell gwastraff fod yn Unigol, Diwydiannol, Adeiladu a dymchwel neu Aelwydydd yn unig`,
      ui: `Rhaid i'r ffynhonnell gwastraff fod yn Unigol, Diwydiannol, Adeiladu a dymchwel neu Aelwydydd yn unig`,
    },
  },
  [codes.receiverEmptyOrganisationName]: {
    en: {
      csv: 'Enter an organisation name',
      api: 'Enter an organisation name',
      ui: 'Enter an organisation name',
    },
    cy: {
      csv: `Rhowch enw'r sefydliad cynhyrchu`,
      api: `Rhowch enw'r sefydliad cynhyrchu`,
      ui: `Rhowch enw'r sefydliad cynhyrchu`,
    },
  },
  [codes.receiverCharTooManyOrganisationName]: {
    en: {
      csv: `The organisation name can only be ${commonConstraints.FreeTextChar.max} characters or less`,
      api: `The organisation name can only be ${commonConstraints.FreeTextChar.max} characters or less`,
      ui: `The organisation name can only be ${commonConstraints.FreeTextChar.max} characters or less`,
    },
    cy: {
      csv: `Rhaid i enw'r sefydliad cynhyrchu fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i enw'r sefydliad cynhyrchu fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i enw'r sefydliad cynhyrchu fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
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
      csv: `The organisation contact person can only be ${commonConstraints.FreeTextChar.max} characters or less`,
      api: `The organisation contact person can only be ${commonConstraints.FreeTextChar.max} characters or less`,
      ui: `The organisation contact person can only be ${commonConstraints.FreeTextChar.max} characters or less`,
    },
    cy: {
      csv: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.receiverEmptyEmail]: {
    en: {
      csv: `Enter an email address`,
      api: `Enter an email addresss`,
      ui: `Enter an email address`,
    },
    cy: {
      csv: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.receiverCharTooManyEmail]: {
    en: {
      csv: `The organisation contact email can only be ${commonConstraints.FreeTextChar.max} characters or less`,
      api: `The organisation contact email can only be ${commonConstraints.FreeTextChar.max} characters or less`,
      ui: `The organisation contact email can only be ${commonConstraints.FreeTextChar.max} characters or less`,
    },
    cy: {
      csv: `Rhaid i gyfeiriad e-bost cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i gyfeiriad e-bost cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i gyfeiriad e-bost cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
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
      csv: `Rhowch enw'r sefydliad cynhyrchu`,
      api: `Rhowch enw'r sefydliad cynhyrchu`,
      ui: `Rhowch enw'r sefydliad cynhyrchu`,
    },
  },
  [codes.charTooManyOrganisationNameBase]: {
    en: {
      csv: `The organisation name can only be ${commonConstraints.FreeTextChar.max} characters or less`,
      api: `The organisation name can only be ${commonConstraints.FreeTextChar.max} characters or less`,
      ui: `The organisation name can only be ${commonConstraints.FreeTextChar.max} characters or less`,
    },
    cy: {
      csv: `Rhaid i enw'r sefydliad cynhyrchu fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i enw'r sefydliad cynhyrchu fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i enw'r sefydliad cynhyrchu fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
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
      csv: `The organisation contact person can only be ${commonConstraints.FreeTextChar.max} characters or less`,
      api: `The organisation contact person can only be ${commonConstraints.FreeTextChar.max} characters or less`,
      ui: `The organisation contact person can only be ${commonConstraints.FreeTextChar.max} characters or less`,
    },
    cy: {
      csv: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.emptyEmailBase]: {
    en: {
      csv: `Enter an email address`,
      api: `Enter an email addresss`,
      ui: `Enter an email address`,
    },
    cy: {
      csv: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i enw person cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
    },
  },
  [codes.charTooManyEmailBase]: {
    en: {
      csv: `The organisation contact email can only be ${commonConstraints.FreeTextChar.max} characters or less`,
      api: `The organisation contact email can only be ${commonConstraints.FreeTextChar.max} characters or less`,
      ui: `The organisation contact email can only be ${commonConstraints.FreeTextChar.max} characters or less`,
    },
    cy: {
      csv: `Rhaid i gyfeiriad e-bost cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
      api: `Rhaid i gyfeiriad e-bost cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
      ui: `Rhaid i gyfeiriad e-bost cyswllt y cynhyrchydd fod yn llai na ${commonConstraints.FreeTextChar.max} o gymeriadau`,
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
