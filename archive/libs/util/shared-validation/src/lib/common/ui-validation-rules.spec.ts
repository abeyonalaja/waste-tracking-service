import { faker } from '@faker-js/faker';
import { validateAddressSelection } from './ui-validation-rules';

describe('validateAddressSelection', () => {
  it('should return value if supplied', () => {
    const value = faker.string.sample();
    const result = validateAddressSelection(value);

    expect(result.valid).toEqual(true);
    if ('value' in result) {
      expect(result.value).toEqual(value);
    }
  });

  it.each(['', undefined])(
    'should return empty error if no value is supplied (%s)',
    (value) => {
      const result = validateAddressSelection(value);

      expect(result.valid).toEqual(false);
      if ('errors' in result) {
        expect(result.errors).toContain('empty');
      }
    },
  );
});
