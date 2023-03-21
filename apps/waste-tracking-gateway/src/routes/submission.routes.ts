import { Server } from '@hapi/hapi';
import {
  listSubmissions,
  getSubmission,
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
    path: '/submissions/{id}',
    handler: getSubmission,
  });

  server.route({
    method: 'POST',
    path: '/submissions',
    handler: createSubmission,
  });

  server.route({
    method: 'DELETE',
    path: '/submissions/{id}',
    handler: deleteSubmission,
  });

  server.route({
    method: 'PUT',
    path: '/submissions/{id}',
    handler: updateSubmission,
  });
};
