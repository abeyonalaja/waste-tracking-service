import { validateCollectionDateType } from './validation-rules';

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
