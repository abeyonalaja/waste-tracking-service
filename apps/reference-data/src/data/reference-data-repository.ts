import {
  CreateCountriesRequest,
  CreateCountriesResponse,
  CreateDisposalCodeRequest,
  CreateDisposalCodeResponse,
  CreateDisposalCodesRequest,
  CreateDisposalCodesResponse,
  CreateEWCCodeRequest,
  CreateEWCCodeResponse,
  CreateEWCCodesRequest,
  CreateEWCCodesResponse,
  CreateRecoveryCodeRequest,
  CreateRecoveryCodeResponse,
  CreateRecoveryCodesRequest,
  CreateRecoveryCodesResponse,
  CreateWasteCodeRequest,
  CreateWasteCodeResponse,
  CreateWasteCodesRequest,
  CreateWasteCodesResponse,
  DeleteDisposalCodeRequest,
  DeleteDisposalCodeResponse,
  DeleteEWCCodeRequest,
  DeleteEWCCodeResponse,
  DeleteRecoveryCodeRequest,
  DeleteRecoveryCodeResponse,
  DeleteWasteCodeRequest,
  DeleteWasteCodeResponse,
  UpdateCountriesRequest,
  UpdateCountriesResponse,
  UpdateDisposalCodeRequest,
  UpdateDisposalCodeResponse,
  UpdateDisposalCodesRequest,
  UpdateDisposalCodesResponse,
  UpdateEWCCodeRequest,
  UpdateEWCCodeResponse,
  UpdateEWCCodesRequest,
  UpdateEWCCodesResponse,
  UpdateRecoveryCodeRequest,
  UpdateRecoveryCodeResponse,
  UpdateRecoveryCodesRequest,
  UpdateRecoveryCodesResponse,
  UpdateWasteCodeRequest,
  UpdateWasteCodeResponse,
  UpdateWasteCodesRequest,
  UpdateWasteCodesResponse,
} from '@wts/api/reference-data';
import { Country, RecoveryCode, WasteCode, WasteCodeType } from '../model';

export interface ReferenceDataRepository {
  listWasteCodes(): Promise<WasteCodeType[]>;
  listEWCCodes(): Promise<WasteCode[]>;
  listCountries(): Promise<Country[]>;
  listRecoveryCodes(): Promise<RecoveryCode[]>;
  listDisposalCodes(): Promise<WasteCode[]>;
  createWasteCodes(
    createWasteCodesRequest: CreateWasteCodesRequest
  ): Promise<CreateWasteCodesResponse>;
  updateWasteCodes(
    updateWasteCodesRequest: UpdateWasteCodesRequest
  ): Promise<UpdateWasteCodesResponse>;
  deleteWasteCodes(): Promise<void>;
  createWasteCode(
    createWasteCodeRequest: CreateWasteCodeRequest
  ): Promise<CreateWasteCodeResponse>;
  updateWasteCode(
    updateWasteCodeRequest: UpdateWasteCodeRequest
  ): Promise<UpdateWasteCodeResponse>;
  deleteWasteCode(
    deleteWasteCodeRequest: DeleteWasteCodeRequest
  ): Promise<DeleteWasteCodeResponse>;
  createEWCCodes(
    createEWCCodesRequest: CreateEWCCodesRequest
  ): Promise<CreateEWCCodesResponse>;
  updateEWCCodes(
    updateEWCCodesRequest: UpdateEWCCodesRequest
  ): Promise<UpdateEWCCodesResponse>;
  deleteEWCCodes(): Promise<void>;
  createEWCCode(
    createEWCCodeRequest: CreateEWCCodeRequest
  ): Promise<CreateEWCCodeResponse>;
  updateEWCCode(
    updateEWCCodeRequest: UpdateEWCCodeRequest
  ): Promise<UpdateEWCCodeResponse>;
  deleteEWCCode(
    deleteEWCCodeRequest: DeleteEWCCodeRequest
  ): Promise<DeleteEWCCodeResponse>;
  createCountries(
    createCountriesRequest: CreateCountriesRequest
  ): Promise<CreateCountriesResponse>;
  updateCountries(
    updateCountriesRequest: UpdateCountriesRequest
  ): Promise<UpdateCountriesResponse>;
  deleteCountries(): Promise<void>;
  createRecoveryCodes(
    createRecoveryCodesRequest: CreateRecoveryCodesRequest
  ): Promise<CreateRecoveryCodesResponse>;
  updateRecoveryCodes(
    updateRecoveryCodesRequest: UpdateRecoveryCodesRequest
  ): Promise<UpdateRecoveryCodesResponse>;
  deleteRecoveryCodes(): Promise<void>;
  createRecoveryCode(
    createRecoveryCodeRequest: CreateRecoveryCodeRequest
  ): Promise<CreateRecoveryCodeResponse>;
  updateRecoveryCode(
    updateRecoveryCodeRequest: UpdateRecoveryCodeRequest
  ): Promise<UpdateRecoveryCodeResponse>;
  deleteRecoveryCode(
    deleteRecoveryCodeRequest: DeleteRecoveryCodeRequest
  ): Promise<DeleteRecoveryCodeResponse>;
  createDisposalCodes(
    createDisposalCodesRequest: CreateDisposalCodesRequest
  ): Promise<CreateDisposalCodesResponse>;
  updateDisposalCodes(
    updateDisposalCodesRequest: UpdateDisposalCodesRequest
  ): Promise<UpdateDisposalCodesResponse>;
  deleteDisposalCodes(): Promise<void>;
  createDisposalCode(
    createDisposalCodeRequest: CreateDisposalCodeRequest
  ): Promise<CreateDisposalCodeResponse>;
  updateDisposalCode(
    updateDisposalCodeRequest: UpdateDisposalCodeRequest
  ): Promise<UpdateDisposalCodeResponse>;
  deleteDisposalCode(
    deleteDisposalCodeRequest: DeleteDisposalCodeRequest
  ): Promise<DeleteDisposalCodeResponse>;
}
