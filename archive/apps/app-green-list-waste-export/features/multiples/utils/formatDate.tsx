import { Transaction } from '../types';

export function formatDate(transaction: Transaction): string {
  let date:
    | Transaction['collectionDate']['actualDate']
    | Transaction['collectionDate']['estimateDate'];

  if (transaction.collectionDate.type === 'ActualDate') {
    date = transaction.collectionDate.actualDate;
  } else {
    date = transaction.collectionDate.estimateDate;
  }

  return `${date.day}/${date.month}/${date.year}`;
}
