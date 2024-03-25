import { CreateTemplateRequest } from '@wts/api/waste-tracking-gateway';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const validateCreateTemplateRequest = ajv.compile<CreateTemplateRequest>(
  {
    properties: {
      templateDetails: {
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
        },
      },
    },
  }
);
