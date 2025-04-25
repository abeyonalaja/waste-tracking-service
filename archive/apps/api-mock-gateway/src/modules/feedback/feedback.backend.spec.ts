import { sendFeedback } from './feedback.backend';

describe('sendFeedback', () => {
  it('should return success response', async () => {
    const response = await sendFeedback();
    expect(response).toEqual({
      response: 'Successfully submitted feedback.',
    });
  });
});
