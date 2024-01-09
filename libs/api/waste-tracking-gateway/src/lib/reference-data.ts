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

export type ListWasteCodesResponse = WasteCodeType[];
export type ListEWCCodesResponse = WasteCode[];
export type ListCountriesResponse = Country[];
export type ListRecoveryCodesResponse = RecoveryCode[];
export type ListDisposalCodesResponse = WasteCode[];

export type CreateWasteCodesRequest = WasteCodeType[];
export type CreateWasteCodesResponse = CreateWasteCodesRequest;

export type UpdateWasteCodesRequest = WasteCodeType[];
export type UpdateWasteCodesResponse = UpdateWasteCodesRequest;

export type CreateWasteCodeRequest = {
  type: string;
  code: string;
  value: {
    description: LanguageDescription;
  };
};
export type CreateWasteCodeResponse = CreateWasteCodeRequest;

export type UpdateWasteCodeRequest = {
  type: string;
  code: string;
  value: {
    description: LanguageDescription;
  };
};
export type UpdateWasteCodeResponse = UpdateWasteCodeRequest;

export type DeleteWasteCodeRequest = { type: string; code: string };
export type DeleteWasteCodeResponse = DeleteWasteCodeRequest;

export type CreateEWCCodesRequest = WasteCode[];
export type CreateEWCCodesResponse = CreateEWCCodesRequest;

export type UpdateEWCCodesRequest = WasteCode[];
export type UpdateEWCCodesResponse = UpdateEWCCodesRequest;

export type CreateEWCCodeRequest = WasteCode;
export type CreateEWCCodeResponse = CreateEWCCodeRequest;

export type UpdateEWCCodeRequest = WasteCode;
export type UpdateEWCCodeResponse = UpdateEWCCodeRequest;

export type DeleteEWCCodeRequest = { code: string };
export type DeleteEWCCodeResponse = DeleteEWCCodeRequest;

export type CreateCountriesRequest = Country[];
export type CreateCountriesResponse = CreateCountriesRequest;

export type UpdateCountriesRequest = Country[];
export type UpdateCountriesResponse = UpdateCountriesRequest;

export type CreateRecoveryCodesRequest = RecoveryCode[];
export type CreateRecoveryCodesResponse = CreateRecoveryCodesRequest;

export type UpdateRecoveryCodesRequest = RecoveryCode[];
export type UpdateRecoveryCodesResponse = UpdateRecoveryCodesRequest;

export type CreateRecoveryCodeRequest = RecoveryCode;
export type CreateRecoveryCodeResponse = CreateRecoveryCodeRequest;

export type UpdateRecoveryCodeRequest = RecoveryCode;
export type UpdateRecoveryCodeResponse = UpdateRecoveryCodeRequest;

export type DeleteRecoveryCodeRequest = { code: string };
export type DeleteRecoveryCodeResponse = DeleteRecoveryCodeRequest;

export type CreateDisposalCodesRequest = WasteCode[];
export type CreateDisposalCodesResponse = CreateDisposalCodesRequest;

export type UpdateDisposalCodesRequest = WasteCode[];
export type UpdateDisposalCodesResponse = UpdateDisposalCodesRequest;

export type CreateDisposalCodeRequest = WasteCode;
export type CreateDisposalCodeResponse = CreateDisposalCodeRequest;

export type UpdateDisposalCodeRequest = WasteCode;
export type UpdateDisposalCodeResponse = UpdateDisposalCodeRequest;

export type DeleteDisposalCodeRequest = { code: string };
export type DeleteDisposalCodeResponse = DeleteDisposalCodeRequest;
