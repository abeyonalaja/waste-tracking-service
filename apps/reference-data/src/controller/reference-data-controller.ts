import Boom from '@hapi/boom';
import * as api from '@wts/api/reference-data';
import { fromBoom, success } from '@wts/util/invocation';
import { Logger } from 'winston';
import { ReferenceDataRepository } from '../data/reference-data-repository';
import { Handler } from '@wts/api/common';

export default class ReferenceDataController {
  constructor(
    private repository: ReferenceDataRepository,
    private logger: Logger
  ) {}

  getWasteCodes: Handler<null, api.GetWasteCodesResponse> = async () => {
    try {
      return success(await this.repository.listWasteCodes());
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
      return success(await this.repository.listEWCCodes());
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
      return success(await this.repository.listCountries());
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
      return success(await this.repository.listRecoveryCodes());
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
      return success(await this.repository.listDisposalCodes());
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
  > = async (createWasteCodesRequest) => {
    try {
      return success(
        await this.repository.createWasteCodes(createWasteCodesRequest)
      ) as api.CreateWasteCodesResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  updateWasteCodes: Handler<
    api.UpdateWasteCodesRequest,
    api.UpdateWasteCodesResponse
  > = async (updateWasteCodesRequest) => {
    try {
      return success(
        await this.repository.updateWasteCodes(updateWasteCodesRequest)
      ) as api.UpdateWasteCodesResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  deleteWasteCodes: Handler<null, api.DeleteWasteCodesResponse> = async () => {
    try {
      await this.repository.deleteWasteCodes();
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createWasteCode: Handler<
    api.CreateWasteCodeRequest,
    api.CreateWasteCodeResponse
  > = async (createWasteCodeRequest) => {
    try {
      return success(
        await this.repository.createWasteCode(createWasteCodeRequest)
      ) as api.CreateWasteCodeResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  updateWasteCode: Handler<
    api.UpdateWasteCodeRequest,
    api.UpdateWasteCodeResponse
  > = async (updateWasteCodeRequest) => {
    try {
      return success(
        await this.repository.updateWasteCode(updateWasteCodeRequest)
      ) as api.UpdateWasteCodeResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  deleteWasteCode: Handler<
    api.DeleteWasteCodeRequest,
    api.DeleteWasteCodeResponse
  > = async (deleteWasteCodeRequest) => {
    try {
      return success(
        await this.repository.deleteWasteCode(deleteWasteCodeRequest)
      ) as api.DeleteWasteCodeResponse;
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
  > = async (createEWCCodesRequest) => {
    try {
      return success(
        await this.repository.createEWCCodes(createEWCCodesRequest)
      ) as api.CreateEWCCodesResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  updateEWCCodes: Handler<
    api.UpdateEWCCodesRequest,
    api.UpdateEWCCodesResponse
  > = async (updateEWCCodesRequest) => {
    try {
      return success(
        await this.repository.updateEWCCodes(updateEWCCodesRequest)
      ) as api.UpdateEWCCodesResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  deleteEWCCodes: Handler<null, api.DeleteEWCCodesResponse> = async () => {
    try {
      return success(
        await this.repository.deleteEWCCodes()
      ) as api.DeleteEWCCodesResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createEWCCode: Handler<api.CreateEWCCodeRequest, api.CreateEWCCodeResponse> =
    async (createEWCCodeRequest) => {
      try {
        return success(
          await this.repository.createEWCCode(createEWCCodeRequest)
        ) as api.CreateEWCCodeResponse;
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };

  updateEWCCode: Handler<api.UpdateEWCCodeRequest, api.UpdateEWCCodeResponse> =
    async (updateEWCCodeRequest) => {
      try {
        return success(
          await this.repository.updateEWCCode(updateEWCCodeRequest)
        ) as api.UpdateEWCCodeResponse;
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };

  deleteEWCCode: Handler<api.DeleteEWCCodeRequest, api.DeleteEWCCodeResponse> =
    async (deleteEWCCodeRequest) => {
      try {
        return success(
          await this.repository.deleteEWCCode(deleteEWCCodeRequest)
        ) as api.DeleteEWCCodeResponse;
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
  > = async (createCountriesRequest) => {
    try {
      return success(
        await this.repository.createCountries(createCountriesRequest)
      ) as api.CreateCountriesResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  updateCountries: Handler<
    api.UpdateCountriesRequest,
    api.UpdateCountriesResponse
  > = async (updateCountriesRequest) => {
    try {
      return success(
        await this.repository.updateCountries(updateCountriesRequest)
      ) as api.UpdateCountriesResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  deleteCountries: Handler<null, api.DeleteCountriesResponse> = async () => {
    try {
      return success(
        await this.repository.deleteCountries()
      ) as api.DeleteCountriesResponse;
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
  > = async (createRecoveryCodesRequest) => {
    try {
      return success(
        await this.repository.createRecoveryCodes(createRecoveryCodesRequest)
      ) as api.CreateRecoveryCodesResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  updateRecoveryCodes: Handler<
    api.UpdateRecoveryCodesRequest,
    api.UpdateRecoveryCodesResponse
  > = async (updateRecoveryCodesRequest) => {
    try {
      return success(
        await this.repository.updateRecoveryCodes(updateRecoveryCodesRequest)
      ) as api.UpdateRecoveryCodesResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  deleteRecoveryCodes: Handler<null, api.DeleteRecoveryCodesResponse> =
    async () => {
      try {
        return success(
          await this.repository.deleteRecoveryCodes()
        ) as api.DeleteRecoveryCodesResponse;
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };

  createRecoveryCode: Handler<
    api.CreateRecoveryCodeRequest,
    api.CreateRecoveryCodeResponse
  > = async (createRecoveryCodeRequest) => {
    try {
      return success(
        await this.repository.createRecoveryCode(createRecoveryCodeRequest)
      ) as api.CreateRecoveryCodeResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  updateRecoveryCode: Handler<
    api.UpdateRecoveryCodeRequest,
    api.UpdateRecoveryCodeResponse
  > = async (updateRecoveryCodeRequest) => {
    try {
      return success(
        await this.repository.updateRecoveryCode(updateRecoveryCodeRequest)
      ) as api.UpdateRecoveryCodeResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  deleteRecoveryCode: Handler<
    api.DeleteRecoveryCodeRequest,
    api.DeleteRecoveryCodeResponse
  > = async (deleteRecoveryCodeRequest) => {
    try {
      return success(
        await this.repository.deleteRecoveryCode(deleteRecoveryCodeRequest)
      ) as api.DeleteRecoveryCodeResponse;
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
  > = async (createDisposalCodesRequest) => {
    try {
      return success(
        await this.repository.createDisposalCodes(createDisposalCodesRequest)
      ) as api.CreateDisposalCodesResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  updateDisposalCodes: Handler<
    api.UpdateDisposalCodesRequest,
    api.UpdateDisposalCodesResponse
  > = async (updateDisposalCodesRequest) => {
    try {
      return success(
        await this.repository.updateDisposalCodes(updateDisposalCodesRequest)
      ) as api.UpdateDisposalCodesResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  deleteDisposalCodes: Handler<null, api.DeleteDisposalCodesResponse> =
    async () => {
      try {
        return success(
          await this.repository.deleteDisposalCodes()
        ) as api.DeleteDisposalCodesResponse;
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };

  createDisposalCode: Handler<
    api.CreateDisposalCodeRequest,
    api.CreateDisposalCodeResponse
  > = async (createDisposalCodeRequest) => {
    try {
      return success(
        await this.repository.createDisposalCode(createDisposalCodeRequest)
      ) as api.CreateDisposalCodeResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  updateDisposalCode: Handler<
    api.UpdateDisposalCodeRequest,
    api.UpdateDisposalCodeResponse
  > = async (updateDisposalCodeRequest) => {
    try {
      return success(
        await this.repository.updateDisposalCode(updateDisposalCodeRequest)
      ) as api.UpdateDisposalCodeResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  deleteDisposalCode: Handler<
    api.DeleteDisposalCodeRequest,
    api.DeleteDisposalCodeResponse
  > = async (deleteDisposalCodeRequest) => {
    try {
      return success(
        await this.repository.deleteDisposalCode(deleteDisposalCodeRequest)
      ) as api.DeleteDisposalCodeResponse;
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
