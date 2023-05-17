import Boom from '@hapi/boom';
import { Plugin } from '@hapi/hapi';
import { AddressBackend } from './address.backend';
import { Logger } from 'winston';

export interface PluginOptions {
  addressBackend: AddressBackend;
  logger: Logger;
}

const plugin: Plugin<PluginOptions> = {
  name: 'addresses',
  version: '1.0.0',
  register: async function (server, { addressBackend, logger }) {
    server.route({
      method: 'GET',
      path: '/',
      handler: async function ({ query }) {
        const postcode = query['postcode'] as string | undefined;
        if (postcode === undefined) {
          return Boom.badRequest("Missing query parameter 'postcode'");
        }
        try {
          return await addressBackend.listAddresses(postcode);
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
