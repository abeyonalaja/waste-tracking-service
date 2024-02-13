import { SendFeedbackRequest } from '@wts/api/feedback';

import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const validateSendFeedback = ajv.compile<SendFeedbackRequest>({
  optionalProperties: {
    rating: {
      type: 'uint8',
    },
    feedback: {
      type: 'string',
    },
  },
});
