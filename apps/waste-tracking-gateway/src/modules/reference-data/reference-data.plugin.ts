import Boom from '@hapi/boom';
import { Plugin } from '@hapi/hapi';
import { Logger } from 'winston';
import { ReferenceDataBackend } from './reference-data.backend';

export interface PluginOptions {
  backend: ReferenceDataBackend;
  logger: Logger;
}

const plugin: Plugin<PluginOptions> = {
  name: 'reference-data',
  version: '1.0.0',
  register: async function (server, { backend, logger }) {
    server.route({
      method: 'GET',
      path: '/waste-codes',
      handler: async function () {
        try {
          return await backend.listWasteCodes();
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
      handler: async function () {
        try {
          return await backend.listEWCCodes();
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
      handler: async function () {
        try {
          return await backend.listRecoveryCodes();
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
      handler: async function () {
        try {
          return await backend.listDisposalCodes();
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
