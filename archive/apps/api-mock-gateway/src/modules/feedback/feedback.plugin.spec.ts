import { BadRequestError } from '../../lib/errors';
import FeedbackPlugin from './feedback.plugin';
import * as jsonServer from 'json-server';

const server = jsonServer.create();

describe('FeedbackPlugin', () => {
  let plugin: FeedbackPlugin;

  beforeEach(async () => {
    plugin = new FeedbackPlugin(server, '/api/feedback');
  });

  describe('register', () => {
    it('should respond with 400 Bad Request when validation fails', async () => {
      const mockPost = jest.fn();
      const mockJsonp = jest.fn();
      const mockStatus = jest.fn().mockReturnValue({ jsonp: mockJsonp });

      plugin['server'].post = mockPost;

      await plugin.register();

      const handler = mockPost.mock.calls[0][1];
      await handler({ body: {} }, { status: mockStatus });

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJsonp).toHaveBeenCalledWith(
        new BadRequestError('Bad Request'),
      );
    });
  });
});
