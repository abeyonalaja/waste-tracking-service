import { Response } from '@wts/util/invocation';
import { Method } from '@wts/api/common';

export interface SendFeedbackRequest {
  serviceName: ServiceName;
  surveyData: SurveyData;
}

export type ServiceName = 'glw' | 'ukwm';

export interface SurveyData {
  rating?: number;
  feedback?: string;
}

export interface FeedbackResponse {
  response: string;
}

export type SendFeedbackResponse = Response<FeedbackResponse>;

export const sendFeedback: Method = {
  name: 'sendFeedback',
  httpVerb: 'POST',
};
