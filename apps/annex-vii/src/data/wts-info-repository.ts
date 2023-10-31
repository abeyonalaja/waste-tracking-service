import { Country, RecoveryCode, WasteCode, WasteCodeType } from '../model';

export interface WTSInfoRepository {
  listWasteCodes(language: string): Promise<WasteCodeType[]>;
  listEWCCodes(language: string): Promise<WasteCode[]>;
  listCountries(): Promise<Country[]>;
  listRecoveryCodes(language: string): Promise<RecoveryCode[]>;
  listDisposalCodes(language: string): Promise<WasteCode[]>;
}
