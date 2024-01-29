import Boom from '@hapi/boom';
import { fromBoom, success } from '@wts/util/invocation';
import { Logger } from 'winston';
import { FeedbackClient } from '../clients';

import { SendFeedbackRequest, SendFeedbackResponse } from '../model';

export type Handler<Request, Response> = (
  request: Request
) => Promise<Response>;

export default class FeedbackController {
  constructor(private feedbackClient: FeedbackClient, private logger: Logger) {}

  sendFeedback: Handler<SendFeedbackRequest, SendFeedbackResponse> = async ({
    rating,
    feedback,
  }) => {
    try {
      const feedbackResults = await this.feedbackClient.sendFeedback({
        rating,
        feedback,
      });

      if (feedbackResults.success) {
        return success(feedbackResults.value);
      }

      return feedbackResults;
    } catch (err) {
      this.logger.error('Unknown error', { error: err });
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }
      return fromBoom(Boom.internal());
    }
  };
}
