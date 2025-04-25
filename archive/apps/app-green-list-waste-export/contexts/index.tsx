import { useContext } from 'react';

import {
  SubmissionContext,
  ISubmissionContextProps,
} from './submissionContext';

export const useSubmissionContext = (): ISubmissionContextProps =>
  useContext(SubmissionContext);
