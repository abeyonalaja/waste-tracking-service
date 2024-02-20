import { Method } from '@wts/api/common';
import { Response } from '@wts/util/invocation';

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

export type WasteCodeType = { type: string; values: WasteCode[] };

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

export type GetWasteCodesResponse = Response<WasteCodeType[]>;
export type GetEWCCodesResponse = Response<WasteCode[]>;
export type GetCountriesResponse = Response<Country[]>;
export type GetRecoveryCodesResponse = Response<RecoveryCode[]>;
export type GetDisposalCodesResponse = Response<WasteCode[]>;

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
