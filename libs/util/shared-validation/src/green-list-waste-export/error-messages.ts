import {
  EWCCodesLength,
  UkExitLocationChar,
  WasteDescriptionChar,
} from './constraints';

export const missingTypeCollectionDate = {
  en: {
    csv: "Enter if this is an 'estimate' or 'actual' collection date",
  },
  cy: {
    csv: "Nodwch os yw hwn yn ddyddiad casglu 'amcangyfrif' neu 'gwirioneddol'",
  },
};

export const invalidUnlistedWasteType = {
  en: {
    csv: "Enter 'yes' if you are sending unlisted waste to a laboratory",
  },
  cy: {
    csv: '',
  },
};

export const emptyWasteCodeType = {
  en: {
    csv: 'Enter a waste code',
  },
  cy: {
    csv: '',
  },
};

export const tooManyWasteCodeType = {
  en: {
    csv: 'You can only enter one Basel Annex IX, OECD, Annex IIIA, or Annex IIB code',
  },
  cy: {
    csv: '',
  },
};

export const laboratoryType = {
  en: {
    csv: 'Do not enter a waste code if the waste is going to a laboratory',
  },
  cy: {
    csv: '',
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
    csv: `The location must be less than ${UkExitLocationChar.max} characters`,
    api: `The location must be less than ${UkExitLocationChar.max} characters`,
  },
  cy: {
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

export const transitCountriesInvalidCrossSectionTransitCountry = {
  en: {
    ui: 'The transit country cannot be the same as the importer country',
    csv: 'The transit country cannot be the same as the importer country',
    api: 'The transit country cannot be the same as the importer country',
  },
  cy: {
    ui: 'Ni all y wlad drawsgludo fod yr un fath â’r wlad fewnforio',
    csv: 'Ni all y wlad drawsgludo fod yr un fath â’r wlad fewnforio',
    api: 'Ni all y wlad drawsgludo fod yr un fath â’r wlad fewnforio',
  },
};

export const importerDetailsInvalidCrossSectionTransitCountry = {
  en: {
    ui: 'The importer country cannot be the same as the transit country',
    csv: 'The importer country cannot be the same as the transit country',
    api: 'The importer country cannot be the same as the transit country',
  },
  cy: {
    ui: "Ni all y wlad fewnforiwr fod yr un peth â'r wlad dramwy",
    csv: "Ni all y wlad fewnforiwr fod yr un peth â'r wlad dramwy",
    api: "Ni all y wlad fewnforiwr fod yr un peth â'r wlad dramwy",
  },
};
