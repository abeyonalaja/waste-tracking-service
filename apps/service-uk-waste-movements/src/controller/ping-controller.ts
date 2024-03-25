import { Logger } from 'winston';
import { Handler } from '@wts/api/common';
import { fromBoom, success } from '@wts/util/invocation';
import Boom from '@hapi/boom';
import * as api from '@wts/api/uk-waste-movements';

export default class PingController {
  constructor(private logger: Logger) {}

  ping: Handler<api.PingRequest, api.PingResponse> = async ({
    message: requestMessage,
  }) => {
    try {
      return success({ message: `Hello ${requestMessage}` });
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
