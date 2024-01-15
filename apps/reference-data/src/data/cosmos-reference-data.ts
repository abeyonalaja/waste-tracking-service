import Boom from '@hapi/boom';
import { Logger } from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { CosmosReferenceDataClient } from '../clients';
import { ReferenceDataRepository } from './reference-data-repository';
import {
  Country,
  RecoveryCode,
  WasteCode,
  WasteCodeType,
  CreateWasteCodesRequest,
  CreateWasteCodesResponse,
  UpdateWasteCodesRequest,
  UpdateWasteCodesResponse,
  CreateWasteCodeRequest,
  CreateWasteCodeResponse,
  UpdateWasteCodeRequest,
  UpdateWasteCodeResponse,
  DeleteWasteCodeRequest,
  DeleteWasteCodeResponse,
  CreateEWCCodesRequest,
  CreateEWCCodesResponse,
  UpdateEWCCodesRequest,
  UpdateEWCCodesResponse,
  CreateEWCCodeRequest,
  CreateEWCCodeResponse,
  UpdateEWCCodeRequest,
  UpdateEWCCodeResponse,
  DeleteEWCCodeRequest,
  DeleteEWCCodeResponse,
  CreateCountriesRequest,
  CreateCountriesResponse,
  UpdateCountriesRequest,
  UpdateCountriesResponse,
  CreateRecoveryCodeRequest,
  CreateRecoveryCodeResponse,
  UpdateRecoveryCodeRequest,
  UpdateRecoveryCodeResponse,
  DeleteRecoveryCodeRequest,
  DeleteRecoveryCodeResponse,
  CreateDisposalCodeRequest,
  CreateDisposalCodeResponse,
  UpdateDisposalCodeRequest,
  UpdateDisposalCodeResponse,
  DeleteDisposalCodeRequest,
  DeleteDisposalCodeResponse,
  CreateDisposalCodesRequest,
  CreateDisposalCodesResponse,
  CreateRecoveryCodesRequest,
  CreateRecoveryCodesResponse,
  UpdateDisposalCodesRequest,
  UpdateDisposalCodesResponse,
  UpdateRecoveryCodesRequest,
  UpdateRecoveryCodesResponse,
} from '@wts/api/reference-data';

function doesWasteCodeExist(
  wasteCodeType: string,
  wasteCode: string,
  currentWasteCodeTypes: WasteCodeType[]
): boolean {
  let exists = false;
  for (const index in currentWasteCodeTypes) {
    if (currentWasteCodeTypes[index].type === wasteCodeType) {
      exists = doesCodeExist(wasteCode, currentWasteCodeTypes[index].values);
    }
  }
  return exists;
}

function doesCodeExist(code: string, codeList: WasteCode[]): boolean {
  for (const index in codeList) {
    if (codeList[index].code.toUpperCase() === code.toUpperCase()) {
      return true;
    }
  }
  return false;
}

function getWasteCodePath(
  wasteCodeType: string,
  wasteCode: string,
  currentWasteCodeTypes: WasteCodeType[],
  path: string
): string {
  for (const index in currentWasteCodeTypes) {
    if (currentWasteCodeTypes[index].type === wasteCodeType) {
      path = getCodePath(
        wasteCode,
        currentWasteCodeTypes[index].values,
        path + index + '/values/'
      );
    }
  }
  return path;
}

function getCodePath(
  code: string,
  codeList: WasteCode[],
  path: string
): string {
  let codeFound = false;
  for (const index in codeList) {
    if (codeList[index].code.toUpperCase() === code.toUpperCase()) {
      path = path + index + '/value';
      codeFound = true;
    }
  }
  if (!codeFound) {
    path = path + '-';
  }
  return path;
}

function removeTrailingValue(path: string): string {
  return path.substring(0, path.lastIndexOf('/value'));
}

export default class CosmosReferenceDataRepository
  implements ReferenceDataRepository
{
  constructor(
    private cosmosClient: CosmosReferenceDataClient,
    private containerName: string,
    private logger: Logger
  ) {}

  wasteCodesPartitionKeyValue = 'waste-codes';
  ewcCodesPartitionKeyValue = 'ewc-codes';
  countriesPartitionKeyValue = 'countries';
  recoveryCodesPartitionKeyValue = 'recovery-codes';
  disposalCodesPartitionKeyValue = 'disposal-codes';

  async listWasteCodes(): Promise<WasteCodeType[]> {
    const results = await this.readContainerPartition(
      this.wasteCodesPartitionKeyValue
    );
    console.log('results=' + results);

    if (results.results[0] === undefined) {
      throw Boom.notFound(
        "Partition with key value '" +
          this.wasteCodesPartitionKeyValue +
          "' does not exist in db"
      );
    }

    return results.results[0].value.values;
  }

  async listEWCCodes(): Promise<WasteCode[]> {
    const results = await this.readContainerPartition(
      this.ewcCodesPartitionKeyValue
    );

    if (results.results[0] === undefined) {
      throw Boom.notFound(
        "Partition with key value '" +
          this.ewcCodesPartitionKeyValue +
          "' does not exist in db"
      );
    }

    return results.results[0].value.values;
  }

  async listCountries(): Promise<Country[]> {
    const results = await this.readContainerPartition(
      this.countriesPartitionKeyValue
    );

    if (results.results[0] === undefined) {
      throw Boom.notFound(
        "Partition with key value '" +
          this.countriesPartitionKeyValue +
          "' does not exist in db"
      );
    }

    return results.results[0].value.values;
  }

  async listRecoveryCodes(): Promise<RecoveryCode[]> {
    const results = await this.readContainerPartition(
      this.recoveryCodesPartitionKeyValue
    );

    if (results.results[0] === undefined) {
      throw Boom.notFound(
        "Partition with key value '" +
          this.recoveryCodesPartitionKeyValue +
          "' does not exist in db"
      );
    }

    return results.results[0].value.values;
  }

  async listDisposalCodes(): Promise<WasteCode[]> {
    const results = await this.readContainerPartition(
      this.disposalCodesPartitionKeyValue
    );

    if (results.results[0] === undefined) {
      throw Boom.notFound(
        "Partition with key value '" +
          this.disposalCodesPartitionKeyValue +
          "' does not exist in db"
      );
    }

    return results.results[0].value.values;
  }

  async createWasteCodes(
    createWasteCodesRequest: CreateWasteCodesRequest
  ): Promise<CreateWasteCodesResponse> {
    this.createContainerPartition(
      this.wasteCodesPartitionKeyValue,
      createWasteCodesRequest
    );
    return createWasteCodesRequest as unknown as CreateWasteCodesResponse;
  }

  async updateWasteCodes(
    updateWasteCodesRequest: UpdateWasteCodesRequest
  ): Promise<UpdateWasteCodesResponse> {
    this.updateContainerPartition(
      this.wasteCodesPartitionKeyValue,
      updateWasteCodesRequest
    );
    return updateWasteCodesRequest as unknown as UpdateWasteCodesResponse;
  }

  async deleteWasteCodes(): Promise<void> {
    this.deleteContainerPartition(this.wasteCodesPartitionKeyValue);
  }

  async createEWCCodes(
    createEWCCodesRequest: CreateEWCCodesRequest
  ): Promise<CreateEWCCodesResponse> {
    this.createContainerPartition(
      this.ewcCodesPartitionKeyValue,
      createEWCCodesRequest
    );
    return createEWCCodesRequest as unknown as CreateEWCCodesResponse;
  }

  async updateEWCCodes(
    updateEWCCodesRequest: UpdateEWCCodesRequest
  ): Promise<UpdateEWCCodesResponse> {
    this.updateContainerPartition(
      this.ewcCodesPartitionKeyValue,
      updateEWCCodesRequest
    );
    return updateEWCCodesRequest as unknown as UpdateEWCCodesResponse;
  }

  async deleteEWCCodes(): Promise<void> {
    this.deleteContainerPartition(this.ewcCodesPartitionKeyValue);
  }

  async createCountries(
    createCountriesRequest: CreateCountriesRequest
  ): Promise<CreateCountriesResponse> {
    this.createContainerPartition(
      this.countriesPartitionKeyValue,
      createCountriesRequest
    );
    return createCountriesRequest as unknown as CreateCountriesResponse;
  }

  async updateCountries(
    updateCountriesRequest: UpdateCountriesRequest
  ): Promise<UpdateCountriesResponse> {
    this.updateContainerPartition(
      this.countriesPartitionKeyValue,
      updateCountriesRequest
    );
    return updateCountriesRequest as unknown as UpdateCountriesResponse;
  }

  async deleteCountries(): Promise<void> {
    this.deleteContainerPartition(this.countriesPartitionKeyValue);
  }

  async createRecoveryCodes(
    createRecoveryCodesRequest: CreateRecoveryCodesRequest
  ): Promise<CreateRecoveryCodesResponse> {
    this.createContainerPartition(
      this.recoveryCodesPartitionKeyValue,
      createRecoveryCodesRequest
    );
    return createRecoveryCodesRequest as unknown as CreateRecoveryCodesResponse;
  }

  async updateRecoveryCodes(
    updateRecoveryCodesRequest: UpdateRecoveryCodesRequest
  ): Promise<UpdateRecoveryCodesResponse> {
    this.updateContainerPartition(
      this.recoveryCodesPartitionKeyValue,
      updateRecoveryCodesRequest
    );
    return updateRecoveryCodesRequest as unknown as UpdateRecoveryCodesResponse;
  }

  async deleteRecoveryCodes(): Promise<void> {
    this.deleteContainerPartition(this.recoveryCodesPartitionKeyValue);
  }

  async createDisposalCodes(
    createDisposalCodesRequest: CreateDisposalCodesRequest
  ): Promise<CreateDisposalCodesResponse> {
    this.createContainerPartition(
      this.disposalCodesPartitionKeyValue,
      createDisposalCodesRequest
    );
    return createDisposalCodesRequest as unknown as CreateDisposalCodesResponse;
  }

  async updateDisposalCodes(
    updateDisposalCodesRequest: UpdateDisposalCodesRequest
  ): Promise<UpdateDisposalCodesResponse> {
    this.updateContainerPartition(
      this.disposalCodesPartitionKeyValue,
      updateDisposalCodesRequest
    );
    return updateDisposalCodesRequest as unknown as UpdateDisposalCodesResponse;
  }

  async deleteDisposalCodes(): Promise<void> {
    this.deleteContainerPartition(this.disposalCodesPartitionKeyValue);
  }

  async createWasteCode(
    createWasteCodeRequest: CreateWasteCodeRequest
  ): Promise<CreateWasteCodeResponse> {
    const results = await this.readContainerPartition(
      this.wasteCodesPartitionKeyValue
    );

    if (results.results[0] === undefined) {
      throw Boom.notFound('Waste Codes do not exist in db.');
    }

    if (
      doesWasteCodeExist(
        createWasteCodeRequest.type,
        createWasteCodeRequest.code,
        results.results[0].value.values
      )
    ) {
      throw Boom.conflict('Waste Code already exists in db.');
    }

    this.cosmosClient.updateItem(
      this.containerName,
      results.results[0].id,
      this.wasteCodesPartitionKeyValue,
      getWasteCodePath(
        createWasteCodeRequest.type,
        createWasteCodeRequest.code,
        results.results[0].value.values,
        '/value/values/'
      ),
      'set',
      {
        code: createWasteCodeRequest.code.toUpperCase(),
        value: createWasteCodeRequest.value,
      }
    );
    return createWasteCodeRequest as unknown as CreateWasteCodeResponse;
  }

  async updateWasteCode(
    updateWasteCodeRequest: UpdateWasteCodeRequest
  ): Promise<UpdateWasteCodeResponse> {
    const results = await this.readContainerPartition(
      this.wasteCodesPartitionKeyValue
    );

    if (results === undefined) {
      throw Boom.notFound('Waste Codes do not exist in db.');
    }

    if (
      !doesWasteCodeExist(
        updateWasteCodeRequest.type,
        updateWasteCodeRequest.code,
        results.results[0].value.values
      )
    ) {
      throw Boom.notFound("Waste Code doesn't exists in db");
    }

    this.cosmosClient.updateItem(
      this.containerName,
      results.results[0].id,
      this.wasteCodesPartitionKeyValue,
      getWasteCodePath(
        updateWasteCodeRequest.type,
        updateWasteCodeRequest.code,
        results.results[0].value.values,
        '/value/values/'
      ),
      'replace',
      updateWasteCodeRequest.value
    );
    return updateWasteCodeRequest as unknown as UpdateWasteCodeResponse;
  }

  async deleteWasteCode(
    deleteWasteCodeRequest: DeleteWasteCodeRequest
  ): Promise<DeleteWasteCodeResponse> {
    const results = await this.readContainerPartition(
      this.wasteCodesPartitionKeyValue
    );

    if (results === undefined) {
      throw Boom.notFound('Waste Codes do not exist in db.');
    }

    if (
      !doesWasteCodeExist(
        deleteWasteCodeRequest.type,
        deleteWasteCodeRequest.code,
        results.results[0].value.values
      )
    ) {
      throw Boom.notFound("Waste Code doesn't exists in db");
    }

    this.cosmosClient.updateItem(
      this.containerName,
      results.results[0].id,
      this.wasteCodesPartitionKeyValue,
      removeTrailingValue(
        getWasteCodePath(
          deleteWasteCodeRequest.type,
          deleteWasteCodeRequest.code,
          results.results[0].value.values,
          '/value/values/'
        )
      ),
      'remove',
      null
    );
    return deleteWasteCodeRequest as unknown as DeleteWasteCodeResponse;
  }

  async createEWCCode(
    createEWCCodeRequest: CreateEWCCodeRequest
  ): Promise<CreateEWCCodeResponse> {
    const results = await this.readContainerPartition(
      this.ewcCodesPartitionKeyValue
    );

    if (results === undefined) {
      throw Boom.notFound('EWC Codes do not exist in db.');
    }

    if (
      doesCodeExist(createEWCCodeRequest.code, results.results[0].value.values)
    ) {
      throw Boom.conflict('EWC Code already exists in db.');
    }

    this.cosmosClient.updateItem(
      this.containerName,
      results.results[0].id,
      this.ewcCodesPartitionKeyValue,
      getCodePath(
        createEWCCodeRequest.code,
        results.results[0].value.values,
        '/value/values/'
      ),
      'set',
      {
        code: createEWCCodeRequest.code.toUpperCase(),
        value: createEWCCodeRequest.value,
      }
    );
    return createEWCCodeRequest as unknown as CreateEWCCodeResponse;
  }

  async updateEWCCode(
    updateEWCCodeRequest: UpdateEWCCodeRequest
  ): Promise<UpdateEWCCodeResponse> {
    const results = await this.readContainerPartition(
      this.ewcCodesPartitionKeyValue
    );

    if (results === undefined) {
      throw Boom.notFound('EWC Codes do not exist in db.');
    }

    if (
      !doesCodeExist(updateEWCCodeRequest.code, results.results[0].value.values)
    ) {
      throw Boom.notFound("EWC Code doesn't exists in db");
    }

    this.cosmosClient.updateItem(
      this.containerName,
      results.results[0].id,
      this.ewcCodesPartitionKeyValue,
      getCodePath(
        updateEWCCodeRequest.code,
        results.results[0].value.values,
        '/value/values/'
      ),
      'replace',
      updateEWCCodeRequest.value
    );
    return updateEWCCodeRequest as unknown as UpdateEWCCodeResponse;
  }

  async deleteEWCCode(
    deleteEWCCodeRequest: DeleteEWCCodeRequest
  ): Promise<DeleteEWCCodeResponse> {
    const results = await this.readContainerPartition(
      this.ewcCodesPartitionKeyValue
    );

    if (results === undefined) {
      throw Boom.notFound('EWC Codes do not exist in db.');
    }

    if (
      !doesCodeExist(deleteEWCCodeRequest.code, results.results[0].value.values)
    ) {
      throw Boom.notFound("EWC Code doesn't exists in db");
    }

    this.cosmosClient.updateItem(
      this.containerName,
      results.results[0].id,
      this.ewcCodesPartitionKeyValue,
      removeTrailingValue(
        getCodePath(
          deleteEWCCodeRequest.code,
          results.results[0].value.values,
          '/value/values/'
        )
      ),
      'remove',
      null
    );
    return deleteEWCCodeRequest as unknown as DeleteEWCCodeResponse;
  }

  async createRecoveryCode(
    createRecoveryCodeRequest: CreateRecoveryCodeRequest
  ): Promise<CreateRecoveryCodeResponse> {
    const results = await this.readContainerPartition(
      this.recoveryCodesPartitionKeyValue
    );

    if (results === undefined) {
      throw Boom.notFound('Recovery Codes do not exist in db.');
    }

    if (
      doesCodeExist(
        createRecoveryCodeRequest.code,
        results.results[0].value.values
      )
    ) {
      throw Boom.conflict('Recovery Code already exists in db.');
    }

    this.cosmosClient.updateItem(
      this.containerName,
      results.results[0].id,
      this.recoveryCodesPartitionKeyValue,
      getCodePath(
        createRecoveryCodeRequest.code,
        results.results[0].value.values,
        '/value/values/'
      ),
      'set',
      {
        code: createRecoveryCodeRequest.code.toUpperCase(),
        value: createRecoveryCodeRequest.value,
      }
    );
    return createRecoveryCodeRequest as unknown as CreateRecoveryCodeResponse;
  }

  async updateRecoveryCode(
    updateRecoveryCodeRequest: UpdateRecoveryCodeRequest
  ): Promise<UpdateRecoveryCodeResponse> {
    const results = await this.readContainerPartition(
      this.recoveryCodesPartitionKeyValue
    );

    if (results === undefined) {
      throw Boom.notFound('Recovery Codes do not exist in db.');
    }

    if (
      !doesCodeExist(
        updateRecoveryCodeRequest.code,
        results.results[0].value.values
      )
    ) {
      throw Boom.notFound("Recovery Code doesn't exists in db");
    }

    this.cosmosClient.updateItem(
      this.containerName,
      results.results[0].id,
      this.recoveryCodesPartitionKeyValue,
      getCodePath(
        updateRecoveryCodeRequest.code,
        results.results[0].value.values,
        '/value/values/'
      ),
      'replace',
      updateRecoveryCodeRequest.value
    );
    return updateRecoveryCodeRequest as unknown as UpdateRecoveryCodeResponse;
  }

  async deleteRecoveryCode(
    deleteRecoveryCodeRequest: DeleteRecoveryCodeRequest
  ): Promise<DeleteRecoveryCodeResponse> {
    const results = await this.readContainerPartition(
      this.recoveryCodesPartitionKeyValue
    );

    if (results === undefined) {
      throw Boom.notFound('Recovery Codes do not exist in db.');
    }

    if (
      !doesCodeExist(
        deleteRecoveryCodeRequest.code,
        results.results[0].value.values
      )
    ) {
      throw Boom.notFound("Recovery Code doesn't exists in db");
    }

    this.cosmosClient.updateItem(
      this.containerName,
      results.results[0].id,
      this.recoveryCodesPartitionKeyValue,
      removeTrailingValue(
        getCodePath(
          deleteRecoveryCodeRequest.code,
          results.results[0].value.values,
          '/value/values/'
        )
      ),
      'remove',
      null
    );
    return deleteRecoveryCodeRequest as unknown as DeleteRecoveryCodeResponse;
  }

  async createDisposalCode(
    createDisposalCodeRequest: CreateDisposalCodeRequest
  ): Promise<CreateDisposalCodeResponse> {
    const results = await this.readContainerPartition(
      this.disposalCodesPartitionKeyValue
    );

    if (results === undefined) {
      throw Boom.notFound('Disposal Codes do not exist in db.');
    }

    if (
      doesCodeExist(
        createDisposalCodeRequest.code,
        results.results[0].value.values
      )
    ) {
      throw Boom.conflict('Disposal Code already exists in db.');
    }

    this.cosmosClient.updateItem(
      this.containerName,
      results.results[0].id,
      this.disposalCodesPartitionKeyValue,
      getCodePath(
        createDisposalCodeRequest.code,
        results.results[0].value.values,
        '/value/values/'
      ),
      'set',
      {
        code: createDisposalCodeRequest.code.toUpperCase(),
        value: createDisposalCodeRequest.value,
      }
    );
    return createDisposalCodeRequest as unknown as CreateDisposalCodeResponse;
  }

  async updateDisposalCode(
    updateDisposalCodeRequest: UpdateDisposalCodeRequest
  ): Promise<UpdateDisposalCodeResponse> {
    const results = await this.readContainerPartition(
      this.disposalCodesPartitionKeyValue
    );

    if (results === undefined) {
      throw Boom.notFound('Disposal Codes do not exist in db.');
    }

    if (
      !doesCodeExist(
        updateDisposalCodeRequest.code,
        results.results[0].value.values
      )
    ) {
      throw Boom.notFound("Disposal Code doesn't exists in db");
    }

    this.cosmosClient.updateItem(
      this.containerName,
      results.results[0].id,
      this.disposalCodesPartitionKeyValue,
      getCodePath(
        updateDisposalCodeRequest.code,
        results.results[0].value.values,
        '/value/values/'
      ),
      'replace',
      updateDisposalCodeRequest.value
    );
    return updateDisposalCodeRequest as unknown as UpdateDisposalCodeResponse;
  }

  async deleteDisposalCode(
    deleteDisposalCodeRequest: DeleteDisposalCodeRequest
  ): Promise<DeleteDisposalCodeResponse> {
    const results = await this.readContainerPartition(
      this.disposalCodesPartitionKeyValue
    );

    if (results === undefined) {
      throw Boom.notFound('Disposal Codes do not exist in db.');
    }

    if (
      !doesCodeExist(
        deleteDisposalCodeRequest.code,
        results.results[0].value.values
      )
    ) {
      throw Boom.notFound("Disposal Code doesn't exists in db");
    }

    this.cosmosClient.updateItem(
      this.containerName,
      results.results[0].id,
      this.disposalCodesPartitionKeyValue,
      removeTrailingValue(
        getCodePath(
          deleteDisposalCodeRequest.code,
          results.results[0].value.values,
          '/value/values/'
        )
      ),
      'remove',
      null
    );
    return deleteDisposalCodeRequest as unknown as DeleteDisposalCodeResponse;
  }

  async readContainerPartition(partitionKeyValue: string) {
    return await this.cosmosClient.queryContainerNext(
      this.containerName,
      { query: `SELECT * FROM c OFFSET 0 LIMIT 1` },
      { partitionKey: partitionKeyValue }
    );
  }

  async createContainerPartition(partitionKeyValue: string, data: object[]) {
    const results = await this.readContainerPartition(partitionKeyValue);

    if (results.results[0] !== undefined) {
      throw Boom.conflict(
        "Partition with key value '" +
          partitionKeyValue +
          "' already exist in db"
      );
    }

    this.cosmosClient.createOrReplaceItem(
      this.containerName,
      uuidv4(),
      partitionKeyValue,
      { type: partitionKeyValue, values: data }
    );
  }

  async updateContainerPartition(partitionKeyValue: string, data: object[]) {
    const results = await this.readContainerPartition(partitionKeyValue);

    if (results.results[0] === undefined) {
      throw Boom.notFound(
        "Partition with key value '" +
          partitionKeyValue +
          "' does not exist in db"
      );
    }

    this.cosmosClient.createOrReplaceItem(
      this.containerName,
      results.results[0].id,
      partitionKeyValue,
      { type: partitionKeyValue, values: data }
    );
  }

  async deleteContainerPartition(partitionKeyValue: string): Promise<void> {
    const results = await this.readContainerPartition(partitionKeyValue);

    if (results.results[0] !== undefined) {
      this.cosmosClient.deleteItem(
        this.containerName,
        results.results[0].id,
        partitionKeyValue
      );
    }
  }
}
