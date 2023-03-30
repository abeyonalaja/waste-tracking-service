import { Server } from '@hapi/hapi';
import { routes } from './routes/submission.routes';

export const wasteTrackingGateway = async () => {
  const server: Server = new Server({
    port: 3000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ["http://localhost:4200"],
        headers: ["Accept", "Content-Type"],
        additionalHeaders: ["X-Requested-With"]
      }
    }
  });

  routes(server);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(0);
});

wasteTrackingGateway();
