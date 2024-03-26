// Components
import { ErrorSummary } from './components/ErrorSummary';
import { EstimatesBanner } from './components/EstimatesBanner';
import { GuidanceInteruption } from './components/GuidanceInteruption';
import { Loader } from './components/Loader';
import { Instructions } from './components/Instructions';
import { PageLayout } from './components/PageLayout';
import { UploadBreadCrumbs } from './components/UploadBreadCrumbs';
import { UploadForm } from './components/UploadForm';
import { SubmissionConfirmation } from './components/SubmissionConfirmation';
import { SubmissionConfirmationBreadCrumbs } from './components/SubmissionConfirmationBreadCrumbs';
import { SubmissionDeclaration } from './components/SubmissionDeclaration';
import { ValidationSuccess } from './components/ValidationSuccess';

export {
  ErrorSummary,
  EstimatesBanner,
  Loader,
  GuidanceInteruption,
  Instructions,
  PageLayout,
  UploadBreadCrumbs,
  UploadForm,
  SubmissionConfirmation,
  SubmissionConfirmationBreadCrumbs,
  SubmissionDeclaration,
  ValidationSuccess,
};

// Types
import { ValidationErrorsType } from './types';
export type { ValidationErrorsType };

// Utils
import { getValidationResult } from './utils/getValidationResult';
export { getValidationResult };
