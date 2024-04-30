import { Logger } from 'winston';
import { UserFilter } from '../../auth/user-filter';
import { Application } from 'express';
import {
  BadRequestError,
  CustomError,
  InternalServerError,
} from '../../lib/errors';
import { User } from '../../lib/user';

export interface Backend {
  addUser(dcidSubjectId: string, invitationToken: string): Promise<void>;
  userFilter: UserFilter;
}

export interface PluginOptions {
  backend: Backend;
  logger: Logger;
}

export class PrivateBetaMock implements Backend {
  addUser(): Promise<void> {
    return Promise.resolve();
  }

  userFilter: UserFilter = async () => true;
}

export default class PrivateBetaPlugin {
  constructor(
    private server: Application,
    private prefix: string,
    private backend: Backend
  ) {}

  async register(): Promise<void> {
    this.server.post(`${this.prefix}/users`, async (req, res) => {
      let invitationToken = req.query['invitationToken'];
      if (Array.isArray(invitationToken)) {
        invitationToken = invitationToken[0];
      }
      if (typeof invitationToken !== 'string' || !invitationToken) {
        return res
          .status(400)
          .json(
            new BadRequestError("Missing query parameter: 'invitationToken'")
          );
      }
      const user = req.user as User;
      try {
        await this.backend.addUser(
          user.credentials.subjectId as string,
          invitationToken
        );
        return res.status(201);
      } catch (err) {
        if (err instanceof CustomError) {
          return res.status(err.statusCode).json({ message: err.message });
        }
        console.log('Unknown error', { error: err });
        return res
          .status(500)
          .jsonp(new InternalServerError('An internal server error occurred'));
      }
    });
  }
}
