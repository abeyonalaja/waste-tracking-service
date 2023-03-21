import { Server } from '@hapi/hapi';
import {
  listSubmissions,
  getSubmissionByReference,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
  createSubmission,
} from '../controllers/submissions.controller';

export const routes = (server: Server) => {
  server.route({
    method: 'GET',
    path: '/submissions',
    handler: listSubmissions,
  });

  server.route({
    method: 'GET',
    path: '/submissions/{reference}',
    handler: getSubmissionByReference,
  });

  server.route({
    method: 'GET',
    path: '/submission/{id}',
    handler: getSubmissionById,
  });

  server.route({
    method: 'POST',
    path: '/submission',
    handler: createSubmission,
  });

  server.route({
    method: 'DELETE',
    path: '/submission/{id}',
    handler: deleteSubmission,
  });

  server.route({
    method: 'PUT',
    path: '/submission/{id}',
    handler: updateSubmission,
  });
};
