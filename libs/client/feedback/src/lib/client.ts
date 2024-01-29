import { DaprClient, HttpMethod } from '@dapr/dapr';
import {
  SendFeedbackRequest,
  SendFeedbackResponse,
  sendFeedback,
} from '@wts/api/feedback';

export class DaprFeedbackClient {
  constructor(private daprClient: DaprClient, private feedbackAppId: string) {}

  async sendFeedback(req: SendFeedbackRequest): Promise<SendFeedbackResponse> {
    return (await this.daprClient.invoker.invoke(
      this.feedbackAppId,
      sendFeedback.name,
      HttpMethod.POST,
      req
    )) as SendFeedbackResponse;
  }
}
