import {
  ListCountriesResponse,
  ListDisposalCodesResponse,
  ListEWCCodesResponse,
  ListRecoveryCodesResponse,
  ListWasteCodesResponse,
} from '@wts/api/waste-tracking-gateway';
import { DB } from '../../db';

export async function listWasteCodes(db: DB): Promise<ListWasteCodesResponse> {
  const wasteCodes: ListWasteCodesResponse = db.wasteCodes;
  return wasteCodes;
}

export async function listEWCCodes(db: DB): Promise<ListEWCCodesResponse> {
  const ewcCodes: ListEWCCodesResponse = db.ewcCodes;
  return ewcCodes;
}

export async function listCountries(db: DB): Promise<ListCountriesResponse> {
  const countries: ListCountriesResponse = db.countries;
  return countries;
}

export async function listRecoveryCodes(
  db: DB
): Promise<ListRecoveryCodesResponse> {
  const recoveryCodes: ListRecoveryCodesResponse = db.recoveryCodes;
  return recoveryCodes;
}

export async function listDisposalCodes(
  db: DB
): Promise<ListDisposalCodesResponse> {
  const disposalCodes: ListDisposalCodesResponse = db.disposalCodes;
  return disposalCodes;
}
