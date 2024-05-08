export type LanguageDescription = {
  en: string;
  cy: string;
};

export type WasteCode = {
  code: string;
  value: {
    description: LanguageDescription;
  };
};

export type Country = {
  name: string;
};

export type RecoveryCode = {
  code: string;
  value: {
    description: LanguageDescription;
    interim: boolean;
  };
};

export type WasteCodeType = { type: string; values: WasteCode[] };

export type Pop = {
  name: LanguageDescription;
};

export type LocalAuthority = {
  name: LanguageDescription;
  country: LanguageDescription;
};

export type ListWasteCodesResponse = WasteCodeType[];
export type ListEWCCodesResponse = WasteCode[];
export type ListCountriesResponse = Country[];
export type ListRecoveryCodesResponse = RecoveryCode[];
export type ListDisposalCodesResponse = WasteCode[];
export type ListHazardousCodesResponse = WasteCode[];
export type ListPopsResponse = Pop[];
export type ListlocalAuthoritiesResponse = LocalAuthority[];
