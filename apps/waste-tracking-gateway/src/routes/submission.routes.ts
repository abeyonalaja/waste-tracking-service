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
    path: '/api/submissions',
    handler: listSubmissions,
  });

  server.route({
    method: 'GET',
    path: '/api/submissions/{reference}',
    handler: getSubmissionByReference,
  });

  server.route({
    method: 'GET',
    path: '/api/submission/{id}',
    handler: getSubmissionById,
  });

  server.route({
    method: 'POST',
    path: '/api/submission',
    handler: createSubmission,
  });

  server.route({
    method: 'DELETE',
    path: '/api/submission/{id}',
    handler: deleteSubmission,
  });

  server.route({
    method: 'PUT',
    path: '/api/submission/{id}',
    handler: updateSubmission,
  });
};
