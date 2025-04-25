import { Transaction } from '../types';

export function sortTransactions(
  transactions: Transaction[],
  order: 'asc' | 'desc',
): Transaction[] {
  const sortedTransactions = transactions.sort(
    (a: Transaction, b: Transaction) => {
      let dateA: Date;
      let dateB: Date;

      if (a.collectionDate.type === 'ActualDate') {
        dateA = new Date(
          Number(a.collectionDate.actualDate.year),
          Number(a.collectionDate.actualDate.month) - 1,
          Number(a.collectionDate.actualDate.day),
        );
      } else {
        dateA = new Date(
          Number(a.collectionDate.estimateDate.year),
          Number(a.collectionDate.estimateDate.month) - 1,
          Number(a.collectionDate.estimateDate.day),
        );
      }

      if (b.collectionDate.type === 'ActualDate') {
        dateB = new Date(
          Number(b.collectionDate.actualDate.year),
          Number(b.collectionDate.actualDate.month) - 1,
          Number(b.collectionDate.actualDate.day),
        );
      } else {
        dateB = new Date(
          Number(b.collectionDate.estimateDate.year),
          Number(b.collectionDate.estimateDate.month) - 1,
          Number(b.collectionDate.estimateDate.day),
        );
      }

      return order === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    },
  );

  return sortedTransactions;
}
