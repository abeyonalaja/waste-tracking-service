import { Response } from '@wts/util/invocation';

export type Method = Readonly<{
  name: string;
  httpVerb: 'GET' | 'PUT' | 'POST' | 'DELETE';
}>;

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
export type CreateWasteCodesResponse = Response<CreateWasteCodesRequest>;

export type UpdateWasteCodesRequest = WasteCodeType[];
export type UpdateWasteCodesResponse = Response<UpdateWasteCodesRequest>;

export type DeleteWasteCodesResponse = Response<void>;

export type CreateWasteCodeRequest = {
  type: string;
  code: string;
  value: {
    description: LanguageDescription;
  };
};
export type CreateWasteCodeResponse = Response<CreateWasteCodeRequest>;

export type UpdateWasteCodeRequest = {
  type: string;
  code: string;
  value: {
    description: LanguageDescription;
  };
};
export type UpdateWasteCodeResponse = Response<UpdateWasteCodeRequest>;

export type DeleteWasteCodeRequest = { type: string; code: string };
export type DeleteWasteCodeResponse = Response<DeleteWasteCodeRequest>;

export type CreateEWCCodesRequest = WasteCode[];
export type CreateEWCCodesResponse = Response<CreateEWCCodesRequest>;

export type UpdateEWCCodesRequest = WasteCode[];
export type UpdateEWCCodesResponse = Response<UpdateEWCCodesRequest>;

export type DeleteEWCCodesResponse = Response<void>;

export type CreateEWCCodeRequest = WasteCode;
export type CreateEWCCodeResponse = Response<CreateEWCCodeRequest>;

export type UpdateEWCCodeRequest = WasteCode;
export type UpdateEWCCodeResponse = Response<UpdateEWCCodeRequest>;

export type DeleteEWCCodeRequest = { code: string };
export type DeleteEWCCodeResponse = Response<DeleteEWCCodeRequest>;

export type CreateCountriesRequest = Country[];
export type CreateCountriesResponse = Response<CreateCountriesRequest>;

export type UpdateCountriesRequest = Country[];
export type UpdateCountriesResponse = Response<UpdateCountriesRequest>;

export type DeleteCountriesResponse = Response<void>;

export type CreateRecoveryCodesRequest = RecoveryCode[];
export type CreateRecoveryCodesResponse = Response<CreateRecoveryCodesRequest>;

export type UpdateRecoveryCodesRequest = RecoveryCode[];
export type UpdateRecoveryCodesResponse = Response<UpdateRecoveryCodesRequest>;

export type DeleteRecoveryCodesResponse = Response<void>;

export type CreateRecoveryCodeRequest = RecoveryCode;
export type CreateRecoveryCodeResponse = Response<CreateRecoveryCodeRequest>;

export type UpdateRecoveryCodeRequest = RecoveryCode;
export type UpdateRecoveryCodeResponse = Response<UpdateRecoveryCodeRequest>;

export type DeleteRecoveryCodeRequest = { code: string };
export type DeleteRecoveryCodeResponse = Response<DeleteRecoveryCodeRequest>;

export type CreateDisposalCodesRequest = WasteCode[];
export type CreateDisposalCodesResponse = Response<CreateDisposalCodesRequest>;

export type UpdateDisposalCodesRequest = WasteCode[];
export type UpdateDisposalCodesResponse = Response<UpdateDisposalCodesRequest>;

export type DeleteDisposalCodesResponse = Response<void>;

export type CreateDisposalCodeRequest = WasteCode;
export type CreateDisposalCodeResponse = Response<CreateDisposalCodeRequest>;

export type UpdateDisposalCodeRequest = WasteCode;
export type UpdateDisposalCodeResponse = Response<UpdateDisposalCodeRequest>;

export type DeleteDisposalCodeRequest = { code: string };
export type DeleteDisposalCodeResponse = Response<DeleteDisposalCodeRequest>;

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

export const updateWasteCodes: Method = {
  name: 'updateWasteCodes',
  httpVerb: 'GET',
};

export const deleteWasteCodes: Method = {
  name: 'deleteWasteCodes',
  httpVerb: 'GET',
};

export const createWasteCode: Method = {
  name: 'createWasteCode',
  httpVerb: 'GET',
};

export const updateWasteCode: Method = {
  name: 'updateWasteCode',
  httpVerb: 'GET',
};

export const deleteWasteCode: Method = {
  name: 'deleteWasteCode',
  httpVerb: 'GET',
};

export const createEWCCodes: Method = {
  name: 'createEWCCodes',
  httpVerb: 'GET',
};

export const updateEWCCodes: Method = {
  name: 'updateEWCCodes',
  httpVerb: 'GET',
};

export const deleteEWCCodes: Method = {
  name: 'deleteEWCCodes',
  httpVerb: 'GET',
};

export const createEWCCode: Method = {
  name: 'createEWCCode',
  httpVerb: 'GET',
};

export const updateEWCCode: Method = {
  name: 'updateEWCCode',
  httpVerb: 'GET',
};

export const deleteEWCCode: Method = {
  name: 'deleteEWCCode',
  httpVerb: 'GET',
};

export const createCountries: Method = {
  name: 'createCountries',
  httpVerb: 'GET',
};

export const updateCountries: Method = {
  name: 'updateCountries',
  httpVerb: 'GET',
};

export const deleteCountries: Method = {
  name: 'deleteCountries',
  httpVerb: 'GET',
};

export const createRecoveryCodes: Method = {
  name: 'createRecoveryCodes',
  httpVerb: 'GET',
};

export const updateRecoveryCodes: Method = {
  name: 'updateRecoveryCodes',
  httpVerb: 'GET',
};

export const deleteRecoveryCodes: Method = {
  name: 'deleteRecoveryCodes',
  httpVerb: 'GET',
};

export const createRecoveryCode: Method = {
  name: 'createRecoveryCode',
  httpVerb: 'GET',
};

export const updateRecoveryCode: Method = {
  name: 'updateRecoveryCode',
  httpVerb: 'GET',
};

export const deleteRecoveryCode: Method = {
  name: 'deleteRecoveryCode',
  httpVerb: 'GET',
};

export const createDisposalCodes: Method = {
  name: 'createDisposalCodes',
  httpVerb: 'GET',
};

export const updateDisposalCodes: Method = {
  name: 'updateDisposalCodes',
  httpVerb: 'GET',
};

export const deleteDisposalCodes: Method = {
  name: 'deleteDisposalCodes',
  httpVerb: 'GET',
};

export const createDisposalCode: Method = {
  name: 'createDisposalCode',
  httpVerb: 'GET',
};

export const updateDisposalCode: Method = {
  name: 'updateDisposalCode',
  httpVerb: 'GET',
};

export const deleteDisposalCode: Method = {
  name: 'deleteDisposalCode',
  httpVerb: 'GET',
};
