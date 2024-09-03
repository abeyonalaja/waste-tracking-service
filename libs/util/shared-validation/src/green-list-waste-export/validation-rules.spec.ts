import { validateCollectionDateType } from './validation-rules';
import { validateUkExitLocation } from './validation-rules';
import { faker } from '@faker-js/faker';
import { UkExitLocationChar } from './constraints';
import { UkExitLocation } from './model';

describe(validateCollectionDateType, () => {
  it.each(['actual', 'estimate'])(
    'should return valid for valid types (%s)',
    () => {
      const result = validateCollectionDateType('actual');
      expect(result.valid).toBe(true);

      if (result.valid) {
        expect(result.value).toBe('ActualDate');
      }
    },
  );

  it.each(['', '      ', undefined, 'abc'])(
    'should return invalid for invalid vlues (%s)',
    () => {
      const result = validateCollectionDateType('actual');
      expect(result.valid).toBe(true);

      if (result.valid) {
        expect(result.value).toBe('ActualDate');
      }
    },
  );
});

describe('validateUkExitLocation', () => {
  it.each([
    { provided: 'Yes', value: 'London' } as UkExitLocation,
    { provided: 'Yes', value: 'Sofia' } as UkExitLocation,
    { provided: 'Yes', value: '02Sofia' } as UkExitLocation,
  ])(
    'should return trimmed value if supplied in correct format (%s)',
    (value) => {
      const result = validateUkExitLocation(value);
      expect(result.valid).toEqual(true);
      if (
        'value' in result &&
        result.value.provided === 'Yes' &&
        value.provided === 'Yes'
      ) {
        expect(result.value.value).toEqual(value.value.trim());
      }
    },
  );

  it.each([{ provided: 'No' } as UkExitLocation])(
    'should return valid true if UkExitLocation value is with provided No',
    (value) => {
      const result = validateUkExitLocation(value);
      expect(result.valid).toEqual(true);
    },
  );

  it.each([
    { provided: 'Yes', value: '' } as UkExitLocation,
    { provided: 'Yes', value: '  ' } as UkExitLocation,
  ])('should return empty error if empty value is supplied (%s)', (value) => {
    const result = validateUkExitLocation(value);

    expect(result.valid).toEqual(false);
    if ('errors' in result) {
      expect(result.errors.length).toEqual(1);
      expect(result.errors).toContain('empty');
    }
  });

  it('should return charTooMany error if supplied value length is greater than max allowed', () => {
    const result = validateUkExitLocation({
      provided: 'Yes',
      value: faker.string.sample(Number(UkExitLocationChar.max + 1)),
    });

    expect(result.valid).toEqual(false);
    if ('errors' in result) {
      expect(result.errors.length).toEqual(1);
      expect(result.errors).toContain('charTooMany');
    }
  });

  it.each([
    { provided: 'Yes', value: 'London>!@>!<@' } as UkExitLocation,
    { provided: 'Yes', value: 'Sofia>!@.,!<@' } as UkExitLocation,
    { provided: 'Yes', value: '02Sofia>!@>!{]s@' } as UkExitLocation,
  ])(
    'should return invalid error if supplied value is in incorrect format (%s)',
    (value) => {
      const result = validateUkExitLocation(value);

      expect(result.valid).toEqual(false);
      if ('errors' in result) {
        expect(result.errors.length).toEqual(1);
        expect(result.errors).toContain('invalid');
      }
    },
  );
});
