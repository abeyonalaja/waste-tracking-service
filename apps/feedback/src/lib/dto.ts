export type GenerateAccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: string;
  scope: string;
};

export type GenerateAccessTokenErrorResponse = {
  error: string;
  error_description: string;
};

export type GenerateSurveySessionResponse = {
  result: Result;
  meta: Meta;
};

type Result = {
  sessionId: string;
  questions: Question[];
  embeddedData: EmbeddedData;
  responses: Response[];
  done: boolean;
};

type Question = {
  questionID: string;
  type: string;
  display: string;
  options?: Option[];
  choices?: Choice[];
};

type Option = {
  columnLabels?: ColumnLabel[];
  multiSelect: boolean;
};

type ColumnLabel = {
  test: string;
};

export type Choice = {
  choiceId: string;
  selected?: boolean;
  text?: string;
};

type Meta = {
  requestId: string;
  httpStatus: string;
  error?: Error;
  notice?: string;
};

export type SurveySessionErrorResponse = {
  meta: Meta;
};

type Error = {
  errorMessage: string;
  errorCode: string;
};

export type SurveyResponse = {
  result: string;
  meta: Meta;
};

export type FeedbackResponse = {
  response: string;
};

export type EmbeddedData = {
  edKey: string;
  clientID: string;
};

export type SurveyErrorResponse = {
  meta: Meta;
};

export type SurveyData = {
  advance: boolean;
  responses: {
    QID5: QID5;
    QID6: string;
  };
};

export type QID5 = {
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
};
