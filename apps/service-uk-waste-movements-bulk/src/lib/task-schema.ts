import { SchemaObject } from 'ajv/dist/jtd';

export const contentProcessingTask: SchemaObject = {
  properties: {
    batchId: { type: 'string' },
    accountId: { type: 'string' },
    content: {
      properties: {
        type: { enum: ['text/csv'] },
        compression: { enum: ['Snappy', 'None'] },
        value: { type: 'string' },
      },
    },
  },
};

export const contentToBeProcessedTask: SchemaObject = {
  properties: {
    id: { type: 'string' },
    time: { type: 'string' },
    type: { type: 'string' },
    source: { type: 'string' },
    specversion: { type: 'string' },
    datacontenttype: { type: 'string' },
    pubsubname: { type: 'string' },
    queue: { type: 'string' },
    traceparent: { type: 'string' },
    tracestate: { type: 'string' },
    data: contentProcessingTask,
  },
};

export const contentSubmissionTask: SchemaObject = {
  properties: {
    batchId: { type: 'string' },
    accountId: { type: 'string' },
  },
};

export const contentToBeSubmittedTask: SchemaObject = {
  properties: {
    id: { type: 'string' },
    time: { type: 'string' },
    type: { type: 'string' },
    source: { type: 'string' },
    specversion: { type: 'string' },
    datacontenttype: { type: 'string' },
    pubsubname: { type: 'string' },
    queue: { type: 'string' },
    traceparent: { type: 'string' },
    tracestate: { type: 'string' },
    data: contentSubmissionTask,
  },
};
