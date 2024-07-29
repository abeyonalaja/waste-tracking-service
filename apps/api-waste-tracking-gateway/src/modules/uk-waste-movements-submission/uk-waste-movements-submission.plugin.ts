import { Logger } from 'winston';
import { Plugin } from '@hapi/hapi';
import Boom from '@hapi/boom';
import * as dto from '@wts/api/waste-tracking-gateway';
import { UkWasteMovementsSubmissionBackend } from './uk-waste-movements-submission.backend';
import { isValid } from 'date-fns';
import { validateCreateDraftRequest } from './uk-waste-movements-submission.validation';

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

          const req: dto.UkwmGetDraftsRequest = {
            page: page,
            pageSize: pageSize,
            collectionDate: collectionDate,
            ewcCode: query.ewcCode,
            producerName: query.producerName,
            wasteMovementId: query.wasteMovementId,
          };

          const result = await backend.getDrafts(req);
          return result;
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
      path: '/drafts',
      handler: async function ({ payload }, h) {
        if (!validateCreateDraftRequest(payload)) {
          return Boom.badRequest();
        }
        const reference = (payload as dto.UkwmCreateDraftRequest)?.reference;
        try {
          return h
            .response(
              await backend.createDraft({
                reference,
                accountId: h.request.auth.credentials.accountId as string,
              }),
            )
            .code(201);
        } catch (err) {
          if (err instanceof Boom.Boom) {
            err.output.payload.data = err?.data;
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
