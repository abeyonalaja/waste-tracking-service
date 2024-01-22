import Boom from '@hapi/boom';
import * as api from '@wts/api/limited-audience';
import { fromBoom, success } from '@wts/util/invocation';
import { Logger } from 'winston';
import { AssignmentRepository } from './data';
import { TokenValidator } from './tokens';
import { Assignment } from './model';

type Handler<Request, Response> = (request: Request) => Promise<Response>;

function isValidContent(value: string): value is Assignment['content'] {
  return value === 'GLW' || value === 'UKWM';
}

export default class AssignmentController {
  constructor(
    private repository: AssignmentRepository,
    private tokenValidator: TokenValidator,
    private logger: Logger
  ) {}

  checkParticipation: Handler<
    api.CheckParticipationRequest,
    api.CheckParticipationResponse
  > = async ({ content, dcidSubjectId }) => {
    try {
      const value = await this.repository.getAssignment(content, dcidSubjectId);

      if (value === undefined) {
        return success({ participant: false });
      }

      return success({ participant: true, participantId: value.participantId });
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  redeemInvitation: Handler<
    api.RedeemInvitationRequest,
    api.RedeemInvitationResponse
  > = async ({ dcidSubjectId, invitationToken }) => {
    try {
      const tokenValidation = await this.tokenValidator.validate(
        invitationToken
      );
      if (!tokenValidation.valid) {
        return fromBoom(Boom.badRequest(tokenValidation.error));
      }

      const {
        payload: { content, participantId },
      } = tokenValidation;
      if (!isValidContent(content)) {
        return fromBoom(
          Boom.badRequest(`assignment to unexpected content: ${content}`)
        );
      }

      this.repository.setAssignment({ participantId, dcidSubjectId, content });
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
