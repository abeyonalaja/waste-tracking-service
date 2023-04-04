import { Plugin } from '@hapi/hapi';
import * as dto from '@wts/api/waste-tracking-gateway';
import {
  validateCreateSubmissionRequest,
  validatePutWasteDescriptionRequest,
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
        const value = await backend.getSubmissionById(params.id);
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
              reference
            )) as dto.CreateSubmissionResponse
          )
          .code(201);
      },
    });

    server.route({
      method: 'GET',
      path: '/{id}/waste-description',
      handler: async function ({ params }) {
        const value = await backend.getWasteDescriptionById(params.id);
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
        const value = await backend.setWasteDescriptionById(params.id, request);
        if (value === undefined) {
          return Boom.notFound();
        }

        return value as dto.PutWasteDescriptionResponse;
      },
    });
  },
};

export default plugin;
