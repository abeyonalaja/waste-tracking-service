type WasteCode = {
  code: string;
  description: string;
};

type Country = {
  name: string;
};

type RecoveryCode = WasteCode & {
  interim: boolean;
};

export type WasteCodeType = [type: string, values: WasteCode[]];

export type ListWasteCodesResponse = WasteCodeType[];
export type ListEWCCodesResponse = WasteCode[];
export type ListCountriesResponse = Country[];
export type ListRecoveryCodesResponse = RecoveryCode[];
export type ListDisposalCodesResponse = WasteCode[];

export type ListAllWasteCodesRequest = {
  language: string;
  type: string;
};
export type ListWasteCodesRequest = {
  type: string;
};
export type ListEWCCodesRequest = {
  language: string;
};
export type ListRecoveryCodesRequest = {
  language: string;
};
export type ListDisposalCodesRequest = {
  language: string;
};
