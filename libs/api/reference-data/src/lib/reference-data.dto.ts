import { Method } from '@wts/api/common';
import { Response } from '@wts/util/invocation';

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
  httpVerb: 'GET',
};

export const getEWCCodes: Method = {
  name: 'getEWCCodes',
  httpVerb: 'GET',
};

export const getCountries: Method = {
  name: 'getCountries',
  httpVerb: 'GET',
};

export const getRecoveryCodes: Method = {
  name: 'getRecoveryCodes',
  httpVerb: 'GET',
};

export const getDisposalCodes: Method = {
  name: 'getDisposalCodes',
  httpVerb: 'GET',
};

export const getHazardousCodes: Method = {
  name: 'getHazardousCodes',
  httpVerb: 'GET',
};

export const getPops: Method = {
  name: 'getPops',
  httpVerb: 'GET',
};

export const getLocalAuthorities: Method = {
  name: 'getLocalAuthorities',
  httpVerb: 'GET',
};

export const createWasteCodes: Method = {
  name: 'createWasteCodes',
  httpVerb: 'GET',
};

export const createEWCCodes: Method = {
  name: 'createEWCCodes',
  httpVerb: 'GET',
};

export const createCountries: Method = {
  name: 'createCountries',
  httpVerb: 'GET',
};

export const createRecoveryCodes: Method = {
  name: 'createRecoveryCodes',
  httpVerb: 'GET',
};

export const createDisposalCodes: Method = {
  name: 'createDisposalCodes',
  httpVerb: 'GET',
};

export const createHazardousCodes: Method = {
  name: 'createHazardousCodes',
  httpVerb: 'GET',
};

export const createPops: Method = {
  name: 'createPops',
  httpVerb: 'GET',
};
