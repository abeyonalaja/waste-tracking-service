import Boom from '@hapi/boom';
import { Plugin } from '@hapi/hapi';
import { ListAddressesResponse } from '@wts/api/waste-tracking-gateway';

const plugin: Plugin<void> = {
  name: 'address',
  version: '1.0.0',
  register(server) {
    server.route({
      method: 'GET',
      path: '/',
      handler: function ({ query }) {
        const postcode = query['postcode'] as string | undefined;
        if (postcode === undefined) {
          return Boom.badRequest("Missing query parameter 'postcode'");
        }

        return [
          {
            addressLine1: 'Armira Capital Ltd',
            addressLine2: '110 Bishopsgate',
            townCity: 'LONDON',
            postcode: 'EC2N 4AY',
            country: 'United Kingdom',
          },
          {
            addressLine1: 'Autonomy Capital Research LLP',
            addressLine2: '110 Bishopsgate',
            townCity: 'LONDON',
            postcode: 'EC2N 4AY',
            country: 'United Kingdom',
          },
          {
            addressLine1: 'B A S F Metals',
            addressLine2: '110 Bishopsgate',
            townCity: 'LONDON',
            postcode: 'EC2N 4AY',
            country: 'United Kingdom',
          },
        ] as ListAddressesResponse;
      },
    });
  },
};

export default plugin;
