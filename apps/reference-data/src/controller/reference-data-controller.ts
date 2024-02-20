import Boom from '@hapi/boom';
import * as api from '@wts/api/reference-data';
import { fromBoom, success } from '@wts/util/invocation';
import { Logger } from 'winston';
import { ReferenceDataRepository } from '../data/repository';
import { Handler } from '@wts/api/common';
import { Country, RecoveryCode, WasteCode, WasteCodeType } from '../model';

const wasteCodesId = 'waste-codes';
const ewcCodesId = 'ewc-codes';
const countriesId = 'countries';
const recoveryCodesId = 'recovery-codes';
const disposalCodesId = 'disposal-codes';

export default class ReferenceDataController {
  constructor(
    private repository: ReferenceDataRepository,
    private logger: Logger
  ) {}

  getWasteCodes: Handler<null, api.GetWasteCodesResponse> = async () => {
    try {
      return success(
        await this.repository.getList<WasteCodeType>(wasteCodesId)
      );
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getEWCCodes: Handler<null, api.GetEWCCodesResponse> = async () => {
    try {
      return success(await this.repository.getList<WasteCode>(ewcCodesId));
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getCountries: Handler<null, api.GetCountriesResponse> = async () => {
    try {
      return success(await this.repository.getList<Country>(countriesId));
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getRecoveryCodes: Handler<null, api.GetRecoveryCodesResponse> = async () => {
    try {
      return success(
        await this.repository.getList<RecoveryCode>(recoveryCodesId)
      );
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDisposalCodes: Handler<null, api.GetDisposalCodesResponse> = async () => {
    try {
      return success(await this.repository.getList<WasteCode>(disposalCodesId));
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createWasteCodes: Handler<
    api.CreateWasteCodesRequest,
    api.CreateWasteCodesResponse
  > = async (values) => {
    try {
      return success(
        await this.repository.saveList<WasteCodeType>(wasteCodesId, values)
      ) as api.CreateWasteCodesResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createEWCCodes: Handler<
    api.CreateEWCCodesRequest,
    api.CreateEWCCodesResponse
  > = async (values) => {
    try {
      return success(
        await this.repository.saveList<WasteCode>(ewcCodesId, values)
      ) as api.CreateEWCCodesResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createCountries: Handler<
    api.CreateCountriesRequest,
    api.CreateCountriesResponse
  > = async (values) => {
    try {
      return success(
        await this.repository.saveList<Country>(countriesId, values)
      ) as api.CreateCountriesResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createRecoveryCodes: Handler<
    api.CreateRecoveryCodesRequest,
    api.CreateRecoveryCodesResponse
  > = async (values) => {
    try {
      return success(
        await this.repository.saveList<RecoveryCode>(recoveryCodesId, values)
      ) as api.CreateRecoveryCodesResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createDisposalCodes: Handler<
    api.CreateDisposalCodesRequest,
    api.CreateDisposalCodesResponse
  > = async (values) => {
    try {
      return success(
        await this.repository.saveList<WasteCode>(disposalCodesId, values)
      ) as api.CreateDisposalCodesResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
