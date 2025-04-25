import { SendFeedbackResponse } from '@wts/api/waste-tracking-gateway';

export async function sendFeedback(): Promise<SendFeedbackResponse> {
  return {
    response: `Successfully submitted feedback.`,
  } as SendFeedbackResponse;
}
