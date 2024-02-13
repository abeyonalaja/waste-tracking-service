import Boom from '@hapi/boom';
import { SendFeedbackResponse } from '@wts/api/feedback';
import * as api from '@wts/api/waste-tracking-gateway';
import { DaprFeedbackClient } from '@wts/client/feedback';
import { Logger } from 'winston';

export interface FeedbackBackend {
  sendFeedback(
    feedback?: string,
    rating?: number
  ): Promise<api.SendFeedbackResponse>;
}

/**
 * This is a stub backend and should not be used in production.
 */
export class FeedbackStub implements FeedbackBackend {
  async sendFeedback(): Promise<api.SendFeedbackResponse> {
    return {
      response: `Successfully submitted feedback.`,
    } as api.SendFeedbackResponse;
  }
}

export class FeedbackServiceBackend implements FeedbackBackend {
  constructor(private client: DaprFeedbackClient, private logger: Logger) {}

  async sendFeedback(
    feedback?: string,
    rating?: number
  ): Promise<api.SendFeedbackResponse> {
    let response: SendFeedbackResponse;
    try {
      response = await this.client.sendFeedback({
        rating: rating,
        feedback: feedback,
      });
    } catch (error) {
      this.logger.error(error);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
    return response.value;
  }
}
