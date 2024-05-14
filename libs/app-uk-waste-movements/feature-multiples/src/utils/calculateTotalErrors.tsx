import { UkwmBulkSubmissionValidationColumnError } from '@wts/api/waste-tracking-gateway';

export function calculateTotalErrors(
  columnErrors: UkwmBulkSubmissionValidationColumnError[]
): number {
  const totalColumnErrors = columnErrors.reduce(
    (total: number, current: UkwmBulkSubmissionValidationColumnError) =>
      total + current.errorAmount,
    0
  );

  return totalColumnErrors;
}
