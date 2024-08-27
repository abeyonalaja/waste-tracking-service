import { faker } from '@faker-js/faker';
import {
  titleCase,
  validateAddressLine1,
  validateAddressLine2,
  validateBuildingNameOrNumber,
  validateCountry,
  validateEmailAddress,
  validateFaxNumber,
  validateFullName,
  validateOrganisationName,
  validatePhoneNumber,
  validatePostcode,
  validateReference,
  validateTownCity,
} from './validation-rules';
import { ReferenceChar, FreeTextChar } from './constraints';

describe('validateReference', () => {
  it.each([
    '123456789012',
    'asd-123',
    'asd_123',
    '123/123',
    '123\\123',
    '132_123',
    '3454   123',
    'ABC_01/02/2025',
    '  test123',
    'test345  ',
    '  test  ',
  ])(
    'should return trimmed value if supplied in correct format (%s)',
    (value) => {
      const result = validateReference(value);

      expect(result.valid).toEqual(true);
      if ('value' in result) {
        expect(result.value).toEqual(value.trim());
      }
    },
  );

  it.each(['', undefined, '  '])(
    'should return empty error if no value is supplied (%s)',
    (value) => {
      const result = validateReference(value);

      expect(result.valid).toEqual(false);
      if ('errors' in result) {
        expect(result.errors.length).toEqual(1);
        expect(result.errors).toContain('empty');
      }
    },
  );

  it('should return charTooMany error if supplied value length is greater than max allowed', () => {
    const result = validateReference(
      faker.string.sample(Number(ReferenceChar.max + 1)),
    );

    expect(result.valid).toEqual(false);
    if ('errors' in result) {
      expect(result.errors.length).toEqual(1);
      expect(result.errors).toContain('charTooMany');
    }
  });

  it.each([
    '!',
    '"',
    '£',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    '+',
    '=',
    '`',
    '¬',
    '[',
    ']',
    '{',
    '}',
    ';',
    ':',
    "'",
    '@',
    '#',
    '~',
    ',',
    '<',
    '.',
    '>',
    '?',
    '|',
  ])(
    'should return invalid error if supplied value is in incorrect format (%s)',
    (value) => {
      const result = validateReference(value);

      expect(result.valid).toEqual(false);
      if ('errors' in result) {
        expect(result.errors.length).toEqual(1);
        expect(result.errors).toContain('invalid');
      }
    },
  );
});

describe('validateBuildingNameOrNumber', () => {
  it.each(['  test123', 'test345  ', '  test  '])(
    'should return trimmed value if supplied in correct format (%s)',
    (value) => {
      const result = validateBuildingNameOrNumber(value);

      expect(result.valid).toEqual(true);
      if ('value' in result) {
        expect(result.value).toEqual(value.trim());
      }
    },
  );

  it.each(['', undefined, '  '])(
    'should return undefined if no value is supplied (%s)',
    (value) => {
      const result = validateBuildingNameOrNumber(value);

      expect(result.valid).toEqual(true);
      if ('value' in result) {
        expect(result.value).toBeUndefined();
      }
    },
  );

  it('should return charTooMany error if supplied value length is greater than max allowed', () => {
    const result = validateBuildingNameOrNumber(
      faker.string.sample(Number(FreeTextChar.max + 1)),
    );

    expect(result.valid).toEqual(false);
    if ('errors' in result) {
      expect(result.errors.length).toEqual(1);
      expect(result.errors).toContain('charTooMany');
    }
  });
});

describe('validateAddressLine1', () => {
  it.each(['  test123', 'test345  ', '  test  '])(
    'should return trimmed value if supplied in correct format (%s)',
    (value) => {
      const result = validateAddressLine1(value);

      expect(result.valid).toEqual(true);
      if ('value' in result) {
        expect(result.value).toEqual(value.trim());
      }
    },
  );

  it.each(['', undefined, '  '])(
    'should return empty error if no value is supplied (%s)',
    (value) => {
      const result = validateAddressLine1(value);

      expect(result.valid).toEqual(false);
      if ('errors' in result) {
        expect(result.errors.length).toEqual(1);
        expect(result.errors).toContain('empty');
      }
    },
  );

  it('should return charTooMany error if supplied value length is greater than max allowed', () => {
    const result = validateAddressLine1(
      faker.string.sample(Number(FreeTextChar.max + 1)),
    );

    expect(result.valid).toEqual(false);
    if ('errors' in result) {
      expect(result.errors.length).toEqual(1);
      expect(result.errors).toContain('charTooMany');
    }
  });
});

describe('validateAddressLine2', () => {
  it.each(['  test123', 'test345  ', '  test  '])(
    'should return trimmed value if supplied in correct format (%s)',
    (value) => {
      const result = validateAddressLine2(value);

      expect(result.valid).toEqual(true);
      if ('value' in result) {
        expect(result.value).toEqual(value.trim());
      }
    },
  );

  it.each(['', undefined, '  '])(
    'should return undefined if no value is supplied (%s)',
    (value) => {
      const result = validateAddressLine2(value);

      expect(result.valid).toEqual(true);
      if ('value' in result) {
        expect(result.value).toBeUndefined();
      }
    },
  );

  it('should return charTooMany error if supplied value length is greater than max allowed', () => {
    const result = validateAddressLine2(
      faker.string.sample(Number(FreeTextChar.max + 1)),
    );

    expect(result.valid).toEqual(false);
    if ('errors' in result) {
      expect(result.errors.length).toEqual(1);
      expect(result.errors).toContain('charTooMany');
    }
  });
});

describe('validatePostcode', () => {
  it.each(['AB12 1CD', '  AB1 2CD', 'ab12cd  ', '  ab12CD  '])(
    'should return trimmed value if supplied in correct format (%s)',
    (value) => {
      const result = validatePostcode(value);

      expect(result.valid).toEqual(true);
      if ('value' in result) {
        expect(result.value).toEqual(value.trim());
      }
    },
  );

  it.each(['', undefined, '  '])(
    'should return undefined if no value is supplied (%s)',
    (value) => {
      const result = validatePostcode(value);

      expect(result.valid).toEqual(true);
      if ('value' in result) {
        expect(result.value).toBeUndefined();
      }
    },
  );

  it.each(['AB12 12CD', 'AB12 CD1', 'AB12', '133141', '#afapjf'])(
    'should return invalid error if supplied value is in incorrect format (%s)',
    (value) => {
      const result = validatePostcode(value);

      expect(result.valid).toEqual(false);
      if ('errors' in result) {
        expect(result.errors.length).toEqual(1);
        expect(result.errors).toContain('invalid');
      }
    },
  );
});

describe('validateTownCity', () => {
  it.each(['  test123', 'test345  ', '  test  '])(
    'should return trimmed value if supplied in correct format (%s)',
    (value) => {
      const result = validateTownCity(value);

      expect(result.valid).toEqual(true);
      if ('value' in result) {
        expect(result.value).toEqual(value.trim());
      }
    },
  );

  it.each(['', undefined, '  '])(
    'should return empty error if no value is supplied (%s)',
    (value) => {
      const result = validateTownCity(value);

      expect(result.valid).toEqual(false);
      if ('errors' in result) {
        expect(result.errors.length).toEqual(1);
        expect(result.errors).toContain('empty');
      }
    },
  );

  it('should return charTooMany error if supplied value length is greater than max allowed', () => {
    const result = validateTownCity(
      faker.string.sample(Number(FreeTextChar.max + 1)),
    );

    expect(result.valid).toEqual(false);
    if ('errors' in result) {
      expect(result.errors.length).toEqual(1);
      expect(result.errors).toContain('charTooMany');
    }
  });
});

describe('validateCountry', () => {
  it.each(['  england', '  Scotland  ', 'Wales  ', 'northern Ireland'])(
    'should return trimmed and reformatted value if supplied in correct format (%s)',
    (value) => {
      const result = validateCountry(value);

      expect(result.valid).toEqual(true);
      if ('value' in result) {
        expect(result.value).toEqual(titleCase(value.trim()));
      }
    },
  );

  it.each(['', undefined, '  '])(
    'should return empty error if no value is supplied (%s)',
    (value) => {
      const result = validateCountry(value);

      expect(result.valid).toEqual(false);
      if ('errors' in result) {
        expect(result.errors.length).toEqual(1);
        expect(result.errors).toContain('empty');
      }
    },
  );

  it.each(['UK', 'Canada', '133141', '#afapjf'])(
    'should return invalid error if supplied value is in incorrect format (%s)',
    (value) => {
      const result = validateCountry(value);

      expect(result.valid).toEqual(false);
      if ('errors' in result) {
        expect(result.errors.length).toEqual(1);
        expect(result.errors).toContain('invalid');
      }
    },
  );
});

describe('validateOrganisationName', () => {
  it.each(['  test123', 'test345  ', '  test  '])(
    'should return trimmed value if supplied in correct format (%s)',
    (value) => {
      const result = validateOrganisationName(value);

      expect(result.valid).toEqual(true);
      if ('value' in result) {
        expect(result.value).toEqual(value.trim());
      }
    },
  );

  it.each(['', undefined, '  '])(
    'should return empty error if no value is supplied (%s)',
    (value) => {
      const result = validateOrganisationName(value);

      expect(result.valid).toEqual(false);
      if ('errors' in result) {
        expect(result.errors.length).toEqual(1);
        expect(result.errors).toContain('empty');
      }
    },
  );

  it('should return charTooMany error if supplied value length is greater than max allowed', () => {
    const result = validateOrganisationName(
      faker.string.sample(Number(FreeTextChar.max + 1)),
    );

    expect(result.valid).toEqual(false);
    if ('errors' in result) {
      expect(result.errors.length).toEqual(1);
      expect(result.errors).toContain('charTooMany');
    }
  });
});

describe('validateFullName', () => {
  it.each(['  test123', 'test345  ', '  test  '])(
    'should return trimmed value if supplied in correct format (%s)',
    (value) => {
      const result = validateFullName(value);

      expect(result.valid).toEqual(true);
      if ('value' in result) {
        expect(result.value).toEqual(value.trim());
      }
    },
  );

  it.each(['', undefined, '  '])(
    'should return empty error if no value is supplied (%s)',
    (value) => {
      const result = validateFullName(value);

      expect(result.valid).toEqual(false);
      if ('errors' in result) {
        expect(result.errors.length).toEqual(1);
        expect(result.errors).toContain('empty');
      }
    },
  );

  it('should return charTooMany error if supplied value length is greater than max allowed', () => {
    const result = validateFullName(
      faker.string.sample(Number(FreeTextChar.max + 1)),
    );

    expect(result.valid).toEqual(false);
    if ('errors' in result) {
      expect(result.errors.length).toEqual(1);
      expect(result.errors).toContain('charTooMany');
    }
  });
});

describe('validateEmailAddress', () => {
  it.each(['  test@test.com', 'test@test.it  ', '  test@example.com  '])(
    'should return trimmed value if supplied in correct format (%s)',
    (value) => {
      const result = validateEmailAddress(value);

      expect(result.valid).toEqual(true);
      if ('value' in result) {
        expect(result.value).toEqual(value.trim());
      }
    },
  );

  it.each(['', undefined, '  '])(
    'should return empty error if no value is supplied (%s)',
    (value) => {
      const result = validateEmailAddress(value);

      expect(result.valid).toEqual(false);
      if ('errors' in result) {
        expect(result.errors.length).toEqual(1);
        expect(result.errors).toContain('empty');
      }
    },
  );

  it('should return charTooMany error if supplied value length is greater than max allowed', () => {
    const result = validateEmailAddress(
      faker.string.sample(Number(FreeTextChar.max + 1)),
    );

    expect(result.valid).toEqual(false);
    if ('errors' in result) {
      expect(result.errors.length).toEqual(1);
      expect(result.errors).toContain('charTooMany');
    }
  });

  it.each(['test@test.i', 'test', '133141', '#afapjf'])(
    'should return invalid error if supplied value is in incorrect format (%s)',
    (value) => {
      const result = validateEmailAddress(value);

      expect(result.valid).toEqual(false);
      if ('errors' in result) {
        expect(result.errors.length).toEqual(1);
        expect(result.errors).toContain('invalid');
      }
    },
  );
});

describe('validatePhoneNumber', () => {
  it.each([
    '  07888888888',
    '07888 888888  ',
    '  07888 888 888  ',
    '+447888888888',
  ])(
    'should return trimmed value if supplied in correct format (%s)',
    (value) => {
      const result = validatePhoneNumber(value);

      expect(result.valid).toEqual(true);
      if ('value' in result) {
        expect(result.value).toEqual(value.trim());
      }
    },
  );

  it.each(['', undefined, '  '])(
    'should return empty error if no value is supplied (%s)',
    (value) => {
      const result = validatePhoneNumber(value);

      expect(result.valid).toEqual(false);
      if ('errors' in result) {
        expect(result.errors.length).toEqual(1);
        expect(result.errors).toContain('empty');
      }
    },
  );

  it.each(['+347888888888', 'test', '133141', '#afapjf'])(
    'should return invalid error if supplied value is in incorrect format (%s)',
    (value) => {
      const result = validatePhoneNumber(value);

      expect(result.valid).toEqual(false);
      if ('errors' in result) {
        expect(result.errors.length).toEqual(1);
        expect(result.errors).toContain('invalid');
      }
    },
  );
});

describe('validateFaxNumber', () => {
  it.each([
    '  07888888888',
    '07888 888888  ',
    '  07888 888 888  ',
    '+447888888888',
  ])(
    'should return trimmed value if supplied in correct format (%s)',
    (value) => {
      const result = validateFaxNumber(value);

      expect(result.valid).toEqual(true);
      if ('value' in result) {
        expect(result.value).toEqual(value.trim());
      }
    },
  );

  it.each(['', undefined, '  '])(
    'should return undefined if no value is supplied (%s)',
    (value) => {
      const result = validateFaxNumber(value);

      expect(result.valid).toEqual(true);
      if ('value' in result) {
        expect(result.value).toBeUndefined();
      }
    },
  );

  it.each(['+347888888888', 'test', '133141', '#afapjf'])(
    'should return invalid error if supplied value is in incorrect format (%s)',
    (value) => {
      const result = validateFaxNumber(value);

      expect(result.valid).toEqual(false);
      if ('errors' in result) {
        expect(result.errors.length).toEqual(1);
        expect(result.errors).toContain('invalid');
      }
    },
  );
});
