import Ajv from 'ajv/dist/jtd';
import {
  ContentProcessingTask,
  ContentSubmissionTask,
  ContentToBeProcessedTask,
  ContentToBeSubmittedTask,
} from '../model';
import * as schema from './task-schema';

const ajv = new Ajv();

export const receiveContentProcessingTask = ajv.compile<ContentProcessingTask>(
  schema.contentProcessingTask
);

export const receiveContentToBeProcessedTask =
  ajv.compile<ContentToBeProcessedTask>(schema.contentToBeProcessedTask);

export const receiveContentSubmissionTask = ajv.compile<ContentSubmissionTask>(
  schema.contentSubmissionTask
);

export const receiveContentToBeSubmittedTask =
  ajv.compile<ContentToBeSubmittedTask>(schema.contentToBeSubmittedTask);
