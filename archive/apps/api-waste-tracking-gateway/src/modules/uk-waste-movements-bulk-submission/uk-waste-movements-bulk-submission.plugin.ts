import Boom from '@hapi/boom';
import { Plugin } from '@hapi/hapi';
import {
  SubmissionRef,
  UkWasteMovementsBulkSubmissionBackend,
} from './uk-waste-movements-bulk-submission.backend';
import * as multipart from 'parse-multipart-data';
import { Logger } from 'winston';
import { isValid } from 'date-fns';

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
          multipart.getBoundary(req.headers['content-type']),
        );

        try {
          return h
            .response(
              await backend.createBatch(
                h.request.auth.credentials.accountId as string,
                inputs,
              ),
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
          maxBytes: 1024 * 1024 * 15,
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
          return value;
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
              })) as undefined,
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

    server.route({
      method: 'GET',
      path: '/{id}/download',
      handler: async function ({ params }, h) {
        try {
          const csvData = await backend.downloadCsv({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });

          return h
            .response(csvData)
            .type('text/csv')
            .header(
              'Content-Disposition',
              'attachment;filename=waste-tracking.csv',
            ) as unknown;
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
      method: 'GET',
      path: '/{batchId}/rows/{rowId}',
      handler: async function ({ params }, h) {
        try {
          const row = await backend.getRow({
            accountId: h.request.auth.credentials.accountId as string,
            batchId: params.batchId,
            rowId: params.rowId,
          });

          return row;
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
      method: 'GET',
      path: '/{batchId}/columns/{columnRef}',
      handler: async function ({ params }, h) {
        try {
          const column = await backend.getColumn({
            accountId: h.request.auth.credentials.accountId as string,
            batchId: params.batchId,
            columnRef: params.columnRef,
          });

          return column;
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
      method: 'GET',
      path: '/{batchId}/submissions',
      handler: async function ({ params, query }, h) {
        try {
          let collectionDate: Date | undefined;
          const dateArr = query.collectionDate
            ?.toString()
            ?.replace(/-/g, '/')
            .split('/');

          if (dateArr?.length === 3) {
            collectionDate = new Date(
              Number(dateArr[2]),
              Number(dateArr[1]) - 1,
              Number(dateArr[0]),
            );
            if (
              !isValid(collectionDate) ||
              collectionDate.getMonth() + 1 !== Number(dateArr[1])
            ) {
              return Boom.badRequest('Invalid collection date');
            }
          }

          let pageSize: number | undefined = Number(query.pageSize);
          if (isNaN(pageSize)) {
            pageSize = undefined;
          }

          const page: number | undefined = Number(query.page);
          if (isNaN(page)) {
            return Boom.badRequest('Invalid page');
          }

          const req: SubmissionRef = {
            batchId: params.batchId,
            accountId: h.request.auth.credentials.accountId as string,
            page: page,
            pageSize: pageSize,
            collectionDate: collectionDate,
            ewcCode: query.ewcCode,
            producerName: query.producerName,
            wasteMovementId: query.wasteMovementId,
          };

          return await backend.getSubmissions(req);
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
