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
  CreateWasteCodeRequest,
  CreateWasteCodeResponse,
  createWasteCode,
  DeleteWasteCodeRequest,
  DeleteWasteCodeResponse,
  UpdateWasteCodeRequest,
  UpdateWasteCodeResponse,
  deleteWasteCode,
  updateWasteCode,
  CreateEWCCodeRequest,
  CreateEWCCodeResponse,
  DeleteEWCCodeRequest,
  DeleteEWCCodeResponse,
  UpdateEWCCodeRequest,
  UpdateEWCCodeResponse,
  CreateRecoveryCodeRequest,
  CreateRecoveryCodeResponse,
  DeleteRecoveryCodeRequest,
  DeleteRecoveryCodeResponse,
  UpdateRecoveryCodeRequest,
  UpdateRecoveryCodeResponse,
  CreateDisposalCodeRequest,
  CreateDisposalCodeResponse,
  DeleteDisposalCodeRequest,
  DeleteDisposalCodeResponse,
  UpdateDisposalCodeRequest,
  UpdateDisposalCodeResponse,
  createEWCCode,
  deleteEWCCode,
  updateEWCCode,
  createRecoveryCode,
  deleteRecoveryCode,
  updateRecoveryCode,
  createDisposalCode,
  deleteDisposalCode,
  updateDisposalCode,
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
  UpdateEWCCodesRequest,
  UpdateEWCCodesResponse,
  updateEWCCodes,
  updateWasteCodes,
  UpdateWasteCodesRequest,
  UpdateWasteCodesResponse,
  DeleteWasteCodesResponse,
  deleteWasteCodes,
  DeleteEWCCodesResponse,
  deleteEWCCodes,
  DeleteCountriesResponse,
  DeleteDisposalCodesResponse,
  DeleteRecoveryCodesResponse,
  UpdateCountriesRequest,
  UpdateCountriesResponse,
  UpdateDisposalCodesRequest,
  UpdateDisposalCodesResponse,
  UpdateRecoveryCodesRequest,
  UpdateRecoveryCodesResponse,
  deleteCountries,
  deleteDisposalCodes,
  deleteRecoveryCodes,
  updateCountries,
  updateDisposalCodes,
  updateRecoveryCodes,
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

  async getCountries(): Promise<GetCountriesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      getCountries.name,
      HttpMethod.POST
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

  async createWasteCodes(
    req: CreateWasteCodesRequest
  ): Promise<CreateWasteCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      createWasteCodes.name,
      HttpMethod.POST,
      req
    )) as Promise<CreateWasteCodesResponse>;
  }

  async updateWasteCodes(
    req: UpdateWasteCodesRequest
  ): Promise<UpdateWasteCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      updateWasteCodes.name,
      HttpMethod.POST,
      req
    )) as Promise<CreateWasteCodesResponse>;
  }

  async deleteWasteCodes(): Promise<DeleteWasteCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      deleteWasteCodes.name,
      HttpMethod.POST
    )) as Promise<DeleteWasteCodesResponse>;
  }

  async createWasteCode(
    req: CreateWasteCodeRequest
  ): Promise<CreateWasteCodeResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      createWasteCode.name,
      HttpMethod.POST,
      req
    )) as Promise<CreateWasteCodeResponse>;
  }

  async updateWasteCode(
    req: UpdateWasteCodeRequest
  ): Promise<UpdateWasteCodeResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      updateWasteCode.name,
      HttpMethod.POST,
      req
    )) as Promise<UpdateWasteCodeResponse>;
  }

  async deleteWasteCode(
    req: DeleteWasteCodeRequest
  ): Promise<DeleteWasteCodeResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      deleteWasteCode.name,
      HttpMethod.POST,
      req
    )) as Promise<DeleteWasteCodeResponse>;
  }

  async createEWCCodes(
    req: CreateEWCCodesRequest
  ): Promise<CreateEWCCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      createEWCCodes.name,
      HttpMethod.POST,
      req
    )) as Promise<CreateEWCCodesResponse>;
  }

  async updateEWCCodes(
    req: UpdateEWCCodesRequest
  ): Promise<UpdateEWCCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      updateEWCCodes.name,
      HttpMethod.POST,
      req
    )) as Promise<UpdateEWCCodesResponse>;
  }

  async deleteEWCCodes(): Promise<DeleteEWCCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      deleteEWCCodes.name,
      HttpMethod.POST
    )) as Promise<DeleteEWCCodesResponse>;
  }

  async createEWCCode(
    req: CreateEWCCodeRequest
  ): Promise<CreateEWCCodeResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      createEWCCode.name,
      HttpMethod.POST,
      req
    )) as Promise<CreateEWCCodeResponse>;
  }

  async updateEWCCode(
    req: UpdateEWCCodeRequest
  ): Promise<UpdateEWCCodeResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      updateEWCCode.name,
      HttpMethod.POST,
      req
    )) as Promise<UpdateEWCCodeResponse>;
  }

  async deleteEWCCode(
    req: DeleteEWCCodeRequest
  ): Promise<DeleteEWCCodeResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      deleteEWCCode.name,
      HttpMethod.POST,
      req
    )) as Promise<DeleteEWCCodeResponse>;
  }

  async createCountries(
    req: CreateCountriesRequest
  ): Promise<CreateCountriesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      createCountries.name,
      HttpMethod.POST,
      req
    )) as Promise<CreateCountriesResponse>;
  }

  async updateCountries(
    req: UpdateCountriesRequest
  ): Promise<UpdateCountriesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      updateCountries.name,
      HttpMethod.POST,
      req
    )) as Promise<CreateCountriesResponse>;
  }

  async deleteCountries(): Promise<DeleteCountriesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      deleteCountries.name,
      HttpMethod.POST
    )) as Promise<DeleteCountriesResponse>;
  }

  async createRecoveryCodes(
    req: CreateRecoveryCodesRequest
  ): Promise<CreateRecoveryCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      createRecoveryCodes.name,
      HttpMethod.POST,
      req
    )) as Promise<CreateRecoveryCodesResponse>;
  }

  async updateRecoveryCodes(
    req: UpdateRecoveryCodesRequest
  ): Promise<UpdateRecoveryCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      updateRecoveryCodes.name,
      HttpMethod.POST,
      req
    )) as Promise<CreateRecoveryCodesResponse>;
  }

  async deleteRecoveryCodes(): Promise<DeleteRecoveryCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      deleteRecoveryCodes.name,
      HttpMethod.POST
    )) as Promise<DeleteRecoveryCodesResponse>;
  }

  async createRecoveryCode(
    req: CreateRecoveryCodeRequest
  ): Promise<CreateRecoveryCodeResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      createRecoveryCode.name,
      HttpMethod.POST,
      req
    )) as Promise<CreateRecoveryCodeResponse>;
  }

  async updateRecoveryCode(
    req: UpdateRecoveryCodeRequest
  ): Promise<UpdateRecoveryCodeResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      updateRecoveryCode.name,
      HttpMethod.POST,
      req
    )) as Promise<UpdateRecoveryCodeResponse>;
  }

  async deleteRecoveryCode(
    req: DeleteRecoveryCodeRequest
  ): Promise<DeleteRecoveryCodeResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      deleteRecoveryCode.name,
      HttpMethod.POST,
      req
    )) as Promise<DeleteRecoveryCodeResponse>;
  }

  async createDisposalCodes(
    req: CreateDisposalCodesRequest
  ): Promise<CreateDisposalCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      createDisposalCodes.name,
      HttpMethod.POST,
      req
    )) as Promise<CreateDisposalCodesResponse>;
  }

  async updateDisposalCodes(
    req: UpdateDisposalCodesRequest
  ): Promise<UpdateDisposalCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      updateDisposalCodes.name,
      HttpMethod.POST,
      req
    )) as Promise<CreateDisposalCodesResponse>;
  }

  async deleteDisposalCodes(): Promise<DeleteDisposalCodesResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      deleteDisposalCodes.name,
      HttpMethod.POST
    )) as Promise<DeleteDisposalCodesResponse>;
  }

  async createDisposalCode(
    req: CreateDisposalCodeRequest
  ): Promise<CreateDisposalCodeResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      createDisposalCode.name,
      HttpMethod.POST,
      req
    )) as Promise<CreateDisposalCodeResponse>;
  }

  async updateDisposalCode(
    req: UpdateDisposalCodeRequest
  ): Promise<UpdateDisposalCodeResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      updateDisposalCode.name,
      HttpMethod.POST,
      req
    )) as Promise<UpdateDisposalCodeResponse>;
  }

  async deleteDisposalCode(
    req: DeleteDisposalCodeRequest
  ): Promise<DeleteDisposalCodeResponse> {
    return (await this.daprClient.invoker.invoke(
      this.referenceDataAppId,
      deleteDisposalCode.name,
      HttpMethod.POST,
      req
    )) as Promise<DeleteDisposalCodeResponse>;
  }
}
