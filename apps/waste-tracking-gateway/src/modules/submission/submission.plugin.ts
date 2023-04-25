import { Plugin } from '@hapi/hapi';
import * as dto from '@wts/api/waste-tracking-gateway';
import {
  validateCreateSubmissionRequest,
  validatePutWasteDescriptionRequest,
  validatePutReferenceRequest,
  validatePutWasteQuantityRequest,
} from './submission.validation';
import Boom from '@hapi/boom';
import { SubmissionBackend } from './submission.backend';

export interface PluginOptions {
  backend: SubmissionBackend;
}

const plugin: Plugin<PluginOptions> = {
  name: 'submissions',
  version: '1.0.0',
  register: async function (server, { backend }) {
    server.route({
      method: 'GET',
      path: '/',
      handler: async function () {
        return (await backend.listSubmissions()) as dto.ListSubmissionsResponse;
      },
    });

    server.route({
      method: 'GET',
      path: '/{id}',
      handler: async function ({ params }) {
        const value = await backend.getSubmission(params.id);
        if (value === undefined) {
          return Boom.notFound();
        }

        return value as dto.GetSubmissionResponse;
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
        return h
          .response(
            (await backend.createSubmission(
              reference === undefined ? null : reference
            )) as dto.CreateSubmissionResponse
          )
          .code(201);
      },
    });

    server.route({
      method: 'GET',
      path: '/{id}/waste-description',
      handler: async function ({ params }) {
        const value = await backend.getWasteDescription(params.id);
        if (value === undefined) {
          return Boom.notFound();
        }

        return value as dto.GetWasteDescriptionResponse;
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
        const value = await backend.setWasteDescription(params.id, request);
        if (value === undefined) {
          return Boom.notFound();
        }

        return value as dto.PutWasteDescriptionResponse;
      },
    });

    server.route({
      method: 'GET',
      path: '/{id}/waste-quantity',
      handler: async function ({ params }) {
        const value = await backend.getWasteQuantity(params.id);
        if (value === undefined) {
          return Boom.notFound();
        }

        return value as dto.GetWasteQuantityResponse;
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
        const value = await backend.setWasteQuantity(params.id, request);
        if (value === undefined) {
          return Boom.notFound();
        }

        return value as dto.PutWasteQuantityResponse;
      },
    });

    server.route({
      method: 'GET',
      path: '/{id}/reference',
      handler: async function ({ params }) {
        const value = await backend.getCustomerReference(params.id);
        if (value === undefined) {
          return Boom.notFound();
        }

        return value as dto.GetReferenceResponse;
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
        const value = await backend.setCustomerReference(params.id, request);
        if (value === undefined) {
          return Boom.notFound();
        }

        return value as dto.PutReferenceResponse;
      },
    });
  },
};

export default plugin;
