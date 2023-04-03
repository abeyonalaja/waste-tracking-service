import { Plugin } from '@hapi/hapi';
import SubmissionController from './submission.controller';
import * as dto from '@wts/api/waste-tracking-gateway';
import {
  validateCreateSubmissionRequest,
  validatePutWasteDescriptionRequest,
} from './submission.validation';
import Boom from '@hapi/boom';

export interface PluginOptions {
  controller: SubmissionController;
}

const plugin: Plugin<PluginOptions> = {
  name: 'submissions',
  version: '1.0.0',
  register: async function (server, { controller }) {
    server.route({
      method: 'GET',
      path: '/',
      handler: async function () {
        return await controller.listSubmissions();
      },
    });

    server.route({
      method: 'GET',
      path: '/{id}',
      handler: async function ({ params }) {
        const value = await controller.getSubmission(params.id);
        if (value === undefined) {
          return Boom.notFound();
        }

        return value;
      },
    });

    server.route({
      method: 'POST',
      path: '/',
      handler: async function ({ payload }, h) {
        if (!validateCreateSubmissionRequest(payload)) {
          return Boom.badRequest();
        }

        const request = payload as dto.CreateSubmissionRequest;
        return h.response(await controller.createSubmission(request)).code(201);
      },
    });

    server.route({
      method: 'GET',
      path: '/{id}/waste-description',
      handler: async function ({ params }) {
        const value = await controller.getWasteDescription(params.id);
        if (value === undefined) {
          return Boom.notFound();
        }

        return value;
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
        const value = await controller.putWasteDescription(params.id, request);
        if (value === undefined) {
          return Boom.notFound();
        }

        return value;
      },
    });
  },
};

export default plugin;
