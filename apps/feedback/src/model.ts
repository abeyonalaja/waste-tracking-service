import * as api from '@wts/api/feedback';

import * as dto from './lib/dto';

export type SendFeedbackRequest = api.SendFeedbackRequest;
export type SendFeedbackResponse = api.SendFeedbackResponse;
export type FeedbackResponse = api.FeedbackResponse;

export type GenerateAccessTokenErrorResponse =
  dto.GenerateAccessTokenErrorResponse;
export type GenerateAccessTokenResponse = dto.GenerateAccessTokenResponse;

export type GenerateSurveySessionResponse = dto.GenerateSurveySessionResponse;
export type GenerateSurveySessionErrorResponse =
  dto.GenerateAccessTokenErrorResponse;
export type SurveyData = dto.SurveyData;
export type SurveyResponse = dto.SurveyResponse;
export type SurveyErrorResponse = dto.SurveyErrorResponse;
export type EmbeddedData = dto.EmbeddedData;
export type Choice = dto.Choice;
