import { Response } from '@wts/util/invocation';
import { Method } from '@wts/api/common';

export type SendFeedbackRequest = {
  rating?: number;
  feedback?: string;
};

export type FeedbackResponse = {
  response: string;
};

export type SendFeedbackResponse = Response<FeedbackResponse>;

export const sendFeedback: Method = {
  name: 'sendFeedback',
  httpVerb: 'POST',
};
