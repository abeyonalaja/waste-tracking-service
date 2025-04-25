import { Plugin } from '@hapi/hapi';
import * as dto from '@wts/api/waste-tracking-gateway';
import {
  validateCreateSubmissionRequest,
  validatePutWasteDescriptionRequest,
  validatePutReferenceRequest,
  validatePutExporterDetailRequest,
  validatePutImporterDetailRequest,
  validateCreateCarriersRequest,
  validateSetCarriersRequest,
  validateSetCollectionDetailRequest,
  validatePutExitLocationRequest,
  validatePutTransitCountriesRequest,
  validateSetRecoveryFacilityDetailRequest,
  validateCreateRecoveryFacilityDetailRequest,
  validatePutSubmissionConfirmationRequest,
  validatePutSubmissionDeclarationRequest,
  validatePutSubmissionCancellationRequest,
  validatePutDraftWasteQuantityRequest,
  validatePutDraftCollectionDateRequest,
  validatePutSubmissionCollectionDateRequest,
  validatePutSubmissionWasteQuantityRequest,
} from './submission.validation';
import Boom from '@hapi/boom';
import { SubmissionBackend } from './submission.backend';
import { Logger } from 'winston';

export interface PluginOptions {
  backend: SubmissionBackend;
  logger: Logger;
}

const plugin: Plugin<PluginOptions> = {
  name: 'submissions',
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

        const stateStr = query['state'] as string | undefined;
        let state: dto.SubmissionState['status'][] | undefined;
        if (stateStr) {
          state = stateStr
            .replace(/\s/g, '')
            .split(',')
            .map((i) => i as dto.SubmissionState['status']);
        }

        const token = query['paginationToken'] as string | undefined;
        try {
          const value = await backend.getSubmissions(
            h.request.auth.credentials.accountId as string,
            { order },
            pageLimit,
            state,
            token,
          );
          return value as dto.GetSubmissionsResponse;
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
      handler: async function ({ params, query }, h) {
        const submittedStr = query['submitted'] as string | undefined;
        let submitted = false;
        if (submittedStr) {
          try {
            submitted = JSON.parse(submittedStr.toLowerCase());
          } catch (err) {
            return Boom.badRequest(
              "Query parameter 'submitted' must be of type boolean",
            );
          }
        }

        try {
          const value = await backend.getSubmission({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
            submitted,
          });
          return value as dto.GetSubmissionResponse;
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
        if (!validateCreateSubmissionRequest(payload)) {
          return Boom.badRequest();
        }

        const { reference } = payload as dto.CreateSubmissionRequest;
        try {
          return h
            .response(
              (await backend.createSubmission(
                h.request.auth.credentials.accountId as string,
                reference,
              )) as dto.CreateSubmissionResponse,
            )
            .code(201);
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
      method: 'POST',
      path: '/copy-template/{id}',
      handler: async function ({ params, payload }, h) {
        if (!validateCreateSubmissionRequest(payload)) {
          return Boom.badRequest();
        }

        const { reference } = payload as dto.CreateSubmissionRequest;
        try {
          return h
            .response(
              (await backend.createSubmissionFromTemplate(
                params.id,
                h.request.auth.credentials.accountId as string,
                reference,
              )) as dto.CreateSubmissionResponse,
            )
            .code(201);
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
      method: 'DELETE',
      path: '/{id}',
      handler: async function ({ params }, h) {
        try {
          return h
            .response(
              (await backend.deleteSubmission({
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
      method: 'PUT',
      path: '/{id}/cancel',
      handler: async function ({ params, payload }, h) {
        if (!validatePutSubmissionCancellationRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.PutSubmissionCancellationRequest;

        try {
          await backend.cancelSubmission(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            request,
          );
          return request as dto.PutSubmissionCancellationReponse;
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
      path: '/{id}/waste-quantity',
      handler: async function ({ params, query }, h) {
        const submittedStr = query['submitted'] as string | undefined;
        let submitted = false;
        if (submittedStr) {
          try {
            submitted = JSON.parse(submittedStr.toLowerCase());
          } catch (err) {
            return Boom.badRequest(
              "Query parameter 'submitted' must be of type boolean",
            );
          }
        }

        try {
          const value = await backend.getWasteQuantity({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
            submitted,
          });
          return value as dto.GetWasteQuantityResponse;
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
      path: '/{id}/waste-quantity',
      handler: async function ({ params, query, payload }, h) {
        const submittedStr = query['submitted'] as string | undefined;
        let submitted = false;
        if (submittedStr) {
          try {
            submitted = JSON.parse(submittedStr.toLowerCase());
          } catch (err) {
            return Boom.badRequest(
              "Query parameter 'submitted' must be of type boolean",
            );
          }
        }

        if (!submitted) {
          if (!validatePutDraftWasteQuantityRequest(payload)) {
            return Boom.badRequest();
          }
        } else {
          if (!validatePutSubmissionWasteQuantityRequest(payload)) {
            return Boom.badRequest();
          }
        }

        const request = payload as dto.PutWasteQuantityRequest;
        try {
          await backend.setWasteQuantity(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
              submitted,
            },
            request,
          );
          return request as dto.PutWasteQuantityResponse;
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
      path: '/{id}/reference',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getCustomerReference({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.GetReferenceResponse;
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
      path: '/{id}/reference',
      handler: async function ({ params, payload }, h) {
        if (!validatePutReferenceRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.PutReferenceRequest;
        try {
          await backend.setCustomerReference(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            request,
          );
          return request as dto.PutReferenceResponse;
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
      path: '/{id}/collection-date',
      handler: async function ({ params, query }, h) {
        const submittedStr = query['submitted'] as string | undefined;
        let submitted = false;
        if (submittedStr) {
          try {
            submitted = JSON.parse(submittedStr.toLowerCase());
          } catch (err) {
            return Boom.badRequest(
              "Query parameter 'submitted' must be of type boolean",
            );
          }
        }

        try {
          const value = await backend.getCollectionDate({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
            submitted,
          });
          return value as dto.GetCollectionDateResponse;
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
      path: '/{id}/collection-date',
      handler: async function ({ params, query, payload }, h) {
        const submittedStr = query['submitted'] as string | undefined;
        let submitted = false;
        if (submittedStr) {
          try {
            submitted = JSON.parse(submittedStr.toLowerCase());
          } catch (err) {
            return Boom.badRequest(
              "Query parameter 'submitted' must be of type boolean",
            );
          }
        }

        if (!submitted) {
          if (!validatePutDraftCollectionDateRequest(payload)) {
            return Boom.badRequest();
          }
        } else {
          if (!validatePutSubmissionCollectionDateRequest(payload)) {
            return Boom.badRequest();
          }
        }

        const request = payload as dto.PutCollectionDateRequest;
        try {
          await backend.setCollectionDate(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
              submitted,
            },
            request,
          );
          return request as dto.PutCollectionDateResponse;
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
            err.output.payload.data = err.data ?? undefined;
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
          return request as dto.SetRecoveryFacilityDetailResponse;
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

    server.route({
      method: 'GET',
      path: '/{id}/submission-confirmation',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getSubmissionConfirmation({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.GetSubmissionConfirmationResponse;
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
      path: '/{id}/submission-confirmation',
      handler: async function ({ params, payload }, h) {
        if (!validatePutSubmissionConfirmationRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.PutSubmissionConfirmationRequest;
        try {
          await backend.setSubmissionConfirmation(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            request,
          );
          return request as dto.PutSubmissionConfirmationResponse;
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
      path: '/{id}/submission-declaration',
      handler: async function ({ params }, h) {
        try {
          const value = await backend.getSubmissionDeclaration({
            id: params.id,
            accountId: h.request.auth.credentials.accountId as string,
          });
          return value as dto.GetSubmissionDeclarationResponse;
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
      path: '/{id}/submission-declaration',
      handler: async function ({ params, payload }, h) {
        if (!validatePutSubmissionDeclarationRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.PutSubmissionDeclarationRequest;
        try {
          await backend.setSubmissionDeclaration(
            {
              id: params.id,
              accountId: h.request.auth.credentials.accountId as string,
            },
            request,
          );
          return request as dto.PutSubmissionDeclarationResponse;
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
      path: '/numberOfSubmissions',
      handler: async function (h) {
        try {
          const value = await backend.getNumberOfSubmissions(
            h.auth.credentials.accountId as string,
          );
          return value as dto.GetNumberOfSubmissionsResponse;
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
