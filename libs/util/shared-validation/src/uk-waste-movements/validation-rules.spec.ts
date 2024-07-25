import { validateProducerReference } from './validation-rules';

describe('Producer reference validation', () => {
  it('should return valid true when reference is valid', () => {
    const result = validateProducerReference('123456789012');
    expect(result.valid).toBe(true);
  });

  it('should return valid false when reference is empty', () => {
    const result = validateProducerReference('');
    expect(result.valid).toBe(false);
  });

  it('should return the error message in English when the reference is empty', () => {
    const result = validateProducerReference('', {
      locale: 'en',
      context: 'ui',
    });

    if ('message' in result) {
      expect(result.message).toBe('Enter a unique reference');
    }
  });
});
