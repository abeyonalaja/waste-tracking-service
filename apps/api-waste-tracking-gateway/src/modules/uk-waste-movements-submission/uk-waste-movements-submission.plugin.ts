import { Logger } from 'winston';
import { Plugin } from '@hapi/hapi';
import Boom from '@hapi/boom';
import * as dto from '@wts/api/waste-tracking-gateway';
import { UkWasteMovementsSubmissionBackend } from './uk-waste-movements-submission.backend';

export interface PluginOptions {
  backend: UkWasteMovementsSubmissionBackend;
  logger: Logger;
}

const plugin: Plugin<PluginOptions> = {
  name: 'ukwm',
  version: '1.0.0',
  register: async function (server, { backend, logger }) {
    server.route({
      method: 'GET',
      path: '/drafts/{id}',
      handler: async function ({ params }) {
        try {
          const value = await backend.getUkwmSubmission({
            id: params.id,
          });
          return value as dto.GetUkwmSubmissionResponse;
        } catch (err) {
          if (err instanceof Boom.Boom) {
            return err;
          }
          logger.error('Unknown error', { error: err });
          return Boom.internal();
        }
      },
    });
  },
};

export default plugin;
