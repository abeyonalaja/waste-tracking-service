import Boom from '@hapi/boom';
import { Plugin } from '@hapi/hapi';
import { UkWasteMovementsBulkSubmissionBackend } from './uk-waste-movements-bulk-submission.backend';
import * as multipart from 'parse-multipart-data';
import * as dto from '@wts/api/waste-tracking-gateway';
import { Logger } from 'winston';

export interface PluginOptions {
  backend: UkWasteMovementsBulkSubmissionBackend;
  logger: Logger;
}

const plugin: Plugin<PluginOptions> = {
  name: 'ukwm-bulk-submission',
  version: '1.0.0',
  register: async function (server, { backend, logger }) {
    server.route({
      method: 'POST',
      path: '/',
      handler: async function (req, h) {
        const inputs = multipart.parse(
          req.payload as Buffer,
          multipart.getBoundary(req.headers['content-type'])
        );

        try {
          return h
            .response(
              await backend.createBatch(
                h.request.auth.credentials.accountId as string,
                inputs
              )
            )
            .code(201);
        } catch (error) {
          if (error instanceof Boom.Boom) {
            return error;
          }

          logger.error('Unknown error', { error: error });
          return Boom.internal();
        }
      },
      options: {
        payload: {
          parse: false,
          multipart: {
            output: 'stream',
          },
          allow: 'multipart/form-data',
        },
      },
    });

    server.route({
      method: 'GET',
      path: '/{id}',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getBatch({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.GetUwkwmBulkSubmissionResponse;
        } catch (err) {
          if (err instanceof Boom.Boom) {
            return err;
          }

          logger.error('Unknown error', { error: err });
          return Boom.internal();
        }
      },
    });

    server.route({
      method: 'POST',
      path: '/{id}/finalize',
      handler: async function ({ params }, h) {
        try {
          return h
            .response(
              (await backend.finalizeBatch({
                id: params.id,
                accountId: h.request.auth.credentials.accountId as string,
              })) as undefined
            )
            .code(201);
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
