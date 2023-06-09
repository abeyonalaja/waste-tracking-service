import { Plugin } from '@hapi/hapi';
import * as dto from '@wts/api/waste-tracking-gateway';
import {
  validateCreateSubmissionRequest,
  validatePutWasteDescriptionRequest,
  validatePutReferenceRequest,
  validatePutWasteQuantityRequest,
  validatePutExporterDetailRequest,
  validatePutImporterDetailRequest,
  validatePutCollectionDateRequest,
  validateCreateCarriersRequest,
  validateSetCarriersRequest,
  validateSetCollectionDetailRequest,
  validatePutExitLocationRequest,
  validatePutTransitCountriesRequest,
  validateSetRecoveryFacilityDetailRequest,
  validateCreateRecoveryFacilityDetailRequest,
} from './submission.validation';
import Boom from '@hapi/boom';
import { SubmissionBackend } from './submission.backend';
import { Logger } from 'winston';

export interface PluginOptions {
  backend: SubmissionBackend;
  logger: Logger;
}

/**
 * This is a placeholder for an account-ID that will be drawn from an identity
 * token; we are currently simulating a single account.
 */
const accountId = 'c3c99728-3d5e-4357-bfcb-32dd913a55e8';

const plugin: Plugin<PluginOptions> = {
  name: 'submissions',
  version: '1.0.0',
  register: async function (server, { backend, logger }) {
    server.route({
      method: 'GET',
      path: '/{id}',
      handler: async function ({ params }) {
        try {
          const value = await backend.getSubmission({
            id: params.id,
            accountId,
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
                accountId,
                reference === undefined ? null : reference
              )) as dto.CreateSubmissionResponse
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
      path: '/{id}/waste-description',
      handler: async function ({ params }) {
        try {
          const value = await backend.getWasteDescription({
            id: params.id,
            accountId,
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
      handler: async function ({ params, payload }) {
        if (!validatePutWasteDescriptionRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.PutWasteDescriptionRequest;
        try {
          await backend.setWasteDescription(
            { id: params.id, accountId },
            request
          );
          return request as dto.PutWasteDescriptionResponse;
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
      path: '/{id}/waste-quantity',
      handler: async function ({ params }) {
        try {
          const value = await backend.getWasteQuantity({
            id: params.id,
            accountId,
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
      handler: async function ({ params, payload }) {
        if (!validatePutWasteQuantityRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.PutWasteQuantityRequest;
        try {
          await backend.setWasteQuantity({ id: params.id, accountId }, request);
          return request as dto.PutWasteDescriptionRequest;
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
      path: '/{id}/reference',
      handler: async function ({ params }) {
        try {
          const value = await backend.getCustomerReference({
            id: params.id,
            accountId,
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
      handler: async function ({ params, payload }) {
        if (!validatePutReferenceRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.PutReferenceRequest;
        try {
          await backend.setCustomerReference(
            { id: params.id, accountId },
            request
          );
          return request as dto.PutReferenceResponse;
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
      path: '/{id}/exporter-detail',
      handler: async function ({ params }) {
        try {
          const value = await backend.getExporterDetail({
            id: params.id,
            accountId,
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
      handler: async function ({ params, payload }) {
        if (!validatePutExporterDetailRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.PutExporterDetailRequest;
        try {
          await backend.setExporterDetail(
            { id: params.id, accountId },
            request
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
      handler: async function ({ params }) {
        try {
          const value = await backend.getImporterDetail({
            id: params.id,
            accountId,
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
      handler: async function ({ params, payload }) {
        if (!validatePutImporterDetailRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.PutImporterDetailRequest;
        try {
          await backend.setImporterDetail(
            { id: params.id, accountId },
            request
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
      path: '/{id}/collection-date',
      handler: async function ({ params }) {
        try {
          const value = await backend.getCollectionDate({
            id: params.id,
            accountId,
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
      handler: async function ({ params, payload }) {
        if (!validatePutCollectionDateRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.PutCollectionDateRequest;
        try {
          await backend.setCollectionDate(
            { id: params.id, accountId },
            request
          );
          return request as dto.PutCollectionDateResponse;
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
      handler: async function ({ params }) {
        try {
          const value = await backend.listCarriers({
            id: params.id,
            accountId,
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
                  accountId,
                },
                request
              )) as dto.CreateCarriersResponse
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
      handler: async function ({ params }) {
        try {
          const value = await backend.getCarriers(
            {
              id: params.id,
              accountId,
            },
            params.carrierId
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
      handler: async function ({ params, payload }) {
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
              accountId,
            },
            params.carrierId,
            request
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
                  accountId,
                },
                params.carrierId
              )) as undefined
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
      handler: async function ({ params }) {
        try {
          const value = await backend.getCollectionDetail({
            id: params.id,
            accountId,
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
      handler: async function ({ params, payload }) {
        if (!validateSetCollectionDetailRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.SetCollectionDetailRequest;
        try {
          await backend.setCollectionDetail(
            { id: params.id, accountId },
            request
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
      handler: async function ({ params }) {
        try {
          const value = await backend.getExitLocation({
            id: params.id,
            accountId,
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
      handler: async function ({ params, payload }) {
        if (!validatePutExitLocationRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.PutExitLocationRequest;
        try {
          await backend.setExitLocation({ id: params.id, accountId }, request);
          return request as dto.PutExitLocationResponse;
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
      path: '/{id}/transit-countries',
      handler: async function ({ params }) {
        try {
          const value = await backend.getTransitCountries({
            id: params.id,
            accountId,
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
      handler: async function ({ params, payload }) {
        if (!validatePutTransitCountriesRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.PutTransitCountriesRequest;
        try {
          await backend.setTransitCountries(
            { id: params.id, accountId },
            request
          );
          return request as dto.PutTransitCountriesResponse;
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
      path: '/{id}/recovery-facility',
      handler: async function ({ params }) {
        try {
          const value = await backend.listRecoveryFacilityDetail({
            id: params.id,
            accountId,
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
                  accountId,
                },
                request
              )) as dto.CreateRecoveryFacilityDetailRequest
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
      handler: async function ({ params }) {
        try {
          const value = await backend.getRecoveryFacilityDetail(
            {
              id: params.id,
              accountId,
            },
            params.rfdId
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
      handler: async function ({ params, payload }) {
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
              accountId,
            },
            params.rfdId,
            request
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
                  accountId,
                },
                params.rfdId
              )) as undefined
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
