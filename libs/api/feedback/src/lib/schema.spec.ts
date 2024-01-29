import Ajv from 'ajv/dist/jtd';
import { SendFeedbackRequest, SendFeedbackResponse } from './feedback';
import { sendFeedbackRequest, sendFeedbackResponse } from './schema';

const ajv = new Ajv();

describe('sendFeedback', () => {
  const validateResponse =
    ajv.compile<SendFeedbackResponse>(sendFeedbackResponse);

  it('validates error response', () => {
    const feedbackerr: SendFeedbackResponse = {
      success: false,
      error: {
        statusCode: 400,
        name: 'Bad Request',
        message: 'Bad request',
      },
    };
    expect(validateResponse(feedbackerr)).toBe(true);
  });

  it('validates success response', () => {
    const r: SendFeedbackResponse = {
      success: true,
      value: {
        response: 'Successfully submitted feedback.',
      },
    };
    expect(validateResponse(r)).toBe(true);
  });

  const validateRequest = ajv.compile<SendFeedbackRequest>(sendFeedbackRequest);

  it('payload is validated successfully', () => {
    const value: SendFeedbackRequest = {
      rating: 2,
      feedback: 'Wow! I love this waste tracking service!',
    };
    expect(validateRequest(value)).toBe(true);
  });
});
