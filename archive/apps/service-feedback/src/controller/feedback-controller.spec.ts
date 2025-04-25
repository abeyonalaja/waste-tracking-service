import { expect, jest } from '@jest/globals';
import { Logger } from 'winston';
import { SendFeedbackResponse, FeedbackResponse } from '../model';
import FeedbackController from './feedback-controller';
import Boom from '@hapi/boom';
import { SendFeedbackRequest } from '@wts/api/feedback';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockFeedbackClient = {
  sendFeedback:
    jest.fn<
      (
        sendFeedbackRequest: SendFeedbackRequest,
      ) => Promise<SendFeedbackResponse>
    >(),
};

describe(FeedbackController, () => {
  const subject = new FeedbackController(mockFeedbackClient, new Logger());

  beforeEach(() => {
    mockFeedbackClient.sendFeedback.mockClear();
  });

  describe('sendFeedback', () => {
    it('successfully throws Boom errors', async () => {
      const feedback: SendFeedbackRequest = {
        serviceName: 'glw',
        surveyData: {
          rating: 1,
          feedback: 'test',
        },
      };

      mockFeedbackClient.sendFeedback.mockRejectedValue(Boom.badRequest());

      let response = await subject.sendFeedback(feedback);

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockFeedbackClient.sendFeedback).toBeCalledWith(feedback);
      expect(response.error.statusCode).toBe(400);

      feedback.surveyData.rating = 6;

      response = await subject.sendFeedback(feedback);

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }
    });

    it('successfully sends data', async () => {
      const feedback: SendFeedbackRequest = {
        serviceName: 'glw',
        surveyData: {
          rating: 1,
          feedback: 'test',
        },
      };

      const feedbackResponse: FeedbackResponse = {
        response: 'Feedback successfully submitted',
      };
      const sendFeedbackResponse: SendFeedbackResponse = {
        success: true,
        value: feedbackResponse,
      };

      mockFeedbackClient.sendFeedback.mockResolvedValue(sendFeedbackResponse);

      const response = await subject.sendFeedback(feedback);
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }
    });
  });
});
