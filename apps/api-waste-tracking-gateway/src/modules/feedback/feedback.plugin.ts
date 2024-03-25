import Boom from '@hapi/boom';
import { Plugin } from '@hapi/hapi';
import { FeedbackBackend } from './feedback.backend';
import { Logger } from 'winston';

import { validateSendFeedback } from './feedback.validation';

import * as dto from '@wts/api/feedback';

export interface PluginOptions {
  backend: FeedbackBackend;
  logger: Logger;
}

const plugin: Plugin<PluginOptions> = {
  name: 'feedback',
  version: '1.0.0',
  register: async function (server, { backend, logger }) {
    server.route({
      method: 'POST',
      path: '/',
      handler: async function ({ payload }) {
        if (!validateSendFeedback(payload)) {
          return Boom.badRequest();
        }

        const { rating, feedback } = payload as dto.SendFeedbackRequest;

        try {
          return await backend.sendFeedback(feedback, rating);
        } catch (error) {
          if (error instanceof Boom.Boom) {
            return error;
          }
          logger.error('Unknown error', { error: error });
          return Boom.internal();
        }
      },
    });
  },
};

export default plugin;
