import { FeedbackServiceBackend } from './feedback.backend';
import { DaprFeedbackClient } from '@wts/client/feedback';
import { Logger } from 'winston';
import { expect, jest } from '@jest/globals';

import { SendFeedbackResponse } from '@wts/api/feedback';
jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockClientFeedback = {
  sendFeedback: jest.fn<DaprFeedbackClient['sendFeedback']>(),
};

describe('FeedbackServiceBackend', () => {
  const subject = new FeedbackServiceBackend(
    mockClientFeedback as unknown as DaprFeedbackClient,
    new Logger(),
  );

  beforeEach(() => {
    mockClientFeedback.sendFeedback.mockClear();
  });

  it('should return feedback response when response is successful', async () => {
    const mockResponse: SendFeedbackResponse = {
      success: true,
      value: {
        response: 'Feedback received',
      },
    };

    mockClientFeedback.sendFeedback.mockResolvedValue(mockResponse);

    const serviceName = 'Great service';
    const feedback = 'Great service';
    const rating = 5;
    const result = await subject.sendFeedback(serviceName, feedback, rating);

    expect(result).toEqual(mockResponse.value);
    expect(mockClientFeedback.sendFeedback).toHaveBeenCalledWith({
      serviceName,
      surveyData: {
        feedback,
        rating,
      },
    });
  });

  it('should throw an error when response is not successful', async () => {
    const mockResponse: SendFeedbackResponse = {
      success: false,
      error: {
        message: 'Error message',
        statusCode: 500,
        name: '',
      },
    };

    mockClientFeedback.sendFeedback.mockResolvedValue(mockResponse);

    const serviceName = 'Great service';
    const feedback = 'Great service';
    const rating = 5;
    await expect(
      subject.sendFeedback(serviceName, feedback, rating),
    ).rejects.toThrow();
    expect(mockClientFeedback.sendFeedback).toHaveBeenCalledWith({
      serviceName,
      surveyData: {
        feedback,
        rating,
      },
    });
  });
});
