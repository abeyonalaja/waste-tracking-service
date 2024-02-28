import Ajv from 'ajv/dist/jtd';
import { ContentProcessingTask, ContentToBeProcessedTask } from '../model';
import * as schema from './task-schema';

const ajv = new Ajv();

export const receiveContentProcessingTask = ajv.compile<ContentProcessingTask>(
  schema.contentProcessingTask
);

export const receiveContentToBeProcessedTask =
  ajv.compile<ContentToBeProcessedTask>(schema.contentToBeProcessedTask);
