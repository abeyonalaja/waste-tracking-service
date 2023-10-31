import { Response } from '@wts/util/invocation';

export type Method = Readonly<{
  name: string;
  httpVerb: 'GET' | 'PUT' | 'POST' | 'DELETE';
}>;

export type WasteCode = {
  code: string;
  description: string;
};

export type Country = {
  name: string;
};

export type RecoveryCode = WasteCode & {
  interim: boolean;
};

export type GetAllWasteCodesRequest = {
  language: string;
};

export type GetWasteCodesRequest = {
  language: string;
};

export type GetEWCCodesRequest = {
  language: string;
};

export type GetRecoveryCodesRequest = {
  language: string;
};

export type GetDisposalCodesRequest = {
  language: string;
};

export type WasteCodeType = [type: string, values: WasteCode[]];

export type GetWasteCodesResponse = Response<WasteCodeType[]>;
export type GetEWCCodesResponse = Response<WasteCode[]>;
export type GetCountriesResponse = Response<Country[]>;
export type GetRecoveryCodesResponse = Response<RecoveryCode[]>;
export type GetDisposalCodesResponse = Response<WasteCode[]>;

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
