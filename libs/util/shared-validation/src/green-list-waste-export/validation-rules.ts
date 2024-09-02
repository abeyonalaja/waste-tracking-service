import { ValidationResult } from '../common';

export function validateCollectionDateType(
  value: string,
): ValidationResult<'EstimateDate' | 'ActualDate'> {
  let collectionDateType = '';
  const quantityType = value.replace(/\s/g, '').toLowerCase();
  if (quantityType === 'actual') {
    collectionDateType = 'ActualDate';
  } else if (quantityType === 'estimate') {
    collectionDateType = 'EstimateDate';
  } else {
    return {
      valid: false,
      errors: ['invalid'],
    };
  }

  return {
    valid: true,
    value: collectionDateType as 'EstimateDate' | 'ActualDate',
  };
}
