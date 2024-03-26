import { useContext } from 'react';

import { SubmissionContext } from './submissionContext';

export const useSubmissionContext = () => useContext(SubmissionContext);
