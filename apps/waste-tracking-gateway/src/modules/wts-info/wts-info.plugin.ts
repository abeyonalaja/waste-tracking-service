import Boom from '@hapi/boom';
import { Plugin } from '@hapi/hapi';
import { Logger } from 'winston';
import { WTSInfoBackend } from './wts-info.backend';

export interface PluginOptions {
  backend: WTSInfoBackend;
  logger: Logger;
}

const plugin: Plugin<PluginOptions> = {
  name: 'wts-info',
  version: '1.0.0',
  register: async function (server, { backend, logger }) {
    server.route({
      method: 'GET',
      path: '/waste-codes',
      handler: async function ({ query }) {
        let language = query['language'] as string | undefined;
        if (!language) {
          language = 'en';
        }

        language = language.toLowerCase();
        if (language !== 'en' && language !== 'cy') {
          return Boom.badRequest(
            "Language '" + language + "' is not supported"
          );
        }

        try {
          return await backend.listWasteCodes(language);
        } catch (error) {
          if (error instanceof Boom.Boom) {
            return error;
          }
          logger.error('Unknown error', { error: error });
          return Boom.internal();
        }
      },
    });

    server.route({
      method: 'GET',
      path: '/ewc-codes',
      handler: async function ({ query }) {
        let language = query['language'] as string | undefined;
        if (!language) {
          language = 'en';
        }

        language = language.toLowerCase();
        if (language !== 'en' && language !== 'cy') {
          return Boom.badRequest(
            "Language '" + language + "' is not supported"
          );
        }

        try {
          return await backend.listEWCCodes(language);
        } catch (error) {
          if (error instanceof Boom.Boom) {
            return error;
          }
          logger.error('Unknown error', { error: error });
          return Boom.internal();
        }
      },
    });

    server.route({
      method: 'GET',
      path: '/countries',
      handler: async function () {
        try {
          return await backend.listCountries();
        } catch (error) {
          if (error instanceof Boom.Boom) {
            return error;
          }
          logger.error('Unknown error', { error: error });
          return Boom.internal();
        }
      },
    });

    server.route({
      method: 'GET',
      path: '/recovery-codes',
      handler: async function ({ query }) {
        let language = query['language'] as string | undefined;
        if (!language) {
          language = 'en';
        }

        language = language.toLowerCase();
        if (language !== 'en' && language !== 'cy') {
          return Boom.badRequest(
            "Language '" + language + "' is not supported"
          );
        }

        try {
          return await backend.listRecoveryCodes(language);
        } catch (error) {
          if (error instanceof Boom.Boom) {
            return error;
          }
          logger.error('Unknown error', { error: error });
          return Boom.internal();
        }
      },
    });

    server.route({
      method: 'GET',
      path: '/disposal-codes',
      handler: async function ({ query }) {
        let language = query['language'] as string | undefined;
        if (!language) {
          language = 'en';
        }

        language = language.toLowerCase();
        if (language !== 'en' && language !== 'cy') {
          return Boom.badRequest(
            "Language '" + language + "' is not supported"
          );
        }

        try {
          return await backend.listDisposalCodes(language);
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
