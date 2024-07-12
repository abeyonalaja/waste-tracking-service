import Boom from '@hapi/boom';
import { Plugin } from '@hapi/hapi';
import { PaymentBackend } from './payment.backend';
import { Logger } from 'winston';
import * as dto from '@wts/api/waste-tracking-gateway';
import { validateCreatePaymentRequest } from './payment.validation';

export interface PluginOptions {
  backend: PaymentBackend;
  logger: Logger;
}

const plugin: Plugin<PluginOptions> = {
  name: 'payments',
  version: '1.0.0',
  register: async function (server, { backend, logger }) {
    server.route({
      method: 'POST',
      path: '/',
      handler: async function ({ payload }, h) {
        if (!validateCreatePaymentRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.CreatePaymentRequest;
        try {
          return h
            .response(
              (await backend.createPayment(
                h.request.auth.credentials.accountId as string,
                request,
              )) as dto.CreatePaymentResponse,
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
    });

    server.route({
      method: 'PUT',
      path: '/{id}',
      handler: async function ({ params }, h) {
        try {
          return (await backend.setPayment({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          })) as dto.SetPaymentResponse;
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
      path: '/',
      handler: async function (_req, h) {
        try {
          return (await backend.getPayment(
            h.request.auth.credentials.accountId as string,
          )) as dto.GetPaymentResponse;
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
      method: 'POST',
      path: '/{id}/cancel',
      handler: async function ({ params }, h) {
        try {
          return h
            .response(
              (await backend.cancelPayment({
                id: params.id,
                accountId: h.request.auth.credentials.accountId as string,
              })) as dto.CancelPaymentResponse,
            )
            .code(204);
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
