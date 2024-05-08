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
      handler: async function ({ query }) {
        const includeHazardousStr = query['includeHazardous'] as
          | string
          | undefined;
        let includeHazardous = false;
        if (includeHazardousStr) {
          try {
            includeHazardous = JSON.parse(includeHazardousStr.toLowerCase());
          } catch (err) {
            return Boom.badRequest(
              "Query parameter 'includeHazardous' must be of type boolean"
            );
          }
        }
        try {
          return await backend.listEWCCodes(includeHazardous);
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
      handler: async function ({ query }) {
        const includeUkStr = query['includeUk'] as string | undefined;

        let includeUk = false;
        if (includeUkStr) {
          try {
            includeUk = JSON.parse(includeUkStr.toLowerCase());
          } catch (err) {
            return Boom.badRequest(
              "Query parameter 'includeUk' must be of type boolean"
            );
          }
        }

        try {
          return await backend.listCountries(includeUk);
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

    server.route({
      method: 'GET',
      path: '/hazardous-codes',
      handler: async function () {
        try {
          return await backend.listHazardousCodes();
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
      path: '/pops',
      handler: async function () {
        try {
          return await backend.listPops();
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
      path: '/local-authorities',
      handler: async function () {
        try {
          return await backend.listLocalAuthorities();
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
