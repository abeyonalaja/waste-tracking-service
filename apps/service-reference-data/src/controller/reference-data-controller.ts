import Boom from '@hapi/boom';
import * as api from '@wts/api/reference-data';
import { fromBoom, success } from '@wts/util/invocation';
import { Logger } from 'winston';
import { ReferenceDataRepository } from '../data/repository';
import { Handler } from '@wts/api/common';
import {
  Country,
  RecoveryCode,
  WasteCode,
  WasteCodeType,
  Pop,
  LocalAuthority,
} from '../model';

const wasteCodesId = 'waste-codes';
const ewcCodesId = 'ewc-codes';
const countriesId = 'countries';
const recoveryCodesId = 'recovery-codes';
const disposalCodesId = 'disposal-codes';
const hazardousCodesId = 'hazardous-codes';
const popCodesId = 'pops';
const localAuthoritiesId = 'local-authorities';

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

  getEWCCodes: Handler<api.GetEWCCodesRequest, api.GetEWCCodesResponse> =
    async ({ includeHazardous }) => {
      try {
        let ewcCodes = await this.repository.getList<WasteCode>(ewcCodesId);
        if (!includeHazardous) {
          ewcCodes = ewcCodes.filter((code) => !code.code.includes('*'));
        }
        return success(ewcCodes);
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };

  getCountries: Handler<api.GetCountriesRequest, api.GetCountriesResponse> =
    async ({ includeUk }) => {
      try {
        let countries = await this.repository.getList<Country>(countriesId);
        if (!includeUk) {
          countries = countries.filter(
            (country) => !country.name.includes('United Kingdom')
          );
        }
        return success(countries);
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

  getHazardousCodes: Handler<null, api.GetHazardousCodesResponse> =
    async () => {
      try {
        return success(
          await this.repository.getList<WasteCode>(hazardousCodesId)
        );
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };

  getPops: Handler<null, api.GetPopsResponse> = async () => {
    try {
      return success(await this.repository.getList<Pop>(popCodesId));
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getLocalAuthorities: Handler<null, api.GetLocalAuthoritiesResponse> =
    async () => {
      try {
        return success(
          await this.repository.getList<LocalAuthority>(localAuthoritiesId)
        );
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

  createHazardousCodes: Handler<
    api.CreateHazardousCodesRequest,
    api.CreateHazardousCodesResponse
  > = async (values) => {
    try {
      return success(
        await this.repository.saveList<WasteCode>(hazardousCodesId, values)
      ) as api.CreateHazardousCodesResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createPops: Handler<api.CreatePopsRequest, api.CreatePopsResponse> = async (
    values
  ) => {
    try {
      return success(
        await this.repository.saveList<Pop>(popCodesId, values)
      ) as api.CreatePopsResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
