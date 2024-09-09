import { Plugin } from '@hapi/hapi';
import * as dto from '@wts/api/waste-tracking-gateway';
import { validateCreateTemplateRequest } from './template.validation';
import Boom from '@hapi/boom';
import { TemplateBackend } from './template.backend';
import { Logger } from 'winston';
import {
  validateCreateCarriersRequest,
  validateCreateRecoveryFacilityDetailRequest,
  validatePutExitLocationRequest,
  validatePutExporterDetailRequest,
  validatePutImporterDetailRequest,
  validatePutTransitCountriesRequest,
  validatePutWasteDescriptionRequest,
  validateSetCarriersRequest,
  validateSetCollectionDetailRequest,
  validateSetRecoveryFacilityDetailRequest,
} from '../submission/submission.validation';

export interface PluginOptions {
  backend: TemplateBackend;
  logger: Logger;
}

const plugin: Plugin<PluginOptions> = {
  name: 'templates',
  version: '1.0.0',
  register: async function (server, { backend, logger }) {
    server.route({
      method: 'GET',
      path: '/',
      handler: async function ({ query }, h) {
        let order = query['order'] as string | undefined;
        if (!order) {
          order = 'ASC';
        }

        order = order.toUpperCase();
        if (order !== 'ASC' && order !== 'DESC') {
          return Boom.badRequest("Incorrect value for query parameter 'order'");
        }

        const pageLimitStr = query['pageLimit'] as string | undefined;
        if (pageLimitStr && Number.isNaN(parseInt(pageLimitStr))) {
          return Boom.badRequest(
            "Query parameter 'pageLimit' should be a number",
          );
        }
        const pageLimit = pageLimitStr ? parseInt(pageLimitStr) : undefined;

        const token = query['paginationToken'] as string | undefined;
        try {
          const value = await backend.getTemplates(
            h.request.auth.credentials.accountId as string,
            { order },
            pageLimit,
            token,
          );
          return value as dto.GetTemplatesResponse;
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
      path: '/numberOfTemplates',
      handler: async function (h) {
        try {
          const value = await backend.getNumberOfTemplates(
            h.auth.credentials.accountId as string,
          );
          return value as dto.GetNumberOfTemplatesResponse;
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
      path: '/{id}',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getTemplate({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.GetTemplateResponse;
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
      path: '/',
      handler: async function ({ payload }, h) {
        if (!validateCreateTemplateRequest(payload)) {
          return Boom.badRequest();
        }

        const { templateDetails } = payload as dto.CreateTemplateRequest;
        try {
          return h
            .response(
              (await backend.createTemplate(
                h.request.auth.credentials.accountId as string,
                templateDetails,
              )) as dto.CreateTemplateResponse,
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
      method: 'POST',
      path: '/copy-submission/{id}',
      handler: async function ({ params, payload }, h) {
        if (!validateCreateTemplateRequest(payload)) {
          return Boom.badRequest();
        }

        const { templateDetails } = payload as dto.CreateTemplateRequest;

        try {
          return h
            .response(
              (await backend.createTemplateFromSubmission(
                params.id,
                h.request.auth.credentials.accountId as string,
                templateDetails,
              )) as dto.CreateTemplateResponse,
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
      method: 'POST',
      path: '/copy-template/{id}',
      handler: async function ({ params, payload }, h) {
        if (!validateCreateTemplateRequest(payload)) {
          return Boom.badRequest();
        }

        const { templateDetails } = payload as dto.CreateTemplateRequest;

        try {
          return h
            .response(
              (await backend.createTemplateFromTemplate(
                params.id,
                h.request.auth.credentials.accountId as string,
                templateDetails,
              )) as dto.CreateTemplateResponse,
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
      path: '/update/{id}',
      handler: async function ({ params, payload }, h) {
        if (!validateCreateTemplateRequest(payload)) {
          return Boom.badRequest();
        }

        const { templateDetails } = payload as dto.CreateTemplateRequest;

        try {
          return h
            .response(
              (await backend.updateTemplate(
                params.id,
                h.request.auth.credentials.accountId as string,
                templateDetails,
              )) as dto.CreateTemplateResponse,
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
      method: 'DELETE',
      path: '/{id}',
      handler: async function ({ params }, h) {
        try {
          return h
            .response(
              (await backend.deleteTemplate({
                id: params.id,
                accountId: h.request.auth.credentials.accountId as string,
              })) as undefined,
            )
            .code(204);
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
      path: '/{id}/waste-description',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getWasteDescription({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.GetWasteDescriptionResponse;
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
      path: '/{id}/waste-description',
      handler: async function ({ params, payload }, h) {
        if (!validatePutWasteDescriptionRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.PutWasteDescriptionRequest;
        try {
          await backend.setWasteDescription(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            request,
          );
          return request as dto.PutWasteDescriptionResponse;
        } catch (err) {
          if (err instanceof Boom.Boom) {
            err.output.payload.data = err.data ?? undefined;
            return err;
          }

          logger.error('Unknown error', { error: err });
          return Boom.internal();
        }
      },
    });

    server.route({
      method: 'GET',
      path: '/{id}/exporter-detail',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getExporterDetail({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.GetExporterDetailResponse;
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
      path: '/{id}/exporter-detail',
      handler: async function ({ params, payload }, h) {
        if (!validatePutExporterDetailRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.PutExporterDetailRequest;
        try {
          await backend.setExporterDetail(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            request,
          );
          return request as dto.PutExporterDetailResponse;
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
      path: '/{id}/importer-detail',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getImporterDetail({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.GetImporterDetailResponse;
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
      path: '/{id}/importer-detail',
      handler: async function ({ params, payload }, h) {
        if (!validatePutImporterDetailRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.PutImporterDetailRequest;
        try {
          await backend.setImporterDetail(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            request,
          );
          return request as dto.PutImporterDetailResponse;
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
      path: '/{id}/carriers',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.listCarriers({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.ListCarriersResponse;
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
      path: '/{id}/carriers',
      handler: async function ({ params, payload }, h) {
        if (!validateCreateCarriersRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.CreateCarriersRequest;
        try {
          return h
            .response(
              (await backend.createCarriers(
                {
                  id: params.id,
                  accountId: h.request.auth.credentials.accountId as string,
                },
                request,
              )) as dto.CreateCarriersResponse,
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
      path: '/{id}/carriers/{carrierId}',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getCarriers(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            params.carrierId,
          );
          return value as dto.GetCarriersResponse;
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
      path: '/{id}/carriers/{carrierId}',
      handler: async function ({ params, payload }, h) {
        if (!validateSetCarriersRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.SetCarriersRequest;
        if (request.status !== 'NotStarted') {
          for (const c of request.values) {
            if (c.id !== params.carrierId) {
              return Boom.badRequest();
            }
          }
        }
        try {
          await backend.setCarriers(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            params.carrierId,
            request,
          );
          return request as dto.SetCarriersRequest;
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
      method: 'DELETE',
      path: '/{id}/carriers/{carrierId}',
      handler: async function ({ params }, h) {
        try {
          return h
            .response(
              (await backend.deleteCarriers(
                {
                  id: params.id,
                  accountId: h.request.auth.credentials.accountId as string,
                },
                params.carrierId,
              )) as undefined,
            )
            .code(204);
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
      path: '/{id}/collection-detail',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getCollectionDetail({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.GetCollectionDetailResponse;
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
      path: '/{id}/collection-detail',
      handler: async function ({ params, payload }, h) {
        if (!validateSetCollectionDetailRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.SetCollectionDetailRequest;
        try {
          await backend.setCollectionDetail(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            request,
          );
          return request as dto.SetCollectionDetailResponse;
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
      path: '/{id}/exit-location',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getExitLocation({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.GetExitLocationResponse;
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
      path: '/{id}/exit-location',
      handler: async function ({ params, payload }, h) {
        if (!validatePutExitLocationRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.PutExitLocationRequest;
        try {
          await backend.setExitLocation(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            request,
          );
          return request as dto.PutExitLocationResponse;
        } catch (err) {
          if (err instanceof Boom.Boom) {
            err.output.payload.data = err.data ?? undefined;
            return err;
          }

          logger.error('Unknown error', { error: err });
          return Boom.internal();
        }
      },
    });

    server.route({
      method: 'GET',
      path: '/{id}/transit-countries',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getTransitCountries({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.GetTransitCountriesResponse;
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
      path: '/{id}/transit-countries',
      handler: async function ({ params, payload }, h) {
        if (!validatePutTransitCountriesRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.PutTransitCountriesRequest;
        try {
          await backend.setTransitCountries(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            request,
          );
          return request as dto.PutTransitCountriesResponse;
        } catch (err) {
          if (err instanceof Boom.Boom) {
            err.output.payload.data = err.data ?? undefined;
            return err;
          }

          logger.error('Unknown error', { error: err });
          return Boom.internal();
        }
      },
    });

    server.route({
      method: 'GET',
      path: '/{id}/recovery-facility',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.listRecoveryFacilityDetail({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.ListRecoveryFacilityDetailResponse;
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
      path: '/{id}/recovery-facility',
      handler: async function ({ params, payload }, h) {
        if (!validateCreateRecoveryFacilityDetailRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.CreateRecoveryFacilityDetailRequest;
        try {
          return h
            .response(
              (await backend.createRecoveryFacilityDetail(
                {
                  id: params.id,
                  accountId: h.request.auth.credentials.accountId as string,
                },
                request,
              )) as dto.CreateRecoveryFacilityDetailRequest,
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
      path: '/{id}/recovery-facility/{rfdId}',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getRecoveryFacilityDetail(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            params.rfdId,
          );
          return value as dto.GetRecoveryFacilityDetailResponse;
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
      path: '/{id}/recovery-facility/{rfdId}',
      handler: async function ({ params, payload }, h) {
        if (!validateSetRecoveryFacilityDetailRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.SetRecoveryFacilityDetailRequest;
        if (request.status === 'Started' || request.status === 'Complete') {
          for (const c of request.values) {
            if (c.id !== params.rfdId) {
              return Boom.badRequest();
            }
          }
        }
        try {
          await backend.setRecoveryFacilityDetail(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            params.rfdId,
            request,
          );
          return request as dto.SetRecoveryFacilityDetailRequest;
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
      method: 'DELETE',
      path: '/{id}/recovery-facility/{rfdId}',
      handler: async function ({ params }, h) {
        try {
          return h
            .response(
              (await backend.deleteRecoveryFacilityDetail(
                {
                  id: params.id,
                  accountId: h.request.auth.credentials.accountId as string,
                },
                params.rfdId,
              )) as undefined,
            )
            .code(204);
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
