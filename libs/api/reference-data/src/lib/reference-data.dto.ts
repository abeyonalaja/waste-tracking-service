import { Response } from '@wts/util/invocation';

export type Method = Readonly<{
  name: string;
}>;

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

export interface WasteCodeType {
  type: string;
  values: WasteCode[];
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

export interface Pop {
  name: LanguageDescription;
}
export interface LocalAuthority {
  name: LanguageDescription;
  country: LanguageDescription;
}

export interface GetCountriesRequest {
  includeUk?: boolean;
}

export interface GetEWCCodesRequest {
  includeHazardous?: boolean;
}

export type GetWasteCodesResponse = Response<WasteCodeType[]>;
export type GetEWCCodesResponse = Response<WasteCode[]>;
export type GetCountriesResponse = Response<Country[]>;
export type GetRecoveryCodesResponse = Response<RecoveryCode[]>;
export type GetDisposalCodesResponse = Response<WasteCode[]>;
export type GetHazardousCodesResponse = Response<WasteCode[]>;
export type GetPopsResponse = Response<Pop[]>;
export type GetLocalAuthoritiesResponse = Response<LocalAuthority[]>;

export type CreateWasteCodesRequest = WasteCodeType[];
export type CreateWasteCodesResponse = Response<WasteCodeType[]>;
export type CreateEWCCodesRequest = WasteCode[];
export type CreateEWCCodesResponse = Response<WasteCode[]>;
export type CreateCountriesRequest = Country[];
export type CreateCountriesResponse = Response<Country[]>;
export type CreateRecoveryCodesRequest = RecoveryCode[];
export type CreateRecoveryCodesResponse = Response<RecoveryCode[]>;
export type CreateDisposalCodesRequest = WasteCode[];
export type CreateDisposalCodesResponse = Response<WasteCode[]>;
export type CreateHazardousCodesRequest = WasteCode[];
export type CreateHazardousCodesResponse = Response<WasteCode[]>;
export type CreatePopsRequest = Pop[];
export type CreatePopsResponse = Response<Pop[]>;

export const getWasteCodes: Method = {
  name: 'getWasteCodes',
};

export const getEWCCodes: Method = {
  name: 'getEWCCodes',
};

export const getCountries: Method = {
  name: 'getCountries',
};

export const getRecoveryCodes: Method = {
  name: 'getRecoveryCodes',
};

export const getDisposalCodes: Method = {
  name: 'getDisposalCodes',
};

export const getHazardousCodes: Method = {
  name: 'getHazardousCodes',
};

export const getPops: Method = {
  name: 'getPops',
};

export const getLocalAuthorities: Method = {
  name: 'getLocalAuthorities',
};

export const createWasteCodes: Method = {
  name: 'createWasteCodes',
};

export const createEWCCodes: Method = {
  name: 'createEWCCodes',
};

export const createCountries: Method = {
  name: 'createCountries',
};

export const createRecoveryCodes: Method = {
  name: 'createRecoveryCodes',
};

export const createDisposalCodes: Method = {
  name: 'createDisposalCodes',
};

export const createHazardousCodes: Method = {
  name: 'createHazardousCodes',
};

export const createPops: Method = {
  name: 'createPops',
};
