import Boom from '@hapi/boom';
import { Plugin } from '@hapi/hapi';
import { AddressBackend } from './address.backend';
import { Logger } from 'winston';

export interface PluginOptions {
  backend: AddressBackend;
  logger: Logger;
}

const plugin: Plugin<PluginOptions> = {
  name: 'addresses',
  version: '1.0.0',
  register: async function (server, { backend, logger }) {
    server.route({
      method: 'GET',
      path: '/',
      handler: async function ({ query }) {
        const postcode = query['postcode'] as string | undefined;
        if (!postcode) {
          return Boom.badRequest("Missing query parameter 'postcode'");
        }
        const buildingNameOrNumber = query['buildingNameOrNumber'] as
          | string
          | undefined;
        try {
          return await backend.listAddresses(postcode, buildingNameOrNumber);
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
