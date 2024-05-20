import { Logger } from 'winston';
import { Plugin } from '@hapi/hapi';
import Boom from '@hapi/boom';
import * as dto from '@wts/api/waste-tracking-gateway';
import { UkWasteMovementsSubmissionBackend } from './uk-waste-movements-submission.backend';
import { isValid } from 'date-fns';

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

    server.route({
      method: 'GET',
      path: '/drafts',
      handler: async function ({ query }) {
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
              Number(dateArr[0])
            );
            if (
              !isValid(collectionDate) ||
              !(collectionDate.getMonth() + 1 === Number(dateArr[1]))
            ) {
              return Boom.badRequest('Invalid collection date');
            }
          }

          let pageSize: number | undefined = Number(query.pageSize);
          if (isNaN(pageSize)) {
            pageSize = undefined;
          }

          const req: dto.UkwmGetDraftsRequest = {
            page: Number(query.page),
            pageSize: pageSize,
            collectionDate: collectionDate,
            ewcCode: query.ewcCode,
            producerName: query.producerName,
            wasteMovementId: query.wasteMovementId,
          };

          const result = await backend.getDrafts(req);
          return result as dto.UkwmGetDraftsResult;
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
