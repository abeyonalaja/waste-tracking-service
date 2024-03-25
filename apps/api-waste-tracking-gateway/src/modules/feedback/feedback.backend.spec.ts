import { FeedbackStub } from './feedback.backend';

describe(FeedbackStub, () => {
  let subject: FeedbackStub;

  beforeEach(() => {
    subject = new FeedbackStub();
  });

  it('returns a successful response', async () => {
    const feedback = await subject.sendFeedback();
    expect(feedback).toHaveProperty(
      'response',
      'Successfully submitted feedback.'
    );
  });
});
