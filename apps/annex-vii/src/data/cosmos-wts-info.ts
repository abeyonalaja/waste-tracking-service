import Boom from '@hapi/boom';
import { Logger } from 'winston';
import { CosmosAnnexViiClient } from '../clients';
import { WTSInfoRepository } from './wts-info-repository';
import {
  Country,
  RecoveryCode,
  WasteCode,
  WasteCodeType,
} from '@wts/api/annex-vii';

type dbValues = {
  code: string;
  en: string;
  cy: string;
  interim: boolean;
  isoCode: string;
};

type dbTypes = {
  type: string;
  values: dbValues[];
};

function getWasteCodeTypesInLanguage(
  source: dbTypes[],
  language: string
): WasteCodeType[] {
  const types: WasteCodeType[] = [];
  let codes: WasteCode[] = [];
  for (const type in source) {
    const item = source[type];
    codes = getWasteCodesInLanguage(item.values, language);
    const translatedType = { type: item.type, values: codes };
    types.push(translatedType as unknown as WasteCodeType);
  }

  return types;
}

function getWasteCodesInLanguage(
  source: dbValues[],
  language: string
): WasteCode[] {
  const wasteCodes: WasteCode[] = [];
  if (language === 'en') {
    for (const code in source) {
      const item = source[code];
      wasteCodes.push({ code: item.code, description: item.en });
    }
  } else {
    for (const code in source) {
      const item = source[code];
      wasteCodes.push({ code: item.code, description: item.cy });
    }
  }

  return wasteCodes;
}

function getRecoveryCodesInLanguage(
  source: dbValues[],
  language: string
): RecoveryCode[] {
  const recoveryCodes: RecoveryCode[] = [];
  if (language === 'en') {
    for (const code in source) {
      const item = source[code];
      recoveryCodes.push({
        code: item.code,
        description: item.en,
        interim: item.interim,
      });
    }
  } else {
    for (const code in source) {
      const item = source[code];
      recoveryCodes.push({
        code: item.code,
        description: item.cy,
        interim: item.interim,
      });
    }
  }

  return recoveryCodes;
}

export default class CosmosWTSInfoRepository implements WTSInfoRepository {
  constructor(
    private cosmosClient: CosmosAnnexViiClient,
    private logger: Logger
  ) {}

  containerName = 'reference-data';

  async listWasteCodes(language: string): Promise<WasteCodeType[]> {
    const results = await this.cosmosClient.queryContainerNext(
      this.containerName,
      { query: `SELECT * FROM c OFFSET 0 LIMIT 1` },
      { partitionKey: 'waste-codes' }
    );

    if (results === undefined) {
      throw Boom.notFound('Waste Codes do not exist in db !');
    }

    return getWasteCodeTypesInLanguage(results.results[0].values, language);
  }

  async listEWCCodes(language: string): Promise<WasteCode[]> {
    const results = await this.cosmosClient.queryContainerNext(
      this.containerName,
      { query: `SELECT * FROM c OFFSET 0 LIMIT 1` },
      { partitionKey: 'ewc-codes' }
    );

    if (results === undefined) {
      throw Boom.notFound('EWC Codes do not exist in db !');
    }

    return getWasteCodesInLanguage(results.results[0].values, language);
  }

  async listCountries(): Promise<Country[]> {
    const results = await this.cosmosClient.queryContainerNext(
      this.containerName,
      { query: `SELECT * FROM c OFFSET 0 LIMIT 1` },
      { partitionKey: 'countries' }
    );

    if (results === undefined) {
      throw Boom.notFound('Country list does not exist in db !');
    }

    return results.results[0].values;
  }

  async listRecoveryCodes(language: string): Promise<RecoveryCode[]> {
    const results = await this.cosmosClient.queryContainerNext(
      this.containerName,
      { query: `SELECT * FROM c OFFSET 0 LIMIT 1` },
      { partitionKey: 'recovery-codes' }
    );

    if (results === undefined) {
      throw Boom.notFound('Recovery codes do not exist in db !');
    }

    return getRecoveryCodesInLanguage(results.results[0].values, language);
  }

  async listDisposalCodes(language: string): Promise<WasteCode[]> {
    const results = await this.cosmosClient.queryContainerNext(
      this.containerName,
      { query: `SELECT * FROM c OFFSET 0 LIMIT 1` },
      { partitionKey: 'disposal-codes' }
    );

    if (results === undefined) {
      throw Boom.notFound('Disposal codes do not exist in db !');
    }

    return getWasteCodesInLanguage(results.results[0].values, language);
  }
}
