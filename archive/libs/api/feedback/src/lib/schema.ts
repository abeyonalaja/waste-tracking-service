import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import { FeedbackResponse, SendFeedbackRequest } from './feedback';

const errorResponseValue: SchemaObject = {
  properties: {
    statusCode: { type: 'uint16' },
    name: { type: 'string' },
    message: { type: 'string' },
  },
};

export const sendFeedbackRequest: JTDSchemaType<SendFeedbackRequest> = {
  properties: {
    serviceName: { enum: ['glw', 'ukwm'] },
    surveyData: {
      optionalProperties: {
        rating: { type: 'uint16' },
        feedback: { type: 'string' },
      },
    },
  },
};

const feedbackResponse: JTDSchemaType<FeedbackResponse> = {
  properties: {
    response: { type: 'string' },
  },
};

export const sendFeedbackResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: feedbackResponse,
  },
};
