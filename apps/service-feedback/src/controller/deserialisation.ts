import { SendFeedbackRequest, schema } from '@wts/api/feedback';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const sendFeedbackRequest = ajv.compileParser<SendFeedbackRequest>(
  schema.sendFeedbackRequest,
);
