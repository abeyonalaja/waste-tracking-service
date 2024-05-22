export interface GenerateAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: string;
  scope: string;
}

export interface GenerateAccessTokenErrorResponse {
  error: string;
  error_description: string;
}

export interface GenerateSurveySessionResponse {
  result: Result;
  meta: Meta;
}

interface Result {
  sessionId: string;
  questions: Question[];
  embeddedData: EmbeddedData;
  responses: Response[];
  done: boolean;
}

interface Question {
  questionID: string;
  type: string;
  display: string;
  options?: Option[];
  choices?: Choice[];
}

interface Option {
  columnLabels?: ColumnLabel[];
  multiSelect: boolean;
}

interface ColumnLabel {
  test: string;
}

export interface Choice {
  choiceId: string;
  selected?: boolean;
  text?: string;
}

interface Meta {
  requestId: string;
  httpStatus: string;
  error?: Error;
  notice?: string;
}

export interface SurveySessionErrorResponse {
  meta: Meta;
}

interface Error {
  errorMessage: string;
  errorCode: string;
}

export interface SurveyResponse {
  result: string;
  meta: Meta;
}

export interface FeedbackResponse {
  response: string;
}

export interface EmbeddedData {
  edKey: string;
  clientID: string;
}

export interface SurveyErrorResponse {
  meta: Meta;
}

export interface SurveyData {
  advance: boolean;
  responses: {
    QID5?: QID5;
    QID6?: string;
  };
}

export interface QID5 {
  1: {
    selected: boolean;
  };
  2: {
    selected: boolean;
  };
  3: {
    selected: boolean;
  };
  4: {
    selected: boolean;
  };
  5: {
    selected: boolean;
  };
}
