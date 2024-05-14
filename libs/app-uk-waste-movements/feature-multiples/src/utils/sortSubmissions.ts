import { UkwmSubmissionReference } from '@wts/api/waste-tracking-gateway';

export function sortSubmissions(
  transactions: UkwmSubmissionReference[],
  order: 'ascending' | 'descending'
): UkwmSubmissionReference[] {
  const sortedSubmissions = transactions.sort(
    (a: UkwmSubmissionReference, b: UkwmSubmissionReference) => {
      const dateA = new Date(
        Number(a.collectionDate.year),
        Number(a.collectionDate.month) - 1,
        Number(a.collectionDate.day)
      );

      const dateB = new Date(
        Number(b.collectionDate.year),
        Number(b.collectionDate.month) - 1,
        Number(b.collectionDate.day)
      );

      return order === 'ascending'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }
  );

  return sortedSubmissions;
}
