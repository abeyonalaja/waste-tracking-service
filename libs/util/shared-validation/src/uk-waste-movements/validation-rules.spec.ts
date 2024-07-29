import { validateProducerReference } from './validation-rules';

describe('Producer reference validation', () => {
  it.each([
    '123456789012',
    'asd-123',
    '123/123',
    '123\\123',
    '132_123',
    '3454   123',
    'ABC_01/02/2025',
  ])('should return valid true when reference is valid (%s)', (ref) => {
    const result = validateProducerReference(ref);
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
