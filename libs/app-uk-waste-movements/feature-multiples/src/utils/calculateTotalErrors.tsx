import {
  UkwmBulkSubmissionValidationRowError,
  UkwmBulkSubmissionValidationColumnError,
} from '@wts/api/waste-tracking-gateway';

export function calculateTotalErrors(
  rowErrors: UkwmBulkSubmissionValidationRowError[],
  columnErrors: UkwmBulkSubmissionValidationColumnError[]
): number {
  const totalRowErrors = rowErrors.reduce(
    (total: number, current: UkwmBulkSubmissionValidationRowError) =>
      total + current.errorAmount,
    0
  );

  const totalColumnErrors = columnErrors.reduce(
    (total: number, current: UkwmBulkSubmissionValidationColumnError) =>
      total + current.errorAmount,
    0
  );

  return totalRowErrors + totalColumnErrors;
}
