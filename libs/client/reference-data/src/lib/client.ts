import { DaprClient, HttpMethod } from '@dapr/dapr';
import {
  GetWasteCodesResponse,
  GetEWCCodesResponse,
  GetCountriesResponse,
  GetRecoveryCodesResponse,
  GetDisposalCodesResponse,
  getWasteCodes,
  getEWCCodes,
  getCountries,
  getDisposalCodes,
  getRecoveryCodes,
  createWasteCodes,
  CreateWasteCodesRequest,
  CreateWasteCodesResponse,
  CreateEWCCodesRequest,
  CreateEWCCodesResponse,
  createEWCCodes,
  CreateCountriesRequest,
  CreateCountriesResponse,
  createCountries,
  CreateDisposalCodesRequest,
  CreateDisposalCodesResponse,
  CreateRecoveryCodesRequest,
  CreateRecoveryCodesResponse,
  createDisposalCodes,
  createRecoveryCodes,
  GetHazardousCodesResponse,
  getHazardousCodes,
  GetPopsResponse,
  getPops,
  CreateHazardousCodesRequest,
  CreateHazardousCodesResponse,
  createHazardousCodes,
  CreatePopsRequest,
  CreatePopsResponse,
  createPops,
  GetCountriesRequest,
} from '@wts/api/reference-data';

export class DaprReferenceDataClient {
  constructor(
    private daprClient: DaprClient,
    private referenceDataAppId: string
  ) {}

  async getWasteCodes(): Promise<GetWasteCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      getWasteCodes.name,
      HttpMethod.POST
    )) as GetWasteCodesResponse;
  }

  async getEWCCodes(): Promise<GetEWCCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      getEWCCodes.name,
      HttpMethod.POST
    )) as GetEWCCodesResponse;
  }

  async getCountries(req: GetCountriesRequest): Promise<GetCountriesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      getCountries.name,
      HttpMethod.POST,
      req
    )) as GetCountriesResponse;
  }

  async getRecoveryCodes(): Promise<GetRecoveryCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      getRecoveryCodes.name,
      HttpMethod.POST
    )) as GetRecoveryCodesResponse;
  }

  async getDisposalCodes(): Promise<GetDisposalCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      getDisposalCodes.name,
      HttpMethod.POST
    )) as GetDisposalCodesResponse;
  }

  async getHazardousCodes(): Promise<GetHazardousCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      getHazardousCodes.name,
      HttpMethod.POST
    )) as GetDisposalCodesResponse;
  }

  async getPops(): Promise<GetPopsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      getPops.name,
      HttpMethod.POST
    )) as GetPopsResponse;
  }

  async createWasteCodes(
    req: CreateWasteCodesRequest
  ): Promise<CreateWasteCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      createWasteCodes.name,
      HttpMethod.POST,
      req
    )) as CreateWasteCodesResponse;
  }

  async createEWCCodes(
    req: CreateEWCCodesRequest
  ): Promise<CreateEWCCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      createEWCCodes.name,
      HttpMethod.POST,
      req
    )) as CreateEWCCodesResponse;
  }

  async createCountries(
    req: CreateCountriesRequest
  ): Promise<CreateCountriesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      createCountries.name,
      HttpMethod.POST,
      req
    )) as CreateCountriesResponse;
  }

  async createRecoveryCodes(
    req: CreateRecoveryCodesRequest
  ): Promise<CreateRecoveryCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      createRecoveryCodes.name,
      HttpMethod.POST,
      req
    )) as CreateRecoveryCodesResponse;
  }

  async createDisposalCodes(
    req: CreateDisposalCodesRequest
  ): Promise<CreateDisposalCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      createDisposalCodes.name,
      HttpMethod.POST,
      req
    )) as CreateDisposalCodesResponse;
  }

  async createHazardouslCodes(
    req: CreateHazardousCodesRequest
  ): Promise<CreateHazardousCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      createHazardousCodes.name,
      HttpMethod.POST,
      req
    )) as CreateHazardousCodesResponse;
  }

  async createPops(req: CreatePopsRequest): Promise<CreatePopsResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      createPops.name,
      HttpMethod.POST,
      req
    )) as CreatePopsResponse;
  }
}
