interface ColumnBasedErrorSummary {
  columnRef: string;
  count: number;
}

export function calculateTotalErrors(
  columnErrors: ColumnBasedErrorSummary[],
): number {
  return columnErrors.reduce(
    (total: number, current) => total + current.count,
    0,
  );
}
