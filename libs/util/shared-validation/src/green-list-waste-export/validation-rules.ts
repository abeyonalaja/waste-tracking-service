import { ValidationResult } from '../common';
import { UkExitLocation } from './model';
import * as constraints from './constraints';
import { ukExitLocationRegex } from './regex';

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

export function validateUkExitLocation(
  value: UkExitLocation,
): ValidationResult<UkExitLocation> {
  let trimmedUkExitLocation: UkExitLocation = { provided: 'No' };
  if (value.provided === 'Yes') {
    trimmedUkExitLocation = { provided: 'Yes', value: value.value.trim() };
    if (!trimmedUkExitLocation.value) {
      return {
        valid: false,
        errors: ['empty'],
      };
    }
    if (
      trimmedUkExitLocation.value.length > constraints.UkExitLocationChar.max
    ) {
      return {
        valid: false,
        errors: ['charTooMany'],
      };
    }

    if (!ukExitLocationRegex.test(trimmedUkExitLocation.value)) {
      return {
        valid: false,
        errors: ['invalid'],
      };
    }
  }

  return {
    valid: true,
    value: trimmedUkExitLocation,
  };
}
