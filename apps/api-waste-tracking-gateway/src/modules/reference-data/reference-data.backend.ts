import Boom from '@hapi/boom';
import {
  GetCountriesResponse,
  GetDisposalCodesResponse,
  GetEWCCodesResponse,
  GetHazardousCodesResponse,
  GetPopsResponse,
  GetRecoveryCodesResponse,
  GetWasteCodesResponse,
} from '@wts/api/reference-data';
import * as api from '@wts/api/waste-tracking-gateway';
import { DaprReferenceDataClient } from '@wts/client/reference-data';
import { Logger } from 'winston';

export interface ReferenceDataBackend {
  listWasteCodes(): Promise<api.ListWasteCodesResponse>;
  listEWCCodes(includeHazardous?: boolean): Promise<api.ListEWCCodesResponse>;
  listCountries(includeUk?: boolean): Promise<api.ListCountriesResponse>;
  listRecoveryCodes(): Promise<api.ListRecoveryCodesResponse>;
  listDisposalCodes(): Promise<api.ListDisposalCodesResponse>;
  listHazardousCodes(): Promise<api.ListHazardousCodesResponse>;
  listPops(): Promise<api.ListPopsResponse>;
}

export class ReferenceDataServiceBackend implements ReferenceDataBackend {
  constructor(
    private client: DaprReferenceDataClient,
    private logger: Logger
  ) {}

  async listWasteCodes(): Promise<api.ListWasteCodesResponse> {
    let response: GetWasteCodesResponse;
    try {
      response = await this.client.getWasteCodes();
    } catch (error) {
      this.logger.error(error);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
    return response.value;
  }

  async listEWCCodes(
    includeHazardous?: boolean
  ): Promise<api.ListEWCCodesResponse> {
    let response: GetEWCCodesResponse;
    try {
      response = await this.client.getEWCCodes({ includeHazardous });
    } catch (error) {
      this.logger.error(error);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
    return response.value;
  }

  async listCountries(includeUk?: boolean): Promise<api.ListCountriesResponse> {
    let response: GetCountriesResponse;
    try {
      response = await this.client.getCountries({ includeUk });
    } catch (error) {
      this.logger.error(error);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
    return response.value;
  }

  async listRecoveryCodes(): Promise<api.ListRecoveryCodesResponse> {
    let response: GetRecoveryCodesResponse;
    try {
      response = await this.client.getRecoveryCodes();
    } catch (error) {
      this.logger.error(error);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
    return response.value;
  }

  async listDisposalCodes(): Promise<api.ListDisposalCodesResponse> {
    let response: GetDisposalCodesResponse;
    try {
      response = await this.client.getDisposalCodes();
    } catch (error) {
      this.logger.error(error);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
    return response.value;
  }

  async listHazardousCodes(): Promise<api.ListHazardousCodesResponse> {
    let response: GetHazardousCodesResponse;
    try {
      response = await this.client.getHazardousCodes();
    } catch (error) {
      this.logger.error(error);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
    return response.value;
  }

  async listPops(): Promise<api.ListPopsResponse> {
    let response: GetPopsResponse;
    try {
      response = await this.client.getPops();
    } catch (error) {
      this.logger.error(error);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
    return response.value;
  }
}
