export {
  getWasteCodes,
  getEWCCodes,
  getCountries,
  getRecoveryCodes,
  getDisposalCodes,
  createWasteCodes,
  createEWCCodes,
  createCountries,
  createRecoveryCodes,
  createDisposalCodes,
} from './reference-data.dto';

export type {
  WasteCode,
  WasteCodeType,
  Country,
  RecoveryCode,
  GetWasteCodesResponse,
  GetEWCCodesResponse,
  GetCountriesResponse,
  GetRecoveryCodesResponse,
  GetDisposalCodesResponse,
  CreateWasteCodesRequest,
  CreateWasteCodesResponse,
  CreateEWCCodesRequest,
  CreateEWCCodesResponse,
  CreateCountriesRequest,
  CreateCountriesResponse,
  CreateRecoveryCodesRequest,
  CreateRecoveryCodesResponse,
  CreateDisposalCodesRequest,
  CreateDisposalCodesResponse,
} from './reference-data.dto';

export * as referenceDataSchema from './reference-data.schema';
