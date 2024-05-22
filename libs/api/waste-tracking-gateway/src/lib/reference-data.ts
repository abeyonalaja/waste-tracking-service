export interface LanguageDescription {
  en: string;
  cy: string;
}

export interface WasteCode {
  code: string;
  value: {
    description: LanguageDescription;
  };
}

export interface Country {
  name: string;
}

export interface RecoveryCode {
  code: string;
  value: {
    description: LanguageDescription;
    interim: boolean;
  };
}

export interface WasteCodeType {
  type: string;
  values: WasteCode[];
}

export interface Pop {
  name: LanguageDescription;
}

export interface LocalAuthority {
  name: LanguageDescription;
  country: LanguageDescription;
}

export type ListWasteCodesResponse = WasteCodeType[];
export type ListEWCCodesResponse = WasteCode[];
export type ListCountriesResponse = Country[];
export type ListRecoveryCodesResponse = RecoveryCode[];
export type ListDisposalCodesResponse = WasteCode[];
export type ListHazardousCodesResponse = WasteCode[];
export type ListPopsResponse = Pop[];
export type ListlocalAuthoritiesResponse = LocalAuthority[];
