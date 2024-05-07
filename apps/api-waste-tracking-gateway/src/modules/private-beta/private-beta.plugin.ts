import Boom from '@hapi/boom';
import { Plugin } from '@hapi/hapi';
import { RedeemInvitationResponse } from '@wts/api/limited-audience';
import { DaprLimitedAudienceClient } from '@wts/client/limited-audience';
import { LRUCache } from 'lru-cache';
import { Logger } from 'winston';
import { UserFilter } from '../../lib/auth/user-filter';

export interface Backend {
  addUser(dcidSubjectId: string, invitationToken: string): Promise<void>;
  userFilter: UserFilter;
}

export interface PluginOptions {
  backend: Backend;
  logger: Logger;
}

export class PrivateAudienceServiceBackend implements Backend {
  constructor(
    private client: DaprLimitedAudienceClient,
    private cache: LRUCache<string, boolean>,
    private logger: Logger
  ) {}

  async addUser(dcidSubjectId: string, invitationToken: string): Promise<void> {
    let response: RedeemInvitationResponse;
    try {
      response = await this.client.redeemInvitation({
        dcidSubjectId,
        invitationToken,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      if (response.error.statusCode === 400) {
        throw Boom.badRequest();
      }

      this.logger.error(
        'Unhandled status code from limited-audience service',
        response.error
      );
      throw Boom.internal();
    }
  }

  userFilter: UserFilter = async ({ dcidSubjectId }) => {
    const cached = this.cache.get(dcidSubjectId);
    if (cached !== undefined && cached) {
      return true;
    }

    const response = await this.client.checkParticipation({
      dcidSubjectId,
      content: 'GLW',
    });
    if (!response.success) {
      throw Boom.internal();
    }

    this.cache.set(dcidSubjectId, response.value.participant);
    return response.value.participant;
  };
}

const plugin: Plugin<PluginOptions> = {
  name: 'private-beta',
  version: '1.0.0',
  register: async function (server, { backend, logger }) {
    server.route({
      method: 'POST',
      path: '/users',
      options: {
        auth: 'authenticated',
      },
      handler: async function ({ auth, query }, h) {
        const invitationToken = query['invitationToken'];
        if (!invitationToken) {
          return Boom.badRequest("Missing query parameter: 'invitationToken'");
        }

        try {
          await backend.addUser(
            auth.credentials.subjectId as string,
            invitationToken
          );

          return h.response().code(201);
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
