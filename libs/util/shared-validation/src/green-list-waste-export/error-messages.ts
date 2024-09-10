import { commonErrorMessages, Context, Locale } from '../common';
import { FreeTextChar } from '../common/constraints';
import {
  CarrierTransportDescriptionChar,
  EWCCodesLength,
  UkExitLocationChar,
  WasteDescriptionChar,
  BulkWasteQuantityValue,
  SmallWasteQuantityValue,
} from './constraints';
import { Section } from './dto';

export const missingTypeCollectionDate = {
  en: {
    ui: "Enter if this is an 'estimate' or 'actual' collection date",
    csv: "Enter if this is an 'estimate' or 'actual' collection date",
    api: "Enter if this is an 'estimate' or 'actual' collection date",
  },
  cy: {
    ui: "Nodwch os yw hwn yn ddyddiad casglu 'amcangyfrif' neu 'gwirioneddol'",
    csv: "Nodwch os yw hwn yn ddyddiad casglu 'amcangyfrif' neu 'gwirioneddol'",
    api: "Nodwch os yw hwn yn ddyddiad casglu 'amcangyfrif' neu 'gwirioneddol'",
  },
};

export const invalidUnlistedWasteType = {
  en: {
    csv: "Enter 'yes' if you are sending unlisted waste to a laboratory",
  },
  cy: {
    csv: "Nodwch 'ydw' os ydych yn anfon gwastraff heb ei restru i labordy",
  },
};

export const emptyWasteCodeType = {
  en: {
    csv: 'Enter a waste code',
  },
  cy: {
    csv: 'Rhowch god gwastraff',
  },
};

export const tooManyWasteCodeType = {
  en: {
    csv: 'You can only enter one Basel Annex IX, OECD, Annex IIIA, or Annex IIB code',
  },
  cy: {
    csv: 'Dim ond un cod Basel Atodiad IX, OECD, Atodiad IIIA neu Atodiad IIB y gallwch ei nodi',
  },
};

export const laboratoryType = {
  en: {
    csv: 'Do not enter a waste code if the waste is going to a laboratory',
  },
  cy: {
    csv: "Peidiwch â nodi cod gwastraff os yw'r gwastraff yn mynd i labordy",
  },
};

export const invalidWasteCode = {
  BaselAnnexIX: {
    en: {
      ui: 'Enter a Basel Annex IX waste code',
      csv: 'Enter Basel Annex IX code in correct format',
      api: 'Enter Basel Annex IX code in correct format',
    },
    cy: {
      ui: 'Rhowch god gwastraff Atodiad IX Basel',
      csv: 'Rhowch god Atodiad IX Basel yn y fformat cywir',
      api: 'Rhowch god Atodiad IX Basel yn y fformat cywir',
    },
  },
  OECD: {
    en: {
      ui: 'Enter an OECD waste code',
      csv: 'Enter OECD code in correct format',
      api: 'Enter OECD code in correct format',
    },
    cy: {
      ui: 'Rhowch god gwastraff yr OECD',
      csv: 'Rhowch god OECD yn y fformat cywir',
      api: 'Rhowch god OECD yn y fformat cywir',
    },
  },
  AnnexIIIA: {
    en: {
      ui: 'Enter an Annex IIIA waste code',
      csv: 'Enter Annex IIIA code in correct format',
      api: 'Enter Annex IIIA code in correct format',
    },
    cy: {
      ui: 'Rhowch god gwastraff Atodiad IIIA',
      csv: 'Rhowch god Atodiad IIIA yn y fformat cywir',
      api: 'Rhowch god Atodiad IIIA yn y fformat cywir',
    },
  },
  AnnexIIIB: {
    en: {
      ui: 'Enter an Annex IIIB waste code',
      csv: 'Enter Annex IIIB code in correct format',
      api: 'Enter Annex IIIB code in correct format',
    },
    cy: {
      ui: 'Rhowch god gwastraff Atodiad IIIB',
      csv: 'Rhowch god Atodiad IIIB yn y fformat cywir',
      api: 'Rhowch god Atodiad IIIB yn y fformat cywir',
    },
  },
};

export const emptyEwcCodes = {
  en: {
    ui: 'Enter a code',
    csv: 'Enter an EWC code',
    api: 'Enter an EWC code',
  },
  cy: {
    ui: 'Rhowch god',
    csv: 'Rhowch god EWC',
    api: 'Rhowch god EWC',
  },
};

export const invalidEwcCodes = {
  en: {
    ui: 'Enter a code in the correct format',
    csv: 'Enter EWC code in correct format',
    api: 'Enter EWC code in correct format',
  },
  cy: {
    ui: 'Rhowch god yn y fformat cywir',
    csv: 'Rhowch god EWC yn y fformat cywir',
    api: 'Rhowch god EWC yn y fformat cywir',
  },
};

export const tooManyEwcCodes = {
  en: {
    csv: `You can only enter a maximum of ${EWCCodesLength.max} EWC codes`,
    api: `You can only enter a maximum of ${EWCCodesLength.max} EWC codes`,
  },
  cy: {
    csv: `Dim ond uchafswm o ${EWCCodesLength.max} cod EWC y gallwch ei nodi`,
    api: `Dim ond uchafswm o ${EWCCodesLength.max} cod EWC y gallwch ei nodi`,
  },
};

export const invalidNationalCode = {
  en: {
    ui: 'The code must only include letters a to z, numbers, spaces, hyphens and back slashes',
    csv: 'Enter national code in correct format',
    api: 'Enter national code in correct format',
  },
  cy: {
    ui: "Rhaid i'r cod gynnwys llythrennau a i z, rhifau, bylchau, cysylltnodau ac ôl-slaes yn unig",
    csv: 'Rhowch y cod cenedlaethol yn y fformat cywir',
    api: 'Rhowch y cod cenedlaethol yn y fformat cywir',
  },
};

export const emptyWasteDescription = {
  en: {
    ui: 'Enter a description',
    csv: 'Waste description cannot be left blank',
    api: 'Waste description cannot be left blank',
  },
  cy: {
    ui: 'Rhowch ddisgrifiad',
    csv: 'Ni ellir gadael disgrifiad gwastraff yn wag',
    api: 'Ni ellir gadael disgrifiad gwastraff yn wag',
  },
};

export const charTooFewWasteDescription = {
  en: {
    csv: `Enter at least ${WasteDescriptionChar.min} letter or number`,
    api: `Enter at least ${WasteDescriptionChar.min} letter or number`,
  },
  cy: {
    csv: `Rhowch o leiaf ${WasteDescriptionChar.min} llythyren neu rif`,
    api: `Rhowch o leiaf ${WasteDescriptionChar.min} llythyren neu rif`,
  },
};

export const charTooManyWasteDescription = {
  en: {
    ui: `Description must be ${WasteDescriptionChar.max} characters or less`,
    csv: `Waste description must be less than ${WasteDescriptionChar.max} characters`,
    api: `Waste description must be less than ${WasteDescriptionChar.max} characters`,
  },
  cy: {
    ui: `Rhaid i'r disgrifiad fod yn ${WasteDescriptionChar.max} nod neu lai`,
    csv: `Rhaid i ddisgrifiad gwastraff fod yn llai na ${WasteDescriptionChar.max} nod`,
    api: `Rhaid i ddisgrifiad gwastraff fod yn llai na ${WasteDescriptionChar.max} nod`,
  },
};

export const invalidUkExitLocation = {
  en: {
    ui: 'The location must only include letters a to z, and special characters such as full stops, hyphens, spaces and apostrophes',
    csv: 'The location must only include letters a to z, and special characters such as full stops, hyphens, commas, and apostrophes',
    api: 'The location must only include letters a to z, and special characters such as full stops, hyphens, commas, and apostrophes',
  },
  cy: {
    ui: "Rhaid i'r lleoliad gynnwys llythrennau a i z yn unig, a nodau arbennig fel atalnodau llawn, cysylltnodau, atalnodau a chollnod",
    csv: "Rhaid i'r lleoliad gynnwys llythrennau a i z yn unig, a nodau arbennig fel atalnodau llawn, cysylltnodau, atalnodau a chollnod",
    api: "Rhaid i'r lleoliad gynnwys llythrennau a i z yn unig, a nodau arbennig fel atalnodau llawn, cysylltnodau, atalnodau a chollnod",
  },
};

export const charTooManyUkExitLocation = {
  en: {
    ui: `The location must be less than ${UkExitLocationChar.max} characters`,
    csv: `The location must be less than ${UkExitLocationChar.max} characters`,
    api: `The location must be less than ${UkExitLocationChar.max} characters`,
  },
  cy: {
    ui: `Rhaid i'r lleoliad fod yn llai na ${UkExitLocationChar.max} nod`,
    csv: `Rhaid i'r lleoliad fod yn llai na ${UkExitLocationChar.max} nod`,
    api: `Rhaid i'r lleoliad fod yn llai na ${UkExitLocationChar.max} nod`,
  },
};

export const invalidTransitCountry = {
  en: {
    ui: 'Enter transit country in full',
    csv: 'Enter transit country in full',
    api: 'Enter transit country in full',
  },
  cy: {
    ui: 'Rhowch y wlad drawsgludo yn llawn',
    csv: 'Rhowch y wlad drawsgludo yn llawn',
    api: 'Rhowch y wlad drawsgludo yn llawn',
  },
};

export const transitCountriesInvalidCrossSectionImporterDetail = {
  en: {
    ui: 'The transit country cannot be the same as the importer country',
    csv: 'The transit country cannot be the same as the importer country',
    api: 'The transit country cannot be the same as the importer country',
  },
  cy: {
    ui: "Ni all y wlad drawsgludo fod yr un fath â'r wlad fewnforio",
    csv: "Ni all y wlad drawsgludo fod yr un fath â'r wlad fewnforio",
    api: "Ni all y wlad drawsgludo fod yr un fath â'r wlad fewnforio",
  },
};

export const importerDetailInvalidCrossSectionTransitCountries = {
  en: {
    ui: 'The importer country cannot be the same as a transit country',
    csv: 'The importer country cannot be the same as a transit country',
    api: 'The importer country cannot be the same as a transit country',
  },
  cy: {
    ui: 'Ni all y wlad fewnforiwr fod yr un fath â gwlad dramwy',
    csv: 'Ni all y wlad fewnforiwr fod yr un fath â gwlad dramwy',
    api: 'Ni all y wlad fewnforiwr fod yr un fath â gwlad dramwy',
  },
};

interface CarrierErrorMessages {
  emptyOrganisationName: string;
  charTooManyOrganisationName: string;
  emptyAddress: string;
  charTooManyAddress: string;
  emptyCountry: string;
  invalidCountry: string;
  emptyContactFullName: string;
  charTooManyContactFullName: string;
  emptyPhone: string;
  invalidPhone: string;
  invalidFax: string;
  emptyEmail: string;
  charTooManyEmail: string;
  invalidEmail: string;
  emptyTransport: string;
  charTooManyTransportDescription: string;
}

export const CarrierValidationErrorMessages: (
  locale: Locale,
  context: Exclude<Context, 'ui'>,
  carrierNumber?: number,
) => CarrierErrorMessages = (locale, context, carrierNumber) => {
  let carrierStr = '';
  switch (carrierNumber) {
    case 1:
      carrierStr =
        context === 'csv' && locale === 'en'
          ? 'first '
          : context === 'csv' && locale === 'cy'
            ? 'cyntaf '
            : '';
      break;
    case 2:
      carrierStr =
        context === 'csv' && locale === 'en'
          ? 'second '
          : context === 'csv' && locale === 'cy'
            ? 'ail '
            : '';
      break;
    case 3:
      carrierStr =
        context === 'csv' && locale === 'en'
          ? 'third '
          : context === 'csv' && locale === 'cy'
            ? 'trydydd '
            : '';
      break;
    case 4:
      carrierStr =
        context === 'csv' && locale === 'en'
          ? 'fourth '
          : context === 'csv' && locale === 'cy'
            ? 'pedwerydd '
            : '';
      break;
    case 5:
      carrierStr =
        context === 'csv' && locale === 'en'
          ? 'fifth '
          : context === 'csv' && locale === 'cy'
            ? 'pumed '
            : '';
      break;
    default:
      carrierStr =
        context === 'csv' && locale === 'en'
          ? 'first '
          : context === 'csv' && locale === 'cy'
            ? 'cyntaf '
            : '';
      break;
  }

  if (locale === 'cy') {
    return {
      emptyOrganisationName: `Rhowch enw'r ${carrierStr}sefydliad cludwr`,
      charTooManyOrganisationName: `Rhaid i enw'r ${carrierStr}sefydliad cludwr fod yn llai na ${FreeTextChar.max} nod`,
      emptyAddress: `Rhowch gyfeiriad y ${carrierStr}cludwr`,
      charTooManyAddress: `Rhaid i gyfeiriad y ${carrierStr}cludwr fod yn llai na ${FreeTextChar.max} nod`,
      emptyCountry: `Ewch i mewn i'r ${carrierStr}wlad cludo`,
      invalidCountry: `Rhowch yr ${carrierStr}wlad cludwr yn llawn`,
      emptyContactFullName: `Rhowch enw llawn y ${carrierStr}cyswllt cludwr`,
      charTooManyContactFullName: `Rhaid i enw llawn cyswllt y ${carrierStr}cludwr fod yn llai na ${FreeTextChar.max} nod`,
      emptyPhone: `Rhowch rif ffôn cyswllt ${carrierStr}cludwr`,
      invalidPhone: `Rhowch rif ffôn go iawn ar gyfer y ${carrierStr}cludwr`,
      invalidFax: `Rhowch rif ffacs go iawn ar gyfer y ${carrierStr}cludwr`,
      emptyEmail: `Rhowch gyfeiriad e-bost ${carrierStr}cludwr`,
      invalidEmail: `Rhowch gyfeiriad e-bost go iawn ar gyfer y ${carrierStr}cludwr`,
      charTooManyEmail: `Rhaid i gyfeiriad e-bost y ${carrierStr}cludwr fod yn llai na ${FreeTextChar.max} nod`,
      emptyTransport: `Rhowch y ${carrierStr}cyfrwng cludo cludwr`,
      charTooManyTransportDescription: `Rhaid i fanylion trafnidiaeth y ${carrierStr}cludwr fod yn llai na ${CarrierTransportDescriptionChar.max} nod`,
    };
  } else {
    return {
      emptyOrganisationName: `Enter the ${carrierStr}carrier organisation name`,
      charTooManyOrganisationName: `The ${carrierStr}carrier organisation name must be less than ${FreeTextChar.max} characters`,
      emptyAddress: `Enter the ${carrierStr}carrier address`,
      charTooManyAddress: `The ${carrierStr}carrier address must be less than ${FreeTextChar.max} characters`,
      emptyCountry: `Enter the ${carrierStr}carrier country`,
      invalidCountry: `Enter the ${carrierStr}carrier country in full`,
      emptyContactFullName: `Enter full name of ${carrierStr}carrier contact`,
      charTooManyContactFullName: `The ${carrierStr}carrier contact full name must be less than ${FreeTextChar.max} characters`,
      emptyPhone: `Enter ${carrierStr}carrier contact phone number`,
      invalidPhone: `Enter a real phone number for the ${carrierStr}carrier`,
      invalidFax: `Enter a real fax number for the ${carrierStr}carrier`,
      emptyEmail: `Enter ${carrierStr}carrier email address`,
      invalidEmail: `Enter a real email address for the ${carrierStr}carrier`,
      charTooManyEmail: `The ${carrierStr}carrier email address must be less than ${FreeTextChar.max} characters`,
      emptyTransport: `Enter ${carrierStr}carrier means of transport`,
      charTooManyTransportDescription: `The ${carrierStr}carrier transport details must be less than ${CarrierTransportDescriptionChar.max} characters`,
    };
  }
};

interface RecoveryFacilityErrorMessages {
  emptyOrganisationName: string;
  charTooManyOrganisationName: string;
  emptyAddress: string;
  charTooManyAddress: string;
  emptyCountry: string;
  invalidCountry: string;
  emptyContactFullName: string;
  charTooManyContactFullName: string;
  emptyPhone: string;
  invalidPhone: string;
  invalidFax: string;
  emptyEmail: string;
  charTooManyEmail: string;
  invalidEmail: string;
  emptyCode: string;
  invalidCode: string;
}

export const RecoveryFacilityDetailValidationErrorMessages: (
  locale: Locale,
  context: Exclude<Context, 'ui'>,
  recoveryFacilityType: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
  recoveryFacilityNumber?: number,
) => RecoveryFacilityErrorMessages = (
  locale,
  context,
  recoveryFacilityType,
  recoveryFacilityNumber,
) => {
  let typeStr = '';
  let codeStr = '';
  if (recoveryFacilityType === 'Laboratory') {
    typeStr = locale === 'en' ? 'laboratory ' : 'labordy ';
    codeStr = locale === 'en' ? 'disposal' : 'gwaredu';
  } else if (recoveryFacilityType === 'InterimSite') {
    typeStr = locale === 'en' ? 'interim site ' : 'interim safle ';
    codeStr = locale === 'en' ? 'recovery ' : 'adfer ';
  } else {
    typeStr = locale === 'en' ? 'recovery facility ' : 'cyfleuster adfer ';
    codeStr = locale === 'en' ? 'recovery' : 'adfer';
    switch (recoveryFacilityNumber) {
      case 1:
        typeStr =
          context === 'csv' && locale === 'en'
            ? `first ${typeStr}`
            : context === 'csv' && locale === 'cy'
              ? `cyntaf ${typeStr}`
              : typeStr;
        break;
      case 2:
        typeStr =
          context === 'csv' && locale === 'en'
            ? `second ${typeStr}`
            : context === 'csv' && locale === 'cy'
              ? `ail ${typeStr}`
              : typeStr;
        break;
      case 3:
        typeStr =
          context === 'csv' && locale === 'en'
            ? `third ${typeStr}`
            : context === 'csv' && locale === 'cy'
              ? `trydydd ${typeStr}`
              : typeStr;
        break;
      case 4:
        typeStr =
          context === 'csv' && locale === 'en'
            ? `fourth ${typeStr}`
            : context === 'csv' && locale === 'cy'
              ? `pedwerydd ${typeStr}`
              : typeStr;
        break;
      case 5:
        typeStr =
          context === 'csv' && locale === 'en'
            ? `fifth ${typeStr}`
            : context === 'csv' && locale === 'cy'
              ? `pumed ${typeStr}`
              : typeStr;
        break;
      default:
        typeStr =
          context === 'csv' && locale === 'en'
            ? `first ${typeStr}`
            : context === 'csv' && locale === 'cy'
              ? `cyntaf ${typeStr}`
              : typeStr;
        break;
    }
  }

  if (locale === 'cy') {
    return {
      emptyOrganisationName: `Rhowch enw'r sefydliad y ${typeStr}`.trim(),
      charTooManyOrganisationName: `Rhaid i enw sefydliad y ${typeStr}fod yn llai na ${FreeTextChar.max} nod`,
      emptyAddress: `Rhowch gyfeiriad y ${typeStr}`.trim(),
      charTooManyAddress: `Rhaid i gyfeiriad y ${typeStr}fod yn llai na ${FreeTextChar.max} nod`,
      emptyCountry: `Ewch i mewn i'r wlad ${typeStr}`.trim(),
      invalidCountry: `Rhowch yr wlad ${typeStr}yn llawn`,
      emptyContactFullName: `Rhowch enw llawn y cyswllt ${typeStr}`.trim(),
      charTooManyContactFullName: `Rhaid i enw llawn cyswllt y ${typeStr}fod yn llai na ${FreeTextChar.max} nod`,
      emptyPhone: `Rhowch rif ffôn cyswllt ${typeStr}`.trim(),
      invalidPhone: `Rhowch rif ffôn go iawn ar gyfer y ${typeStr}`.trim(),
      invalidFax: `Rhowch rif ffacs go iawn ar gyfer y ${typeStr}`.trim(),
      emptyEmail: `Rhowch gyfeiriad e-bost ${typeStr}`.trim(),
      invalidEmail:
        `Rhowch gyfeiriad e-bost go iawn ar gyfer y ${typeStr}`.trim(),
      charTooManyEmail: `Rhaid i gyfeiriad e-bost y ${typeStr}fod yn llai na ${FreeTextChar.max} nod`,
      emptyCode: `Rhowch god ${codeStr} ar gyfer y ${typeStr}`.trim(),
      invalidCode: `Rhowch god ${codeStr} ${typeStr}yn y fformat cywir`,
    };
  } else {
    return {
      emptyOrganisationName: `Enter the ${typeStr}organisation name`,
      charTooManyOrganisationName: `The ${typeStr}organisation name must be less than ${FreeTextChar.max} characters`,
      emptyAddress: `Enter the ${typeStr}address`,
      charTooManyAddress: `The ${typeStr}address must be less than ${FreeTextChar.max} characters`,
      emptyCountry: `Enter the ${typeStr}country`,
      invalidCountry: `Enter the ${typeStr}country in full`,
      emptyContactFullName: `Enter full name of ${typeStr}contact`,
      charTooManyContactFullName: `The ${typeStr}contact full name must be less than ${FreeTextChar.max} characters`,
      emptyPhone: `Enter ${typeStr}contact phone number`,
      invalidPhone: `Enter a real phone number for the ${typeStr}`.trim(),
      invalidFax: `Enter a real fax number for the ${typeStr}`.trim(),
      emptyEmail: `Enter ${typeStr}email address`,
      invalidEmail: `Enter a real email address for the ${typeStr}`.trim(),
      charTooManyEmail: `The ${typeStr}email address must be less than ${FreeTextChar.max} characters`,
      emptyCode: `Enter a ${codeStr}code for the ${typeStr}`.trim(),
      invalidCode: `Enter ${typeStr}${codeStr} code in correct format`,
    };
  }
};

interface Messages {
  en: { ui: string; csv: string; api: string };
  cy: { ui: string; csv: string; api: string };
}

export const emptyOrganisationName: (
  section: Section,
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
) => Messages = (section, index, recoveryFacilityType) => {
  if (section === 'Carriers') {
    return {
      en: {
        ui: commonErrorMessages.emptyOrganisationName.en,
        csv: CarrierValidationErrorMessages('en', 'csv', index)
          .emptyOrganisationName,
        api: CarrierValidationErrorMessages('en', 'api', index)
          .emptyOrganisationName,
      },
      cy: {
        ui: commonErrorMessages.emptyOrganisationName.cy,
        csv: CarrierValidationErrorMessages('cy', 'csv', index)
          .emptyOrganisationName,
        api: CarrierValidationErrorMessages('cy', 'api', index)
          .emptyOrganisationName,
      },
    };
  } else if (section === 'RecoveryFacilityDetail') {
    return {
      en: {
        ui: commonErrorMessages.emptyOrganisationName.en,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyOrganisationName,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyOrganisationName,
      },
      cy: {
        ui: commonErrorMessages.emptyOrganisationName.cy,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyOrganisationName,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyOrganisationName,
      },
    };
  } else {
    let sectionStrEn = '';
    let sectionStrCy = '';
    switch (section) {
      case 'ExporterDetail':
        sectionStrEn = 'exporter';
        sectionStrCy = 'allforiwr';
        break;
      case 'ImporterDetail':
        sectionStrEn = 'importer';
        sectionStrCy = 'mewnforiwr';
        break;
      case 'CollectionDetail':
        sectionStrEn = 'waste collection';
        sectionStrCy = 'casglu gwastraff';
        break;
      default:
        break;
    }

    return {
      en: {
        ui: commonErrorMessages.emptyOrganisationName.en,
        csv: `Enter the ${sectionStrEn} organisation name`,
        api: `Enter the ${sectionStrEn} organisation name`,
      },
      cy: {
        ui: commonErrorMessages.emptyOrganisationName.cy,
        csv: `Rhowch enw'r sefydliad ${sectionStrCy}`,
        api: `Rhowch enw'r sefydliad ${sectionStrCy}`,
      },
    };
  }
};

export const charTooManyOrganisationName: (
  section: Section,
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
) => Messages = (section, index, recoveryFacilityType) => {
  if (section === 'Carriers') {
    return {
      en: {
        ui: commonErrorMessages.charTooManyOrganisationName.en,
        csv: CarrierValidationErrorMessages('en', 'csv', index)
          .charTooManyOrganisationName,
        api: CarrierValidationErrorMessages('en', 'api', index)
          .charTooManyOrganisationName,
      },
      cy: {
        ui: commonErrorMessages.charTooManyOrganisationName.cy,
        csv: CarrierValidationErrorMessages('cy', 'csv', index)
          .charTooManyOrganisationName,
        api: CarrierValidationErrorMessages('cy', 'api', index)
          .charTooManyOrganisationName,
      },
    };
  } else if (section === 'RecoveryFacilityDetail') {
    return {
      en: {
        ui: commonErrorMessages.charTooManyOrganisationName.en,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).charTooManyOrganisationName,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).charTooManyOrganisationName,
      },
      cy: {
        ui: commonErrorMessages.charTooManyOrganisationName.cy,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).charTooManyOrganisationName,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).charTooManyOrganisationName,
      },
    };
  } else {
    let sectionStrEn = '';
    let sectionStrCy = '';
    switch (section) {
      case 'ExporterDetail':
        sectionStrEn = 'exporter';
        sectionStrCy = 'allforiwr';
        break;
      case 'ImporterDetail':
        sectionStrEn = 'importer';
        sectionStrCy = 'mewnforiwr';
        break;
      case 'CollectionDetail':
        sectionStrEn = 'waste collection';
        sectionStrCy = 'casglu gwastraff';
        break;
      default:
        break;
    }

    return {
      en: {
        ui: commonErrorMessages.charTooManyOrganisationName.en,
        csv: `The ${sectionStrEn} organisation name must be less than ${FreeTextChar.max} characters`,
        api: `The ${sectionStrEn} organisation name must be less than ${FreeTextChar.max} characters`,
      },
      cy: {
        ui: commonErrorMessages.charTooManyOrganisationName.cy,
        csv: `Rhaid i enw'r sefydliad ${sectionStrCy} fod yn llai na ${FreeTextChar.max} nod`,
        api: `Rhaid i enw'r sefydliad ${sectionStrCy} fod yn llai na ${FreeTextChar.max} nod`,
      },
    };
  }
};

export const emptyCountry: (
  section: Section,
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
) => Messages = (section, index, recoveryFacilityType) => {
  const uiMessage = {
    en:
      section === 'ExporterDetail' || section === 'CollectionDetail'
        ? commonErrorMessages.emptyAddressSelection.en
        : commonErrorMessages.emptyCountry.en,
    cy:
      section === 'ExporterDetail' || section === 'CollectionDetail'
        ? commonErrorMessages.emptyAddressSelection.cy
        : commonErrorMessages.emptyCountry.cy,
  };
  if (section === 'Carriers') {
    return {
      en: {
        ui: uiMessage.en,
        csv: CarrierValidationErrorMessages('en', 'csv', index).emptyCountry,
        api: CarrierValidationErrorMessages('en', 'api', index).emptyCountry,
      },
      cy: {
        ui: uiMessage.cy,
        csv: CarrierValidationErrorMessages('cy', 'csv', index).emptyCountry,
        api: CarrierValidationErrorMessages('cy', 'api', index).emptyCountry,
      },
    };
  } else if (section === 'RecoveryFacilityDetail') {
    return {
      en: {
        ui: uiMessage.en,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyCountry,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyCountry,
      },
      cy: {
        ui: uiMessage.cy,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyCountry,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyCountry,
      },
    };
  } else {
    let sectionStrEn = '';
    let sectionStrCy = '';
    switch (section) {
      case 'ExporterDetail':
        sectionStrEn = 'exporter';
        sectionStrCy = 'allforiwr';
        break;
      case 'ImporterDetail':
        sectionStrEn = 'importer';
        sectionStrCy = 'mewnforiwr';
        break;
      case 'CollectionDetail':
        sectionStrEn = 'waste collection';
        sectionStrCy = 'casglu gwastraff';
        break;
      default:
        break;
    }

    return {
      en: {
        ui: uiMessage.en,
        csv: `Enter the ${sectionStrEn} country`,
        api: `Enter the ${sectionStrEn} country`,
      },
      cy: {
        ui: uiMessage.cy,
        csv: `Rhowch y wlad ${sectionStrCy}`,
        api: `Rhowch y wlad ${sectionStrCy}`,
      },
    };
  }
};

export const invalidCountry: (
  section: Section,
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
) => Messages = (section, index, recoveryFacilityType) => {
  const uiMessage = {
    en:
      section === 'ExporterDetail' || section === 'CollectionDetail'
        ? commonErrorMessages.emptyAddressSelection.en
        : commonErrorMessages.emptyCountry.en,
    cy:
      section === 'ExporterDetail' || section === 'CollectionDetail'
        ? commonErrorMessages.emptyAddressSelection.cy
        : commonErrorMessages.emptyCountry.cy,
  };
  if (section === 'Carriers') {
    return {
      en: {
        ui: uiMessage.en,
        csv: CarrierValidationErrorMessages('en', 'csv', index).invalidCountry,
        api: CarrierValidationErrorMessages('en', 'api', index).invalidCountry,
      },
      cy: {
        ui: uiMessage.cy,
        csv: CarrierValidationErrorMessages('cy', 'csv', index).invalidCountry,
        api: CarrierValidationErrorMessages('cy', 'api', index).invalidCountry,
      },
    };
  } else if (section === 'RecoveryFacilityDetail') {
    return {
      en: {
        ui: uiMessage.en,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).invalidCountry,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).invalidCountry,
      },
      cy: {
        ui: uiMessage.cy,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).invalidCountry,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).invalidCountry,
      },
    };
  } else {
    let sectionStrEn = '';
    let sectionStrCy = '';
    switch (section) {
      case 'ExporterDetail':
        sectionStrEn = 'exporter';
        sectionStrCy = 'allforiwr';
        break;
      case 'ImporterDetail':
        sectionStrEn = 'importer';
        sectionStrCy = 'mewnforiwr';
        break;
      case 'CollectionDetail':
        sectionStrEn = 'waste collection';
        sectionStrCy = 'casglu gwastraff';
        break;
      default:
        break;
    }

    return {
      en: {
        ui: uiMessage.en,
        csv: `Enter the ${sectionStrEn} country in full`,
        api: `Enter the ${sectionStrEn} country in full`,
      },
      cy: {
        ui: uiMessage.cy,
        csv: `Rhowch y wlad ${sectionStrCy} yn llawn`,
        api: `Rhowch y wlad ${sectionStrCy} yn llawn`,
      },
    };
  }
};

export const emptyContactFullName: (
  section: Section,
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
) => Messages = (section, index, recoveryFacilityType) => {
  if (section === 'Carriers') {
    return {
      en: {
        ui: commonErrorMessages.emptyContactFullName.en,
        csv: CarrierValidationErrorMessages('en', 'csv', index)
          .emptyContactFullName,
        api: CarrierValidationErrorMessages('en', 'api', index)
          .emptyContactFullName,
      },
      cy: {
        ui: commonErrorMessages.emptyContactFullName.cy,
        csv: CarrierValidationErrorMessages('cy', 'csv', index)
          .emptyContactFullName,
        api: CarrierValidationErrorMessages('cy', 'api', index)
          .emptyContactFullName,
      },
    };
  } else if (section === 'RecoveryFacilityDetail') {
    return {
      en: {
        ui: commonErrorMessages.emptyContactFullName.en,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyContactFullName,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyContactFullName,
      },
      cy: {
        ui: commonErrorMessages.emptyContactFullName.cy,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyContactFullName,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyContactFullName,
      },
    };
  } else {
    let sectionStrEn = '';
    let sectionStrCy = '';
    switch (section) {
      case 'ExporterDetail':
        sectionStrEn = 'exporter';
        sectionStrCy = 'allforiwr';
        break;
      case 'ImporterDetail':
        sectionStrEn = 'importer';
        sectionStrCy = 'mewnforiwr';
        break;
      case 'CollectionDetail':
        sectionStrEn = 'waste collection';
        sectionStrCy = 'casglu gwastraff';
        break;
      default:
        break;
    }

    return {
      en: {
        ui: commonErrorMessages.emptyContactFullName.en,
        csv: `Enter full name of ${sectionStrEn} contact`,
        api: `Enter full name of ${sectionStrEn} contact`,
      },
      cy: {
        ui: commonErrorMessages.emptyContactFullName.cy,
        csv: `Rhowch enw llawn y cyswllt ${sectionStrCy}`,
        api: `Rhowch enw llawn y cyswllt ${sectionStrCy}`,
      },
    };
  }
};

export const charTooManyContactFullName: (
  section: Section,
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
) => Messages = (section, index, recoveryFacilityType) => {
  if (section === 'Carriers') {
    return {
      en: {
        ui: commonErrorMessages.charTooManyContactFullName.en,
        csv: CarrierValidationErrorMessages('en', 'csv', index)
          .charTooManyContactFullName,
        api: CarrierValidationErrorMessages('en', 'api', index)
          .charTooManyContactFullName,
      },
      cy: {
        ui: commonErrorMessages.charTooManyContactFullName.cy,
        csv: CarrierValidationErrorMessages('cy', 'csv', index)
          .charTooManyContactFullName,
        api: CarrierValidationErrorMessages('cy', 'api', index)
          .charTooManyContactFullName,
      },
    };
  } else if (section === 'RecoveryFacilityDetail') {
    return {
      en: {
        ui: commonErrorMessages.charTooManyContactFullName.en,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).charTooManyContactFullName,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).charTooManyContactFullName,
      },
      cy: {
        ui: commonErrorMessages.charTooManyContactFullName.cy,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).charTooManyContactFullName,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).charTooManyContactFullName,
      },
    };
  } else {
    let sectionStrEn = '';
    let sectionStrCy = '';
    switch (section) {
      case 'ExporterDetail':
        sectionStrEn = 'exporter';
        sectionStrCy = 'allforiwr';
        break;
      case 'ImporterDetail':
        sectionStrEn = 'importer';
        sectionStrCy = 'mewnforiwr';
        break;
      case 'CollectionDetail':
        sectionStrEn = 'waste collection';
        sectionStrCy = 'casglu gwastraff';
        break;
      default:
        break;
    }

    return {
      en: {
        ui: commonErrorMessages.charTooManyContactFullName.en,
        csv: `The ${sectionStrEn} contact full name must be less than ${FreeTextChar.max} characters`,
        api: `The ${sectionStrEn} contact full name must be less than ${FreeTextChar.max} characters`,
      },
      cy: {
        ui: commonErrorMessages.charTooManyContactFullName.cy,
        csv: `Rhaid i enw llawn cyswllt y ${sectionStrCy} fod yn llai na ${FreeTextChar.max} nod`,
        api: `Rhaid i enw llawn cyswllt y ${sectionStrCy} fod yn llai na ${FreeTextChar.max} nod`,
      },
    };
  }
};

export const emptyPhone: (
  section: Section,
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
) => Messages = (section, index, recoveryFacilityType) => {
  if (section === 'Carriers') {
    return {
      en: {
        ui: commonErrorMessages.emptyPhone.en,
        csv: CarrierValidationErrorMessages('en', 'csv', index).emptyPhone,
        api: CarrierValidationErrorMessages('en', 'api', index).emptyPhone,
      },
      cy: {
        ui: commonErrorMessages.emptyPhone.cy,
        csv: CarrierValidationErrorMessages('cy', 'csv', index).emptyPhone,
        api: CarrierValidationErrorMessages('cy', 'api', index).emptyPhone,
      },
    };
  } else if (section === 'RecoveryFacilityDetail') {
    return {
      en: {
        ui: commonErrorMessages.emptyPhone.en,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyPhone,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyPhone,
      },
      cy: {
        ui: commonErrorMessages.emptyPhone.cy,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyPhone,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyPhone,
      },
    };
  } else {
    let sectionStrEn = '';
    let sectionStrCy = '';
    switch (section) {
      case 'ExporterDetail':
        sectionStrEn = 'exporter';
        sectionStrCy = 'allforiwr';
        break;
      case 'ImporterDetail':
        sectionStrEn = 'importer';
        sectionStrCy = 'mewnforiwr';
        break;
      case 'CollectionDetail':
        sectionStrEn = 'waste collection';
        sectionStrCy = 'casglu gwastraff';
        break;
      default:
        break;
    }

    return {
      en: {
        ui: commonErrorMessages.emptyPhone.en,
        csv: `Enter ${sectionStrEn} contact phone number`,
        api: `Enter ${sectionStrEn} contact phone number`,
      },
      cy: {
        ui: commonErrorMessages.emptyPhone.cy,
        csv: `Rhowch rif ffôn cyswllt y ${sectionStrCy}`,
        api: `Rhowch rif ffôn cyswllt y ${sectionStrCy}`,
      },
    };
  }
};

export const invalidPhone: (
  section: Section,
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
) => Messages = (section, index, recoveryFacilityType) => {
  if (section === 'Carriers') {
    return {
      en: {
        ui: commonErrorMessages.invalidPhone.en,
        csv: CarrierValidationErrorMessages('en', 'csv', index).invalidPhone,
        api: CarrierValidationErrorMessages('en', 'api', index).invalidPhone,
      },
      cy: {
        ui: commonErrorMessages.invalidPhone.cy,
        csv: CarrierValidationErrorMessages('cy', 'csv', index).invalidPhone,
        api: CarrierValidationErrorMessages('cy', 'api', index).invalidPhone,
      },
    };
  } else if (section === 'RecoveryFacilityDetail') {
    return {
      en: {
        ui: commonErrorMessages.invalidPhone.en,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).invalidPhone,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).invalidPhone,
      },
      cy: {
        ui: commonErrorMessages.invalidPhone.cy,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).invalidPhone,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).invalidPhone,
      },
    };
  } else {
    let sectionStrEn = '';
    let sectionStrCy = '';
    switch (section) {
      case 'ExporterDetail':
        sectionStrEn = 'exporter';
        sectionStrCy = 'allforiwr';
        break;
      case 'ImporterDetail':
        sectionStrEn = 'importer';
        sectionStrCy = 'mewnforiwr';
        break;
      case 'CollectionDetail':
        sectionStrEn = 'waste collection';
        sectionStrCy = 'casglu gwastraff';
        break;
      default:
        break;
    }

    return {
      en: {
        ui: commonErrorMessages.invalidPhone.en,
        csv: `Enter a real phone number for the ${sectionStrEn}`,
        api: `Enter a real phone number for the ${sectionStrEn}`,
      },
      cy: {
        ui: commonErrorMessages.invalidPhone.cy,
        csv: `Rhowch rif ffôn go iawn ar gyfer y ${sectionStrCy}`,
        api: `Rhowch rif ffôn go iawn ar gyfer y ${sectionStrCy}`,
      },
    };
  }
};

export const invalidFax: (
  section: Section,
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
) => Messages = (section, index, recoveryFacilityType) => {
  if (section === 'Carriers') {
    return {
      en: {
        ui: commonErrorMessages.invalidFax.en,
        csv: CarrierValidationErrorMessages('en', 'csv', index).invalidFax,
        api: CarrierValidationErrorMessages('en', 'api', index).invalidFax,
      },
      cy: {
        ui: commonErrorMessages.invalidFax.cy,
        csv: CarrierValidationErrorMessages('cy', 'csv', index).invalidFax,
        api: CarrierValidationErrorMessages('cy', 'api', index).invalidFax,
      },
    };
  } else if (section === 'RecoveryFacilityDetail') {
    return {
      en: {
        ui: commonErrorMessages.invalidFax.en,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).invalidFax,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).invalidFax,
      },
      cy: {
        ui: commonErrorMessages.invalidFax.cy,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).invalidFax,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).invalidFax,
      },
    };
  } else {
    let sectionStrEn = '';
    let sectionStrCy = '';
    switch (section) {
      case 'ExporterDetail':
        sectionStrEn = 'exporter';
        sectionStrCy = 'allforiwr';
        break;
      case 'ImporterDetail':
        sectionStrEn = 'importer';
        sectionStrCy = 'mewnforiwr';
        break;
      case 'CollectionDetail':
        sectionStrEn = 'waste collection';
        sectionStrCy = 'casglu gwastraff';
        break;
      default:
        break;
    }

    return {
      en: {
        ui: commonErrorMessages.invalidFax.en,
        csv: `Enter a real fax number for the ${sectionStrEn}`,
        api: `Enter a real fax number for the ${sectionStrEn}`,
      },
      cy: {
        ui: commonErrorMessages.invalidFax.cy,
        csv: `Rhowch rif ffacs go iawn ar gyfer y ${sectionStrCy}`,
        api: `Rhowch rif ffacs go iawn ar gyfer y ${sectionStrCy}`,
      },
    };
  }
};

export const emptyEmail: (
  section: Section,
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
) => Messages = (section, index, recoveryFacilityType) => {
  if (section === 'Carriers') {
    return {
      en: {
        ui: commonErrorMessages.emptyEmail.en,
        csv: CarrierValidationErrorMessages('en', 'csv', index).emptyEmail,
        api: CarrierValidationErrorMessages('en', 'api', index).emptyEmail,
      },
      cy: {
        ui: commonErrorMessages.emptyEmail.cy,
        csv: CarrierValidationErrorMessages('cy', 'csv', index).emptyEmail,
        api: CarrierValidationErrorMessages('cy', 'api', index).emptyEmail,
      },
    };
  } else if (section === 'RecoveryFacilityDetail') {
    return {
      en: {
        ui: commonErrorMessages.emptyEmail.en,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyEmail,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyEmail,
      },
      cy: {
        ui: commonErrorMessages.emptyEmail.cy,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyEmail,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyEmail,
      },
    };
  } else {
    let sectionStrEn = '';
    let sectionStrCy = '';
    switch (section) {
      case 'ExporterDetail':
        sectionStrEn = 'exporter';
        sectionStrCy = 'allforiwr';
        break;
      case 'ImporterDetail':
        sectionStrEn = 'importer';
        sectionStrCy = 'mewnforiwr';
        break;
      case 'CollectionDetail':
        sectionStrEn = 'waste collection';
        sectionStrCy = 'casglu gwastraff';
        break;
      default:
        break;
    }

    return {
      en: {
        ui: commonErrorMessages.emptyEmail.en,
        csv: `Enter ${sectionStrEn} email address`,
        api: `Enter ${sectionStrEn} email address`,
      },
      cy: {
        ui: commonErrorMessages.emptyEmail.cy,
        csv: `Rhowch gyfeiriad e-bost y ${sectionStrCy}`,
        api: `Rhowch gyfeiriad e-bost y ${sectionStrCy}`,
      },
    };
  }
};

export const invalidEmail: (
  section: Section,
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
) => Messages = (section, index, recoveryFacilityType) => {
  if (section === 'Carriers') {
    return {
      en: {
        ui: commonErrorMessages.invalidEmail.en,
        csv: CarrierValidationErrorMessages('en', 'csv', index).invalidEmail,
        api: CarrierValidationErrorMessages('en', 'api', index).invalidEmail,
      },
      cy: {
        ui: commonErrorMessages.invalidEmail.cy,
        csv: CarrierValidationErrorMessages('cy', 'csv', index).invalidEmail,
        api: CarrierValidationErrorMessages('cy', 'api', index).invalidEmail,
      },
    };
  } else if (section === 'RecoveryFacilityDetail') {
    return {
      en: {
        ui: commonErrorMessages.invalidEmail.en,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).invalidEmail,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).invalidEmail,
      },
      cy: {
        ui: commonErrorMessages.invalidEmail.cy,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).invalidEmail,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).invalidEmail,
      },
    };
  } else {
    let sectionStrEn = '';
    let sectionStrCy = '';
    switch (section) {
      case 'ExporterDetail':
        sectionStrEn = 'exporter';
        sectionStrCy = 'allforiwr';
        break;
      case 'ImporterDetail':
        sectionStrEn = 'importer';
        sectionStrCy = 'mewnforiwr';
        break;
      case 'CollectionDetail':
        sectionStrEn = 'waste collection';
        sectionStrCy = 'casglu gwastraff';
        break;
      default:
        break;
    }

    return {
      en: {
        ui: commonErrorMessages.invalidEmail.en,
        csv: `Enter a real email address for the ${sectionStrEn}`,
        api: `Enter a real email address for the ${sectionStrEn}`,
      },
      cy: {
        ui: commonErrorMessages.invalidEmail.cy,
        csv: `Rhowch gyfeiriad e-bost go iawn ar gyfer y ${sectionStrCy}`,
        api: `Rhowch gyfeiriad e-bost go iawn ar gyfer y ${sectionStrCy}`,
      },
    };
  }
};

export const charTooManyEmail: (
  section: Section,
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
) => Messages = (section, index, recoveryFacilityType) => {
  if (section === 'Carriers') {
    return {
      en: {
        ui: commonErrorMessages.charTooManyEmail.en,
        csv: CarrierValidationErrorMessages('en', 'csv', index)
          .charTooManyEmail,
        api: CarrierValidationErrorMessages('en', 'api', index)
          .charTooManyEmail,
      },
      cy: {
        ui: commonErrorMessages.charTooManyEmail.cy,
        csv: CarrierValidationErrorMessages('cy', 'csv', index)
          .charTooManyEmail,
        api: CarrierValidationErrorMessages('cy', 'api', index)
          .charTooManyEmail,
      },
    };
  } else if (section === 'RecoveryFacilityDetail') {
    return {
      en: {
        ui: commonErrorMessages.charTooManyEmail.en,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).charTooManyEmail,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).charTooManyEmail,
      },
      cy: {
        ui: commonErrorMessages.charTooManyEmail.cy,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).charTooManyEmail,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).charTooManyEmail,
      },
    };
  } else {
    let sectionStrEn = '';
    let sectionStrCy = '';
    switch (section) {
      case 'ExporterDetail':
        sectionStrEn = 'exporter';
        sectionStrCy = 'allforiwr';
        break;
      case 'ImporterDetail':
        sectionStrEn = 'importer';
        sectionStrCy = 'mewnforiwr';
        break;
      case 'CollectionDetail':
        sectionStrEn = 'waste collection';
        sectionStrCy = 'casglu gwastraff';
        break;
      default:
        break;
    }

    return {
      en: {
        ui: commonErrorMessages.charTooManyEmail.en,
        csv: `The ${sectionStrEn} email address must be less than ${FreeTextChar.max} characters`,
        api: `The ${sectionStrEn} email address must be less than ${FreeTextChar.max} characters`,
      },
      cy: {
        ui: commonErrorMessages.charTooManyEmail.cy,
        csv: `Rhaid i gyfeiriad e-bost y ${sectionStrCy} fod yn llai na ${FreeTextChar.max} nod`,
        api: `Rhaid i gyfeiriad e-bost y ${sectionStrCy} fod yn llai na ${FreeTextChar.max} nod`,
      },
    };
  }
};

export const emptyAddress: (
  section: Exclude<Section, 'ExporterDetail' | 'CollectionDetail'>,
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
) => Messages = (section, index, recoveryFacilityType) => {
  const uiMessage = {
    en: 'Enter an address',
    cy: 'Rhowch gyfeiriad',
  };
  if (section === 'Carriers') {
    return {
      en: {
        ui: uiMessage.en,
        csv: CarrierValidationErrorMessages('en', 'csv', index).emptyAddress,
        api: CarrierValidationErrorMessages('en', 'api', index).emptyAddress,
      },
      cy: {
        ui: uiMessage.cy,
        csv: CarrierValidationErrorMessages('cy', 'csv', index).emptyAddress,
        api: CarrierValidationErrorMessages('cy', 'api', index).emptyAddress,
      },
    };
  } else if (section === 'RecoveryFacilityDetail') {
    return {
      en: {
        ui: uiMessage.en,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyAddress,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyAddress,
      },
      cy: {
        ui: uiMessage.cy,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyAddress,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).emptyAddress,
      },
    };
  } else {
    return {
      en: {
        ui: uiMessage.en,
        csv: 'Enter the importer address',
        api: 'Enter the importer address',
      },
      cy: {
        ui: uiMessage.cy,
        csv: 'Rhowch gyfeiriad y mewnforiwr',
        api: 'Rhowch gyfeiriad y mewnforiwr',
      },
    };
  }
};

export const charTooManyAddress: (
  section: Exclude<Section, 'ExporterDetail' | 'CollectionDetail'>,
  index?: number,
  recoveryFacilityType?: 'Laboratory' | 'InterimSite' | 'RecoveryFacility',
) => Messages = (section, index, recoveryFacilityType) => {
  const uiMessage = {
    en: `Address must be less than ${FreeTextChar.max} characters`,
    cy: `Rhaid i'r cyfeiriad fod yn llai na ${FreeTextChar.max} nod`,
  };
  if (section === 'Carriers') {
    return {
      en: {
        ui: uiMessage.en,
        csv: CarrierValidationErrorMessages('en', 'csv', index)
          .charTooManyAddress,
        api: CarrierValidationErrorMessages('en', 'api', index)
          .charTooManyAddress,
      },
      cy: {
        ui: uiMessage.cy,
        csv: CarrierValidationErrorMessages('cy', 'csv', index)
          .charTooManyAddress,
        api: CarrierValidationErrorMessages('cy', 'api', index)
          .charTooManyAddress,
      },
    };
  } else if (section === 'RecoveryFacilityDetail') {
    return {
      en: {
        ui: uiMessage.en,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).charTooManyAddress,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'en',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).charTooManyAddress,
      },
      cy: {
        ui: uiMessage.cy,
        csv: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'csv',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).charTooManyAddress,
        api: RecoveryFacilityDetailValidationErrorMessages(
          'cy',
          'api',
          recoveryFacilityType as
            | 'Laboratory'
            | 'InterimSite'
            | 'RecoveryFacility',
          index,
        ).charTooManyAddress,
      },
    };
  } else {
    return {
      en: {
        ui: uiMessage.en,
        csv: `The importer address must be less than ${FreeTextChar.max} characters`,
        api: `The importer address must be less than ${FreeTextChar.max} characters`,
      },
      cy: {
        ui: uiMessage.cy,
        csv: `Rhaid i gyfeiriad y mewnforiwr fod yn llai na ${FreeTextChar.max} nod`,
        api: `Rhaid i gyfeiriad y mewnforiwr fod yn llai na ${FreeTextChar.max} nod`,
      },
    };
  }
};

export const emptyAddressLine1: (
  section: Exclude<
    Section,
    'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
  >,
) => Messages = (section) => {
  const uiMessage = {
    en: 'Enter an address',
    cy: 'Rhowch gyfeiriad',
  };
  let sectionStrEn = '';
  let sectionStrCy = '';
  switch (section) {
    case 'ExporterDetail':
      sectionStrEn = 'exporter';
      sectionStrCy = 'allforiwr';
      break;
    case 'CollectionDetail':
      sectionStrEn = 'waste collection';
      sectionStrCy = 'casglu gwastraff';
      break;
    default:
      break;
  }

  return {
    en: {
      ui: uiMessage.en,
      csv: `Enter the ${sectionStrEn} address`,
      api: `Enter the ${sectionStrEn} address`,
    },
    cy: {
      ui: uiMessage.cy,
      csv: `Rhowch y cyfeiriad ${sectionStrCy}`,
      api: `Rhowch y cyfeiriad ${sectionStrCy}`,
    },
  };
};

export const charTooManyAddressLine1: (
  section: Exclude<
    Section,
    'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
  >,
) => Messages = (section) => {
  let sectionStrEn = '';
  let sectionStrCy = '';
  switch (section) {
    case 'ExporterDetail':
      sectionStrEn = 'exporter';
      sectionStrCy = 'allforiwr';
      break;
    case 'CollectionDetail':
      sectionStrEn = 'waste collection';
      sectionStrCy = 'casglu gwastraff';
      break;
    default:
      break;
  }

  return {
    en: {
      ui: commonErrorMessages.charTooManyAddressLine1.en,
      csv: `The ${sectionStrEn} address line 1 must be less than ${FreeTextChar.max} characters`,
      api: `The ${sectionStrEn} address line 1 must be less than ${FreeTextChar.max} characters`,
    },
    cy: {
      ui: commonErrorMessages.charTooManyAddressLine1.cy,
      csv: `Rhaid i linell cyfeiriad yr ${sectionStrCy} 1 fod yn llai na ${FreeTextChar.max} nod`,
      api: `Rhaid i linell cyfeiriad yr ${sectionStrCy} 1 fod yn llai na ${FreeTextChar.max} nod`,
    },
  };
};

export const charTooManyAddressLine2: (
  section: Exclude<
    Section,
    'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
  >,
) => Messages = (section) => {
  let sectionStrEn = '';
  let sectionStrCy = '';
  switch (section) {
    case 'ExporterDetail':
      sectionStrEn = 'exporter';
      sectionStrCy = 'allforiwr';
      break;
    case 'CollectionDetail':
      sectionStrEn = 'waste collection';
      sectionStrCy = 'casglu gwastraff';
      break;
    default:
      break;
  }

  return {
    en: {
      ui: commonErrorMessages.charTooManyAddressLine2.en,
      csv: `The ${sectionStrEn} address line 2 must be less than ${FreeTextChar.max} characters`,
      api: `The ${sectionStrEn} address line 2 must be less than ${FreeTextChar.max} characters`,
    },
    cy: {
      ui: commonErrorMessages.charTooManyAddressLine2.cy,
      csv: `Rhaid i linell cyfeiriad yr ${sectionStrCy} 2 fod yn llai na ${FreeTextChar.max} nod`,
      api: `Rhaid i linell cyfeiriad yr ${sectionStrCy} 2 fod yn llai na ${FreeTextChar.max} nod`,
    },
  };
};

export const emptyTownOrCity: (
  section: Exclude<
    Section,
    'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
  >,
) => Messages = (section) => {
  let sectionStrEn = '';
  let sectionStrCy = '';
  switch (section) {
    case 'ExporterDetail':
      sectionStrEn = 'exporter';
      sectionStrCy = 'allforiwr';
      break;
    case 'CollectionDetail':
      sectionStrEn = 'waste collection';
      sectionStrCy = 'casglu gwastraff';
      break;
    default:
      break;
  }

  return {
    en: {
      ui: commonErrorMessages.emptyTownOrCity.en,
      csv: `Enter the ${sectionStrEn} town or city`,
      api: `Enter the ${sectionStrEn} town or city`,
    },
    cy: {
      ui: commonErrorMessages.emptyTownOrCity.cy,
      csv: `Ewch i mewn i'r dref neu'r ddinas ${sectionStrCy}`,
      api: `Ewch i mewn i'r dref neu'r ddinas ${sectionStrCy}`,
    },
  };
};

export const charTooManyTownOrCity: (
  section: Exclude<
    Section,
    'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
  >,
) => Messages = (section) => {
  let sectionStrEn = '';
  let sectionStrCy = '';
  switch (section) {
    case 'ExporterDetail':
      sectionStrEn = 'exporter';
      sectionStrCy = 'allforiwr';
      break;
    case 'CollectionDetail':
      sectionStrEn = 'waste collection';
      sectionStrCy = 'casglu gwastraff';
      break;
    default:
      break;
  }

  return {
    en: {
      ui: commonErrorMessages.charTooManyTownOrCity.en,
      csv: `The ${sectionStrEn} town or city must be less than ${FreeTextChar.max} characters`,
      api: `The ${sectionStrEn} town or city must be less than ${FreeTextChar.max} characters`,
    },
    cy: {
      ui: commonErrorMessages.charTooManyTownOrCity.cy,
      csv: `Rhaid i'r dref neu'r ddinas ${sectionStrCy} fod yn llai na ${FreeTextChar.max} nod`,
      api: `Rhaid i'r dref neu'r ddinas ${sectionStrCy} fod yn llai na ${FreeTextChar.max} nod`,
    },
  };
};

export const invalidPostcode: (
  section: Exclude<
    Section,
    'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
  >,
) => Messages = (section) => {
  const uiMessage = {
    en: 'Enter a real postcode',
    cy: 'Rhowch god post go iawn',
  };
  let sectionStrEn = '';
  let sectionStrCy = '';
  switch (section) {
    case 'ExporterDetail':
      sectionStrEn = 'exporter';
      sectionStrCy = 'allforiwr';
      break;
    case 'CollectionDetail':
      sectionStrEn = 'waste collection';
      sectionStrCy = 'casglu gwastraff';
      break;
    default:
      break;
  }

  return {
    en: {
      ui: uiMessage.en,
      csv: `Enter the ${sectionStrEn} postcode in the correct format`,
      api: `Enter the ${sectionStrEn} postcode in the correct format`,
    },
    cy: {
      ui: uiMessage.cy,
      csv: `Rhowch god post yr ${sectionStrCy} yn y fformat cywir`,
      api: `Rhowch god post yr ${sectionStrCy} yn y fformat cywir`,
    },
  };
};

export const invalidTransportCarriersCrossSection = {
  en: {
    csv: 'Do not enter any carrier means of transport if you are exporting unlisted waste',
    api: 'Do not enter any carrier means of transport if you are exporting unlisted waste',
  },
  cy: {
    csv: 'Peidiwch â mynd i mewn i unrhyw ddull cludo cludo os ydych yn allforio gwastraff heb ei restru',
    api: 'Peidiwch â mynd i mewn i unrhyw ddull cludo cludo os ydych yn allforio gwastraff heb ei restru',
  },
};

export const invalidTransportDescriptionCarriersCrossSection = {
  en: {
    csv: 'Do not enter any carrier means of transport details if you are exporting unlisted waste',
    api: 'Do not enter any carrier means of transport details if you are exporting unlisted waste',
  },
  cy: {
    csv: 'Peidiwch â nodi unrhyw ddull cludo cludwr os ydych yn allforio gwastraff heb ei restru',
    api: 'Peidiwch â nodi unrhyw ddull cludo cludwr os ydych yn allforio gwastraff heb ei restru',
  },
};

export const invalidLaboratoryRecoveryFacilityDetailCrossSection = {
  en: {
    csv: 'Do not enter any laboratory details if you are exporting bulk waste',
    api: 'Do not enter any laboratory details if you are exporting bulk waste',
  },
  cy: {
    csv: 'Peidiwch â nodi unrhyw fanylion labordy os ydych yn allforio gwastraff swmp',
    api: 'Peidiwch â nodi unrhyw fanylion labordy os ydych yn allforio gwastraff swmp',
  },
};

export const invalidInterimSiteRecoveryFacilityDetailCrossSection = {
  en: {
    csv: 'Do not enter any interim site details if you are exporting unlisted waste',
    api: 'Do not enter any interim site details if you are exporting unlisted waste',
  },
  cy: {
    csv: 'Peidiwch â nodi unrhyw fanylion safle interim os ydych yn allforio gwastraff heb ei restru',
    api: 'Peidiwch â nodi unrhyw fanylion safle interim os ydych yn allforio gwastraff heb ei restru',
  },
};

export const invalidRecoveryFacilityRecoveryFacilityDetailCrossSection = {
  en: {
    csv: 'Do not enter any recovery facility details if you are exporting unlisted waste',
    api: 'Do not enter any recovery facility details if you are exporting unlisted waste',
  },
  cy: {
    csv: 'Peidiwch â nodi unrhyw fanylion cyfleuster adennill os ydych yn allforio gwastraff heb ei restru',
    api: 'Peidiwch â nodi unrhyw fanylion cyfleuster adennill os ydych yn allforio gwastraff heb ei restru',
  },
};

export const emptyWasteQuantity = {
  en: {
    ui: 'Enter quantity of waste',
    csv: 'Enter quantity of waste',
    api: 'Enter quantity of waste',
  },
  cy: {
    ui: 'Nodwch faint o wastraff',
    csv: 'Nodwch faint o wastraff',
    api: 'Nodwch faint o wastraff',
  },
};

export const invalidWasteQuantity = {
  en: {
    ui: 'Enter the weight using only numbers and a full stop',
    csv: 'Enter the weight using only numbers and a full stop',
    api: 'Enter the weight using only numbers and a full stop',
  },
  cy: {
    ui: 'Rhowch y pwysau gan ddefnyddio rhifau yn unig ac atalnod llawn',
    csv: 'Rhowch y pwysau gan ddefnyddio rhifau yn unig ac atalnod llawn',
    api: 'Rhowch y pwysau gan ddefnyddio rhifau yn unig ac atalnod llawn',
  },
};

export const invalidBulkWasteQuantity = {
  en: {
    ui: `The waste quantity must be between ${BulkWasteQuantityValue.greaterThan} and ${BulkWasteQuantityValue.lessThan}`,
    csv: `The waste quantity must be between ${BulkWasteQuantityValue.greaterThan} and ${BulkWasteQuantityValue.lessThan}`,
    api: `The waste quantity must be between ${BulkWasteQuantityValue.greaterThan} and ${BulkWasteQuantityValue.lessThan}`,
  },
  cy: {
    ui: `Rhaid i swm y gwastraff fod rhwng ${BulkWasteQuantityValue.greaterThan} a ${BulkWasteQuantityValue.lessThan}`,
    csv: `Rhaid i swm y gwastraff fod rhwng ${BulkWasteQuantityValue.greaterThan} a ${BulkWasteQuantityValue.lessThan}`,
    api: `Rhaid i swm y gwastraff fod rhwng ${BulkWasteQuantityValue.greaterThan} a ${BulkWasteQuantityValue.lessThan}`,
  },
};

export const invalidSmallWasteQuantity = {
  en: {
    ui: `Enter a weight ${SmallWasteQuantityValue.lessThanOrEqual}kg or under`,
    csv: `Enter a weight ${SmallWasteQuantityValue.lessThanOrEqual}kg or under`,
    api: `Enter a weight ${SmallWasteQuantityValue.lessThanOrEqual}kg or under`,
  },
  cy: {
    ui: `Rhowch bwysau ${SmallWasteQuantityValue.lessThanOrEqual}kg neu lai`,
    csv: `Rhowch bwysau ${SmallWasteQuantityValue.lessThanOrEqual}kg neu lai`,
    api: `Rhowch bwysau ${SmallWasteQuantityValue.lessThanOrEqual}kg neu lai`,
  },
};

export const missingWasteQuantityType = {
  en: {
    ui: "Enter either 'estimate' or 'actual' waste quantity",
    csv: "Enter either 'estimate' or 'actual' waste quantity",
    api: "Enter either 'estimate' or 'actual' waste quantity",
  },
  cy: {
    ui: "Nodwch naill ai swm gwastraff 'amcangyfrif' neu 'gwirioneddol'",
    csv: "Nodwch naill ai swm gwastraff 'amcangyfrif' neu 'gwirioneddol'",
    api: "Nodwch naill ai swm gwastraff 'amcangyfrif' neu 'gwirioneddol'",
  },
};

export const laboratoryWasteQuantity = {
  en: {
    ui: 'Only enter the weight as kilograms if you are sending unlisted waste to a laboratory',
    csv: 'Only enter the weight as kilograms if you are sending unlisted waste to a laboratory',
    api: 'Only enter the weight as kilograms if you are sending unlisted waste to a laboratory',
  },
  cy: {
    ui: 'Rhowch y pwysau fel cilogramau dim ond os ydych yn anfon gwastraff heb ei restru i labordy',
    csv: 'Rhowch y pwysau fel cilogramau dim ond os ydych yn anfon gwastraff heb ei restru i labordy',
    api: 'Rhowch y pwysau fel cilogramau dim ond os ydych yn anfon gwastraff heb ei restru i labordy',
  },
};

export const smallNonKgwasteQuantity = {
  en: {
    ui: 'Unlisted weight can only be measured in kilograms',
    csv: 'Unlisted weight can only be measured in kilograms',
    api: 'Unlisted weight can only be measured in kilograms',
  },
  cy: {
    ui: 'Dim ond mewn cilogramau y gellir mesur pwysau heb ei restru',
    csv: 'Dim ond mewn cilogramau y gellir mesur pwysau heb ei restru',
    api: 'Dim ond mewn cilogramau y gellir mesur pwysau heb ei restru',
  },
};
