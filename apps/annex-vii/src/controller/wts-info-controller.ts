import Boom from '@hapi/boom';
import * as api from '@wts/api/annex-vii';
import { fromBoom, success } from '@wts/util/invocation';
import { Logger } from 'winston';
import { WTSInfoRepository } from '../data/wts-info-repository';
import { Handler } from './base-controller';
import {
  GetDisposalCodesRequest,
  GetEWCCodesRequest,
  GetRecoveryCodesRequest,
} from '@wts/api/annex-vii';

export default class WTSInfoController {
  constructor(private repository: WTSInfoRepository, private logger: Logger) {}

  getWasteCodes: Handler<api.GetWasteCodesRequest, api.GetWasteCodesResponse> =
    async ({ language }) => {
      try {
        return success(await this.repository.listWasteCodes(language));
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };

  getEWCCodes: Handler<GetEWCCodesRequest, api.GetEWCCodesResponse> = async ({
    language,
  }) => {
    try {
      return success(await this.repository.listEWCCodes(language));
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

  getRecoveryCodes: Handler<
    GetRecoveryCodesRequest,
    api.GetRecoveryCodesResponse
  > = async ({ language }) => {
    try {
      return success(await this.repository.listRecoveryCodes(language));
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getDisposalCodes: Handler<
    GetDisposalCodesRequest,
    api.GetDisposalCodesResponse
  > = async ({ language }) => {
    try {
      return success(await this.repository.listDisposalCodes(language));
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
