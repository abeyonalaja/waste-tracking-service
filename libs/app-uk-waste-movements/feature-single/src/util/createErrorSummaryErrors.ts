import { FormErrors, ErrorSummaryErrors } from '../types/types';

export function createErrorSummaryErrors(
  formErrors: FormErrors,
): ErrorSummaryErrors {
  const errorSummaryErrors: ErrorSummaryErrors = [];
  for (const field in formErrors) {
    if (formErrors[field].valid === false) {
      errorSummaryErrors.push({
        text: formErrors[field].errors[0].message as string,
        href: `#${field}`,
      });
    }
  }

  return errorSummaryErrors;
}
