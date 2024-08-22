import { Logger } from 'winston';
import { Plugin } from '@hapi/hapi';
import Boom from '@hapi/boom';
import * as dto from '@wts/api/waste-tracking-gateway';
import { UkWasteMovementsSubmissionBackend } from './uk-waste-movements-submission.backend';
import { isValid } from 'date-fns';
import {
  validateCreateDraftRequest,
  validateSetDraftProducerAddressDetailsRequest,
  validateSetPartialDraftProducerAddressDetailsRequest,
  validateSetDraftProducerContactRequest,
  validateSetPartialDraftProducerContactRequest,
  validateSetDraftWasteCollectionAddressDetailsRequest,
  validateSetPartialDraftWasteCollectionAddressDetailsRequest,
  validateSetDraftWasteSourceRequest,
  validateCreateDraftSicCodeRequest,
  validateSetDraftCarrierAddressDetailsRequest,
  validateSetPartialDraftCarrierAddressDetailsRequest,
  validateSetDraftReceiverAddressDetailsRequest,
  validateSetPartialDraftReceiverAddressDetailsRequest,
  validateSetDraftProducerConfirmationRequest,
  validateSetDraftReceiverContactRequest,
  validateSetPartialDraftReceiverContactRequest,
} from './uk-waste-movements-submission.validation';

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
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getDraft({
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

    server.route({
      method: 'GET',
      path: '/drafts/{id}/producer-address',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getDraftProducerAddressDetails({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.UkwmGetDraftProducerAddressDetailsResponse;
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
      method: 'PUT',
      path: '/drafts/{id}/producer-address',
      handler: async function ({ params, payload, query }, h) {
        const saveAsDraftStr = query['saveAsDraft'] as string | undefined;

        if (
          !saveAsDraftStr ||
          !['true', 'false'].includes(saveAsDraftStr.toLowerCase())
        ) {
          return Boom.badRequest();
        }

        const saveAsDraft: boolean = saveAsDraftStr.toLowerCase() === 'true';
        if (!saveAsDraft) {
          if (!validateSetDraftProducerAddressDetailsRequest(payload)) {
            return Boom.badRequest();
          }
        } else {
          if (!validateSetPartialDraftProducerAddressDetailsRequest(payload)) {
            return Boom.badRequest();
          }
        }
        const request =
          payload as dto.UkwmSetDraftProducerAddressDetailsRequest;
        try {
          await backend.setDraftProducerAddressDetails(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            request,
            saveAsDraft,
          );
          return request;
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

    server.route({
      method: 'GET',
      path: '/drafts/{id}/producer-contact',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getDraftProducerContactDetail({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.UkwmGetDraftProducerContactDetailResponse;
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
      method: 'PUT',
      path: '/drafts/{id}/producer-contact',
      handler: async function ({ params, payload, query }, h) {
        const saveAsDraftStr = query['saveAsDraft'] as string | undefined;
        if (
          !saveAsDraftStr ||
          !['true', 'false'].includes(saveAsDraftStr.toLowerCase())
        ) {
          return Boom.badRequest();
        }
        const saveAsDraft: boolean = saveAsDraftStr.toLowerCase() === 'true';
        if (!saveAsDraft) {
          if (!validateSetDraftProducerContactRequest(payload)) {
            return Boom.badRequest();
          }
        } else {
          if (!validateSetPartialDraftProducerContactRequest(payload)) {
            return Boom.badRequest();
          }
        }
        const request = payload as dto.UkwmSetDraftProducerContactDetailRequest;
        try {
          await backend.setDraftProducerContactDetail(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            request,
            saveAsDraft,
          );
          return request;
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

    server.route({
      method: 'GET',
      path: '/drafts/{id}/waste-source',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getDraftWasteSource({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.UkwmGetDraftWasteSourceResponse;
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
      method: 'PUT',
      path: '/drafts/{id}/waste-source',
      handler: async function ({ params, payload }, h) {
        if (!validateSetDraftWasteSourceRequest(payload)) {
          return Boom.badRequest();
        }
        const request = payload as dto.UkwmSetDraftWasteSourceRequest;
        try {
          await backend.setDraftWasteSource({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
            wasteSource: request.wasteSource,
          });
          return request;
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

    server.route({
      method: 'GET',
      path: '/drafts/{id}/waste-collection-address',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getDraftWasteCollectionAddressDetails({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.UkwmGetDraftWasteCollectionAddressDetailsResponse;
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
      method: 'PUT',
      path: '/drafts/{id}/waste-collection-address',
      handler: async function ({ params, payload, query }, h) {
        const saveAsDraftStr = query['saveAsDraft'] as string | undefined;

        if (
          !saveAsDraftStr ||
          !['true', 'false'].includes(saveAsDraftStr.toLowerCase())
        ) {
          return Boom.badRequest();
        }

        const saveAsDraft: boolean = saveAsDraftStr.toLowerCase() === 'true';
        if (!saveAsDraft) {
          if (!validateSetDraftWasteCollectionAddressDetailsRequest(payload)) {
            return Boom.badRequest();
          }
        } else if (
          !validateSetPartialDraftWasteCollectionAddressDetailsRequest(payload)
        ) {
          return Boom.badRequest();
        }
        const request =
          payload as dto.UkwmSetDraftWasteCollectionAddressDetailsRequest;
        try {
          await backend.setDraftWasteCollectionAddressDetails(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            request,
            saveAsDraft,
          );
          return request;
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

    server.route({
      method: 'GET',
      path: '/drafts/{id}/sic-code',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getDraftSicCodes({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.UkwmGetDraftSicCodesResponse;
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
      path: '/drafts/{id}/sic-code',
      handler: async function ({ params, payload }, h) {
        if (!validateCreateDraftSicCodeRequest(payload)) {
          return Boom.badRequest();
        }
        const request = payload as dto.UkwmCreateDraftSicCodeRequest;
        try {
          return h
            .response(
              await backend.createDraftSicCode({
                id: params.id,
                accountId: h.request.auth.credentials.accountId as string,
                sicCode: request.sicCode,
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

    server.route({
      method: 'GET',
      path: '/drafts/{id}/carrier-address',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getDraftCarrierAddressDetails({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.UkwmGetDraftCarrierAddressDetailsResponse;
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
      method: 'PUT',
      path: '/drafts/{id}/carrier-address',
      handler: async function ({ params, payload, query }, h) {
        const saveAsDraftStr = query['saveAsDraft'] as string | undefined;

        if (
          !saveAsDraftStr ||
          !['true', 'false'].includes(saveAsDraftStr.toLowerCase())
        ) {
          return Boom.badRequest();
        }

        const saveAsDraft: boolean = saveAsDraftStr.toLowerCase() === 'true';
        if (!saveAsDraft) {
          if (!validateSetDraftCarrierAddressDetailsRequest(payload)) {
            return Boom.badRequest();
          }
        } else if (
          !validateSetPartialDraftCarrierAddressDetailsRequest(payload)
        ) {
          return Boom.badRequest();
        }
        const request = payload as dto.UkwmSetDraftCarrierAddressDetailsRequest;
        try {
          await backend.setDraftCarrierAddressDetails(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            request,
            saveAsDraft,
          );
          return request;
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

    server.route({
      method: 'GET',
      path: '/drafts/{id}/receiver-address',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getDraftReceiverAddressDetails({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.UkwmGetDraftReceiverAddressDetailsResponse;
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
      method: 'PUT',
      path: '/drafts/{id}/receiver-address',
      handler: async function ({ params, payload, query }, h) {
        const saveAsDraftStr = query['saveAsDraft'] as string | undefined;

        if (
          !saveAsDraftStr ||
          !['true', 'false'].includes(saveAsDraftStr.toLowerCase())
        ) {
          return Boom.badRequest();
        }

        const saveAsDraft: boolean = saveAsDraftStr.toLowerCase() === 'true';
        if (!saveAsDraft) {
          if (!validateSetDraftReceiverAddressDetailsRequest(payload)) {
            return Boom.badRequest();
          }
        } else if (
          !validateSetPartialDraftReceiverAddressDetailsRequest(payload)
        ) {
          return Boom.badRequest();
        }
        const request =
          payload as dto.UkwmSetDraftReceiverAddressDetailsRequest;
        try {
          await backend.setDraftReceiverAddressDetails(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            request,
            saveAsDraft,
          );
          return request;
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

    server.route({
      method: 'DELETE',
      path: '/drafts/{id}/sic-code/{code}',
      handler: async function ({ params }, h) {
        try {
          return h
            .response(
              await backend.deleteDraftSicCode({
                id: params.id,
                accountId: h.request.auth.credentials.accountId as string,
                code: params.code,
              }),
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
      method: 'PUT',
      path: '/drafts/{id}/producer-confirmation',
      handler: async function ({ params, payload }, h) {
        if (!validateSetDraftProducerConfirmationRequest(payload)) {
          return Boom.badRequest();
        }
        const request = payload as dto.UkwmSetDraftProducerConfirmationRequest;
        try {
          await backend.setProducerConfirmation({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
            isConfirmed: request.isConfirmed,
          });
          return h.response().code(200);
        } catch (err) {
          if (err instanceof Boom.Boom) {
            err.output.payload.data = err?.data ?? undefined;
            return err;
          }

          logger.error('Unknown error', { error: err });
          return Boom.internal();
        }
      },
    });

    server.route({
      method: 'GET',
      path: '/drafts/{id}/receiver-contact',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getDraftReceiverContactDetail({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.UkwmGetDraftReceiverContactDetailResponse;
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
      method: 'PUT',
      path: '/drafts/{id}/receiver-contact',
      handler: async function ({ params, payload, query }, h) {
        const saveAsDraftStr = query['saveAsDraft'] as string | undefined;
        if (
          !saveAsDraftStr ||
          !['true', 'false'].includes(saveAsDraftStr.toLowerCase())
        ) {
          return Boom.badRequest();
        }
        const saveAsDraft: boolean = saveAsDraftStr.toLowerCase() === 'true';
        if (!saveAsDraft) {
          if (!validateSetDraftReceiverContactRequest(payload)) {
            return Boom.badRequest();
          }
        } else {
          if (!validateSetPartialDraftReceiverContactRequest(payload)) {
            return Boom.badRequest();
          }
        }
        const request =
          payload as dto.UkwmSetDraftReceiverContactDetailsRequest;
        try {
          await backend.setDraftReceiverContactDetail(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            request,
            saveAsDraft,
          );
          return request;
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
